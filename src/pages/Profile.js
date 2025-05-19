import React, { useState, useCallback, useEffect } from 'react';
import useFetchWithAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress'; // For loading state in button
import Grid from '@mui/material/Grid'; // For layout

import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; // Icon for profile
import Avatar from '@mui/material/Avatar';

function Profile() {
    const { user, updateUserContextProfile } = useUser(); // Assuming you might want to update context
    const fetchWithAuth = useFetchWithAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '', // Typically not editable, but shown
        defaultCurrency: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);
    const [alertState, setAlertState] = useState({ open: false, severity: 'error', message: '' });

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsFetchingProfile(true);
            try {
                const response = await fetchWithAuth(`/api/user/private/profile/${user.id}`);
                const profile = response.data;
                setFormData({
                    username: profile.username || '',
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    defaultCurrency: profile.defaultCurrency || '',
                });
            } catch (error) {
                console.error('Error fetching user profile: ', error);
                setAlertState({ open: true, severity: 'error', message: 'Failed to load profile data.' });
            } finally {
                setIsFetchingProfile(false);
            }
        };

        if (user?.id) {
            fetchUserProfile();
        } else {
            setIsFetchingProfile(false);
        }
    }, [user, fetchWithAuth]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        setAlertState(prev => ({ ...prev, open: false })); // Close alert on new input
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
        if (!formData.firstName.trim()) {
            tempErrors.firstName = 'First Name is required.';
            isValid = false;
        }
        if (!formData.lastName.trim()) {
            tempErrors.lastName = 'Last Name is required.';
            isValid = false;
        }
        if (!formData.defaultCurrency) {
            tempErrors.defaultCurrency = 'Default Currency is required.';
            isValid = false;
        }
        setFormErrors(tempErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setAlertState(prev => ({ ...prev, open: false }));

        const userProfileDTO = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            defaultCurrency: formData.defaultCurrency,
        };

        try {
            const response = await fetchWithAuth(`/api/user/private/profile/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userProfileDTO),
            });

            if (response.status === 200) {
                setAlertState({ open: true, severity: 'success', message: 'Profile updated successfully!' });
                // Optional: Update UserContext if necessary
                if(updateUserContextProfile) {
                    updateUserContextProfile({ firstName: formData.firstName, lastName: formData.lastName, defaultCurrency: formData.defaultCurrency });
                }
            } else {
                throw new Error(response.data?.message || 'Profile update failed.');
            }
        } catch (error) {
            console.error('Error updating user profile: ', error);
            setAlertState({ open: true, severity: 'error', message: error.message || 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    if (isFetchingProfile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 128px)' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: { xs: 3, md: 5 }, // Vertical padding
                minHeight: 'calc(100vh - 128px)', // Adjust based on header/footer
                // backgroundColor: 'grey.100', // Optional: subtle background
            }}
        >
            <Container component="main" maxWidth="sm"> {/* 'sm' or 'md' for profile forms */}
                <Paper
                    elevation={3}
                    sx={{
                        padding: { xs: 2, sm: 3, md: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <AccountCircleOutlinedIcon fontSize="large" />
                    </Avatar>
                    <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
                        My Profile
                    </Typography>

                    <Collapse in={alertState.open} sx={{ width: '100%', mb: 2 }}>
                        <Alert
                            severity={alertState.severity}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => setAlertState(prev => ({ ...prev, open: false }))}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {alertState.message}
                        </Alert>
                    </Collapse>

                    <Box component="form" noValidate sx={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={formData.username}
                                    disabled // Usernames are often not editable
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={!!formErrors.firstName}
                                    helperText={formErrors.firstName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={!!formErrors.lastName}
                                    helperText={formErrors.lastName}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal" required error={!!formErrors.defaultCurrency}>
                                    <InputLabel id="default-currency-label">Default Currency</InputLabel>
                                    <Select
                                        name="defaultCurrency"
                                        labelId="default-currency-label"
                                        value={formData.defaultCurrency}
                                        label="Default Currency"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value=""><em>Select a currency</em></MenuItem>
                                        <MenuItem value="CRC">CRC - Costa Rican Colón</MenuItem>
                                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                                        {/* Add more currencies as needed */}
                                    </Select>
                                    {formErrors.defaultCurrency && (
                                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                            {formErrors.defaultCurrency}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Button
                            type="button" // Important: not "submit" if the form tag is just for structure
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSave}
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Profile;