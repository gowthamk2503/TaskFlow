import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Project } from '../src/models/Project.js';
import { Task } from '../src/models/Task.js';

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/taskflow_test';

let userAToken = '';
let userBToken = '';
let userAId = '';
let userBId = '';
let createdProjectId = '';
let createdTaskId = '';

beforeAll(async () => {
  await connectDB(TEST_DB_URI);
  // Clear test collections
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  await disconnectDB();
});

describe('1. Health Check Endpoint', () => {
  it('GET /api/health should return 200 with status ok and connected database', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('connected');
  });
});

describe('2. Authentication Flow & Security', () => {
  it('POST /api/auth/register should register User A', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice intern',
      email: 'alice@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');
    userAToken = res.body.token;
    userAId = res.body.user._id;
  });

  it('POST /api/auth/register should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice Duplicate',
      email: 'alice@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login should authenticate User A with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login should reject invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me should return User A profile when authorized', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('alice@example.com');
  });

  it('GET /api/auth/me should return 401 when missing token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('Register User B for authorization boundary testing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bob Intern',
      email: 'bob@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(201);
    userBToken = res.body.token;
    userBId = res.body.user._id;
  });
});

describe('3. Project Management & Authorization Isolation', () => {
  it('POST /api/projects should allow User A to create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        name: 'Website Redesign',
        description: 'Complete overhaul of company landing page',
        status: 'active',
        category: 'Engineering',
        color: '#8B5CF6',
        dueDate: new Date(Date.now() + 86400000 * 7),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.project.name).toBe('Website Redesign');
    createdProjectId = res.body.project._id;
  });

  it('GET /api/projects should return User A projects with progress', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
    expect(res.body.projects[0].name).toBe('Website Redesign');
  });

  it('GET /api/projects/:id should prevent User B from viewing User A private project', async () => {
    const res = await request(app)
      .get(`/api/projects/${createdProjectId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

describe('4. Task CRUD, Comments, and Status Persistence', () => {
  it('POST /api/tasks should allow User A to create task in project', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        title: 'Design Hero Section',
        description: 'Create high fidelity Figma mockup',
        project: createdProjectId,
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 3),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.task.title).toBe('Design Hero Section');
    createdTaskId = res.body.task._id;
  });

  it('PATCH /api/tasks/:id/status should persist Kanban status update', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdTaskId}/status`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        status: 'in_progress',
        order: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task.status).toBe('in_progress');
  });

  it('POST /api/tasks/:id/comments should add a collaboration comment', async () => {
    const res = await request(app)
      .post(`/api/tasks/${createdTaskId}/comments`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        text: 'Initial draft looks great, updating color tokens.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].text).toContain('Initial draft');
  });
});

describe('5. Dashboard Real Metrics Verification', () => {
  it('GET /api/dashboard/stats should return actual counts from database', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.totalProjects).toBe(1);
    expect(res.body.stats.totalTasks).toBe(1);
    expect(res.body.stats.inProgressTasks).toBe(1);
    expect(res.body.stats.recentProjects.length).toBe(1);
    expect(res.body.stats.statusDistribution.length).toBe(4);
  });
});
