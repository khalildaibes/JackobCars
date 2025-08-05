import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface WorkingHours {
  [key: string]: {
    open?: string;
    close?: string;
    closed?: boolean;
  };
}

interface SocialMedia {
  facebook?: string;
  whatsapp?: string;
  instagram?: string;
}

interface Store {
  id: number;
  documentId: string;
  name: string;
  phone: string;
  address: string;
  details: string;
  hostname: string;
  visits: number;
  tags: string;
  provider: string;
  slug: string;
  socialMedia: SocialMedia;
  apiToken: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  clicks: number;
  shares: number;
  additional: {
    working_hours: WorkingHours;
    storechatassistant?: {
      url: string;
    };
  };
}

interface StoreHeaderProps {
  store: Store;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
  const t = useTranslations("BookingPage");

  const formatWorkingHours = () => {
    if (!store.additional?.working_hours) return t('contact_for_hours');
    
    const hours = store.additional.working_hours;
    const dayNames = {
      sunday: t('sunday'),
      monday: t('monday'),
      tuesday: t('tuesday'),
      wednesday: t('wednesday'),
      thursday: t('thursday'),
      friday: t('friday'),
      saturday: t('saturday')
    };
    
    const workingDays = Object.entries(hours)
      .filter(([_, dayInfo]) => !dayInfo.closed && dayInfo.open && dayInfo.close)
      .map(([day, dayInfo]) => `${dayNames[day as keyof typeof dayNames]}: ${dayInfo.open}-${dayInfo.close}`)
      .join(' | ');
    
    return workingDays || t('contact_for_hours');
  };

  const getTodaysHours = () => {
    if (!store.additional?.working_hours) return t('contact_for_hours');
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    
    const todayHours = store.additional.working_hours[currentDay];
    if (!todayHours) return t('contact_for_hours');
    
    if (todayHours.closed) return t('closed_today');
    if (todayHours.open && todayHours.close) {
      return `${t('today')}: ${todayHours.open} - ${todayHours.close}`;
    }
    
    return t('contact_for_hours');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <p className="text-blue-100 text-lg">{t('book_appointment_subtitle')}</p>
              {store.details && (
                <p className="text-blue-100 text-sm mt-2 max-w-md">{store.details}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <MapPin className="h-4 w-4 text-blue-200" />
                <span>{store.address}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <Phone className="h-4 w-4 text-blue-200" />
                <a 
                  href={`https://api.whatsapp.com/send/?phone=${store.phone}&text&type=phone_number&app_absent=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {store.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <Clock className="h-4 w-4 text-blue-200" />
                <span className="text-xs">{getTodaysHours()}</span>
              </div>
              
              {store.tags && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <span className="text-xs">{store.tags.split(',').slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-blue-100">
              <strong>{t('working_hours')}:</strong> {formatWorkingHours()}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StoreHeader;