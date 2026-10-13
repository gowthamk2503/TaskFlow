import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  Clock,
  ExternalLink,
  Layers,
  Inbox,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { notificationService } from '../services/api';
import toast from 'react-hot-toast';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-[#22D3EE] font-bold border border-cyan-500/30">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-[#94A3B8] mt-1">
            Stay informed on task updates, assignments, and critical deadline alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllAsRead}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSkeleton count={4} type="card" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="All caught up!"
          description="You don't have any notifications at the moment. New assignments or mentions will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`flex items-start justify-between gap-4 transition-all ${
                !n.read ? 'border-[#8B5CF6]/50 bg-[#17233B]/40' : 'bg-[#111B30]'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  !n.read
                    ? 'bg-purple-500/20 text-[#8B5CF6] border border-purple-500/30'
                    : 'bg-[#17233B] text-[#94A3B8] border border-[#263449]'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#F8FAFC] truncate">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#22D3EE] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-[#64748B]">
                    {new Date(n.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#34D399] hover:bg-emerald-500/10 shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
