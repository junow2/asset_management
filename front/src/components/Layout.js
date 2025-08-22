// src/components/Layout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './css/Navbar.css'; // We'll create this CSS file

// The Navbar component receives the state and toggle function
const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">메인 페이지</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/employee">인원관리</Link>
        <Link to="/add">납부등록</Link>
        <Link to="/payments">납부조회</Link>
        <ch-button onClick={toggleDarkMode} className="theme-toggle-button">
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </ch-button>
      </div>
    </nav>
  );
};

// The Layout component renders the Navbar and the active route's component
const Layout = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="main-container">
        {/* The Outlet component renders the matched child route component */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
