import React, { useEffect, useState } from 'react';
// import '../layouts/css/Login.css'; // Try to move styles to sx or styled components
// import '../layouts/css/Main.css';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper'; // For the form card
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link'; // For "Forgot password" etc.
import Grid from '@mui/material/Grid'; // For layout within the form

import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Optional: For a header icon
import Avatar from '@mui/material/Avatar'; // Optional: For a header icon

// You can keep your styled components if you prefer, or move to sx
// For this example, I'll primarily use sx for simplicity and to showcase theme integration.

function Login() {
    const { login, loading, error: apiError, user } = useUser(); // Renamed error to apiError to avoid conflict
    const navigate = useNavigation();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (user && !apiError) {
            navigate('/dashboard');
        }
    }, [user, apiError, navigate]);

    useEffect(() => {
        if (apiError) {
            setShowAlert(true);
        }
    }, [apiError]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        setShowAlert(false); // Hide general API error alert on new input
    };

    const validateInputs = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.username.trim()) {
            tempErrors.username = 'Username is required.';
            isValid = false;
        }
        if (!formData.password) {
            tempErrors.password = 'Password is required.';
            isValid = false;
        } else if (formData.password.length < 4) { // Example: min length
            tempErrors.password = 'Password must be at least 6 characters.';
            isValid = false;
        }

        setFormErrors(tempErrors);
        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        await login(formData.username, formData.password);
        // Alert visibility is handled by the useEffect watching apiError
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 128px)', // Adjust based on header/footer
                // A cleaner background:
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 60%)`,
                // Or a very simple one:
                // backgroundColor: 'grey.100',
                py: 4,
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        padding: { xs: 3, sm: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2, // Softer corners
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Sign In
                    </Typography>

                    {showAlert && apiError && (
                        <Alert
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%', mb: 2 }}
                            onClose={() => setShowAlert(false)} // Allow manual close
                        >
                            {apiError.message || 'Login failed. Please check your credentials.'}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* Optional: Remember me checkbox */}
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }} // More padding for a modern feel
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <Link href="#" variant="body2" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); /* Implement this route */ }}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component="button" variant="body2" onClick={() => navigate('/signup')}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;