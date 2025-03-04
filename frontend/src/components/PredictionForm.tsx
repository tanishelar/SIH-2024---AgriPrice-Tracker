import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface PredictionFormProps {
  commodity: string;
}

interface PredictionResponse {
  dates: string[];
  predictions: number[];
}

const PredictionForm: React.FC<PredictionFormProps> = ({ commodity }) => {
  const [months, setMonths] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const theme = useTheme();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ months, commodity }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TimelineIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Price Prediction
        </Typography>
      </Box>
      
      <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
        Predict {commodity} prices for the next {months} month{months > 1 ? 's' : ''}
      </Typography>
      
      <Box sx={{ px: 2, mb: 4 }}>
        <Slider
          value={months}
          onChange={(_, value) => setMonths(value as number)}
          min={1}
          max={12}
          marks
          step={1}
          valueLabelDisplay="auto"
          sx={{
            '& .MuiSlider-markLabel': {
              color: 'text.secondary',
            },
            '& .MuiSlider-valueLabel': {
              background: theme.palette.primary.main,
            },
          }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
        sx={{
          mb: 3,
          py: 1.5,
          background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #45a049 30%, #1976d2 90%)',
          },
        }}
        startIcon={loading ? undefined : <TrendingUpIcon />}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Prediction'}
      </Button>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-icon': {
              color: theme.palette.error.main,
            },
          }}
        >
          {error}
        </Alert>
      )}

      {prediction && (
        <Alert 
          severity="success"
          sx={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            '& .MuiAlert-icon': {
              color: theme.palette.success.main,
            },
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
            Predicted prices for {commodity}:
          </Typography>
          <Box sx={{ mt: 1 }}>
            {prediction.dates.map((date, index) => (
              <Box 
                key={date} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.5,
                  borderBottom: index !== prediction.dates.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {new Date(date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                  ₹{prediction.predictions[index].toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default PredictionForm; 