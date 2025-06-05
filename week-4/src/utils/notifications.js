// Notification service for productivity alerts
export class NotificationService {
  static async show(title, message, type = 'info', buttons = []) {
    try {
      const notificationId = `productivity_${Date.now()}`;
      
      const options = {
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: title,
        message: message,
        buttons: buttons.length > 0 ? buttons : undefined,
        requireInteraction: type === 'warning'
      };

      await chrome.notifications.create(notificationId, options);
      
      // Auto-clear after 5 seconds for info notifications
      if (type === 'info') {
        setTimeout(() => {
          chrome.notifications.clear(notificationId);
        }, 5000);
      }

      return notificationId;
    } catch (error) {
      console.error('Notification error:', error);
      return null;
    }
  }

  static async clear(notificationId) {
    try {
      await chrome.notifications.clear(notificationId);
      return true;
    } catch (error) {
      console.error('Clear notification error:', error);
      return false;
    }
  }

  static setupClickHandler(callback) {
    if (chrome.notifications && chrome.notifications.onClicked) {
      chrome.notifications.onClicked.addListener(callback);
    }
  }

  static setupButtonClickHandler(callback) {
    if (chrome.notifications && chrome.notifications.onButtonClicked) {
      chrome.notifications.onButtonClicked.addListener(callback);
    }
  }
}
