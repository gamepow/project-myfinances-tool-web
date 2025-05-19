// App.js
import React from 'react';
import './layouts/css/Main.css'; // Keep if you have essential global styles here
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NavigationProvider } from './context/NavigationContext';
import Landingpage from './pages/LandingPage';
import Dashboardpage from './pages/Dashboard';
import TransactionsPage from './pages/Transactions';
import Loginpage from './pages/Login';
import Signuppage from './pages/Signup';
import ProtectedRoute from './layouts/ProtectedRoute';
import Profilepage from './pages/Profile';
import Topbar from './pages/Topbar' // Assuming Topbar.js is in the pages folder
import Footer from './pages/Footer'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // <-- IMPORT IT
import theme from './theme';
import Box from '@mui/material/Box';

const basename = process.env.NODE_ENV === "production" ? "/project-myfinances-tool-web" : "";
console.log("basename:" + basename);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* <-- ADD IT HERE, right after ThemeProvider */}
      <Router basename={basename}>
          <UserProvider>
            <NavigationProvider>
              <Box
                sx={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: theme.palette.background.default, // Optional: Explicitly set from theme
                }}
              >
                <Topbar />
                <Box sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 } }}> {/* Added some padding to content area */}
                  <Routes>
                    <Route path="*" element={<Landingpage />} />
                    <Route path="/login" element={<Loginpage />} />
                    <Route path="/signup" element={<Signuppage />} />
                    <Route path="/dashboard" element=
                      {
                        <ProtectedRoute>
                          <Dashboardpage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/transactions" element=
                      {
                        <ProtectedRoute>
                          <TransactionsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/profile" element=
                      {
                        <ProtectedRoute>
                          <Profilepage />
                        </ProtectedRoute>
                      }
                    />
                    {/* Add other routes as needed */}
                  </Routes>
                </Box>
                <Footer />
              </Box>
            </NavigationProvider>
          </UserProvider>
        </Router>
      </ThemeProvider>
  );
}

export default App;