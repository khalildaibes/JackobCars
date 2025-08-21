/**
 * TradeInStep - Third step of the car listing form
 * 
 * This component allows users to specify trade-in preferences
 * and provide pros and cons for their vehicle.
 * 
 * Features:
 * - Trade-in option selection
 * - Pros and cons text areas
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Tag, ThumbsUp, ThumbsDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { FormData } from '../types';

interface TradeInStepProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  t: (key: string, values?: any) => string;
}

export const TradeInStep: React.FC<TradeInStepProps> = ({
  formData,
  setFormData,
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
        <Tag className="h-6 w-6 text-green-600" />
        {t('trade_in_option')}
      </motion.h2>
      
      <div className="space-y-6">
        {/* Trade-in Radio Group */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('trade_in_question') || 'Are you interested in trade-in offers?'}
          </label>
          <RadioGroup
            value={formData.tradeIn}
            onValueChange={(value) => setFormData(prev => ({ ...prev, tradeIn: value }))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="text-sm font-medium cursor-pointer">
                {t('yes')} - {t('trade_in_yes_description') || 'I am interested in trade-in offers'}
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="text-sm font-medium cursor-pointer">
                {t('no')} - {t('trade_in_no_description') || 'I am not interested in trade-in offers'}
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <RadioGroupItem value="maybe" id="maybe" />
              <Label htmlFor="maybe" className="text-sm font-medium cursor-pointer">
                {t('maybe')} - {t('trade_in_maybe_description') || 'I might consider trade-in offers'}
              </Label>
            </div>
          </RadioGroup>
        </motion.div>
        
        {/* Pros */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <label className="block text-sm font-medium text-gray-700">
              {t('pros')} <span className="text-gray-500">({t('will_be_auto_generated')})</span>
            </label>
          </div>
          <Textarea
            placeholder={t('pros_placeholder') || 'List the positive aspects of your vehicle...'}
            value={formData.pros}
            onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
            className="rounded-xl py-4 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 {t('pros_hint') || 'Highlight what makes your car special: low mileage, recent maintenance, unique features, etc.'}
          </p>
        </motion.div>
        
        {/* Cons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ThumbsDown className="h-5 w-5 text-red-600" />
            <label className="block text-sm font-medium text-gray-700">
              {t('cons')} <span className="text-gray-500">({t('will_be_auto_generated')})</span>
            </label>
          </div>
          <Textarea
            placeholder={t('cons_placeholder') || 'List any issues or areas for improvement...'}
            value={formData.cons}
            onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
            className="rounded-xl py-4 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 {t('cons_hint') || 'Be honest about any issues - transparency builds trust with potential buyers'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
