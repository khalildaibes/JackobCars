/**
 * StepIndicator - Professional step navigation component
 * 
 * This component displays the current progress through the form steps
 * and allows users to click on any step to navigate directly to it.
 * 
 * Features:
 * - Visual step progression with icons and labels
 * - Clickable steps for direct navigation
 * - Smooth animations and transitions
 * - Responsive design for mobile and desktop
 * - Professional styling with hover effects
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { STEP_CONFIGURATION } from '../constants';

interface StepIndicatorProps {
  currentStep: number;
  steps: typeof STEP_CONFIGURATION;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <ol className="flex items-center text-xs sm:text-sm text-gray-700 gap-2 overflow-x-auto pb-4" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index <= currentStep + 1; // Allow clicking on current + next step
          
          return (
            <li key={step.id} className="flex items-center flex-shrink-0">
              <motion.button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                    : isCompleted 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                ) : (
                  <span className="text-xs sm:text-sm">{index + 1}</span>
                )}
              </motion.button>
              
              {/* Step label - show on larger screens */}
              <div className="hidden sm:block ml-3 min-w-0">
                <div className={`text-sm font-medium ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">
                  {step.description}
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.span 
                  className="w-8 sm:w-12 h-px mx-2 bg-gray-300"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      
      {/* Mobile step indicator */}
      <div className="sm:hidden text-center">
        <div className="text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {steps[currentStep]?.title}
        </div>
      </div>
    </motion.div>
  );
};
