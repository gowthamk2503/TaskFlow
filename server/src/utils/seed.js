import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Cleaning old seed records...');
    await User.deleteMany({ email: { $in: ['alice@example.com', 'bob@example.com', 'carol@example.com'] } });

    console.log('[Seed] Creating demo users...');
    const alice = await User.create({
      name: 'Alice Cooper',
      email: 'alice@example.com',
      password: 'Password123!',
      title: 'Senior Full-Stack Engineer',
      bio: 'Architecting scalable cloud microservices and beautiful modern interfaces.',
      role: 'admin',
    });

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'Password123!',
      title: 'UI/UX Designer',
      bio: 'Crafting pixel-perfect design systems with the Midnight Aurora aesthetic.',
      role: 'user',
    });

    const carol = await User.create({
      name: 'Carol Danvers',
      email: 'carol@example.com',
      password: 'Password123!',
      title: 'DevOps & Security Specialist',
      bio: 'Ensuring zero-trust security and high availability pipelines.',
      role: 'user',
    });

    console.log('[Seed] Creating demo projects...');
    const p1 = await Project.create({
      name: 'Next-Gen Design System',
      description: 'Unified React and Tailwind component library implementing Midnight Aurora tokens.',
      owner: alice._id,
      members: [
        { user: alice._id, role: 'admin' },
        { user: bob._id, role: 'member' },
      ],
      status: 'active',
      category: 'Design & Frontend',
      color: '#8B5CF6',
      startDate: new Date(Date.now() - 86400000 * 10),
      dueDate: new Date(Date.now() + 86400000 * 14),
    });

    const p2 = await Project.create({
      name: 'Mobile App MVP',
      description: 'Cross-platform mobile workspace delivering real-time push alerts and task status synchronization.',
      owner: alice._id,
      members: [
        { user: alice._id, role: 'admin' },
        { user: carol._id, role: 'member' },
      ],
      status: 'active',
      category: 'Mobile Engineering',
      color: '#22D3EE',
      startDate: new Date(Date.now() - 86400000 * 5),
      dueDate: new Date(Date.now() + 86400000 * 20),
    });

    const p3 = await Project.create({
      name: 'Security & Penetration Audit',
      description: 'Comprehensive OWASP Top 10 compliance review and automated penetration tests.',
      owner: alice._id,
      members: [
        { user: alice._id, role: 'admin' },
        { user: carol._id, role: 'admin' },
      ],
      status: 'planning',
      category: 'Security',
      color: '#34D399',
      startDate: new Date(Date.now() + 86400000 * 2),
      dueDate: new Date(Date.now() + 86400000 * 30),
    });

    console.log('[Seed] Creating demo tasks...');
    await Task.create([
      {
        title: 'Draft Midnight Aurora Color Palette & CSS Variables',
        description: 'Define semantic tokens for cards, surfaces, text, and glows.',
        project: p1._id,
        creator: alice._id,
        assignee: bob._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 86400000 * 2),
        tags: ['design-system', 'css'],
        comments: [
          {
            user: bob._id,
            text: 'Tokens finalized! Added violet #8B5CF6 and cyan #22D3EE accents.',
          },
        ],
      },
      {
        title: 'Implement Interactive Kanban Board with HTML5 Drag-and-Drop',
        description: 'Enable fluid drag-and-drop between To Do, In Progress, In Review, and Completed columns.',
        project: p1._id,
        creator: alice._id,
        assignee: alice._id,
        status: 'in_progress',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 86400000 * 3),
        tags: ['kanban', 'frontend'],
        comments: [
          {
            user: alice._id,
            text: 'Optimistic state updates working seamlessly with fallback controls.',
          },
        ],
      },
      {
        title: 'Configure JWT Auth & Password Hashing with Bcrypt',
        description: 'Verify token expiration, protected middleware, and credential sanitization.',
        project: p1._id,
        creator: alice._id,
        assignee: alice._id,
        status: 'completed',
        priority: 'urgent',
        dueDate: new Date(Date.now() - 86400000 * 4),
        tags: ['backend', 'security'],
      },
      {
        title: 'Build Recharts Dashboard Productivity Analytics',
        description: 'Assemble status breakdown pie chart and 7-day velocity bar charts.',
        project: p1._id,
        creator: alice._id,
        assignee: bob._id,
        status: 'in_review',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 1),
        tags: ['analytics', 'charts'],
      },
      {
        title: 'Fix React Native Push Notification Handlers',
        description: 'Resolve background state wakeups and deep linking on Android.',
        project: p2._id,
        creator: alice._id,
        assignee: carol._id,
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 5),
        tags: ['mobile', 'notifications'],
      },
      {
        title: 'Review Legacy API Endpoints for Rate Limiting Violations',
        description: 'Ensure DDoS mitigation headers are returned on all public routes.',
        project: p3._id,
        creator: alice._id,
        assignee: carol._id,
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() - 86400000 * 1), // Past due (overdue)
        tags: ['compliance', 'rate-limit'],
      },
    ]);

    console.log('[Seed] Creating demo notifications...');
    await Notification.create([
      {
        recipient: alice._id,
        sender: bob._id,
        title: 'New Comment on Design Tokens',
        message: 'Bob Smith commented: "Tokens finalized! Added violet #8B5CF6 and cyan #22D3EE accents."',
        type: 'task_assigned',
        read: false,
      },
      {
        recipient: alice._id,
        sender: carol._id,
        title: 'Deadline Approaching',
        message: 'Task "Review Legacy API Endpoints" is past target delivery date.',
        type: 'deadline_approaching',
        read: false,
      },
    ]);

    console.log('=====================================================');
    console.log('  Database seeded successfully!');
    console.log('  Demo Login:');
    console.log('    Email:    alice@example.com');
    console.log('    Password: Password123!');
    console.log('=====================================================');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed:', error.message);
    process.exit(1);
  }
};

seedData();
