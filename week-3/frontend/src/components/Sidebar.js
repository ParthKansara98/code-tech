import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ currentRoom, onRoomSelect, username }) => {
  const { socket, connected } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    // Fetch initial rooms
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new rooms
    socket.on('roomCreated', (room) => {
      setRooms(prev => [...prev, room]);
    });

    return () => {
      socket.off('roomCreated');
    };
  }, [socket]);
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;    try {
      const response = await axios.post('http://localhost:5000/api/rooms', {
        name: newRoomName.trim()
      });
      
      setNewRoomName('');
      setShowCreateRoom(false);
      
      // Select the newly created room
      const newRoom = response.data;
      onRoomSelect(newRoom);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleRoomSelect = (room) => {
    onRoomSelect(room);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Chat Rooms</h3>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="user-info">
        <div className="username">👤 {username}</div>
      </div>

      <div className="rooms-section">
        <div className="rooms-header">
          <span>Rooms</span>
          <button 
            className="create-room-btn"
            onClick={() => setShowCreateRoom(true)}
            title="Create new room"
          >
            +
          </button>
        </div>

        {showCreateRoom && (
          <form onSubmit={handleCreateRoom} className="create-room-form">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name..."
              className="room-name-input"
              autoFocus
              maxLength={50}
            />
            <div className="form-buttons">
              <button type="submit" className="create-btn" disabled={!newRoomName.trim()}>
                Create
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowCreateRoom(false);
                  setNewRoomName('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="rooms-list">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`room-item ${currentRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => handleRoomSelect(room)}
            >
              <div className="room-info">
                <span className="room-name"># {room.name}</span>
                <span className="room-users">{room.userCount} users</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="app-info">
          <span>Real-time Chat App</span>
          <small>Built with React & Socket.IO</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
