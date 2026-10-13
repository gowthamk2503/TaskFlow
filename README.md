# TaskFlow — Modern Project & Task Management Platform

TaskFlow is a production-style project and task management SaaS platform engineered with the **MERN stack** (MongoDB, Express, React, Node.js) and the **Midnight Aurora** dark design system. Built for a Software Engineer Intern technical assessment, it offers real-time project oversight, task lifecycles, interactive Kanban drag-and-drop, schedule calendars, collaboration comments, and productivity analytics.

---

## Table of Contents

1. [Features](#features)
2. [Design System — Midnight Aurora](#design-system--midnight-aurora)
3. [Technology Stack](#technology-stack)
4. [Architecture & Folder Structure](#architecture--folder-structure)
5. [Prerequisites](#prerequisites)
6. [Installation & Setup](#installation--setup)
7. [Environment Configuration](#environment-configuration)
8. [MongoDB Database Setup](#mongodb-database-setup)
9. [Development & Execution Scripts](#development--execution-scripts)
10. [REST API Documentation](#rest-api-documentation)
11. [Authentication & Security](#authentication--security)
12. [Testing & Verification](#testing--verification)
13. [AI Development Experience](#ai-development-experience)
14. [Development Tools](#development-tools)
15. [Code0 & GitHub Handoff Guide](#code0--github-handoff-guide)
16. [Known Limitations & Future Roadmap](#known-limitations--future-roadmap)

---

## Features

- **Authentication & User Management**:
  - Secure registration, login, session persistence, and logout.
  - Password hashing with `bcryptjs` and session tokens with `jsonwebtoken` (JWT).
  - Profile customization (name, title, bio) and secure password changes.
  - User search for project collaboration and assignment.

- **Dynamic Overview Dashboard**:
  - Live calculated KPIs: Total Projects, Total Tasks, Completion Rate, In-Progress count, and Overdue count.
  - Task Status Distribution chart (Interactive Recharts Donut).
  - 7-Day Completion Velocity Trend chart (Recharts dual-metric Bar Chart).
  - Quick-action shortcuts to create projects or tasks.
  - Upcoming deadline reminders and recent activity feeds.

- **Project Management**:
  - Full CRUD operations with color-coded initiatives, status tags, and target dates.
  - Dynamic progress calculation rolled up from associated tasks.
  - Access control: isolation between project owners and assigned members.
  - Member management: invite or remove team members with role assignments.
  - Cascade deletion: deleting a project safely removes associated tasks.

- **Task Management**:
  - Comprehensive task creation, viewing, updating, and deletion.
  - Prioritization (`Low`, `Medium`, `High`, `Urgent`), status tags, due dates, tags, and assignees.
  - Automatic overdue detection and alert badges.
  - Task comments and notes for real-time team collaboration.

- **Interactive Kanban Board**:
  - 4 workflow lanes: *To Do*, *In Progress*, *In Review*, and *Completed*.
  - Native HTML5 Drag-and-Drop with optimistic state transitions and backend synchronization.
  - Fallback status selector for touch/accessibility devices.
  - Add tasks directly into specific lanes with pre-selected state.

- **Interactive Calendar**:
  - Monthly view with date navigation and task mapping based on due dates.
  - Click on any day to create tasks with pre-filled due dates.
  - Dedicated side drawer for unscheduled tasks.
  - Timezone-safe date rendering preventing unexpected day shifts.

- **Notification Center**:
  - Real-time alerts for task assignments, updates, and upcoming/overdue deadlines.
  - Mark individual notifications as read or batch mark all as read.

---

## Design System — Midnight Aurora

TaskFlow strictly adheres to the **Midnight Aurora** dark theme across every view:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#0B1020` | Root background |
| **Sidebar Background** | `#0F172A` | Navigation drawer |
| **Card Surface** | `#111B30` | Primary content cards |
| **Secondary Surface** | `#17233B` | Inputs, sub-panels, controls |
| **Primary Accent** | `#8B5CF6` | Aurora Violet glow, buttons, badges |
| **Secondary Accent** | `#22D3EE` | Aurora Cyan highlights, progress bars |
| **Primary Text** | `#F8FAFC` | Headings, high-contrast labels |
| **Muted Text** | `#94A3B8` | Body text, captions, timestamps |
| **Border Color** | `#263449` | Subtle structural dividers |
| **Success Color** | `#34D399` | Completed state, positive indicators |
| **Warning Color** | `#FBBF24` | Medium priority, planning state |
| **Error Color** | `#FB7185` | Urgent priority, overdue alerts |

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom Midnight Aurora palette tokens
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with global JWT request/response interceptors

### Backend
- **Runtime**: Node.js (v20+ / v22+)
- **Framework**: Express.js (ES Modules)
- **Database & ODM**: MongoDB / MongoDB Atlas with Mongoose
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation**: `express-validator`
- **Security & Headers**: `helmet`, `cors`, and `express-rate-limit`
- **Testing**: Vitest and Supertest

---

## Architecture & Folder Structure

```
taskflow/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Modal, Badge, Card, EmptyState, etc.
│   │   │   ├── layout/         # AppLayout, Navbar, Sidebar
│   │   │   ├── projects/       # ProjectModal
│   │   │   └── tasks/          # TaskCard, TaskModal
│   │   ├── contexts/           # AuthContext (state & session restore)
│   │   ├── pages/              # Dashboard, Projects, Tasks, Kanban, Calendar, etc.
│   │   ├── services/           # Axios HTTP client and modular endpoints
│   │   ├── App.jsx             # Route table & ProtectedRoute guards
│   │   ├── index.css           # Tailwind directives & Aurora utilities
│   │   └── main.jsx            # React root mount
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/             # Mongoose db connection handler
│   │   ├── controllers/        # Auth, User, Project, Task, Dashboard, Notifications
│   │   ├── middleware/         # Auth guard, error handler, rate limiter, validators
│   │   ├── models/             # User, Project, Task, Notification Mongoose schemas
│   │   ├── routes/             # REST endpoints router definitions
│   │   ├── utils/              # Database seed script
│   │   ├── app.js              # Express app setup, CORS, Helmet, routes
│   │   └── server.js           # HTTP listener and shutdown hooks
│   ├── tests/                  # Automated integration tests (Vitest + Supertest)
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json                # Root orchestration scripts
└── README.md
```

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (v20+ / v22+ recommended)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/taskflow`) or a MongoDB Atlas cluster URI.

---

## Installation & Setup

1. **Clone or open the workspace**:
   ```bash
   cd taskflow
   ```

2. **Install all dependencies (Root, Server, and Client)**:
   ```bash
   npm run install:all
   ```
   *Or install individually:*
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in both `server/` and `client/` directories:
   ```bash
   # Server environment
   cp server/.env.example server/.env

   # Client environment
   cp client/.env.example client/.env
   ```

4. **Seed Database with Sample Data (Optional)**:
   Populates projects, tasks, comments, and users for instant review:
   ```bash
   npm run seed
   ```
   **Default Demo Account**:
   - **Email**: `alice@example.com`
   - **Password**: `Password123!`

---

## Environment Configuration

### Server (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.exlscs5.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## MongoDB Database Setup

### Local MongoDB:
1. Ensure the MongoDB service is running locally on port `27017`.
2. Set `MONGODB_URI=mongodb://127.0.0.1:27017/taskflow` in `server/.env`.

### MongoDB Atlas:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User under **Security > Database Access**.
3. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for development).
4. Copy the SRV connection URI and ensure special characters in passwords (such as `@`) are URL-encoded (e.g. `@` -> `%40`).
5. Set `MONGODB_URI` in `server/.env`.

---

## Development & Execution Scripts

From the root directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs backend (`localhost:5000`) and frontend (`localhost:5173`) concurrently |
| `npm run dev:server` | Starts backend in watch mode with Node's native `--watch` |
| `npm run dev:client` | Starts Vite frontend development server |
| `npm run seed` | Seeds database with demo users, projects, tasks, and notifications |
| `npm run test` | Executes backend Vitest integration test suite |
| `npm run build` | Builds client production bundle into `client/dist` |
| `npm run install:all` | Installs root, server, and client npm dependencies |

---

## REST API Documentation

### Health Check
- `GET /api/health` — System status, uptime, and database connection state.

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `confirmPassword`).
- `POST /api/auth/login` — Sign in with email and password, returns JWT token.
- `GET /api/auth/me` — Retrieve authenticated user profile (Protected).
- `POST /api/auth/logout` — End session (Protected).

### Users
- `GET /api/users/me` — Current user profile.
- `PATCH /api/users/me` — Update name, title, bio, or preferences.
- `PATCH /api/users/me/password` — Change password with current password verification.
- `GET /api/users/search?q=:query` — Search users by name or email for collaboration.

### Projects
- `GET /api/projects` — List accessible projects with calculated completion progress (filter, search, sort).
- `POST /api/projects` — Create project.
- `GET /api/projects/:id` — Retrieve project details, tasks, and members.
- `PATCH /api/projects/:id` — Update project metadata.
- `DELETE /api/projects/:id` — Delete project and cascade-remove associated tasks.
- `POST /api/projects/:id/members` — Add member to project.
- `DELETE /api/projects/:id/members/:userId` — Remove member from project.

### Tasks
- `GET /api/tasks` — List accessible tasks (filter by project, status, priority, overdue, search).
- `POST /api/tasks` — Create task with project relation, due date, tags, and assignee.
- `GET /api/tasks/:id` — Retrieve single task with discussion comments.
- `PATCH /api/tasks/:id` — Update task details.
- `PATCH /api/tasks/:id/status` — Lightweight endpoint for Kanban drag-and-drop transitions.
- `DELETE /api/tasks/:id` — Delete task.
- `POST /api/tasks/:id/comments` — Add comment to task discussion.
- `DELETE /api/tasks/:id/comments/:commentId` — Delete task comment.

### Dashboard
- `GET /api/dashboard/stats` — Real-time metrics: totals, completion percentage, distributions, weekly velocity, and deadlines.

### Notifications
- `GET /api/notifications` — List alerts for current user.
- `PATCH /api/notifications/:id/read` — Mark notification as read.
- `PATCH /api/notifications/read-all` — Mark all notifications as read.

---

## Authentication & Security

1. **Password Security**: Passwords hashed with `bcryptjs` using 10 salt rounds. Passwords are never returned in queries (`select: false`).
2. **Access Control**: Users can only access projects and tasks they own or belong to as members. Accessing unauthorized IDs returns `403 Forbidden`.
3. **HTTP Headers**: Enforced via `helmet` to mitigate clickjacking, MIME-sniffing, and cross-site scripting.
4. **Rate Limiting**: `express-rate-limit` prevents brute-force attempts on `/api/auth` endpoints.
5. **Input Validation**: `express-validator` sanitizes and normalizes emails and enforces schema integrity.
6. **Token Verification**: Protected routes require valid `Authorization: Bearer <token>` headers. Expired or malformed tokens are rejected with `401 Unauthorized`.

---

## Testing & Verification

The backend includes automated integration tests using Vitest and Supertest:

```bash
cd server
npm test
```

### Verified Test Suite (15/15 passing):
- [x] `GET /api/health` returns status `ok` and verified database connection.
- [x] `POST /api/auth/register` creates user and issues JWT.
- [x] Duplicate email registration is rejected with `400 Bad Request`.
- [x] `POST /api/auth/login` verifies correct credentials and issues JWT.
- [x] Invalid credentials rejected with `401 Unauthorized`.
- [x] `GET /api/auth/me` validates session tokens.
- [x] Missing authorization tokens return `401 Unauthorized`.
- [x] Project creation and progress calculation.
- [x] Authorization Boundary: User B is forbidden (`403`) from accessing User A's private project.
- [x] Task creation with project association.
- [x] Kanban status transition persistence (`PATCH /api/tasks/:id/status`).
- [x] Task collaboration comment creation.
- [x] Dashboard endpoint returns authentic database metrics and distribution stats.

### Frontend Verification:
- Client production bundle successfully compiled using `npm run build` with zero errors.

---

## AI Development Experience

During development in Google Antigravity:

1. **Full-Stack Architecture & Schemas**: Engineered Mongoose models with references, compound indexes, virtuals, and cascade deletion hooks.
2. **Midnight Aurora Theme System**: Implemented a dark theme in Tailwind CSS with tailored hex tokens, glassmorphism panels, and Recharts color palettes.
3. **Express Controllers & Authorization Isolation**: Designed access-check middlewares (`checkProjectAccess`, `checkProjectAdmin`) preventing horizontal privilege escalation across projects.
4. **Interactive Kanban & Drag-and-Drop**: Built an optimistic drag-and-drop state synchronizer with error rollback and fallback selection.
5. **Database Seeding & Verification**: Wrote seed scripts and Vitest test suites verifying live MongoDB Atlas connectivity and CRUD operations.

*(Note: Antigravity was used for the initial architecture and full implementation. Code0 will be used for code review, terminal operations, and Git/GitHub commits).*

---

## Development Tools

- **Google Antigravity**: Full-stack implementation, UI/UX system design, schema engineering, and test creation.
- **Node.js & npm**: Execution runtime and package management.
- **Vitest & Supertest**: Automated API integration testing.
- **MongoDB Atlas & mongod**: Cloud and local database persistence.
- **Vite & Tailwind CSS**: Frontend development and production bundling.
- **Code0**: Prepared for subsequent code review, Git operations, and submission workflows.

---

## Code0 & GitHub Handoff Guide

To continue development, perform code review, and push to GitHub using Code0:

1. **Open the repository in VS Code**:
   ```bash
   code c:\Users\vijay\Taskflow
   ```

2. **Open Code0 within VS Code**:
   Launch the Code0 extension/panel to review changed files and inspect project structure.

3. **Verify Git Status in Code0 Terminal**:
   ```bash
   git status
   ```

4. **Add and Commit Changes**:
   Ensure `.env` files remain untracked (verified in `.gitignore`):
   ```bash
   git add .
   git commit -m "feat: complete TaskFlow full-stack MERN application with Midnight Aurora theme"
   ```

5. **Connect Remote & Push via Code0 Terminal**:
   ```bash
   git remote add origin https://github.com/<your-username>/taskflow.git
   git branch -M main
   git push -u origin main
   ```

---

## Known Limitations & Future Roadmap

- **WebSocket Real-Time Updates**: Status updates currently use optimistic UI with REST synchronization; Socket.io can be added for live multi-user cursors.
- **File Attachments**: Tasks support links and tags; S3/Cloudinary integration can be added for direct file uploads.
- **Third-Party Calendar Export**: Calendar events can be exported via `.ics` format in future releases.
