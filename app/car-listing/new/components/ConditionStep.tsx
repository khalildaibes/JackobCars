/**
 * ConditionStep - Second step of the car listing form
 * 
 * This component allows users to describe the car's condition,
 * known problems, and optionally generate an AI description.
 * 
 * Features:
 * - Condition rating selection
 * - Known problems text area
 * - AI description generation
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bot, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { FormData } from '../types';
import { CAR_CONDITIONS } from '../constants';

interface ConditionStepProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  govCarInfo: any;
  t: (key: string, values?: any) => string;
}

export const ConditionStep: React.FC<ConditionStepProps> = ({
  formData,
  setFormData,
  govCarInfo,
  t
}) => {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  /**
   * Generates AI description for the car
   */
  const generateAIDescription = async () => {
    if (!govCarInfo) {
      alert(t('fill_description_first'));
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      const response = await fetch('/api/createDescription?data=' + encodeURIComponent(JSON.stringify(formData)));
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, description: data.description }));
      } else {
        alert(t('failed_to_generate_description'));
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert(t('error_generating_description'));
    } finally {
      setIsGeneratingDescription(false);
    }
  };

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
        <Shield className="h-6 w-6 text-blue-600" />
        {t('condition')}
      </motion.h2>
      
      <div className="space-y-6">
        {/* Current Condition */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('current_condition')} <span className="text-gray-500">({t('optional')})</span>
          </label>
          <Select
            value={formData.currentCondition}
            onValueChange={(value) => setFormData(prev => ({ ...prev, currentCondition: value }))}
          >
            <SelectTrigger className="rounded-xl py-5">
              <SelectValue placeholder={t('current_condition')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {CAR_CONDITIONS.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {t(`condition_${condition}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        {/* Known Problems */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('known_problems')} <span className="text-gray-500">({t('optional')})</span>
          </label>
          <Textarea
            placeholder={`${t('known_problems')} (${t('optional')})`}
            value={formData.knownProblems}
            onChange={(e) => setFormData(prev => ({ ...prev, knownProblems: e.target.value }))}
            className="rounded-xl py-4 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
        
        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('description')} <span className="text-gray-500">({t('will_be_auto_generated') || 'Will be auto-generated if left empty'})</span>
            </label>
            <Button
              type="button"
              onClick={generateAIDescription}
              disabled={isGeneratingDescription || !govCarInfo}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingDescription ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Bot className="h-3 w-3" />
              )}
              {t('generate_ai_description') || 'Generate AI Description'}
            </Button>
          </div>
          <Textarea
            placeholder={t('description_placeholder')}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="rounded-xl py-4 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
          />
          {!govCarInfo && (
            <p className="mt-2 text-sm text-amber-600">
              💡 {t('fill_description_first') || 'Please fill in basic car information first to enable AI description generation'}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
