"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
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
    maxSimultaneousAppointments?: number; // Default to 1 if not set
    appointmentDuration?: number; // Default to 60 minutes if not set
    storechatassistant?: {
      url: string;
    };
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
  bookedCount: number;
  maxCapacity: number;
}

interface BookingCalendarProps {
  storeId: string;
  store: Store;
  onDateTimeSelect: (date: Date, time: string) => void;
  selectedDate: Date | null;
  selectedTime: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  storeId,
  store,
  onDateTimeSelect,
  selectedDate,
  selectedTime,
}) => {
  const t = useTranslations("BookingPage");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<{ [key: string]: TimeSlot[] }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions for working with the new store structure
  const getWorkingDays = (): number[] => {
    if (!store.additional?.working_hours) return [1, 2, 3, 4, 5]; // Default to weekdays
    
    const dayMap: { [key: string]: number } = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6
    };
    
    return Object.entries(store.additional.working_hours)
      .filter(([_, hours]) => !hours.closed && hours.open && hours.close)
      .map(([day, _]) => dayMap[day])
      .filter(dayNum => dayNum !== undefined)
      .sort();
  };

  const getWorkingHoursForDay = (dayOfWeek: number): { start: string; end: string } | null => {
    if (!store.additional?.working_hours) return { start: '09:00', end: '17:00' }; // Default hours
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[dayOfWeek];
    const dayHours = store.additional.working_hours[dayName];
    
    if (!dayHours || dayHours.closed || !dayHours.open || !dayHours.close) {
      return null;
    }
    
    return { start: dayHours.open, end: dayHours.close };
  };

  const getAppointmentDuration = (): number => {
    return store.additional?.appointmentDuration || 60; // Default to 60 minutes
  };

  const getMaxSimultaneousAppointments = (): number => {
    return store.additional?.maxSimultaneousAppointments || 1; // Default to 1
  };

  // Generate time slots based on store working hours for a specific day
  const generateTimeSlots = (selectedDate?: Date): string[] => {
    const slots: string[] = [];
    
    if (!selectedDate) {
      // If no date selected, use Monday as default for initial load
      selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate() + (1 - selectedDate.getDay() + 7) % 7);
    }
    
    const dayOfWeek = selectedDate.getDay();
    const workingHours = getWorkingHoursForDay(dayOfWeek);
    
    if (!workingHours) return slots;
    
    const duration = getAppointmentDuration();
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    for (let minutes = startMinutes; minutes < endMinutes; minutes += duration) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }

    return slots;
  };

  // Load availability data for a specific date
  const loadAvailability = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/appointments/availability?storeId=${storeId}&date=${dateStr}`);
      
      if (response.ok) {
        const data = await response.json();
        const timeSlots = generateTimeSlots(date);
        const maxCapacity = getMaxSimultaneousAppointments();
        
        const slots: TimeSlot[] = timeSlots.map(time => {
          const existing = data.slots?.find((slot: any) => slot.time === time);
          return {
            time,
            available: !existing || existing.bookedCount < maxCapacity,
            bookedCount: existing?.bookedCount || 0,
            maxCapacity,
          };
        });

        setAvailableSlots(prev => ({
          ...prev,
          [dateStr]: slots
        }));
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate calendar days for current month
  const getCalendarDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workingDays = getWorkingDays();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Only include dates from today onwards and within working days
      if (date >= today && workingDays.includes(date.getDay())) {
        days.push(date);
      } else if (date.getMonth() === currentDate.getMonth()) {
        // Include non-working days for display but disabled
        days.push(date);
      }
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    const workingDays = getWorkingDays();
    if (!workingDays.includes(date.getDay())) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    // Set the selected date and clear any previously selected time
    onDateTimeSelect(date, "");
    loadAvailability(date);
  };

  const handleTimeSelect = (date: Date, time: string) => {
    onDateTimeSelect(date, time);
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workingDays = getWorkingDays();
    return date >= today && workingDays.includes(date.getDay());
  };

  useEffect(() => {
    if (selectedDate) {
      loadAvailability(selectedDate);
    }
  }, [selectedDate, storeId]);

  const monthNames = [
    t('january'), t('february'), t('march'), t('april'),
    t('may'), t('june'), t('july'), t('august'),
    t('september'), t('october'), t('november'), t('december')
  ];

  const dayNames = [
    t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')
  ];

  return (
    <div className="space-y-6 mt">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          disabled={currentDate.getMonth() === new Date().getMonth() && 
                   currentDate.getFullYear() === new Date().getFullYear()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {getCalendarDays().map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isAvailable = isDateAvailable(date);
          const isSelected = isDateSelected(date);
          
          return (
            <motion.button
              key={index}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              className={`
                p-3 text-sm rounded-lg transition-all duration-200 border-2
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                ${isAvailable ? 'hover:bg-blue-100 hover:border-blue-200 cursor-pointer border-transparent' : 'cursor-not-allowed opacity-50 border-transparent'}
                ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : ''}
                ${!isAvailable && isCurrentMonth ? 'bg-gray-100 border-gray-200' : ''}
                ${isAvailable && !isSelected ? 'border-gray-200' : ''}
              `}
              onClick={() => isAvailable && handleDateSelect(date)}
              disabled={!isAvailable}
            >
              {date.getDate()}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Date Indicator */}
      {selectedDate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">
              {t('selected_date')}: {selectedDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Time Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            {t('available_times')}
          </h4>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : availableSlots[selectedDate.toISOString().split('T')[0]]?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots[selectedDate.toISOString().split('T')[0]]?.map((slot) => (
                <motion.button
                  key={slot.time}
                  whileHover={slot.available ? { scale: 1.02 } : {}}
                  whileTap={slot.available ? { scale: 0.98 } : {}}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-sm font-medium
                    ${slot.available 
                      ? selectedTime === slot.time
                        ? 'border-blue-500 bg-blue-600 text-white shadow-lg scale-105'
                        : 'border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-500 cursor-not-allowed'
                    }
                  `}
                  onClick={() => slot.available && handleTimeSelect(selectedDate, slot.time)}
                  disabled={!slot.available}
                >
                  <div className="flex items-center justify-center gap-1">
                    {slot.available ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{slot.time}</span>
                  </div>
                  <div className="text-xs mt-1">
                    {slot.bookedCount}/{slot.maxCapacity}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">{t('no_time_slots_available')}</p>
              <p className="text-xs mt-1">{t('try_different_date')}</p>
            </div>
          )}
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>{t('available')}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-600" />
              <span>{t('fully_booked')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingCalendar;