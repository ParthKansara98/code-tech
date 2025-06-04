# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)

## Installation

### Option 1: Install All Dependencies at Once
```bash
npm run install-all
```

### Option 2: Manual Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm start
```

### Option 2: Run Separately

#### Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```
Server will start on: http://localhost:5001

#### Frontend Application (Terminal 2)
```bash
cd frontend
npm start
```
Application will open on: http://localhost:3000

## VS Code Tasks

You can also use VS Code tasks to run the application:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select one of:
   - "Start Chat App - Backend"
   - "Start Chat App - Frontend" 
   - "Start Chat App - Full Stack"

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Enter a username and click "Join Chat"
3. You'll see the "General" room by default
4. Try creating new rooms using the "+" button
5. Open multiple browser tabs to test real-time messaging
6. Test typing indicators by typing in one tab and watching another

## Features to Test

✅ **Real-time Messaging**: Send messages and see them appear instantly
✅ **Multiple Rooms**: Create and join different chat rooms
✅ **Typing Indicators**: See when others are typing
✅ **User Presence**: See user count per room
✅ **Connection Status**: Monitor connection state in sidebar

## API Endpoints

- GET /api/rooms - List all chat rooms
- POST /api/rooms - Create a new chat room

## Socket.IO Events

### Client Events
- userJoin, joinRoom, chatMessage, typing, stopTyping

### Server Events  
- roomMessages, newMessage, userJoined, userLeft, userTyping, roomCreated

## Troubleshooting

### Port Issues
If port 5001 is in use, change it in:
- `backend/.env` 
- `frontend/src/contexts/SocketContext.js`
- `frontend/src/components/Sidebar.js`

### Connection Issues
- Ensure backend is running on port 5001
- Check browser console for Socket.IO connection errors
- Verify CORS settings in backend/server.js

Enjoy your real-time chat application! 💬
