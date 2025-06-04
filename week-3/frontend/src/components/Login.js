import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }
    
    if (trimmedUsername.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }
    
    // Basic validation for special characters
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, spaces, hyphens, and underscores');
      return;
    }
    
    setError('');
    onLogin(trimmedUsername);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💬 Real-time Chat</h1>
          <p>Enter your username to join the conversation</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className={`username-input ${error ? 'error' : ''}`}
              maxLength={20}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <button type="submit" className="join-button">
            Join Chat
          </button>
        </form>
        
        <div className="login-footer">
          <div className="features">
            <h3>Features:</h3>
            <ul>
              <li>✨ Real-time messaging</li>
              <li>🏠 Multiple chat rooms</li>
              <li>⌨️ Typing indicators</li>
              <li>👥 User presence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
