import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  const linkClass = ({ isActive }) => `block py-1 ${isActive ? 'font-bold' : ''}`;
  return (
    <nav className="w-48 bg-gray-800 text-white min-h-screen p-4 space-y-2">
      <div className="font-bold text-xl mb-4">Logo</div>
      <NavLink to="/activity" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/edit" className={linkClass}>Edit</NavLink>
      <NavLink to="/team" className={linkClass}>Team</NavLink>
      <NavLink to="/login" className={linkClass}>Logout</NavLink>
    </nav>
  );
}

export default Navigation;
