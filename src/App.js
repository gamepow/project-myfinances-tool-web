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
import ChangePassword from './pages/ChangePassword';
import Topbar from './pages/Topbar' // Assuming Topbar.js is in the pages folder
import Footer from './pages/Footer'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // <-- IMPORT IT
import theme from './theme';
import Box from '@mui/material/Box';
import MyBudget from './pages/MyBudget'; // Import MyBudget component
import MyCategories from './pages/MyCategories'; // Import MyCategories component
import MyAccounts from './pages/MyAccounts'; // Import MyAccounts component

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
                <Box>
                  <Topbar />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: { xs: 1, sm: 2, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
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
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/change-password" element=
                      {
                        <ProtectedRoute>
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/my-budget" element={
                        <ProtectedRoute>
                            <MyBudget />
                        </ProtectedRoute>
                    } />                    <Route path="/my-categories" element={
                        <ProtectedRoute>
                            <MyCategories />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-accounts" element={
                        <ProtectedRoute>
                            <MyAccounts />
                        </ProtectedRoute>
                    } />
                    {/* Add other routes as needed */}
                  </Routes>
                </Box>
                <Box>
                  <Footer />
                </Box>
              </Box>
            </NavigationProvider>
          </UserProvider>
        </Router>
      </ThemeProvider>
  );
}

export default App;