# Troubleshooting Guide: Chrome Extension Issues

## ✅ Fixed Issue: `chrome.alarms.onAlarm` TypeError

**Problem**: `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'onAlarm')`

**Root Cause**: The `alarms` permission was missing from the manifest.json, making the Chrome alarms API unavailable.

**Solution Applied**:
1. ✅ Added `"alarms"` permission to manifest.json
2. ✅ Added error handling for missing Chrome APIs
3. ✅ Improved service worker robustness

## 🛠️ Common Chrome Extension Issues & Solutions

### 1. Service Worker API Errors

**Symptoms**:
- `Cannot read properties of undefined` errors
- Chrome APIs not working

**Solutions**:
- ✅ Verify all required permissions in manifest.json
- ✅ Add error checking before using Chrome APIs
- ✅ Use try-catch blocks around API calls

### 2. Extension Won't Load

**Symptoms**:
- Extension doesn't appear in chrome://extensions/
- "Manifest is not valid" errors

**Common Fixes**:
- Check manifest.json syntax (JSON validation)
- Ensure all file paths exist
- Verify manifest version 3 format

### 3. Background Script Errors

**Symptoms**:
- Background page shows errors in DevTools
- Extension functionality not working

**Debugging Steps**:
1. Go to chrome://extensions/
2. Click "Service worker" link under your extension
3. Check Console for errors
4. Look for network/permission issues

### 4. Content Script Issues

**Symptoms**:
- Page interactions not working
- Content script not injecting

**Solutions**:
- Check host_permissions in manifest
- Verify content script matches patterns
- Test with simpler sites first

## 🔧 Current Extension Status

### ✅ Permissions Granted:
- `storage` - Data persistence
- `tabs` - Tab monitoring  
- `webNavigation` - Page navigation tracking
- `activeTab` - Current tab access
- `notifications` - Productivity alerts
- `alarms` - Scheduled tasks ⭐ **NEWLY ADDED**

### ✅ Error Handling Added:
- Chrome API availability checks
- Graceful fallback for missing APIs
- Comprehensive try-catch blocks
- Console logging for debugging

### ✅ Robust Initialization:
- Settings loading with defaults
- Daily data management
- Event listener setup with error handling
- Alarm scheduling with fallbacks

## 🚀 Next Steps

1. **Load the Extension**:
   ```
   chrome://extensions/ → Developer mode → Load unpacked → Select 'dist' folder
   ```

2. **Test Core Features**:
   - Extension icon appears in toolbar
   - Popup opens without errors
   - Settings page accessible
   - Background script runs successfully

3. **Monitor for Issues**:
   - Check background page console: chrome://extensions/ → Service worker
   - Test website tracking functionality
   - Verify data persistence

## 🐛 Reporting Future Issues

If you encounter issues:
1. Check the background service worker console
2. Look for errors in browser DevTools (F12)
3. Note specific websites or actions that trigger problems
4. Check Chrome version compatibility

---

**Status**: ✅ **ISSUE RESOLVED** - Extension ready for testing!
