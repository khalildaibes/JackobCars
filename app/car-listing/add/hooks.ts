/**
 * Custom hooks for the Add Car Listing form
 * 
 * This file contains all the custom hooks that handle business logic,
 * form validation, data fetching, and other functionality.
 */

import { useState, useCallback } from 'react';
import { FormData, ValidationErrors, InputMethod, ProcessingStep, PopupModal, CarDataFetchingConfig } from './types';
import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

/**
 * Fetches additional vehicle specifications from the government API
 * @param carData - Basic car data containing manufacturer, model, year, submodel, and fuel type
 * @returns Enhanced car data with additional specifications
 */
export const fetchVehicleSpecs = async (carData: any) => {
  try {
    const vehicleSpecsUrl = `/api/gov/vehicle-specs?manufacturerName=${carData.manufacturerName}&modelName=${carData.modelName}&year=${carData.year}&submodel=${carData.subModel || ''}&fuelType=${carData.fuelType || ''}`;
    console.log('Fetching vehicle specs from:', vehicleSpecsUrl);
    
    const vehicleSpecsResponse = await fetch(vehicleSpecsUrl);
    
    if (vehicleSpecsResponse.ok) {
      const vehicleSpecsData = await vehicleSpecsResponse.json();
      
      if (vehicleSpecsData?.result?.records?.length > 0) {
        const specsRecord = vehicleSpecsData.result.records[0];
        
        // Merge the additional specs data with the existing car data
        const enhancedCarData = {
          ...carData,
          engineCapacity: specsRecord.nefah_manoa || null,
          totalWeight: specsRecord.mishkal_kolel || null,
          height: specsRecord.gova || null,
          driveType: specsRecord.hanaa_nm || null,
          transmission: specsRecord.mazgan_ind === 1 ? 'Automatic' : 'Manual',
          abs: specsRecord.abs_ind === 1 ? 'Yes' : 'No',
          airbags: specsRecord.mispar_kariot_avir || 0,
          powerWindows: specsRecord.mispar_halonot_hashmal || 0,
          fuelTankCapacity: specsRecord.kosher_grira_im_blamim || null,
          fuelTankCapacityWithoutReserve: specsRecord.kosher_grira_bli_blamim || null,
          safetyRating: specsRecord.nikud_betihut || null,
          safetyRatingWithoutSeatbelts: specsRecord.ramat_eivzur_betihuty || null,
          co2Emission: specsRecord.CO2_WLTP || null,
          noxEmission: specsRecord.NOX_WLTP || null,
          pmEmission: specsRecord.PM_WLTP || null,
          hcEmission: specsRecord.HC_WLTP || null,
          coEmission: specsRecord.CO_WLTP || null,
          greenIndex: specsRecord.madad_yarok || null,
          bodyType: specsRecord.merkav || null,
          commercialName: specsRecord.kinuy_mishari || null,
          rank: specsRecord.rank || null
        };
        
        console.log('Vehicle specs data merged successfully');
        return enhancedCarData;
      } else {
        console.log('No vehicle specs records found');
        return carData;
      }
    } else {
      console.log('Vehicle specs API request failed:', vehicleSpecsResponse.status);
      return carData;
    }
  } catch (error) {
    console.error('Error fetching vehicle specs:', error);
    return carData;
  }
};

/**
 * Fetches submodel options from the government API for manual selection
 * @param manufacturerName - Manufacturer name
 * @param modelName - Model name  
 * @param year - Year of production
 * @returns Array of submodel options with extracted data
 */
export const fetchSubmodelOptions = async (manufacturerName: string, modelName: string, year: string) => {
  try {
    const vehicleSpecsUrl = `/api/gov/vehicle-specs?manufacturerName=${encodeURIComponent(manufacturerName)}&modelName=${encodeURIComponent(modelName)}&year=${encodeURIComponent(year)}`;
    console.log('Fetching submodel options from:', vehicleSpecsUrl);
    
    const vehicleSpecsResponse = await fetch(vehicleSpecsUrl);
    
    if (vehicleSpecsResponse.ok) {
      const vehicleSpecsData = await vehicleSpecsResponse.json();
      
      if (vehicleSpecsData?.result?.records?.length > 0) {
        // Extract unique submodel options from the records
        const submodelOptions = vehicleSpecsData.result.records.map((record: any) => ({
          id: record._id,
          title: `${record.ramat_gimur} מנוע ${(parseInt(record.nefah_manoa)/1000).toFixed(1)}  ${parseInt(record.koah_sus)} כ"ס ` || 'Unknown Submodel',
          engineCapacity: record.nefah_manoa || null,
          enginePower: record.koah_sus || null,
          bodyType: record.merkav || null,
          trimLevel: record.ramat_gimur || null,
          fuelType: record.delek_nm || null,
          transmission: record.mazgan_ind === 1 ? 'Automatic' : 'Manual',
          seatingCapacity: record.mispar_moshavim || null,
          doors: record.mispar_dlatot || null,
          abs: record.abs_ind === 1 ? 'Yes' : 'No',
          airbags: record.mispar_kariot_avir || 0,
          powerWindows: record.mispar_halonot_hashmal || 0,
          driveType: record.hanaa_nm || null,
          weight: record.mishkal_kolel || null,
          height: record.gova || null,
          fuelTankCapacity: record.kosher_grira_im_blamim || null,
          co2Emission: record.CO2_WLTP || null,
          greenIndex: record.madad_yarok || null,
          commercialName: record.kinuy_mishari || null,
          rank: record.rank || null
        }));
        
        console.log('Submodel options fetched successfully:', submodelOptions.length);
        return submodelOptions;
      } else {
        console.log('No submodel options found');
        return [];
      }
    } else {
      console.log('Submodel options API request failed:', vehicleSpecsResponse.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching submodel options:', error);
    return [];
  }
};

/**
 * Hook for managing popup modal state
 * @returns Object containing popup state and control functions
 */
export const usePopupModal = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState<PopupModal>({
    type: 'success',
    title: '',
    message: ''
  });

  const showPopupModal = useCallback((type: 'success' | 'error', title: string, message: string) => {
    setPopupConfig({ type, title, message });
    setShowPopup(true);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    setPopupConfig({ type: 'success', title: '', message: '' });
  }, []);

  return {
    showPopup,
    popupConfig,
    showPopupModal,
    closePopup
  };
};

/**
 * Hook for form validation
 * @param formData - Current form data
 * @param inputMethod - Current input method (plate or manual)
 * @param setErrors - Function to set validation errors
 * @returns Object containing validation functions
 */
export const useFormValidation = (
  formData: FormData,
  inputMethod: InputMethod,
  setErrors: (errors: ValidationErrors) => void
) => {
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate required fields
    if (!formData.title) {
      newErrors.title = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    if (!formData.manufacturerName) {
      newErrors.manufacturer = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    if (!formData.commercialNickname) {
      newErrors.model = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    if (!formData.yearOfProduction) {
      newErrors.year = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    // Plate number validation: required only in automatic/plate mode
    if (inputMethod === 'plate') {
      if (!formData.plateNumber || formData.plateNumber.trim() === '') {
        newErrors.plateNumber = 'Plate number is required in automatic mode';
      }
    }

    // Phone validation: Israeli phone number format
    if (!formData.phone) {
      newErrors.phone = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION_RULES.PHONE_REGEX.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = ERROR_MESSAGES.INVALID_PHONE;
    }

    // Images validation
    if (!formData.images.length) {
      newErrors.images = ERROR_MESSAGES.MIN_IMAGES;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, inputMethod, setErrors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, [setErrors]);

  const clearFieldError = useCallback((field: string) => {
    // This function needs to be called with the current errors state
    // For now, we'll just clear the specific field
    setErrors({ [field]: '' });
  }, [setErrors]);

  return {
    validateForm,
    clearErrors,
    clearFieldError
  };
};

/**
 * Hook for image handling
 * @param formData - Current form data
 * @param setFormData - Function to update form data
 * @param setErrors - Function to set validation errors
 * @returns Object containing image handling functions
 */
export const useImageHandling = (
  formData: FormData,
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void,
  setErrors: (errors: ValidationErrors) => void
) => {
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | File[]) => {
    let files: File[] = [];
    
    if (Array.isArray(e)) {
      // Handle File[] from drag and drop
      files = e;
    } else {
      // Handle ChangeEvent from file input
      if (e.target.files) {
        files = Array.from(e.target.files);
      }
    }
    
    if (files.length > 0) {
      const newImages = [...formData.images, ...files].slice(0, VALIDATION_RULES.MAX_IMAGES);
      setFormData(prev => ({ ...prev, images: newImages }));
      setErrors({ images: '' });
    }
  }, [formData.images, setFormData, setErrors]);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, [setFormData]);

  const uploadImages = useCallback(async (files: File[]) => {
    // Implementation for image upload
    // This would typically involve FormData and API calls
    return Promise.resolve(files.map(() => Math.random().toString(36).substr(2, 9)));
  }, []);

  return {
    handleImageChange,
    removeImage,
    uploadImages
  };
};

/**
 * Hook for step navigation
 * @param currentStep - Current step index
 * @param totalSteps - Total number of steps
 * @param setCurrentStep - Function to set current step
 * @param onNextStep - Callback to execute when moving to next step
 * @param onPriceStep - Callback to execute when reaching price step
 * @returns Object containing navigation functions
 */
export const useStepNavigation = (
  currentStep: number,
  totalSteps: number,
  setCurrentStep: (step: number) => void,
  onNextStep?: () => void,
  onPriceStep?: () => void
) => {
  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      if (onNextStep) onNextStep();
      if (currentStep === 2 && onPriceStep) onPriceStep(); // Price step
      setCurrentStep(Math.min(totalSteps - 1, currentStep + 1));
    }
  }, [currentStep, totalSteps, setCurrentStep, onNextStep, onPriceStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  }, [currentStep, setCurrentStep]);

  const canProceedToNext = useCallback((): boolean => {
    // Add validation logic here if needed
    return true;
  }, []);

  return {
    goToNextStep,
    goToPreviousStep,
    canProceedToNext
  };
};

/**
 * Hook for car data fetching
 * @param config - Configuration object containing all necessary setters and data
 * @returns Object containing data fetching functions
 */
export const useCarDataFetching = (config: CarDataFetchingConfig) => {
  const {
    setLoading,
    setError,
    setCarData,
    setYad2ModelInfo,
    setYad2PriceInfo,
    setGovCarInfo,
    setFormData,
    setSelectedManufacturer,
    setSelectedModel,
    setSubModelID,
    setAvailableModels,
    setAvailableYears,
    setAvailableSubmodels,
    setSelectedSubmodel,
    manufacturersData,
    formData,
    selectedManufacturer,
    selectedModel,
    selectedYear,
    subModelID,
    t
  } = config;

  /**
   * Fetches car data using plate number
   */
  const fetchCarData = useCallback(async (plateNumber: string) => {
    if (!plateNumber) return;
    
    const cleanPlateNumber = plateNumber.replace(/-/g, '');
    setLoading(true);
    setError(null);

    try {
      // Try Yad2 API first
      const yad2Response = await fetch(`api/model-master?licensePlate=${encodeURIComponent(cleanPlateNumber)}`);
      
      if (yad2Response.ok) {
        const yad2Data = await yad2Response.json();
        if (yad2Data?.data) {
          setGovCarInfo(yad2Data.data);
          setYad2ModelInfo(yad2Data);
          
          // Auto-populate form fields
          if (yad2Data.data) {
            const carInfo = yad2Data.data;
            
            if (carInfo.carYear) {
              setFormData(prev => ({ ...prev, yearOfProduction: carInfo.carYear }));
            }
            
            if (carInfo.manufacturerId) {
              Object.keys(manufacturersData).forEach(manufacturerKey => {
                const manufacturer = manufacturersData[manufacturerKey];
                const hasManufacturer = manufacturer.submodels?.some(submodel => 
                  submodel.manufacturer?.id === carInfo.manufacturerId
                );
                
                if (hasManufacturer) {
                  setSelectedManufacturer(manufacturerKey);
                  setAvailableModels(manufacturer.submodels || []);
                  
                  if (carInfo.modelId && manufacturer.submodels) {
                    const model = manufacturer.submodels.find(m => m.id === carInfo.modelId);
                    if (model) {
                      setSelectedModel(model.id.toString());
                      setSubModelID(model.id.toString());
                      setFormData(prev => ({ 
                        ...prev, 
                        commercialNickname: model.title || '',
                        manufacturerName: model.manufacturer?.title || ''
                      }));
                      
                      fetchSubmodels(model.id.toString());
                    }
                  }
                }
              });
            }
          }
          
          // Fetch price if available
          if (yad2Data.data?.subModelId) {
            await fetchYad2Price(yad2Data.data.subModelId, yad2Data.data.carYear);
          }
        }
      } else {
        // Fallback to government API
        await fetchGovernmentCarData(cleanPlateNumber);
      }
    } catch (error) {
      console.error('Error fetching car data:', error);
      setError('Failed to fetch car data');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setGovCarInfo, setYad2ModelInfo, setFormData, setSelectedManufacturer, setAvailableModels, setSelectedModel, setSubModelID, manufacturersData]);

  /**
   * Fetches car data directly (bypassing plate input)
   */
  const fetchCarDataDirect = useCallback(async (plate: string) => {
    try {
      const upstreamUrl = `api/model-master?licensePlate=${encodeURIComponent(plate)}`;
      const response = await fetch(upstreamUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data?.data) {
          setGovCarInfo(data.data);
          return data;
        }
      }
    } catch (error) {
      console.error('Error fetching car data directly:', error);
    }
    return null;
  }, [setGovCarInfo]);

  /**
   * Fetches submodels for a given model
   */
  const fetchSubmodels = useCallback(async (modelId: string) => {
    if (!modelId) return;
    
    try {
      const response = await fetch(`/api/yad2/submodels?modelId=${modelId}`);
      
      if (response.ok) {
        const submodelsData = await response.json();
        // For now, just set all submodels without filtering by year
        // This ensures the function works even when year data is not available
        const submodels = submodelsData.data || [];
        setAvailableSubmodels(submodels);
      } else {
        setAvailableSubmodels([]);
      }
    } catch (error) {
      console.error('Error fetching submodels:', error);
      setAvailableSubmodels([]);
    }
  }, [setAvailableSubmodels]);

  /**
   * Fetches Yad2 price data
   */
  const fetchYad2Price = useCallback(async (subModelId: string, year: string) => {
    if (!subModelId || !year) return;
    
    try {
      const url = `/api/yad2/price?subModelId=${subModelId}&kilometers=0&ascentYearOnRoad=${year}&ascentMonthOnRoad=1`;
      const priceRes = await fetch(url);
      
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        setYad2PriceInfo(priceData);
      } else {
        setYad2PriceInfo(null);
      }
    } catch (err) {
      console.error('Error fetching Yad2 price:', err);
      setYad2PriceInfo(null);
    }
  }, [setYad2PriceInfo]);

  /**
   * Fetches government car data as fallback
   */
  const fetchGovernmentCarData = useCallback(async (plateNumber: string) => {
    try {
      const govApiUrl = `/api/gov/car-data?licensePlate=${encodeURIComponent(plateNumber)}`;
      const govResponse = await fetch(govApiUrl);
      
      if (govResponse.ok) {
        const govData = await govResponse.json();
        
        if (govData?.result?.records?.length > 0) {
          const record = govData.result.records[0];
          
                    const mappedData = {
            data: {
              modelId: record.degem_cd || null,
              manufacturerId: record.tozeret_cd || null,
              carTitle: `${record.tozeret_nm || ''} ${record.kinuy_mishari || ''}`,
              subModelTitle: record.ramat_gimur || record.sug_degem || '',
              subModelId: record.sug_degem || null,
              carYear: record.shnat_yitzur || null,
              owner: record.baalut || 'פרטי',
              dateOnRoad: record.moed_aliya_lakvish || null,
              pollutionGroup: record.kvutzat_zihum || null,
              tokefTestDate: record.tokef_dt || null,
              carColorGroupID: record.tzeva_cd || null,
              yad2ColorID: null,
              yad2CarTitle: record.tzeva_rechev || null,
              manufacturerName: record.tozeret_nm || '',
              modelName: record.kinuy_mishari || '',
              commercialNickname: record.kinuy_mishari || '',
              fuelType: record.sug_delek_nm || '',
              frameNumber: record.misgeret || '',
              lastTestDate: record.mivchan_acharon_dt || null,
              engineCode: record.degem_manoa || '',
              frontTires: record.zmig_kidmi || '',
              rearTires: record.zmig_ahori || '',
              seatingCapacity: record.kvutzat_zihum || null,
              mileage: record.horaat_rishum || null
            },
            message: 'OK',
            source: 'government_api'
          };

          // Fetch additional vehicle specs using the separated function
          mappedData.data = await fetchVehicleSpecs(mappedData.data);

          // Set the combined data
          setYad2ModelInfo(mappedData);
          setGovCarInfo(mappedData.data);
          
          // Auto-populate form fields
          if (mappedData.data) {
            const carInfo = mappedData.data;
            
            if (carInfo.carYear) {
              setFormData(prev => ({ ...prev, yearOfProduction: carInfo.carYear }));
            }
            
            if (carInfo.manufacturerId) {
              Object.keys(manufacturersData).forEach(manufacturerKey => {
                const manufacturer = manufacturersData[manufacturerKey];
                const hasManufacturer = manufacturer.submodels?.some(submodel => 
                  submodel.manufacturer?.id === carInfo.manufacturerId
                );
                
                if (hasManufacturer) {
                  setSelectedManufacturer(manufacturerKey);
                  setAvailableModels(manufacturer.submodels || []);
                  
                  if (carInfo.modelId && manufacturer.submodels) {
                    const model = manufacturer.submodels.find(m => m.id === carInfo.modelId);
                    if (model) {
                      setSelectedModel(model.id.toString());
                      setSubModelID(model.id.toString());
                      setFormData(prev => ({ 
                        ...prev, 
                        commercialNickname: model.title || '',
                        manufacturerName: model.manufacturer?.title || ''
                      }));
                      
                      fetchSubmodels(model.id.toString());
                    }
                  }
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching government car data:', error);
    }
  }, [setYad2ModelInfo, setGovCarInfo, setFormData, setSelectedManufacturer, setAvailableModels, setSelectedModel, setSubModelID, manufacturersData, fetchSubmodels]);

  return {
    fetchCarData,
    fetchCarDataDirect,
    fetchSubmodels,
    fetchYad2Price
  };
};
