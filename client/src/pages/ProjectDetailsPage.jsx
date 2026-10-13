import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  UserPlus,
  X,
  Search,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ProjectModal } from '../components/projects/ProjectModal';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskCard } from '../components/tasks/TaskCard';
import { projectService, taskService, userService } from '../services/api';
import toast from 'react-hot-toast';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState('all');

  // Modals
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, isLoading: false });

  // Member Management Modal
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProject(id);
      if (res.data.success) {
        setProject(res.data.project);
      }
    } catch (err) {
      toast.error('Project not found or access denied.');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleDeleteProject = async () => {
    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted.');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project.');
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, { status: newStatus });
      toast.success('Task status updated.');
      fetchProjectDetails();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await taskService.deleteTask(task._id);
      toast.success('Task deleted.');
      fetchProjectDetails();
    } catch (err) {
      toast.error('Failed to delete task.');
    }
  };

  // Search users for member addition
  const handleSearchUsers = async (e) => {
    e.preventDefault();
    if (!memberSearchQuery.trim()) return;
    try {
      const res = await userService.searchUsers(memberSearchQuery);
      if (res.data.success) {
        setMemberSearchResults(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to search users.');
    }
  };

  const handleAddMember = async (userId) => {
    setIsAddingMember(true);
    try {
      await projectService.addMember(id, { userId, role: 'member' });
      toast.success('Member added to project.');
      setIsMemberModalOpen(false);
      setMemberSearchQuery('');
      setMemberSearchResults([]);
      fetchProjectDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await projectService.removeMember(id, userId);
      toast.success('Member removed.');
      fetchProjectDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-white border border-[#E5EAF2] rounded-lg w-28 animate-pulse" />
        <LoadingSkeleton count={4} type="card" />
      </div>
    );
  }

  if (!project) return null;

  const filteredTasks = (project.tasks || []).filter((t) => {
    if (taskFilter === 'all') return true;
    return t.status === taskFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68758B] hover:text-[#5B5FEF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </Link>
      </div>

      {/* Project Banner & Information Card */}
      <Card className="relative overflow-hidden">
        {/* Soft pastel ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: project.color || '#5B5FEF' }}
        />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="w-4 h-4 rounded-md shadow-sm"
                style={{ backgroundColor: project.color || '#5B5FEF' }}
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202B42]">{project.name}</h2>
              <Badge variant={project.status}>{project.status}</Badge>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#5B5FEF] font-semibold border border-[#E4E2FF]">
                {project.category || 'General'}
              </span>
            </div>

            <p className="text-sm text-[#68758B] leading-relaxed font-normal">
              {project.description || 'No description provided for this project.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#68758B]">
              {project.dueDate && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#3984E8]" />
                  <span>
                    Due: {new Date(project.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {project.owner && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#96A0B2]">Lead:</span>
                  <span className="text-[#202B42] font-semibold">{project.owner.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              onClick={() => setIsEditProjectOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteConfirm({ isOpen: true, isLoading: false })}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Project Progress & Metrics Bar */}
        <div className="mt-6 pt-6 border-t border-[#E5EAF2] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex justify-between text-xs text-[#68758B]">
              <span className="font-medium">Completion Rate</span>
              <span className="font-bold text-[#202B42]">
                {project.completedTasks} of {project.totalTasks} Tasks ({project.progress}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#F7F9FC] rounded-full overflow-hidden border border-[#E5EAF2]">
              <div
                className="h-full rounded-full bg-[#5B5FEF] transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Team Members Summary */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              {(project.members || []).slice(0, 4).map((m, idx) => (
                <div
                  key={idx}
                  title={m.user?.name}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#F0EFFF] text-xs font-bold text-center leading-8 uppercase text-[#5B5FEF] border border-[#E4E2FF] shadow-subtle"
                >
                  {m.user?.name ? m.user.name.slice(0, 2) : 'U'}
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={UserPlus}
              onClick={() => setIsMemberModalOpen(true)}
            >
              Members
            </Button>
          </div>
        </div>
      </Card>

      {/* Project Tasks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-[#202B42]">Project Tasks</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#5B5FEF] font-bold border border-[#E4E2FF]">
              {filteredTasks.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="bg-white border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-xs text-[#202B42] font-semibold focus:outline-none shadow-subtle cursor-pointer"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
            </select>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No tasks in this category"
            description="Create task items to assign, prioritize, and complete project deliverables."
            actionLabel="Add Task"
            onAction={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            actionIcon={Plus}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => {
                  setSelectedTask(t);
                  setIsTaskModalOpen(true);
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleTaskStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        project={project}
        onProjectSaved={fetchProjectDetails}
      />

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        defaultProjectId={project._id}
        onTaskSaved={fetchProjectDetails}
      />

      {/* Confirm Project Deletion */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, isLoading: false })}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.name}"? This will permanently delete the project and all of its tasks.`}
        isLoading={deleteConfirm.isLoading}
      />

      {/* Team Members Management Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Manage Project Members"
        subtitle="Invite colleagues to collaborate on this project."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {/* Current Members */}
          <div>
            <h4 className="text-xs font-bold text-[#68758B] uppercase tracking-wider mb-2">
              Current Members ({project.members?.length || 0})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {project.members?.map((m) => (
                <div
                  key={m.user?._id || m.user}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF2] text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-full bg-[#F0EFFF] text-[#5B5FEF] border border-[#E4E2FF] flex items-center justify-center font-bold text-[10px]">
                      {m.user?.name ? m.user.name.slice(0, 2) : 'U'}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-[#202B42] truncate">{m.user?.name}</p>
                      <p className="text-[10px] text-[#68758B] truncate">{m.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#5B5FEF] bg-[#F0EFFF] px-2 py-0.5 rounded border border-[#E4E2FF]">
                      {m.role || 'member'}
                    </span>
                    {project.owner?._id !== m.user?._id && (
                      <button
                        onClick={() => handleRemoveMember(m.user?._id)}
                        className="text-[#68758B] hover:text-[#DC5265] p-1 transition-colors"
                        title="Remove member"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Add New Member */}
          <div className="pt-4 border-t border-[#E5EAF2]">
            <h4 className="text-xs font-bold text-[#68758B] uppercase tracking-wider mb-2">
              Add New Member
            </h4>
            <form onSubmit={handleSearchUsers} className="flex gap-2 mb-3">
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Search user by name or email..."
                className="flex-1 bg-white border border-[#E5EAF2] rounded-xl px-3.5 py-2 text-xs text-[#202B42] placeholder-[#96A0B2] focus:outline-none focus:border-[#5B5FEF] shadow-subtle font-medium"
              />
              <Button type="submit" size="sm" variant="secondary" icon={Search}>
                Find
              </Button>
            </form>

            {memberSearchResults.length > 0 && (
              <div className="space-y-1.5 border border-[#E5EAF2] rounded-xl p-2 bg-white max-h-36 overflow-y-auto shadow-subtle">
                {memberSearchResults.map((u) => {
                  const isAlreadyMember = project.members?.some(
                    (m) => (m.user?._id || m.user) === u._id
                  );
                  return (
                    <div
                      key={u._id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F9FC] text-xs"
                    >
                      <div className="truncate">
                        <span className="text-[#202B42] font-semibold">{u.name}</span>
                        <span className="text-[10px] text-[#68758B] ml-2">{u.email}</span>
                      </div>
                      {isAlreadyMember ? (
                        <span className="text-[10px] text-[#96A0B2] font-medium">Already added</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddMember(u._id)}
                          isLoading={isAddingMember}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
