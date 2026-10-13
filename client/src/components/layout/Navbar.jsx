import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  Calendar,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { TaskFlowLogo } from '../common/TaskFlowLogo';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/api';

const MAIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Board', path: '/board', icon: Columns3 },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
];

export const Navbar = ({ onOpenNewTask, onOpenNewProject }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const profileMenuRef = useRef(null);

  // Poll notifications count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res.data?.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        // Silently ignore if unauthenticated or network quiet
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="h-[72px] bg-white/95 backdrop-blur-md border-b border-[#E5EAF2] sticky top-0 z-30 transition-all shadow-subtle">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* ================= LEFT: Brand Logo ================= */}
          <div className="flex items-center shrink-0">
            <TaskFlowLogo size="md" to="/dashboard" />
          </div>

          {/* ================= CENTER: Horizontal Desktop Navigation ================= */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path === '/projects' && location.pathname.startsWith('/projects'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all duration-150 select-none ${
                    isActive
                      ? 'bg-[#F0EFFF] text-[#5B5FEF] font-semibold shadow-subtle'
                      : 'text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] font-medium'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#5B5FEF]' : 'text-[#96A0B2]'
                    }`}
                    strokeWidth={isActive ? 2.3 : 2}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* ================= RIGHT: Search, Notifications, New Task, User Profile ================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-48 xl:w-60">
              <Search className="w-4 h-4 text-[#96A0B2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-[#202B42] placeholder-[#96A0B2] focus:outline-none focus:bg-white focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/15 transition-all shadow-subtle font-medium"
              />
            </form>

            {/* Mobile / Tablet Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-xl text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] lg:hidden transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => navigate('/notifications')}
              className={`relative p-2.5 rounded-xl transition-colors ${
                location.pathname === '/notifications'
                  ? 'bg-[#F0EFFF] text-[#5B5FEF]'
                  : 'text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC]'
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#5B5FEF] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Primary '+ New Task' Button */}
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onOpenNewTask}
              className="hidden sm:inline-flex"
            >
              New Task
            </Button>

            {/* User Profile Avatar & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F7F9FC] transition-colors focus:outline-none"
                title="Account menu"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0EFFF] text-[#5B5FEF] border border-[#E4E2FF] flex items-center justify-center text-xs font-bold uppercase shadow-subtle shrink-0">
                  {user?.name ? user.name.slice(0, 2) : 'TF'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#96A0B2] hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5EAF2] rounded-2xl shadow-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-[#E5EAF2] bg-[#FAFCFF]/60 rounded-t-2xl">
                    <p className="text-sm font-bold text-[#202B42] truncate">
                      {user?.name || 'Workspace User'}
                    </p>
                    <p className="text-xs text-[#68758B] truncate mt-0.5 font-medium">
                      {user?.email || 'user@taskflow.io'}
                    </p>
                  </div>

                  {/* Menu options */}
                  <div className="py-1.5 px-1.5">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] rounded-xl transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-[#96A0B2]" />
                      <span>Account Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] rounded-xl transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-[#96A0B2]" />
                      <span>Workspace Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/notifications');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-[#96A0B2]" />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-[#F0EFFF] text-[#5B5FEF] px-1.5 py-0.5 rounded-full border border-[#E4E2FF]">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Logout divider */}
                  <div className="pt-1.5 border-t border-[#E5EAF2] px-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#DC5265] hover:bg-rose-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC] md:hidden transition-colors"
              title="Open Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Search Field */}
        {isMobileSearchOpen && (
          <div className="lg:hidden border-t border-[#E5EAF2] bg-white px-4 py-3 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-[#96A0B2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, projects... (Press Enter)"
                className="w-full bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl pl-9 pr-4 py-2 text-sm text-[#202B42] placeholder-[#96A0B2] focus:outline-none focus:bg-white focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/15 font-medium"
                autoFocus
              />
            </form>
          </div>
        )}
      </header>

      {/* ================= MOBILE DRAWER / SLIDEOUT ================= */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#202B42]/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 right-0 w-72 bg-white z-50 md:hidden shadow-2xl flex flex-col justify-between border-l border-[#E5EAF2] animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#E5EAF2]">
                <TaskFlowLogo size="sm" to="/dashboard" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1.5">
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#96A0B2]">
                  Navigation
                </div>
                {MAIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#F0EFFF] text-[#5B5FEF] shadow-subtle'
                          : 'text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#5B5FEF]' : 'text-[#96A0B2]'}`} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}

                <div className="pt-3 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#96A0B2] border-t border-[#E5EAF2] mt-3">
                  Quick Actions
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenNewTask();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#5B5FEF] text-white shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>

                <NavLink
                  to="/notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC]"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[#96A0B2]" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-[#F0EFFF] text-[#5B5FEF] px-2 py-0.5 rounded-full border border-[#E4E2FF]">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#68758B] hover:text-[#202B42] hover:bg-[#F7F9FC]"
                >
                  <Settings className="w-4 h-4 text-[#96A0B2]" />
                  <span>Settings</span>
                </NavLink>
              </div>
            </div>

            {/* Footer Profile & Logout */}
            <div className="p-4 border-t border-[#E5EAF2] bg-[#FAFCFF]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F0EFFF] text-[#5B5FEF] border border-[#E4E2FF] flex items-center justify-center text-xs font-bold uppercase shrink-0">
                    {user?.name ? user.name.slice(0, 2) : 'TF'}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-[#202B42] truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-[#68758B] truncate font-medium">{user?.email || 'user@taskflow.io'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-[#DC5265] hover:bg-rose-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
