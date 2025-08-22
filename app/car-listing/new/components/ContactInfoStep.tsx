/**
 * ContactInfoStep - Fifth step of the car listing form
 * 
 * This component allows users to provide their contact information
 * and select their region for potential buyers.
 * 
 * Features:
 * - Name, email, and phone input fields
 * - Region selection dropdown
 * - Form validation and error handling
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { FormData, ValidationErrors } from '../types';
import { REGION_OPTIONS } from '../constants';

interface ContactInfoStepProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
  t: (key: string, values?: any) => string;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  t
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3"
      >
        <User className="h-6 w-6 text-purple-600" />
        {t('contact_info')}
      </motion.h2>
      
      <div className="space-y-6">
        {/* Name Field */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t('name_placeholder') || 'Enter your full name...'}
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                // setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={`w-full text-lg py-6 pl-12 pr-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </motion.div>

        {/* Email Field */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')} <span className="text-gray-500">({t('optional')})</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t('email_placeholder') || 'Enter your email address...'}
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                // setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full text-lg py-6 pl-12 pr-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          <p className="mt-1 text-xs text-gray-500">
            💡 {t('email_hint') || 'Providing an email allows potential buyers to contact you directly'}
          </p>
        </motion.div>

        {/* Phone Field */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('phone')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t('phone_placeholder') || 'Enter your phone number...'}
              value={formData.phone}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, phone: e.target.value }));
                // setErrors(prev => ({ ...prev, phone: '' }));
              }}
              className={`w-full text-lg py-6 pl-12 pr-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          <p className="mt-1 text-xs text-gray-500">
            💡 {t('phone_hint') || 'Use Israeli format: 05X-XXXXXXX or +972-XX-XXXXXXX'}
          </p>
        </motion.div>

        {/* Region Field */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-2" />
            {t('region') || 'Region'} <span className="text-gray-500">({t('optional') || 'Optional'})</span>
          </label>
          <Select
            value={formData.region}
            onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
          >
            <SelectTrigger className="rounded-xl py-5">
              <SelectValue placeholder={t('select_region') || 'Select your region'} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {REGION_OPTIONS.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-gray-500">
            💡 {t('region_hint') || 'Selecting your region helps buyers find cars in their area'}
          </p>
        </motion.div>

        {/* Contact Information Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">{t('contact_tips_title') || 'Contact Information Tips:'}</p>
              <ul className="text-xs space-y-1">
                <li>• {t('contact_tip_1') || 'Provide accurate contact information for faster responses'}</li>
                <li>• {t('contact_tip_2') || 'Your phone number will be visible to potential buyers'}</li>
                <li>• {t('contact_tip_3') || 'Consider adding your preferred contact method'}</li>
                <li>• {t('contact_tip_4') || 'Keep your phone on and respond promptly to inquiries'}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
