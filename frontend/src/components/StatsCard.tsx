import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface StatsCardProps {
  title: string;
  type: 'current' | 'average' | 'highest' | 'lowest';
  amount: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, type, amount }) => {
  const getIcon = () => {
    switch (type) {
      case 'current':
        return <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'average':
        return <TimelineIcon sx={{ fontSize: 40, color: 'info.main' }} />;
      case 'highest':
        return <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />;
      case 'lowest':
        return <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main' }} />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'current':
        return 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%)';
      case 'average':
        return 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.2) 100%)';
      case 'highest':
        return 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%)';
      case 'lowest':
        return 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.2) 100%)';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'current':
        return 'primary.main';
      case 'average':
        return 'info.main';
      case 'highest':
        return 'success.main';
      case 'lowest':
        return 'error.main';
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        background: getGradient(),
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 8px 24px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
        },
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          mb: 2,
        }}
      >
        {getIcon()}
      </Box>
      <Typography
        variant="h6"
        component="div"
        sx={{
          mb: 1,
          fontWeight: 600,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: getColor(),
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          ₹{amount.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatsCard; 