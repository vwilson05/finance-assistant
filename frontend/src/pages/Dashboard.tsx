import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Financial Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Assets</Typography>
              </Box>
              <Typography variant="h4">$50,000</Typography>
              <Typography color="textSecondary">Last updated: Today</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Growth</Typography>
              </Box>
              <Typography variant="h4">+5.2%</Typography>
              <Typography color="textSecondary">vs. last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Score</Typography>
              </Box>
              <Typography variant="h4">Moderate</Typography>
              <Typography color="textSecondary">Based on your profile</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary">
              Update Financial Profile
            </Button>
            <Button variant="outlined" color="primary">
              Generate New Strategy
            </Button>
            <Button variant="outlined" color="primary">
              Chat with Assistant
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 