// components/ScrollFix.jsx
import { useEffect } from 'react';

const ScrollFix = () => {
  useEffect(() => {
    // Smooth scrolling disable karo
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Force reflow
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 1000);

    return () => {
      document.documentElement.style.scrollBehavior = 'smooth';
    };
  }, []);

  return null;
};

export default ScrollFix;