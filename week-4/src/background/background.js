// Background script for productivity tracking
import { StorageService } from '../utils/storage.js';
import { NotificationService } from '../utils/notifications.js';

class ProductivityTracker {
  constructor() {
    this.activeTab = null;
    this.sessionStart = null;
    this.dailyData = {};
    this.settings = {};
    this.init();
  }
  async init() {
    try {
      // Load settings and data
      await this.loadSettings();
      await this.loadDailyData();
      
      // Set up listeners
      this.setupTabListeners();
      this.setupNavigationListeners();
      this.setupAlarmListeners();
      
      // Start daily reset alarm
      this.setupDailyReset();
      
      console.log('Productivity Tracker initialized successfully');
    } catch (error) {
      console.error('Error initializing Productivity Tracker:', error);
    }
  }

  async loadSettings() {
    this.settings = await StorageService.get('settings') || {
      productiveWebsites: ['github.com', 'stackoverflow.com', 'docs.google.com'],
      distractingWebsites: ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'],
      dailyGoals: {
        productiveTime: 480, // 8 hours in minutes
        maxDistractingTime: 60 // 1 hour in minutes
      },
      notifications: {
        enabled: true,
        distractingTimeLimit: 30 // minutes
      },
      theme: 'light'
    };
  }

  async loadDailyData() {
    const today = new Date().toDateString();
    this.dailyData = await StorageService.get(`dailyData_${today}`) || {
      date: today,
      websites: {},
      totalProductiveTime: 0,
      totalDistractingTime: 0,
      goals: { ...this.settings.dailyGoals }
    };
  }
  setupTabListeners() {
    // Check if tabs API is available
    if (!chrome.tabs) {
      console.error('Chrome tabs API not available');
      return;
    }

    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      await this.handleTabChange(activeInfo.tabId);
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        await this.handleTabChange(tabId);
      }
    });

    if (chrome.windows) {
      chrome.windows.onFocusChanged.addListener(async (windowId) => {
        if (windowId === chrome.windows.WINDOW_ID_NONE) {
          // Browser lost focus
          this.stopTracking();
        } else {
          // Browser gained focus
          try {
            const [activeTab] = await chrome.tabs.query({ active: true, windowId });
            if (activeTab) {
              await this.handleTabChange(activeTab.id);
            }
          } catch (error) {
            console.error('Error querying active tab:', error);
          }
        }
      });
    }
  }
  setupNavigationListeners() {
    // Check if webNavigation API is available
    if (!chrome.webNavigation) {
      console.warn('Chrome webNavigation API not available');
      return;
    }

    chrome.webNavigation.onCommitted.addListener(async (details) => {
      if (details.frameId === 0) { // Main frame only
        try {
          const tab = await chrome.tabs.get(details.tabId);
          if (tab.active) {
            await this.handleTabChange(details.tabId);
          }
        } catch (error) {
          console.error('Error handling navigation:', error);
        }
      }
    });
  }
  setupAlarmListeners() {
    // Check if alarms API is available
    if (!chrome.alarms || !chrome.alarms.onAlarm) {
      console.warn('Chrome alarms API not available');
      return;
    }

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'dailyReset') {
        this.resetDailyData();
      } else if (alarm.name === 'checkDistractingTime') {
        this.checkDistractingTimeLimit();
      }
    });
  }
  setupDailyReset() {
    // Check if alarms API is available
    if (!chrome.alarms || !chrome.alarms.create) {
      console.warn('Chrome alarms API not available - using fallback timing');
      return;
    }

    // Create alarm for midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    chrome.alarms.create('dailyReset', {
      when: tomorrow.getTime(),
      periodInMinutes: 24 * 60 // Daily
    });

    // Check distracting time every 5 minutes
    chrome.alarms.create('checkDistractingTime', {
      periodInMinutes: 5
    });
  }

  async handleTabChange(tabId) {
    try {
      // Stop current tracking
      this.stopTracking();

      // Get tab info
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url || tab.url.startsWith('chrome://')) {
        return;
      }

      // Start new tracking
      this.activeTab = {
        id: tabId,
        url: tab.url,
        domain: this.extractDomain(tab.url)
      };
      this.sessionStart = Date.now();

      console.log(`Started tracking: ${this.activeTab.domain}`);
    } catch (error) {
      console.error('Error handling tab change:', error);
    }
  }

  stopTracking() {
    if (this.activeTab && this.sessionStart) {
      const sessionTime = Math.round((Date.now() - this.sessionStart) / 1000 / 60); // minutes
      
      if (sessionTime > 0) {
        this.updateTimeSpent(this.activeTab.domain, sessionTime);
      }
    }

    this.activeTab = null;
    this.sessionStart = null;
  }

  async updateTimeSpent(domain, minutes) {
    // Update website data
    if (!this.dailyData.websites[domain]) {
      this.dailyData.websites[domain] = {
        time: 0,
        visits: 0,
        category: this.categorizeWebsite(domain)
      };
    }
    
    this.dailyData.websites[domain].time += minutes;
    this.dailyData.websites[domain].visits += 1;

    // Update totals
    const category = this.dailyData.websites[domain].category;
    if (category === 'productive') {
      this.dailyData.totalProductiveTime += minutes;
    } else if (category === 'distracting') {
      this.dailyData.totalDistractingTime += minutes;
    }

    // Save data
    await this.saveDailyData();

    console.log(`Updated ${domain}: +${minutes} minutes (${category})`);
  }

  categorizeWebsite(domain) {
    if (this.settings.productiveWebsites.some(site => domain.includes(site))) {
      return 'productive';
    } else if (this.settings.distractingWebsites.some(site => domain.includes(site))) {
      return 'distracting';
    }
    return 'neutral';
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  async checkDistractingTimeLimit() {
    if (!this.settings.notifications.enabled) return;

    const limit = this.settings.notifications.distractingTimeLimit;
    if (this.dailyData.totalDistractingTime >= limit) {
      NotificationService.show(
        'Productivity Alert',
        `You've spent ${this.dailyData.totalDistractingTime} minutes on distracting websites today. Time to refocus!`,
        'warning'
      );
    }
  }

  async saveDailyData() {
    const today = new Date().toDateString();
    await StorageService.set(`dailyData_${today}`, this.dailyData);
  }

  async resetDailyData() {
    const today = new Date().toDateString();
    this.dailyData = {
      date: today,
      websites: {},
      totalProductiveTime: 0,
      totalDistractingTime: 0,
      goals: { ...this.settings.dailyGoals }
    };
    await this.saveDailyData();
  }
}

// Initialize the tracker
new ProductivityTracker();
