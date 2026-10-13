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
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5EAF2]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202B42]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#5B5FEF] font-bold border border-[#E4E2FF]">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-[#68758B] mt-1 font-normal">
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
                !n.read
                  ? 'border-[#E4E2FF] bg-[#FAFCFF] shadow-sm'
                  : 'bg-white border-[#E5EAF2]'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl mt-0.5 shadow-subtle shrink-0 ${
                  !n.read
                    ? 'bg-[#F0EFFF] text-[#5B5FEF] border border-[#E4E2FF]'
                    : 'bg-[#F7F9FC] text-[#96A0B2] border border-[#E5EAF2]'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#202B42] truncate">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#5B5FEF] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#68758B] leading-relaxed font-normal">{n.message}</p>
                  <p className="text-[10px] text-[#96A0B2] font-medium">
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
                  className="p-1.5 rounded-lg text-[#68758B] hover:text-[#16A675] hover:bg-emerald-50 transition-colors shrink-0"
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
