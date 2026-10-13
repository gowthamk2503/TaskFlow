import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ProjectModal } from '../projects/ProjectModal';
import { TaskModal } from '../tasks/TaskModal';

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleProjectSaved = (newProject) => {
    // If user created a project, navigate to projects page or refresh
    navigate(`/projects/${newProject._id}`);
  };

  const handleTaskSaved = () => {
    // Dispatch a custom event so child page can refresh its list
    window.dispatchEvent(new CustomEvent('taskflow:refresh-data'));
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

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
