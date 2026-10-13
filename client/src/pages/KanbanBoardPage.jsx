import React, { useState, useEffect } from 'react';
import {
  Columns3,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { taskService, projectService } from '../services/api';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo', title: 'To Do', accent: '#94A3B8', bg: 'bg-slate-500/10' },
  { id: 'in_progress', title: 'In Progress', accent: '#22D3EE', bg: 'bg-cyan-500/10' },
  { id: 'in_review', title: 'In Review', accent: '#8B5CF6', bg: 'bg-purple-500/10' },
  { id: 'completed', title: 'Completed', accent: '#34D399', bg: 'bg-emerald-500/10' },
];

export const KanbanBoardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [loading, setLoading] = useState(true);

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropZone, setActiveDropZone] = useState(null);

  // Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [targetColumnForNewTask, setTargetColumnForNewTask] = useState('todo');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, task: null, isLoading: false });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes] = await Promise.all([
        projectService.getProjects(),
        taskService.getTasks(selectedProject !== 'all' ? { project: selectedProject } : {}),
      ]);

      if (projRes.data.success) setProjects(projRes.data.projects);
      if (tasksRes.data.success) setTasks(tasksRes.data.tasks);
    } catch (err) {
      console.error('Failed to load Kanban data:', err);
      toast.error('Failed to load tasks for board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  // Handle HTML5 Drag and Drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeDropZone !== columnId) {
      setActiveDropZone(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (activeDropZone === columnId) {
      setActiveDropZone(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveDropZone(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === targetStatus) return;

    const previousStatus = task.status;

    // Optimistically update UI
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await taskService.updateTaskStatus(taskId, { status: targetStatus });
      toast.success(`Moved to ${COLUMNS.find((c) => c.id === targetStatus)?.title}`);
    } catch (err) {
      // Revert upon failure
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: previousStatus } : t))
      );
      toast.error('Failed to update task status.');
    } finally {
      setDraggedTaskId(null);
    }
  };

  // Fallback status updater (for dropdown or click)
  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;
    const previousStatus = task.status;

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTaskStatus(taskId, { status: newStatus });
      toast.success('Status updated.');
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: previousStatus } : t))
      );
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteConfirm.task) return;
    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      await taskService.deleteTask(deleteConfirm.task._id);
      toast.success('Task deleted.');
      setDeleteConfirm({ isOpen: false, task: null, isLoading: false });
      fetchData();
    } catch (err) {
      toast.error('Failed to delete task.');
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]/50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">Kanban Board</h2>
          <p className="text-sm text-[#94A3B8] mt-1">
            Drag and drop tasks between lanes to transition delivery states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2 bg-[#111B30] border border-[#263449] rounded-xl px-3 py-1.5 text-xs text-[#94A3B8]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-[#F8FAFC] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111B30]">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id} className="bg-[#111B30]">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            size="sm"
            onClick={() => {
              setSelectedTask(null);
              setTargetColumnForNewTask('todo');
              setIsTaskModalOpen(true);
            }}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Board Columns Container */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LoadingSkeleton count={4} type="card" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 overflow-x-auto min-w-[700px] lg:min-w-0">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            const isTargeted = activeDropZone === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`bg-[#0F172A] border rounded-2xl p-4 flex flex-col transition-all duration-200 min-h-[550px] ${
                  isTargeted
                    ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 bg-[#17233B]/80'
                    : 'border-[#263449]'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#263449]/70">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.accent }}
                    />
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">{col.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#17233B] text-[#94A3B8] font-bold">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setTargetColumnForNewTask(col.id);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17233B]"
                    title={`Add task to ${col.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Task Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {columnTasks.length === 0 ? (
                    <div className="h-36 flex flex-col items-center justify-center border border-dashed border-[#263449]/70 rounded-xl text-center p-4">
                      <p className="text-xs text-[#64748B]">No tasks in this lane</p>
                      <button
                        onClick={() => {
                          setSelectedTask(null);
                          setTargetColumnForNewTask(col.id);
                          setIsTaskModalOpen(true);
                        }}
                        className="text-xs text-[#8B5CF6] hover:underline mt-1 font-medium"
                      >
                        + Add a task
                      </button>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task._id)}
                        onEdit={(t) => {
                          setSelectedTask(t);
                          setIsTaskModalOpen(true);
                        }}
                        onDelete={(t) => setDeleteConfirm({ isOpen: true, task: t, isLoading: false })}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        defaultStatus={targetColumnForNewTask}
        defaultProjectId={selectedProject !== 'all' ? selectedProject : null}
        onTaskSaved={fetchData}
      />

      {/* Confirm Task Deletion */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, task: null, isLoading: false })}
        onConfirm={handleDeleteTask}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deleteConfirm.task?.title}"?`}
        isLoading={deleteConfirm.isLoading}
      />
    </div>
  );
};
