import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { taskService, projectService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Send, Trash2, Calendar, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

export const TaskModal = ({
  isOpen,
  onClose,
  onTaskSaved,
  task = null,
  defaultProjectId = null,
  defaultStatus = 'todo',
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: defaultProjectId || '',
    status: defaultStatus || 'todo',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: '',
  });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getProjects();
        if (res.data.success) {
          setProjects(res.data.projects);
          if (!formData.project && res.data.projects.length > 0) {
            setFormData((prev) => ({
              ...prev,
              project: defaultProjectId || res.data.projects[0]._id,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load projects for task modal:', err);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, defaultProjectId]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        project: task.project?._id || task.project || defaultProjectId || '',
        status: task.status || defaultStatus,
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignee: task.assignee?._id || task.assignee || '',
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
      });
      setComments(task.comments || []);
    } else {
      setFormData({
        title: '',
        description: '',
        project: defaultProjectId || (projects.length > 0 ? projects[0]._id : ''),
        status: defaultStatus,
        priority: 'medium',
        dueDate: '',
        assignee: '',
        tags: '',
      });
      setComments([]);
    }
    setErrors({});
  }, [task, isOpen, defaultProjectId, defaultStatus, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }
    if (!formData.project) {
      setErrors({ project: 'Please select a project' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        dueDate: formData.dueDate || null,
        assignee: formData.assignee || null,
      };

      let res;
      if (task?._id) {
        res = await taskService.updateTask(task._id, payload);
        toast.success('Task updated successfully.');
      } else {
        res = await taskService.createTask(payload);
        toast.success('Task created successfully.');
      }
      onTaskSaved(res.data.task);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !task?._id) return;

    setIsAddingComment(true);
    try {
      const res = await taskService.addComment(task._id, { text: commentText });
      if (res.data.success) {
        setComments(res.data.comments);
        setCommentText('');
        toast.success('Comment added.');
      }
    } catch (err) {
      toast.error('Failed to post comment.');
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!task?._id) return;
    try {
      const res = await taskService.deleteComment(task._id, commentId);
      if (res.data.success) {
        setComments(res.data.comments);
        toast.success('Comment removed.');
      }
    } catch (err) {
      toast.error('Failed to remove comment.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Task Details & Edit' : 'Create New Task'}
      subtitle="Define actionable work items and assign deadlines."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement OAuth2 Refresh Token Strategy"
          required
          error={errors.title}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94A3B8]">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add detailed acceptance criteria, context, or notes..."
            className="w-full rounded-lg bg-[#0F172A] border border-[#263449] text-[#F8FAFC] placeholder-[#64748B] text-sm p-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">
              Project <span className="text-[#FB7185]">*</span>
            </label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className={`w-full rounded-lg bg-[#0F172A] border ${
                errors.project ? 'border-[#FB7185]' : 'border-[#263449]'
              } text-[#F8FAFC] text-sm p-2.5 focus:outline-none focus:border-[#8B5CF6]`}
            >
              <option value="" disabled>Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.project && <p className="text-xs text-[#FB7185]">{errors.project}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#0F172A] border border-[#263449] text-[#F8FAFC] text-sm p-2.5 focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#0F172A] border border-[#263449] text-[#F8FAFC] text-sm p-2.5 focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Tags (Comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="frontend, api, bugfix, security"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[#263449]">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>

      {/* Task Comments Section (Available when viewing existing task) */}
      {task?._id && (
        <div className="mt-6 pt-6 border-t border-[#263449]">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
            <h4 className="text-sm font-semibold text-[#F8FAFC]">Discussion & Notes ({comments.length})</h4>
          </div>

          {/* Comments list */}
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-[#64748B] italic">No comments yet. Start the conversation!</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-[#0F172A] border border-[#263449] rounded-xl p-3 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#8B5CF6]">
                      {c.user?.name || 'Collaborator'}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      {(c.user?._id === user?._id || c.user === user?._id) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c._id)}
                          className="text-[#FB7185] hover:opacity-80 p-0.5"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#F8FAFC] whitespace-pre-wrap">{c.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add comment box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a message or update..."
              className="flex-1 bg-[#0F172A] border border-[#263449] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              icon={Send}
              onClick={handleAddComment}
              isLoading={isAddingComment}
              disabled={!commentText.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
