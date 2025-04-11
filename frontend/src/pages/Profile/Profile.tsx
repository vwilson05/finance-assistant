import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import './Profile.css';

// Mock user data
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinDate: 'January 2023',
  riskTolerance: 'Moderate',
  financialGoals: [
    { id: 1, name: 'Retirement', target: 1000000, current: 250000, deadline: '2035' },
    { id: 2, name: 'House Down Payment', target: 50000, current: 15000, deadline: '2025' },
    { id: 3, name: 'Emergency Fund', target: 25000, current: 10000, deadline: '2024' },
  ],
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
  }
};

const Profile: React.FC = () => {
  const { setOpenAIKey, hasOpenAIKey } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'goals' | 'preferences'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [openAIKey, setOpenAIKeyInput] = useState('');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isSavingKey, setIsSavingKey] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
    console.log('Saving user data:', userData);
  };

  const handleSaveOpenAIKey = async () => {
    if (!openAIKey.trim()) {
      setApiKeyError('OpenAI API key is required');
      return;
    }

    setIsSavingKey(true);
    setApiKeyError(null);

    try {
      const success = await setOpenAIKey(openAIKey);
      if (success) {
        setOpenAIKeyInput('');
      } else {
        setApiKeyError('Failed to save OpenAI API key. Please try again.');
      }
    } catch (error) {
      setApiKeyError('An error occurred while saving your API key. Please try again.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="profile">
      <header className="profile-header">
        <h1>Profile</h1>
        <div className="profile-tabs">
          <button 
            className={activeTab === 'personal' ? 'active' : ''} 
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button 
            className={activeTab === 'goals' ? 'active' : ''} 
            onClick={() => setActiveTab('goals')}
          >
            Financial Goals
          </button>
          <button 
            className={activeTab === 'preferences' ? 'active' : ''} 
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
      </header>

      <div className="profile-content">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className="info-card">
              <div className="info-group">
                <label>Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                ) : (
                  <p>{userData.name}</p>
                )}
              </div>
              
              <div className="info-group">
                <label>Email</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={userData.email} 
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>
              
              <div className="info-group">
                <label>Member Since</label>
                <p>{userData.joinDate}</p>
              </div>
              
              <div className="info-group">
                <label>Risk Tolerance</label>
                {isEditing ? (
                  <select 
                    value={userData.riskTolerance}
                    onChange={(e) => setUserData({...userData, riskTolerance: e.target.value})}
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                ) : (
                  <p>{userData.riskTolerance}</p>
                )}
              </div>

              <div className="info-group">
                <label>OpenAI API Key</label>
                <div className="api-key-section">
                  {hasOpenAIKey ? (
                    <div className="api-key-status">
                      <span className="status-indicator success"></span>
                      <span>API key is configured</span>
                    </div>
                  ) : (
                    <div className="api-key-input">
                      <input
                        type="password"
                        value={openAIKey}
                        onChange={(e) => setOpenAIKeyInput(e.target.value)}
                        placeholder="Enter your OpenAI API key"
                        disabled={isSavingKey}
                      />
                      <button
                        className="save-key-button"
                        onClick={handleSaveOpenAIKey}
                        disabled={isSavingKey || !openAIKey.trim()}
                      >
                        {isSavingKey ? 'Saving...' : 'Save API Key'}
                      </button>
                    </div>
                  )}
                  {apiKeyError && (
                    <div className="error-message">{apiKeyError}</div>
                  )}
                  <p className="api-key-help">
                    Your OpenAI API key is required to use AI-powered features. 
                    Get your key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI platform</a>.
                  </p>
                </div>
              </div>
              
              {isEditing && (
                <div className="action-buttons">
                  <button className="save-button" onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Goals Tab */}
        {activeTab === 'goals' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Financial Goals</h2>
              <button className="add-button">Add Goal</button>
            </div>
            
            <div className="goals-grid">
              {userData.financialGoals.map((goal) => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.name}</h3>
                    <span className="goal-deadline">Target: {goal.deadline}</span>
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
                  
                  <div className="goal-actions">
                    <button className="update-button">Update Progress</button>
                    <button className="edit-button">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Preferences</h2>
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className="preferences-card">
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Notifications</h3>
                  <p>Receive alerts about your investments and market changes</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={userData.preferences.notifications}
                    onChange={(e) => setUserData({
                      ...userData, 
                      preferences: {
                        ...userData.preferences,
                        notifications: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Email Updates</h3>
                  <p>Receive weekly summaries and insights via email</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={userData.preferences.emailUpdates}
                    onChange={(e) => setUserData({
                      ...userData, 
                      preferences: {
                        ...userData.preferences,
                        emailUpdates: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Dark Mode</h3>
                  <p>Use dark theme for the application</p>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={userData.preferences.darkMode}
                    onChange={(e) => setUserData({
                      ...userData, 
                      preferences: {
                        ...userData.preferences,
                        darkMode: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              {isEditing && (
                <div className="action-buttons">
                  <button className="save-button" onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 