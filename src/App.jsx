import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './css/style.css';
import './charts/ChartjsConfig';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActivityDashboard from './pages/ActivityDashboard';
import TeamDashboard from './pages/TeamDashboard';
import EditActivity from './pages/EditActivity';

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<ActivityDashboard />} />
        <Route path="/team" element={<TeamDashboard />} />
        <Route path="/edit" element={<EditActivity />} />
      </Routes>
    </>
  );
}

export default App;
