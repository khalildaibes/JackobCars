'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { setCookie } from '../utils/cookieUtils';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('WelcomePopup');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setMessage(t('validation_error'));
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/users?phoneNumber=${phoneNumber.trim()}`);

      const data = await response.json();

      if (response.ok) {
        // Save phone number to cookies
        setCookie('userPhoneNumber', phoneNumber.trim(), 365); // Store for 1 year
        setCookie('cookieConsent', 'true', 365); // Mark as agreed to cookies
        
        setMessage(t('success_message'));
        setMessageType('success');
        setPhoneNumber('');
        // Close popup after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage(data.error || t('error_message'));
        setMessageType('error');
      }
    } catch (error) {
      setMessage(t('network_error'));
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Only allow closing after successful submission
    if (messageType === 'success') {
      setPhoneNumber('');
      setMessage('');
      setMessageType('');
      onClose();
    }
  };

  // Prevent closing by clicking outside or pressing escape
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && messageType === 'success') {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && messageType === 'success') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown as any);
      return () => {
        document.removeEventListener('keydown', handleKeyDown as any);
      };
    }
  }, [isOpen, messageType]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button - only show after successful submission */}
        {messageType === 'success' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            aria-label="Close popup"
          >
            ×
          </button>
        )}
        
        {/* Visual indicator that popup cannot be closed */}
        {messageType !== 'success' && (
          <div className="absolute top-4 right-4 text-gray-400 text-xs">
            {t('required_indicator')}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600">
            {t('description')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('required_note')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone_label')}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t('phone_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message display */}
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t('submitting') : t('submit_button')}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {t('footer_text')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
