import React, { useState } from 'react';
import './Dashboard.css';

// Mock data for demonstration
const mockPortfolioData = {
  totalValue: 125000,
  dailyChange: 1250,
  percentageChange: 1.01,
  assets: [
    { name: 'Stocks', value: 75000, percentage: 60 },
    { name: 'Bonds', value: 25000, percentage: 20 },
    { name: 'Cash', value: 15000, percentage: 12 },
    { name: 'Crypto', value: 10000, percentage: 8 },
  ]
};

const mockRecentActivity = [
  { id: 1, type: 'investment', description: 'Added $5,000 to Vanguard S&P 500 ETF', date: '2023-04-09' },
  { id: 2, type: 'alert', description: 'Market volatility alert: Consider rebalancing portfolio', date: '2023-04-08' },
  { id: 3, type: 'recommendation', description: 'New investment opportunity: Tech sector showing growth potential', date: '2023-04-07' },
];

const Dashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'day' ? 'active' : ''} 
            onClick={() => setTimeframe('day')}
          >
            Day
          </button>
          <button 
            className={timeframe === 'week' ? 'active' : ''} 
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''} 
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={timeframe === 'year' ? 'active' : ''} 
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Portfolio Overview Card */}
        <div className="dashboard-card portfolio-overview">
          <h2>Portfolio Overview</h2>
          <div className="portfolio-value">
            <span className="value">${mockPortfolioData.totalValue.toLocaleString()}</span>
            <span className={`change ${mockPortfolioData.dailyChange >= 0 ? 'positive' : 'negative'}`}>
              {mockPortfolioData.dailyChange >= 0 ? '+' : ''}
              ${Math.abs(mockPortfolioData.dailyChange).toLocaleString()} 
              ({mockPortfolioData.percentageChange >= 0 ? '+' : ''}{mockPortfolioData.percentageChange}%)
            </span>
          </div>
          <div className="asset-allocation">
            <h3>Asset Allocation</h3>
            <div className="allocation-bars">
              {mockPortfolioData.assets.map((asset) => (
                <div key={asset.name} className="allocation-item">
                  <div className="allocation-label">
                    <span>{asset.name}</span>
                    <span>{asset.percentage}%</span>
                  </div>
                  <div className="allocation-bar">
                    <div 
                      className="allocation-bar-fill" 
                      style={{ width: `${asset.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-button">
              <span className="action-icon">+</span>
              Add Investment
            </button>
            <button className="action-button">
              <span className="action-icon">↔</span>
              Rebalance
            </button>
            <button className="action-button">
              <span className="action-icon">📊</span>
              Generate Report
            </button>
            <button className="action-button">
              <span className="action-icon">💬</span>
              Ask AI Advisor
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="dashboard-card recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'investment' && '💰'}
                  {activity.type === 'alert' && '⚠️'}
                  {activity.type === 'recommendation' && '💡'}
                </div>
                <div className="activity-details">
                  <p className="activity-description">{activity.description}</p>
                  <p className="activity-date">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights Card */}
        <div className="dashboard-card market-insights">
          <h2>Market Insights</h2>
          <div className="insights-content">
            <p>Market data and insights will be displayed here.</p>
            <p>This section will show real-time market trends, economic indicators, and AI-generated insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 