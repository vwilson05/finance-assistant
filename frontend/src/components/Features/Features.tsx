import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import FeatureCard from '../FeatureCard/FeatureCard';

const features = [
  {
    title: 'Personalized Strategy',
    description: 'Get investment strategies tailored to your goals and risk tolerance',
  },
  {
    title: 'AI-Powered Insights',
    description: 'Receive data-driven recommendations based on market analysis',
  },
  {
    title: 'Real-time Monitoring',
    description: 'Track your investments and get alerts for important market changes',
  },
];

const Features: React.FC = () => {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography
        component="h2"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Why Choose Our Financial Assistant?
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {features.map((feature) => (
          <Grid item key={feature.title} xs={12} sm={4}>
            <FeatureCard
              title={feature.title}
              description={feature.description}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features; 