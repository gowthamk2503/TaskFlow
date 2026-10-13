import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { notificationService } from '../../services/api';

export const Navbar = ({ onOpenMobileMenu, onOpenNewProject, onOpenNewTask }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res.data.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        // Silently fail if not logged in or backend booting
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Determine current section title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview & Analytics';
    if (path.startsWith('/projects/')) return 'Project Workspace';
    if (path === '/projects') return 'Projects';
    if (path === '/tasks') return 'All Tasks';
    if (path === '/board') return 'Kanban Board';
    if (path === '/calendar') return 'Schedule & Deadlines';
    if (path === '/notifications') return 'Notifications';
    if (path === '/settings') return 'Account Settings';
    return 'TaskFlow';
  };

  return (
    <header className="h-16 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#263449] sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17233B] md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-[#F8FAFC] tracking-tight hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, projects, tags... (Press Enter)"
            className="w-full bg-[#111B30] border border-[#263449] rounded-xl pl-9 pr-4 py-1.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Task Action */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenNewTask}
          className="hidden lg:inline-flex"
        >
          New Task
        </Button>

        {/* Quick Project Action */}
        <Button
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={onOpenNewProject}
          className="hidden sm:inline-flex"
        >
          New Project
        </Button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17233B] transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#22D3EE] rounded-full ring-2 ring-[#0B1020] animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
