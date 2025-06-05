// Content script for additional page tracking
class ContentTracker {
  constructor() {
    this.isActive = true;
    this.lastActivity = Date.now();
    this.setupActivityListeners();
  }

  setupActivityListeners() {
    // Track user activity on the page
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
        this.isActive = true;
      }, { passive: true });
    });

    // Check for inactivity every 30 seconds
    setInterval(() => {
      if (Date.now() - this.lastActivity > 30000) { // 30 seconds
        this.isActive = false;
      }
    }, 30000);

    // Send activity status to background script
    setInterval(() => {
      chrome.runtime.sendMessage({
        type: 'ACTIVITY_UPDATE',
        isActive: this.isActive,
        url: window.location.href
      }).catch(() => {
        // Handle disconnected port
      });
    }, 60000); // Every minute
  }
}

// Initialize content tracker
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContentTracker();
  });
} else {
  new ContentTracker();
}
