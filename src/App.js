// App.js or index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './containers/LandingPage';
import Loginpage from './containers/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Loginpage />} />
      </Routes>
    </Router>
  );
}

export default App;