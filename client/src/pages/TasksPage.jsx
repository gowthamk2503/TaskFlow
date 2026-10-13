import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { TaskCard } from '../components/tasks/TaskCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { taskService, projectService } from '../services/api';
import toast from 'react-hot-toast';

export const TasksPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, task: null, isLoading: false });

  const fetchProjects = async () => {
    try {
      const res = await projectService.getProjects();
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects for filter:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (projectFilter !== 'all') params.project = projectFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (isOverdueOnly) params.isOverdue = 'true';
      if (sortBy) params.sort = sortBy;

      const res = await taskService.getTasks(params);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [projectFilter, statusFilter, priorityFilter, isOverdueOnly, sortBy]);

  useEffect(() => {
    if (initialSearch !== search) {
      setSearch(initialSearch);
      fetchTasks();
    }
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, { status: newStatus });
      toast.success('Task status updated.');
      fetchTasks();
    } catch (err) {
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
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task.');
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5EAF2]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202B42]">Tasks</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#5B5FEF] font-bold border border-[#E4E2FF]">
              {tasks.length} total
            </span>
          </div>
          <p className="text-sm text-[#68758B] mt-1 font-normal">
            Track, filter, and complete assignments across all projects.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
        >
          Create Task
        </Button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 space-y-4 shadow-card">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-[#96A0B2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description... (Press Enter)"
            className="w-full bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl pl-10 pr-4 py-2 text-sm text-[#202B42] placeholder-[#96A0B2] focus:outline-none focus:bg-white focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/15 transition-all shadow-subtle font-medium"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-[#202B42] font-semibold focus:outline-none focus:border-[#5B5FEF] shadow-subtle cursor-pointer"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-[#202B42] font-semibold focus:outline-none focus:border-[#5B5FEF] shadow-subtle cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-[#202B42] font-semibold focus:outline-none focus:border-[#5B5FEF] shadow-subtle cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            {/* Overdue checkbox */}
            <label className="flex items-center gap-1.5 bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl px-3 py-1.5 cursor-pointer text-[#68758B] hover:text-[#DC5265] shadow-subtle transition-colors">
              <input
                type="checkbox"
                checked={isOverdueOnly}
                onChange={(e) => setIsOverdueOnly(e.target.checked)}
                className="rounded border-[#E5EAF2] text-[#DC5265] focus:ring-0"
              />
              <span className="flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC5265]" /> Overdue Only
              </span>
            </label>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[#96A0B2] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-[#202B42] font-semibold focus:outline-none focus:border-[#5B5FEF] shadow-subtle cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="dueDate">Due Date (Earliest)</option>
              <option value="-dueDate">Due Date (Latest)</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton count={6} type="card" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Try adjusting your filters or create a new task to get things done."
          actionLabel="Create Task"
          onAction={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => {
                setSelectedTask(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={(t) => setDeleteConfirm({ isOpen: true, task: t, isLoading: false })}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        onTaskSaved={fetchTasks}
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
