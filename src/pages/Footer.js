import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'; // For consistent padding
import Link from '@mui/material/Link'; // If you want to add links
import { useTheme } from '@mui/material/styles';

function Footer() {
    const theme = useTheme();

    return (
        <Box
            component="footer" // Semantic HTML element
            sx={{
                py: 3, // Vertical padding
                px: 2, // Horizontal padding
                mt: 'auto', // Pushes footer to bottom in flex container
                backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'© '}
                    {new Date().getFullYear()}
                    {' '}
                    <Link color="inherit" href="https://your-website.com/"> {/* Optional: Link to your site */}
                        MyFinances
                    </Link>
                    . All rights reserved.
                </Typography>
                {/* Optional: Add other links like Privacy Policy, Terms of Service */}
                {/* <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    <Link color="inherit" href="/privacy">
                        Privacy Policy
                    </Link>
                    {' | '}
                    <Link color="inherit" href="/terms">
                        Terms of Service
                    </Link>
                </Typography> */}
            </Container>
        </Box>
    );
}

export default Footer;