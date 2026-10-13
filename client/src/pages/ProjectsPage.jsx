import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ProjectModal } from '../components/projects/ProjectModal';
import { projectService } from '../services/api';
import toast from 'react-hot-toast';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, project: null, isLoading: false });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      if (sortBy) params.sort = sortBy;

      const res = await projectService.getProjects(params);
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleOpenEdit = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialog({ isOpen: true, project, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.project) return;
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await projectService.deleteProject(deleteDialog.project._id);
      toast.success('Project and associated tasks deleted.');
      setDeleteDialog({ isOpen: false, project: null, isLoading: false });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project.');
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5EAF2]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202B42]">Projects</h2>
          <p className="text-sm text-[#68758B] mt-1 font-normal">
            Manage your workspace initiatives, roadmaps, and progress milestones.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
        >
          New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#96A0B2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full bg-white border border-[#E5EAF2] rounded-xl pl-10 pr-4 py-2 text-sm text-[#202B42] placeholder-[#96A0B2] focus:outline-none focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/15 shadow-subtle font-medium"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-2 bg-white border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-xs text-[#68758B] shadow-subtle">
            <Filter className="w-3.5 h-3.5 text-[#96A0B2]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#202B42] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-white border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-xs text-[#68758B] shadow-subtle">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#202B42] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Alphabetical</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} type="card" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create a project to start planning sprints, grouping tasks, and tracking metrics."
          actionLabel="Create Project"
          onAction={() => {
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="group block"
            >
              <Card hoverEffect className="h-full flex flex-col justify-between">
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-3.5 h-3.5 rounded-md shrink-0 shadow-sm"
                        style={{ backgroundColor: project.color || '#5B5FEF' }}
                      />
                      <h3 className="text-base font-semibold text-[#202B42] group-hover:text-[#5B5FEF] transition-colors truncate">
                        {project.name}
                      </h3>
                    </div>
                    <Badge variant={project.status} size="sm">
                      {project.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#68758B] line-clamp-2 mb-4 min-h-[2rem] leading-relaxed font-normal">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress bar and details */}
                <div className="space-y-4 pt-3.5 border-t border-[#E5EAF2]">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#68758B]">
                      <span className="font-medium">{project.completedTasks} / {project.totalTasks} Tasks</span>
                      <span className="font-bold text-[#202B42]">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F7F9FC] rounded-full overflow-hidden border border-[#E5EAF2]">
                      <div
                        className="h-full rounded-full bg-[#5B5FEF] transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom metadata & Quick buttons */}
                  <div className="flex items-center justify-between text-xs text-[#68758B] pt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#96A0B2]" />
                      <span>
                        {project.dueDate
                          ? new Date(project.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'No due date'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(project, e)}
                        className="p-1.5 rounded-lg text-[#68758B] hover:text-[#5B5FEF] hover:bg-[#F0EFFF] transition-colors"
                        title="Edit project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleOpenDelete(project, e)}
                        className="p-1.5 rounded-lg text-[#68758B] hover:text-[#DC5265] hover:bg-rose-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Project Create / Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onProjectSaved={fetchProjects}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, project: null, isLoading: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteDialog.project?.name}"? All associated tasks will also be permanently deleted.`}
        isLoading={deleteDialog.isLoading}
      />
    </div>
  );
};
