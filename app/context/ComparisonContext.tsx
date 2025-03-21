"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface ComparisonContextType {
  selectedCars: any[];
  addToComparison: (car: any) => void;
  removeFromComparison: (carId: string) => void;
  clearComparison: () => void;
  isInComparison: (carId: string) => boolean;
  shareComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedCars, setSelectedCars] = useState<any[]>([]);
  const t = useTranslations('Comparison');

  useEffect(() => {
    const storedCars = localStorage.getItem('selectedCars');
    if (storedCars) {
      setSelectedCars(JSON.parse(storedCars));
    }
  }, []);

  const addToComparison = (car: any) => {
    // Check if car is already in comparison
    if (selectedCars.some(selectedCar => selectedCar.id === car.id)) {
      toast.error(t('car_already_added'));
      return;
    }

    // Check if we've reached the maximum limit
    if (selectedCars.length >= 3) {
      toast.error(t('max_cars_reached'));
      return;
    }

    const updatedCars = [...selectedCars, car];
    setSelectedCars(updatedCars);
    localStorage.setItem('selectedCars', JSON.stringify(updatedCars));
    toast.success(t('car_added_to_comparison'));
  };

  const removeFromComparison = (carId: string) => {
    const updatedCars = selectedCars.filter(car => car.id !== carId);
    setSelectedCars(updatedCars);
    localStorage.setItem('selectedCars', JSON.stringify(updatedCars));
    toast.success(t('car_removed_from_comparison'));
  };

  const clearComparison = () => {
    setSelectedCars([]);
    localStorage.removeItem('selectedCars');
    toast.success(t('comparison_cleared'));
  };

  const isInComparison = (carId: string) => {
    return selectedCars.some(car => car.id === carId);
  };

  const shareComparison = async () => {
    const comparisonUrl = `${window.location.origin}/comparison?cars=${selectedCars.map(car => car.id).join(',')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('share_title'),
          text: t('share_text'),
          url: comparisonUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error(t('share_error'));
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(comparisonUrl);
      toast.success(t('copied_to_clipboard'));
    }
  };

  return (
    <ComparisonContext.Provider value={{
      selectedCars,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison,
      shareComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
} 