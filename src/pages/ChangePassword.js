import React, { useState } from 'react';
import useFetchWithAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

function ChangePassword() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fetchWithAuth = useFetchWithAuth();
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        const passwordError = validatePassword(newPassword, confirmPassword);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        try {
            const response = await fetchWithAuth('/api/user/private/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword,
                    newPassword
                })
            });

            const { data } = response;

             if (response && ( response.status === 200 || response.status === 201)) {
                setSuccess(true);
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                setError(data.error || 'Failed to change password.');
                setLoading(false); // Stop loading if there are errors
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError('An unexpected error occurred.');
            setLoading(false); // Stop loading if there are errors
        }
    };

    function validatePassword(password, repeatPassword) {
        if (password !== repeatPassword) {
          return "Passwords do not match.";
        }
        if (password.length < 6) {
          return "Password must be at least 6 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
          return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
          return "Password must contain at least one lowercase letter.";
        }
        if (!/[0-9]/.test(password)) {
          return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          return "Password must contain at least one special character.";
        }
        return ""; // No error
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Change Password</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Password changed successfully!</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowNewPassword}
                                    edge="end"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle repeat password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    edge="end"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography variant="body2" gutterBottom>
                    * Username must be at least 5 characters long<br/>
                    * Password must be at least 6 characters long<br/>
                    * Password must contain at least one uppercase letter<br/>
                    * Password must contain at least one lowercase letter<br/>
                    * Password must contain at least one number<br/>
                    * Password must contain at least one special character<br/>
                </Typography>
                <Box sx={{ position: 'relative', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>Change Password</Button>
                    {loading && (
                        <CircularProgress
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                        />
                    )}
                </Box>
            </form>
        </Box>
    );
}

export default ChangePassword;
