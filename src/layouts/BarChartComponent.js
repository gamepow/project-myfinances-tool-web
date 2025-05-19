// src/layouts/BarChartComponent.js
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles'; // To get theme colors
import Typography from '@mui/material/Typography';

const BarChartComponent = ({ data, height = 350, barDataKey = "value", xAxisDataKey = "name" }) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        // You can return a message or null, consistent with your PieChart handling
        return (
            <Typography sx={{ textAlign: 'center', py: 4, height: height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No data to display in chart.
            </Typography>
        );
    }

    // Custom Tooltip Content for better formatting (optional)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                    <p className="label">{`${label}`}</p>
                    <p className="intro" style={{ color: payload[0].fill }}>
                        {`Amount : $${Number(payload[0].value).toFixed(2)}`}
                    </p>
                    {/* You can add more info from payload if needed */}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                margin={{
                    top: 20, // Increased top margin for legend if enabled
                    right: 30,
                    left: 20, // Increased left margin if Y-axis labels are long
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                    dataKey={xAxisDataKey}
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                    // interval={0} // Uncomment if you want to show all labels, even if they overlap
                    // angle={-30} // Uncomment to tilt labels if they are long
                    // textAnchor="end" // Use with angle to adjust label position
                />
                <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`} // Format Y-axis ticks as currency
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
                {/* <Legend /> // You can enable legend if you want to name the bar series */}
                <Bar dataKey={barDataKey} fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                {/* 'radius' gives rounded top corners to bars */}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;