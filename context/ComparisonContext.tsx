"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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

  useEffect(() => {
    const storedCars = localStorage.getItem('selectedCars');
    if (storedCars) {
      setSelectedCars(JSON.parse(storedCars));
    }
  }, []);

  const addToComparison = (car: any) => {
    // Check if car is already in comparison
    if (selectedCars.some(selectedCar => selectedCar.id === car.id)) {
      toast.error('Car already added to comparison');
      return;
    }

    // Check if we've reached the maximum limit
    if (selectedCars.length >= 3) {
      toast.error('Maximum of 3 cars allowed for comparison');
      return;
    }

    const updatedCars = [...selectedCars, car];
    setSelectedCars(updatedCars);
    localStorage.setItem('selectedCars', JSON.stringify(updatedCars));
    toast.success('Car added to comparison');
  };

  const removeFromComparison = (carId: string) => {
    const updatedCars = selectedCars.filter(car => car.id !== carId);
    setSelectedCars(updatedCars);
    localStorage.setItem('selectedCars', JSON.stringify(updatedCars));
    toast.success('Car removed from comparison');
  };

  const clearComparison = () => {
    setSelectedCars([]);
    localStorage.removeItem('selectedCars');
    toast.success('Comparison cleared');
  };

  const isInComparison = (carId: string) => {
    return selectedCars.some(car => car.id === carId);
  };

  const shareComparison = async () => {
    const comparisonUrl = `${window.location.origin}/comparison?cars=${selectedCars.map(car => car.id).join(',')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Car Comparison',
          text: 'Check out this car comparison',
          url: comparisonUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share comparison');
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(comparisonUrl);
      toast.success('Comparison link copied to clipboard');
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