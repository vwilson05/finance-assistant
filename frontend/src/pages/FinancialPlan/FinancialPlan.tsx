import React, { useState, useEffect } from 'react';
import { financialService, FinancialProfile, FinancialPlan, AIInsights } from '../../services/financialService';
import './FinancialPlan.css';

// Define message type
type MessageRole = 'user' | 'assistant';
interface ChatMessage {
  role: MessageRole;
  content: string;
}

const FinancialPlanPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile | null>(null);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Fetch financial data on component mount
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch financial profile
        const profile = await financialService.getFinancialProfile();
        setFinancialProfile(profile);
        
        // Fetch financial plan
        const plan = await financialService.getFinancialPlan();
        setFinancialPlan(plan);
        
        // Fetch AI insights
        const insights = await financialService.getAIInsights();
        setAIInsights(insights);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
        setError('Failed to load financial data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserMessage('');
    
    // Simulate AI response (in a real app, this would call the API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: 'I understand your question. Let me analyze your financial data and provide a personalized response.'
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your financial data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeStep) {
      case 1:
        return (
          <div className="profile-step">
            <h2>Your Financial Profile</h2>
            {financialProfile && (
              <div className="profile-details">
                <div className="profile-section">
                  <h3>Income & Expenses</h3>
                  <div className="profile-grid">
                    <div className="profile-item">
                      <span className="label">Monthly Income:</span>
                      <span className="value">${financialProfile.monthlyIncome.toLocaleString()}</span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Monthly Expenses:</span>
                      <span className="value">${financialProfile.monthlyExpenses.toLocaleString()}</span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Savings Rate:</span>
                      <span className="value">
                        {((financialProfile.monthlyIncome - financialProfile.monthlyExpenses) / financialProfile.monthlyIncome * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h3>Assets & Liabilities</h3>
                  <div className="profile-grid">
                    <div className="profile-item">
                      <span className="label">Total Savings:</span>
                      <span className="value">${financialProfile.totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Total Debt:</span>
                      <span className="value">${financialProfile.totalDebt.toLocaleString()}</span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Investment Balance:</span>
                      <span className="value">${financialProfile.investmentBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h3>Risk Tolerance</h3>
                  <div className="risk-tolerance">
                    <span className={`risk-badge ${financialProfile.riskTolerance.toLowerCase()}`}>
                      {financialProfile.riskTolerance}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="goals-step">
            <h2>Your Financial Goals</h2>
            {financialProfile && (
              <div className="goals-container">
                {financialProfile.financialGoals.map(goal => (
                  <div key={goal.id} className="goal-card">
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
                        <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                        <span>{calculateProgress(goal.current, goal.target)}%</span>
                      </div>
                    </div>
                    <div className="goal-deadline">
                      <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="plan-step">
            <h2>Your Financial Plan</h2>
            {financialPlan && (
              <div className="plan-details">
                <div className="plan-header">
                  <h3>{financialPlan.name}</h3>
                  <p>{financialPlan.description}</p>
                </div>
                
                <div className="plan-section">
                  <h3>Recommendations</h3>
                  <div className="recommendations-list">
                    {financialPlan.recommendations.map(rec => (
                      <div key={rec.id} className="recommendation-item">
                        <div className="recommendation-header">
                          <span className="recommendation-action">{rec.action}</span>
                          <span className={`priority-badge priority-${rec.priority}`}>
                            Priority {rec.priority}
                          </span>
                        </div>
                        <div className="recommendation-details">
                          <span>Timeframe: {rec.timeframe}</span>
                          <span className={`impact-badge impact-${rec.expectedImpact.toLowerCase()}`}>
                            {rec.expectedImpact} Impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="plan-section">
                  <h3>Milestones</h3>
                  <div className="milestones-list">
                    {financialPlan.milestones.map(milestone => (
                      <div key={milestone.id} className="milestone-item">
                        <div className="milestone-checkbox">
                          <input 
                            type="checkbox" 
                            checked={milestone.completed} 
                            readOnly 
                          />
                        </div>
                        <div className="milestone-content">
                          <span className="milestone-description">{milestone.description}</span>
                          <span className="milestone-date">
                            Target: {new Date(milestone.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="plan-progress">
                  <h3>Overall Progress</h3>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${calculateProgress(financialPlan.progress.currentAmount, financialPlan.targetAmount)}%` }}
                      ></div>
                    </div>
                    <div className="progress-details">
                      <span>${financialPlan.progress.currentAmount.toLocaleString()} / ${financialPlan.targetAmount.toLocaleString()}</span>
                      <span>{calculateProgress(financialPlan.progress.currentAmount, financialPlan.targetAmount)}%</span>
                    </div>
                  </div>
                  <p className="progress-notes">{financialPlan.progress.notes}</p>
                  <p className="progress-date">Last updated: {new Date(financialPlan.progress.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="insights-step">
            <h2>AI Insights</h2>
            {aiInsights && (
              <div className="insights-container">
                <div className="insight-section">
                  <h3>Understanding Your Financial Situation</h3>
                  <p>{aiInsights.understanding}</p>
                </div>
                
                <div className="insight-section">
                  <h3>Personalized Suggestions</h3>
                  <ul className="suggestions-list">
                    {aiInsights.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="insight-section">
                  <h3>Market Insights</h3>
                  <ul className="market-insights-list">
                    {aiInsights.marketInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      
      case 5:
        return (
          <div className="chat-step">
            <h2>Ask Your Financial Assistant</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {chatHistory.length === 0 ? (
                  <div className="empty-chat">
                    <p>Ask a question about your financial plan or get personalized advice.</p>
                    <div className="suggested-questions">
                      <h4>Suggested Questions:</h4>
                      <ul>
                        <li onClick={() => setUserMessage("How can I improve my savings rate?")}>
                          How can I improve my savings rate?
                        </li>
                        <li onClick={() => setUserMessage("What's the best way to pay off my debt?")}>
                          What's the best way to pay off my debt?
                        </li>
                        <li onClick={() => setUserMessage("Should I invest more in my retirement account?")}>
                          Should I invest more in my retirement account?
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message ${message.role}`}>
                      <div className="message-content">{message.content}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Ask a question about your finances..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="financial-plan-container">
      <div className="financial-plan-header">
        <h1>Financial Plan</h1>
        <p>Your personalized financial roadmap to achieve your goals</p>
      </div>
      
      <div className="financial-plan-steps">
        <div className="steps-indicator">
          <div 
            className={`step-indicator ${activeStep >= 1 ? 'active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span className="step-number">1</span>
            <span className="step-label">Profile</span>
          </div>
          <div 
            className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className="step-number">2</span>
            <span className="step-label">Goals</span>
          </div>
          <div 
            className={`step-indicator ${activeStep >= 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
          >
            <span className="step-number">3</span>
            <span className="step-label">Plan</span>
          </div>
          <div 
            className={`step-indicator ${activeStep >= 4 ? 'active' : ''}`}
            onClick={() => setActiveStep(4)}
          >
            <span className="step-number">4</span>
            <span className="step-label">Insights</span>
          </div>
          <div 
            className={`step-indicator ${activeStep >= 5 ? 'active' : ''}`}
            onClick={() => setActiveStep(5)}
          >
            <span className="step-number">5</span>
            <span className="step-label">Chat</span>
          </div>
        </div>
        
        <div className="step-content">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanPage; 