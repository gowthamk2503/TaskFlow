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

  // Next month leading days (to complete 35 or 42 cells)
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
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]/50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">Calendar</h2>
          <p className="text-sm text-[#94A3B8] mt-1">
            Review delivery milestones and track upcoming project commitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center bg-[#111B30] border border-[#263449] rounded-xl p-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17233B]"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-[#F8FAFC] min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17233B]"
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
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar View (3 Cols) */}
        <div className="lg:col-span-3 bg-[#111B30] border border-[#263449] rounded-2xl overflow-hidden shadow-card">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[#263449] bg-[#0F172A] text-center text-xs font-semibold text-[#94A3B8] py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#263449]/70 bg-[#0B1020]">
            {calendarDays.map((cell, idx) => {
              const dateStr = formatCellDate(cell.year, cell.month, cell.day);
              const isToday = dateStr === todayStr;
              const cellTasks = tasksByDate[dateStr] || [];

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(cell.year, cell.month, cell.day)}
                  className={`min-h-[96px] p-1.5 transition-colors cursor-pointer group flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? 'bg-[#111B30]/70 hover:bg-[#17233B]/80'
                      : 'bg-[#0B1020]/80 text-[#64748B] hover:bg-[#111B30]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday
                          ? 'bg-[#8B5CF6] text-white font-bold shadow-md shadow-purple-500/30'
                          : cell.isCurrentMonth
                          ? 'text-[#F8FAFC]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {cellTasks.length > 0 && (
                      <span className="text-[10px] text-[#22D3EE] font-bold">
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
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate border ${
                          t.status === 'completed'
                            ? 'bg-emerald-500/10 text-[#34D399] border-emerald-500/20'
                            : 'bg-[#17233B] text-[#F8FAFC] border-[#263449] hover:border-[#8B5CF6]'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {cellTasks.length > 2 && (
                      <span className="text-[9px] text-[#94A3B8] font-semibold pl-1">
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
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Unscheduled Tasks</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#17233B] text-[#94A3B8] font-bold">
                {unscheduledTasks.length}
              </span>
            </div>

            <div className="space-y-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
              {unscheduledTasks.length === 0 ? (
                <p className="text-xs text-[#64748B] italic py-4 text-center">
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
                    className="p-2.5 rounded-xl bg-[#0F172A] border border-[#263449] hover:border-[#8B5CF6] transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-[#F8FAFC] truncate">{t.title}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#94A3B8]">
                      <span>{t.project?.name || 'General'}</span>
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
        onTaskSaved={fetchTasks}
      />
    </div>
  );
};
