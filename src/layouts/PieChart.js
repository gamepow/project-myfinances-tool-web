import React, { memo, useMemo } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Typography, Box, useMediaQuery, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const DEFAULT_CHART_COLORS = [
    '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
    '#0288d1', '#ffa000', '#c2185b', '#689f38', '#512da8',
    '#00796b', '#afb42b'
];

const PieChartComponent = memo(function PieChartComponent({
    data,
    title,
    isLoading = false,
    error = null,
    height: propHeight = 300, // Renamed to propHeight to avoid conflict with internal height
    // width prop is less critical now as we'll aim for 100% of container
    colors,
    showLegend = false,
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const chartColors = useMemo(() => colors || DEFAULT_CHART_COLORS, [colors]);

    // Determine the actual render dimensions for the PieChart SVG
    // If propWidth is not provided, we'll make it square based on propHeight.
    const renderWidth = /* propWidth || */ propHeight; // Keeping it square for simplicity
    const renderHeight = propHeight;

    // cx and cy should be half of the renderWidth and renderHeight
    const dynamicCx = renderWidth / 2;
    const dynamicCy = renderHeight / 2;

    // Determine radii based on screen size and data length
    const chartRadiiAndAngle = useMemo(() => {
        // --- Consistent Radii ---
        const baseOuterRadiusPct = isSmallScreen ? 75 : 85; // Or choose a value like 80 for desktop always
        const baseInnerRadiusPct = 35; // Or choose a value like 40

        let arcLabelMinAngle = 25; // Default

        // Adjust arcLabelMinAngle based on data length to manage label clutter
        if (data && data.length > 5) {
            arcLabelMinAngle = 30;
        }
        if (data && data.length > 8) {
            arcLabelMinAngle = 35;
        }
        if (data && data.length > 12) { // Even more aggressive if many slices
            arcLabelMinAngle = 40;
        }

        return {
            innerRadiusPct: baseInnerRadiusPct,
            outerRadiusPct: baseOuterRadiusPct, // Same outer radius percentage for all charts
            arcLabelMinAngle,
        };
    }, [isSmallScreen, data]); // data is still a dependency for arcLabelMinAngle


    if (isLoading) {
        const skeletonDiameter = propHeight * 0.6;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, minHeight: propHeight /* ensure container takes space */ }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'medium', textAlign: 'center' }}>
                    {title}
                </Typography>
                <Skeleton variant="circular" width={skeletonDiameter} height={skeletonDiameter} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, minHeight: propHeight, textAlign: 'center' }}>
                 <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                    {title}
                </Typography>
                <Typography color="error" variant="body2">{error}</Typography>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, minHeight: propHeight, textAlign: 'center' }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    No data available to display.
                </Typography>
            </Box>
        );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'medium', mb: 0.5, textAlign: 'center' }}>
                {title}
            </Typography>
            {/* This Box is crucial: it defines the actual area the chart SVG can use */}
            {/* It will take the height from its parent Paper (controlled by Dashboard.js) minus padding/title */}
            <Box sx={{
                width: '100%', // Take full available width for potential centering
                display: 'flex',
                justifyContent: 'center',
            }}>
                <PieChart
                    colors={chartColors}
                    series={[
                        {
                            data: data,
                            arcLabel: (item) => data.length <= 5 ? `${item.label} (${((item.value / total) * 100).toFixed(0)}%)` : `${((item.value / total) * 100).toFixed(0)}%`,
                            arcLabelMinAngle: chartRadiiAndAngle.arcLabelMinAngle,
                            innerRadius: `${chartRadiiAndAngle.innerRadiusPct}%`,
                            outerRadius: `${chartRadiiAndAngle.outerRadiusPct}%`,
                            paddingAngle: data.length > 1 ? 2 : 0,
                            cornerRadius: 5,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: `${chartRadiiAndAngle.innerRadiusPct - 5}%`, additionalRadius: '-5%', color: 'rgba(0,0,0,0.1)' },
                            valueFormatter: (item) => `${item.value.toLocaleString()}`,
                            /*cx: dynamicCx, // Use the dynamic cx
                            cy: dynamicCy, // Use the dynamic cy*/
                        },
                    ]}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fill: theme.palette.text.primary,
                            fontSize: isSmallScreen ? '0.65rem' : '0.75rem',
                            fontWeight: 500,
                        },
                    }}
                    slotProps={{
                        legend: { hidden: !showLegend, direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' } },
                    }}
                    height={propHeight} // <--- PASS THE HEIGHT DIRECTLY HERE
                    // width can also be passed if needed, e.g., width={propWidth}, or let it be responsive
                />
            </Box>
        </Box>
    );
});

export default PieChartComponent;