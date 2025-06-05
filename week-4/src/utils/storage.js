// Storage service for Chrome extension
export class StorageService {
  static async get(key) {
    try {
      const result = await chrome.storage.sync.get(key);
      return result[key];
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  static async set(key, value) {
    try {
      await chrome.storage.sync.set({ [key]: value });
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  static async remove(key) {
    try {
      await chrome.storage.sync.remove(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  static async clear() {
    try {
      await chrome.storage.sync.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  static async getAll() {
    try {
      const result = await chrome.storage.sync.get(null);
      return result;
    } catch (error) {
      console.error('Storage getAll error:', error);
      return {};
    }
  }

  // Local storage methods for larger data
  static async getLocal(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error('Local storage get error:', error);
      return null;
    }
  }

  static async setLocal(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      console.error('Local storage set error:', error);
      return false;
    }
  }
}
