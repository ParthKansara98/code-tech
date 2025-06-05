# Productivity Tracker Chrome Extension

A comprehensive Chrome extension built with React that helps users track and enhance their personal productivity through intelligent website monitoring, goal setting, and detailed analytics.

## 🚀 Features

### Core Functionality
- **Daily Goals**: Set and track daily productivity targets
- **Website Monitoring**: Real-time tracking of time spent on websites using Chrome's tabs and webNavigation APIs
- **Smart Categorization**: Automatically categorizes websites as productive, distracting, or neutral
- **Activity Detection**: Tracks user activity to ensure accurate time measurement

### Dashboard & Analytics
- **Productivity Dashboard**: Full-featured React dashboard with interactive charts
- **Visual Analytics**: Bar and pie charts showing time distribution and website usage
- **Weekly Trends**: Track productivity patterns over time
- **Goal Comparison**: Visual comparison of daily goals vs actual activity

### Smart Notifications
- **Time Limit Alerts**: Notifications when exceeding predefined time limits on distracting websites
- **Productivity Reminders**: Customizable alerts to help maintain focus
- **Goal Achievement**: Celebrate when reaching productivity milestones

### Customization
- **Personalized Settings**: Customize which websites are considered productive or distracting
- **Flexible Goals**: Set personalized daily time targets
- **Theme Support**: Light and dark mode options
- **Notification Preferences**: Control when and how you receive alerts

## 📁 Project Structure

```
productivity-tracker-extension/
├── manifest.json                 # Chrome extension manifest (v3)
├── package.json                 # Dependencies and build scripts
├── webpack.config.js            # Build configuration
├── src/
│   ├── background/
│   │   └── background.js        # Service worker for tab monitoring
│   ├── popup/
│   │   ├── popup.html          # Popup interface
│   │   ├── popup.js            # Popup entry point
│   │   ├── PopupApp.js         # Main popup React component
│   │   └── popup.css           # Popup styles
│   ├── dashboard/
│   │   ├── dashboard.html      # Dashboard page
│   │   ├── dashboard.js        # Dashboard entry point
│   │   ├── DashboardApp.js     # Main dashboard React component
│   │   └── dashboard.css       # Dashboard styles
│   ├── options/
│   │   ├── options.html        # Settings page
│   │   ├── options.js          # Options entry point
│   │   ├── OptionsApp.js       # Settings React component
│   │   └── options.css         # Settings styles
│   ├── content/
│   │   └── content.js          # Content script for activity detection
│   ├── utils/
│   │   ├── storage.js          # Chrome storage API wrapper
│   │   ├── notifications.js    # Notification service
│   │   └── time.js             # Time formatting utilities
│   └── icons/                  # Extension icons (16, 32, 48, 128px)
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Chrome browser for testing

### Installation

1. **Clone or download the project**
   ```bash
   cd productivity-tracker-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `dist` folder
   - The extension should now appear in your Chrome toolbar

### Development Mode

For development with hot reloading:
```bash
npm run dev
```

This will watch for file changes and rebuild automatically. You'll need to refresh the extension in Chrome after changes.

## 🔧 Configuration

### Default Settings
The extension comes with sensible defaults:

**Productive Websites:**
- github.com
- stackoverflow.com
- docs.google.com

**Distracting Websites:**
- youtube.com
- facebook.com
- twitter.com
- instagram.com

**Daily Goals:**
- Productive time: 8 hours (480 minutes)
- Max distracting time: 1 hour (60 minutes)

### Customization
All settings can be customized through the extension's options page:
1. Right-click the extension icon
2. Select "Options"
3. Configure your preferred settings

## 📊 How It Works

### Website Tracking
- The background service worker monitors all tab activities
- Time is tracked when tabs are active and users are engaged
- Activity detection prevents idle time from being counted
- Data is categorized based on your website lists

### Data Storage
- Uses Chrome's sync storage for settings (syncs across devices)
- Daily data stored locally for performance
- Automatic daily reset at midnight
- Data persists until manually cleared

### Privacy
- All data stays local to your browser
- No external servers or analytics
- No personal browsing data is transmitted
- You have full control over your data

## 🎯 Usage Tips

### Maximizing Effectiveness
1. **Customize Website Lists**: Add your frequently used work sites to the productive list
2. **Set Realistic Goals**: Start with achievable targets and adjust as needed
3. **Use Notifications Wisely**: Set time limits that give you awareness without being disruptive
4. **Review Weekly Trends**: Check the dashboard regularly to identify patterns

### Best Practices
- Review and update your website categorizations monthly
- Use the dashboard to identify your most productive times of day
- Set gradual improvements to your daily goals
- Use the notification system to build better habits

## 🔨 Development

### Technologies Used
- **React 18**: Modern UI components
- **Chart.js**: Data visualization
- **Webpack**: Build system and bundling
- **Chrome Extension APIs**: Tabs, Storage, Notifications, WebNavigation
- **CSS Grid/Flexbox**: Responsive layouts

### Building Features
The extension is designed to be modular and extensible:

- **Adding new chart types**: Extend the dashboard components
- **Custom notification types**: Modify the notification service
- **Additional tracking metrics**: Extend the background script
- **UI improvements**: Update the React components and CSS

### Testing
- Test in Chrome with Developer Mode enabled
- Use Chrome DevTools for debugging
- Check the extension's background page for service worker logs
- Verify permissions are working correctly

## 📱 Browser Compatibility

- **Chrome**: Fully supported (v88+)
- **Edge**: Compatible (Chromium-based)
- **Other browsers**: Not supported (uses Chrome-specific APIs)

## 🔒 Permissions Explained

The extension requests the following permissions:

- **`storage`**: Save your settings and tracking data
- **`tabs`**: Monitor active tabs for time tracking
- **`webNavigation`**: Detect when you navigate to different websites
- **`activeTab`**: Know which tab is currently active
- **`notifications`**: Show productivity alerts
- **`<all_urls>`**: Track time across all websites you visit

## 🚨 Troubleshooting

### Common Issues

**Extension not tracking time:**
- Check that the extension has proper permissions
- Verify you're actively using the browser (not just idle)
- Check if the website is loading properly

**Data not saving:**
- Ensure Chrome sync is enabled in your browser
- Check available storage space
- Try refreshing the extension

**Charts not displaying:**
- Ensure you have some tracked data first
- Check browser console for JavaScript errors
- Try refreshing the dashboard page

### Getting Help
1. Check the browser console for error messages
2. Verify all files built correctly in the `dist` folder
3. Ensure all required permissions are granted
4. Try disabling and re-enabling the extension

## 📈 Future Enhancements

Potential features for future versions:
- Export data to CSV/JSON
- Integration with productivity apps
- Advanced analytics and insights
- Team/collaborative features
- Mobile companion app
- AI-powered productivity suggestions

## 📄 License

MIT License - feel free to modify and distribute as needed.

---

**Happy productivity tracking! 🎯**
