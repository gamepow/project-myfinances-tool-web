import { useState, useCallback, useEffect } from 'react';
import useFetchWithAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import { SignInContainer, Card, StyledTextField } from '../layouts/StyledUI';
import { Select, MenuItem, InputLabel, FormControl, Box, Button, IconButton, Alert, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


function Profile() {

    const { user } = useUser();
    const fetchWithAuth = useFetchWithAuth(); // Use the custom hook
    const [defaultCurrency, setDefaultCurrency] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    // Error states for each field
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [defaultCurrencyError, setDefaultCurrencyError] = useState(false);    
    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const handleDefaultCurrency = useCallback((event) => {
        setDefaultCurrency(event.target.value);
      }, []);

    // pulling user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetchWithAuth(`/api/user/private/profile/${user.id}`);
                console.log('User Profile response.data: ' + response.data);
                console.log('User Profile response.status: ' + response.status);
                const profile = response.data; // <-- get the actual profile object
                setUsername(profile.username || '');
                setFirstName(profile.firstName || '');
                setLastName(profile.lastName || '');
                setDefaultCurrency(profile.defaultCurrency || '');
            } catch (error) {
                console.error('Error fetching user profile: ', error);
            }
        };

        if (user?.id) {
            fetchUserProfile();
        }
    }, [user, fetchWithAuth]);

    function handleSave(){
        setLoading(true);

        // Reset errors
        setFirstNameError(false);
        setLastNameError(false);
        setDefaultCurrencyError(false);
        setOpen(false);
        setOpenSuccess(false);

        let hasErrors = false;

        // Validate fields
        if (!firstName) {
            setFirstNameError(true);
            hasErrors = true;
        }
        if (!lastName) {
            setLastNameError(true);
            hasErrors = true;
        }
        if (!defaultCurrency) {
            setDefaultCurrencyError(true);
            hasErrors = true;
        }

        if (hasErrors) {
            setLoading(false); // Stop loading if there are errors
            return;
            }
        
        // Build the DTO object
        const userProfileDTO = {
            firstName: firstName,
            lastName: lastName,
            defaultCurrency: defaultCurrency,
        };

        fetchWithAuth(`/api/user/private/profile/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfileDTO),
        })
        .then(async (response) => {
            console.log('User Profile Update response: ', response);
            console.log('User Profile Update response status: ', response.status);
            if (response.status === 200) {
                setOpenSuccess(true);
                setLoading(false);
            } else {
                setOpen(true);
                setLoading(false);
            }
        })
        .catch((error) => {
            console.error('Error updating user profile: ', error);
            setOpen(true);
            setLoading(false);
        });
    };

    return (
        <SignInContainer>
            
                <Card>
                    <h2>My Profile</h2>
                    <Collapse in={open}>
                        <Alert severity="error" variant="filled" sx={{ mb: 2 }}
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setOpen(false)}
                            sx={{ mb: 1 }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        >User profile update failed, please retry later.</Alert>
                    </Collapse>
                    <Collapse in={openSuccess}>
                        <Alert severity="success" variant="filled" sx={{ mb: 2 }}
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setOpen(false)}
                            sx={{ mb: 1 }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        >User profile update successfull.</Alert>
                    </Collapse>
                    <StyledTextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        disabled
                    />
                    <StyledTextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={firstNameError}
                        helperText={firstNameError ? 'First Name is required.' : ''}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <StyledTextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={lastNameError}
                        helperText={lastNameError ? 'Last Name is required.' : ''}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="default-currency-label">Default Currency</InputLabel>
                        <Select
                            labelId="default-currency-label"
                            id="default_currency"
                            value={defaultCurrency}
                            label="Default Currency"
                            onChange={handleDefaultCurrency}
                        >
                            <MenuItem value="CRC">CRC - Colon</MenuItem>
                            <MenuItem value="USD">USD - Dolar</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                        <Button type="submit" loading={loading} onClick={handleSave} variant="contained" color="primary" size="large" sx={{ ml: 2 }} disabled={loading}>
                            Save
                        </Button>
                    </Box>
                </Card>
            
        </SignInContainer>
    );
}

export default Profile;