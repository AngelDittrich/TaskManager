# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB installed and running

## Setup Steps

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment:**
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `.env` if needed (defaults should work for local development).

3. **Start MongoDB:**
   - Windows: Start MongoDB service or run `mongod`
   - Mac/Linux: `sudo systemctl start mongod` or `mongod`

4. **Create admin user (optional):**
   ```bash
   cd server
   npm run create-admin
   ```
   This creates:
   - Email: admin@example.com
   - Password: admin123

5. **Start the application:**
   ```bash
   # From root directory
   npm run dev
   ```
   This starts both backend (port 5000) and frontend (port 3000).

6. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Login with admin credentials or register a new user

## Manual Start (Alternative)

If you prefer to run server and client separately:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## First Login

If you created the admin user:
- Email: `admin@example.com`
- Password: `admin123`

Or register a new user through the API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

Then login with those credentials.

## Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running
- Check the MONGODB_URI in server/.env

**Port already in use:**
- Change PORT in server/.env (backend)
- Change port in client/package.json scripts (frontend)

**Module not found errors:**
- Run `npm install` in root, server, and client directories
