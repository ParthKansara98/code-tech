import React, { useState, useEffect } from 'react';
import { StorageService } from '../utils/storage';
import { TimeUtils } from '../utils/time';

const PopupApp = () => {
  const [dailyData, setDailyData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toDateString();
      const [data, config] = await Promise.all([
        StorageService.get(`dailyData_${today}`),
        StorageService.get('settings')
      ]);

      setDailyData(data || {
        websites: {},
        totalProductiveTime: 0,
        totalDistractingTime: 0,
        goals: { productiveTime: 480, maxDistractingTime: 60 }
      });

      setSettings(config || {
        dailyGoals: { productiveTime: 480, maxDistractingTime: 60 }
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: 'dashboard/dashboard.html' });
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  if (loading) {
    return (
      <div className="popup-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>Productivity Tracker</h1>
        <div className="header-actions">
          <button onClick={openDashboard} className="btn-icon" title="Open Dashboard">
            📊
          </button>
          <button onClick={openSettings} className="btn-icon" title="Settings">
            ⚙️
          </button>
        </div>
      </header>

      <nav className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
        <button 
          className={`tab-btn ${activeTab === 'websites' ? 'active' : ''}`}
          onClick={() => setActiveTab('websites')}
        >
          Websites
        </button>
      </nav>

      <main className="popup-content">
        {activeTab === 'overview' && <OverviewTab dailyData={dailyData} />}
        {activeTab === 'goals' && <GoalsTab dailyData={dailyData} />}
        {activeTab === 'websites' && <WebsitesTab dailyData={dailyData} />}
      </main>
    </div>
  );
};

const OverviewTab = ({ dailyData }) => {
  const totalTime = dailyData.totalProductiveTime + dailyData.totalDistractingTime;
  const productivePercentage = totalTime > 0 ? Math.round((dailyData.totalProductiveTime / totalTime) * 100) : 0;

  return (
    <div className="overview-tab">
      <div className="stat-card">
        <h3>Today's Activity</h3>
        <div className="stat-row">
          <span className="stat-label">Productive Time:</span>
          <span className="stat-value productive">{TimeUtils.formatMinutes(dailyData.totalProductiveTime)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Distracting Time:</span>
          <span className="stat-value distracting">{TimeUtils.formatMinutes(dailyData.totalDistractingTime)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Total Time:</span>
          <span className="stat-value">{TimeUtils.formatMinutes(totalTime)}</span>
        </div>
      </div>

      <div className="progress-card">
        <h3>Productivity Score</h3>
        <div className="progress-circle">
          <div className="progress-value">{productivePercentage}%</div>
        </div>
        <p className="progress-text">
          {productivePercentage >= 70 ? '🎉 Great job!' : 
           productivePercentage >= 50 ? '👍 Keep it up!' : '⚡ Room for improvement'}
        </p>
      </div>
    </div>
  );
};

const GoalsTab = ({ dailyData }) => {
  const productiveGoal = dailyData.goals?.productiveTime || 480;
  const distractingGoal = dailyData.goals?.maxDistractingTime || 60;
  
  const productiveProgress = Math.min((dailyData.totalProductiveTime / productiveGoal) * 100, 100);
  const distractingProgress = Math.min((dailyData.totalDistractingTime / distractingGoal) * 100, 100);

  return (
    <div className="goals-tab">
      <div className="goal-card">
        <h3>Daily Goals</h3>
        
        <div className="goal-item">
          <div className="goal-header">
            <span>Productive Time</span>
            <span>{TimeUtils.formatMinutes(dailyData.totalProductiveTime)} / {TimeUtils.formatMinutes(productiveGoal)}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill productive" 
              style={{ width: `${productiveProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="goal-item">
          <div className="goal-header">
            <span>Max Distracting Time</span>
            <span>{TimeUtils.formatMinutes(dailyData.totalDistractingTime)} / {TimeUtils.formatMinutes(distractingGoal)}</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${distractingProgress > 100 ? 'over-limit' : 'distracting'}`}
              style={{ width: `${Math.min(distractingProgress, 100)}%` }}
            ></div>
          </div>
          {distractingProgress > 100 && (
            <p className="warning-text">⚠️ Over limit!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const WebsitesTab = ({ dailyData }) => {
  const websites = Object.entries(dailyData.websites || {})
    .sort(([,a], [,b]) => b.time - a.time)
    .slice(0, 10);

  return (
    <div className="websites-tab">
      <h3>Top Websites</h3>
      <div className="website-list">
        {websites.length === 0 ? (
          <p className="no-data">No website data yet today</p>
        ) : (
          websites.map(([domain, data]) => (
            <div key={domain} className="website-item">
              <div className="website-info">
                <span className="website-domain">{domain}</span>
                <span className={`website-category ${data.category}`}>
                  {data.category}
                </span>
              </div>
              <div className="website-stats">
                <span className="website-time">{TimeUtils.formatMinutes(data.time)}</span>
                <span className="website-visits">{data.visits} visits</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PopupApp;
