import React, { useState, useEffect } from 'react';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatRoom from './components/ChatRoom';
import './App.css';

function ChatApp() {
  const { socket } = useSocket();
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (socket && username && !isLoggedIn) {
      socket.emit('userJoin', { username });
      setIsLoggedIn(true);
    }
  }, [socket, username, isLoggedIn]);

  const handleLogin = (user) => {
    setUsername(user);
  };

  const handleRoomSelect = (room) => {
    if (socket && username) {
      setCurrentRoom(room);
      socket.emit('joinRoom', { 
        roomId: room.id, 
        username: username 
      });
    }
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="chat-app">
      <Sidebar 
        currentRoom={currentRoom}
        onRoomSelect={handleRoomSelect}
        username={username}
      />
      <ChatRoom 
        currentRoom={currentRoom}
        username={username}
      />
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <ChatApp />
    </SocketProvider>
  );
}

export default App;
