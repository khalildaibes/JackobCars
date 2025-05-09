import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers, Shield, SprayCan, Wrench, Brush, Package } from 'lucide-react';

interface StoreServicesProps {
  isRTL: boolean;
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

const StoreServices: React.FC<StoreServicesProps> = ({ isRTL }) => {
  const t = useTranslations("HomePage");

  return (
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
  );
};

export default StoreServices; 