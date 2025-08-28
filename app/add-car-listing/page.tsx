"use client";

/**
 * Car Listing Add Page with Multilingual Support
 * 
 * This component automatically displays manufacturer, model, and submodel names
 * in the user's selected language (Arabic, English, or Hebrew) while maintaining
 * ID-based logic for form submission.
 * 
 * Localization Strategy:
 * - UI Display: Uses localized names from manufacturers_multilingual.ts
 * - Form Submission: Keeps original IDs for proper data handling
 * - Fallback: Shows original names if localized versions aren't available
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Card, CardContent } from "../../components/ui/card";
import Cookies from 'js-cookie';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Loader2,
  Search,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Shield,
  Clock,
  AlertCircle,
  Tag,
  Palette,
  Key,
  User,
  Truck,
  Cog,
  Zap,
  Timer,
  Disc,
  Sparkles,
  Activity,
  ShieldCheck,
  Building
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import {manufacturers_hebrew, manufacturers_arabic, manufacturers_english} from '../../data/manufacturers_multilingual';
const conditions = ['excellent', 'good', 'fair', 'poor'] as const;
import React from 'react';
// import CarDetailsSections from './CarDetailsSections';
import { title } from 'process';
import CarDetailsSections from './CarDetailsSections';
// import { DEFAULT_VALUES } from '../car-listing/test/add/constants';

// Government car data API endpoint
const GOV_CAR_DATA_API = "/api/gov/car-data";



const ENGINE_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' }
];

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' }
];

// Cookie management constants
const COOKIE_KEYS = {
  CURRENT_STEP: 'car_listing_current_step',
  FORM_DATA: 'car_listing_form_data',
  SELECTIONS: 'car_listing_selections',
  INPUT_METHOD: 'car_listing_input_method',
  YAD2_MODEL_INFO: 'car_listing_yad2_model_info',
  PLATE_NUMBER: 'car_listing_plate_number',
  CAR_DATA: 'car_listing_car_data',
  GOV_CAR_INFO: 'car_listing_gov_car_info'
};

// Cookie management functions
const saveToCookie = (key: string, data: any, options: any = {}) => {
  try {
    const defaultOptions = {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as 'strict'
    };
    Cookies.set(key, JSON.stringify(data), { ...defaultOptions, ...options });
    
    // Also save to localStorage as backup
    saveToStorage(key, data);
  } catch (error) {
    console.error('Error saving to cookie:', error);
    // Fallback to localStorage only
    saveToStorage(key, data);
  }
};

const loadFromCookie = (key: string) => {
  try {
    // Try cookies first
    const cookieData = Cookies.get(key);
    if (cookieData) {
      return JSON.parse(cookieData);
    }
    
    // Fallback to localStorage
    return loadFromStorage(key);
  } catch (error) {
    console.error('Error loading from cookie:', error);
    // Fallback to localStorage
    return loadFromStorage(key);
  }
};

const clearCookies = () => {
  try {
    // Clear cookies
    Object.values(COOKIE_KEYS).forEach(key => {
      Cookies.remove(key);
    });
    
    // Clear localStorage backup
    Object.values(COOKIE_KEYS).forEach(key => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('All cookies and localStorage cleared successfully');
  } catch (error) {
    console.error('Error clearing cookies and localStorage:', error);
  }
};

// Fallback to localStorage if cookies are disabled
const saveToStorage = (key: string, data: any) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Types
type InputMethod = 'plate' | 'manual';

interface CarData {
  [key: string]: string;
}

interface ManufacturerData {
  submodels: any[];
  manufacturerImage: string;
  year: {
    from: number;
    to: number;
    step: number;
  };
}

interface ManufacturersData {
  [key: string]: ManufacturerData;
}

export default function AddCarListing() {
  const t = useTranslations('CarListing');
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  const [isClient, setIsClient] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Debug log to see what locale is being detected
  if (isClient) {
    console.log('AddCarListing component rendered with locale:', locale, 'isRTL:', isRTL);
  }
  
  // Get the appropriate manufacturers data based on locale
  const getManufacturersData = () => {
    if (isClient) {
      console.log('getManufacturersData called with locale:', locale);
    }
    return manufacturers_hebrew;
    let result;
    switch (locale) {
      case 'ar':
        result = manufacturers_arabic;
        break;
      case 'en':
        result = manufacturers_english;
        break;
      case 'he-IL':
      case 'he':
        result = manufacturers_hebrew;
        break;
      default:
        result = manufacturers_english; // fallback to English
        break;
    }
    if (isClient) {
      console.log('getManufacturersData returning:', {
        locale,
        resultKeys: Object.keys(result).slice(0, 3),
        sampleManufacturer: result[Object.keys(result)[0]]
      });
    }
      result = manufacturers_hebrew;  
    return result;
  };

  const STEPS = [
    'Car Type',
    'Basic Information',
    'Condition & Trade-in & description',
    'Price',
    'Contact Info',
    'Terms & Privacy',
    'Package Selection',
  ];
  const [currentStep, setCurrentStep] = useState(0);
  
  // Function to handle step changes with scroll to top
  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    // Scroll to the top of the page

  };
  
  // Helper function for next step
  const handleNextStep = () => {
    const nextStep = Math.min(STEPS.length - 1, currentStep + 1);
    handleStepChange(nextStep);
  };
  
  // Helper function for previous step
  const handlePrevStep = () => {
    const prevStep = Math.max(0, currentStep - 1);
    handleStepChange(prevStep);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manufacturersData, setManufacturersData] = useState<ManufacturersData>({});
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubmodel, setSelectedSubmodel] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSubmodels, setAvailableSubmodels] = useState<any[]>([]);
  const [globalSubmodelOptions, setGlobalSubmodelOptions] = useState<any[]>([]);
  const [subModelID, setSubModelID] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  
  // Debug log to show the current state of manufacturers data
  useEffect(() => {
    if (isClient) {
      console.log('Current manufacturers data state:', {
        locale,
        manufacturersDataKeys: Object.keys(manufacturersData).slice(0, 5),
        selectedManufacturer,
        availableModelsCount: availableModels.length,
        sampleManufacturer: manufacturersData[Object.keys(manufacturersData)[0]]
      });
    }
  }, [locale, manufacturersData, selectedManufacturer, availableModels, isClient]);
  const [plateNumber, setPlateNumber] = useState("");
  const [govCarInfo, setGovCarInfo] = useState<any>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const [carData, setCarData] = useState<CarData | null>(null);
  const [yad2ModelInfo, setYad2ModelInfo] = useState<any | null>(null);
  const [yad2PriceInfo, setYad2PriceInfo] = useState<any | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null);
  const [showCaptchaPrompt, setShowCaptchaPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carImage, setCarImage] = useState<string | null>(null);

  const [loadingPerformance, setLoadingPerformance] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    handling: false,
    reliability: false,
    tuning: true
  });

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Video upload state
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);

  // Update manufacturers data when locale changes
  useEffect(() => {
    if (locale) {
      const newManufacturersData = getManufacturersData();
      if (isClient) {
        console.log('Locale changed, updating manufacturers data:', {
          locale,
          newManufacturersDataKeys: Object.keys(newManufacturersData).slice(0, 5), // Show first 5 keys
          sampleManufacturer: newManufacturersData[Object.keys(newManufacturersData)[0]]
        });
      }
      setManufacturersData(newManufacturersData);
      
      // Clear current selections when locale changes to force user to reselect with new localized data
      setSelectedManufacturer('');
      setSelectedModel('');
      setSelectedYear('');
      setSelectedSubmodel('');
      setAvailableModels([]);
      setAvailableYears([]);
      setAvailableSubmodels([]);
    }
  }, [locale]);

  // Restore state from cookies on component mount
  useEffect(() => {
    try {
      // Load current step
      const savedStep = loadFromCookie(COOKIE_KEYS.CURRENT_STEP);
      if (savedStep !== null && savedStep >= 0 && savedStep < STEPS.length) {
        setCurrentStep(savedStep);
      }

      // Load form data
      const savedFormData = loadFromCookie(COOKIE_KEYS.FORM_DATA);
      if (savedFormData) {
        setFormData(prev => ({ ...prev, ...savedFormData }));
      }

      // Load selections
      const savedSelections = loadFromCookie(COOKIE_KEYS.SELECTIONS);
      if (savedSelections) {
        if (savedSelections.manufacturer) setSelectedManufacturer(savedSelections.manufacturer);
        if (savedSelections.model) setSelectedModel(savedSelections.model);
        if (savedSelections.year) setSelectedYear(savedSelections.year);
        if (savedSelections.submodel) setSelectedSubmodel(savedSelections.submodel);
      }

      // Load input method
      const savedInputMethod = loadFromCookie(COOKIE_KEYS.INPUT_METHOD);
      if (savedInputMethod && (savedInputMethod === 'plate' || savedInputMethod === 'manual')) {
        setInputMethod(savedInputMethod);
      }

      // Load yad2ModelInfo
      const savedYad2ModelInfo = loadFromCookie(COOKIE_KEYS.YAD2_MODEL_INFO);
      if (savedYad2ModelInfo) {
        setYad2ModelInfo(savedYad2ModelInfo);
      }

      // Load plate number
      const savedPlateNumber = loadFromCookie(COOKIE_KEYS.PLATE_NUMBER);
      if (savedPlateNumber) {
        setPlateNumber(savedPlateNumber);
      }

      // Load car data
      const savedCarData = loadFromCookie(COOKIE_KEYS.CAR_DATA);
      if (savedCarData) {
        setCarData(savedCarData);
      }

      // Load government car info
      const savedGovCarInfo = loadFromCookie(COOKIE_KEYS.GOV_CAR_INFO);
      if (savedGovCarInfo) {
        setGovCarInfo(savedGovCarInfo);
      }

      if (isClient) {
        console.log('State restored from cookies:', {
          step: savedStep,
          hasFormData: !!savedFormData,
          hasSelections: !!savedSelections,
          inputMethod: savedInputMethod,
          hasYad2ModelInfo: !!savedYad2ModelInfo,
          hasPlateNumber: !!savedPlateNumber,
          hasCarData: !!savedCarData,
          hasGovCarInfo: !!savedGovCarInfo
        });
      }
    } catch (error) {
      console.error('Error restoring state from cookies:', error);
    }
  }, []); // Only run once on mount

  // Save input method to cookies whenever it changes
  useEffect(() => {
    saveToCookie(COOKIE_KEYS.INPUT_METHOD, inputMethod);
  }, [inputMethod]);

  // Save yad2ModelInfo to cookies whenever it changes
  useEffect(() => {
    if (yad2ModelInfo) {
      saveToCookie(COOKIE_KEYS.YAD2_MODEL_INFO, yad2ModelInfo);
    }
  }, [yad2ModelInfo]);

  // Save plate number to cookies whenever it changes
  useEffect(() => {
    if (plateNumber) {
      saveToCookie(COOKIE_KEYS.PLATE_NUMBER, plateNumber);
    }
  }, [plateNumber]);

  // Save car data to cookies whenever it changes
  useEffect(() => {
    if (carData) {
      saveToCookie(COOKIE_KEYS.CAR_DATA, carData);
    }
  }, [carData]);

  // Save government car info to cookies whenever it changes
  useEffect(() => {
    if (govCarInfo) {
      saveToCookie(COOKIE_KEYS.GOV_CAR_INFO, govCarInfo);
    }
  }, [govCarInfo]);



  // Restore plate number to formData when it's loaded from cookies
  useEffect(() => {
    if (plateNumber) {
      setFormData(prev => ({ ...prev, plateNumber }));
    }
  }, [plateNumber]);

  const iconMap = {
    transmission: Cog,
    drive_type: Cog,
    engine_type: Gauge,
    engine_size: Fuel,
    engine_power: Zap,
    acceleration: Timer,
    front_tire: Disc,
    rear_tire: Disc,
    plate_number: Car,
    year_of_production: Calendar,
    engine_model: Gauge,
    fuel_type: Fuel,
    model_type: Settings,
    safety_equipment_level: Shield,
    last_inspection_date: Clock,
    manufacturer_code: Key,
    manufacturer_name: Tag,
    color_code: Palette,
    car_color: Palette,
    ownership: User,
    chassis: Truck,
  } as const;
  const priorityFields = [
    'transmission',
    'drive_type',
    'engine_type',
    'engine_size',
    'engine_power',
    'acceleration',
    'front_tire',
    'rear_tire'
  ];
  const [formData, setFormData] = useState({
    title: '',
    makeModel: '',
    year: '',
    plateNumber: '',
    mileage: '',
    color: '',
    engineType: '',
    transmission: 'Automatic',
    currentCondition: '',
    knownProblems: '',
    pros: '',
    cons: '',
    tradeIn: '',
    description: '',
    askingPrice: '',
    name: '',
    email: '',
    phone: '',

    manufacturerName: '',
    modelId: '',
    subModelId: '',
    commercialNickname: '',
    yearOfProduction: '',
    engineCapacity: '',
    bodyType: '',
    seatingCapacity: '',
    fuelType: '',
    abs: '',
    airbags: '',
    powerWindows: '',
    driveType: '',
    totalWeight: '',
    height: '',
    fuelTankCapacity: '',
    co2Emission: '',
    greenIndex: '',
    commercialName: '',
    rank: '',
    carType: '',
    ownerType: '',
    previousOwners: [],
    priceNegotiable: false,
    region: '',
    termsAccepted: false,
    selectedPackage: 'website_release',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Save state to cookies whenever it changes
  useEffect(() => {
    saveToCookie(COOKIE_KEYS.CURRENT_STEP, currentStep);
  }, [currentStep]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToCookie(COOKIE_KEYS.FORM_DATA, formData);
    }, 500); // Debounce by 500ms to avoid excessive cookie writes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  useEffect(() => {
    const selections = {
      manufacturer: selectedManufacturer,
      model: selectedModel,
      year: selectedYear,
      submodel: selectedSubmodel
    };
    saveToCookie(COOKIE_KEYS.SELECTIONS, selections);
  }, [selectedManufacturer, selectedModel, selectedYear, selectedSubmodel]);

  useEffect(() => {
    saveToCookie(COOKIE_KEYS.INPUT_METHOD, inputMethod);
  }, [inputMethod]);

  // Cleanup object URLs when component unmounts or images/video change
  useEffect(() => {
    return () => {
      // Cleanup any created object URLs to prevent memory leaks
      // Note: Files don't have URLs by default, so we only cleanup if we've created URLs
      // This is handled in the upload logic where we create temporary URLs
    };
  }, []);

  // Scroll to top whenever step changes
  useEffect(() => {
    if (isClient) {
      // Scroll to top with smooth animation when step changes
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep, isClient]);

  // Function to clear all form data and reset to initial state
  const clearFormData = useCallback(() => {
    // Reset form data to initial values
    setFormData(prev => ({
      ...prev,
      title: '',
      makeModel: '',
      year: '',
      plateNumber: '',
      mileage: '',
      color: '',
      engineType: '',
      transmission: 'Automatic',
      currentCondition: '',
      knownProblems: '',
      pros: '',
      cons: '',
      tradeIn: '',
      description: '',
      askingPrice: '',
      name: '',
      email: '',
      phone: '',
      manufacturerName: '',
      modelId: '',
      subModelId: '',
      commercialNickname: '',
      yearOfProduction: '',
      engineCapacity: '',
      bodyType: '',
      seatingCapacity: '',
      fuelType: '',
      abs: '',
      airbags: '',
      powerWindows: '',
      driveType: '',
      totalWeight: '',
      height: '',
      fuelTankCapacity: '',
      co2Emission: '',
      greenIndex: '',
      commercialName: '',
      rank: '',
      carType: '',
      ownerType: '',
      previousOwners: [],
      priceNegotiable: false,
      region: '',
      termsAccepted: false,
      selectedPackage: 'website_release',
    }));

    // Reset all form-related state
    handleStepChange(1);
    setIsSubmitting(false);
    setSelectedManufacturer('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedSubmodel('');
    setAvailableModels([]);
    setAvailableYears([]);
    setAvailableSubmodels([]);
    setGlobalSubmodelOptions([]);
    setSubModelID('');
    setInputMethod('manual');
    setPlateNumber('');
    setGovCarInfo(null);
    setCarData(null);
    setYad2ModelInfo(null);
    setYad2PriceInfo(null);
    setCaptchaRequired(false);
    setCaptchaUrl(null);
    setShowCaptchaPrompt(false);
    setLoading(false);
    setCarImage(null);
    setLoadingPerformance(false);
    setExpandedSections({
      handling: false,
      reliability: false,
      tuning: true
    });
    setErrors({});
    setError(null);
    setIsGeneratingDescription(false);
    
    // Clear cookies when form is reset
    clearCookies();
    
    // Also clear the additional state variables
    setYad2ModelInfo(null);
    setPlateNumber('');
    setCarData(null);
    setGovCarInfo(null);
  }, []);

  // Function to manually clear saved progress
  const clearSavedProgress = useCallback(() => {
    clearCookies();
    clearFormData();
    handleStepChange(0);
  }, [clearFormData]);

  // Function to clear just the plate number and related data
  const clearPlateData = useCallback(() => {
    setPlateNumber('');
    setCarData(null);
    setYad2ModelInfo(null);
    setGovCarInfo(null);
    
    // Clear only the plate-related cookies
    Cookies.remove(COOKIE_KEYS.PLATE_NUMBER);
    Cookies.remove(COOKIE_KEYS.CAR_DATA);
    Cookies.remove(COOKIE_KEYS.YAD2_MODEL_INFO);
    Cookies.remove(COOKIE_KEYS.GOV_CAR_INFO);
    
    // Also clear from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(COOKIE_KEYS.PLATE_NUMBER);
      localStorage.removeItem(COOKIE_KEYS.CAR_DATA);
      localStorage.removeItem(COOKIE_KEYS.YAD2_MODEL_INFO);
      localStorage.removeItem(COOKIE_KEYS.GOV_CAR_INFO);
    }
    
    console.log('Plate data cleared successfully');
  }, []);

  // Function to refresh car data for current plate number
  const refreshCarData = useCallback(async () => {
    if (plateNumber) {
      console.log('Refreshing car data for plate:', plateNumber);
      await fetchCarData();
    }
  }, [plateNumber]);

  // Check if user has saved progress
  const hasSavedProgress = useCallback(() => {
    return loadFromCookie(COOKIE_KEYS.CURRENT_STEP) !== null;
  }, []);

  // Get storage status for debugging
  const getStorageStatus = useCallback(() => {
    const cookieStatus = {
      currentStep: loadFromCookie(COOKIE_KEYS.CURRENT_STEP),
      hasFormData: !!loadFromCookie(COOKIE_KEYS.FORM_DATA),
      hasSelections: !!loadFromCookie(COOKIE_KEYS.SELECTIONS),
      inputMethod: loadFromCookie(COOKIE_KEYS.INPUT_METHOD),
      hasYad2ModelInfo: !!loadFromCookie(COOKIE_KEYS.YAD2_MODEL_INFO),
      hasPlateNumber: !!loadFromCookie(COOKIE_KEYS.PLATE_NUMBER),
      hasCarData: !!loadFromCookie(COOKIE_KEYS.CAR_DATA),
      hasGovCarInfo: !!loadFromCookie(COOKIE_KEYS.GOV_CAR_INFO)
    };
    
    const localStorageStatus = {
      currentStep: loadFromStorage(COOKIE_KEYS.CURRENT_STEP),
      hasFormData: !!loadFromStorage(COOKIE_KEYS.FORM_DATA),
      hasSelections: !!loadFromStorage(COOKIE_KEYS.SELECTIONS),
      inputMethod: loadFromStorage(COOKIE_KEYS.INPUT_METHOD),
      hasYad2ModelInfo: !!loadFromStorage(COOKIE_KEYS.YAD2_MODEL_INFO),
      hasPlateNumber: !!loadFromStorage(COOKIE_KEYS.PLATE_NUMBER),
      hasCarData: !!loadFromStorage(COOKIE_KEYS.CAR_DATA),
      hasGovCarInfo: !!loadFromStorage(COOKIE_KEYS.GOV_CAR_INFO)
    };
    
    return { cookieStatus, localStorageStatus };
  }, []);

  // Check if cookies are about to expire (within 24 hours)
  const checkCookieExpiration = useCallback(() => {
    try {
      const currentStep = loadFromCookie(COOKIE_KEYS.CURRENT_STEP);
      if (currentStep !== null) {
        // Check if cookies will expire soon (this is a simplified check)
        // In a real implementation, you might want to store expiration time in the cookie
        return true; // For now, just return true if cookies exist
      }
      return false;
    } catch (error) {
      return false;
    }
  }, []);

  // Extend cookie expiration when user is active
  const extendCookieExpiration = useCallback(() => {
    if (hasSavedProgress()) {
      // Re-save current state with extended expiration
      saveToCookie(COOKIE_KEYS.CURRENT_STEP, currentStep);
      saveToCookie(COOKIE_KEYS.FORM_DATA, formData);
      saveToCookie(COOKIE_KEYS.SELECTIONS, {
        manufacturer: selectedManufacturer,
        model: selectedModel,
        year: selectedYear,
        submodel: selectedSubmodel
      });
      saveToCookie(COOKIE_KEYS.INPUT_METHOD, inputMethod);
      
      // Also extend expiration for additional fields
      if (yad2ModelInfo) {
        saveToCookie(COOKIE_KEYS.YAD2_MODEL_INFO, yad2ModelInfo);
      }
      if (plateNumber) {
        saveToCookie(COOKIE_KEYS.PLATE_NUMBER, plateNumber);
      }
      if (carData) {
        saveToCookie(COOKIE_KEYS.CAR_DATA, carData);
      }
      if (govCarInfo) {
        saveToCookie(COOKIE_KEYS.GOV_CAR_INFO, govCarInfo);
      }
    }
  }, [currentStep, formData, selectedManufacturer, selectedModel, selectedYear, selectedSubmodel, inputMethod, hasSavedProgress, yad2ModelInfo, plateNumber, carData, govCarInfo]);

  // Extend cookie expiration when user is active (every 5 minutes)
  useEffect(() => {
    if (hasSavedProgress()) {
      const interval = setInterval(() => {
        extendCookieExpiration();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [hasSavedProgress, extendCookieExpiration]);

  // Hooks functions from the hooks file
  const fetchVehicleSpecs = useCallback(async (carData: any) => {
    try {
      const vehicleSpecsUrl = `/api/gov/vehicle-specs?manufacturerName=${carData.manufacturer_id}&modelName=${carData.model_id}&year=${carData.year}&submodel=${carData.submodel_id || ''}&fuelType=${carData.fuel_type || ''}`;
      
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
          
          return enhancedCarData;
        } else {
          return carData;
        }
      } else {
        return carData;
      }
    } catch (error) {
      console.error('Error fetching vehicle specs:', error);
      return carData;
    }
  }, []);

  const fetchSubmodelOptions = useCallback(async (manufacturerName: string, modelName: string, year: string) => {
    try {
      const vehicleSpecsUrl = `/api/gov/vehicle-specs?manufacturerName=${encodeURIComponent(manufacturerName)}&modelName=${encodeURIComponent(modelName)}&year=${encodeURIComponent(year)}`;
      
      const vehicleSpecsResponse = await fetch(vehicleSpecsUrl);
      
      if (vehicleSpecsResponse.ok) {
        const vehicleSpecsData = await vehicleSpecsResponse.json();
        
        if (vehicleSpecsData?.result?.records?.length > 0) {
          // Extract unique submodel options from the records
          const submodelOptions = vehicleSpecsData.result.records.map((record: any) => ({
            id: record._id,
            title: `${record.ramat_gimur} ${t('engine')} ${(parseInt(record.nefah_manoa)/1000).toFixed(1)}  ${parseInt(record.koah_sus)} ${t('horsepower')} ` || 'Unknown Submodel',
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
          
          return submodelOptions;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching submodel options:', error);
      return [];
    }
  }, []);

  const onFetchSubmodels = useCallback(async (modelId: string) => {
    if (!modelId) return;
    
    try {
      const response = await fetch(`/api/yad2/submodels?modelId=${modelId}`);
      
      if (response.ok) {
        const submodelsData = await response.json();
        const submodels = submodelsData.data || [];
        setAvailableSubmodels(submodels);
      } else {
        setAvailableSubmodels([]);
      }
    } catch (error) {
      console.error('Error fetching submodels:', error);
      setAvailableSubmodels([]);
    }
  }, []);

  // Update available models when manufacturer changes
  useEffect(() => {
    if (selectedManufacturer && manufacturersData[selectedManufacturer]) {
      const models = manufacturersData[selectedManufacturer].submodels || [];
      setAvailableModels(models);
      setSelectedModel(''); // Reset model selection
      setAvailableYears([]); // Clear years until model is selected
      setSelectedSubmodel('');
      setAvailableSubmodels([]);
      
      // Debug log to see what models are being loaded
      if (isClient) {
        console.log('Models loaded for manufacturer:', {
          locale,
          selectedManufacturer,
          manufacturerData: manufacturersData[selectedManufacturer],
          models: models.map(m => ({ id: m.id, title: m.title, manufacturer: m.manufacturer?.title }))
        });
      }
    } else {
      setAvailableModels([]);
      setAvailableYears([]);
      setSelectedSubmodel('');
      setAvailableSubmodels([]);
    }
  }, [selectedManufacturer, manufacturersData, locale]);

  // Update formData.makeModel when both manufacturer and model are selected
  useEffect(() => {
    if (selectedManufacturer && selectedModel) {
      // Use localized names for display while keeping IDs for form submission
      const manufacturerName = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
      const modelName = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
      
      setFormData(prev => ({
        ...prev,
        makeModel: `${manufacturerName} ${modelName}`.trim()
      }));
    }
  }, [selectedManufacturer, selectedModel, availableModels, manufacturersData]);

  // Update available years when model changes
  useEffect(() => {
    if (selectedManufacturer && selectedModel && manufacturersData[selectedManufacturer]) {
      const manufacturer = manufacturersData[selectedManufacturer];
      
      // Generate year options based on manufacturer data
      const yearData = manufacturer.year;
      if (yearData && yearData.from && yearData.to) {
        const years = [];
        for (let year = yearData.to; year >= yearData.from; year -= yearData.step || 1) {
          years.push(year);
        }
        setAvailableYears(years);
      } else {
        // Fallback to default years
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

  const formatPlateNumber = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
    
    // Format based on length
    if (cleanValue.length <= 2) {
      return cleanValue;
    } else if (cleanValue.length <= 5) {
      return `${cleanValue.slice(0, 2)}-${cleanValue.slice(2)}`;
    } else if (cleanValue.length <= 7) {
      return `${cleanValue.slice(0, 2)}-${cleanValue.slice(2, 5)}-${cleanValue.slice(5)}`;
    } else if (cleanValue.length <= 8) {
      return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 5)}-${cleanValue.slice(5)}`;
    }
    return cleanValue;
  };
  const [error, setError] = useState<string | null>(null);

  const fetchCarImage = async (manufacturer: string, model: string) => {
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${manufacturer}+${model}+car&client_id=YOUR_UNSPLASH_API_KEY`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setCarImage(data.results[0].urls.regular);
      }
    } catch (error) {
      console.error("Error fetching car image:", error);
    }
  };


  const translationMap: Record<string, string> = {
    _id: "id",
    mispar_rechev: "plate_number",
    tozeret_cd: "manufacturer_code",
    sug_degem: "model_type",
    tozeret_nm: "manufacturer_name",
    degem_cd: "model_code",
    degem_nm: "model_name",
    ramat_gimur: "trim_level",
    ramat_eivzur_betihuty: "safety_equipment_level",
    kvutzat_zihum: "pollution_group",
    shnat_yitzur: "year_of_production",
    degem_manoa: "engine_model",
    mivchan_acharon_dt: "last_inspection_date",
    tokef_dt: "validity_date",
    baalut: "ownership",
    misgeret: "chassis",
    tzeva_cd: "color_code",
    tzeva_rechev: "car_color",
    zmig_kidmi: "front_tire",
    zmig_ahori: "rear_tire",
    sug_delek_nm: "fuel_type",
    horaat_rishum: "registration_order",
    moed_aliya_lakvish: "road_entry_date",
    kinuy_mishari: "commercial_nickname",
    rank: "rank",
  };



  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  /**
   * Generates AI description for the car
   */
  const generateAIDescription = async () => {
    if (!yad2ModelInfo?.data) {
      alert(t('fill_description_first'));
      return;
    }

    setIsGeneratingDescription(true);

    try {
      const response = await fetch('/api/createDescription', {
        method: 'POST',
        body: JSON.stringify({
          info: yad2ModelInfo,
          form: formData
        })
      });
      
      if (response.ok) {
      const data = await response.json();
        console.log('data', data)
        setFormData(prev => ({ ...prev, description: data.description }));
      } else {
        alert(t('failed_to_generate_description'));
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert(t('error_generating_description'));
    } finally {
      setIsGeneratingDescription(false);
    }
  };



  const fetchCarData = async () => {
    if (!plateNumber) return;
    
    // Remove dashes before making the API call
    const cleanPlateNumber = plateNumber.replace(/-/g, '');
    setLoading(true);
    setError(null);
    setCarImage(null);
    setYad2ModelInfo(null);
    setYad2PriceInfo(null);
    setCaptchaRequired(false);
    setCaptchaUrl(null);
    setShowCaptchaPrompt(false);

    
    try {
      // Use only the government car data API
      const response = await fetch(`/api/gov/car-data?licensePlate=${cleanPlateNumber}`);

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Government API request failed:', response.status, errorData);
        setError(t("error_fetching") || 'Failed to fetch car data');
            setLoading(false);
            return;
      }
      
      const data = await response.json();
      
      if (data?.result?.records?.length > 0) {
        const record = data.result.records[0] as Record<string, unknown>;

        // Translate the data using the existing translation map
        const translatedData = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            translationMap[key as keyof typeof translationMap] || key,
            String(value),
          ])
        );

        setCarData(translatedData);
        
        
        // Set the government car info for display
        setGovCarInfo(translatedData);
        

        // Create a mock yad2ModelInfo structure for compatibility with existing UI
        const mockYad2Info = {
          data: {
            manufacturerName: translatedData.manufacturer_name || record.tozeret_nm,
            modelName: translatedData.model_name || record.degem_nm,
            carYear: translatedData.year_of_production || record.shnat_yitzur,
            subModelTitle: translatedData.trim_level || record.ramat_gimur,
            fuelType: translatedData.fuel_type || record.sug_delek_nm,
            owner: translatedData.ownership || record.baalut,
            carTitle: translatedData.commercial_nickname || record.kinuy_mishari,
            modelId: record.degem_cd,
            manufacturerId: record.tozeret_cd,
            subModelId: record._id,
            commercialNickname: translatedData.commercial_nickname || record.kinuy_mishari,
            // Additional fields that might be available
            engineCapacity: record.nefah_manoa,
            totalWeight: record.mishkal_kolel,
            height: record.gova,
            driveType: record.hanaa_nm,
            transmission: record.mazgan_ind === 1 ? 'Automatic' : 'Manual',
            bodyType: record.merkav,
            engineCode: record.degem_manoa,
            seatingCapacity: record.mispar_moshavim,
            pollutionGroup: record.kvutzat_zihum,
            abs: record.abs_ind === 1 ? 'Yes' : 'No',
            airbags: record.mispar_kariot_avir,
            powerWindows: record.mispar_halonot_hashmal,
            safetyRating: record.nikud_betihut,
            safetyRatingWithoutSeatbelts: record.ramat_eivzur_betihuty,
            co2Emission: record.CO2_WLTP,
            noxEmission: record.NOX_WLTP,
            pmEmission: record.PM_WLTP,
            hcEmission: record.HC_WLTP,
            coEmission: record.CO_WLTP,
            greenIndex: record.madad_yarok,
            fuelTankCapacity: record.kosher_grira_im_blamim,
            fuelTankCapacityWithoutReserve: record.kosher_grira_bli_blamim,
            dateOnRoad: record.moed_aliya_lakvish,
            frameNumber: record.misgeret,
            lastTestDate: record.mivchan_acharon_dt,
            tokefTestDate: record.tokef_dt,
            mileage: record.km,
            rank: record.rank,
            commercialName: record.kinuy_mishari,
            frontTires: record.zmig_kidmi,
            rearTires: record.zmig_ahori,
            carColorGroupID: record.tzeva_cd,
            yad2ColorID: record.tzeva_cd,
            yad2CarTitle: record.tzeva_rechev
          }
        };


        setYad2ModelInfo(mockYad2Info);
        
        // Fetch additional vehicle specs from the government API
        try {
          const response1 = await fetch(`/api/gov/vehicle-specs?submodel=${record.ramat_gimur}&manufacturerName=${record.tozeret_nm}&modelName=${record.degem_nm}&year=${record.shnat_yitzur}`);
          
          if (response1.ok) {
            const data1 = await response1.json();
            
            if (data1?.result?.records?.length > 0) {
              const specsRecord = data1.result.records[0];
              
              // Merge the vehicle specs with the mock data
              const enhancedData = {
                ...mockYad2Info.data,
                // Map government API fields to the expected structure
                engineCapacity: specsRecord.nefah_manoa || null,
                totalWeight: specsRecord.mishkal_kolel || null,
                height: specsRecord.gova || null,
                driveType: specsRecord.hanaa_nm || null,
                transmission: specsRecord.mazgan_ind === 1 ? 'Automatic' : 'Manual',
                bodyType: specsRecord.merkav || null,
                engineCode: specsRecord.degem_manoa || null,
                seatingCapacity: specsRecord.mispar_moshavim || null,
                pollutionGroup: specsRecord.kvutzat_zihum || null,
                abs: specsRecord.abs_ind === 1 ? 'Yes' : 'No',
                airbags: specsRecord.mispar_kariot_avir || null,
                powerWindows: specsRecord.mispar_halonot_hashmal || null,
                safetyRating: specsRecord.nikud_betihut || null,
                safetyRatingWithoutSeatbelts: specsRecord.ramat_eivzur_betihuty || null,
                co2Emission: specsRecord.CO2_WLTP || specsRecord.kamut_CO2 || null,
                noxEmission: specsRecord.NOX_WLTP || specsRecord.kamut_NOX || null,
                pmEmission: specsRecord.PM_WLTP || specsRecord.kamut_PM10 || null,
                hcEmission: specsRecord.HC_WLTP || specsRecord.kamut_HC || null,
                coEmission: specsRecord.CO_WLTP || specsRecord.kamut_CO || null,
                greenIndex: specsRecord.madad_yarok || null,
                fuelTankCapacity: specsRecord.kosher_grira_im_blamim || null,
                fuelTankCapacityWithoutReserve: specsRecord.kosher_grira_bli_blamim || null,
                // Additional fields from the specs
                enginePower: specsRecord.koah_sus || null,
                doors: specsRecord.mispar_dlatot || null,
                fuelType: specsRecord.delek_nm || null,
                trimLevel: specsRecord.ramat_gimur || null,
                commercialName: specsRecord.kinuy_mishari || null,
                rank: specsRecord.rank || null,
                // Environmental data
                CO2_WLTP: specsRecord.CO2_WLTP || null,
                CO2_WLTP_NEDC: specsRecord.CO2_WLTP_NEDC || null,
                CO_WLTP: specsRecord.CO_WLTP || null,
                HC_WLTP: specsRecord.HC_WLTP || null,
                NOX_WLTP: specsRecord.NOX_WLTP || null,
                PM_WLTP: specsRecord.PM_WLTP || null,
                // Additional specs
                abs_ind: specsRecord.abs_ind || null,
                alco_lock: specsRecord.alco_lock || null,
                argaz_ind: specsRecord.argaz_ind || null,
                automatic_ind: specsRecord.automatic_ind || null,
                bakarat_mehirut_isa: specsRecord.bakarat_mehirut_isa || null,
                bakarat_shyut_adaptivit_ind: specsRecord.bakarat_shyut_adaptivit_ind || null,
                bakarat_stiya_activ_s: specsRecord.bakarat_stiya_activ_s || null,
                bakarat_stiya_menativ_ind: specsRecord.bakarat_stiya_menativ_ind || null,
                bakarat_stiya_menativ_makor_hatkana: specsRecord.bakarat_stiya_menativ_makor_hatkana || null,
                bakarat_yatzivut_ind: specsRecord.bakarat_yatzivut_ind || null,
                blima_otomatit_nesia_leahor: specsRecord.blima_otomatit_nesia_leahor || null,
                blimat_hirum_lifnei_holhei_regel_ofanaim: specsRecord.blimat_hirum_lifnei_holhei_regel_ofanaim || null,
                galgaley_sagsoget_kala_ind: specsRecord.galgaley_sagsoget_kala_ind || null,
                halon_bagg_ind: specsRecord.halon_bagg_ind || null,
                halonot_hashmal_source: specsRecord.halonot_hashmal_source || null,
                hanaa_cd: specsRecord.hanaa_cd || null,
                hayshaney_hagorot_ind: specsRecord.hayshaney_hagorot_ind || null,
                hayshaney_lahatz_avir_batzmigim_ind: specsRecord.hayshaney_lahatz_avir_batzmigim_ind || null,
                hege_koah_ind: specsRecord.hege_koah_ind || null,
                hitnagshut_cad_shetah_met: specsRecord.hitnagshut_cad_shetah_met || null,
                kamut_CO: specsRecord.kamut_CO || null,
                kamut_CO2: specsRecord.kamut_CO2 || null,
                kamut_CO2_city: specsRecord.kamut_CO2_city || null,
                kamut_CO2_hway: specsRecord.kamut_CO2_hway || null,
                kamut_CO_city: specsRecord.kamut_CO_city || null,
                kamut_CO_hway: specsRecord.kamut_CO_hway || null,
                kamut_HC: specsRecord.kamut_HC || null,
                kamut_HC_NOX: specsRecord.kamut_HC_NOX || null,
                kamut_HC_city: specsRecord.kamut_HC_city || null,
                kamut_HC_hway: specsRecord.kamut_HC_hway || null,
                kamut_NOX: specsRecord.kamut_NOX || null,
                kamut_NOX_city: specsRecord.kamut_NOX_city || null,
                kamut_NOX_hway: specsRecord.kamut_NOX_hway || null,
                kamut_PM10: specsRecord.kamut_PM10 || null,
                kamut_PM10_city: specsRecord.kamut_PM10_city || null,
                kamut_PM10_hway: specsRecord.kamut_PM10_hway || null,
                kariot_avir_source: specsRecord.kariot_avir_source || null,
                koah_sus: specsRecord.koah_sus || null,
                kosher_grira_bli_blamim: specsRecord.kosher_grira_bli_blamim || null,
                kosher_grira_im_blamim: specsRecord.kosher_grira_im_blamim || null,
                kvutzat_zihum: specsRecord.kvutzat_zihum || null,
                kvuzat_agra_cd: specsRecord.kvuzat_agra_cd || null,
                maarechet_ezer_labalam_ind: specsRecord.maarechet_ezer_labalam_ind || null,
                madad_yarok: specsRecord.madad_yarok || null,
                matzlemat_reverse_ind: specsRecord.matzlemat_reverse_ind || null,
                mazgan_ind: specsRecord.mazgan_ind || null,
                merkav: specsRecord.merkav || null,
                mishkal_kolel: specsRecord.mishkal_kolel || null,
                mispar_dlatot: specsRecord.mispar_dlatot || null,
                mispar_halonot_hashmal: specsRecord.mispar_halonot_hashmal || null,
                mispar_kariot_avir: specsRecord.mispar_kariot_avir || null,
                mispar_moshavim: specsRecord.mispar_moshavim || null,
                nefah_manoa: specsRecord.nefah_manoa || null,
                nikud_betihut: specsRecord.nikud_betihut || null,
                nitur_merhak_milfanim_ind: specsRecord.nitur_merhak_milfanim_ind || null,
                nitur_merhak_milfanim_makor_hatkana: specsRecord.nitur_merhak_milfanim_makor_hatkana || null,
                ramat_eivzur_betihuty: specsRecord.ramat_eivzur_betihuty || null,
                ramat_gimur: specsRecord.ramat_gimur || null,
                shlita_automatit_beorot_gvohim_ind: specsRecord.shlita_automatit_beorot_gvohim_ind || null,
                shlita_automatit_beorot_gvohim_makor_hatkana: specsRecord.shlita_automatit_beorot_gvohim_makor_hatkana || null,
                shnat_yitzur: specsRecord.shnat_yitzur || null,
                sug_degem: specsRecord.sug_degem || null,
                sug_mamir_cd: specsRecord.sug_mamir_cd || null,
                sug_mamir_nm: specsRecord.sug_mamir_nm || null,
                sug_tkina_cd: specsRecord.sug_tkina_cd || null,
                sug_tkina_nm: specsRecord.sug_tkina_nm || null,
                technologiat_hanaa_cd: specsRecord.technologiat_hanaa_cd || null,
                technologiat_hanaa_nm: specsRecord.technologiat_hanaa_nm || null,
                teura_automatit_benesiya_kadima_ind: specsRecord.teura_automatit_benesiya_kadima_ind || null,
                tozar: specsRecord.tozar || null,
                tozeret_cd: specsRecord.tozeret_cd || null,
                tozeret_eretz_nm: specsRecord.tozeret_eretz_nm || null,
                tozeret_nm: specsRecord.tozeret_nm || null,
                zihuy_beshetah_nistar_ind: specsRecord.zihuy_beshetah_nistar_ind || null,
                zihuy_holchey_regel_ind: specsRecord.zihuy_holchey_regel_ind || null,
                zihuy_holchey_regel_makor_hatkana: specsRecord.zihuy_holchey_regel_makor_hatkana || null,
                zihuy_tatzav_hitkarvut_mesukenet_ind: specsRecord.zihuy_tatzav_hitkarvut_mesukenet_ind || null,
                zihuy_rechev_do_galgali: specsRecord.zihuy_rechev_do_galgali || null,
                zihuy_tamrurey_tnua_ind: specsRecord.zihuy_tamrurey_tnua_ind || null,
                zihuy_tamrurey_tnua_makor_hatkana: specsRecord.zihuy_tamrurey_tnua_makor_hatkana || null
              };
              
              setYad2ModelInfo({ data: enhancedData });
            } else {
              // If no vehicle specs found, use the mock data as is
              setYad2ModelInfo(mockYad2Info);
            }
          } else {
            // Use the mock data if the vehicle specs API fails
            setYad2ModelInfo(mockYad2Info);
          }
        } catch (error) {
          console.error('Error fetching vehicle specs:', error);
          // Use the mock data if there's an error
          setYad2ModelInfo(mockYad2Info);
        }
        
        // Fetch car image if manufacturer and model are available
        if (record.tozeret_nm && record.kinuy_mishari) {
          await fetchCarImage(String(record.tozeret_nm), String(record.kinuy_mishari));
        }
        // Scroll to results after data is loaded
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
      } else {
        setCarData(null);
        setError(t("no_car_found") || 'No car found with this license plate');
      }
      
    } catch (error) {
      console.error("Error fetching government car data:", error);
      setError(t("error_fetching") || 'Error fetching car data');
    }

    setLoading(false);
  };

  const renderRating = (rating: string) => {
    const numRating = parseInt(rating);
    return t(`rating_${numRating}`);
  };

  const isLicenseExpired = (validityDate: string) => {
    if (!validityDate) return false;
    const today = new Date();
    const validity = new Date(validityDate);
    return validity < today;
  };
  // Update formData.makeModel when both manufacturer and model are selected
  useEffect(() => {
    if (selectedManufacturer && selectedModel) {
      // Use localized names for display while keeping IDs for form submission
      const manufacturerName = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
      const modelName = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
      
      setFormData(prev => ({
        ...prev,
        makeModel: `${manufacturerName} ${modelName}`.trim()
      }));
    }
  }, [selectedManufacturer, selectedModel, availableModels, manufacturersData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = t('validation_required');
    if (!selectedManufacturer) newErrors.manufacturer = t('validation_required');
    if (!selectedModel) newErrors.model = t('validation_required');
    if (!formData.year) newErrors.year = t('validation_required');
    if (!formData.plateNumber) newErrors.plateNumber = t('validation_required');
    if (!formData.mileage) newErrors.mileage = t('validation_required');
    if (!formData.carType) newErrors.carType = t('validation_required');
    if (!formData.ownerType) newErrors.ownerType = t('validation_required');
    if (!formData.askingPrice) newErrors.askingPrice = t('validation_required');
    if (!formData.region) newErrors.region = t('validation_required');
    if (!formData.termsAccepted) newErrors.termsAccepted = t('validation_required');
    if (!formData.selectedPackage) newErrors.selectedPackage = t('validation_required');
    if (!formData.phone) newErrors.phone = t('validation_required');


    // Email validation - only if email is provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation_email');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPlateNumber(e.target.value);
    setPlateNumber(formattedValue);
    setError(null);
  };


  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

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
      // Use localized names for display while keeping IDs for form submission
      const manufacturerName = submodel.manufacturer?.title || selectedManufacturer;
      const modelName = submodel.title || selectedModel;
      
      setFormData(prev => ({
        ...prev,
        manufacturerName: selectedManufacturer, // Keep the ID for form submission
        commercialNickname: selectedModel, // Keep the ID for form submission
        yearOfProduction: selectedYear,
        year: selectedYear,
        makeModel: `${manufacturerName} ${modelName}`.trim(), // Use localized names for display
        title: `${manufacturerName} ${modelName} ${selectedYear}`.trim(), // Use localized names for display
        // Also update the plate number if it's empty
        plateNumber: prev.plateNumber || formData.plateNumber || ''
      }));
    }
  };

  // Image upload functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    
    if (validFiles.length !== files.length) {
      alert(t('some_files_invalid') || 'Some files are not valid images or are too large (max 5MB)');
    }
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to free memory
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return newUrls;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];
    
    setIsUploading(true);
    const uploadedIds: string[] = [];
    
    try {
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append('files', image);
        
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result[0] && result[0]) {
            uploadedIds.push(result[0]);
          }
        } else {
          console.error('Failed to upload image:', image.name);
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
    
    return uploadedIds;
  };

  const clearSelectedVideos = () => {
    setSelectedVideos([]);
    setVideoPreviewUrls([]);
  };

   // Image upload functions
   const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('video/') && file.size <= 50 * 1024 * 1024 // 5MB limit
    );
    
    if (validFiles.length !== files.length) {
      alert(t('some_files_invalid') || 'Some files are not valid images or are too large (max 5MB)');
    }
    
    setSelectedVideos(prev => [...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setVideoPreviewUrls(prev => [...newPreviewUrls]);
  };

  const handleVideoRemove = (index: number) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index));
    setVideoPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to free memory
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return newUrls;
    });
  };

  const uploadVideos = async (): Promise<string[]> => {
    if (selectedVideos.length === 0) return [];
    
    setIsUploadingVideos(true);
    const uploadedIds: string[] = [];
    
    try {
      for (const video of selectedVideos) {
        const formData = new FormData();
        formData.append('files', video);
        
        const response = await fetch('/api/upload/video', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result[0] && result[0]) {
            uploadedIds.push(result[0]);
          }
        } else {
          console.error('Failed to upload video:', video.name);
        }
      }
    } catch (error) {
      console.error('Error uploading videos:', error);
    } finally {
      setIsUploadingVideos(false);
    }
    
    return uploadedIds;
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
      // Get localized names for display
      const manufacturerName = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
      const modelName = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
      
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
   * Merges yad2ModelInfo and formData, ensuring no duplicate data
   * Prioritizes formData over yad2ModelInfo for user input
   */
  const mergeCarData = (yad2Data: any, formData: any) => {
    const mergedData = {
      // Basic car information - prioritize form data
      title: formData.title || '',
      makeModel: formData.makeModel || '',
      year: formData.year || yad2Data?.year || yad2Data?.shnat_yitzur || '',
      plateNumber: formData.plateNumber || '',
      mileage: formData.mileage || '',
      color: formData.color || '',
      engineType: formData.engineType || yad2Data?.fuelType || '',
      transmission: formData.transmission || yad2Data?.transmission || 'Automatic',
      
      // Condition and trade-in
      currentCondition: formData.currentCondition || '',
      knownProblems: formData.knownProblems || '',
      pros: formData.pros || '',
      cons: formData.cons || '',
      tradeIn: formData.tradeIn || '',
      description: formData.description || '',
      
      // Pricing and region
      askingPrice: formData.askingPrice || '',
      priceNegotiable: formData.priceNegotiable || false,
      region: formData.region || '',
      
      // Owner information
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      
      // Car type and ownership
      carType: formData.carType || '',
      ownerType: formData.ownerType || '',
      previousOwners: formData.previousOwners || [],
      
      // Package and terms
      selectedPackage: formData.selectedPackage || 'website_release',
      termsAccepted: formData.termsAccepted || false,
      
      // Images
      images: [],
      videos: [],
      // Manufacturer and model details
      manufacturerName: formData.manufacturerName || yad2Data?.manufacturerName || '',
      modelId: formData.modelId || yad2Data?.modelId || '',
      subModelId: formData.subModelId || yad2Data?.subModelId || '',
      commercialNickname: formData.commercialNickname || yad2Data?.modelName || '',
      yearOfProduction: formData.yearOfProduction || yad2Data?.year || yad2Data?.shnat_yitzur || '',
      
      // Technical specifications from yad2Data (if not in formData)
      engineCapacity: formData.engineCapacity || yad2Data?.engineCapacity || yad2Data?.nefah_manoa || '',
      bodyType: formData.bodyType || yad2Data?.bodyType || yad2Data?.merkav || '',
      seatingCapacity: formData.seatingCapacity || yad2Data?.seatingCapacity || yad2Data?.mispar_moshavim || '',
      fuelType: formData.fuelType || yad2Data?.fuelType || yad2Data?.delek_nm || '',
      abs: formData.abs || yad2Data?.abs || '',
      airbags: formData.airbags || yad2Data?.airbags || yad2Data?.mispar_kariot_avir || '',
      powerWindows: formData.powerWindows || yad2Data?.powerWindows || yad2Data?.mispar_halonot_hashmal || '',
      driveType: formData.driveType || yad2Data?.driveType || yad2Data?.hanaa_nm || '',
      totalWeight: formData.totalWeight || yad2Data?.totalWeight || yad2Data?.mishkal_kolel || '',
      height: formData.height || yad2Data?.height || yad2Data?.gova || '',
      fuelTankCapacity: formData.fuelTankCapacity || yad2Data?.fuelTankCapacity || yad2Data?.kosher_grira_im_blamim || '',
      co2Emission: formData.co2Emission || yad2Data?.co2Emission || yad2Data?.CO2_WLTP || yad2Data?.kamut_CO2 || '',
      greenIndex: formData.greenIndex || yad2Data?.greenIndex || yad2Data?.madad_yarok || '',
      commercialName: formData.commercialName || yad2Data?.commercialName || yad2Data?.kinuy_mishari || '',
      rank: formData.rank || yad2Data?.rank || '',
      
      // Additional yad2Data fields that might be useful
      engineCode: yad2Data?.engineCode || yad2Data?.degem_manoa || '',
      frameNumber: yad2Data?.frameNumber || yad2Data?.misgeret || '',
      lastTestDate: yad2Data?.lastTestDate || yad2Data?.mivchan_acharon_dt || '',
      tokefTestDate: yad2Data?.tokefTestDate || yad2Data?.tokef_dt || '',
      frontTires: yad2Data?.frontTires || yad2Data?.zmig_kidmi || '',
      rearTires: yad2Data?.rearTires || yad2Data?.zmig_ahori || '',
      pollutionGroup: yad2Data?.pollutionGroup || yad2Data?.kvutzat_zihum || '',
      dateOnRoad: yad2Data?.dateOnRoad || yad2Data?.moed_aliya_lakvish || '',
      owner: yad2Data?.owner || yad2Data?.baalut || '',
      carTitle: yad2Data?.carTitle || yad2Data?.kinuy_mishari || '',
      carColorGroupID: yad2Data?.carColorGroupID || yad2Data?.tzeva_cd || '',
      yad2ColorID: yad2Data?.yad2ColorID || yad2Data?.tzeva_cd || '',
      yad2CarTitle: yad2Data?.yad2CarTitle || yad2Data?.tzeva_rechev || '',
      
      // Engine power and performance
      enginePower: yad2Data?.enginePower || yad2Data?.koah_sus || '',
      doors: yad2Data?.doors || yad2Data?.mispar_dlatot || '',
      trimLevel: yad2Data?.trimLevel || yad2Data?.ramat_gimur || '',
      
      // Environmental data
      noxEmission: yad2Data?.noxEmission || yad2Data?.NOX_WLTP || yad2Data?.kamut_NOX || '',
      pmEmission: yad2Data?.pmEmission || yad2Data?.PM_WLTP || yad2Data?.kamut_PM10 || '',
      hcEmission: yad2Data?.hcEmission || yad2Data?.HC_WLTP || yad2Data?.kamut_HC || '',
      coEmission: yad2Data?.coEmission || yad2Data?.CO_WLTP || yad2Data?.kamut_CO || '',
      
      // Safety and features
      safetyRating: yad2Data?.safetyRating || yad2Data?.nikud_betihut || '',
      safetyRatingWithoutSeatbelts: yad2Data?.safetyRatingWithoutSeatbelts || yad2Data?.ramat_eivzur_betihuty || '',
      fuelTankCapacityWithoutReserve: yad2Data?.fuelTankCapacityWithoutReserve || yad2Data?.kosher_grira_bli_blamim || ''
    };

    return mergedData;
  };


  /**
   * Resets the form to initial state
   */
  const resetForm = () => {
    setFormData({
      title: '',
      makeModel: '',
      year: '',
      plateNumber: '',
      mileage: '',
      color: '',
      engineType: '',
      transmission: 'Automatic',
      currentCondition: '',
      knownProblems: '',
      pros: '',
      cons: '',
      tradeIn: '',
      description: '',
      askingPrice: '',
      name: '',
      email: '',
      phone: '',
      manufacturerName: '',
      modelId: '',
      subModelId: '',
      commercialNickname: '',
      yearOfProduction: '',
      engineCapacity: '',
      bodyType: '',
      seatingCapacity: '',
      fuelType: '',
      abs: '',
      airbags: '',
      powerWindows: '',
      driveType: '',
      totalWeight: '',
      height: '',
      fuelTankCapacity: '',
      co2Emission: '',
      greenIndex: '',
      commercialName: '',
      rank: '',
      carType: '',
      ownerType: '',
      previousOwners: [],
      priceNegotiable: false,
      region: '',
      termsAccepted: false,
      selectedPackage: 'website_release',
    });
    setSelectedManufacturer('');
    setSelectedModel('');
    setAvailableModels([]);
    setAvailableYears([]);
    setErrors(prev => ({ ...prev, manufacturer: '', model: '' }));
    
    // Clear cookies when form is reset
    clearCookies();
    
    // Also clear the additional state variables
    setYad2ModelInfo(null);
    setPlateNumber('');
    setCarData(null);
    setGovCarInfo(null);
    
    // Clear image-related state
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsUploading(false);
    
    // Clear video-related state
    setSelectedVideos([]);
    setVideoPreviewUrls([]);
    setIsUploadingVideos(false);
    
    // Clear video-related state
    setSelectedVideos([]);
    setVideoPreviewUrls([]);
    setIsUploadingVideos(false);
  };









  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    console.log('Starting form submission...');

    try {
      // Upload images first if any are selected
      let uploadedImageIds: string[] = [];
      if (selectedImages.length > 0) {
        console.log('Uploading images...');
        uploadedImageIds = await uploadImages();
        console.log('Uploaded image IDs:', uploadedImageIds);
      }

      // Upload videos if any are selected
      let uploadedVideoIds: string[] = [];
      if (selectedVideos.length > 0) {
        console.log('Uploading videos...');
        uploadedVideoIds = await uploadVideos();
        console.log('Uploaded video IDs:', uploadedVideoIds);
      }

      // Merge yad2ModelInfo and formData using our merge function
      console.log('Merging car data...');
      const mergedCarData = mergeCarData(yad2ModelInfo?.data, formData);
      
      // Add uploaded image IDs to the car data
      if (uploadedImageIds.length > 0) {
        mergedCarData.images = uploadedImageIds;
        console.log('Added image IDs to car data:', uploadedImageIds);
      }

      // Add uploaded video IDs to the car data
      if (uploadedVideoIds.length > 0) {
        mergedCarData.videos = uploadedVideoIds;
        console.log('Added video IDs to car data:', uploadedVideoIds);
      }
      
      console.log('Merged car data:', mergedCarData);

      // Prepare final car details object for API
      const carDetails = {
        car: mergedCarData,
        formData: yad2ModelInfo?.data || {},
        submission_timestamp: new Date().toISOString(),
        form_version: '1.0'
      };

      console.log('Submitting to API with data:', carDetails);

      // Submit to addListing API
      const response = await fetch('/api/addListing', {
        method: 'POST',
        body: JSON.stringify(carDetails)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Show success message
        alert(t('success_title') || 'Success! Your car listing has been submitted.');
        
        // Reset form and go to first step
        resetForm();
        handleStepChange(0);
        
        // Reset all selections
        setSelectedManufacturer('');
        setSelectedModel('');
        setSelectedYear('');
        setSubModelID('');
        setSelectedSubmodel('');
        
        // Clear yad2ModelInfo
        setYad2ModelInfo(null);
        setCarData(null);
        
        // Clear cookies after successful submission
        clearCookies();
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API submission failed:', response.status, errorData);
        throw new Error(`Submission failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Error during form submission:', error);
      
      // Show error message to user
      alert(t('error_title') || 'Error! Failed to submit car listing. Please try again.');
      
    } finally {
      setIsSubmitting(false);
      console.log('Form submission process completed');
    }
  };

  // Show loading state while not on client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Helper function to render the next/submit button to avoid hydration issues
  const renderNextButton = () => {
    if (currentStep < STEPS.length - 1) {
      return (
        <Button
          type="button"
          onClick={() => {
            if (isClient) {
              console.log('Current step:', currentStep, 'Total steps:', STEPS.length);
            }
            if (currentStep === 0) {
              // Validate car type selection
              if (!formData.carType) {
                alert(t('please_select_car_type') || 'Please select a car type');
                return;
              }
              handleNextStep()
            } else if (currentStep === 1) {
              if (!formData.mileage) {
                alert(t('please_enter_mileage') || 'Please enter the mileage');
                return;
              }
              if (inputMethod === "manual") {
                if (isClient) {
                  console.log('yad2ModelInfo?.data', yad2ModelInfo)
                  console.log('formData', formData)
                }
                setFormData(prev => ({ ...prev, title: yad2ModelInfo?.data?.commercialName +  ` ${t('engine')} ` + (parseInt(yad2ModelInfo?.data?.engineCapacity)/1000 ).toFixed(1) + ` ${t('year')} ` + formData?.year + ` ${t('model')} ` + yad2ModelInfo?.data?.trimLevel + ` ${t('horsepower')} ` + yad2ModelInfo?.data?.enginePower + ` ${t('gearbox')} ` + yad2ModelInfo?.data?.transmission }));
                handleNextStep()
              } else {
                // Check if user has searched for a car first
                if (!yad2ModelInfo?.data) {
                  alert(t('please_search_for_a_car_first') || 'Please search for a car first');
                  return;
                }
                console.log('yad2ModelInfo?.data', yad2ModelInfo)
                console.log('yad2ModelInfo?.data?.manufacturerName', yad2ModelInfo?.data?.manufacturerName)
                if (formData.title === "" || formData.title === undefined || formData.title === null || formData.title === "null" ) {
                  if (yad2ModelInfo?.data?.manufacturerName && yad2ModelInfo?.data?.commercialName && yad2ModelInfo?.data?.shnat_yitzur) {
                    setFormData(prev => ({
                      ...prev,
                      title:
                        yad2ModelInfo?.data?.commercialName +
                        (yad2ModelInfo?.data?.nefah_manoa !== undefined &&
                         yad2ModelInfo?.data?.nefah_manoa !== null &&
                         yad2ModelInfo?.data?.nefah_manoa !== ""
                          ? ` ${t('engine')} ` + (parseInt(yad2ModelInfo?.data?.nefah_manoa) / 1000).toFixed(1)
                          : ""
                        ) +
                        +
                        (yad2ModelInfo?.data?.shnat_yitzur !== undefined && yad2ModelInfo?.data?.shnat_yitzur !== null && yad2ModelInfo?.data?.shnat_yitzur !== "" 
                          ? ` ${t('year')} ` + yad2ModelInfo?.data?.shnat_yitzur 
                          : ""
                        ) +
                        (yad2ModelInfo?.data?.subModelTitle !== undefined && yad2ModelInfo?.data?.subModelTitle !== null && yad2ModelInfo?.data?.subModelTitle !== "" 
                          ? ` ${t('model')} ` + yad2ModelInfo?.data?.subModelTitle 
                          : ""
                        ) +
                        (yad2ModelInfo?.data?.koah_sus !== undefined && yad2ModelInfo?.data?.koah_sus !== null && yad2ModelInfo?.data?.koah_sus !== "" 
                          ? ` ${t('horsepower')} ` + yad2ModelInfo?.data?.koah_sus 
                          : ""
                        ) +
                        (yad2ModelInfo?.data?.transmission !== undefined && yad2ModelInfo?.data?.transmission !== null && yad2ModelInfo?.data?.transmission !== "" 
                          ? ` ${t('gearbox')} ` + yad2ModelInfo?.data?.transmission 
                          : ""
                        ) 
                    }));
                    handleNextStep()
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      title:
                        yad2ModelInfo?.data?.commercialName +
                        (yad2ModelInfo?.data?.nefah_manoa !== undefined &&
                         yad2ModelInfo?.data?.nefah_manoa !== null &&
                         yad2ModelInfo?.data?.nefah_manoa !== ""
                          ? ` ${t('engine')} ` + (parseInt(yad2ModelInfo?.data?.nefah_manoa) / 1000).toFixed(1)
                          : ""
                        ) +
                        +
                        (yad2ModelInfo?.data?.shnat_yitzur !== undefined && yad2ModelInfo?.data?.shnat_yitzur !== null && yad2ModelInfo?.data?.shnat_yitzur !== "" 
                          ? ` ${t('year')} ` + yad2ModelInfo?.data?.shnat_yitzur 
                          : ""
                        ) +
                        (yad2ModelInfo?.data?.subModelTitle !== undefined && yad2ModelInfo?.data?.subModelTitle !== null && yad2ModelInfo?.data?.subModelTitle !== "" 
                          ? ` ${t('model')} ` + yad2ModelInfo?.data?.subModelTitle 
                          : ""
                        ) +
                        (yad2ModelInfo?.data?.koah_sus !== undefined && yad2ModelInfo?.data?.koah_sus !== null && yad2ModelInfo?.data?.koah_sus !== "" 
                          ? ` ${t('horsepower')} ` + yad2ModelInfo?.data?.koah_sus 
                          : ""
                        ) +
                        (yad2ModelInfo?.data?.transmission !== undefined && yad2ModelInfo?.data?.transmission !== null && yad2ModelInfo?.data?.transmission !== "" 
                          ? ` ${t('gearbox')} ` + yad2ModelInfo?.data?.transmission 
                          : ""
                        ) 
                    }));                             
                    handleStepChange(1)
                  }
                } else {
                  setFormData(prev => ({
                    ...prev,
                    title:
                      yad2ModelInfo?.data?.commercialName +
                      (yad2ModelInfo?.data?.nefah_manoa !== undefined &&
                       yad2ModelInfo?.data?.nefah_manoa !== null &&
                       yad2ModelInfo?.data?.nefah_manoa !== ""
                        ? ` ${t('engine')} ` + (parseInt(yad2ModelInfo?.data?.nefah_manoa) / 1000).toFixed(1)
                        : ""
                      ) +
                      +
                      (yad2ModelInfo?.data?.shnat_yitzur !== undefined && yad2ModelInfo?.data?.shnat_yitzur !== null && yad2ModelInfo?.data?.shnat_yitzur !== "" 
                        ? ` ${t('year')} ` + yad2ModelInfo?.data?.shnat_yitzur 
                        : ""
                      ) +
                      (yad2ModelInfo?.data?.subModelTitle !== undefined && yad2ModelInfo?.data?.subModelTitle !== null && yad2ModelInfo?.data?.subModelTitle !== "" 
                        ? ` ${t('model')} ` + yad2ModelInfo?.data?.subModelTitle 
                        : ""
                      ) +
                      (yad2ModelInfo?.data?.koah_sus !== undefined && yad2ModelInfo?.data?.koah_sus !== null && yad2ModelInfo?.data?.koah_sus !== "" 
                        ? ` ${t('horsepower')} ` + yad2ModelInfo?.data?.koah_sus 
                        : ""
                      ) +
                      (yad2ModelInfo?.data?.transmission !== undefined && yad2ModelInfo?.data?.transmission !== null && yad2ModelInfo?.data?.transmission !== "" 
                        ? ` ${t('gearbox')} ` + yad2ModelInfo?.data?.transmission 
                        : ""
                      ) 
                  }));
                  handleNextStep()
                }
              } 
            } else if(currentStep === 2){
              // Validate mandatory fields in step 2
              if (!formData.ownerType) {
                alert(t('please_select_owner_type') || 'Please select an owner type');
                return;
              }
            
              if(formData.description === "" || formData.description === undefined || formData.description === null || formData.description === "null" ){
                generateAIDescription();
                handleNextStep()
              }else{
                handleNextStep()
              }
            }else if(currentStep === 3){
              // Validate mandatory fields in price step
              if (!formData.askingPrice) {
                alert(t('please_enter_price') || 'Please enter the asking price');
                return;
              }
              if (!formData.region) {
                alert(t('please_select_region') || 'Please select your region');
                return;
              }
              handleNextStep()
            }else if(currentStep === 4){
              // Validate mandatory fields in contact step
              if (!formData.name) {
                alert(t('please_enter_name') || 'Please enter your name');
                return;
              }
              if (!formData.phone) {
                alert(t('please_enter_phone') || 'Please enter your phone number');
                return;
              }
              handleNextStep()
                        }else if(currentStep === 5){
              // Validate mandatory fields in terms step
              
              if (!formData.termsAccepted) {
                alert(t('please_accept_terms') || 'Please accept the terms and privacy policy');
                return;
              }
              handleNextStep()
            }else if(currentStep === 6){
              // Validate package selection
              if (!formData.selectedPackage) {
                alert(t('please_select_package') || 'Please select a package');
                return;
              }
              handleNextStep()
            }else {
                handleNextStep()
              }
              
            }
          }
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 hover:shadow-md transform hover:scale-105 text-sm sm:text-base"
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {t("next")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Button>
      );
    }
    
    // Submit button
    return (
      <Button
        type="button"
        onClick={() => {
          console.log('Submit button clicked on step:', currentStep);
          // Handle form submission here
          handleSubmit(new Event('submit') as any);
        }}
        disabled={isSubmitting}
        className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-200 hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('submitting') || 'Submitting...'}
            </>
          ) : (
            <>
              {t('submit_listing') || 'Submit Listing'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </div>
      </Button>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-[20%] md:mt-[5%] py-4 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          
          {/* Action Buttons Container */}
          <div className="flex flex-row gap-2 sm:gap-3">
          {/* Clear Plate Data Button */}
          {plateNumber && (
            <Button
              type="button"
              variant="outline"
              onClick={clearPlateData}
                className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-colors duration-200 w-full sm:w-auto justify-center sm:justify-start"
              title={t('clear_plate_data') || 'Clear plate number and car data to search for a different car'}
            >
                <Car className="h-4 w-4 mr-1 sm:mr-2" />
              {t('clear_plate') || 'Clear Plate'}
            </Button>
          )}
          
        </div>
              </div>




        {/* Steps indicator (clickable) */}
        <div className="mb-6 sm:mb-8">
          <ol className="flex items-center text-xs sm:text-sm text-gray-700 gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0" role="list">
            {STEPS.map((_, index) => (
              <li key={index} className="flex items-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleStepChange(index)}
                  className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    currentStep === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  aria-current={currentStep === index ? 'step' : undefined}
                  aria-label={`Step ${index + 1}`}
                >
                  {index + 1}
                </button>
                {index < STEPS.length - 1 && (
                  <span className="w-4 sm:w-6 md:w-8 h-px bg-gray-300 mx-1 sm:mx-2" aria-hidden="true"></span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Car Type Selection */}
          {currentStep === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">{t('car_type_selection') || 'Car Type Selection'}</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                  {t('what_type_of_car') || 'What type of car are you selling?'} <span className="text-red-500">*</span>
                </label>
                <RadioGroup
                  value={formData.carType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, carType: value }))}
                >
                                     <div className="grid grid-cols-2 gap-3 sm:gap-4">
                     <div className={`border-2 rounded-xl p-3 sm:p-4 md:p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer ${
                      formData.carType === 'private' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <RadioGroupItem value="private" id="private" className="sr-only" />
                      <Label htmlFor="private" className="cursor-pointer">
                        <div className="text-center">
                          <div className={`rounded-full p-2 sm:p-3 md:p-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center transition-colors duration-200 ${
                            formData.carType === 'private' 
                              ? 'bg-blue-100' 
                              : 'bg-blue-50'
                          }`}>
                            <Car className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 transition-colors duration-200 ${
                              formData.carType === 'private' 
                                ? 'text-blue-600' 
                                : 'text-blue-500'
                            }`} />
                          </div>
                          <h3 className={`text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 transition-colors duration-200 ${
                            formData.carType === 'private' 
                              ? 'text-blue-700' 
                              : 'text-gray-900'
                          }`}>{t('private_car') || 'Private Car'}</h3>
                          <p className={`text-xs transition-colors duration-200 ${
                            formData.carType === 'private' 
                              ? 'text-blue-600' 
                              : 'text-gray-600'
                          }`}>{t('private_car_description') || 'Personal vehicle for individual use'}</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className={`border-2 rounded-xl p-3 sm:p-4 md:p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer ${
                      formData.carType === 'commercial' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <RadioGroupItem value="commercial" id="commercial" className="sr-only" />
                      <Label htmlFor="commercial" className="cursor-pointer">
                        <div className="text-center">
                          <div className={`rounded-full p-2 sm:p-3 md:p-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center transition-colors duration-200 ${
                            formData.carType === 'commercial' 
                              ? 'bg-blue-100' 
                              : 'bg-green-50'
                          }`}>
                            <Truck className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 transition-colors duration-200 ${
                              formData.carType === 'commercial' 
                                ? 'text-blue-600' 
                                : 'text-green-600'
                            }`} />
                          </div>
                          <h3 className={`text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 transition-colors duration-200 ${
                            formData.carType === 'commercial' 
                              ? 'text-blue-700' 
                              : 'text-gray-900'
                          }`}>{t('commercial_car') || 'Commercial Car'}</h3>
                          <p className={`text-xs transition-colors duration-200 ${
                            formData.carType === 'commercial' 
                              ? 'text-blue-600' 
                              : 'text-gray-600'
                          }`}>{t('commercial_car_description') || 'Business vehicle or fleet car'}</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </motion.div>
          )}

          {/* Basic Information */}
          {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">{t('basic_information')}</h2>
            
            {/* Input Method Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    clearFormData();
                    setInputMethod('plate');
                  }}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    inputMethod === 'plate'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {t('search_by_plate') || 'Search by Plate Number'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearFormData();
                    setInputMethod('manual');
                  }}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    inputMethod === 'manual'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {t('enter_manually') || 'Enter Manually'}
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Plate Number Input Method - Moved to top */}
            {inputMethod === 'plate' && (
              <motion.div 
                key="plate-method"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 sm:space-y-6 mb-6 sm:mb-8"
              >
                <div className="w-full max-w-xl mx-auto">
                  <div className="relative">
                    <div className="relative flex items-center bg-[#ffca11] rounded shadow-lg p-2">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <img 
                          src="/a1.png" 
                          alt={t("logo_alt") || "Logo"} 
                          width={40} 
                          height={50} 
                          className="object-fill w-[50px] sm:w-[60px] md:w-[80px] p-[2px]" 
                        />
                      </div>
                      <div className="relative w-full">
                        <Input
                          type="text"
                          value={plateNumber}
                          onChange={handlePlateNumberChange}
                          placeholder={t("enter_plate") || "Enter Plate Number"}
                          className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-[0.1em] bg-transparent border-0 focus:ring-0 text-center uppercase"
                          maxLength={10}
                          style={{
                            letterSpacing: '0.1em',
                            fontFamily: 'monospace',
                            lineHeight: '1',
                            WebkitTextStroke: '1px black',
                            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                          }}
                        />
                        {/* Show restored indicator if plate number was loaded from cookies */}
                        {isClient && plateNumber && loadFromCookie(COOKIE_KEYS.PLATE_NUMBER) === plateNumber && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            ✓ Restored
                          </div>
                        )}
                        {loading && (
                          <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 sm:px-4 w-full justify-center pt-3 sm:pt-4">
                      <Button 
                        onClick={fetchCarData} 
                        disabled={loading}
                        className="rounded-full w-auto text-black h-10 sm:h-12 hover:bg-blue-700 transition-colors bg-[#ffca11] text-sm sm:text-base px-4 sm:px-6"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("loading_info") || "Loading..."}
                          </>
                        ) : (
                          t("search_by_vin") || "Search by VIN"
                        )}
                      </Button>
                      
                      {/* Refresh button - only show if we have existing data */}
                      {yad2ModelInfo?.data && (
                        <Button 
                          type="button"
                          onClick={refreshCarData}
                          disabled={loading}
                          variant="outline"
                          className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:bg-blue-50 transition-colors border-blue-300"
                          title={t("refresh_car_data") || "Refresh car data"}
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Title Field */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-4 sm:mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('title')} <span className="text-gray-500">({t('auto_generated_hint') || 'Auto-generated'})</span>
              </label>
                <Input
                  placeholder={t('title_placeholder')}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`w-full text-base sm:text-lg py-4 sm:py-6 px-3 sm:px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              {isClient && !formData.title && selectedManufacturer && selectedModel && selectedYear && (
                <p className="mt-2 text-xs sm:text-sm text-blue-600">
                  💡 {t('title_auto_generation_hint') || 'Title will be auto-generated as'} "{manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer} {formData.commercialName || t('model')} {selectedYear} {yad2ModelInfo?.data?.koah_sus || t('model')}  {yad2ModelInfo?.data?.transmission || t('model')} {yad2ModelInfo?.data?.fuelType || t('model')} {t('when_click_next') || 'when you click next'}
                </p>
              )}
             
            </motion.div>

            {/* Mileage Field */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-4 sm:mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('mileage')} <span className="text-red-500">*</span> <span className="text-gray-500">({t('in_kilometers') || 'in kilometers'})</span>
              </label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                placeholder={t('mileage')}
                value={
                  formData.mileage
                    ? Number(formData.mileage.replace(/,/g, '')).toLocaleString('en-US')
                    : ''
                }
                onChange={(e) => {
                  // Remove all non-digit characters
                  const rawValue = e.target.value.replace(/,/g, '').replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, mileage: rawValue }));
                }}
                className={`rounded-xl py-4 sm:py-5 px-3 sm:px-4 ${errors.mileage ? 'border-red-500' : ''}`}
              />
              {errors.mileage && <p className="mt-1 text-sm text-red-500">{errors.mileage}</p>}
            </motion.div>



            {/* Manual Entry Method */}
            {inputMethod === 'manual' && (
              <motion.div 
                key="manual-method"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 sm:space-y-6"
              >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Manufacturer Selection */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('manufacturer') || 'Manufacturer'} <span className="text-red-500">*</span>
                    </label>
                  <Select
                    value={selectedManufacturer}
                    onValueChange={(value) => {
                      if (value && manufacturersData[value]) {
                        const models = manufacturersData[value].submodels || [];
                          setSelectedModel('');
                          setSelectedYear('');
                          setSelectedSubmodel('');
                          setFormData(prev => ({ 
                            ...prev, 
                            manufacturerName: value, // Keep the ID for form submission
                            modelId: '',
                            subModelId: '',
                            commercialNickname: ''
                          }));
                      } else {
                          setSelectedModel('');
                          setSelectedYear('');
                          setSelectedSubmodel('');
                          setFormData(prev => ({ 
                            ...prev, 
                            manufacturerName: '',
                            modelId: '',
                            subModelId: '',
                            commercialNickname: ''
                          }));
                      }
                      setSelectedManufacturer(value);
                      setErrors(prev => ({ ...prev, manufacturer: '' }));
                    }}
                  >
                    <SelectTrigger className="rounded-xl py-3 sm:py-5">
                      <SelectValue placeholder={t('select_manufacturer') || 'Select Manufacturer'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.keys(manufacturersData).length === 0 ? (
                        <SelectItem value="loading_manufacturers" disabled>
                          {locale ? `Loading manufacturers for ${locale}...` : 'Loading manufacturers...'}
                        </SelectItem>
                      ) : (
                        Object.keys(manufacturersData).map((manufacturer) => (
                          <SelectItem key={manufacturer} value={manufacturer}>
                            {manufacturersData[manufacturer]?.submodels?.[0]?.manufacturer?.title || manufacturer}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.manufacturer && <p className="mt-1 text-sm text-red-500">{errors.manufacturer}</p>}
                  </motion.div>

                  {/* Model Selection */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('model') || 'Model'} <span className="text-red-500">*</span>
                    </label>
                  <Select
                    value={selectedModel}
                    onValueChange={(value) => {
                      setSelectedModel(value);
                        setSubModelID(value);
                        const selectedModelData = availableModels.find(model => model.id?.toString() === value);
                        if (selectedModelData) {
                          setFormData(prev => ({ 
                            ...prev, 
                            commercialNickname: selectedModelData.title || '',
                            modelId: selectedModelData.id?.toString() || '' // Keep the ID for form submission
                          }));
                        }
                        onFetchSubmodels(value);
                        setSelectedSubmodel('');
                        setErrors({ ...errors, model: '' });
                    }}
                    disabled={!selectedManufacturer || availableModels.length === 0}
                  >
                    <SelectTrigger className="rounded-xl py-3 sm:py-5">
                      <SelectValue placeholder={t('select_model') || 'Select Model'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {!selectedManufacturer ? (
                        <SelectItem value="select_manufacturer_first" disabled>
                          Select manufacturer first
                        </SelectItem>
                      ) : availableModels.length === 0 ? (
                        <SelectItem value="no_models_available" disabled>
                          No models available
                        </SelectItem>
                      ) : (
                        availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id?.toString()}>
                            {model.title || 'Unknown Model'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
                  </motion.div>

                  {/* Year Selection */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('year') || 'Year'} <span className="text-red-500">*</span>
                    </label>
                  <Select
                      value={selectedYear}
                      onValueChange={async (value) => {
                        setSelectedYear(value);
                        setSelectedSubmodel('');
                        setFormData(prev => ({ 
                          ...prev, 
                          year: value,
                          subModelId: '',
                          commercialNickname: ''
                        }));
                        setErrors({ ...errors, year: '' });
                        
                        // Fetch submodel options when year is selected
                        if (selectedManufacturer && selectedModel && value) {
                          try {
                            // Use Hebrew names for API calls to government system
                            const manufacturerTitleHebrew = manufacturers_hebrew[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
                            const modelTitleEnglish = manufacturers_english[selectedManufacturer]?.submodels?.find(
                              (model: any) => model.id?.toString() === selectedModel
                            )?.title || selectedModel;

                            // Fetch submodel options and set them globally using Hebrew names
                            const submodelOptions = await fetchSubmodelOptions(manufacturerTitleHebrew, modelTitleEnglish, value);
                            setGlobalSubmodelOptions(submodelOptions);
                            // Update available submodels with the fetched data
                            if (submodelOptions.length > 0) {
                              // Convert to the format expected by the existing submodel logic
                              // Use localized names from our manufacturers data when available
                              const formattedSubmodels = submodelOptions.map(option => {
                                // Try to find a matching submodel in our localized data by ID first
                                let localizedSubmodel = manufacturersData[selectedManufacturer]?.submodels?.find(
                                  sub => sub.id?.toString() === option.id?.toString()
                                );
                                
                                // If no match by ID, try to find by name similarity (fallback)
                                if (!localizedSubmodel) {
                                  const optionTrimLevel = option.trimLevel || '';
                                  localizedSubmodel = manufacturersData[selectedManufacturer]?.submodels?.find(
                                    sub => sub.title?.toLowerCase().includes(optionTrimLevel.toLowerCase()) ||
                                           optionTrimLevel.toLowerCase().includes(sub.title?.toLowerCase() || '')
                                  );
                                }
                                
                                return {
                                  id: option.id,
                                  title: localizedSubmodel?.title || option.title, // Use localized name if available
                                  minYear: parseInt(value),
                                  maxYear: parseInt(value),
                                  // Keep the original government API data for form submission
                                  originalTitle: option.title,
                                  ...option
                                };
                              });
                              
                              // Update the available submodels state
                              setAvailableSubmodels(formattedSubmodels);
                              
                              // Debug log to see what's happening with localization
                              if (isClient) {
                                console.log('Submodel localization debug:', {
                                  locale,
                                  selectedManufacturer,
                                  manufacturerTitleHebrew,
                                  modelTitleEnglish,
                                  submodelOptions: submodelOptions.length,
                                  formattedSubmodels: formattedSubmodels.map(s => ({
                                    id: s.id,
                                    title: s.title,
                                    originalTitle: s.originalTitle,
                                    isLocalized: s.title !== s.originalTitle
                                  }))
                                });
                              }
                            } else {
                              setAvailableSubmodels([]);
                            }
                          } catch (error) {
                            console.error('Error fetching submodel options:', error);
                          }
                        }
                    }}
                    disabled={!selectedManufacturer || !selectedModel || availableYears.length === 0}
                  >
                    <SelectTrigger className={`rounded-xl py-3 sm:py-5 ${errors.year ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={t('year') || 'Year'} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableYears.length === 0 ? (
                        <SelectItem value="no_years_available" disabled>
                          {!selectedManufacturer ? 'Select manufacturer first' : 
                           !selectedModel ? 'Select model first' : 'No years available'}
                        </SelectItem>
                      ) : (
                        availableYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                  </motion.div>

                  {/* Submodel Selection */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('submodel') || 'Submodel'} <span className="text-gray-500">({t('optional') || 'optional'})</span>
                    </label>
                    <Select
                      value={selectedSubmodel}
                      onValueChange={async (value) => {
                        setSelectedSubmodel(value);
                        const selectedSubmodelData = globalSubmodelOptions.find(submodel => submodel.id?.toString() === value);
                        if (selectedSubmodelData) {
                          // Use the localized name for display but keep the government API ID for submission
                          const displayName = selectedSubmodelData.title || selectedSubmodelData.originalTitle || '';
                          
                          setFormData(prev => ({ 
                            ...prev, 
                            commercialNickname: displayName,
                            subModelId: selectedSubmodelData.id?.toString() || '' // Keep the ID for form submission
                          }));
                          
                          // Fetch detailed specifications for the selected submodel
                          try {
                            // Try to find the detailed specs from globalSubmodelOptions
                            let detailedSpecs = selectedSubmodelData;
                            
                            if (globalSubmodelOptions.length > 0) {

                            }
                            
                            if (detailedSpecs) {
                              setFormData(prev => ({
                                ...prev,
                                engineType: detailedSpecs.transmission,
                                transmission: detailedSpecs.transmission || prev.transmission,
                                engineCapacity: detailedSpecs.engineCapacity || prev.engineCapacity,
                                bodyType: detailedSpecs.bodyType || prev.bodyType,
                                seatingCapacity: detailedSpecs.seatingCapacity || prev.seatingCapacity,
                                fuelType: detailedSpecs.fuelType || prev.fuelType,
                                abs: detailedSpecs.abs || prev.abs,
                                airbags: detailedSpecs.airbags || prev.airbags,
                                powerWindows: detailedSpecs.powerWindows || prev.powerWindows,
                                driveType: detailedSpecs.driveType || prev.driveType,
                                totalWeight: detailedSpecs.totalWeight || prev.totalWeight,
                                height: detailedSpecs.height || prev.height,
                                fuelTankCapacity: detailedSpecs.fuelTankCapacity || prev.fuelTankCapacity,
                                co2Emission: detailedSpecs.co2Emission || prev.co2Emission,
                                greenIndex: detailedSpecs.greenIndex || prev.greenIndex,
                                commercialName: detailedSpecs.commercialName || prev.commercialName,
                                rank: detailedSpecs.rank || prev.rank
                              }));
                              setGovCarInfo(detailedSpecs);
                              setYad2ModelInfo({data:{...detailedSpecs}});
                            } else {
                              console.warn('No detailed specs available for submodel:', selectedSubmodelData.title);
                              // Still update basic form data even without detailed specs
                              setFormData(prev => ({
                                ...prev,
                                commercialNickname: selectedSubmodelData.title || '',
                                subModelId: selectedSubmodelData.id?.toString() || '' // Keep the ID for form submission
                              }));
                            }
                          } catch (error) {
                            console.error('Error fetching detailed submodel specifications:', error);
                          }
                        }
                        setErrors({ ...errors, submodel: '' });
                      }}
                      disabled={!selectedManufacturer || !selectedModel || !selectedYear || availableSubmodels.length === 0}
                    >
                      <SelectTrigger className="rounded-xl py-3 sm:py-5">
                        <SelectValue placeholder={t('select_submodel') || 'Select Submodel'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {!selectedManufacturer || !selectedModel || !selectedYear ? (
                          <SelectItem value="no_submodels_available" disabled>
                            {!selectedManufacturer ? 'Select manufacturer first' : 
                             !selectedModel ? 'Select model first' : 
                             !selectedYear ? 'Select year first' : 'No submodels available'}
                          </SelectItem>
                        ) : availableSubmodels.length === 0 ? (
                          <SelectItem value="no_submodels_available" disabled>
                            {loading ? 'Loading submodels...' : 'No submodels available for this selection'}
                          </SelectItem>
                        ) : (
                          availableSubmodels.map((submodel) => (submodel.minYear <= selectedYear && submodel.maxYear >= selectedYear) && (
                            <SelectItem key={submodel.id} value={submodel.id?.toString()}>
                              {submodel.title || 'Unknown Submodel'}
                              {submodel.originalTitle && submodel.title !== submodel.originalTitle && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({submodel.originalTitle})
                                </span>
                              )}
                            </SelectItem>
                          )).filter(Boolean) // Filter out undefined values from the && operator
                        )}
                      </SelectContent>
                    </Select>
                    {errors.submodel && <p className="mt-1 text-sm text-red-500">{errors.submodel}</p>}
                  </motion.div>
                </div>

                {/* Additional Fields */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="space-y-4"
                >
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('engine_type') || 'Engine Type'} <span className="text-gray-500">({t('optional') || 'optional'})</span>
                    </label>
                <Select
                  value={formData.engineType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, engineType: value }))}
                >
                      <SelectTrigger className="rounded-xl py-5 text-black">
                        <SelectValue placeholder={t('engine_type') || 'Engine Type'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                        {ENGINE_TYPES.map((engineType) => (
                          <SelectItem key={engineType.value} value={engineType.value}>
                            {engineType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('transmission') || 'Transmission'} <span className="text-gray-500">({t('optional') || 'optional'})</span>
                    </label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                >
                      <SelectTrigger className="rounded-xl py-5 text-black">
                        <SelectValue placeholder={t('select_transmission') || 'Select Transmission'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                        {TRANSMISSION_OPTIONS.map((transmission) => (
                          <SelectItem key={transmission.value} value={transmission.value}>
                            {transmission.label}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                  </div> */}
                </motion.div>
              </motion.div>
            )}



            {showCaptchaPrompt && captchaRequired && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-700 font-semibold mb-2">Robot check required</p>
                  <p className="text-sm text-red-700 mb-4">Please complete the captcha challenge to continue.</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        if (captchaUrl) window.open(captchaUrl, '_blank', 'width=480,height=720');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Open Captcha
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowCaptchaPrompt(false);
                        fetchCarData();
                      }}
                      disabled={loading}
                      variant="outline"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("loading_info") || "Loading..."}
                        </>
                      ) : (
                        "I completed it, retry"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* ALL Government Car Information - Complete Data Display */}
              {/* {yad2ModelInfo?.data && ( */}
               


                  {/* Debug Information - Raw Data */}
                  {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-gray-600 font-semibold">🔍 {t('debug_info') || 'Debug Information'}</span>
            </div>
                    <div className="bg-white p-4 rounded-lg border overflow-auto max-h-60">
                      <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap">
                        {JSON.stringify(yad2ModelInfo.data, null, 2)}
                      </pre>
                </div>
                  </div> */}
                
              {/* )} */}
              
              {/* Loading State for Car Details */}
              {loading && (
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mb-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <p className="text-lg font-medium text-gray-700">
                      {t("loading_info") || "Loading car information..."}
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      Fetching detailed car data from government database...
                    </p>
                  </div>
                </div>
              )}
              
              {/* Show Car Details when not loading and data is available */}
              {!loading && yad2ModelInfo?.data && (
                <div className="relative">
                  {/* Show restored indicator if yad2ModelInfo was loaded from cookies */}
                  {isClient && loadFromCookie(COOKIE_KEYS.YAD2_MODEL_INFO) && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse z-10">
                      ✓ Data Restored
                    </div>
                  )}
                  <CarDetailsSections data={yad2ModelInfo.data} t={t} />
                </div>
              )}

          </motion.div>
          
          )}

          {/* Condition, Trade-in & description - Combined Step */}
          {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">{t('condition_trade_in_description') || 'Condition, Trade-in & description'}</h2>
            
            {/* Condition Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">{t('condition') || 'Condition'}</h3>
              <Select
                value={formData.currentCondition}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currentCondition: value }))}
              >
                <SelectTrigger className="rounded-xl py-3 sm:py-5">
                  <SelectValue placeholder={t('current_condition')} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {t(`condition_${condition}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trade-in Option Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">{t('trade_in_option') || 'Trade-in Option'}</h3>
              <RadioGroup
                value={formData.tradeIn}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tradeIn: value }))}
                className="rtl"
                dir="rtl"
              >
                <div className="flex items-center space-x-reverse space-x-2" dir="rtl">
                  <Label htmlFor="yes">{t('yes')}</Label>
                  <RadioGroupItem value="yes" id="yes" />
                </div>
                <div className="flex items-center space-x-reverse space-x-2" dir="rtl">
                  <Label htmlFor="no">{t('no')}</Label>
                  <RadioGroupItem value="no" id="no" />
                </div>
                <div className="flex items-center space-x-reverse space-x-2" dir="rtl">
                  <Label htmlFor="maybe">{t('maybe')}</Label>
                  <RadioGroupItem value="maybe" id="maybe" />
                </div>
              </RadioGroup>
            </div>

            {/* description Section */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">{t('description') || 'description'}</h3>
            <Textarea
                placeholder={t('description_placeholder')}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="h-20 sm:h-24 rounded-xl py-3 sm:py-5"
            />
            </div>

            {/* Owner Type Section */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">{t('owner_type') || 'Owner Type'} <span className="text-red-500">*</span></h3>
              <RadioGroup
                value={formData.ownerType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, ownerType: value }))}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className={`border-2 rounded-xl p-3 sm:p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer ${
                    formData.ownerType === 'private' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <RadioGroupItem value="private" id="owner-private" className="sr-only" />
                    <Label htmlFor="owner-private" className="cursor-pointer">
                      <div className="text-center">
                        <div className={`rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 flex items-center justify-center transition-colors duration-200 ${
                          formData.ownerType === 'private' 
                            ? 'bg-blue-100' 
                            : 'bg-blue-50'
                        }`}>
                          <User className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                            formData.ownerType === 'private' 
                              ? 'text-blue-600' 
                              : 'text-blue-500'
                          }`} />
                        </div>
                        <h4 className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                          formData.ownerType === 'private' 
                            ? 'text-blue-700' 
                            : 'text-gray-900'
                        }`}>{t('private_owner') || 'Private'}</h4>
                      </div>
                    </Label>
                  </div>
                  
                  <div className={`border-2 rounded-xl p-3 sm:p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer ${
                    formData.ownerType === 'company' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <RadioGroupItem value="company" id="owner-company" className="sr-only" />
                    <Label htmlFor="owner-company" className="cursor-pointer">
                      <div className="text-center">
                        <div className={`rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 flex items-center justify-center transition-colors duration-200 ${
                          formData.ownerType === 'company' 
                            ? 'bg-blue-100' 
                            : 'bg-green-50'
                        }`}>
                          <Building className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                            formData.ownerType === 'company' 
                              ? 'text-blue-600' 
                              : 'text-green-600'
                          }`} />
                        </div>
                        <h4 className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                          formData.ownerType === 'company' 
                            ? 'text-blue-700' 
                            : 'text-gray-900'
                        }`}>{t('company_owner') || 'Company'}</h4>
                      </div>
                    </Label>
                  </div>
                  
                  <div className={`border-2 rounded-xl p-3 sm:p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer ${
                    formData.ownerType === 'rental' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <RadioGroupItem value="rental" id="owner-rental" className="sr-only" />
                    <Label htmlFor="owner-rental" className="cursor-pointer">
                      <div className="text-center">
                        <div className={`rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 flex items-center justify-center transition-colors duration-200 ${
                          formData.ownerType === 'rental' 
                            ? 'bg-blue-100' 
                            : 'bg-purple-50'
                        }`}>
                          <Key className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                            formData.ownerType === 'rental' 
                              ? 'text-blue-600' 
                              : 'text-purple-600'
                          }`} />
                        </div>
                        <h4 className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                          formData.ownerType === 'rental' 
                            ? 'text-blue-700' 
                            : 'text-gray-900'
                        }`}>{t('rental_owner') || 'Rental'}</h4>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Previous Owners Section */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">{t('previous_owners') || 'Previous Owners'} <span className="text-gray-500">({t('optional') || 'optional'})</span></h3>
              <div className="space-y-3 sm:space-y-4">
                {formData.previousOwners.map((owner, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <Input
                        placeholder={t('owner_name') || 'Owner name'}
                        value={owner.name}
                        onChange={(e) => {
                          const newOwners = [...formData.previousOwners];
                          newOwners[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, previousOwners: newOwners }));
                        }}
                        className="mb-2"
                      />
                      <Select
                        value={owner.type}
                        onValueChange={(value) => {
                          const newOwners = [...formData.previousOwners];
                          newOwners[index].type = value;
                          setFormData(prev => ({ ...prev, previousOwners: newOwners }));
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('select_owner_type') || 'Select owner type'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="private">{t('private_owner') || 'Private'}</SelectItem>
                          <SelectItem value="company">{t('company_owner') || 'Company'}</SelectItem>
                          <SelectItem value="rental">{t('rental_owner') || 'Rental'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOwners = formData.previousOwners.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, previousOwners: newOwners }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      previousOwners: [...prev.previousOwners, { name: '', type: '' }]
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add_previous_owner') || 'Add Previous Owner'}
                </Button>
              </div>
            </div>
          </motion.div>
          )}

          {/* Price */}
          {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">{t('price')}</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Asking Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('asking_price') || 'Asking Price'} <span className="text-red-500">*</span>
                </label>
            <Input
              placeholder={t('asking_price_placeholder')}
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              value={
                formData.askingPrice
                  ? Number(formData.askingPrice.replace(/,/g, '')).toLocaleString('en-US')
                  : ''
              }
              onChange={(e) => {
                // Remove all non-digit characters except commas, then format
                const rawValue = e.target.value.replace(/,/g, '').replace(/\D/g, '');
                setFormData(prev => ({ ...prev, askingPrice: rawValue }));
              }}
              className="w-full text-base sm:text-lg py-4 sm:py-6 px-3 sm:px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
              </div>

              {/* Price Negotiable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                  {t('price_negotiable') || 'Are you willing to negotiate on the price?'}
                </label>
                <RadioGroup
                  value={formData.priceNegotiable ? 'yes' : 'no'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priceNegotiable: value === 'yes' }))}
                >
                  <div className="flex items-center space-x-4 sm:space-x-6 rtl">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="negotiable-yes" />
                      <Label htmlFor="negotiable-yes">{t('yes') || 'Yes'}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="negotiable-no" />
                      <Label htmlFor="negotiable-no">{t('no') || 'No'}</Label>
                    </div>
                  </div>
                </RadioGroup>
                {isClient && formData.priceNegotiable && (
                  <p className="mt-2 text-sm text-blue-600">
                    💡 {t('negotiable_hint') || 'Buyers will know you are open to reasonable offers'}
                  </p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('region') || 'Region in Israel'} <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger className="rounded-xl py-3 sm:py-5">
                    <SelectValue placeholder={t('select_region') || 'Select your region'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="jerusalem_district">{t('jerusalem_district') || 'Jerusalem District'}</SelectItem>
                    <SelectItem value="northern_district">{t('northern_district') || 'Northern District'}</SelectItem>
                    <SelectItem value="haifa_district">{t('haifa_district') || 'Haifa District'}</SelectItem>
                    <SelectItem value="central_district">{t('central_district') || 'Central District'}</SelectItem>
                    <SelectItem value="tel_aviv_district">{t('tel_aviv_district') || 'Tel Aviv District'}</SelectItem>
                    <SelectItem value="southern_district">{t('southern_district') || 'Southern District'}</SelectItem>
                    <SelectItem value="judea_samaria_area">{t('judea_samaria_area') || 'Judea and Samaria Area'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
          )}

          {/* Contact Info */}
          {currentStep === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">{t('contact_info')}</h2>
            <div className="space-y-3 sm:space-y-4">
              {/* Name */}
              <div>
                <Input
                  placeholder={t('name_placeholder')}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full text-base sm:text-lg py-4 sm:py-6 px-3 sm:px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              {/* Email */}
              <div>
                <Input
                  placeholder={t('email_placeholder')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full text-base sm:text-lg py-4 sm:py-6 px-3 sm:px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <Input
                  placeholder={t('phone_placeholder')}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full text-base sm:text-lg py-4 sm:py-6 px-3 sm:px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </motion.div>
          )}

          {/* Terms and Privacy Policy */}
          {currentStep === 5 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">{t('terms_and_privacy') || 'Terms and Privacy Policy'}</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">{t('upload_car_images') || 'Upload Car Images'}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t('upload_images_description') || 'Upload images of your car (max 5MB each)'}</p>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {t('select_images') || 'Select Images'}
                  </label>
                  
                  {/* Image Previews */}
                  {selectedImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{t('selected_images') || 'Selected Images:'}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imagePreviewUrls[index]}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => handleImageRemove(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        {t('images_ready', { count: selectedImages.length }) || `${selectedImages.length} image(s) ready for upload`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Video Upload Section */}

                {selectedVideos &&  selectedVideos?.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">{t('upload_car_videos') || 'Upload Car Videos'}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t('upload_videos_description') || 'Upload videos of your car (max 5MB each)'}</p>
                  
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {t('select_videos') || 'Select Videos'}
                  </label>
                  
                  
                </div>
                )}
                <div className="mt-6">
                    <Button
                      type="button"
                      onClick={() => clearSelectedVideos()}
                      className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                      aria-label={t('clear_selected_videos') || 'Clear selected videos'}
                      disabled={ selectedVideos.length === 0}
                    >
                      {t('clear_selected_videos') || 'Clear selected videos'}
                    </Button>
                </div>
                {/* Terms and Privacy Policy Checkbox */}
                <div className="mt-6 sm:mt-8">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={formData.termsAccepted || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms-checkbox" className="text-sm text-gray-700 leading-relaxed">
                      <span className="text-red-500">*</span> {t('terms_checkbox') || 'אני מאשר/ת את התקנון ומדיניות הפרטיות באתר ומאשר קבלת תוכן שיווקי מ MAXSPEEDLIMIT או מצדדים שלישיים באמצעי הקשר שמסרתי (גם בשירותי דיוור ישיר)'}
                    </label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="mt-2 text-sm text-red-500">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Package Selection */}
          {currentStep === 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 text-center">{t('choose_your_package') || 'בחירת המסלול שלך'}</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Free Package - Website Release */}
              <div className="border-2 border-green-500 rounded-xl p-4 sm:p-6 bg-green-50 relative">
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {t('recommended') || 'מומלץ'}
                </div>
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">{t('website_release') || 'שחרור האתר'}</h3>
                  <p className="text-sm sm:text-base text-green-600 mb-3 sm:mb-4">{t('free_first_3_months') || 'חינם ל-3 חודשים ראשונים - כל הפרימיום'}</p>
                  <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">₪0</div>
                  <p className="text-xs sm:text-sm text-green-600 mb-3 sm:mb-4">{t('first_3_months') || 'ל-3 חודשים ראשונים'}</p>
            <Button
              type="button"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                    onClick={() => setFormData(prev => ({ ...prev, selectedPackage: 'website_release' }))}
                  >
                    {t('select_package') || 'בחר חבילה'}
            </Button>
                </div>
              </div>

              {/* Premium Package - Unselectable */}
              <div className="border-2 border-gray-300 rounded-xl p-4 sm:p-6 bg-gray-50 opacity-60 cursor-not-allowed">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-500 mb-2">{t('premium') || 'פרימיום'}</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">{t('premium_description') || 'הדרך למכור מהר ולקבל את המחיר המקסימלי!'}</p>
                  <ul className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 space-y-1 sm:space-y-2 text-right">
                    <li>• {t('max_exposure') || 'מקסימום חשיפה ובראש התוצאות'}</li>
                    <li>• {t('auto_bump') || 'הקפצה אוטומטית בכל 4 שעות'}</li>
                    <li>• {t('more_calls') || 'יותר שיחות לקידום העסקה המתאימה'}</li>
                  </ul>
                  <div className="text-3xl font-bold text-gray-500 mb-2">₪254/28 {t('days') || 'ימים'}</div>
              <Button
                type="button"
                    disabled
                    className="bg-gray-400 text-gray-600 px-8 py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                    {t('coming_soon') || 'בקרוב'}
              </Button>
                </div>
              </div>

              {/* Enhanced Package - Unselectable */}
              <div className="border-2 border-gray-300 rounded-xl p-4 sm:p-6 bg-gray-50 opacity-60 cursor-not-allowed">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-500 mb-2">{t('enhanced') || 'משודרגת'}</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">{t('enhanced_description') || 'חשיפה גבוהה יותר מהמסלול הבסיסי'}</p>
                  <ul className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 space-y-1 sm:space-y-2 text-right">
                    <li>• {t('manual_bump') || 'הקפצה באופן ידני בכל 4 שעות'}</li>
                    <li>• {t('higher_position') || 'מיקום גבוה יותר בעמודי החיפוש'}</li>
                  </ul>
                  <div className="text-3xl font-bold text-gray-500 mb-2">₪204/28 {t('days') || 'ימים'}</div>
                  <Button
                    type="button"
                    disabled
                    className="bg-gray-400 text-gray-600 px-8 py-3 rounded-xl font-semibold cursor-not-allowed"
                  >
                    {t('coming_soon') || 'בקרוב'}
                  </Button>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">{t('payment_method') || 'שיטת תשלום'}</h4>
                <p className="text-xs sm:text-sm text-blue-700">{t('payment_info') || 'כל החבילות כוללות תשלום בטוח דרך מערכת התשלומים שלנו'}</p>
              </div>
            </div>
          </motion.div>
          )}

         
          {/* Navigation Buttons */}
          <div className="sticky bottom-4 sm:bottom-6 left-0 right-0 z-50 flex items-center justify-between gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-lg border border-gray-200 mx-3 sm:mx-4">
            <Button
              type="button"
              variant="outline"
                              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("previous")}
          </div>
            </Button>

            {renderNextButton()}
          </div>
        </form>
      </motion.div>
    </div>
  );
} 