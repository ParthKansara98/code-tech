import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import './ChatRoom.css';

const ChatRoom = ({ currentRoom, username }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentRoom) return;

    // Listen for room messages
    socket.on('roomMessages', (data) => {
      if (data.roomId === currentRoom.id) {
        setMessages(data.messages);
      }
    });

    // Listen for new messages
    socket.on('newMessage', (message) => {
      if (message.roomId === currentRoom.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Listen for typing indicators
    socket.on('userTyping', (data) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.username) ? prev : [...prev, data.username];
        } else {
          return prev.filter(user => user !== data.username);
        }
      });
    });

    // Listen for user count updates
    socket.on('roomUserCount', (data) => {
      if (data.roomId === currentRoom.id) {
        setUserCount(data.userCount);
      }
    });

    socket.on('userJoined', (data) => {
      setUserCount(data.userCount);
    });

    socket.on('userLeft', (data) => {
      setUserCount(data.userCount);
    });

    return () => {
      socket.off('roomMessages');
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('roomUserCount');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket, currentRoom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentRoom) return;

    socket.emit('chatMessage', {
      roomId: currentRoom.id,
      message: newMessage.trim()
    });

    setNewMessage('');
    handleStopTyping();
  };

  const handleTyping = () => {
    if (!socket || !currentRoom) return;

    socket.emit('typing', { roomId: currentRoom.id });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (!socket || !currentRoom) return;

    socket.emit('stopTyping', { roomId: currentRoom.id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!currentRoom) {
    return (
      <div className="chat-room">
        <div className="chat-room-placeholder">
          <h2>Welcome to Real-time Chat!</h2>
          <p>Select a room from the sidebar to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>{currentRoom.name}</h2>
        <span className="user-count">{userCount} users online</span>
      </div>      <div className="messages-container">        {messages.map((message) => {
          const isOwnMessage = message.username === username;
          return (
            <div key={message.id} className={`message-wrapper ${isOwnMessage ? 'message-wrapper-sent' : 'message-wrapper-received'}`}>
              <div className={`message ${isOwnMessage ? 'message-sent' : 'message-received'}`}>
                {!isOwnMessage && (
                  <div className="message-header">
                    <span className="message-username">{message.username}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                {isOwnMessage && (
                  <div className="message-header">
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                    <span className="message-username">You</span>
                  </div>
                )}
                <div className="message-content">{message.message}</div>
              </div>
            </div>
          );
        })}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (e.target.value.trim()) {
              handleTyping();
            } else {
              handleStopTyping();
            }
          }}
          onBlur={handleStopTyping}
          placeholder="Type a message..."
          className="message-input"
          maxLength={500}
        />
        <button type="submit" className="send-button" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
