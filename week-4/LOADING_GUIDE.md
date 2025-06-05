# Chrome Extension Loading Guide

## Quick Start

Your Productivity Tracker Chrome Extension is ready to load! Follow these steps:

### 1. Open Chrome Extension Management

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Or use the menu: Chrome Menu → More Tools → Extensions

### 2. Enable Developer Mode

1. In the top-right corner, toggle **"Developer mode"** ON
2. You'll see new buttons appear: "Load unpacked", "Pack extension", "Update"

### 3. Load the Extension

1. Click **"Load unpacked"**
2. Navigate to your project folder: `c:\code-tech\week-4\dist`
3. Select the `dist` folder and click **"Select Folder"**

### 4. Verify Installation

You should see:
- ✅ **Productivity Tracker** extension appear in your extensions list
- ✅ Extension icon in the Chrome toolbar (top-right)
- ✅ No error messages

### 5. Test the Extension

1. **Click the extension icon** in the toolbar to open the popup
2. **Right-click the icon** → Options to open settings
3. **Visit different websites** to test time tracking
4. **Check the dashboard** by clicking "View Dashboard" in the popup

## Troubleshooting

### Common Issues

**Extension won't load:**
- Ensure you selected the `dist` folder, not the root project folder
- Check that `manifest.json` exists in the `dist` folder

**Service worker errors:**
- Check Chrome DevTools → Extensions → Background page
- Look for console errors and report them

**Permissions issues:**
- The extension requests minimal permissions (tabs, storage, webNavigation)
- These are required for time tracking functionality

### Development Mode

**To enable development features:**
1. Run `npm run dev` in the project directory
2. This starts webpack in watch mode
3. Changes will auto-rebuild (you'll need to click "Update" in chrome://extensions/)

## Features to Test

### ✅ Core Functionality
- [ ] Extension loads without errors
- [ ] Popup opens and displays current stats
- [ ] Website time tracking works
- [ ] Daily goals display correctly
- [ ] Settings page opens and saves changes

### ✅ Advanced Features
- [ ] Dashboard charts render properly
- [ ] Notifications appear for distracting websites
- [ ] Theme switching works
- [ ] Data export/import functions
- [ ] Website categorization works

## Data Storage

The extension stores data in Chrome's sync storage:
- **Daily data**: `dailyData_[date]` keys
- **Settings**: `settings` key
- **Historical data**: Automatically maintained

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the extension background page for service worker issues
3. Review the manifest.json for configuration problems

## Next Steps

Once the extension is loaded successfully:
1. Configure your productive/distracting websites in Settings
2. Set daily goals for productive time
3. Enable notifications if desired
4. Start browsing to see time tracking in action!

---

**Extension Status**: ✅ Built and ready to load
**Build Output**: Located in `c:\code-tech\week-4\dist\`
**Version**: 1.0.0
