import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Car, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';

interface StoreInfoProps {
  isRTL: boolean;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ isRTL }) => {
  const t = useTranslations("HomePage");

  return (
    <motion.div 
      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex-1 text-white space-y-4 sm:space-y-6 w-full"
    >
      <div className={`flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <Car className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          ASD - Auto Spa Detailing
        </h2>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
          <span className="text-sm sm:text-base">بولتيمور 30, إقليم الصناعات الثقيلة, عكا</span>
        </div>
        
        <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
          <span className="text-sm sm:text-base">يعقوب: 0544603725</span>
        </div>

        <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
          <span className="text-sm sm:text-base">يوسي: 0542354882</span>
        </div>
        
        <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
          <span className="text-sm sm:text-base">{t('open_7_days')}</span>
        </div>
      </div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 sm:mt-6"
      >
        <Link 
          href="/book-appointment"
          className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('book_now')}
          <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'transform rotate-180' : ''}`} />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default StoreInfo; 