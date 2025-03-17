// App.js or index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NavigationProvider } from './context/NavigationContext';
import Landingpage from './containers/LandingPage';
import Dashboardpage from './containers/Dashboard';
import Loginpage from './containers/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Topbar from './containers/Topbar'
import Footer from './containers/Footer'


function App() {
  return (
    <Router>
        <UserProvider>
          <NavigationProvider>
            <Topbar />
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
            <Footer />
          </NavigationProvider>
        </UserProvider>
      </Router>
  );
}

export default App;