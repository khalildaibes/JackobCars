/**
 * LoadingOverlay - Loading state overlay component
 * 
 * This component displays a professional loading overlay
 * during form submission with step-by-step progress indication.
 * 
 * Features:
 * - Full-screen overlay with backdrop blur
 * - Animated loading spinner
 * - Step-by-step progress indication
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { ProcessingStep } from '../types';

interface LoadingOverlayProps {
  isVisible: boolean;
  currentStep: ProcessingStep;
  t: (key: string, values?: any) => string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  currentStep,
  t
}) => {
  const getStepIcon = (step: ProcessingStep) => {
    switch (step) {
      case 'validating_form':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'uploading_image':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'preparing_data':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'submitting_listing':
        return <Clock className="h-6 w-6 text-blue-500" />;
      default:
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
    }
  };

  const getStepMessage = (step: ProcessingStep) => {
    switch (step) {
      case 'validating_form':
        return t('validating_form') || 'Validating form data...';
      case 'uploading_image':
        return t('uploading_image') || 'Uploading images...';
      case 'preparing_data':
        return t('preparing_data') || 'Preparing car listing data...';
      case 'submitting_listing':
        return t('submitting_listing') || 'Submitting your listing...';
      default:
        return t('processing') || 'Processing...';
    }
  };

  const getStepDescription = (step: ProcessingStep) => {
    switch (step) {
      case 'validating_form':
        return t('validating_form_description') || 'Checking all required fields and validation rules...';
      case 'uploading_image':
        return t('uploading_image_description') || 'Compressing and uploading your car images...';
      case 'preparing_data':
        return t('preparing_data_description') || 'Organizing your car information for submission...';
      case 'submitting_listing':
        return t('submitting_listing_description') || 'Sending your car listing to our database...';
      default:
        return t('processing_description') || 'Please wait while we process your car listing. This may take a few moments.';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
          >
            {/* Main Loading Spinner */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center"
            >
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </motion.div>
            
            {/* Title */}
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xl font-semibold text-gray-800 mb-2"
            >
              {t('processing') || 'Processing...'}
            </motion.h3>
            
            {/* Current Step */}
            {currentStep && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-4"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  {getStepIcon(currentStep)}
                  <span className="text-sm font-medium text-gray-700">
                    {getStepMessage(currentStep)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {getStepDescription(currentStep)}
                </p>
              </motion.div>
            )}
            
            {/* Progress Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
            </motion.div>
            
            {/* Additional Info */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 pt-4 border-t border-gray-200"
            >
              <p className="text-xs text-gray-500">
                💡 {t('loading_tip') || 'Please don\'t close this window while we process your listing'}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
