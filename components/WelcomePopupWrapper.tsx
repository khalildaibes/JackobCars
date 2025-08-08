'use client';

import React from 'react';
import WelcomePopup from './WelcomePopup';
import { useWelcomePopup } from '../hooks/useWelcomePopup';

const WelcomePopupWrapper: React.FC = () => {
  const { isOpen, closePopup } = useWelcomePopup();

  return <WelcomePopup isOpen={isOpen} onClose={closePopup} />;
};

export default WelcomePopupWrapper;
