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
  Sparkles,
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
        <div className="h-10 bg-white border border-[#E5EAF2] rounded-xl w-1/4 animate-pulse"></div>
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
    statusDistribution = [],
    weeklyTrend = [],
  } = stats || {};

  // Color mapping for pie chart
  const statusColorMap = {
    'To Do': '#96A0B2',
    'In Progress': '#3984E8',
    'In Review': '#5B5FEF',
    'Completed': '#16A675',
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5EAF2]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202B42]">
            Good morning, <span className="text-[#5B5FEF]">{user?.name ? user.name.split(' ')[0] : 'there'}</span>! Ready to get things done?
          </h2>
          <p className="text-sm text-[#68758B] mt-1.5 font-normal">
            Here is your workspace productivity metrics and active project delivery status.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            Create Task
          </Button>
        </div>
      </div>

      {/* 4 Clean Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="flex items-center gap-4 hover:shadow-card-hover transition-all">
          <div className="p-3.5 rounded-2xl bg-[#F0EFFF] text-[#5B5FEF] border border-[#E4E2FF] shadow-subtle shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#68758B] uppercase tracking-wider">
              Total Projects
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202B42] mt-0.5">{totalProjects}</h3>
          </div>
        </Card>

        {/* Tasks Completed */}
        <Card className="flex items-center gap-4 hover:shadow-card-hover transition-all">
          <div className="p-3.5 rounded-2xl bg-[#E5F7EE] text-[#16A675] border border-[#B8F0D3] shadow-subtle shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#68758B] uppercase tracking-wider">
                Completed
              </p>
              <span className="text-xs font-bold text-[#16A675] bg-[#E5F7EE] px-2 py-0.5 rounded-full border border-[#B8F0D3]">
                {completionRate}%
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202B42] mt-0.5">
              {completedTasks} <span className="text-xs text-[#96A0B2] font-normal">/ {totalTasks}</span>
            </h3>
          </div>
        </Card>

        {/* In Progress */}
        <Card className="flex items-center gap-4 hover:shadow-card-hover transition-all">
          <div className="p-3.5 rounded-2xl bg-[#EAF2FF] text-[#3984E8] border border-[#BFDBFE] shadow-subtle shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#68758B] uppercase tracking-wider">
              In Progress
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#202B42] mt-0.5">{inProgressTasks}</h3>
          </div>
        </Card>

        {/* Overdue Tasks */}
        <Card className="flex items-center gap-4 hover:shadow-card-hover transition-all">
          <div className={`p-3.5 rounded-2xl shrink-0 ${
            overdueTasks > 0
              ? 'bg-rose-50 text-[#DC5265] border border-rose-200 shadow-subtle'
              : 'bg-[#FFF1E5] text-[#D99118] border border-[#FFE3CC] shadow-subtle'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#68758B] uppercase tracking-wider">
              Overdue Tasks
            </p>
            <h3 className={`text-2xl sm:text-3xl font-bold mt-0.5 ${overdueTasks > 0 ? 'text-[#DC5265]' : 'text-[#202B42]'}`}>
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
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-base font-semibold text-[#202B42]">Task Distribution</h3>
                <p className="text-xs text-[#68758B]">Current workflow stages</p>
              </div>
              <span className="text-xs font-semibold text-[#5B5FEF] bg-[#F0EFFF] px-2.5 py-1 rounded-full border border-[#E4E2FF]">
                {totalTasks} total
              </span>
            </div>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {statusDistribution.map((entry, index) => {
                      const color = statusColorMap[entry.name] || entry.color || '#5B5FEF';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5EAF2',
                      borderRadius: '12px',
                      color: '#202B42',
                      fontSize: '12px',
                      fontWeight: 500,
                      boxShadow: '0 8px 24px rgba(32, 43, 66, 0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#E5EAF2] text-xs">
              {statusDistribution.map((item) => {
                const color = statusColorMap[item.name] || item.color || '#5B5FEF';
                return (
                  <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-[#F7F9FC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[#68758B] font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#202B42]">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 7-Day Completion Velocity Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-base font-semibold text-[#202B42]">Productivity Velocity</h3>
                <p className="text-xs text-[#68758B]">Tasks created vs completed over past 7 days</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-[#16A675]">
                  <span className="w-2.5 h-2.5 rounded bg-[#16A675]" /> Completed
                </span>
                <span className="flex items-center gap-1.5 text-[#5B5FEF]">
                  <span className="w-2.5 h-2.5 rounded bg-[#5B5FEF]" /> Created
                </span>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" vertical={false} />
                  <XAxis dataKey="date" stroke="#96A0B2" fontSize={11} tickLine={false} />
                  <YAxis stroke="#96A0B2" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5EAF2',
                      borderRadius: '12px',
                      color: '#202B42',
                      fontSize: '12px',
                      fontWeight: 500,
                      boxShadow: '0 8px 24px rgba(32, 43, 66, 0.08)',
                    }}
                  />
                  <Bar dataKey="completed" fill="#16A675" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="created" fill="#5B5FEF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No tasks recorded yet"
          description="Create your first task or project to generate live delivery analytics and productivity charts."
          actionLabel="Create First Task"
          onAction={() => setIsNewTaskModalOpen(true)}
          actionIcon={Plus}
        />
      )}

      {/* Two Columns: Recent Projects & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAF2]">
            <div>
              <h3 className="text-base font-semibold text-[#202B42]">Active Projects</h3>
              <p className="text-xs text-[#68758B]">Recent initiatives and completion milestones</p>
            </div>
            <Link
              to="/projects"
              className="text-xs text-[#5B5FEF] hover:text-[#484BD1] font-semibold flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-xs text-[#68758B] italic py-6 text-center">No projects created yet.</p>
          ) : (
            <div className="space-y-3.5">
              {recentProjects.map((proj) => (
                <Link
                  key={proj._id}
                  to={`/projects/${proj._id}`}
                  className="block p-4 rounded-xl bg-[#F7F9FC] border border-[#E5EAF2] hover:border-[#5B5FEF]/40 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: proj.color || '#5B5FEF' }}
                      />
                      <h4 className="text-sm font-semibold text-[#202B42]">{proj.name}</h4>
                    </div>
                    <Badge variant={proj.status} size="sm">
                      {proj.status}
                    </Badge>
                  </div>
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#68758B] font-medium">
                      <span>{proj.completedTasks} / {proj.totalTasks} Tasks</span>
                      <span className="font-bold text-[#202B42]">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5EAF2] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#5B5FEF] transition-all duration-300"
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
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAF2]">
            <div>
              <h3 className="text-base font-semibold text-[#202B42]">Upcoming Deadlines</h3>
              <p className="text-xs text-[#68758B]">Time-sensitive deliverables and targets</p>
            </div>
            <Link
              to="/calendar"
              className="text-xs text-[#5B5FEF] hover:text-[#484BD1] font-semibold flex items-center gap-1"
            >
              Calendar View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-xs text-[#68758B] italic py-6 text-center">No upcoming deadlines found.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF2] hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 pr-3">
                    <h5 className="text-sm font-semibold text-[#202B42] truncate">{task.title}</h5>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#68758B]">
                      {task.project && (
                        <span className="text-[#5B5FEF] font-semibold">{task.project.name}</span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#3984E8] font-medium">
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
