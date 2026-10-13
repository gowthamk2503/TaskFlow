import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Kanban Board', path: '/board', icon: Columns3 },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0F172A] border-r border-[#263449] select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#263449]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] text-white shadow-lg shadow-purple-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">TaskFlow</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-purple-500/20 text-[#8B5CF6] rounded">Pro</span>
          </div>
        </NavLink>
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-transparent text-[#F8FAFC] border-l-2 border-[#8B5CF6] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17233B]/70'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-[#8B5CF6]" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#263449] bg-[#0B1020]/40">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to="/settings"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white text-xs font-bold uppercase shrink-0 shadow-md">
              {user?.name ? user.name.slice(0, 2) : 'TF'}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-[#F8FAFC] truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-[#64748B] truncate">{user?.email || 'user@taskflow.io'}</p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#FB7185] hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0B1020]/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
};
