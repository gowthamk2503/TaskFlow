import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

// Helper: check if user has access to project
export const checkProjectAccess = (project, userId) => {
  if (!project) return false;
  if (project.owner.toString() === userId.toString()) return true;
  return project.members.some(
    (m) => m.user && (m.user._id || m.user).toString() === userId.toString()
  );
};

// Helper: check if user is owner or project admin
export const checkProjectAdmin = (project, userId) => {
  if (!project) return false;
  if (project.owner.toString() === userId.toString()) return true;
  return project.members.some(
    (m) =>
      m.user &&
      (m.user._id || m.user).toString() === userId.toString() &&
      m.role === 'admin'
  );
};

// @desc    Get all accessible projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const { status, search, sort = '-createdAt' } = req.query;

    const query = {
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar title')
      .sort(sort);

    // Compute task counts and progress for each project
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } }).select('project status');

    const projectStats = {};
    projectIds.forEach((id) => {
      projectStats[id.toString()] = { totalTasks: 0, completedTasks: 0 };
    });

    tasks.forEach((t) => {
      const pid = t.project.toString();
      if (projectStats[pid]) {
        projectStats[pid].totalTasks += 1;
        if (t.status === 'completed') {
          projectStats[pid].completedTasks += 1;
        }
      }
    });

    const enrichedProjects = projects.map((p) => {
      const stats = projectStats[p._id.toString()] || { totalTasks: 0, completedTasks: 0 };
      const progress =
        stats.totalTasks > 0
          ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
          : 0;

      return {
        ...p.toObject(),
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        progress,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedProjects.length,
      projects: enrichedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar title')
      .populate('members.user', 'name email avatar title');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this project.',
      });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { name, description, status, color, category, startDate, dueDate, members } = req.body;

    const projectData = {
      name: name.trim(),
      description: description || '',
      status: status || 'active',
      color: color || '#8B5CF6',
      category: category || 'General',
      startDate: startDate || null,
      dueDate: dueDate || null,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    };

    if (Array.isArray(members)) {
      members.forEach((m) => {
        const memberId = m.user || m;
        if (memberId && memberId.toString() !== req.user._id.toString()) {
          projectData.members.push({
            user: memberId,
            role: m.role || 'member',
          });
        }
      });
    }

    const project = await Project.create(projectData);
    await project.populate('owner', 'name email avatar title');
    await project.populate('members.user', 'name email avatar title');

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project: {
        ...project.toObject(),
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PATCH /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (!checkProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this project.',
      });
    }

    const { name, description, status, color, category, startDate, dueDate } = req.body;

    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (color) project.color = color;
    if (category) project.category = category;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;

    await project.save();
    await project.populate('owner', 'name email avatar title');
    await project.populate('members.user', 'name email avatar title');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Only owner can delete project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete this project.',
      });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project and all associated tasks deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addProjectMember = async (req, res, next) => {
  try {
    const { email, userId, role = 'member' } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (!checkProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only project owners and admins can add members.',
      });
    }

    let targetUser;
    if (userId) {
      targetUser = await User.findById(userId);
    } else if (email) {
      targetUser = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User to add not found.',
      });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === targetUser._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'This user is already a member of the project.',
      });
    }

    project.members.push({
      user: targetUser._id,
      role,
    });

    await project.save();
    await project.populate('members.user', 'name email avatar title');

    res.status(200).json({
      success: true,
      message: `Added ${targetUser.name} to the project.`,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (!checkProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only project owners and admins can remove members.',
      });
    }

    const targetUserId = req.params.userId;
    if (project.owner.toString() === targetUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the project owner from members.',
      });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== targetUserId.toString()
    );

    await project.save();
    await project.populate('members.user', 'name email avatar title');

    res.status(200).json({
      success: true,
      message: 'Member removed from project.',
      project,
    });
  } catch (error) {
    next(error);
  }
};
