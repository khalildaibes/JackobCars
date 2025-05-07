import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Star, MapPin, Clock, Phone, ArrowRight, Sparkles, Droplets, Shield, Brush, Wrench, Package, Layers, SprayCan } from 'lucide-react';
import { Img } from './Img';

interface StorePromotionProps {
  className?: string;
}

const services = [
  {
    icon: Sparkles,
    titleKey: "detailing_kits",
    descriptionKey: "detailing_kits_desc",
    color: "from-blue-600 to-blue"
  },
  {
    icon: Layers,
    titleKey: "wrap_and_ppf",
    descriptionKey: "wrap_and_ppf_desc",
    color: "from-blue-600 to-blue-800"
  },
  {
    icon: Shield,
    titleKey: "nano_ceramic",
    descriptionKey: "nano_ceramic_desc",
    color: "from-blue-500 to-blue-900"
  },
  {
    icon: SprayCan,
    titleKey: "clippers_paint",
    descriptionKey: "clippers_paint_desc",
    color: "from-blue-800 to-blue"
  },
  {
    icon: Wrench,
    titleKey: "wheels_paint",
    descriptionKey: "wheels_paint_desc",
    color: "from-blue-700 to-blue-500"
  },
  {
    icon: Brush,
    titleKey: "polish_wax",
    descriptionKey: "polish_wax_desc",
    color: "from-blue-900 to-blue-700"
  },
  {
    icon: Package,
    titleKey: "nano_protection",
    descriptionKey: "nano_protection_desc",
    color: "from-blue-800 to-blue-600"
  }
];

const StorePromotion: React.FC<StorePromotionProps> = ({ className = '' }) => {
  const t = useTranslations("HomePage");
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
          {/* Store Info */}
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
                <span className="text-sm sm:text-base">בולטימור 30, אזור תעשיה עכו</span>
              </div>
              
              <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                <span className="text-sm sm:text-base">יעקב: 0544603725</span>
              </div>

              <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                <span className="text-sm sm:text-base">יוסי: 0542354882</span>
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

          {/* Store Image */}
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 relative w-full mt-4 sm:mt-0"
          >
            <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
              <Image
                src="/asd.jpg"
                width={1000}
                height={1000}
                alt="ASD - Auto Spa Detailing Showroom"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-gradient-to-r from-blue-600/90 to-blue-800/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg"
            >
              <p className="text-white text-sm sm:text-lg font-medium">
              احترافية، مصداقية، وخدمة تفوق التوقعات.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full px-2 sm:px-0"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{t('our_services')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ y: 0 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${service.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full shadow-lg hover:shadow-xl transition-shadow`}>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{t(service.titleKey)}</h4>
                  <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">{t(service.descriptionKey)}</p>
                  <div className="mt-2 sm:mt-4">
                    <Link 
                      href={`/services/${t(service.titleKey).toLowerCase().replace(/\s+/g, '-')}`}
                      className={`inline-flex items-center gap-1 text-white/90 hover:text-white text-xs sm:text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {t('learn_more')}
                      <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 ${isRTL ? 'transform rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.section>
    </div>
  );
};

export default StorePromotion; 