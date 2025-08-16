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
    const [manufacturersData, setManufacturersData] = useState<ManufacturersData>(manufacturers_hebrew);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
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
          manufacturerName: String(record.tozeret_nm || translatedData.manufacturer_name || ''),
          commercialNickname: String(record.kinuy_mishari || translatedData.commercial_nickname || ''),
          yearOfProduction: String(record.shnat_yitzur || translatedData.year_of_production || ''),
          fuelType: String(record.sug_delek_nm || translatedData.fuel_type || '')
        }));
        
        // Fetch car image, performance data, and ownership history
        if (record.tozeret_nm && record.kinuy_mishari && record.shnat_yitzur) {
          await Promise.all([
            fetchCarImage(String(record.tozeret_nm), String(record.kinuy_mishari)),
            fetchCarPerformanceData(
              String(record.tozeret_nm),
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
  // Update formData.makeModel when both manufacturer and model are selected
  useEffect(() => {
    if (selectedManufacturer && selectedModel) {
      const manufacturerName = manufacturersData[selectedManufacturer]?.manufacturerImage ? 
        Object.keys(manufacturersData).find(key => key === selectedManufacturer) : selectedManufacturer;
      const modelName = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
      
      setFormData(prev => ({
        ...prev,
        makeModel: `${manufacturerName} ${modelName}`.trim()
      }));
    }
  }, [selectedManufacturer, selectedModel, availableModels, manufacturersData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Fill formData fields from carData if they are undefined or empty
    if (carData) {
      if (!formData.title) formData.title = `${carData.manufacturer_name || ""} ${carData.commercial_nickname || ""} ${carData.year_of_production || ""}`.trim();
      if (!formData.makeModel) formData.makeModel = `${carData.manufacturer_name || ""} ${carData.model_name || ""}`.trim();
      if (!formData.mileage) formData.mileage = carData.mileage;
      if (!formData.color) formData.color = carData.color;
      if (!formData.engineType) formData.engineType = carData.engine_type;
      if (!formData.transmission) formData.transmission = carData.transmission;
      if (!formData.currentCondition) formData.currentCondition = carData.condition;
      if (!formData.knownProblems) formData.knownProblems = carData.known_problems;
      if (!formData.pros) formData.pros = carData.pros;
      if (!formData.cons) formData.cons = carData.cons;
      if (!formData.tradeIn) formData.tradeIn = carData.trade_in;
      if (!formData.askingPrice) formData.askingPrice = carData.asking_price;
      if (!formData.name) formData.name = carData.name;
      if (!formData.email) formData.email = carData.email;
      if (!formData.phone) formData.phone = carData.phone;
      if (!formData.manufacturerName) formData.manufacturerName = carData.manufacturer_name;
      if (!formData.commercialNickname) formData.commercialNickname = carData.commercial_nickname;
      if (!formData.yearOfProduction) formData.yearOfProduction = carData.year_of_production;
      if (!formData.fuelType) formData.fuelType = carData.fuel_type;
      if (!formData.car_data) formData.car_data = carData;
      if (!formData.plateNumber) formData.plateNumber = carData.plate_number;
      if (!formData.year) formData.year = carData.year_of_production;
    }
         formData.title = carData.manufacturer_name + ' ' + carData.commercial_nickname + ' ' + carData.year_of_production + (carData.trim_level || '');
    formData.makeModel = carData.manufacturer_name + ' ' + carData.commercial_nickname;
    formData.mileage = formData.mileage ?? carData.mileage;
    formData.color = formData.color ?? carData.color;
    formData.engineType = formData.engineType ?? carData.engine_type;
    formData.transmission = formData.transmission ?? carData.transmission;
    formData.currentCondition = formData.currentCondition ?? carData.condition;
    formData.knownProblems = formData.knownProblems ?? carData.known_problems;
    formData.pros =  formData.pros ?? carData.pros;
    formData.cons = formData.cons ?? carData.cons;
    formData.tradeIn = formData.tradeIn ?? carData.trade_in;
    formData.askingPrice = formData.askingPrice ?? carData.asking_price;
    formData.name = formData.name ?? carData.name;
    formData.email = formData.email ?? carData.email;
    formData.phone = formData.phone ?? carData.phone;
    formData.manufacturerName = formData.manufacturerName ?? carData.manufacturer_name;
    formData.commercialNickname = formData.commercialNickname ?? carData.commercial_nickname;
    formData.yearOfProduction = formData.yearOfProduction ?? carData.year_of_production;
    formData.fuelType = formData.fuelType ?? carData.fuel_type;
    formData.car_data = formData.car_data ?? carData;
    // console.log("formData is", formData);
    // console.log("carData   is", carData);
    if (!formData.title) newErrors.title = t('validation_required');
    if (!formData.manufacturerName) newErrors.manufacturer = t('validation_required');
    if (!formData.commercialNickname) newErrors.model = t('validation_required');
    if (!formData.yearOfProduction) newErrors.year = t('validation_required');
    if (!formData.plateNumber) newErrors.plateNumber = t('validation_required');
    if (!formData.email) {
      newErrors.email = t('validation_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation_email');
    }
    if (!formData.phone) newErrors.phone = t('validation_required');
    if (!formData.images.length) newErrors.images = t('validation_images');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPlateNumber(e.target.value);
    setPlateNumber(formattedValue);
    setError(null);
  };
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
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // First upload all images
      // const imageIds = await uploadImages(formData.images);

      // Format the car details object per requested structure
      const cd: any = (formData as any).car_data || {};
      const composedName = [
        cd.manufacturer_name || formData.manufacturerName,
        cd.model_name || formData.commercialNickname,
        cd.year_of_production || formData.yearOfProduction || formData.year,
        cd.fuel_type || formData.fuelType || formData.engineType,
      ]
        .filter(Boolean)
        .join(' ');
              let imageId = null;
        if (formData.images && formData.images.length > 0) {
          console.log("formData.images[0] is", formData.images[0]);
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
        }
      const carDetails = {
        car: {
          fuel: cd.fuel_type || formData.fuelType || formData.engineType || '',
          name: composedName,
          year: String(cd.year_of_production || formData.yearOfProduction || formData.year || ''),
          miles: String(formData.mileage || ''),
          price: parseFloat(formData.askingPrice) || 0,
                     images: imageId ? {
             main: [imageId],
             additional: [imageId],
           } : {},
           formData: formData,
          features: [
            { label: 'العنوان', value: String(formData.title  || '') },
            { label: 'الشركة المصنعة والموديل', value: String(formData.makeModel || '') },
            { label: 'سنة الصنع', value: String(cd.year_of_production || formData.yearOfProduction || formData.year || '') },
            { label: 'رقم اللوحة', value: String(formData.plateNumber || '') },
            { label: 'عدد الكيلومترات', value: String(formData.mileage || '') },
            { label: 'اللون', value: String(formData.color || '') },
            { label: 'نوع المحرك', value: String(formData.engineType || '') },
            { label: 'ناقل الحركة', value: String(formData.transmission || '') },
            { label: 'الحالة الحالية', value: String(formData.currentCondition || '') },
            { label: 'المشاكل المعروفة', value: String(formData.knownProblems || '') },
            { label: 'المميزات', value: String(formData.pros || '') },
            { label: 'العيوب', value: String(formData.cons || '') },
            { label: 'خيار الاستبدال', value: String(formData.tradeIn || '') },
            { label: 'السعر المطلوب', value: String(formData.askingPrice || '') },
            { label: 'الاسم', value: String(formData.name || '') },
            { label: 'البريد الإلكتروني', value: String(formData.email || '') },
            { label: 'رقم الهاتف', value: String(formData.phone || '') },
            { label: 'نوع الوقود', value: String(cd.fuel_type || formData.fuelType || formData.engineType || '') },
                         ...(imageId ? [{ label: 'الصورة', value: imageId }] : []),
          ],
          body_type: 'غير محدد',
          description: 'غير محدد',
          transmission: 'غير محدد',
        }
      };

      // Send to our new API endpoint
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
        alert(t('success_message'));
        // Reset form
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
      alert(t('error_message'));
    } finally {
      setIsSubmitting(false);
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
            <div className="space-y-4">
              <div>
                <Input
                  placeholder={t('title_placeholder')}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                </div>

                <div>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => {
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
                  <Input
                    placeholder={t('plate_number')}
                    value={formData.plateNumber}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, plateNumber: e.target.value }));
                      setErrors(prev => ({ ...prev, plateNumber: '' }));
                    }}
                    className={`rounded-xl py-5 ${errors.plateNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.plateNumber && <p className="mt-1 text-sm text-red-500">{errors.plateNumber}</p>}
                </div>

                <Input
                  placeholder={t('mileage')}
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  className="rounded-xl py-5"
                />

                <Input
                  placeholder={t('color')}
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="rounded-xl py-5"
                />

                <Select
                  value={formData.engineType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, engineType: value }))}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('engine_type')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {['petrol', 'diesel', 'electric', 'hybrid'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`fuel_types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                >
                  <SelectTrigger className="rounded-xl py-5">
                    <SelectValue placeholder={t('transmission')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="automatic">{t('transmission_automatic')}</SelectItem>
                    <SelectItem value="manual">{t('transmission_manual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/*  */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">او ادخل رقم السيارة</h2>
            <div className="w-full max-w-xl">
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
              {/* Other Fields */}
              {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(carData).map(([key, value]) => (
                  !priorityFields.includes(key) && !key.endsWith('_value') && (
                    <div key={key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`flex-shrink-0 ${isRTL ? 'order-2' : 'order-1'}`}>
                        {iconMap[key as keyof typeof iconMap] && (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {React.createElement(iconMap[key as keyof typeof iconMap], {
                              className: "h-5 w-5 text-blue-600"
                            })}
                          </div>
                        )}
                      </div>
                      <div className={isRTL ? 'order-1 text-right' : 'order-2 text-left'}>
                        <p className="text-sm font-medium text-gray-500">{t(key).split('.').pop()}</p>
                        <p className={`font-semibold ${key === 'validity_date' && isLicenseExpired(value) ? 'text-red-600' : 'text-gray-900'}`}>
                          {String(value)}
                          {key === 'validity_date' && isLicenseExpired(value) && (
                            <span className="ml-2 text-sm text-red-600 font-normal">
                              ({t('license_expired')})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div> */}

              {/* Ownership History Section */}
              

              {/* Vehicle Specs Section */}
             
            </CardContent>
          </Card>
        )}
          </div>
          </div>
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
              <Select
                value={formData.currentCondition}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currentCondition: value }))}
              >
                <SelectTrigger className="rounded-xl py-5">
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
            <Input
              placeholder={t('asking_price_placeholder')}
              type="number"
              value={formData.askingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
              className="w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
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
                <Input
                  placeholder={t('name_placeholder')}
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
                <Input
                  placeholder={t('email_placeholder')}
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
                <Input
                  placeholder={t('phone_placeholder')}
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
                onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
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
              type="button"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl"
              onClick={handleSubmit}
            >
              {t('submit_listing')}
            </Button>
          </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
} 