import React, { memo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Container } from '@mui/material';
import Box from '@mui/material/Box';
import dayjs from 'dayjs'; // Import dayjs

const PieChartComponent = memo(function PieChartComponent({ data }) {
    const currentMonthYear = dayjs().format('MMMM YYYY'); // Format the current date
  return (
    <Container>
      <Box sx={{ 
            display: 'flex',
            justifyContent: 'center', 
            flexDirection: 'column', // Change flex direction to column
            alignItems: 'center', // Center items horizontally
            mt: 2 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>
            {currentMonthYear} {/* Display the current month and year */}
        </Typography>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <PieChart
            colors={['#50881f', '#6f8400', '#8c7d00', '#a97300', '#c56400', '#de511a', '#f2363d', '#ff0761']}
            series={[
            {
                data: data,
                arcLabel: (item) => item.label,
                arcLabelMinAngle: 35,
                arcLabelRadius: '60%',
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
            ]}
            width={550}
            height={350}
        />
      </Box>
    </Container>
  );
});

export default PieChartComponent;