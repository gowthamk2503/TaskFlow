import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ProjectModal } from '../components/projects/ProjectModal';
import { TaskModal } from '../components/tasks/TaskModal';
import { dashboardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const handleRefresh = () => fetchStats();
    window.addEventListener('taskflow:refresh-data', handleRefresh);
    return () => window.removeEventListener('taskflow:refresh-data', handleRefresh);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-[#17233B] rounded-lg w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton count={4} type="card" />
        </div>
      </div>
    );
  }

  const {
    totalProjects = 0,
    totalTasks = 0,
    completedTasks = 0,
    inProgressTasks = 0,
    overdueTasks = 0,
    completionRate = 0,
    recentProjects = [],
    upcomingDeadlines = [],
    recentlyUpdatedTasks = [],
    statusDistribution = [],
    weeklyTrend = [],
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Welcome & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]/50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Welcome back, <span className="aurora-gradient-text">{user?.name || 'Developer'}</span>!
          </h2>
          <p className="text-sm text-[#94A3B8] mt-1">
            Here is your real-time productivity metrics and delivery status overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            New Project
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-[#8B5CF6] border border-purple-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
              Total Projects
            </p>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mt-0.5">{totalProjects}</h3>
          </div>
        </Card>

        {/* Tasks Completed */}
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-[#34D399] border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                Completed
              </p>
              <span className="text-xs font-bold text-[#34D399]">{completionRate}%</span>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mt-0.5">
              {completedTasks} <span className="text-xs text-[#94A3B8] font-normal">/ {totalTasks}</span>
            </h3>
          </div>
        </Card>

        {/* Tasks In Progress */}
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-[#22D3EE] border border-cyan-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
              In Progress
            </p>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mt-0.5">{inProgressTasks}</h3>
          </div>
        </Card>

        {/* Overdue Tasks */}
        <Card className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${overdueTasks > 0 ? 'bg-rose-500/10 text-[#FB7185] border border-rose-500/20' : 'bg-[#17233B] text-[#94A3B8] border border-[#263449]'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
              Overdue Tasks
            </p>
            <h3 className={`text-2xl font-bold mt-0.5 ${overdueTasks > 0 ? 'text-[#FB7185]' : 'text-[#F8FAFC]'}`}>
              {overdueTasks}
            </h3>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Row: Distribution Donut & Weekly Productivity Bar */}
      {totalTasks > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <Card className="lg:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Task Distribution</h3>
              <span className="text-xs text-[#94A3B8]">By Status</span>
            </div>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111B30',
                      borderColor: '#263449',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#263449]/50 text-xs">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#94A3B8]">{item.name}:</span>
                  <span className="font-semibold text-[#F8FAFC]">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 7-Day Completion Velocity Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">Weekly Velocity Trend</h3>
                <p className="text-xs text-[#94A3B8]">Tasks created vs completed over past 7 days</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-[#34D399]">
                  <span className="w-2.5 h-2.5 rounded bg-[#34D399]" /> Completed
                </span>
                <span className="flex items-center gap-1.5 text-[#8B5CF6]">
                  <span className="w-2.5 h-2.5 rounded bg-[#8B5CF6]" /> Created
                </span>
              </div>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263449" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111B30',
                      borderColor: '#263449',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="completed" fill="#34D399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="created" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No tasks recorded yet"
          description="Create your first task or project to generate live delivery analytics and charts."
          actionLabel="Create First Task"
          onAction={() => setIsNewTaskModalOpen(true)}
          actionIcon={Plus}
        />
      )}

      {/* Two Columns: Recent Projects & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F8FAFC]">Active Projects</h3>
            <Link
              to="/projects"
              className="text-xs text-[#8B5CF6] hover:text-[#22D3EE] font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-xs text-[#64748B] italic py-6 text-center">No projects created yet.</p>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((proj) => (
                <Link
                  key={proj._id}
                  to={`/projects/${proj._id}`}
                  className="block p-3.5 rounded-xl bg-[#0F172A] border border-[#263449] hover:border-[#8B5CF6]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: proj.color || '#8B5CF6' }}
                      />
                      <h4 className="text-sm font-semibold text-[#F8FAFC]">{proj.name}</h4>
                    </div>
                    <Badge variant={proj.status} size="sm">
                      {proj.status}
                    </Badge>
                  </div>
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>{proj.completedTasks} / {proj.totalTasks} Tasks</span>
                      <span className="font-semibold text-[#F8FAFC]">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#17233B] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] transition-all duration-300"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F8FAFC]">Upcoming Deadlines</h3>
            <Link
              to="/calendar"
              className="text-xs text-[#8B5CF6] hover:text-[#22D3EE] font-medium flex items-center gap-1"
            >
              Calendar View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-xs text-[#64748B] italic py-6 text-center">No upcoming deadlines found.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0F172A] border border-[#263449]"
                >
                  <div className="min-w-0 pr-3">
                    <h5 className="text-sm font-medium text-[#F8FAFC] truncate">{task.title}</h5>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#94A3B8]">
                      {task.project && (
                        <span className="text-[#8B5CF6] font-medium">{task.project.name}</span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#22D3EE]">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={task.priority} size="sm">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modals for Quick Actions on Dashboard */}
      <ProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectSaved={fetchStats}
      />

      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onTaskSaved={fetchStats}
      />
    </div>
  );
};
