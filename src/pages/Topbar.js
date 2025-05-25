import React from 'react';
// import '../layouts/css/Topbar.css'; // Consider moving styles into MUI sx or styled-components
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'; // For the brand name
import Avatar from '@mui/material/Avatar'; // For a more modern profile icon

import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'; // Updated Profile Icon
import LockResetRoundedIcon from '@mui/icons-material/LockOpen'; // Updated Password Icon
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'; // Default if no avatar
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'; // Updated Logout Icon
import BudgetIcon from '@mui/icons-material/MonetizationOn';
import CategoryIcon from '@mui/icons-material/Category'; // Updated Category Icon

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link'; // Keep for clickable brand
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';

// If you have a logo SVG or image
// import YourLogo from './path/to/your-logo.svg';

const mainListItems = [
    { text: 'Home', icon: <HomeRoundedIcon />, url: '/dashboard' },
    { text: 'My Budget', icon: <BudgetIcon />, url: '/my-budget' },
    { text: 'Transactions', icon: <ReceiptRoundedIcon />, url: '/Transactions' }
];

const profileListItems = [
    { text: 'Profile', icon: <PersonOutlineRoundedIcon />, url: '/profile' },
    { text: 'Change Password', icon: <LockResetRoundedIcon />, url: '/change-password' },    
    { text: 'My Categories', icon: <CategoryIcon />, url: '/my-categories' },
    { text: 'Log out', icon: <LogoutRoundedIcon />, url: '/logout' },
];


function Topbar() {
    const navigate = useNavigation();
    const { user, logout } = useUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpenMain, setDrawerOpenMain] = React.useState(false);
    const [drawerOpenProfile, setDrawerOpenProfile] = React.useState(false);

    const handleSigninPage = () => navigate('/login');
    const handleSignupPage = () => navigate('/signup');
    const handleDrawerOpen = () => setDrawerOpenMain(true);
    const handleDrawerClose = () => setDrawerOpenMain(false);
    const handleDrawerProfileOpen = () => setDrawerOpenProfile(true);
    const handleDrawerProfileClose = () => setDrawerOpenProfile(false);

    const handleMainRedirect = (url) => {
        if (url === '/logout') {
            logout();
            navigate('/');
        } else {
            navigate(url);
        }
        // Close drawers after navigation
        setDrawerOpenMain(false);
        setDrawerOpenProfile(false);
    };

    const renderDrawerList = (items, closeDrawerHandler) => (
        <Box
            sx={{ width: { xs: 240, sm: 280 }, pt: 2 }} // Added padding top
            role="presentation"
            onClick={closeDrawerHandler}
            onKeyDown={closeDrawerHandler} // For accessibility
        >
            <List>
                {items.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => handleMainRedirect(item.url)}>
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}> {/* Themed icon color */}
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                elevation={1} // Subtle elevation
                sx={{ backgroundColor: theme.palette.background.paper }} // Lighter app bar
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        px: { xs: 1, sm: 2 }, // Consistent padding
                        minHeight: { xs: 56, sm: 64 }
                    }}
                >
                    {/* Left: Menu Icon & Brand/Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user && (
                            <IconButton
                                edge="start" // Better positioning for first item
                                color="inherit" // Will inherit from AppBar's text color
                                aria-label="open main menu"
                                onClick={handleDrawerOpen}
                                sx={{ mr: { xs: 0.5, sm: 1 }, color: theme.palette.text.primary }} // Themed color
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Link
                            component="button" // Make it behave like a button for onClick
                            onClick={() => navigate(user ? '/dashboard' : '/')}
                            sx={{
                                textDecoration: 'none', // Remove underline from link
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {/* Optional: If you have an SVG logo */}
                            {/* <img src={YourLogo} alt="My Finances Logo" style={{ height: '32px', marginRight: '8px' }} /> */}
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                noWrap
                                component="div" // Using div as it's part of a Link
                                sx={{
                                    color: theme.palette.primary.main, // Use primary theme color for brand
                                    fontWeight: 'bold',
                                    letterSpacing: '.05rem', // Slight letter spacing
                                    cursor: 'pointer',
                                }}
                            >
                                MyFinances
                            </Typography>
                        </Link>
                    </Box>

                    {/* Right: Profile or Auth Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                {/* You could add other quick access icons here if needed */}
                                <IconButton
                                    edge="end" // Better positioning for last item
                                    onClick={handleDrawerProfileOpen}
                                    aria-label="open profile menu"
                                    sx={{ color: theme.palette.text.primary }} // Themed color
                                >
                                    {user.avatarUrl ? ( // Example: if user object has an avatar
                                        <Avatar sx={{ width: 32, height: 32 }} src={user.avatarUrl} />
                                    ) : (
                                        <AccountCircleRoundedIcon sx={{ width: 32, height: 32 }} />
                                    )}
                                </IconButton>
                            </>
                        ) : (
                            <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center">
                                <Button
                                    variant="outlined" // Outlined for secondary action
                                    color="primary"    // Use theme's primary color
                                    size={isMobile ? "small" : "medium"}
                                    onClick={handleSigninPage}
                                    sx={{
                                        height: { xs: 36, sm: 40 },
                                        // borderColor: theme.palette.primary.main, // Handled by color="primary"
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant="contained" // Contained for primary action
                                    color="primary"     // Use theme's primary color
                                    size={isMobile ? "small" : "medium"}
                                    onClick={handleSignupPage}
                                    sx={{
                                        height: { xs: 36, sm: 40 },
                                        // backgroundColor: theme.palette.secondary.main, // Or use secondary color
                                        // '&:hover': {
                                        //    backgroundColor: theme.palette.secondary.dark,
                                        // }
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Navigation Drawer */}
            {user && (
                <Drawer
                    anchor="left"
                    open={drawerOpenMain}
                    onClose={handleDrawerClose}
                    PaperProps={{
                        sx: { backgroundColor: theme.palette.background.paper } // Themed drawer
                    }}
                >
                    {renderDrawerList(mainListItems, handleDrawerClose)}
                </Drawer>
            )}

            {/* Profile Actions Drawer */}
            {user && (
                <Drawer
                    anchor="right"
                    open={drawerOpenProfile}
                    onClose={handleDrawerProfileClose}
                    PaperProps={{
                        sx: { backgroundColor: theme.palette.background.paper } // Themed drawer
                    }}
                >
                    {renderDrawerList(profileListItems, handleDrawerProfileClose)}
                </Drawer>
            )}
        </Box>
    );
}

export default Topbar;