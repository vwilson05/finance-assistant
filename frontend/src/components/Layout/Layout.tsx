import React from 'react';
import Navigation from '../Navigation/Navigation';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Financial Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 