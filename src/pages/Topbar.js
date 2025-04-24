import React from 'react';
import '../layouts/css/Topbar.css';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import HomeRoundedIcon from '@mui/icons-material/Home';
import ReceiptRoundedIcon from '@mui/icons-material/Receipt';
import ProfileIcon from '@mui/icons-material/Person';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogOutIcon from '@mui/icons-material/Logout';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

function Topbar(){
    const navigate = useNavigation();
    const { user, logout } = useUser();

    const handleSigninPage = () => {
        navigate('/login');
    };

    const handleSignupPage = () => {
        navigate('/signup');
    };

    const [mainAnchorEl, setMainAnchorEl] = React.useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
    const openMain = Boolean(mainAnchorEl);
    const openProfile = Boolean(profileAnchorEl);
    const handleMainClick = (event) => {
        setMainAnchorEl(event.currentTarget);
    };

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleMainRedirect = (url) => {
        if(url==='/logout'){
            logout();
            navigate('/');
        }else{
            navigate(url);
        }

        setMainAnchorEl(null);
    }

    const handleProfileRedirect = (url) => {
        console.log(url);
        if(url==='/logout'){
            logout();
            navigate('/');
        }else{
            navigate(url);
        }

        setProfileAnchorEl(null);
    }

    const handleMainClose = () => {
        setMainAnchorEl(null);
    }

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    }

    const mainListItems = [
    { text: 'Home', icon: <HomeRoundedIcon /> , url:'/dashboard'},
    { text: 'Transactions', icon: <ReceiptRoundedIcon />, url:'/Transactions' }
    ];

    const profileListItems = [
        { text: 'Profile', icon: <ProfileIcon />, url:'/profile' },
        { text: 'Log out', icon: <LogOutIcon />, url:'/logout' }
    ];

    return (
        <Box>
            <AppBar 
                position="static"
            >
                <Toolbar>
                    {user ? (
                        <div>
                            <IconButton
                                onClick={handleMainClick}
                            >
                                <MenuIcon color="tertiary" />
                            </IconButton>
                            <Menu 
                                anchorEl={mainAnchorEl}
                                open={openMain}
                                onClose={handleMainClose}
                            >
                                {mainListItems.map((item, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton onClick={() => handleMainRedirect(item.url)}>
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </Menu>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                    <Link
                        component="button"
                        variant="h4"
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
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
                    <Box>
                        {user ? (
                            <>
                                <div>
                                    <IconButton
                                        onClick={handleProfileClick}
                                    >
                                        <AccountCircle sx={{ width: 36, height: 36 }} color="tertiary" />
                                    </IconButton>
                                    <Menu 
                                        anchorEl={profileAnchorEl}
                                        open={openProfile}
                                        onClose={handleProfileClose}
                                    >
                                        {profileListItems.map((item2, index2) => (
                                            <ListItem key={index2} disablePadding>
                                                <ListItemButton onClick={() => handleProfileRedirect(item2.url)}>
                                                    <ListItemIcon>{item2.icon}</ListItemIcon>
                                                    <ListItemText primary={item2.text} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </Menu>
                                </div>
                            </>
                        ) : (
                            <>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" size="medium" onClick={handleSigninPage} >Sign In</Button>
                                    <Button color="white" variant="outlined" size="medium" onClick={handleSignupPage}>New user</Button>
                                </Stack>
                            </>
                        )}                        
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Topbar;