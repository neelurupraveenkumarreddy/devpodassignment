import React, { Component } from 'react';
// Main App Component with Routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Projects from './pages/Projects';
import GeneralLedger from './pages/GeneralLedger';
import Vendors from './pages/Vendors';
import Layout from './components/Layout';

import './App.css';

class App extends Component {
  render() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="finance" element={<Finance />} />
            <Route path="projects" element={<Projects />} />
            <Route path="gl" element={<GeneralLedger />} />
            <Route path="vendors" element={<Vendors />} />
          </Route>
        </Routes>
      </Router>
    );
  }
}

export default App;
