// App.js or index.js
import React from 'react';
import './layouts/css/Main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NavigationProvider } from './context/NavigationContext';
import Landingpage from './pages/LandingPage';
import Dashboardpage from './pages/Dashboard';
import Loginpage from './pages/Login';
import ProtectedRoute from './layouts/ProtectedRoute';
import Topbar from './pages/Topbar'
import Footer from './pages/Footer'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import your custom theme
import Box from '@mui/material/Box';

const basename = process.env.NODE_ENV === "production" ? "/project-myfinances-tool-web" : "";
console.log("basename:" + basename);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename={basename}>
          <UserProvider>
            <NavigationProvider>
              <Box
                sx={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >              
                <Topbar />
                <Box sx={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Landingpage />} />
                    <Route path="/login" element={<Loginpage />} />
                    <Route path="/dashboard" element=
                      {
                        <ProtectedRoute>
                          <Dashboardpage />
                        </ProtectedRoute> 
                      }  
                    />
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