import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import StoreInfo from './StoreInfo';
import StoreImage from './StoreImage';
import StoreServices from './StoreServices';

interface StorePromotionProps {
  className?: string;
}

const StorePromotion: React.FC<StorePromotionProps> = ({ className = '' }) => {
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he';

  return (
    <div className={`space-y-6 sm:space-y-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl backdrop-blur-sm ${className}`}
      >
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <StoreInfo isRTL={isRTL} />
          <StoreImage isRTL={isRTL} />
        </div>
        <StoreServices isRTL={isRTL} />
      </motion.section>
    </div>
  );
};

export default StorePromotion; 