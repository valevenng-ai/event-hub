import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken } from '../store/authStore';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span>EventHub</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/"            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
          Dashboard
        </NavLink>
        <NavLink to="/events"      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Événements
        </NavLink>
        <NavLink to="/participants" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Participants
        </NavLink>
      </div>

      <button className="navbar-logout" onClick={handleLogout}>
        Déconnexion
      </button>
    </nav>
  );
}

export default Navbar;