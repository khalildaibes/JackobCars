import { useState, useEffect } from 'react';
import { getCookie } from '../utils/cookieUtils';

export const useWelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('welcomePopupSeen');
    
    // Only show popup if user hasn't seen it before
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    // Mark as seen in localStorage - this ensures it only shows once per device
    localStorage.setItem('welcomePopupSeen', 'true');
  };

  const openPopup = () => {
    setIsOpen(true);
  };

  return {
    isOpen,
    closePopup,
    openPopup
  };
};
