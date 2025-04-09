import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Your Personal Financial Assistant</h1>
          <p className="hero-subtitle">
            AI-powered financial guidance to help you make smarter investment decisions
          </p>
          <div className="hero-cta">
            <Link to="/register" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Our Financial Assistant?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Personalized Strategy</h3>
            <p>Get investment strategies tailored to your goals and risk tolerance</p>
          </div>
          <div className="feature-card">
            <h3>AI-Powered Insights</h3>
            <p>Receive data-driven recommendations based on market analysis</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Monitoring</h3>
            <p>Track your investments and get alerts for important market changes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 