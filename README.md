# Task Manager - Modern Application

A modern, full-stack task management application migrated from a legacy system. Built with Node.js, MongoDB, and React.

## Features

- **Tasks Management**: Create, update, delete, and track tasks with status and priority
- **Projects Management**: Organize tasks into projects with team collaboration
- **Comments**: Add comments to tasks and projects
- **History**: Track all changes and actions in the system
- **Notifications**: Real-time notifications for important events
- **Search**: Global search across tasks, projects, and comments
- **Reports**: Generate reports for tasks, projects, and users with CSV export
- **User Authentication**: Secure login and user management with role-based access

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** 18
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for UI icons
- **date-fns** for date formatting

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. **Clone or navigate to the project directory**

2. **Install dependencies for all packages:**
   ```bash
   npm run install-all
   ```

   Or install separately:
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=dittrich-secret-key-0101-legacy
   ```

   mongodb+srv://dittrich-mod:dittrich-0102-legacy-mod@legacy.srsdzzt.mongodb.net/?appName=legacy

   Cluster User: dittrich-mod
   Password: dittrich-0102-legacy-mod
   Cluster: legacy
   IP: 201.132.44.90

4. **Start MongoDB:**
   
   Make sure MongoDB is running on your system. If using a local instance:
   ```bash
   mongod
   ```

5. **Run the application:**
   
   From the root directory, run both server and client:
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Initial Setup

### Create Admin User

You can create an admin user by making a POST request to `/api/auth/register`:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Or use any API client like Postman.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Comments
- `GET /api/comments` - Get comments (with filters)
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment

### History
- `GET /api/history` - Get history records

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Search
- `GET /api/search?q=query&type=type` - Search across entities

### Reports
- `GET /api/reports/tasks` - Generate task report
- `GET /api/reports/projects` - Generate project report
- `GET /api/reports/users` - Generate user report
- `GET /api/reports/export/:type` - Export to CSV (tasks, projects, users)

## Project Structure

```
task-manager-modern/
├── server/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── index.js         # Server entry point
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── App.js
│   └── package.json
└── README.md
```

## Features in Detail

### Tasks
- Status: Pendiente, En Progreso, Completada, Cancelada
- Priority: Baja, Media, Alta
- Assignment to users
- Due dates
- Project association

### Projects
- Status tracking
- Team members
- Start and end dates
- Task association

### Reports
- Task statistics and filtering
- Project statistics and filtering
- User statistics with activity metrics
- CSV export functionality

## Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd client
npm start  # Runs on http://localhost:3000
```

## Production Build

### Frontend
```bash
cd client
npm run build
```

The build folder will contain the production-ready static files.

## License

ISC

## Notes

- Make sure MongoDB is running before starting the server
- Change the JWT_SECRET in production
- The application uses Spanish language interface (matching the legacy system)
- All API endpoints require authentication except `/api/auth/login` and `/api/auth/register`
