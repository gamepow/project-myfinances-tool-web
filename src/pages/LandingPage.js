import React from 'react';
// import '../layouts/css/Main.css'; // Keep if truly global styles are needed
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'; // For max-width and centering
import Button from '@mui/material/Button';      // For a Call to Action
import Paper from '@mui/material/Paper';        // For a card-like effect
import Grid from '@mui/material/Grid';          // For a more robust layout
import { useTheme } from '@mui/material/styles'; // To access theme
import { useNavigate } from 'react-router-dom'; // For CTA button

function LandingPage() {
    const theme = useTheme();
    const navigate = useNavigate(); // From react-router-dom

    const handleGetStarted = () => {
        navigate('/signup'); // Or '/login' or '/dashboard' depending on desired flow
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 128px)', // Adjust 128px based on Topbar and Footer height
                py: { xs: 4, md: 8 }, // Vertical padding for the section
                // Optional: Add a subtle background gradient or image
                // background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 70%)`,
            }}
        >
            <Container maxWidth="lg"> {/* lg is a common breakpoint for hero sections */}
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" justifyContent="center">
                    {/* Text Content Column */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={4} // Subtle shadow
                            sx={{
                                p: { xs: 3, sm: 4, md: 5 }, // Responsive padding
                                borderRadius: 3, // Slightly more rounded corners
                                // Example: A subtle gradient background
                                background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                color: theme.palette.primary.contrastText, // Ensure text is readable on gradient
                                // Or a simpler background:
                                // backgroundColor: 'background.paper',
                                // color: 'text.primary',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2, // Spacing between typography elements
                            }}
                        >
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    lineHeight: 1.2,
                                    mb: 1, // Margin bottom
                                }}
                            >
                                Welcome to MyFinances
                            </Typography>
                            <Typography variant="h6" component="p" sx={{ color: theme.palette.primary.contrastText, opacity: 0.9, mb: 2 }}>
                                Your personal tool for smart financial management.
                                Take control of your spending and achieve your financial goals.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                This is a demo application showcasing React and Material UI skills.
                                Create an account or use the demo credentials:
                            </Typography>
                            <Box sx={{
                                backgroundColor: 'rgba(255,255,255,0.1)', // Slight highlight for credentials
                                p: 2,
                                borderRadius: 1.5,
                                mb: 3
                            }}>
                                <Typography variant="body2" component="div">
                                    <strong>Username:</strong> test
                                </Typography>
                                <Typography variant="body2" component="div">
                                    <strong>Password:</strong> test
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="secondary" // Use your theme's secondary color for CTA
                                size="large"
                                onClick={handleGetStarted}
                                sx={{
                                    alignSelf: { xs: 'stretch', sm: 'flex-start' }, // Full width on xs, auto on sm+
                                    py: 1.5,
                                    px: 4,
                                    fontWeight: 'bold',
                                }}
                            >
                                Get Started Now
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Image Column */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box
                            component="img"
                            src={`${process.env.PUBLIC_URL}/finances-landing.png`} // Ensure this image is modern and appealing
                            alt="Financial management illustration"
                            sx={{
                                maxWidth: '100%', // Responsive width
                                height: 'auto',
                                maxHeight: { xs: 300, sm: 350, md: 450 }, // Responsive max height
                                borderRadius: 2, // Consistent with Paper
                                boxShadow: `0 10px 20px -5px ${theme.palette.action.disabled}`, // Softer, more modern shadow
                                objectFit: 'contain',
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default LandingPage;