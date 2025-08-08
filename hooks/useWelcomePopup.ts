import { useState, useEffect } from 'react';
import { getCookie } from '../utils/cookieUtils';

export const useWelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('welcomePopupSeen');
    
    // Check if user has agreed to cookies and has phone number
    const cookieConsent = getCookie('cookieConsent');
    const userPhoneNumber = getCookie('userPhoneNumber');
    
    // Only show popup if:
    // 1. User hasn't seen the popup before
    // 2. User hasn't agreed to cookies OR user agreed but doesn't have phone number
    if (!hasSeenPopup && (!cookieConsent || !userPhoneNumber)) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    // Mark as seen in localStorage
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
