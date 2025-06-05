# How to Load Your Chrome Extension

## Step 1: Build the Extension
The extension has been built and is ready to load. The built files are in the `dist/` folder.

## Step 2: Load in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle switch in the top right corner)
4. Click "Load unpacked" button
5. Select the `dist` folder from this project directory: `c:\code-tech\week-4\dist`
6. The extension should now appear in your extensions list and toolbar

## Step 3: Grant Permissions
When you first load the extension, Chrome may ask for permissions:
- **Storage**: To save your settings and tracking data
- **Tabs**: To monitor which tabs are active
- **Web Navigation**: To track website visits
- **Notifications**: To show productivity alerts
- **All URLs**: To track time across all websites

Click "Allow" for all permissions to enable full functionality.

## Step 4: Test the Extension
1. **Click the extension icon** in the Chrome toolbar to open the popup
2. **Visit some websites** to start tracking time
3. **Open the dashboard** by clicking the chart icon in the popup
4. **Configure settings** by right-clicking the extension icon and selecting "Options"

## Development Mode
To work on the extension with automatic rebuilding:
1. Run the "Watch Chrome Extension" task from VS Code's Command Palette (Ctrl+Shift+P)
2. Or run: `npm run dev` in the terminal
3. After making changes, go to `chrome://extensions/` and click the refresh icon on your extension

## Troubleshooting
- **Extension not working**: Check the Chrome DevTools console for errors
- **Time not tracking**: Ensure all permissions are granted
- **Changes not visible**: Refresh the extension in Chrome after rebuilding
- **Build errors**: Check the terminal output and ensure all dependencies are installed

## Features to Test
- ✅ Time tracking on different websites
- ✅ Daily goal setting and progress tracking
- ✅ Productivity dashboard with charts
- ✅ Website categorization (productive/distracting)
- ✅ Smart notifications for time limits
- ✅ Dark/light theme toggle
- ✅ Settings customization

Enjoy tracking your productivity! 🚀
