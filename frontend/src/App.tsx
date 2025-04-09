import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './styles/theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinancialProfile from './pages/FinancialProfile';
import Strategies from './pages/Strategies';
import Chat from './pages/Chat';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/financial-profile" element={<FinancialProfile />} />
              <Route path="/strategies" element={<Strategies />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 