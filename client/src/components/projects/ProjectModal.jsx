import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { projectService } from '../../services/api';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#8B5CF6', // Violet
  '#22D3EE', // Cyan
  '#34D399', // Emerald
  '#FBBF24', // Amber
  '#FB7185', // Rose
  '#6366F1', // Indigo
  '#EC4899', // Pink
];

export const ProjectModal = ({ isOpen, onClose, onProjectSaved, project = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    category: 'General',
    color: '#8B5CF6',
    startDate: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        category: project.category || 'General',
        color: project.color || '#8B5CF6',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        category: 'General',
        color: '#8B5CF6',
        startDate: '',
        dueDate: '',
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Project name is required' });
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (project?._id) {
        res = await projectService.updateProject(project._id, formData);
        toast.success('Project updated successfully.');
      } else {
        res = await projectService.createProject(formData);
        toast.success('Project created successfully.');
      }
      onProjectSaved(res.data.project);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save project.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      subtitle="Organize your team goals, milestones, and deliverable timelines."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Next-Gen Design System"
          required
          error={errors.name}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94A3B8]">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline goals, architecture, or scope..."
            className="w-full rounded-lg bg-[#0F172A] border border-[#263449] text-[#F8FAFC] placeholder-[#64748B] text-sm p-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#0F172A] border border-[#263449] text-[#F8FAFC] text-sm p-2.5 focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Engineering, Marketing"
          />
        </div>

        {/* Color Palette Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94A3B8]">Theme Accent</label>
          <div className="flex items-center gap-2 pt-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  formData.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111B30] scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />

          <Input
            label="Target Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#263449]">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {project ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
