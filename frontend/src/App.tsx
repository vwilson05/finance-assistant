import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import './App.css';

// Placeholder components for other pages
const Dashboard = () => <div className="page-container">Dashboard Page</div>;
const Profile = () => <div className="page-container">Profile Page</div>;
const Login = () => <div className="page-container">Login Page</div>;
const Register = () => <div className="page-container">Register Page</div>;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 