import React, { memo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Container, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const PieChartComponent = memo(function PieChartComponent({ data, title }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Set larger size for desktop, smaller for mobile/tablet
  const chartWidth = isDesktop ? 470 : Math.min(window.innerWidth - 20, 400);
  const chartHeight = isDesktop ? 380 : Math.min(window.innerWidth - 40, 260);

  return (
    <Container>
      <Box sx={{ 
            display: 'flex',
            justifyContent: 'center', 
            flexDirection: 'column', // Change flex direction to column
            alignItems: 'center', // Center items horizontally
            mt: 2 
          }}>
        <Typography variant="h5" sx={{ mt: 4 }}>
            {title}
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        mt: 2, 
        }}
      >
          <PieChart
              colors={['#50881f', '#6f8400', '#8c7d00', '#a97300', '#c56400', '#de511a', '#f2363d', '#ff0761']}
              series={[
              {
                  data: data,
                  arcLabel: (item) => item.label,
                  arcLabelMinAngle: 20,
                  innerRadius: 50,
                  outerRadius: isDesktop ? 160 : 110,
                  paddingAngle: 5,
                  cornerRadius: 10,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
              ]}
              width={chartWidth}
              height={chartHeight}
          />
        </Box>
      </Container>
  );
});

export default PieChartComponent;