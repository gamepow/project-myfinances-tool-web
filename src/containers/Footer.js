import React from 'react';
import '../components/css/Main.css';
import Box from '@mui/material/Box';

function Footer(){
    return(
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <p>&copy; {new Date().getFullYear()} My Project Admin</p>
        </Box>
    );
}

export default Footer;