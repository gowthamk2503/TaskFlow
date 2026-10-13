import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all projects accessible by user
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
    }).sort({ updatedAt: -1 });

    const projectIds = projects.map((p) => p._id);

    // Find all tasks in these projects
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar')
      .sort({ updatedAt: -1 });

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const inReviewTasks = tasks.filter((t) => t.status === 'in_review').length;
    const todoTasks = tasks.filter((t) => t.status === 'todo').length;

    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent 4 projects with their stats
    const recentProjects = projects.slice(0, 4).map((p) => {
      const pTasks = tasks.filter(
        (t) => t.project && t.project._id.toString() === p._id.toString()
      );
      const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
      const pProgress =
        pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;

      return {
        _id: p._id,
        name: p.name,
        description: p.description,
        status: p.status,
        color: p.color,
        totalTasks: pTasks.length,
        completedTasks: pCompleted,
        progress: pProgress,
        dueDate: p.dueDate,
        updatedAt: p.updatedAt,
      };
    });

    // Upcoming deadlines: tasks due in the future, sorted by dueDate ascending
    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate && new Date(t.dueDate) >= now && t.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
      .map((t) => ({
        _id: t._id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        project: t.project,
        assignee: t.assignee,
      }));

    // Recently updated tasks
    const recentlyUpdatedTasks = tasks.slice(0, 5).map((t) => ({
      _id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      updatedAt: t.updatedAt,
      project: t.project,
      assignee: t.assignee,
    }));

    // Status breakdown chart data
    const statusDistribution = [
      { name: 'To Do', count: todoTasks, color: '#94A3B8' },
      { name: 'In Progress', count: inProgressTasks, color: '#22D3EE' },
      { name: 'In Review', count: inReviewTasks, color: '#8B5CF6' },
      { name: 'Completed', count: completedTasks, color: '#34D399' },
    ];

    // Priority breakdown
    const priorityDistribution = [
      { name: 'Low', count: tasks.filter((t) => t.priority === 'low').length, color: '#38BDF8' },
      { name: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, color: '#FBBF24' },
      { name: 'High', count: tasks.filter((t) => t.priority === 'high').length, color: '#F97316' },
      { name: 'Urgent', count: tasks.filter((t) => t.priority === 'urgent').length, color: '#FB7185' },
    ];

    // Last 7 days task completion trend
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const completedCount = tasks.filter(
        (t) =>
          t.status === 'completed' &&
          new Date(t.updatedAt) >= dayStart &&
          new Date(t.updatedAt) <= dayEnd
      ).length;

      const createdCount = tasks.filter(
        (t) =>
          new Date(t.createdAt) >= dayStart &&
          new Date(t.createdAt) <= dayEnd
      ).length;

      weeklyTrend.push({
        date: dateString,
        completed: completedCount,
        created: createdCount,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        inReviewTasks,
        todoTasks,
        overdueTasks,
        completionRate,
        recentProjects,
        upcomingDeadlines,
        recentlyUpdatedTasks,
        statusDistribution,
        priorityDistribution,
        weeklyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};
