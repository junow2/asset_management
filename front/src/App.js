// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Manage from './components/Manage';
import Payments from './components/Payments';
import Addpayment from './components/Addpayment';
import ScrollToTop from './components/ScrollToTop'; // 👈 1. Import the component
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <BrowserRouter>
        <ScrollToTop /> {/* 👈 2. Add it here */}
        <Routes>
          <Route path="/" element={<Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route index element={<Home />} />
            <Route path="employee" element={<Manage />} />
            <Route path="payments" element={<Payments />} />
            <Route path="add" element={<Addpayment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;