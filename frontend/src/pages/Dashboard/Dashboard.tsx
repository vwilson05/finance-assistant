import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { financialService, FinancialProfile, FinancialPlan } from '../../services/financialService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile | null>(null);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [profileData, planData] = await Promise.all([
          financialService.getFinancialProfile(),
          financialService.getFinancialPlan().catch(err => {
            console.warn('Failed to fetch financial plan:', err);
            return null; // Continue even if plan fetch fails
          })
        ]);
        
        setFinancialProfile(profileData);
        setFinancialPlan(planData);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load financial data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p>Your financial overview at a glance</p>
      </div>

      <div className="dashboard-grid">
        {/* Financial Summary Card */}
        <div className="dashboard-card summary-card">
          <h2>Financial Summary</h2>
          {financialProfile && (
            <div className="summary-content">
              <div className="summary-item">
                <span className="label">Monthly Income</span>
                <span className="value">{formatCurrency(financialProfile.monthlyIncome)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Monthly Expenses</span>
                <span className="value">{formatCurrency(financialProfile.monthlyExpenses)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Monthly Savings</span>
                <span className="value highlight">
                  {formatCurrency(financialProfile.monthlyIncome - financialProfile.monthlyExpenses)}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Savings Rate</span>
                <span className="value">
                  {((financialProfile.monthlyIncome - financialProfile.monthlyExpenses) / financialProfile.monthlyIncome * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Assets & Liabilities Card */}
        <div className="dashboard-card assets-card">
          <h2>Assets & Liabilities</h2>
          {financialProfile && (
            <div className="assets-content">
              <div className="assets-section">
                <h3>Assets</h3>
                <div className="assets-item">
                  <span className="label">Total Savings</span>
                  <span className="value">{formatCurrency(financialProfile.totalSavings)}</span>
                </div>
                <div className="assets-item">
                  <span className="label">Investment Balance</span>
                  <span className="value">{formatCurrency(financialProfile.investmentBalance)}</span>
                </div>
                <div className="assets-item total">
                  <span className="label">Total Assets</span>
                  <span className="value highlight">
                    {formatCurrency(financialProfile.totalSavings + financialProfile.investmentBalance)}
                  </span>
                </div>
              </div>
              <div className="liabilities-section">
                <h3>Liabilities</h3>
                <div className="liabilities-item">
                  <span className="label">Total Debt</span>
                  <span className="value">{formatCurrency(financialProfile.totalDebt)}</span>
                </div>
                <div className="liabilities-item total">
                  <span className="label">Net Worth</span>
                  <span className={`value ${(financialProfile.totalSavings + financialProfile.investmentBalance - financialProfile.totalDebt) >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(financialProfile.totalSavings + financialProfile.investmentBalance - financialProfile.totalDebt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financial Goals Card */}
        <div className="dashboard-card goals-card">
          <h2>Financial Goals</h2>
          {financialProfile?.financialGoals?.length ? (
            <div className="goals-content">
              {financialProfile.financialGoals.slice(0, 3).map(goal => (
                <div key={goal.id || goal.name} className="goal-item">
                  <div className="goal-header">
                    <h3>{goal.name}</h3>
                    <span className={`goal-status ${goal.completed ? 'completed' : 'in-progress'}`}>
                      {goal.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                      ></div>
                    </div>
                    <div className="progress-details">
                      <span>{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                      <span>{calculateProgress(goal.current, goal.target)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {financialProfile.financialGoals.length > 3 && (
                <div className="view-more">
                  <Link to="/financial-plan">View All Goals</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-goals">
              <p>You haven't set any financial goals yet.</p>
              <Link to="/financial-plan" className="create-goal-button">Create Your First Goal</Link>
            </div>
          )}
        </div>

        {/* Financial Plan Card */}
        <div className="dashboard-card plan-card">
          <h2>Financial Plan</h2>
          {financialPlan ? (
            <div className="plan-content">
              <div className="plan-header">
                <h3>{financialPlan.name}</h3>
                <p>{financialPlan.description}</p>
              </div>
              <div className="plan-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress(financialPlan.progress.currentAmount, financialPlan.targetAmount)}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span>{formatCurrency(financialPlan.progress.currentAmount)} / {formatCurrency(financialPlan.targetAmount)}</span>
                  <span>{calculateProgress(financialPlan.progress.currentAmount, financialPlan.targetAmount)}%</span>
                </div>
              </div>
              <div className="plan-actions">
                <Link to="/financial-plan" className="view-plan-button">View Full Plan</Link>
              </div>
            </div>
          ) : (
            <div className="empty-plan">
              <p>You don't have a financial plan yet.</p>
              <Link to="/financial-plan" className="create-plan-button">Create Your Plan</Link>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <h2>Quick Actions</h2>
          <div className="actions-content">
            <Link to="/chat" className="action-button chat-button">
              <span className="action-icon">💬</span>
              <span className="action-label">Chat with AI Advisor</span>
            </Link>
            <Link to="/financial-plan" className="action-button plan-button">
              <span className="action-icon">📊</span>
              <span className="action-label">View Financial Plan</span>
            </Link>
            <Link to="/profile" className="action-button profile-button">
              <span className="action-icon">👤</span>
              <span className="action-label">Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 