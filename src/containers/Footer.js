import React from 'react';
import '../components/css/Main.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Footer(){
    return(
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0 }}>
            <Typography variant="h6" color="primary">&copy; {new Date().getFullYear()} My Finances</Typography>
        </Box>
    );
}

export default Footer;