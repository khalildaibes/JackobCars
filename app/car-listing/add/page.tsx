"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Upload, Plus,  X, Camera } from 'lucide-react';
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Card, CardContent } from "../../../components/ui/card";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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
  ShieldCheck
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import {manufacturers_hebrew} from '../../../data/manufacturers_multilingual';
const conditions = ['excellent', 'good', 'fair', 'poor'] as const;
import React from 'react';

// Move these to environment variables
const API_BASE_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=";
const YAD2_API_BASE_URL = "https://gw.yad2.co.il/car-data-gov/model-master/?licensePlate=";
const YAD2_API_BASE_URL_PRICE = "https://gw.yad2.co.il/price-list/calculate-price?";
const ALTERNATE_API_BASE_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=03adc637-b6fe-402b-9937-7c3d3afc9140&q=";
const OWNERSHIP_HISTORY_API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=bb2355dc-9ec7-4f06-9c3f-3344672171da&q=";
const VEHICLE_SPECS_API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=142afde2-6228-49f9-8a29-9b6c3a0cbe40&q=";
const DEFAULT_STORE_ID = 18; // Update if needed
const DEFAULT_PUBLISHER_ID = 1; // Update if needed

interface CarData {
  [key: string]: string;
}

interface VehicleSpecs {
  sug_degem: string;
  ramat_gimur: string;
  shnat_yitzur: string;
  degem_nm: string;
  [key: string]: string;
}

interface OwnershipRecord {
  _id: number;
  mispar_rechev: number;
  baalut_dt: number;
  baalut: string;
  rank: number;
}

interface CarPerformanceData {
  performance: {
    acceleration: string;
    top_speed: string;
    horsepower: string;
    torque: string;
    fuel_consumption_city: string;
    fuel_consumption_highway: string;
  };
  tuning: {
    tuning_potential: string;
    tuning_notes: string;
    common_upgrades: string[];
  };
  handling: {
    handling_rating: string;
    suspension_type: string;
    driving_characteristics: string;
  };
  reliability: {
    reliability_rating: string;
    common_issues: string[];
    maintenance_cost: string;
  };
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
  const STEPS = [
    'Basic Information',
    'Condition',
    'Trade-in Option',
    'Price',
    'Contact Info',
    'Upload Images',
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMethod, setInputMethod] = useState<'plate' | 'manual'>('plate');
  const [manufacturersData, setManufacturersData] = useState<ManufacturersData>(manufacturers_hebrew);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [plateNumber, setPlateNumber] = useState("");
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const [carData, setCarData] = useState<CarData | null>(null);
  const [yad2ModelInfo, setYad2ModelInfo] = useState<any | null>(null);
  const [yad2PriceInfo, setYad2PriceInfo] = useState<any | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null);
  const [showCaptchaPrompt, setShowCaptchaPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carImage, setCarImage] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<CarPerformanceData | null>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [ownershipHistory, setOwnershipHistory] = useState<OwnershipRecord[]>([]);
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleSpecs | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    handling: false,
    reliability: false,
    tuning: true
  });

  // New state for popup modal
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  
  // State for processing steps
  const [currentProcessingStep, setCurrentProcessingStep] = useState('');

  
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
    transmission: '',
    currentCondition: '',
    knownProblems: '',
    pros: '',
    cons: '',
    tradeIn: '',
    askingPrice: '',
    name: '',
    email: '',
    phone: '',
    images: [] as File[],
    manufacturerName: '',
    commercialNickname: '',
    yearOfProduction: '',
    fuelType: '',
    car_data: {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update available models when manufacturer changes
  useEffect(() => {
    if (selectedManufacturer && manufacturersData[selectedManufacturer]) {
      const models = manufacturersData[selectedManufacturer].submodels || [];
      setAvailableModels(models);
      setSelectedModel(''); // Reset model selection
      setAvailableYears([]); // Clear years until model is selected
    } else {
      setAvailableModels([]);
      setAvailableYears([]);
    }
  }, [selectedManufacturer, manufacturersData]);

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
    manufacturer_name: "manufacturer_name",
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
  const fetchCarPerformanceData = async (manufacturer: string, model: string, year: string, trim: string) => {
    try {
      // setLoadingPerformance(true);
      // const response = await fetch('/api/generate-car-information', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     manufacturer,
      //     model,
      //     year,
      //     locale,
      //     trim
      //   }),
      // });
     

      // const data = await response.json();
      // setPerformanceData(data);
    } catch (error) {
      setError(t('error_loading_info'));
    } finally {
      // setLoadingPerformance(false);
    }
  };

  const fetchOwnershipHistory = async (plateNumber: string) => {
    try {
      const response = await fetch(`${OWNERSHIP_HISTORY_API_URL}${plateNumber}`);
      const data = await response.json();
      
      if (data?.result?.records) {
        // Sort records by baalut_dt in descending order (most recent first)
        const sortedRecords = data.result.records.sort((a: OwnershipRecord, b: OwnershipRecord) => 
          b.baalut_dt - a.baalut_dt
        );
        setOwnershipHistory(sortedRecords);
      }
    } catch (error) {
      console.error("Error fetching ownership history:", error);
    }
  };

  const fetchVehicleSpecs = async (carData: CarData) => {
    try {
      // Construct query from car data
      const query = JSON.stringify([
        carData.model_type || '',
        carData.trim_level || '',
        carData.manufacturer_name || '',
        carData.year_of_production || ''
      ]);
      
      const response = await fetch(`${VEHICLE_SPECS_API_URL}${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data?.result?.records?.length) {
        const record = data.result.records[0] as Record<string, unknown>;
        const vehicleSpecs = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            key,
            String(value),
          ])
        ) as VehicleSpecs;
        setVehicleSpecs(vehicleSpecs);
      }
    } catch (error) {
      console.error("Error fetching vehicle specs:", error);
    }
  };
  async function fetchCarDataDirect(plate: string) {
    const upstreamUrl =
      `https://gw.yad2.co.il/car-data-gov/model-master/?licensePlate=${encodeURIComponent(plate)}`;
  
    // Must use credentials if upstream uses them (often not needed here)
    const r = await fetch(upstreamUrl, {
      method: "GET",
      credentials: "include",
    });
  
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Upstream ${r.status}: ${t.slice(0, 500)}`);
    }
  
    return r.json();
  }

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
    setOwnershipHistory([]);
    setVehicleSpecs(null);
    let data = null;
    let primaryData = null;
    let yad2Info: any = null;
    try {
      // First fetch with the primary API
      const response = await fetch(`${API_BASE_URL}${cleanPlateNumber}`);
      primaryData  = await response.json();
      console.log("primaryData is", primaryData);
      try {
        const yad2Res = await fetch(`/api/yad2/model-master?licensePlate=${cleanPlateNumber}`);
        if (yad2Res.ok) {
          yad2Info = await yad2Res.json();
          console.log('yad2 model-master:', yad2Info);
          setYad2ModelInfo(yad2Info);
        } else {
          let err: any = {};
          try { err = await yad2Res.json(); } catch {}
          console.warn('yad2 model-master failed', err);
          const errText = JSON.stringify(err).toLowerCase();
          if (errText.includes('radware') || errText.includes('captcha') || errText.includes('<head')) {
            // setCaptchaRequired(true);
            // const upstreamUrl = `https://gw.yad2.co.il/car-data-gov/model-master/?licensePlate=${cleanPlateNumber}`;
            // setCaptchaUrl(upstreamUrl);
            // setShowCaptchaPrompt(true);
            // Stop further processing until user solves captcha and retries
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching Yad2 data:", error);
      }
      // If no records were returned, try the alternate API
      let ascentYearOnRoad = null;
      let ascentMonthOnRoad = null;
      if (yad2Info?.data?.subModelId) {
        if (yad2Info?.data?.dateOnRoad) {
           ascentYearOnRoad = yad2Info?.data?.dateOnRoad.split('-')[0];
          ascentMonthOnRoad = yad2Info?.data?.dateOnRoad.split('-')[1];
        } else {
          ascentYearOnRoad = yad2Info?.data?.carYear;
          ascentMonthOnRoad = 1;
        }

        try {
              const priceRes = await fetch('/api/yad2/price?subModelId='+yad2Info.data.subModelId+'&kilometers=0&ascentYearOnRoad='+ascentYearOnRoad+'&ascentMonthOnRoad='+ascentMonthOnRoad);
          if (priceRes.ok) {
            const priceData = await priceRes.json();
            console.log('yad2 price:', priceData);
            setYad2PriceInfo(priceData);
          } else {
            const err = await priceRes.json().catch(() => ({}));
            console.warn('yad2 price failed', err);
          }
        } catch (err) {
          console.error('Error fetching Yad2 price:', err);
        }
      }
      if (primaryData?.result?.records?.length) {
        data = primaryData;
      } else {
        const alternateResponse = await fetch(`${ALTERNATE_API_BASE_URL}${cleanPlateNumber}`);
        data = await alternateResponse.json();
      }

      if (data?.result?.records?.length) {
        const record = data.result.records[0] as Record<string, unknown>;

        const translatedData = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            translationMap[key as keyof typeof translationMap] || key,
            String(value),
          ])
        );

        setCarData(translatedData);
        formData.car_data = translatedData;
        // Persist key fields into formData until submission
        setFormData(prev => ({
          ...prev,
          manufacturerName: String(record.manufacturer_name || translatedData.manufacturer_name || ''),
          commercialNickname: String(record.kinuy_mishari || translatedData.commercial_nickname || ''),
          yearOfProduction: String(record.shnat_yitzur || translatedData.year_of_production || ''),
          fuelType: String(record.sug_delek_nm || translatedData.fuel_type || '')
        }));
        
        // Fetch car image, performance data, and ownership history
        if (record.manufacturer_name && record.kinuy_mishari && record.shnat_yitzur) {
          await Promise.all([
            fetchCarImage(String(record.manufacturer_name), String(record.kinuy_mishari)),
            fetchCarPerformanceData(
              String(record.manufacturer_name),
              String(record.kinuy_mishari),
              String(record.shnat_yitzur),
              String(record.ramat_gimur)
            ),
            fetchOwnershipHistory(cleanPlateNumber),
            fetchVehicleSpecs(translatedData)
          ]);
        }

        // Scroll to results after data is loaded
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setCarData(null);
        setError(t("no_car_found"));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("error_fetching"));
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
  // Update formData when manufacturer and model selections change
  useEffect(() => {
    console.log('Manufacturer/Model selection changed:', { selectedManufacturer, selectedModel, availableModels });
    
    if (selectedManufacturer && selectedModel) {
      const manufacturerName = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
      const modelName = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
      
      console.log('Setting form data:', { manufacturerName, modelName });
      
      setFormData(prev => ({
        ...prev,
        makeModel: `${manufacturerName} ${modelName}`.trim(),
        manufacturerName: manufacturerName,
        commercialNickname: modelName
      }));
    }
  }, [selectedManufacturer, selectedModel, availableModels, manufacturersData]);

  // Update formData when year selection changes
  useEffect(() => {
    console.log('Year selection changed:', { selectedYear, availableYears });
    
    if (selectedYear && availableYears.length > 0) {
      console.log('Setting year in form data:', selectedYear);
      setFormData(prev => ({
        ...prev,
        year: selectedYear,
        yearOfProduction: selectedYear
      }));
    }
  }, [selectedYear, availableYears]);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('Form data updated:', {
      manufacturerName: formData.manufacturerName,
      commercialNickname: formData.commercialNickname,
      yearOfProduction: formData.yearOfProduction,
      title: formData.title,
      makeModel: formData.makeModel,
      year: formData.year
    });
  }, [formData.manufacturerName, formData.commercialNickname, formData.yearOfProduction, formData.title, formData.makeModel, formData.year]);

  // Auto-populate title when moving to next step (after step 0) and title is empty
  useEffect(() => {
    // Only auto-generate title when moving to next step (currentStep > 0) and title is empty
    if (currentStep > 0 && formData.manufacturerName && formData.commercialNickname && formData.yearOfProduction && !formData.title) {
      const newTitle = `${formData.manufacturerName} ${formData.commercialNickname} ${formData.yearOfProduction}`.trim();
      console.log('Auto-populating title after step change:', newTitle);
      setFormData(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  }, [currentStep, formData.manufacturerName, formData.commercialNickname, formData.yearOfProduction, formData.title]);

  /**
   * Helper function to get the best available data source for a field
   * Data source priority:
   * 1. Manual input (when in manual mode) - highest priority
   * 2. Yad2 API response - second priority (more detailed car info)
   * 3. Government API response - third priority (basic vehicle data)
   * 4. Fallback to manual value or empty string
   * 
   * This ensures that user input always takes precedence when in manual mode,
   * while providing intelligent fallbacks when using automatic plate search.
   */
  const getBestDataValue = (field: string, manualValue: any, apiValue: any, yad2Value: any = null) => {
    // Priority: Manual input > Yad2 API > Government API
    let result;
    
    if (inputMethod === 'manual' && manualValue) {
      result = manualValue;
    } else if (yad2Value && yad2Value !== '') {
      result = yad2Value;
    } else if (apiValue && apiValue !== '') {
      result = apiValue;
    } else {
      result = manualValue || '';
    }
    
    if (yad2Value && yad2Value !== '') {
      return yad2Value;
    }
    
    if (apiValue && apiValue !== '') {
      return apiValue;
    }
    
    return manualValue || '';
  };

  /**
   * Helper function to popzsubmitulate form data with the best available sources
   * This function intelligently combines data from multiple sources:
   * - Manual user input (highest priority)
   * - Yad2 API response (detailed car specifications)
   * - Government API response (basic vehicle registration data)
   * 
   * The function respects the current input method and ensures data consistency
   * across all form fields while maintaining user control over manual inputs.
   */
  const populateFormDataWithBestSources = () => {
    if (!carData && !yad2ModelInfo) return;

    const cd: any = carData || {};
    const yad2: any = yad2ModelInfo?.data || {};



    setFormData(prev => ({
      ...prev,
      // Basic car information - prioritize based on input method
      manufacturerName: getBestDataValue(
        'manufacturerName',
        prev.manufacturerName,
        cd.manufacturer_name || cd.manufacturer_name,
        yad2.manufacturerName
      ),
      commercialNickname: getBestDataValue(
        'commercialNickname',
        prev.commercialNickname,
        cd.commercial_nickname,
        yad2.modelName
      ),
      yearOfProduction: getBestDataValue(
        'yearOfProduction',
        prev.yearOfProduction,
        cd.year_of_production,
        yad2.year
      ),
      fuelType: getBestDataValue(
        'fuelType',
        prev.fuelType,
        cd.fuel_type,
        yad2.fuelType
      ),
      
      // Auto-populate other fields if they're empty and we have API data
      title: prev.title || `${getBestDataValue('manufacturerName', prev.manufacturerName, cd.manufacturer_name, yad2.manufacturerName) || ''} ${cd.commercial_nickname || yad2.modelName || ''} ${cd.year_of_production || yad2.year || ''}`.trim(),
      makeModel: prev.makeModel || `${getBestDataValue('manufacturerName', prev.manufacturerName, cd.manufacturer_name, yad2.manufacturerName) || ''} ${cd.commercial_nickname || yad2.modelName || ''}`.trim(),
      year: prev.year || cd.year_of_production || yad2.year || '',
      plateNumber: prev.plateNumber || cd.plate_number || '',
      
      // Keep manual inputs if they exist, otherwise use API data
      mileage: prev.mileage || cd.mileage || '',
      color: prev.color || cd.color || '',
      engineType: prev.engineType || cd.engine_type || yad2.engineType || '',
              transmission: prev.transmission || cd.transmission || yad2.transmission || '',
      currentCondition: prev.currentCondition || cd.condition || '',
      knownProblems: prev.knownProblems || cd.known_problems || '',
      pros: prev.pros || cd.pros || '',
      cons: prev.cons || cd.cons || '',
      tradeIn: prev.tradeIn || cd.trade_in || '',
      askingPrice: prev.askingPrice || cd.asking_price || '',
      name: prev.name || cd.name || '',
      email: prev.email || cd.email || '',
      phone: prev.phone || cd.phone || '',
      
      // Store the complete car data for reference
      car_data: {
        ...cd,
        yad2_data: yad2
      }
    }));
  };

  // Function to handle manual field changes - ensures manual input takes precedence
  const handleManualFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If we're in manual mode and the user changes a field, mark it as manually entered
    if (inputMethod === 'manual') {
      // This ensures the manual input takes precedence over any API data
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Function to show popup modal
  const showPopupModal = (type: 'success' | 'error', title: string, message: string) => {
    setPopupType(type);
    setPopupTitle(title);
    setPopupMessage(message);
    setShowPopup(true);
  };

  // Function to close popup modal
  const closePopupModal = () => {
    setShowPopup(false);
    setPopupMessage('');
    setPopupTitle('');
  };

  // Effect to populate form data when car data or Yad2 info changes
  useEffect(() => {
    if (carData || yad2ModelInfo) {
      populateFormDataWithBestSources();
    }
  }, [carData, yad2ModelInfo, inputMethod]);

  // Effect to clear auto-populated data when switching to manual mode
  useEffect(() => {
    if (inputMethod === 'manual') {
      // Keep user-entered data but clear auto-populated fields
      setFormData(prev => ({
        ...prev,
        // Clear fields that were auto-populated from API
        title: prev.title || '',
        makeModel: prev.makeModel || '',
        year: prev.year || '',
        plateNumber: prev.plateNumber || '',
        mileage: prev.mileage || '',
        color: prev.color || '',
        engineType: prev.engineType || '',
        transmission: prev.transmission || '',
        currentCondition: prev.currentCondition || '',
        knownProblems: prev.knownProblems || '',
        pros: prev.pros || '',
        cons: prev.cons || '',
        tradeIn: prev.tradeIn || '',
        askingPrice: prev.askingPrice || '',
        name: prev.name || '',
        email: prev.email || '',
        phone: prev.phone || ''
      }));
    } else if (inputMethod === 'plate') {
      // When switching back to plate mode, try to populate with available API data
      if (carData || yad2ModelInfo) {
        populateFormDataWithBestSources();
      }
    }
  }, [inputMethod]);

  // Function to auto-generate title when moving to next step
  const autoGenerateTitleIfEmpty = () => {
    if (!formData.title && selectedManufacturer && selectedModel && selectedYear) {
      const manufacturerName = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
      const newTitle = `${manufacturerName} ${selectedModel} ${selectedYear}`.trim();
      console.log('Auto-generating title on step change:', newTitle);
      setFormData(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  };

  // Function to handle input method change
  const handleInputMethodChange = (method: 'plate' | 'manual') => {
    setInputMethod(method);
    
    if (method === 'manual') {
      // Clear API-related data when switching to manual mode
      setCarData(null);
      setYad2ModelInfo(null);
      setError(null);
      
      // Reset form to manual input mode
      setFormData(prev => ({
        ...prev,
        // Keep only user-entered data, clear auto-populated fields
        manufacturerName: '',
        commercialNickname: '',
        yearOfProduction: '',
        fuelType: '',
        // Keep other user inputs
        title: prev.title || '',
        makeModel: prev.makeModel || '',
        year: prev.year || '',
        plateNumber: prev.plateNumber || '',
        mileage: prev.mileage || '',
        color: prev.color || '',
        engineType: prev.engineType || '',
        transmission: prev.transmission || '',
        currentCondition: prev.currentCondition || '',
        knownProblems: prev.knownProblems || '',
        pros: prev.pros || '',
        cons: prev.cons || '',
        tradeIn: prev.tradeIn || '',
        askingPrice: prev.askingPrice || '',
        name: prev.name || '',
        email: prev.email || '',
        phone: prev.phone || '',
        images: prev.images,
        car_data: {}
      }));
    } else if (method === 'plate') {
      // When switching to plate mode, clear manual inputs and try to populate with API data
      setFormData(prev => ({
        ...prev,
        // Clear manual input fields
        manufacturerName: '',
        commercialNickname: '',
        yearOfProduction: '',
        fuelType: '',
        title: '',
        makeModel: '',
        year: '',
        plateNumber: '',
        // Keep other user inputs
        mileage: prev.mileage || '',
        color: prev.color || '',
        engineType: prev.engineType || '',
        transmission: prev.transmission || '',
        currentCondition: prev.currentCondition || '',
        knownProblems: prev.knownProblems || '',
        pros: prev.pros || '',
        cons: prev.cons || '',
        tradeIn: prev.tradeIn || '',
        askingPrice: prev.askingPrice || '',
        name: prev.name || '',
        email: prev.email || '',
        phone: prev.phone || '',
        images: prev.images,
        car_data: {}
      }));
      
      // Try to populate with available API data
      if (carData || yad2ModelInfo) {
        populateFormDataWithBestSources();
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    console.log('Validating form with data:', formData);
    console.log('Current dropdown selections:', { selectedManufacturer, selectedModel, selectedYear });
    
    // Ensure form data is populated with the best available sources before validation
    if (carData || yad2ModelInfo) {
      populateFormDataWithBestSources();
    }
    
    // Validate required fields
    if (!formData.title) {
      newErrors.title = t('validation_required');
      console.log('Title validation failed - current value:', formData.title);
    }
    if (!formData.manufacturerName) {
      newErrors.manufacturer = t('validation_required');
      console.log('Manufacturer validation failed - current value:', formData.manufacturerName);
    }
    if (!formData.commercialNickname) {
      newErrors.model = t('validation_required');
      console.log('Model validation failed - current value:', formData.commercialNickname);
    }
    if (!formData.yearOfProduction) {
      newErrors.year = t('validation_required');
      console.log('Year validation failed - current value:', formData.yearOfProduction);
    }
    // Plate number validation: required only in automatic/plate mode
    if (inputMethod === 'plate') {
      if (!formData.plateNumber || formData.plateNumber.trim() === '') {
        newErrors.plateNumber = t('validation_required') || 'Plate number is required when using automatic search';
        console.log('Plate number validation failed - required in plate mode, current value:', formData.plateNumber);
      } else if (!carData) {
        newErrors.plateNumber = t('validation_required') || 'Plate number must be found in the system';
        console.log('Plate number validation failed - plate not found in system');
      }
    } else {
      // In manual mode, plate number is optional
      console.log('Plate number validation skipped - manual mode, current value:', formData.plateNumber);
    }
    // Email is not required
    // if (!formData.email) {
    //   newErrors.email = t('validation_required');
    //   console.log('Email validation failed - current value:', formData.email);
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = t('validation_email');
    //   console.log('Email format validation failed - current value:', formData.email);
    // }
    
    // Phone validation: Israeli phone number format
    if (!formData.phone) {
      newErrors.phone = t('validation_required');
      console.log('Phone validation failed - current value:', formData.phone);
    } else {
      // Israeli phone number validation: +972-XX-XXXXXXX or 05X-XXXXXXX or 0X-XXXXXXX
      const israeliPhoneRegex = /^(\+972-?|0)?5[0-9]-?[0-9]{7}$|^(\+972-?|0)?[2-4][0-9]-?[0-9]{7}$/;
      if (!israeliPhoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = t('validation_phone_invalid') || 'Please enter a valid Israeli phone number';
        console.log('Phone validation failed - invalid Israeli format:', formData.phone);
      }
    }
    if (!formData.images.length) {
      newErrors.images = t('validation_images');
      console.log('Images validation failed - current count:', formData.images.length);
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPlateNumber(e.target.value);
    setPlateNumber(formattedValue);
    setFormData(prev => ({ ...prev, plateNumber: formattedValue }));
    setError(null);
  };

  // Also update formData.plateNumber when plateNumber state changes (for the plate search input)
  useEffect(() => {
    setFormData(prev => ({ ...prev, plateNumber: plateNumber }));
  }, [plateNumber]);
  const uploadImages = async (files: File[]) => {
  //   const uploadPromises = files.map(async (file) => {
  //     const formData = new FormData();
  //     formData.append('files', file);
      
  //     try {
  //       const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //       return response.data[0].id; // Return the uploaded file ID
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       throw error;
  //     }
  //   }
  // );

    // return Promise.all(uploadPromises);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current form data:', formData);
    
    setCurrentProcessingStep(t('validating_form') || 'Validating form...');
    if (!validateForm()) {
      console.log('Form validation failed');
      setCurrentProcessingStep('');
      return;
    }

    console.log('Form validation passed, starting submission');
    setIsSubmitting(true);

    try {
      // First upload all images
      // const imageIds = await uploadImages(formData.images);

      // Format the car details object per requested structure
      // Use the best available data sources based on input method
      const cd: any = (formData as any).car_data || {};
      const yad2Data: any = cd.yad2_data || {};
      
      const composedName = [
        getBestDataValue('manufacturerName', formData.manufacturerName, cd.manufacturer_name, yad2Data.manufacturerName),
        getBestDataValue('commercialNickname', formData.commercialNickname, cd.commercial_nickname, yad2Data.modelName),
        getBestDataValue('yearOfProduction', formData.yearOfProduction, cd.year_of_production, yad2Data.year),
        getBestDataValue('fuelType', formData.fuelType, cd.fuel_type, yad2Data.fuelType),
      ]
        .filter(Boolean)
        .join(' ');

      // Upload image if present
      let imageId = null;
      if (formData.images && formData.images.length > 0) {
        try {
          setCurrentProcessingStep(t('uploading_image') || 'Uploading image...');
          console.log("Uploading image...");
          const formDataToSend = new FormData();
          formDataToSend.append('image', formData.images[0]);
          
          const imagesupload_response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formDataToSend
          });
          
          console.log("imagesupload_response is", imagesupload_response);
          if (imagesupload_response.ok) {
            const uploadResult = await imagesupload_response.json();
            // Handle different possible Strapi response structures
            imageId = uploadResult[0].id;
            console.log("Extracted imageId is", imageId);
          } else {
            console.error("Image upload failed:", imagesupload_response.statusText);
            // Continue without image if upload fails
            imageId = null;
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue without image if upload fails
          imageId = null;
        }
      }

      // Prepare car details
      setCurrentProcessingStep(t('preparing_data') || 'Preparing car details...');
      const carDetails = {
        car: {
          // Basic car information
          fuel: getBestDataValue('fuelType', formData.fuelType, cd.fuel_type, yad2Data.fuelType) || '',
          name: composedName,
          year: String(getBestDataValue('yearOfProduction', formData.yearOfProduction, cd.year_of_production, yad2Data.year) || ''),
          miles: String(formData.mileage || ''),
          price: parseFloat(formData.askingPrice) || 0,
          
          // Owner information
          owner_name: formData.name || '',
          owner_email: formData.email || '',
          owner_phone: formData.phone || '',
          
          // Car specifications
          plate_number: formData.plateNumber || '',
          color: formData.color || '',
          engine_type: formData.engineType || '',
          condition: formData.currentCondition || '',
          known_problems: formData.knownProblems || '',
          trade_in: formData.tradeIn || '',
          asking_price: formData.askingPrice || '',
          
          // Manufacturer information
          manufacturer_name: getBestDataValue('manufacturerName', formData.manufacturerName, cd.manufacturer_name, yad2Data.manufacturerName) || '',
          commercial_nickname: getBestDataValue('commercialNickname', formData.commercialNickname, cd.commercial_nickname, yad2Data.modelName) || '',
          year_of_production: getBestDataValue('yearOfProduction', formData.yearOfProduction, cd.year_of_production, yad2Data.year) || '',
          fuel_type: getBestDataValue('fuelType', formData.engineType, cd.fuel_type, yad2Data.fuelType) || '',
          trim_level: cd.trim_level || yad2Data.trimLevel || '',
          body_type: cd.body_type || yad2Data.bodyType || '',
          transmission: formData.transmission || '',
          
          // Images
          images: imageId ? {
            main: [imageId],
            additional: [imageId],
          } : {},
          
          // Pros and Cons
          pros: formData.pros || '',
          cons: formData.cons || '',
          
          // Features array for display
          features: [
            {  'address': '' }, //String(formData.address || '')
            {  'makeModel': String(formData.makeModel || '') },
            {  'yearOfProduction': String(getBestDataValue('yearOfProduction', formData.yearOfProduction, cd.year_of_production, yad2Data.year) || '') },
            {  'plateNumber': String(formData.plateNumber || '') },
            {  'mileage': String(formData.mileage || '') },
            {  'color': String(formData.color || '') },
            {  'engineType': String(formData.engineType || '') },
            {  'transmission': String(formData.transmission || '') },
            {  'currentCondition': String(formData.currentCondition || '') },
            {  'knownProblems': String(formData.knownProblems || '') },
            {  'pros': String(formData.pros || '') },
            {  'cons': String(formData.cons || '') },
            {  'tradeIn': String(formData.tradeIn || '') },
            {  'askingPrice': String(formData.askingPrice || '') },
            {  'name': String(formData.name || '') },
            {  'email': String(formData.email || '') },
            {  'phone': String(formData.phone || '') },
            {  'fuelType': String(getBestDataValue('fuelType', formData.engineType, cd.fuel_type, yad2Data.fuelType) || '') },
            ...(imageId ? [{  'image': imageId }] : []),
          ],
          
          // Description
          description: `${getBestDataValue('manufacturerName', formData.manufacturerName, cd.manufacturer_name, yad2Data.manufacturerName) || ''} ${getBestDataValue('commercialNickname', formData.commercialNickname, cd.commercial_nickname, yad2Data.modelName) || ''} ${getBestDataValue('yearOfProduction', formData.yearOfProduction, cd.year_of_production, yad2Data.year) || ''}`.trim(),
        }
      };

      // Send to our new API endpoint
      setCurrentProcessingStep(t('submitting_listing') || 'Submitting car listing...');
      const response = await fetch('/api/addListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carDetails)
      });

      console.log("Final API response:", response);
      if (response.ok) {
        const responseData = await response.json();
        console.log("Final API response data:", responseData);
        showPopupModal('success', t('success_title') || 'Success!', t('success_message'));
        // Reset form
        setFormData({
          title: '',
          makeModel: '',
          year: '',
          plateNumber: '',
          mileage: '',
          color: '',
          engineType: '',
          transmission: '',
          currentCondition: '',
          knownProblems: '',
          pros: '',
          cons: '',
          tradeIn: '',
          askingPrice: '',
          name: '',
          email: '',
          phone: '',
          images: [],
          manufacturerName: '',
          commercialNickname: '',
          yearOfProduction: '',
          fuelType: '',
          car_data: {}
        });
        setSelectedManufacturer('');
        setSelectedModel('');
        setAvailableModels([]);
        setAvailableYears([]);
        setErrors(prev => ({ ...prev, manufacturer: '', model: '' }));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showPopupModal('error', t('error_title') || 'Error!', t('error_message'));
    } finally {
      setIsSubmitting(false);
      setCurrentProcessingStep('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)].slice(0, 8) // Limit to 8 images
      }));
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-[5%] py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('add_car_listing')}</h1>
            <p className="text-gray-600">{t('fill_details')}</p>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Debug Info:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Current Step: {currentStep} / {STEPS.length - 1}</div>
            <div>Step Name: {STEPS[currentStep]}</div>
            <div>Is Last Step: {currentStep === STEPS.length - 1 ? 'Yes' : 'No'}</div>
            <div>Input Method: <span className={`font-semibold ${inputMethod === 'plate' ? 'text-blue-600' : 'text-green-600'}`}>{inputMethod === 'plate' ? 'Automatic (Plate Search)' : 'Manual Entry'}</span></div>
            <div>Form Data Keys: {Object.keys(formData).filter(key => formData[key as keyof typeof formData]).join(', ')}</div>
            <div>Required Fields Status:</div>
            <div className="ml-4">
              <div>Title: {formData.title ? '✓' : '✗'} "{formData.title}"</div>
              <div>Manufacturer: {formData.manufacturerName ? '✓' : '✗'} "{formData.manufacturerName}"</div>
              <div>Model: {formData.commercialNickname ? '✓' : '✗'} "{formData.commercialNickname}"</div>
              <div>Year: {formData.yearOfProduction ? '✓' : '✗'} "{formData.yearOfProduction}"</div>
              <div>Plate: {inputMethod === 'plate' ? (formData.plateNumber ? '✓' : '✗') : 'Optional'} "{formData.plateNumber}" {inputMethod === 'plate' && !carData && formData.plateNumber ? '(Not found in system)' : ''}</div>
              <div>Email: {formData.email || 'Optional'} "{formData.email}"</div>
              <div>Phone: {formData.phone ? '✓' : '✗'} "{formData.phone}"</div>
              <div>Images: {formData.images.length > 0 ? '✓' : '✗'} ({formData.images.length})</div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div>Car Data Available: {carData ? '✓ Yes' : '✗ No'}</div>
              <div>Yad2 Data Available: {yad2ModelInfo ? '✓ Yes' : '✗ No'}</div>
            </div>
          </div>
        </div>

        {/* Steps indicator (clickable) */}
        <div className="mb-8">
          <ol className="flex items-center text-xs sm:text-sm text-gray-700 gap-2 overflow-hidden" role="list">
            {STEPS.map((_, index) => (
              <li key={index} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    currentStep === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  aria-current={currentStep === index ? 'step' : undefined}
                  aria-label={`Step ${index + 1}`}
                >
                  {index + 1}
                </button>
                {index < STEPS.length - 1 && (
                  <span className="w-6 sm:w-8 h-px bg-gray-300 mx-2" aria-hidden="true"></span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          {currentStep === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('basic_information')}</h2>
            
            {/* Input Method Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-center bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => handleInputMethodChange('plate')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    inputMethod === 'plate'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Car className="h-5 w-5" />
                    {t('search_by_plate') || 'Search by Plate Number'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputMethodChange('manual')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    inputMethod === 'manual'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t('enter_manually') || 'Enter Manually'}
                  </div>
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('title') || 'Title'} <span className="text-gray-500">(Auto-generated when you move to next step if left empty)</span>
              </label>
              <Input
                placeholder={t('title_placeholder') || 'Enter car title or leave empty for auto-generation on next step'}
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  setErrors(prev => ({ ...prev, title: '' }));
                }}
                className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              {!formData.title && selectedManufacturer && selectedModel && selectedYear && (
                <p className="mt-2 text-sm text-blue-600">
                  💡 Title will be auto-generated as "{manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer} {selectedModel} {selectedYear}" when you click Next
                </p>
              )}
            </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('mileage') || 'Mileage'} <span className="text-gray-500">(in kilometers)</span>
                  </label>
                  <Input
                    placeholder={t('mileage') || 'Enter mileage in kilometers'}
                    value={formData.mileage}
                    onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                    className={`mb-6 rounded-xl py-5 ${errors.mileage ? 'border-red-500' : ''}`}
                  />
                  {errors.mileage && <p className="mt-1 text-sm text-red-500">{errors.mileage}</p>}
                </div>
            {/* Plate Number Input Method */}
            {inputMethod === 'plate' && (
              <div className="space-y-6">
                <div className="w-full max-w-xl mx-auto">
                  <div className="relative">
                    <div className="relative flex items-center bg-[#ffca11] rounded shadow-lg p-2">
                      <div className="flex items-center gap-4">
                        <img 
                          src="/a1.png" 
                          alt={t("logo_alt")} 
                          width={40} 
                          height={50} 
                          className="object-fill w-[60px] md:w-[80px] p-[2px]" 
                        />
                      </div>
                      <Input
                        type="text"
                        value={plateNumber}
                        onChange={handlePlateNumberChange}
                        placeholder={t("enter_plate")}
                        className="w-full px-4 sm:px-6 py-4 sm:py-8 text-xl sm:text-2xl md:text-3xl font-black tracking-[0.1em] bg-transparent border-0 focus:ring-0 text-center uppercase"
                        maxLength={10}
                        style={{
                          letterSpacing: '0.1em',
                          fontFamily: 'monospace',
                          lineHeight: '1',
                          WebkitTextStroke: '1px black',
                          textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 px-4 w-full justify-center pt-4">
                      <Button 
                        onClick={fetchCarData} 
                        disabled={loading}
                        className="rounded-full w-50 text-black h-12 hover:bg-blue-700 transition-colors bg-[#ffca11]"
                      >
                        {t("search_by_vin")}
                      </Button>
                    </div>

                    {showCaptchaPrompt && captchaRequired && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-700 font-semibold mb-2">Robot check required</p>
                        <p className="text-sm text-red-700 mb-4">Please complete the captcha challenge to continue.</p>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            type="button"
                            onClick={() => {
                              if (captchaUrl) {
                                const popup = window.open(captchaUrl, 'captchaPopup', 'width=480,height=720');
                                if (popup) {
                                  popup.focus();
                                }
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Open to see data.
                          </Button>
                          <Button
                            type="button"
                            onClick={async () => {
                              try {
                                setShowCaptchaPrompt(false);
                                setLoading(true);
                                const data = await fetchCarDataDirect(plateNumber);
                                setYad2ModelInfo(data);
                              } catch (e) {
                                console.error(e);
                                // fallback UI
                              } finally {
                                setLoading(false);
                              }
                            }}
                            variant="outline"
                          >
                            I completed it, retry
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Yad2 Price Heatmap and Details */}
                    {(yad2PriceInfo?.data || yad2ModelInfo?.data) && (
                      <div className="mt-6 space-y-4">
                        {yad2PriceInfo?.data && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
                              <span>Min {Number(yad2PriceInfo.data.minPrice).toLocaleString()}</span>
                              <span>Predicted {Number(yad2PriceInfo.data.predictedPrice).toLocaleString()}</span>
                              <span>Max {Number(yad2PriceInfo.data.maxPrice).toLocaleString()}</span>
                            </div>
                            <div className="mt-3">
                              <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" aria-label="Price heatmap" />
                              {(() => {
                                const min = Number(yad2PriceInfo.data.minPrice) || 0;
                                const max = Number(yad2PriceInfo.data.maxPrice) || 0;
                                const pred = Number(yad2PriceInfo.data.predictedPrice) || 0;
                                const range = Math.max(max - min, 1);
                                const pct = Math.min(100, Math.max(0, ((pred - min) / range) * 100));
                                return (
                                  <div className="relative h-6">
                                    <div className="absolute top-0 -mt-2" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                                      <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow" />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Accuracy: {String(yad2PriceInfo.data.accuracyId)}
                            </div>
                          </div>
                        )}

                        {yad2ModelInfo?.data && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-gray-800">Yad2</h4>
                              <span className="text-xs text-gray-500">model</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {yad2ModelInfo.data.carTitle && (
                                <div>
                                  <div className="text-xs text-gray-500">Car</div>
                                  <div className="font-medium text-gray-900">{yad2ModelInfo.data.carTitle}</div>
                                </div>
                              )}
                              {yad2ModelInfo.data.subModelTitle && (
                                <div>
                                  <div className="text-xs text-gray-500">Submodel</div>
                                  <div className="font-medium text-gray-900">{yad2ModelInfo.data.subModelTitle}</div>
                                </div>
                              )}
                              {yad2ModelInfo.data.carYear && (
                                <div>
                                  <div className="text-xs text-gray-500">Year</div>
                                  <div className="font-medium text-gray-900">{yad2ModelInfo.data.carYear}</div>
                                </div>
                              )}
                              {yad2ModelInfo.data.owner && (
                                <div>
                                  <div className="text-xs text-gray-500">Owner</div>
                                  <div className="font-medium text-gray-900">{yad2ModelInfo.data.owner}</div>
                                </div>
                              )}
                              {yad2ModelInfo.data.tokefTestDate && (
                                <div>
                                  <div className="text-xs text-gray-500">Test Valid Until</div>
                                  <div className="font-medium text-gray-900">{yad2ModelInfo.data.tokefTestDate}</div>
                                </div>
                              )}
                              {yad2ModelInfo.data.yad2CarTitle && (
                                <div>
                                  <div className="text-xs text-gray-500">Color</div>
                                  <div className="font-medium text-gray-900">{yad2ModelInfo.data.yad2CarTitle}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Section */}
                <div ref={resultsRef} className="container mx-auto px-4 py-8 scroll-mt-8">
                  {error && (
                    <Alert variant="destructive" className="mb-8">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {carData && !loading && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500">{t('manufacturer_name')}</div>
                            <div className="font-medium text-gray-900">{carData.manufacturer_name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">{t('commercial_nickname')}</div>
                            <div className="font-medium text-gray-900">{carData.commercial_nickname}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">{t('year_of_production')}</div>
                            <div className="font-medium text-gray-900">{carData.year_of_production}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">{t('fuel_type')}</div>
                            <div className="font-medium text-gray-900">{carData.fuel_type}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Manual Entry Method */}
            {inputMethod === 'manual' && (
              <div className="space-y-4">
                
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('manufacturer') || 'Manufacturer'} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedManufacturer}
                      onValueChange={(value) => {
                        if (value && manufacturersData[value]) {
                          const models = manufacturersData[value].submodels || [];
                          setAvailableModels(models);
                          setSelectedModel(''); // Reset model selection
                          setAvailableYears([]); // Clear years until model is selected
                        } else {
                          setAvailableModels([]);
                          setAvailableYears([]);
                        }
                        setSelectedManufacturer(value);
                        setErrors(prev => ({ ...prev, manufacturer: '' }));
                      }}
                    >
                      <SelectTrigger className="rounded-xl py-5">
                        <SelectValue placeholder={t('select_manufacturer') || 'Select Manufacturer'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {Object.keys(manufacturersData).length === 0 ? (
                          <SelectItem value="loading_manufacturers" disabled>
                            Loading manufacturers...
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('model') || 'Model'} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedModel}
                      onValueChange={(value) => {
                        setSelectedModel(value);
                        setErrors(prev => ({ ...prev, model: '' }));
                      }}
                      disabled={!selectedManufacturer || availableModels.length === 0}
                    >
                      <SelectTrigger className="rounded-xl py-5">
                        <SelectValue placeholder={t('select_model') || 'Select Model'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {!selectedManufacturer ? (
                          <SelectItem value="no_models_available" disabled>
                            Select manufacturer first
                          </SelectItem>
                        ) : availableModels.length === 0 ? (
                          <SelectItem value="no_models_available" disabled>
                            No models available
                          </SelectItem>
                        ) : (
                          availableModels.map((model) => (
                            <SelectItem key={model.id} value={model.title?.toString()}>
                              {model.title || 'Unknown Model'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('year') || 'Year'} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedYear}
                      onValueChange={(value) => {
                        setSelectedYear(value);
                        setFormData(prev => ({ ...prev, year: value }));
                        setErrors(prev => ({ ...prev, year: '' }));
                      }}
                      disabled={!selectedManufacturer || !selectedModel || availableYears.length === 0}
                    >
                      <SelectTrigger className={`rounded-xl py-5 ${errors.year ? 'border-red-500' : ''}`}>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('plate_number') || 'Plate Number'} <span className="text-gray-500">(Optional)</span>
                    </label>
                    <Input
                      placeholder={t('plate_number') || 'Enter plate number'}
                      value={formData.plateNumber}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, plateNumber: e.target.value }));
                        setErrors(prev => ({ ...prev, plateNumber: '' }));
                      }}
                      className={`rounded-xl py-5 ${errors.plateNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.plateNumber && <p className="mt-1 text-sm text-red-500">{errors.plateNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('color') || 'Color'} <span className="text-gray-500">(Optional)</span>
                    </label>
                    <Input
                      placeholder={t('color') || 'Enter car color'}
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="rounded-xl py-5"
                    />
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('engine_type') || 'Engine Type'} <span className="text-gray-500">(Optional)</span>
                    </label>
                    <Select
                      value={formData.engineType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, engineType: value }))}
                    >
                      <SelectTrigger className="rounded-xl py-5 text-black">
                        <SelectValue placeholder={t('engine_type') || 'Select engine type'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {['petrol', 'gasoline', 'diesel', 'electric', 'hybrid'].map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`fuel_types.${type}`) || type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('transmission') || 'Transmission'} <span className="text-gray-500">(Optional)</span>
                    </label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                    >
                      <SelectTrigger className="rounded-xl py-5 text-black">
                        <SelectValue placeholder={t('select_transmission') || 'Select transmission'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="automatic">{t('transmission_automatic') || 'Automatic'}</SelectItem>
                        <SelectItem value="manual">{t('transmission_manual') || 'Manual'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          )}

          {/* Condition */}
          {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('condition')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('current_condition') || 'Current Condition'} <span className="text-gray-500">(Optional)</span>
                </label>
                <Select
                  value={formData.currentCondition}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currentCondition: value }))}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('current_condition') || 'Select condition'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {t(`condition_${condition}`) || condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Textarea
                  placeholder={t('known_problems') || 'Known Problems (Optional)'}
                  value={formData.knownProblems}
                  onChange={(e) => setFormData(prev => ({ ...prev, knownProblems: e.target.value }))}
                  className="rounded-xl py-4 min-h-[100px]"
                />
              </div>
            </div>
          </motion.div>
          )}

          {/* Trade-in Option */}
          {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('trade_in_option')}</h2>
            <div className="space-y-6">
              <RadioGroup
                value={formData.tradeIn}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tradeIn: value }))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">{t('yes')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">{t('no')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe">{t('maybe')}</Label>
                </div>
              </RadioGroup>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pros') || 'Pros'} <span className="text-gray-500">(Will be auto-generated if left empty)</span>
                </label>
                <Textarea
                  placeholder={t('pros_placeholder') || 'Enter pros manually or leave empty for AI generation'}
                  value={formData.pros}
                  onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                  className="rounded-xl py-4 min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cons') || 'Cons'} <span className="text-gray-500">(Will be auto-generated if left empty)</span>
                </label>
                <Textarea
                  placeholder={t('cons_placeholder') || 'Enter cons manually or leave empty for AI generation'}
                  value={formData.cons}
                  onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                  className="rounded-xl py-4 min-h-[100px]"
                />
              </div>
            </div>
          </motion.div>
          )}



          {/* Price */}
          {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('price')}</h2>
            {yad2PriceInfo?.data && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
                        <span>Min {Number(yad2PriceInfo.data.minPrice).toLocaleString()}</span>
                        <span>Predicted {Number(yad2PriceInfo.data.predictedPrice).toLocaleString()}</span>
                        <span>Max {Number(yad2PriceInfo.data.maxPrice).toLocaleString()}</span>
                      </div>
                      <div className="mt-3">
                        <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" aria-label="Price heatmap" />
                        {(() => {
                          const min = Number(yad2PriceInfo.data.minPrice) || 0;
                          const max = Number(yad2PriceInfo.data.maxPrice) || 0;
                          const pred = Number(yad2PriceInfo.data.predictedPrice) || 0;
                          const range = Math.max(max - min, 1);
                          const pct = Math.min(100, Math.max(0, ((pred - min) / range) * 100));
                          return (
                            <div className="relative h-6">
                              <div className="absolute top-0 -mt-2" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                                <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow" />
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Accuracy: {String(yad2PriceInfo.data.accuracyId)}
                      </div>
                    </div>
                  )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('asking_price') || 'Asking Price'} <span className="text-gray-500">(in Israeli Shekels)</span>
              </label>
              <Input
                placeholder={t('asking_price_placeholder') || 'Enter your asking price'}
                type="number"
                value={formData.askingPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
                className="w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
          )}

          {/* Contact Info */}
          {currentStep === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('contact_info')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('name') || 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t('name_placeholder') || 'Enter your full name'}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email') || 'Email Address'} <span className="text-gray-500">(Optional)</span>
                </label>
                <Input
                  placeholder={t('email_placeholder') || 'Enter your email address'}
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone') || 'Phone Number'} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t('phone_placeholder') || 'Enter your phone number'}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </motion.div>
          )}

          {/* Image Upload */}
          {currentStep === 5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('upload_images')}</h2>
            <div className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 hover:border-blue-500 ${errors.images ? 'border-red-500' : 'border-gray-200'}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="bg-blue-50 rounded-full p-4 mb-4">
                  <Camera className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">{t('drag_drop')}</p>
                <p className="text-sm text-gray-500">{t('image_requirements')}</p>
              </label>
              
              {errors.images && <p className="mt-2 text-sm text-red-500 text-center">{errors.images}</p>}
              
              {formData.images.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {formData.images.map((file, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={t('image_preview', { number: index + 1 })}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label={t('remove_image')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="px-6"
            >
              Previous
            </Button>

            {currentStep < STEPS.length - 1 && (
              <Button
                type="button"
                onClick={() => {
                  // Auto-generate title if moving from step 0 and title is empty
                  if (currentStep === 0) {
                    autoGenerateTitleIfEmpty();
                  }
                  setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
                }}
                className="px-6"
              >
                Next
              </Button>
            )}
          </div>

          {/* Submit Button */}
          {currentStep === STEPS.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg"
          >
            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('submitting') || 'Submitting...'}</span>
                </div>
              ) : (
                t('submit_listing')
              )}
            </Button>
          </motion.div>
          )}

          {/* Temporary Submit Button for Testing - Always Visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-4 bg-yellow-100/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-yellow-400"
          >
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Testing Submit...</span>
                </div>
              ) : (
                'TEST SUBMIT (Always Visible)'
              )}
            </Button>
          </motion.div>
        </form>

        {/* Loading Overlay */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
            >
              <div className="bg-blue-100 rounded-full p-4 mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('processing') || 'Processing...'}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentProcessingStep || t('processing_description') || 'Please wait while we process your car listing. This may take a few moments.'}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Popup Modal */}
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closePopupModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl ${
                popupType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${
                  popupType === 'success' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {popupType === 'success' ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : (
                    <AlertCircle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    popupType === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {popupTitle}
                  </h3>
                </div>
              </div>
              
              <p className={`text-gray-700 mb-6 ${
                popupType === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {popupMessage}
              </p>
              
              <div className="flex justify-end">
                <Button
                  onClick={closePopupModal}
                  className={`px-6 py-2 ${
                    popupType === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {t('close') || 'Close'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 