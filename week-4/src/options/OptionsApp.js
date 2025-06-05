import React, { useState, useEffect } from 'react';
import { StorageService } from '../utils/storage';

const OptionsApp = () => {
  const [settings, setSettings] = useState({
    productiveWebsites: [],
    distractingWebsites: [],
    dailyGoals: {
      productiveTime: 480,
      maxDistractingTime: 60
    },
    notifications: {
      enabled: true,
      distractingTimeLimit: 30
    },
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [newProductiveSite, setNewProductiveSite] = useState('');
  const [newDistractingSite, setNewDistractingSite] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await StorageService.get('settings');
      if (saved) {
        setSettings({
          productiveWebsites: saved.productiveWebsites || ['github.com', 'stackoverflow.com', 'docs.google.com'],
          distractingWebsites: saved.distractingWebsites || ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'],
          dailyGoals: saved.dailyGoals || { productiveTime: 480, maxDistractingTime: 60 },
          notifications: saved.notifications || { enabled: true, distractingTimeLimit: 30 },
          theme: saved.theme || 'light'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await StorageService.set('settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addProductiveSite = () => {
    if (newProductiveSite.trim() && !settings.productiveWebsites.includes(newProductiveSite.trim())) {
      setSettings(prev => ({
        ...prev,
        productiveWebsites: [...prev.productiveWebsites, newProductiveSite.trim()]
      }));
      setNewProductiveSite('');
    }
  };

  const removeProductiveSite = (site) => {
    setSettings(prev => ({
      ...prev,
      productiveWebsites: prev.productiveWebsites.filter(s => s !== site)
    }));
  };

  const addDistractingSite = () => {
    if (newDistractingSite.trim() && !settings.distractingWebsites.includes(newDistractingSite.trim())) {
      setSettings(prev => ({
        ...prev,
        distractingWebsites: [...prev.distractingWebsites, newDistractingSite.trim()]
      }));
      setNewDistractingSite('');
    }
  };

  const removeDistractingSite = (site) => {
    setSettings(prev => ({
      ...prev,
      distractingWebsites: prev.distractingWebsites.filter(s => s !== site)
    }));
  };

  const updateDailyGoal = (key, value) => {
    setSettings(prev => ({
      ...prev,
      dailyGoals: { ...prev.dailyGoals, [key]: parseInt(value) || 0 }
    }));
  };

  const updateNotificationSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear all tracking data? This cannot be undone.')) {
      try {
        const allData = await StorageService.getAll();
        const dataKeys = Object.keys(allData).filter(key => key.startsWith('dailyData_'));
        
        for (const key of dataKeys) {
          await StorageService.remove(key);
        }
        
        alert('All tracking data has been cleared.');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className={`options-container ${settings.theme}`}>
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={`options-container ${settings.theme}`}>
      <header className="options-header">
        <h1>Productivity Tracker Settings</h1>
        <div className="header-actions">
          <button 
            onClick={saveSettings}
            className={`save-btn ${saved ? 'saved' : ''}`}
            disabled={saved}
          >
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      </header>

      <main className="options-main">
        <div className="settings-grid">
          
          {/* Daily Goals Section */}
          <section className="settings-section">
            <h2>Daily Goals</h2>
            <div className="setting-item">
              <label htmlFor="productive-goal">Productive Time Goal (minutes)</label>
              <input
                id="productive-goal"
                type="number"
                min="0"
                max="1440"
                value={settings.dailyGoals.productiveTime}
                onChange={(e) => updateDailyGoal('productiveTime', e.target.value)}
                className="number-input"
              />
              <span className="help-text">Recommended: 480 minutes (8 hours)</span>
            </div>
            <div className="setting-item">
              <label htmlFor="distracting-limit">Max Distracting Time (minutes)</label>
              <input
                id="distracting-limit"
                type="number"
                min="0"
                max="1440"
                value={settings.dailyGoals.maxDistractingTime}
                onChange={(e) => updateDailyGoal('maxDistractingTime', e.target.value)}
                className="number-input"
              />
              <span className="help-text">Recommended: 60 minutes (1 hour)</span>
            </div>
          </section>

          {/* Productive Websites Section */}
          <section className="settings-section">
            <h2>Productive Websites</h2>
            <div className="website-input">
              <input
                type="text"
                placeholder="e.g., github.com"
                value={newProductiveSite}
                onChange={(e) => setNewProductiveSite(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProductiveSite()}
                className="text-input"
              />
              <button onClick={addProductiveSite} className="add-btn">Add</button>
            </div>
            <div className="website-list">
              {settings.productiveWebsites.map(site => (
                <div key={site} className="website-tag productive">
                  <span>{site}</span>
                  <button onClick={() => removeProductiveSite(site)} className="remove-btn">×</button>
                </div>
              ))}
            </div>
          </section>

          {/* Distracting Websites Section */}
          <section className="settings-section">
            <h2>Distracting Websites</h2>
            <div className="website-input">
              <input
                type="text"
                placeholder="e.g., youtube.com"
                value={newDistractingSite}
                onChange={(e) => setNewDistractingSite(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDistractingSite()}
                className="text-input"
              />
              <button onClick={addDistractingSite} className="add-btn">Add</button>
            </div>
            <div className="website-list">
              {settings.distractingWebsites.map(site => (
                <div key={site} className="website-tag distracting">
                  <span>{site}</span>
                  <button onClick={() => removeDistractingSite(site)} className="remove-btn">×</button>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications Section */}
          <section className="settings-section">
            <h2>Notifications</h2>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.enabled}
                  onChange={(e) => updateNotificationSetting('enabled', e.target.checked)}
                />
                <span className="checkbox-text">Enable notifications</span>
              </label>
            </div>
            <div className="setting-item">
              <label htmlFor="notification-limit">Alert after (minutes on distracting sites)</label>
              <input
                id="notification-limit"
                type="number"
                min="1"
                max="480"
                value={settings.notifications.distractingTimeLimit}
                onChange={(e) => updateNotificationSetting('distractingTimeLimit', parseInt(e.target.value) || 1)}
                disabled={!settings.notifications.enabled}
                className="number-input"
              />
            </div>
          </section>

          {/* Appearance Section */}
          <section className="settings-section">
            <h2>Appearance</h2>
            <div className="setting-item">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                className="select-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>

          {/* Data Management Section */}
          <section className="settings-section danger-section">
            <h2>Data Management</h2>
            <div className="setting-item">
              <button onClick={clearAllData} className="danger-btn">
                Clear All Data
              </button>
              <span className="help-text">This will permanently delete all your tracking data.</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default OptionsApp;
