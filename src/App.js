// App.js or index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NavigationProvider } from './context/NavigationContext';
import Landingpage from './containers/LandingPage';
import Loginpage from './containers/Login';

function App() {
  return (
    <Router>
      <UserProvider>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route path="/login" element={<Loginpage />} />
          </Routes>
        </NavigationProvider>
      </UserProvider>
    </Router>
  );
}

export default App;