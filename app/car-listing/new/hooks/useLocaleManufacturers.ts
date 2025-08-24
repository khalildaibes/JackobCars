import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

// Import all language versions
import { 
  manufacturers_arabic, 
  manufacturers_english, 
  manufacturers_hebrew 
} from '../../../../data/manufacturers_multilingual';

export interface LocaleManufacturersData {
  // Display data in current locale
  displayData: any;
  // Hebrew data for API calls (always Hebrew)
  hebrewData: any;
  // Current locale
  currentLocale: string;
  // Loading state
  isLoading: boolean;
  // Error state
  error: string | null;
}

export const useLocaleManufacturers = (): LocaleManufacturersData => {
  const locale = useLocale();
  const [displayData, setDisplayData] = useState<any>({});
  const [hebrewData, setHebrewData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadManufacturersData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Always load Hebrew data for API calls
        setHebrewData(manufacturers_hebrew);

        // Load display data based on locale
        let localeData;
        switch (locale) {
          case 'ar':
            localeData = manufacturers_arabic;
            break;
          case 'en':
            localeData = manufacturers_english;
            break;
          case 'he-IL':
          case 'he':
            localeData = manufacturers_hebrew;
            break;
          default:
            // Fallback to English if locale not supported
            localeData = manufacturers_english;
        }

        setDisplayData(localeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load manufacturers data');
        // Fallback to Hebrew data if locale loading fails
        setDisplayData(manufacturers_hebrew);
      } finally {
        setIsLoading(false);
      }
    };

    loadManufacturersData();
  }, [locale]);

  return {
    displayData,
    hebrewData,
    currentLocale: locale,
    isLoading,
    error
  };
};

// Helper function to get Hebrew title by ID from display data
export const getHebrewTitleById = (
  displayData: any, 
  hebrewData: any, 
  id: string | number
): string => {
  if (!id || !hebrewData[id]) return '';
  
  // Get the manufacturer title from Hebrew data
  const manufacturer = hebrewData[id];
  if (manufacturer?.submodels?.[0]?.manufacturer?.title) {
    return manufacturer.submodels[0].manufacturer.title;
  }
  
  return '';
};

// Helper function to get Hebrew submodel title by ID
export const getHebrewSubmodelTitleById = (
  displayData: any, 
  hebrewData: any, 
  manufacturerId: string | number,
  submodelId: string | number
): string => {
  if (!manufacturerId || !submodelId || !hebrewData[manufacturerId]) return '';
  
  const manufacturer = hebrewData[manufacturerId];
  const submodel = manufacturer.submodels?.find((sm: any) => sm.id === submodelId);
  
  return submodel?.title || '';
};

// Helper function to get Hebrew model title by submodel ID
export const getHebrewModelTitleBySubmodelId = (
  displayData: any, 
  hebrewData: any, 
  submodelId: string | number
): string => {
  if (!submodelId) return '';
  
  // Search through all manufacturers to find the submodel
  for (const manufacturerId in hebrewData) {
    const manufacturer = hebrewData[manufacturerId];
    const submodel = manufacturer.submodels?.find((sm: any) => sm.id === submodelId);
    
    if (submodel) {
      // Return the manufacturer title as the model
      return manufacturer.submodels[0]?.manufacturer?.title || '';
    }
  }
  
  return '';
};
