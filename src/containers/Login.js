import '../components/css/Login.css';
import '../components/css/Main.css';
import { useNavigation } from '../context/NavigationContext';
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled } from '@mui/material/styles';

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useUser();
  const navigate =useNavigation();
  const [open, setOpen] = React.useState(false);
  const [userNameError, setUserNameError] = React.useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef(undefined);

  const handleLogin = async (e) => {

    if (userNameError || passwordError) {
      e.preventDefault();
      return;
    }

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    await login(username, password);

    if(!error){
      navigate('/dashboard');
    }else{
      setOpen(true);
    }
  };

  const validateInputs = async (e) => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    let isValid = true;

    if (!username.value) {
      setUserNameError(true);
      setUserNameErrorMessage('Ingrese un usuario válido.');
      isValid = false;
    } else {
      setUserNameError(false);
      setUserNameErrorMessage('');
    }

    if (!password.value || password.value.length < 2) {
      setPasswordError(true);
      setPasswordErrorMessage('Contraseña debe ser de al menos 6 caractéres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;

  };

  useEffect(() => {
    if (user && !error) {
      navigate('/dashboard');
    }
  }, [user, error, navigate]);

  const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    
    [theme.breakpoints.up('sm')]: {
      maxWidth: '450px',
    },
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
      boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
  }));

  const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 90dvh)',
    minHeight: '100%',
    padding: theme.spacing(10),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
      backgroundRepeat: 'no-repeat',
      ...theme.applyStyles('dark', {
        backgroundImage:
          'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
      }),
    },
  }));

  const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2), // Use theme spacing for consistency
  }));

  const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    marginBottom: theme.spacing(2), // Use theme spacing for consistency
  }));

  return (
    <SignInContainer>
      <Card variant="outlined">
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl sx={{ padding: '20px' }}>
            <Collapse in={open}>
              <Alert severity="error" variant="filled" sx={{ mb: 2 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  margin-bottom= '5px'
                  onClick={() => {
                    setOpen(false);
                  }}
                  sx={{ mb: 1 }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              >Failed attemp.</Alert>
            </Collapse>
            <StyledTextField id="username" name="username" variant="outlined" type="text" label="Username" error={userNameError} helperText={userNameErrorMessage} required></StyledTextField>
            <StyledTextField id="password" name="password" variant="outlined" type="password" label="Password" error={passwordError} helperText={passwordErrorMessage} required></StyledTextField>
            <Box>
              <Button type="submit" variant="contained" onClick={validateInputs} size="large" disabled={loading}>Sign in</Button>
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

export default Login;
