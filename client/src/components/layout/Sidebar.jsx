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
    <div className="flex flex-col h-full bg-white border-r border-[#E7ECF3] select-none shadow-subtle">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#E7ECF3]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#6C63FF] text-white shadow-sm flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold tracking-tight text-[#243047]">TaskFlow</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#F0EEFF] text-[#6C63FF] rounded-md border border-[#DDD8FE]">
              Pro
            </span>
          </div>
        </NavLink>
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-[#718096] hover:text-[#243047] hover:bg-[#F7F9FC] md:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
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
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#F0EEFF] text-[#6C63FF] font-semibold shadow-subtle border-r-2 border-[#6C63FF]'
                    : 'text-[#718096] hover:text-[#243047] hover:bg-[#F7F9FC]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#6C63FF]' : 'text-[#94A3B8]'
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#E7ECF3] bg-[#FAFCFF]">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to="/settings"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-[#F0EEFF] text-[#6C63FF] border border-[#DDD8FE] flex items-center justify-center text-xs font-bold uppercase shrink-0 shadow-sm">
              {user?.name ? user.name.slice(0, 2) : 'TF'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-[#243047] truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-[#718096] truncate">{user?.email || 'user@taskflow.io'}</p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl text-[#718096] hover:text-[#E45869] hover:bg-rose-50 transition-colors shrink-0"
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
          className="fixed inset-0 bg-[#243047]/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
};
