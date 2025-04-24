import React, { memo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Container } from '@mui/material';
import Box from '@mui/material/Box';

const PieChartComponent = memo(function PieChartComponent({ data, title }) {
  return (
    <Container>
      <Box sx={{ 
            display: 'flex',
            justifyContent: 'center', 
            flexDirection: 'column', // Change flex direction to column
            alignItems: 'center', // Center items horizontally
            mt: 2 }}>
        <Typography variant="h5" sx={{ mt: 4 }}>
            {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <PieChart
              colors={['#50881f', '#6f8400', '#8c7d00', '#a97300', '#c56400', '#de511a', '#f2363d', '#ff0761']}
              series={[
              {
                  data: data,
                  arcLabel: (item) => item.label,
                  arcLabelMinAngle: 20,
                  innerRadius: 50,
                  outerRadius: 150,
                  paddingAngle: 5,
                  cornerRadius: 10,
                  cx: 270,
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