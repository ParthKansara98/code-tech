# 💬 Real-time Chat Application

A modern real-time chat application built with React and Node.js using Socket.IO for instant messaging, group chats, and typing indicators.

![Chat App Preview](https://img.shields.io/badge/Status-Complete-green)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-orange)

## ✨ Features

- 🚀 **Real-time Messaging** - Instant message delivery using WebSockets
- 🏠 **Multiple Chat Rooms** - Create and join different chat rooms
- ⌨️ **Typing Indicators** - See when others are typing
- 👥 **User Presence** - Track who's online in each room
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean and intuitive interface

## 🛠️ Technology Stack

### Frontend
- **React** (19.1.0) - UI framework with hooks
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with flexbox and gradients

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation
- **Dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd week-3
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration
The backend uses environment variables. The `.env` file is already configured with:
```
PORT=5000
NODE_ENV=development
```

## 🏃‍♂️ Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The server will start on `http://localhost:5000`

### Start the Frontend Application
```bash
cd frontend
npm start
```
The React app will start on `http://localhost:3000`

## 🎯 Usage

1. **Login**: Enter your username to join the chat
2. **Join Room**: Select a room from the sidebar or create a new one
3. **Chat**: Start sending messages in real-time
4. **Create Room**: Click the "+" button to create a new chat room
5. **Typing**: See typing indicators when others are composing messages

## 🏗️ Project Structure

```
week-3/
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js    # Login component
│   │   │   ├── Login.css   # Login styles
│   │   │   ├── Sidebar.js  # Sidebar component
│   │   │   ├── Sidebar.css # Sidebar styles
│   │   │   ├── ChatRoom.js # Chat room component
│   │   │   └── ChatRoom.css# Chat room styles
│   │   ├── contexts/
│   │   │   └── SocketContext.js # Socket.IO context
│   │   ├── App.js          # Main App component
│   │   ├── App.css         # Global styles
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🔌 API Endpoints

### REST API
- `GET /api/rooms` - Get list of all chat rooms
- `POST /api/rooms` - Create a new chat room

### Socket.IO Events

#### Client to Server
- `userJoin` - User joins the application
- `joinRoom` - User joins a specific room
- `chatMessage` - Send a chat message
- `typing` - User is typing
- `stopTyping` - User stopped typing

#### Server to Client
- `roomMessages` - Receive room message history
- `newMessage` - Receive new message
- `userJoined` - User joined the room
- `userLeft` - User left the room
- `userTyping` - User typing status
- `roomCreated` - New room created
- `roomUserCount` - Updated user count

## 🎨 Features in Detail

### Real-time Messaging
Messages are instantly delivered to all users in the same room using Socket.IO WebSocket connection.

### Group Chat Functionality
- Users can create new chat rooms
- Join existing rooms
- Each room maintains its own message history
- Room-specific user counts

### Typing Indicators
- Shows when users are typing in real-time
- Automatically clears after 2 seconds of inactivity
- Debounced to prevent excessive socket events

### User Presence
- Track online users per room
- Display user counts
- Handle user disconnections gracefully

## 🛡️ Error Handling

The application includes comprehensive error handling:
- Connection status indicators
- Input validation
- Graceful disconnection handling
- API error handling

## 🎯 Performance Optimizations

- Debounced typing events
- Efficient re-rendering with React hooks
- Proper cleanup of socket listeners
- Memory-efficient message storage

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development

### Available Scripts

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

#### Frontend
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production

## 🚀 Future Enhancements

- [ ] Message persistence with database
- [ ] User authentication with JWT
- [ ] File and image sharing
- [ ] Private messaging
- [ ] Message reactions
- [ ] Push notifications
- [ ] Message search functionality
- [ ] User profiles and avatars

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ using React and Node.js

---

*Happy Chatting! 💬*
