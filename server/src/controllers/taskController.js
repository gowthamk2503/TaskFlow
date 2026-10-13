import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { Notification } from '../models/Notification.js';
import { checkProjectAccess } from './projectController.js';

// @desc    Get all accessible tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const {
      project,
      status,
      priority,
      assignee,
      search,
      isOverdue,
      sort = '-createdAt',
    } = req.query;

    // First find all projects user has access to
    const accessibleProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).select('_id');

    const projectIds = accessibleProjects.map((p) => p._id);

    const query = {
      project: { $in: projectIds },
    };

    if (project && project !== 'all') {
      // Ensure requested project is in accessible list
      if (!projectIds.some((id) => id.toString() === project.toString())) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this project.',
        });
      }
      query.project = project;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (assignee && assignee !== 'all') {
      if (assignee === 'unassigned') {
        query.assignee = null;
      } else if (assignee === 'me') {
        query.assignee = req.user._id;
      } else {
        query.assignee = assignee;
      }
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    if (isOverdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'completed' };
    }

    const tasks = await Task.find(query)
      .populate('project', 'name color status')
      .populate('assignee', 'name email avatar title')
      .populate('creator', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color status owner members')
      .populate('assignee', 'name email avatar title')
      .populate('creator', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const project = await Project.findById(task.project._id);
    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this task.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      project: projectId,
      assignee,
      status,
      priority,
      dueDate,
      tags,
    } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Associated project not found.',
      });
    }

    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add tasks to this project.',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      project: projectId,
      creator: req.user._id,
      assignee: assignee || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
    });

    await task.populate('project', 'name color status');
    await task.populate('assignee', 'name email avatar title');
    await task.populate('creator', 'name email avatar');

    // Send notification if assigned to another user
    if (assignee && assignee.toString() !== req.user._id.toString()) {
      try {
        await Notification.create({
          recipient: assignee,
          sender: req.user._id,
          title: 'Task Assigned',
          message: `${req.user.name} assigned you to task: "${task.title}"`,
          type: 'task_assigned',
          link: `/tasks?selected=${task._id}`,
        });
      } catch (err) {
        console.error('Failed to create assignment notification:', err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PATCH /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const project = await Project.findById(task.project);
    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this task.',
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      tags,
      order,
    } = req.body;

    const previousAssignee = task.assignee?.toString();

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (tags !== undefined) task.tags = tags;
    if (order !== undefined) task.order = order;

    await task.save();
    await task.populate('project', 'name color status');
    await task.populate('assignee', 'name email avatar title');
    await task.populate('creator', 'name email avatar');
    await task.populate('comments.user', 'name email avatar');

    // Notify new assignee if changed
    if (
      assignee &&
      assignee !== previousAssignee &&
      assignee.toString() !== req.user._id.toString()
    ) {
      try {
        await Notification.create({
          recipient: assignee,
          sender: req.user._id,
          title: 'Task Assigned',
          message: `${req.user.name} assigned you to task: "${task.title}"`,
          type: 'task_assigned',
          link: `/tasks?selected=${task._id}`,
        });
      } catch (err) {
        console.error('Failed to send assignment notification:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fast status & order update (Kanban drag-and-drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;

    if (!['todo', 'in_progress', 'in_review', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const project = await Project.findById(task.project);
    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this task.',
      });
    }

    task.status = status;
    if (order !== undefined) {
      task.order = order;
    }

    await task.save();
    await task.populate('project', 'name color status');
    await task.populate('assignee', 'name email avatar title');

    res.status(200).json({
      success: true,
      message: 'Status updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const project = await Project.findById(task.project);
    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this task.',
      });
    }

    await Task.findByIdAndDelete(task._id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addTaskComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty.',
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const project = await Project.findById(task.project);
    if (!checkProjectAccess(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to comment on this task.',
      });
    }

    task.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await task.save();
    await task.populate('comments.user', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added.',
      comments: task.comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from task
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
export const deleteTaskComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      task.creator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments.',
      });
    }

    task.comments.pull(req.params.commentId);
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted.',
      comments: task.comments,
    });
  } catch (error) {
    next(error);
  }
};
