// src/components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page on every route change
    window.scrollTo(0, 0);
  }, [pathname]); // The effect runs every time the pathname changes

  return null; // This component does not render anything
}