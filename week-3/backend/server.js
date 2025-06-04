const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// In-memory storage for rooms and messages
const rooms = new Map();
const users = new Map();

// Initialize default room
rooms.set('general', {
  id: 'general',
  name: 'General',
  messages: [],
  users: new Set()
});

// REST API Routes
app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    userCount: room.users.size
  }));
  res.json(roomList);
});

app.post('/api/rooms', (req, res) => {
  const { name } = req.body;
  const roomId = uuidv4();
  
  const newRoom = {
    id: roomId,
    name: name,
    messages: [],
    users: new Set()
  };
  
  rooms.set(roomId, newRoom);
  
  // Broadcast new room to all clients
  io.emit('roomCreated', {
    id: roomId,
    name: name,
    userCount: 0
  });
  
  res.json({ id: roomId, name: name, userCount: 0 });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle user joining
  socket.on('userJoin', (userData) => {
    const { username } = userData;
    users.set(socket.id, {
      id: socket.id,
      username: username,
      currentRoom: null
    });
    
    console.log(`${username} joined`);
  });
  
  // Handle joining a room
  socket.on('joinRoom', (data) => {
    const { roomId, username } = data;
    const user = users.get(socket.id);
    
    if (!user) return;
    
    // Leave previous room if any
    if (user.currentRoom) {
      socket.leave(user.currentRoom);
      const prevRoom = rooms.get(user.currentRoom);
      if (prevRoom) {
        prevRoom.users.delete(socket.id);
        socket.to(user.currentRoom).emit('userLeft', {
          username: user.username,
          userCount: prevRoom.users.size
        });
      }
    }
    
    // Join new room
    socket.join(roomId);
    user.currentRoom = roomId;
    
    const room = rooms.get(roomId);
    if (room) {
      room.users.add(socket.id);
      
      // Send room messages to user
      socket.emit('roomMessages', {
        roomId: roomId,
        messages: room.messages
      });
      
      // Notify other users in room
      socket.to(roomId).emit('userJoined', {
        username: username,
        userCount: room.users.size
      });
      
      // Send updated user count to joining user
      socket.emit('roomUserCount', {
        roomId: roomId,
        userCount: room.users.size
      });
      
      console.log(`${username} joined room: ${room.name}`);
    }
  });
  
  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const { roomId, message } = data;
    const user = users.get(socket.id);
    
    if (!user || !user.currentRoom || user.currentRoom !== roomId) return;
    
    const room = rooms.get(roomId);
    if (!room) return;
    
    const messageData = {
      id: uuidv4(),
      username: user.username,
      message: message,
      timestamp: new Date().toISOString(),
      roomId: roomId
    };
    
    // Store message
    room.messages.push(messageData);
    
    // Broadcast message to all users in room
    io.to(roomId).emit('newMessage', messageData);
    
    console.log(`Message in ${room.name}: ${user.username}: ${message}`);
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    const { roomId } = data;
    const user = users.get(socket.id);
    
    if (!user || user.currentRoom !== roomId) return;
    
    socket.to(roomId).emit('userTyping', {
      username: user.username,
      isTyping: true
    });
  });
  
  socket.on('stopTyping', (data) => {
    const { roomId } = data;
    const user = users.get(socket.id);
    
    if (!user || user.currentRoom !== roomId) return;
    
    socket.to(roomId).emit('userTyping', {
      username: user.username,
      isTyping: false
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    if (user) {
      console.log(`${user.username} disconnected`);
      
      // Remove user from current room
      if (user.currentRoom) {
        const room = rooms.get(user.currentRoom);
        if (room) {
          room.users.delete(socket.id);
          socket.to(user.currentRoom).emit('userLeft', {
            username: user.username,
            userCount: room.users.size
          });
        }
      }
      
      // Remove user from users map
      users.delete(socket.id);
    }
    
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
