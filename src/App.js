import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPatient from './components/RegisterPatient';
import RegisterPharmacist from './components/RegisterPharmacist';
import Login from './components/Login';
import Patient from './components/Patient';
import Pharmacist from './components/Pharmacist';
import Admin from './components/Admin';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* register routes */}
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-pharmacist" element={<RegisterPharmacist />} />

        {/* login route */}
        <Route path="/login" element={<Login />} />

        {/* user-specific routes */}
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/patient/*" element={<Patient />} />
        <Route path="/pharmacist/*" element={<Pharmacist />} />

        {/* main route */}
        <Route path="/" element={<Login />} />

        {/* all other routes */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
