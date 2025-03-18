import React from 'react';
import '../components/css/Topbar.css';
import { useNavigation } from '../context/NavigationContext';
import { alpha, styled } from '@mui/material/styles';
import { useUser } from '../context/UserContext';
import AppBar from '@mui/material/AppBar';
import Container  from '@mui/material/Container';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Topbar(){
    const navigate = useNavigation();
    const { user, logout } = useUser();

    const handleSigninPage = () => {
        navigate('/login');
    };

    const handleSignupPage = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const StyledToolbar = styled(Toolbar)(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
        backdropFilter: 'blur(24px)',
        border: '1.5px solid',
        borderColor: (theme.vars || theme).palette.divider,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
          : alpha(theme.palette.background.default, 0.4),
        boxShadow: (theme.vars || theme).shadows[1],
        padding: '8px 12px',
      }));

    return (
        <AppBar 
            position="fixed"
            enableColorOnDark
            sx={{
            boxShadow: 0,
            bgcolor: 'transparent',
            backgroundImage: 'none',
            mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        }}>
            <Container maxWidth="lg">
                <StyledToolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <Typography variant="h4" color="primary">Plan my Project</Typography>
                    </Box>
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        gap: 1,
                        alignItems: 'center',
                    }}>
                        {user ? (
                            <>
                                <Button color="primary" variant="outlined" size="medium" onClick={handleLogout}>Sign out</Button>
                            </>
                        ) : (
                            <>
                                <Button color="primary" variant="contained" size="medium" onClick={handleSigninPage}>Sign In</Button>
                                <Button color="primary" variant="outlined" size="medium" onClick={handleSignupPage}>New user</Button>
                            </>
                        )}                        
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}

export default Topbar;