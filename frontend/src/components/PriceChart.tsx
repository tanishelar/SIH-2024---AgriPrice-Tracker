import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Box, Typography, CircularProgress } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  commodity: string;
}

interface ChartDataPoint {
  dates: string[];
  prices: number[];
}

const PriceChart: React.FC<PriceChartProps> = ({ commodity }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint | null>(null);

  useEffect(() => {
    if (!commodity) return;
    
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/data?commodity=${commodity}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data: ChartDataPoint) => {
        setChartData(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching chart data:', err);
        setError('Failed to load price data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [commodity]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography color="error">{error || 'No data available'}</Typography>
      </Box>
    );
  }

  const data: ChartData<'line'> = {
    labels: chartData.dates.map(date => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: `${commodity} Price History`,
        data: chartData.prices,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#4CAF50',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: `${commodity} Price Trends`,
        color: '#ffffff',
        font: {
          size: 16,
          family: "'Montserrat', sans-serif",
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default PriceChart; 