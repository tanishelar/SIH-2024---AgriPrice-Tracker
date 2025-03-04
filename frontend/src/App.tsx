import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StatsCard from './components/StatsCard';
import PriceChart from './components/PriceChart';
import PredictionForm from './components/PredictionForm';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import TimelineIcon from '@mui/icons-material/Timeline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 800,
    },
    h4: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111111',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#111111',
        },
      },
    },
  },
});

function App() {
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [commodities, setCommodities] = useState<string[]>([]);
  const [stats, setStats] = useState({
    current: 0,
    average: 0,
    highest: 0,
    lowest: 0
  });

  useEffect(() => {
    // Fetch available commodities
    fetch('http://localhost:5000/api/commodities')
      .then(res => res.json())
      .then(data => {
        setCommodities(data);
        if (data.length > 0) {
          setSelectedCommodity(data[0]); // Set the first commodity as default
        }
      })
      .catch(error => {
        console.error('Error fetching commodities:', error);
      });
  }, []);

  useEffect(() => {
    if (!selectedCommodity) return;
    
    // Fetch stats for selected commodity
    fetch(`http://localhost:5000/api/stats?commodity=${selectedCommodity}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
      });
  }, [selectedCommodity]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 4,
          backgroundImage: 'linear-gradient(to bottom right, rgba(76, 175, 80, 0.05), rgba(33, 150, 243, 0.05))',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" sx={{ 
                background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
              }}>
                AgriPrice Predictor
              </Typography>
              <TimelineIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
              Predict Agricultural Commodity Prices with AI-ML
            </Typography>

            <Paper 
              elevation={3} 
              sx={{ 
                display: 'inline-block', 
                p: 2, 
                mb: 4,
                background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Commodity</InputLabel>
                <Select
                  value={selectedCommodity}
                  label="Select Commodity"
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                >
                  {commodities.map(commodity => (
                    <MenuItem key={commodity} value={commodity}>
                      {commodity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Current Price" type="current" amount={stats.current} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Average Price" type="average" amount={stats.average} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Highest Price" type="highest" amount={stats.highest} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard title="Lowest Price" type="lowest" amount={stats.lowest} />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <PriceChart commodity={selectedCommodity} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <PredictionForm commodity={selectedCommodity} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
