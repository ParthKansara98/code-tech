import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { StorageService } from '../utils/storage';
import { TimeUtils } from '../utils/time';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardApp = () => {
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('today');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toDateString();
      const [todayData, config, allData] = await Promise.all([
        StorageService.get(`dailyData_${today}`),
        StorageService.get('settings'),
        StorageService.getAll()
      ]);

      setDailyData(todayData || {
        websites: {},
        totalProductiveTime: 0,
        totalDistractingTime: 0,
        goals: { productiveTime: 480, maxDistractingTime: 60 }
      });

      setSettings(config || {
        dailyGoals: { productiveTime: 480, maxDistractingTime: 60 },
        theme: 'light'
      });

      setTheme(config?.theme || 'light');

      // Load weekly data
      const weekDays = TimeUtils.getWeekDays();
      const weekly = weekDays.map(day => {
        const dayKey = `dailyData_${day}`;
        return allData[dayKey] || { 
          date: day, 
          totalProductiveTime: 0, 
          totalDistractingTime: 0,
          websites: {}
        };
      });
      setWeeklyData(weekly);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const updatedSettings = { ...settings, theme: newTheme };
    setSettings(updatedSettings);
    await StorageService.set('settings', updatedSettings);
  };

  if (loading) {
    return (
      <div className={`dashboard-container ${theme}`}>
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${theme}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Productivity Dashboard</h1>
          <div className="header-actions">
            <div className="view-selector">
              <button 
                className={`view-btn ${activeView === 'today' ? 'active' : ''}`}
                onClick={() => setActiveView('today')}
              >
                Today
              </button>
              <button 
                className={`view-btn ${activeView === 'week' ? 'active' : ''}`}
                onClick={() => setActiveView('week')}
              >
                This Week
              </button>
            </div>
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {activeView === 'today' ? (
          <TodayView dailyData={dailyData} settings={settings} />
        ) : (
          <WeekView weeklyData={weeklyData} settings={settings} />
        )}
      </main>
    </div>
  );
};

const TodayView = ({ dailyData, settings }) => {
  const totalTime = dailyData.totalProductiveTime + dailyData.totalDistractingTime;
  
  // Prepare chart data
  const categoryData = {
    labels: ['Productive', 'Distracting', 'Neutral'],
    datasets: [{
      data: [
        dailyData.totalProductiveTime,
        dailyData.totalDistractingTime,
        Math.max(0, totalTime - dailyData.totalProductiveTime - dailyData.totalDistractingTime)
      ],
      backgroundColor: ['#28a745', '#dc3545', '#6c757d'],
      borderWidth: 0
    }]
  };

  const websiteEntries = Object.entries(dailyData.websites || {})
    .sort(([,a], [,b]) => b.time - a.time)
    .slice(0, 10);

  const websiteData = {
    labels: websiteEntries.map(([domain]) => domain.length > 20 ? domain.substring(0, 17) + '...' : domain),
    datasets: [{
      label: 'Time (minutes)',
      data: websiteEntries.map(([,data]) => data.time),
      backgroundColor: websiteEntries.map(([,data]) => {
        if (data.category === 'productive') return '#28a745';
        if (data.category === 'distracting') return '#dc3545';
        return '#6c757d';
      }),
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return TimeUtils.formatMinutes(value);
          }
        }
      }
    }
  };

  return (
    <div className="today-view">
      <div className="stats-grid">
        <StatCard 
          title="Productive Time" 
          value={TimeUtils.formatMinutes(dailyData.totalProductiveTime)}
          goal={TimeUtils.formatMinutes(settings.dailyGoals?.productiveTime || 480)}
          type="productive"
          progress={(dailyData.totalProductiveTime / (settings.dailyGoals?.productiveTime || 480)) * 100}
        />
        <StatCard 
          title="Distracting Time" 
          value={TimeUtils.formatMinutes(dailyData.totalDistractingTime)}
          goal={TimeUtils.formatMinutes(settings.dailyGoals?.maxDistractingTime || 60)}
          type="distracting"
          progress={(dailyData.totalDistractingTime / (settings.dailyGoals?.maxDistractingTime || 60)) * 100}
        />
        <StatCard 
          title="Total Active Time" 
          value={TimeUtils.formatMinutes(totalTime)}
          type="neutral"
        />
        <StatCard 
          title="Productivity Score" 
          value={`${totalTime > 0 ? Math.round((dailyData.totalProductiveTime / totalTime) * 100) : 0}%`}
          type="score"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Time Distribution</h3>
          <div className="chart-container">
            {totalTime > 0 ? (
              <Pie data={categoryData} options={chartOptions} />
            ) : (
              <div className="no-data">No activity data for today</div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Websites</h3>
          <div className="chart-container">
            {websiteEntries.length > 0 ? (
              <Bar data={websiteData} options={barChartOptions} />
            ) : (
              <div className="no-data">No website data for today</div>
            )}
          </div>
        </div>
      </div>

      <div className="timeline-card">
        <h3>Today's Timeline</h3>
        <Timeline websites={dailyData.websites} />
      </div>
    </div>
  );
};

const WeekView = ({ weeklyData, settings }) => {
  const weeklyChartData = {
    labels: weeklyData.map(day => TimeUtils.formatDate(day.date)),
    datasets: [
      {
        label: 'Productive Time',
        data: weeklyData.map(day => day.totalProductiveTime || 0),
        backgroundColor: '#28a745',
        borderWidth: 0
      },
      {
        label: 'Distracting Time',
        data: weeklyData.map(day => day.totalDistractingTime || 0),
        backgroundColor: '#dc3545',
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return TimeUtils.formatMinutes(value);
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="week-view">
      <div className="week-stats">
        <StatCard 
          title="Weekly Productive Time" 
          value={TimeUtils.formatMinutes(weeklyData.reduce((sum, day) => sum + (day.totalProductiveTime || 0), 0))}
          type="productive"
        />
        <StatCard 
          title="Weekly Distracting Time" 
          value={TimeUtils.formatMinutes(weeklyData.reduce((sum, day) => sum + (day.totalDistractingTime || 0), 0))}
          type="distracting"
        />
        <StatCard 
          title="Average Daily Productive" 
          value={TimeUtils.formatMinutes(Math.round(weeklyData.reduce((sum, day) => sum + (day.totalProductiveTime || 0), 0) / 7))}
          type="neutral"
        />
      </div>

      <div className="week-chart">
        <div className="chart-card">
          <h3>Weekly Activity</h3>
          <div className="chart-container large">
            <Bar data={weeklyChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, goal, type, progress }) => (
  <div className={`stat-card ${type}`}>
    <h4>{title}</h4>
    <div className="stat-value">{value}</div>
    {goal && <div className="stat-goal">Goal: {goal}</div>}
    {progress !== undefined && (
      <div className="progress-bar">
        <div 
          className={`progress-fill ${progress > 100 ? 'over-limit' : ''}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    )}
  </div>
);

const Timeline = ({ websites }) => {
  const websiteEntries = Object.entries(websites || {})
    .sort(([,a], [,b]) => b.time - a.time);

  if (websiteEntries.length === 0) {
    return <div className="no-data">No timeline data available</div>;
  }

  return (
    <div className="timeline">
      {websiteEntries.map(([domain, data]) => (
        <div key={domain} className="timeline-item">
          <div className={`timeline-dot ${data.category}`}></div>
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-domain">{domain}</span>
              <span className="timeline-time">{TimeUtils.formatMinutes(data.time)}</span>
            </div>
            <div className="timeline-details">
              <span className={`timeline-category ${data.category}`}>
                {data.category}
              </span>
              <span className="timeline-visits">{data.visits} visits</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardApp;
