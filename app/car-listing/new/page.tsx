"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// UI Components
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Card, CardContent } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

// Icons
import {
  Loader2, Search, Car, Calendar, Gauge, Fuel, Settings, Shield, Clock,
  AlertCircle, Tag, Palette, Key, User, Truck, Cog, Zap, Timer, Disc,
  Sparkles, Activity, ShieldCheck, Upload, Plus, X, Camera
} from "lucide-react";

// Data and Types
import { 
  CarData, VehicleSpecs, OwnershipRecord, CarPerformanceData, 
  ManufacturerData, ManufacturersData, FormData as CarFormData, ValidationErrors,
  InputMethod, ProcessingStep, PopupModal, StepConfig
} from './types';
import { 
  API_ENDPOINTS, DEFAULT_VALUES, VALIDATION_RULES,
  ANIMATION_VARIANTS, STEP_CONFIGURATION 
} from './constants';
import { 
  useCarDataFetching, useFormValidation, useImageHandling,
  useStepNavigation, usePopupModal 
} from './hooks';
import { useLocaleManufacturers } from './hooks/useLocaleManufacturers';

// Step Components
import { BasicInformationStep } from './components/BasicInformationStep';
import { ConditionStep } from './components/ConditionStep';
import { TradeInStep } from './components/TradeInStep';
import { PriceStep } from './components/PriceStep';
import { ContactInfoStep } from './components/ContactInfoStep';
import { ImageUploadStep } from './components/ImageUploadStep';

// Utility Components
import { StepIndicator } from './components/StepIndicator';
import { LoadingOverlay } from './components/LoadingOverlay';
import { PopupModal as PopupModalComponent } from './components/PopupModal';

/**
 * AddCarListing - Main component for adding new car listings
 * 
 * This component provides a multi-step form for users to add car listings
 * with both automatic (plate-based) and manual input methods.
 * 
 * Features:
 * - Multi-step form with smooth transitions
 * - Automatic car data fetching via plate number
 * - Manual car specification entry
 * - Image upload handling
 * - Form validation and error handling
 * - Responsive design with mobile optimization
 * - Professional animations and user experience
 */
export default function AddCarListing() {
  const t = useTranslations('CarListing');
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  const router = useRouter();

  // Core state management
  const [currentStep, setCurrentStep] = useState(0);
  const [inputMethod, setInputMethod] = useState<InputMethod>('plate');
  const [formData, setFormData] = useState<CarFormData>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Car data and API state - using locale-based data
  const { displayData: manufacturersData, hebrewData, isLoading: manufacturersLoading, error: manufacturersError } = useLocaleManufacturers();
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSubmodel, setSelectedSubmodel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [subModelID, setSubModelID] = useState<string>('');
  const [globalSubmodelOptions, setGlobalSubmodelOptions] = useState<any[]>([]);

  // Available options state
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSubmodels, setAvailableSubmodels] = useState<any[]>([]);

  // API response state
  const [govCarInfo, setGovCarInfo] = useState<any | null>(null);
  const [carData, setCarData] = useState<CarData | null>(null);
  const [yad2ModelInfo, setYad2ModelInfo] = useState<any | null>(null);
  const [yad2PriceInfo, setYad2PriceInfo] = useState<any | null>(null);
  const [ownershipHistory, setOwnershipHistory] = useState<OwnershipRecord[]>([]);
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleSpecs | null>(null);
  const [performanceData, setPerformanceData] = useState<CarPerformanceData | null>(null);
  const [carImage, setCarImage] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProcessingStep, setCurrentProcessingStep] = useState<ProcessingStep>('');

  // Refs
  const resultsRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { showPopup, popupConfig, showPopupModal, closePopup } = usePopupModal();
  const { validateForm, clearErrors } = useFormValidation(formData, inputMethod, setErrors);
  const { handleImageChange, removeImage, uploadImages } = useImageHandling(formData, setFormData, setErrors);
  const { goToNextStep, goToPreviousStep, canProceedToNext } = useStepNavigation(
    currentStep, 
    STEP_CONFIGURATION.length, 
    setCurrentStep,
    () => autoGenerateTitleIfEmpty(),
    () => fetchYad2PriceHook(subModelID, formData.yearOfProduction)
  );

  // Car data fetching hook
  const { 
    fetchCarData, 
    fetchCarDataDirect, 
    fetchSubmodels, 
    fetchYad2Price: fetchYad2PriceHook 
  } = useCarDataFetching({
    setLoading,
    setError,
    setCarData,
    setYad2ModelInfo,
    setYad2PriceInfo,
    setGovCarInfo,
    setOwnershipHistory,
    setVehicleSpecs,
    setPerformanceData,
    setCarImage,
    manufacturersData,
    hebrewData, // Pass Hebrew data for API calls
    setFormData,
    setSelectedManufacturer,
    setSelectedModel,
    setSubModelID,
    setAvailableModels,
    setAvailableYears,
    setAvailableSubmodels,
    setSelectedSubmodel,
    formData,
    selectedManufacturer,
    selectedModel,
    selectedYear,
    subModelID,
    t
  });

  // Effect: Update available models when manufacturer changes
  useEffect(() => {
    if (selectedManufacturer && manufacturersData[selectedManufacturer]) {
      const models = manufacturersData[selectedManufacturer].submodels || [];
      setAvailableModels(models);
      setSelectedModel('');
      setAvailableYears([]);
      setAvailableSubmodels([]);
      setSelectedSubmodel('');
    } else {
      setAvailableModels([]);
      setAvailableYears([]);
      setAvailableSubmodels([]);
    }
  }, [selectedManufacturer, manufacturersData]);

  // Effect: Update available years when model changes
  useEffect(() => {
    if (selectedManufacturer && selectedModel && manufacturersData[selectedManufacturer]) {
      const manufacturer = manufacturersData[selectedManufacturer];
      const yearData = manufacturer.year;
      
      if (yearData && yearData.from && yearData.to) {
        const years = [];
        for (let year = yearData.to; year >= yearData.from; year -= yearData.step || 1) {
          years.push(year);
        }
        setAvailableYears(years);
      } else {
        const years = [];
        for (let year = 2025; year >= 1990; year--) {
          years.push(year);
        }
        setAvailableYears(years);
      }
    } else {
      setAvailableYears([]);
    }
  }, [selectedManufacturer, selectedModel, manufacturersData]);

  // Effect: Fetch Yad2 price when reaching price step
  useEffect(() => {
    if (currentStep === 3 && subModelID && formData.yearOfProduction) {
      fetchYad2PriceHook(subModelID, formData.yearOfProduction);
    }
  }, [currentStep, subModelID, formData.yearOfProduction, fetchYad2PriceHook]);

  // Effect: Auto-update form flags
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      hasImage: prev.images.length > 0,
      hasPrice: !!prev.askingPrice || !!prev.price,
      availableInTradeIn: prev.tradeIn === 'yes'
    }));
  }, [formData.images, formData.askingPrice, formData.price, formData.tradeIn]);

  // Effect: Update form data when selections change
  useEffect(() => {
    if (selectedManufacturer && selectedModel) {
      const manufacturerName = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
      
      // Find the model title from manufacturers data first, then from availableModels
      let modelName = null;
      
      // Try to find the model in manufacturers data
      if (manufacturersData[selectedManufacturer]?.submodels) {
        const model = manufacturersData[selectedManufacturer].submodels.find(
          submodel => submodel.id?.toString() === selectedModel
        );
        if (model?.title) {
          modelName = model.title;
        }
      }
      
      // If not found in manufacturers data, try availableModels
      if (!modelName && availableModels.length > 0) {
        const model = availableModels.find(model => model.id?.toString() === selectedModel);
        if (model?.title) {
          modelName = model.title;
        }
      }
      
      // Only update if we found a proper title and the current commercialNickname is not valid
      const isCurrentCommercialNicknameValid = formData.commercialNickname && 
        formData.commercialNickname !== selectedModel && 
        formData.commercialNickname.length > 2;
      
      if (modelName && !isCurrentCommercialNicknameValid) {
                            setFormData(prev => ({ 
                              ...prev, 
          makeModel: `${manufacturerName} ${modelName}`.trim(),
          manufacturerName: manufacturerName,
          commercialNickname: modelName
        }));
      } else if (!modelName && !isCurrentCommercialNicknameValid) {
        // If still no title found, use the selectedModel as fallback (but this should rarely happen)
        setFormData(prev => ({
          ...prev,
          makeModel: `${manufacturerName} ${selectedModel}`.trim(),
        manufacturerName: manufacturerName,
          commercialNickname: selectedModel
      }));
      }
    }
  }, [selectedManufacturer, selectedModel, availableModels, manufacturersData]);

  // Effect: Update year in form data
  useEffect(() => {
    if (selectedYear && availableYears.length > 0) {
      setFormData(prev => ({
        ...prev,
        year: selectedYear,
        yearOfProduction: selectedYear
      }));
    }
  }, [selectedYear, availableYears]);

  // Effect: Auto-generate title when moving to next step
  useEffect(() => {
    if (currentStep > 0 && formData.manufacturerName && formData.commercialNickname && formData.yearOfProduction && !formData.title) {
      // Ensure we have proper titles (not IDs)
      const manufacturerName = formData.manufacturerName;
      const modelName = formData.commercialNickname;
      
      // Check if the values look like proper names (not IDs)
      const isManufacturerNameValid = manufacturerName && manufacturerName.length > 2 && manufacturerName !== selectedManufacturer;
      const isModelNameValid = modelName && modelName.length > 2 && modelName !== selectedModel;
      
      if (isManufacturerNameValid && isModelNameValid) {
        const newTitle = `${manufacturerName} ${modelName} ${formData.yearOfProduction}`.trim();
        setFormData(prev => ({ ...prev, title: newTitle }));
      }
    }
  }, [currentStep, formData.manufacturerName, formData.commercialNickname, formData.yearOfProduction, formData.title, selectedManufacturer, selectedModel]);

  // Effect: Populate form data when automatic mode selections change
  useEffect(() => {
    if (inputMethod === 'plate' && selectedManufacturer && selectedModel && selectedYear) {
      // In automatic mode, populate form with the selected submodel data
      populateFormDataFromSelectedSubmodel();
    }
  }, [inputMethod, selectedManufacturer, selectedModel, selectedYear]);

  /**
   * Handles input method change between plate and manual modes
   * @param method - The new input method to switch to
   */
  const handleInputMethodChange = (method: InputMethod) => {
    setInputMethod(method);
    
    if (method === 'manual') {
      // Clear API-related data when switching to manual mode
      setCarData(null);
      setYad2ModelInfo(null);
      
      // Reset form to manual input mode while preserving user inputs
      setFormData(prev => ({
        ...prev,
        manufacturerName: '',
        commercialNickname: '',
        yearOfProduction: '',
        fuelType: '',
        title: prev.title || '',
        makeModel: prev.makeModel || '',
        year: prev.year || '',
        plateNumber: prev.plateNumber || '',
        car_data: {}
      }));
    } else if (method === 'plate') {
      // When switching to plate mode, clear manual inputs
      setFormData(prev => ({
        ...prev,
        manufacturerName: '',
        commercialNickname: '',
        yearOfProduction: '',
        fuelType: '',
        title: '',
        makeModel: '',
        year: '',
        plateNumber: '',
        car_data: {}
      }));
      
      // Populate with the currently selected submodel data from the UI
      if (selectedManufacturer && selectedModel && selectedYear) {
        populateFormDataFromSelectedSubmodel();
      } else if (carData || yad2ModelInfo) {
        // Fallback to API data if no submodel is selected
        populateFormDataWithBestSources();
      }
    }
  };

  /**
   * Populates form data with the currently selected submodel from the UI
   * This ensures the form uses the submodel data that the user can see and verify
   */
  const populateFormDataFromSelectedSubmodel = () => {
    if (!selectedManufacturer || !selectedModel || !selectedYear) return;

    // Get the manufacturer data
    const manufacturer = manufacturersData[selectedManufacturer];
    if (!manufacturer) return;

    // Find the selected submodel
    const submodel = manufacturer.submodels?.find(
      sub => sub.id?.toString() === selectedModel
    );
    
    if (submodel) {
      const manufacturerName = submodel.manufacturer?.title || selectedManufacturer;
      const modelName = submodel.title || selectedModel;
      
      // Get Hebrew versions for API calls
      const hebrewManufacturerName = hebrewData[selectedManufacturer]?.submodels?.find(
        (sub: any) => sub.id?.toString() === selectedModel
      )?.manufacturer?.title || manufacturerName;
      
      const hebrewModelName = hebrewData[selectedManufacturer]?.submodels?.find(
        (sub: any) => sub.id?.toString() === selectedModel
      )?.title || modelName;
      
      setFormData(prev => ({
        ...prev,
        manufacturerName: manufacturerName, // Localized for display
        manufacturerNameHebrew: hebrewManufacturerName, // Hebrew for API
        commercialNickname: modelName, // Localized for display
        commercialNicknameHebrew: hebrewModelName, // Hebrew for API
        yearOfProduction: selectedYear,
        year: selectedYear,
        makeModel: `${manufacturerName} ${modelName}`.trim(),
        title: `${manufacturerName} ${modelName} ${selectedYear}`.trim(),
        // Also update the plate number if it's empty
        plateNumber: prev.plateNumber || formData.plateNumber || ''
      }));
    }
  };

  /**
   * Populates form data with the best available sources
   * Priority: Manual input > Yad2 API > Government API
   */
  const populateFormDataWithBestSources = () => {
    if (!carData && !yad2ModelInfo) return;

    const cd: any = carData || {};
    const yad2: any = yad2ModelInfo?.data || {};

    const getBestDataValue = (field: string, manualValue: any, apiValue: any, yad2Value: any = null) => {
      if (inputMethod === 'manual' && manualValue) return manualValue;
      if (yad2Value && yad2Value !== '') return yad2Value;
      if (apiValue && apiValue !== '') return apiValue;
      return manualValue || '';
    };

    setFormData(prev => ({
      ...prev,
      manufacturerName: getBestDataValue('manufacturerName', prev.manufacturerName, cd.manufacturer_name, yad2.manufacturerName),
      commercialNickname: getBestDataValue('commercialNickname', prev.commercialNickname, cd.commercial_nickname, yad2.modelName),
      yearOfProduction: getBestDataValue('yearOfProduction', prev.yearOfProduction, cd.year_of_production, yad2.year),
      fuelType: getBestDataValue('fuelType', prev.fuelType, cd.fuel_type, yad2.fuelType),
      title: prev.title || `${getBestDataValue('manufacturerName', prev.manufacturerName, cd.manufacturer_name, yad2.manufacturerName) || ''} ${cd.commercial_nickname || yad2.modelName || ''} ${cd.year_of_production || yad2.year || ''}`.trim(),
      makeModel: prev.makeModel || `${getBestDataValue('manufacturerName', prev.manufacturerName, cd.manufacturer_name, yad2.manufacturerName) || ''} ${cd.commercial_nickname || yad2.modelName || ''}`.trim(),
      year: prev.year || cd.year_of_production || yad2.year || '',
      plateNumber: prev.plateNumber || cd.plate_number || '',
      car_data: { ...cd, yad2_data: yad2 }
    }));
  };

  /**
   * Auto-generates title if empty when moving to next step
   */
  const autoGenerateTitleIfEmpty = () => {
    if (!formData.title && selectedManufacturer && selectedModel && selectedYear) {
      // Use the form data values which should already contain the proper titles
      const manufacturerName = formData.manufacturerName || selectedManufacturer;
      const modelName = formData.commercialNickname || selectedModel;
      
      // Only generate title if we have proper names (not IDs)
      const isManufacturerNameValid = manufacturerName && manufacturerName.length > 2 && manufacturerName !== selectedManufacturer;
      const isModelNameValid = modelName && modelName.length > 2 && modelName !== selectedModel;
      
      if (isManufacturerNameValid && isModelNameValid) {
        const newTitle = `${manufacturerName} ${modelName} ${selectedYear}`.trim();
        setFormData(prev => ({ ...prev, title: newTitle }));
      }
    }
  };



  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setCurrentProcessingStep('validating_form');

    try {
      // Upload images first
      let imageId = null;
      if (formData.images && formData.images.length > 0) {
        setCurrentProcessingStep('uploading_image');
          const formDataToSend = new FormData();
          formDataToSend.append('image', formData.images[0]);
          
          const imagesupload_response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formDataToSend
          });
          
          if (imagesupload_response.ok) {
            const uploadResult = await imagesupload_response.json();
            imageId = uploadResult[0].id;
        }
      }

      // Prepare car details
      setCurrentProcessingStep('preparing_data');
      const cd: any = formData.car_data || {};
      const yad2Data: any = cd.yad2_data || {};
      
      const carDetails = {
        car: {
          fuel: formData.fuelType || cd.fuel_type || yad2Data.fuelType || '',
          name: formData.title,
          year: String(formData.yearOfProduction || cd.year_of_production || yad2Data.year || ''),
          miles: String(formData.mileage || ''),
          price: parseFloat(formData.askingPrice) || 0,
          owner_name: formData.name || '',
          owner_email: formData.email || '',
          owner_phone: formData.phone || '',
          plate_number: formData.plateNumber || '',
          color: formData.color || '',
          engine_type: formData.engineType || '',
          condition: formData.currentCondition || '',
          known_problems: formData.knownProblems || '',
          trade_in: formData.tradeIn || '',
          asking_price: formData.askingPrice || '',
          // Use Hebrew names for API calls
          manufacturer_name: formData.manufacturerNameHebrew || formData.manufacturerName || cd.manufacturer_name || yad2Data.manufacturerName || '',
          commercial_nickname: formData.commercialNicknameHebrew || formData.commercialNickname || cd.commercial_nickname || yad2Data.modelName || '',
          year_of_production: formData.yearOfProduction || cd.year_of_production || yad2Data.year || '',
          fuel_type: formData.fuelType || cd.fuel_type || yad2Data.fuelType || '',
          trim_level: cd.trim_level || yad2Data.trimLevel || '',
          body_type: cd.body_type || yad2Data.bodyType || '',
          transmission: formData.transmission || '',
          images: imageId ? { main: [imageId], additional: [imageId] } : {},
          pros: formData.pros || '',
          cons: formData.cons || '',
          features: [
            { address: '' },
            { makeModel: String(formData.makeModel || '') },
            { yearOfProduction: String(formData.yearOfProduction || cd.year_of_production || yad2Data.year || '') },
            { plateNumber: String(formData.plateNumber || '') },
            { mileage: String(formData.mileage || '') },
            { color: String(formData.color || '') },
            { engineType: String(formData.engineType || '') },
            { transmission: String(formData.transmission || '') },
            { currentCondition: String(formData.currentCondition || '') },
            { knownProblems: String(formData.knownProblems || '') },
            { description: String(formData.description || '') },
            { pros: String(formData.pros || '') },
            { cons: String(formData.cons || '') },
            { tradeIn: String(formData.tradeIn || '') },
            { askingPrice: String(formData.askingPrice || '') },
            { name: String(formData.name || '') },
            { email: String(formData.email || '') },
            { phone: String(formData.phone || '') },
            { fuelType: String(formData.fuelType || cd.fuel_type || yad2Data.fuelType || '') },
            ...(imageId ? [{ image: imageId }] : []),
          ],
          // Use Hebrew names for API description
          description: formData.description || `${formData.manufacturerNameHebrew || formData.manufacturerName || cd.manufacturer_name || yad2Data.manufacturerName || ''} ${formData.commercialNicknameHebrew || formData.commercialNickname || cd.commercial_nickname || yad2Data.modelName || ''} ${formData.yearOfProduction || cd.year_of_production || yad2Data.year || ''}`.trim(),
        }
      };

      // Submit to API
      setCurrentProcessingStep('submitting_listing');
      const response = await fetch('/api/addListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carDetails)
      });

      if (response.ok) {
        showPopupModal('success', t('success_title') || 'Success!', t('success_message'));
        resetForm();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showPopupModal('error', t('error_title') || 'Error!', t('error_message'));
    } finally {
      setIsSubmitting(false);
      setCurrentProcessingStep('');
    }
  };

  /**
   * Resets the form to initial state
   */
  const resetForm = () => {
    setFormData(DEFAULT_VALUES);
    setSelectedManufacturer('');
    setSelectedModel('');
    setAvailableModels([]);
    setAvailableYears([]);
        setAvailableSubmodels([]);
    setSelectedSubmodel('');
    setErrors({});
    setError(null);
    setCurrentStep(0);
  };

  // Effect: Populate form data when car data changes
  useEffect(() => {
    if (carData || yad2ModelInfo) {
      populateFormDataWithBestSources();
    }
  }, [carData, yad2ModelInfo, inputMethod]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-[5%] py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('add_car_listing')}</h1>
            <p className="text-gray-600">{t('fill_details')}</p>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Step Indicator */}
        <StepIndicator 
          currentStep={currentStep}
          steps={STEP_CONFIGURATION}
          onStepClick={setCurrentStep}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
          {currentStep === 0 && (
              <BasicInformationStep
                key="basic-info"
                inputMethod={inputMethod}
                onInputMethodChange={handleInputMethodChange}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                manufacturersData={manufacturersData}
                hebrewData={hebrewData}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedSubmodel={selectedSubmodel}
                setSelectedSubmodel={setSelectedSubmodel}
                availableModels={availableModels}
                availableYears={availableYears}
                availableSubmodels={availableSubmodels}
                setAvailableSubmodels={setAvailableSubmodels}
                globalSubmodelOptions={globalSubmodelOptions}
                setGlobalSubmodelOptions={setGlobalSubmodelOptions}
                setYad2ModelInfo={setYad2ModelInfo}
                setGovCarInfo={setGovCarInfo}
                subModelID={subModelID}
                setSubModelID={setSubModelID}
                plateNumber={formData.plateNumber}
                onPlateNumberChange={(value) => setFormData(prev => ({ ...prev, plateNumber: value }))}
                onFetchCarData={() => fetchCarData(formData.plateNumber)}
                onFetchSubmodels={fetchSubmodels}
                loading={loading}
                govCarInfo={govCarInfo}
                yad2ModelInfo={yad2ModelInfo}
                yad2PriceInfo={yad2PriceInfo}
                t={t}
              />
            )}

          {currentStep === 1 && (
              <ConditionStep
                key="condition"
                formData={formData}
                setFormData={setFormData}
                govCarInfo={govCarInfo}
                t={t}
              />
            )}

          {currentStep === 2 && (
              <TradeInStep
                key="trade-in"
                formData={formData}
                setFormData={setFormData}
                t={t}
              />
            )}

          {currentStep === 3 && (
              <PriceStep
                key="price"
                formData={formData}
                setFormData={setFormData}
                yad2PriceInfo={yad2PriceInfo}
                t={t}
              />
            )}

          {currentStep === 4 && (
              <ContactInfoStep
                key="contact-info"
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                t={t}
              />
            )}

          {currentStep === 5 && (
              <ImageUploadStep
                key="image-upload"
                formData={formData}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                errors={errors}
                t={t}
              />
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-between gap-3"
          >
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="px-6 transition-all duration-200 hover:scale-105"
            >
              {t('previous') || 'Previous'}
            </Button>

            {currentStep < STEP_CONFIGURATION.length - 1 && (
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={!canProceedToNext()}
                className="px-6 transition-all duration-200 hover:scale-105"
              >
                {t('next') || 'Next'}
              </Button>
            )}
          </motion.div>

          {/* Submit Button */}
          {currentStep === STEP_CONFIGURATION.length - 1 && (
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            className="sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg"
          >
            <Button
              type="submit"
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('submitting')}</span>
                </div>
              ) : (
                t('submit_listing')
              )}
            </Button>
          </motion.div>
          )}
        </form>

        {/* Loading Overlay */}
        <LoadingOverlay 
          isVisible={isSubmitting}
          currentStep={currentProcessingStep}
          t={t}
        />

        {/* Popup Modal */}
        <PopupModalComponent
          isVisible={showPopup}
          config={popupConfig}
          onClose={closePopup}
          t={t}
        />
      </motion.div>
    </div>
  );
} 