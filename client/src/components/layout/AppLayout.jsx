import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ProjectModal } from '../projects/ProjectModal';
import { TaskModal } from '../tasks/TaskModal';

export const AppLayout = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleProjectSaved = (newProject) => {
    navigate(`/projects/${newProject._id}`);
  };

  const handleTaskSaved = () => {
    window.dispatchEvent(new CustomEvent('taskflow:refresh-data'));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#202B42] flex flex-col font-sans">
      {/* Top Horizontal Navigation Bar */}
      <Navbar
        onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
      />

      {/* Main Content Area - Full width with centered max-w-7xl container and generous responsive padding */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-all">
        <Outlet />
      </main>

      {/* Global Quick Action Modals */}
      <ProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectSaved={handleProjectSaved}
      />

      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};
