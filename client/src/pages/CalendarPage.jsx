import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { TaskModal } from '../components/tasks/TaskModal';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDueDate, setSelectedDueDate] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks();
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to load tasks for calendar:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Grid calculation: days in current month & starting day offset
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month,
      year,
      isCurrentMonth: true,
    });
  }

  // Next month leading days (to complete 42 cells)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  // Helper to format Date string as YYYY-MM-DD
  const formatCellDate = (cellYear, cellMonth, cellDay) => {
    const m = String(cellMonth + 1).padStart(2, '0');
    const d = String(cellDay).padStart(2, '0');
    return `${cellYear}-${m}-${d}`;
  };

  // Group tasks by dueDate (YYYY-MM-DD)
  const tasksByDate = {};
  const unscheduledTasks = [];

  tasks.forEach((t) => {
    if (t.dueDate) {
      const dateKey = t.dueDate.split('T')[0];
      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
      tasksByDate[dateKey].push(t);
    } else {
      unscheduledTasks.push(t);
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCellClick = (cellYear, cellMonth, cellDay) => {
    const formatted = formatCellDate(cellYear, cellMonth, cellDay);
    setSelectedDueDate(formatted);
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5EAF2]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202B42]">Calendar</h2>
          <p className="text-sm text-[#68758B] mt-1 font-normal">
            Review delivery milestones and track upcoming project commitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center bg-white border border-[#E5EAF2] rounded-xl p-1 shadow-subtle">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-[#202B42] min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setSelectedDueDate('');
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
          >
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar View (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-card">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[#E5EAF2] bg-[#FAFCFF] text-center text-xs font-bold text-[#68758B] py-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E5EAF2] bg-white">
            {calendarDays.map((cell, idx) => {
              const dateStr = formatCellDate(cell.year, cell.month, cell.day);
              const isToday = dateStr === todayStr;
              const cellTasks = tasksByDate[dateStr] || [];

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(cell.year, cell.month, cell.day)}
                  className={`min-h-[105px] p-2 transition-all cursor-pointer group flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? 'bg-white hover:bg-[#F7F9FC]'
                      : 'bg-[#FAFCFF] text-[#96A0B2] hover:bg-[#F4F6FB]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center transition-all ${
                        isToday
                          ? 'bg-[#5B5FEF] text-white shadow-sm'
                          : cell.isCurrentMonth
                          ? 'text-[#202B42] group-hover:bg-[#F0EFFF] group-hover:text-[#5B5FEF]'
                          : 'text-[#96A0B2]'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {cellTasks.length > 0 && (
                      <span className="text-[10px] text-[#5B5FEF] font-bold bg-[#F0EFFF] px-1.5 py-0.5 rounded-full border border-[#E4E2FF]">
                        {cellTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Pills */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cellTasks.slice(0, 2).map((t) => (
                      <div
                        key={t._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(t);
                          setIsTaskModalOpen(true);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md truncate border shadow-subtle ${
                          t.status === 'completed'
                            ? 'bg-[#E5F7EE] text-[#16A675] border-[#B8F0D3]'
                            : 'bg-[#F0EFFF] text-[#5B5FEF] border-[#E4E2FF] hover:border-[#5B5FEF]'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {cellTasks.length > 2 && (
                      <span className="text-[9px] text-[#68758B] font-bold pl-1">
                        +{cellTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Unscheduled & Upcoming (1 Col) */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-sm font-bold text-[#202B42]">Unscheduled Tasks</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0EFFF] text-[#5B5FEF] font-bold border border-[#E4E2FF]">
                {unscheduledTasks.length}
              </span>
            </div>

            <div className="space-y-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
              {unscheduledTasks.length === 0 ? (
                <p className="text-xs text-[#68758B] italic py-4 text-center">
                  All tasks have scheduled deadlines!
                </p>
              ) : (
                unscheduledTasks.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => {
                      setSelectedTask(t);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF2] hover:border-[#5B5FEF]/40 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-[#202B42] truncate">{t.title}</p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-[#68758B]">
                      <span className="font-semibold text-[#5B5FEF]">{t.project?.name || 'General'}</span>
                      <Badge variant={t.priority} size="sm">
                        {t.priority}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        defaultDueDate={selectedDueDate}
        onTaskSaved={fetchTasks}
      />
    </div>
  );
};
