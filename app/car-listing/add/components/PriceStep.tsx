/**
 * PriceStep - Fourth step of the car listing form
 * 
 * This component allows users to set their asking price
 * with guidance from Yad2 price data if available.
 * 
 * Features:
 * - Price input field
 * - Yad2 price heatmap visualization
 * - Price range indicators
 * - Professional animations and transitions
 * - Responsive design for all screen sizes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Input } from "../../../../components/ui/input";
import { FormData } from '../types';

interface PriceStepProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  yad2PriceInfo: any;
  t: (key: string, values?: any) => string;
}

export const PriceStep: React.FC<PriceStepProps> = ({
  formData,
  setFormData,
  yad2PriceInfo,
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
        <DollarSign className="h-6 w-6 text-green-600" />
        {t('price')}
      </motion.h2>
      
      <div className="space-y-6">
        {/* Yad2 Price Guidance */}
        {yad2PriceInfo?.data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                {t('price_guidance') || 'Price Guidance'}
              </h3>
            </div>
            
            {/* Price Range Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-gray-600">{t('min')}</span>
                </div>
                <div className="text-lg font-bold text-red-600">
                  ₪{Number(yad2PriceInfo.data.minPrice).toLocaleString()}
                </div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border-2 border-blue-500 shadow-md">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-600">{t('predicted')}</span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ₪{Number(yad2PriceInfo.data.predictedPrice).toLocaleString()}
                </div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-gray-600">{t('max')}</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ₪{Number(yad2PriceInfo.data.maxPrice).toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Price Heatmap */}
            <div className="mb-4">
              <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-red-400 via-yellow-300 to-green-500" aria-label="Price heatmap" />
              {(() => {
                const min = Number(yad2PriceInfo.data.minPrice) || 0;
                const max = Number(yad2PriceInfo.data.maxPrice) || 0;
                const pred = Number(yad2PriceInfo.data.predictedPrice) || 0;
                const range = Math.max(max - min, 1);
                const pct = Math.min(100, Math.max(0, ((pred - min) / range) * 100));
                return (
                  <div className="relative h-6">
                    <div className="absolute top-0 -mt-2" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                      <div className="h-5 w-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Accuracy and Recommendations */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {t('accuracy')}: <span className="font-medium">{String(yad2PriceInfo.data.accuracyId)}</span>
              </span>
              <span className="text-blue-600 font-medium">
                💡 {t('price_recommendation') || 'Recommended: Set price near predicted value'}
              </span>
            </div>
          </motion.div>
        )}
        
        {/* Asking Price Input */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('asking_price')} <span className="text-gray-500">({t('in_israeli_shekels') || 'in Israeli Shekels'})</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
              ₪
            </span>
            <Input
              placeholder={t('asking_price_placeholder') || 'Enter your asking price...'}
              type="number"
              value={formData.askingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
              className="w-full text-lg py-6 pl-12 pr-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Price Tips */}
          {yad2PriceInfo?.data && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">{t('pricing_tips') || 'Pricing Tips:'}</p>
                  <ul className="text-xs space-y-1">
                    <li>• {t('price_tip_1') || 'Set price near the predicted value for faster sale'}</li>
                    <li>• {t('price_tip_2') || 'Consider your car\'s condition and unique features'}</li>
                    <li>• {t('price_tip_3') || 'Leave room for negotiation (5-10% above target)'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
