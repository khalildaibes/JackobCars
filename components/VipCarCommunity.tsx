'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { setCookie } from '../utils/cookieUtils';

interface VipCarCommunityProps {
  className?: string;
}

const VipCarCommunity: React.FC<VipCarCommunityProps> = ({ className = '' }) => {
  const t = useTranslations('VipCarCommunity');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    username: '',
    email: '',
    plateNumber: '',
    city: '',
    interestedInVip: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phoneNumber.trim() || !formData.email.trim() || !formData.username.trim()) {
      setMessage(t('validation_error'));
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/car-group-signup?phoneNumber=${formData.phoneNumber.trim()}&username=${formData.username.trim()}&email=${formData.email.trim()}&plateNumber=${formData.plateNumber.trim()}&city=${formData.city.trim()}&interestedInVip=${formData.interestedInVip}&source=vip_car_community`);

      const data = await response.json();

      if (response.ok) {
        // Save to cookies
        setCookie('userPhoneNumber', formData.phoneNumber.trim(), 365);
        setCookie('cookieConsent', 'true', 365);
        
        setMessage(t('success_message'));
        setMessageType('success');
        
        // Reset form
        setFormData({
          phoneNumber: '',
          username: '',
          email: '',
          plateNumber: '',
          city: '',
          interestedInVip: false
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
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

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t('title')}
        </h2>
        <p className="text-blue-100">
          {t('description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
              {t('phone_label')} *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder={t('phone_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              {t('username_label')} *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={t('username_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('email_label')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('email_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Plate Number */}
          <div>
            <label htmlFor="plateNumber" className="block text-sm font-medium mb-2">
              {t('plate_label')}
            </label>
            <input
              type="text"
              id="plateNumber"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleInputChange}
              placeholder={t('plate_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              {t('city_label')}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder={t('city_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* VIP Interest */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="interestedInVip"
            name="interestedInVip"
            checked={formData.interestedInVip}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="interestedInVip" className="text-sm font-medium">
            {t('vip_interest_label')}
          </label>
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
          className="w-full bg-white text-blue-600 py-3 px-6 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isSubmitting ? t('submitting') : t('submit_button')}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-100">
          {t('footer_text')}
        </p>
      </div>
    </div>
  );
};

export default VipCarCommunity;
