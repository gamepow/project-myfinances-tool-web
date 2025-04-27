import React from 'react';
import '../layouts/css/Main.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LandingPage(){

    return (
        
        <Box sx={{ 
            display: 'flex', 
            flexDirection: {xs: 'column', md: 'row'},
            alignItems: 'center',
            justifyContent: 'space-between',
            p: {xs: 2, md: 6}, // Responsive padding
            gap: {xs: 2, md: 4}, // Responsive gap
            }}>
            <Box sx={{ 
                flex: { xs: 1, md: 0.7 }, // Full width on mobile, smaller on desktop
                backgroundColor: 'secondary.main',
                color: 'primary.contrastText',
                p: 8,
                borderRadius: 2,
                height: 1/2,
                boxShadow: 3,
                mb: { xs: 2, md: 0 }, // margin bottom on mobile
                ml: { xs: 0, md: 10 }, // Add left margin only on desktop
                }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Welcome to My Finances Tool
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }} gutterBottom>
                Track. Report. Control. Simplify your finances with your personal, React-powered dashboard. Effortlessly manage transactions, visualize your spending with customizable reports, and organize everything with personalized categories. Get a clear picture of your financial life, all in one vibrant space.
                </Typography>
            </Box>
            <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'flex-end',
                mr: { xs: 0, md: 15 }, // Add right margin only on desktop
                }}
            >
                <img 
                    src="/finances-landing.png"
                    alt="Finances dashboard illustration" 
                    style={{ 
                        maxWidth: {xs: '100%', sm: '80%'},
                        height: 'auto',
                        borderRadius: 8,
                        maxHeight: 400,
                    }}
                />
            </Box>
        </Box>
    );
}

export default LandingPage;