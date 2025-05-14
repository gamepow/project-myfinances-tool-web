import React from 'react';
import '../layouts/css/Topbar.css';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/Home';
import ReceiptRoundedIcon from '@mui/icons-material/Receipt';
import ProfileIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogOutIcon from '@mui/icons-material/Logout';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';

function Topbar(){
    const navigate = useNavigation();
    const { user, logout } = useUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpenMain, setDrawerOpenMain] = React.useState(false);
    const [drawerOpenProfile, setDrawerOpenProfile] = React.useState(false);

    const handleSigninPage = () => {
        navigate('/login');
    };

    const handleSignupPage = () => {
        navigate('/signup');
    };
    
    const handleDrawerOpen = (event) => {
        setDrawerOpenMain(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpenMain(false);
    };

    const handleDrawerProfileOpen = (event) => {
        setDrawerOpenProfile(true);
    };

    const handleDrawerProfileClose = () => {
        setDrawerOpenProfile(false);
    };

    const handleMainRedirect = (url) => {
        if(url==='/logout'){
            logout();
            navigate('/');
        }else{
            navigate(url);
        }
    }

    const mainListItems = [
    { text: 'Home', icon: <HomeRoundedIcon /> , url:'/dashboard'},
    { text: 'Transactions', icon: <ReceiptRoundedIcon />, url:'/Transactions' }
    ];

    const profileListItems = [
        { text: 'Profile', icon: <ProfileIcon />, url:'/profile' },
        { text: 'Change Password', icon: <PasswordIcon />, url:'/change-password' },
        { text: 'Log out', icon: <LogOutIcon />, url:'/logout' }
    ];

    return (
        <Box>
            <AppBar position="static">
                <Toolbar
                    sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 1, sm: 2 },
                    py: { xs: 1, sm: 0 },
                    minHeight: { xs: 56, sm: 64 }
                    }}
                >
                    {/* Left: Menu Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <>
                        <IconButton
                            onClick={handleDrawerOpen}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon color="tertiary" />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={drawerOpenMain}
                            onClose={handleDrawerClose}
                            PaperProps={{
                            sx: { width: { xs: 220, sm: 280 } }
                            }}
                        >
                            <List>
                            {mainListItems.map((item, index) => (
                                <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                    handleMainRedirect(item.url);
                                    handleDrawerClose();
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                                </ListItem>
                            ))}
                            </List>
                        </Drawer>
                        </>
                    )}
                    </Box>

                    {/* Center: Brand/Logo */}
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'left',
                        minWidth: 0 // Prevents overflow
                    }}>
                        <Link
                        component="button"
                        variant="h5"
                        underline="hover"
                        color="inherit"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        onClick={() => {
                            if (user) {
                            navigate('/dashboard');
                            } else {
                            navigate('/');
                            }
                        }}
                        >
                        My Finances
                        </Link>
                    </Box>

                    {/* Right: Profile or Auth Buttons */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        minWidth: 0
                    }}>
                        {user ? (
                        <>
                            <IconButton
                            onClick={handleDrawerProfileOpen}
                            sx={{ mr: 1 }}
                            >
                                <AccountCircle sx={{ width: 32, height: 32 }} color="tertiary" />
                            </IconButton>
                            <Drawer
                                anchor="right"
                                open={drawerOpenProfile}
                                onClose={handleDrawerProfileClose}
                                PaperProps={{
                                sx: { width: { xs: 220, sm: 280 } }
                                }}
                            >
                                <List>
                                {profileListItems.map((item2, index2) => (
                                    <ListItem key={index2} disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                        handleMainRedirect(item2.url);
                                        handleDrawerProfileClose();
                                        }}
                                    >
                                        <ListItemIcon>{item2.icon}</ListItemIcon>
                                        <ListItemText primary={item2.text} />
                                    </ListItemButton>
                                    </ListItem>
                                ))}
                                </List>
                            </Drawer>
                        </>
                        ) : (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: { xs: 'center', sm: 'flex-end' },
                            alignItems: 'center',
                            height: 'auto',
                            }}
                        >
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={handleSigninPage}
                                fullWidth={isMobile}
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                    height: 44, // Set explicit height
                                    px: 2,
                                    borderWidth: 2,
                                    boxSizing: 'border-box'
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                onClick={handleSignupPage}
                                fullWidth={isMobile}
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                    height: 44, // Match height to Sign In
                                    px: 2,
                                    color: 'white',
                                    borderColor: 'white',
                                    borderWidth: 1, // Optional: make border more visible
                                    boxSizing: 'border-box',
                                    whiteSpace: 'nowrap' // Prevent text wrapping
                                }}
                            >
                                New user
                            </Button>
                        </Stack>
                        )}
                    </Box>
                    
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Topbar;