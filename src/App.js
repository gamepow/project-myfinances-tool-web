// App.js or index.js
import React from 'react';
import './components/css/Main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NavigationProvider } from './context/NavigationContext';
import Landingpage from './containers/LandingPage';
import Dashboardpage from './containers/Dashboard';
import Loginpage from './containers/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Topbar from './containers/Topbar'
import Footer from './containers/Footer'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import your custom theme


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
          <UserProvider>
            <NavigationProvider>
              <div className="app-container">
                <Topbar />
                <div className='content'>
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
                </div>
                <Footer />
              </div>
            </NavigationProvider>
          </UserProvider>
        </Router>
      </ThemeProvider>
  );
}

export default App;