/**
 * PopupModal - Success/Error message modal component
 * 
 * This component displays success and error messages in a professional modal
 * with smooth animations and proper styling.
 * 
 * Features:
 * - Success and error message types
 * - Smooth entrance and exit animations
 * - Professional styling with icons
 * - Responsive design for all screen sizes
 * - Click outside to close functionality
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { PopupModal as PopupModalType } from '../types';

interface PopupModalProps {
  isVisible: boolean;
  config: PopupModalType;
  onClose: () => void;
  t: (key: string, values?: any) => string;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  isVisible,
  config,
  onClose,
  t
}) => {
  const isSuccess = config.type === 'success';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl ${
              isSuccess ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`p-3 rounded-full ${
                  isSuccess 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {isSuccess ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : (
                  <AlertCircle className="h-6 w-6" />
                )}
              </motion.div>
              <div className="flex-1">
                <motion.h3 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className={`text-lg font-semibold ${
                    isSuccess ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {config.title}
                </motion.h3>
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-500" />
              </motion.button>
            </div>
            
            {/* Message */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className={`text-gray-700 mb-6 leading-relaxed ${
                isSuccess ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {config.message}
            </motion.p>
            
            {/* Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex justify-end"
            >
              <Button
                onClick={onClose}
                className={`px-6 py-2 transition-all duration-200 hover:scale-105 ${
                  isSuccess
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {t('close') || 'Close'}
              </Button>
            </motion.div>
            
            {/* Success-specific content */}
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="mt-4 pt-4 border-t border-green-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    {t('success_subtitle') || 'Your car listing has been submitted successfully!'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {t('success_description') || 'You will receive a confirmation email shortly.'}
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Error-specific content */}
            {!isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="mt-4 pt-4 border-t border-red-200"
              >
                <div className="text-center">
                  <p className="text-sm text-red-700 font-medium">
                    {t('error_subtitle') || 'Something went wrong'}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {t('error_description') || 'Please try again or contact support if the problem persists.'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
