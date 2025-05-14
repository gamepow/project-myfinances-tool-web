import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { SignInContainer, Card, StyledTextField } from '../layouts/StyledUI';

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
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return ""; // No error
  }

function validateUserName(userName) {

    if (userName.length < 5) {
      return "Password must be at least 5 characters long.";
    }
    return ""; // No error
  }

function Signup(){

    const [loading, setLoading] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');
    const [userNameError, setUserNameError] = React.useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRepeatPassword = () => setShowRepeatPassword((show) => !show);

    const handlesignup = async (e) => {
        e.preventDefault(); // Prevent default form submission

        setLoading(true);

        let hasErrors = false;

        const errorUserNameMsg = validateUserName(username);
        if (errorUserNameMsg) {
            setUserNameError(true);
            setUserNameErrorMessage(errorUserNameMsg);
            setLoading(false);
            hasErrors = true;
        }
        else{
            setUserNameError(false);
            setUserNameErrorMessage('');
        }

        if (!firstName) {
           setFirstNameError(true);
           hasErrors = true;
        }else{
            setFirstNameError(false);
        }

        if (!lastName) {
           setLastNameError(true);
           hasErrors = true;
        }
        else{
            setLastNameError(false);
        }

        const errorMsg = validatePassword(password, repeatPassword);
        if (errorMsg) {
            setPasswordError(true);
            setPasswordErrorMessage(errorMsg);
            setLoading(false);
            hasErrors = true;
        }
        else{
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (hasErrors) {
            setLoading(false); // Stop loading if there are errors
            return;
        }

        // perform api call to signup
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/public/newuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password , firstName, lastName }),
            });
            
            if(!response.ok){
                setOpen(true);
                throw new Error('Failed creating user.');
            }
            setUsername('');
            setPassword('');
            setRepeatPassword('');
            setOpen(false);
            setLoading(false);
            setOpenSuccess(true);

        } catch(err){
            setOpen(true);
            setLoading(false);
        }

    };

    return(
        <SignInContainer>
            <Card variant="outlined">
                <Box
                    component="form"
                    onSubmit={handlesignup}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl sx={{ width: '100%' }}>
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
                            >User creation failed, please retry later.</Alert>
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
                            >User created successfull, you can log in now.</Alert>
                        </Collapse>
                        <StyledTextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            error={userNameError}
                            helperText={userNameErrorMessage}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            fullWidth
                            slotProps={{ htmlInput: { maxLength: 25 } }}
                        />
                        <StyledTextField
                            id="firstName"
                            label="First Name"
                            variant="outlined"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            fullWidth
                            slotProps={{ htmlInput: { maxLength: 50 } }}
                            error={firstNameError}
                            helperText={firstNameError ? 'First Name is required.' : ''}
                        />
                        <StyledTextField
                            id="lastName"
                            label="Last Name"
                            variant="outlined"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            fullWidth
                            slotProps={{ htmlInput: { maxLength: 50 } }}
                            error={lastNameError}
                            helperText={lastNameError ? 'Last Name is required.' : ''}
                        />
                        <StyledTextField
                            id="password"
                            name="password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            required
                            fullWidth
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            />
                        <StyledTextField
                            id="repeatPassword"
                            name="repeatPassword"
                            variant="outlined"
                            type={showRepeatPassword ? 'text' : 'password'}
                            label="Repeat Password"
                            required
                            fullWidth
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle repeat password visibility"
                                            onClick={handleClickShowRepeatPassword}
                                            edge="end"
                                            tabIndex={-1}
                                        >
                                            {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
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
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading || openSuccess}
                                fullWidth
                            >
                                Sign Up
                            </Button>
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
                    </FormControl>
                </Box>
            </Card>  
        </SignInContainer>
        

    );
}

export default Signup;