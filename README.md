
# TaskFlow – Project and Task Management App

TaskFlow is a full-stack project management application built with the MERN stack. I developed it to make it easier to organize projects, manage tasks, track progress, and keep everything in one place.

The application includes a dashboard, project and task management, a Kanban board, a calendar, and notifications. It also supports user authentication and lets users manage projects and tasks based on their access permissions.

## Features

### User Authentication
- Register and log in with an email and password.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Update profile information and change passwords.
- Protected routes for authenticated users.

### Dashboard
- View project and task statistics.
- Track completed, pending, and in-progress tasks.
- View task status distribution and weekly completion trends.
- Check upcoming deadlines and recent activity.
- Create projects and tasks directly from the dashboard.

### Project Management
- Create, view, update, and delete projects.
- Set project descriptions, statuses, colors, and target dates.
- Track project progress based on associated tasks.
- Add or remove project members.
- Restrict access to projects based on ownership and membership.

### Task Management
- Create, edit, and delete tasks.
- Set task priorities: Low, Medium, High, and Urgent.
- Manage task status, due dates, tags, and assignees.
- Identify overdue tasks.
- Add comments to task discussions.

### Kanban Board
- Organize tasks into four stages: To Do, In Progress, In Review, and Completed.
- Move tasks between columns using drag and drop.
- Save status changes through the backend.
- Use status selection as an alternative to drag and drop.

### Calendar
- View tasks by their due dates.
- Navigate between months.
- Create tasks with a selected due date.
- View tasks that do not have a scheduled date.

### Notifications
- View task-related notifications.
- Receive alerts for assignments, updates, and deadlines.
- Mark individual notifications as read or mark all as read.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router |
| Charts | Recharts |
| Icons | Lucide React |
| API requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |
| Testing | Vitest, Supertest |

## Project Structure

The project is organized into separate frontend and backend applications.

```text
TaskFlow/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Before running the application, make sure you have installed:

- Node.js 18 or later; Node.js 20 or later is recommended.
- npm.
- MongoDB installed locally or a MongoDB Atlas account.

### 1. Clone the repository

```bash
git clone https://github.com/gowthamk2503/TaskFlow.git
cd TaskFlow
```

### 2. Install dependencies

From the project root, run:

```bash
npm run install:all
```

This installs the dependencies for the root project, backend, and frontend.

### 3. Configure environment variables

Create a `.env` file inside the `server` directory using the provided example:

```bash
cp server/.env.example server/.env
```

Add your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace_with_a_secure_secret_at_least_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

You can use a MongoDB Atlas connection string instead of the local MongoDB URI.

If the frontend uses environment variables, create `client/.env` from `client/.env.example` as well:

```env
VITE_API_URL=http://localhost:5000/api
```

Make sure the environment variable names match the actual configuration in the project. Never commit real credentials or secret keys to GitHub.

### 4. Start the application

Run both the frontend and backend from the project root:

```bash
npm run dev
```

The development servers are configured to run at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

If the command does not start both services, check the scripts in the root `package.json`.

### 5. Database setup

Make sure MongoDB is running and that the `MONGODB_URI` value is correct.

To populate the database with sample users, projects, and tasks, use the seed command if you want demo data:

```bash
npm run seed
```

Only use demo credentials if the seed script has successfully created the corresponding account.

## REST API Overview

The backend exposes REST APIs for authentication, users, projects, tasks, dashboard statistics, and notifications.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server and database status |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the current authenticated user |
| GET | `/api/users/me` | View profile information |
| PATCH | `/api/users/me` | Update profile information |
| GET | `/api/projects` | List accessible projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get project details |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/tasks` | List accessible tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/dashboard/stats` | Retrieve dashboard statistics |
| GET | `/api/notifications` | Retrieve notifications |

The API also includes endpoints for project membership, task comments, password changes, and notification status updates.

Protected endpoints require valid authentication. Refer to the route files in `server/src/routes/` for the complete list of endpoints and their request formats.

## Security

Security was considered during development. The application uses:

- bcryptjs for password hashing.
- JWT for authentication.
- Middleware to protect routes.
- Access checks for projects and tasks.
- Helmet for HTTP security headers.
- Rate limiting for authentication endpoints.
- Request validation using express-validator.

Private project and task data should only be accessible to authorized users. Environment variables should be kept out of version control.

## Testing

The backend uses Vitest and Supertest for API testing.

To run the backend tests:

```bash
cd server
npm test
```

To build the frontend, return to the project root and run:

```bash
npm run build
```

The tests should cover important flows such as authentication, project creation, task creation, authorization, and status updates.

Before submitting the project, run these commands and record the actual results. Do not report a test as passing unless it has been executed successfully.

## AI Development Experience

I used AI-assisted development tools while building TaskFlow. They helped me work through the application structure, React components, backend routes, database models, and API integration.

I used the suggestions as a starting point, then reviewed the implementation and worked through issues as they came up. My focus was on understanding how the frontend, backend, authentication, and database operations fit together rather than simply generating code.

**Code0 usage:** Describe the specific work you actually completed with Code0 before submitting this README. The following are examples of tasks to include only if you performed them:

- Reviewed React components and improved code organization.
- Debugged API requests and backend error handling.
- Checked MongoDB operations and access-control logic.
- Reviewed or ran automated tests and fixed issues.
- Used the Code0 terminal for Git commits and pushing the repository to GitHub.

I also used Google Antigravity during development. The final implementation and test results should be reviewed before submission.

## Git and GitHub

The source code is available in the public repository:

**Repository:** https://github.com/gowthamk2503/TaskFlow

I use Git to track changes and maintain the project history. Meaningful commits help document the development process and make changes easier to review.

For the StartupMeu assessment, Git operations should be performed through the Code0 terminal as requested.

## Future Improvements

Some improvements I would like to explore next include:

- Real-time updates using Socket.IO.
- File attachments for tasks.
- Calendar export and external calendar integration.
- More detailed project activity logs.
- Additional automated tests for edge cases.
- Deployment with a production database and environment configuration.

## Author

**Gowtham K.**

B.Tech – Information Technology

GitHub: https://github.com/gowthamk2503

---

TaskFlow was built as a practical full-stack project to apply my knowledge of React, Node.js, Express, MongoDB, REST APIs, authentication, and database operations.
