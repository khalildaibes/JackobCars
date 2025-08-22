"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Upload, Plus,  X, Camera } from 'lucide-react';
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Card, CardContent } from "../../../../components/ui/card";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
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
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import {manufacturers_hebrew} from '../../../../data/manufacturers_multilingual';
const conditions = ['excellent', 'good', 'fair', 'poor'] as const;
import React from 'react';

// Government car data API endpoint
const GOV_CAR_DATA_API = "/api/gov/car-data";

// Constants
const VALIDATION_RULES = {
  MAX_IMAGES: 8,
  MIN_IMAGES: 1
};

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
  const STEPS = [
    'Basic Information',
    'Condition',
    'Trade-in Option',
    'Target Buyer',
    'Price',
    'Contact Info',
    'Upload Images',
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manufacturersData, setManufacturersData] = useState<ManufacturersData>(manufacturers_hebrew);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubmodel, setSelectedSubmodel] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSubmodels, setAvailableSubmodels] = useState<any[]>([]);
  const [globalSubmodelOptions, setGlobalSubmodelOptions] = useState<any[]>([]);
  const [subModelID, setSubModelID] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('plate');
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
    targetBuyer: '',
    askingPrice: '',
    name: '',
    email: '',
    phone: '',
    images: [] as File[],
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
    rank: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks functions from the hooks file
  const fetchVehicleSpecs = useCallback(async (carData: any) => {
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
  }, []);

  const fetchSubmodelOptions = useCallback(async (manufacturerName: string, modelName: string, year: string) => {
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
    } else {
      setAvailableModels([]);
      setAvailableYears([]);
      setSelectedSubmodel('');
      setAvailableSubmodels([]);
    }
  }, [selectedManufacturer, manufacturersData]);

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
      console.log('Government API response status:', response.status);

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Government API request failed:', response.status, errorData);
        setError(t("error_fetching") || 'Failed to fetch car data');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Government car data received:', data);
      
      if (data?.result?.records?.length > 0) {
        const record = data.result.records[0] as Record<string, unknown>;
        
        // Translate the data using the existing translation map
        const translatedData = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            translationMap[key as keyof typeof translationMap] || key,
            String(value),
          ])
        );
        
        console.log('Translated car data:', translatedData);
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
            console.log('Government vehicle specs API response data:', data1);
            
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
              console.log('Enhanced yad2ModelInfo with vehicle specs:', enhancedData);
            } else {
              // If no vehicle specs found, use the mock data as is
              setYad2ModelInfo(mockYad2Info);
              console.log('No vehicle specs found, using mock data:', mockYad2Info);
            }
          } else {
            console.log('Vehicle specs API request failed:', response1.status);
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

    if (!formData.title) newErrors.title = t('validation_required');
    if (!selectedManufacturer) newErrors.manufacturer = t('validation_required');
    if (!selectedModel) newErrors.model = t('validation_required');
    if (!formData.year) newErrors.year = t('validation_required');
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
    // e.preventDefault();
    // if (!validateForm()) return;

    // setIsSubmitting(true);

    // try {
    //   // First upload all images
    //   const imageIds = await uploadImages(formData.images);

    //   // Format the car details object
    //   const carDetails = {
    //     car: {
    //       name: formData.title,
    //       year: parseInt(formData.year),
    //       fuel: formData.engineType,
    //       transmission: formData.transmission,
    //       mileage: `${formData.mileage} KM`,
    //       price: parseFloat(formData.askingPrice),
    //       body_type: formData.makeModel.split(' ')[0], // This is a simplification
    //       pros: formData.pros.split('\n').filter(item => item.trim() !== ''),
    //       cons: formData.cons.split('\n').filter(item => item.trim() !== ''),
    //       features: [
    //         {
    //           icon: "img_calendar_indigo_a400.svg",
    //           label: t('year'),
    //           value: formData.year.toString()
    //         },
    //         {
    //           icon: "img_icon_indigo_a400.svg",
    //           label: t('mileage'),
    //           value: `${formData.mileage} KM`
    //         },
    //         {
    //           icon: "img_icon_indigo_a400_18x18.svg",
    //           label: t('transmission'),
    //           value: formData.transmission
    //         },
    //         {
    //           icon: "img_icon_4.svg",
    //           label: t('fuel_type'),
    //           value: formData.engineType
    //         }
    //       ],
    //       description: formData.knownProblems,
    //       images: {
    //         main: imageIds[0] || '',
    //         additional: imageIds.slice(1)
    //       }
    //     }
    //   };

    //   // Prepare the data for Strapi
    //   const carListingData = {
    //     data: {
    //       image: imageIds[0], // First image as main image
    //       categories: ['car-listing'],
    //       quantity: 1,
    //       name: formData.title,
    //       slug: generateSlug(formData.title),
    //       price: parseFloat(formData.askingPrice),
    //       details: carDetails,
    //       store: 'khalil store', // You might want to make this dynamic
    //       locale: locale,
    //       publishedAt: null // Will be published after admin approval
    //     }
    //   };

    //   // Send the data to Strapi
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/car-listings`, 
    //     carListingData,
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   );

    //   if (response.data) {
    //     alert(t('success_message'));
    //     // Reset form
    //     setFormData({
    //       title: '',
    //       makeModel: '',
    //       year: '',
    //       plateNumber: '',
    //       mileage: '',
    //       color: '',
    //       engineType: '',
    //       transmission: 'Automatic',
    //       currentCondition: '',
    //       knownProblems: '',
    //       pros: '',
    //       cons: '',
    //       tradeIn: '',
    //       targetBuyer: '',
    //       askingPrice: '',
    //       name: '',
    //       email: '',
    //       phone: '',
    //       images: []
    //     });
    //     setSelectedManufacturer('');
    //     setSelectedModel('');
    //     setAvailableModels([]);
    //     setAvailableYears([]);
    //     setErrors(prev => ({ ...prev, manufacturer: '', model: '' }));
    //   }
    // } catch (error) {
    //   console.error('Error submitting form:', error);
    //   alert(t('error_message'));
    // } finally {
    //   setIsSubmitting(false);
    // }
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
            
            {/* Input Method Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setInputMethod('plate')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
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
                  onClick={() => setInputMethod('manual')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
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
            {/* Title Field */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-6"
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
                className={`w-full text-lg py-6 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              {!formData.title && selectedManufacturer && selectedModel && selectedYear && (
                <p className="mt-2 text-sm text-blue-600">
                  💡 {t('title_auto_generation_hint') || 'Title will be auto-generated as'} "{manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer} {formData.commercialNickname || t('model')} {selectedYear}" {t('when_click_next') || 'when you click next'}
                </p>
              )}
            </motion.div>

            {/* Mileage Field */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('mileage')} <span className="text-gray-500">({t('in_kilometers') || 'in kilometers'})</span>
              </label>
              <Input
                placeholder={t('mileage')}
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                className={`rounded-xl py-5 ${errors.mileage ? 'border-red-500' : ''}`}
              />
              {errors.mileage && <p className="mt-1 text-sm text-red-500">{errors.mileage}</p>}
            </motion.div>

            {/* Plate Number Input Method */}
            {inputMethod === 'plate' && (
              <motion.div 
                key="plate-method"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="w-full max-w-xl mx-auto">
                  <div className="relative">
                    <div className="relative flex items-center bg-[#ffca11] rounded shadow-lg p-2">
                      <div className="flex items-center gap-4">
                        <img 
                          src="/a1.png" 
                          alt={t("logo_alt") || "Logo"} 
                          width={40} 
                          height={50} 
                          className="object-fill w-[60px] md:w-[80px] p-[2px]" 
                        />
                      </div>
                      <Input
                        type="text"
                        value={plateNumber}
                        onChange={handlePlateNumberChange}
                        placeholder={t("enter_plate") || "Enter Plate Number"}
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
                        {t("search_by_vin") || "Search by VIN"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Manual Entry Method */}
            {inputMethod === 'manual' && (
              <motion.div 
                key="manual-method"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            manufacturerName: value,
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
                            modelId: selectedModelData.id?.toString() || ''
                          }));
                        }
                        onFetchSubmodels(value);
                        setSelectedSubmodel('');
                        setErrors({ ...errors, model: '' });
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
                            const manufacturerTitle = manufacturersData[selectedManufacturer]?.submodels?.[0]?.manufacturer?.title || selectedManufacturer;
                            const modelTitle = availableModels.find(model => model.id?.toString() === selectedModel)?.title || selectedModel;
                            console.log('here2 ' , manufacturerTitle, modelTitle, value);

                            // Fetch submodel options and set them globally
                            const submodelOptions = await fetchSubmodelOptions(manufacturerTitle, modelTitle, value);
                            console.log('Fetched submodel options:', submodelOptions);
                            setGlobalSubmodelOptions(submodelOptions);
                            console.log('here3 ' , submodelOptions);
                            // Update available submodels with the fetched data
                            if (submodelOptions.length > 0) {
                              // Convert to the format expected by the existing submodel logic
                              const formattedSubmodels = submodelOptions.map(option => ({
                                id: option.id,
                                title: option.title,
                                minYear: parseInt(value),
                                maxYear: parseInt(value)
                              }));
                              
                              // Update the available submodels state
                              setAvailableSubmodels(formattedSubmodels);
                              console.log('Fetched submodel options:', formattedSubmodels);
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
                          setFormData(prev => ({ 
                            ...prev, 
                            commercialNickname: selectedSubmodelData.title || '',
                            subModelId: selectedSubmodelData.id?.toString() || ''
                          }));
                          
                          // Fetch detailed specifications for the selected submodel
                          try {
                            // Try to find the detailed specs from globalSubmodelOptions
                            let detailedSpecs = selectedSubmodelData;
                            
                            if (globalSubmodelOptions.length > 0) {
                              console.log('here4 ' , detailedSpecs);
                              console.log('Matching submodel found:', detailedSpecs);
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
                                subModelId: selectedSubmodelData.id?.toString() || ''
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
                      <SelectTrigger className="rounded-xl py-5">
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
                            </SelectItem>
                          ))
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
                      variant="outline"
                    >
                      I completed it, retry
                    </Button>
                  </div>
                </div>
              )}

              {/* ALL Government Car Information - Complete Data Display */}
              {yad2ModelInfo?.data && (
                <div className="space-y-4">
                  {/* Basic Car Information */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-blue-600 font-semibold">🚗 {t('basic_car_info') || 'Basic Car Information'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {yad2ModelInfo.data.manufacturerName && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('manufacturer') || 'Manufacturer'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.manufacturerName}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.modelName && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('model') || 'Model'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.modelName}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.carYear && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('year') || 'Year'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.carYear}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.subModelTitle && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('submodel') || 'Submodel'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.subModelTitle}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.fuelType && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('fuel_type') || 'Fuel Type'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.fuelType}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.owner && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('owner') || 'Owner Type'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.owner}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.carTitle && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('car_title') || 'Car Title'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.carTitle}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.modelId && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('model_id') || 'Model ID'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.modelId}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.manufacturerId && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('manufacturer_id') || 'Manufacturer ID'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.manufacturerId}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.subModelId && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('submodel_id') || 'Submodel ID'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.subModelId}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.commercialNickname && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('commercial_nickname') || 'Commercial Nickname'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.commercialNickname}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-green-600 font-semibold">⚙️ {t('technical_specs') || 'Technical Specifications'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {yad2ModelInfo.data.engineCapacity && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('engine_capacity') || 'Engine Capacity'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.engineCapacity} cc</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.totalWeight && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('total_weight') || 'Total Weight'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.totalWeight} kg</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.height && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('height') || 'Height'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.height} mm</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.driveType && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('drive_type') || 'Drive Type'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.driveType}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.transmission && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('transmission') || 'Transmission'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.transmission}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.bodyType && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('body_type') || 'Body Type'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.bodyType}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.engineCode && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('engine_code') || 'Engine Code'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.engineCode}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.seatingCapacity && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('seating_capacity') || 'Seating Capacity'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.seatingCapacity}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.pollutionGroup && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('pollution_group') || 'Pollution Group'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.pollutionGroup}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Safety Features */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-yellow-600 font-semibold">🛡️ {t('safety_features') || 'Safety Features'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {yad2ModelInfo.data.abs && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('abs') || 'ABS'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.abs}</div>
                        </div>
                      )}
                      {(yad2ModelInfo.data.airbags !== null && yad2ModelInfo.data.airbags !== undefined) && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('airbags') || 'Airbags'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.airbags}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.safetyRating && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('safety_rating') || 'Safety Rating'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.safetyRating}</div>
                        </div>
                      )}
                      {(yad2ModelInfo.data.powerWindows !== null && yad2ModelInfo.data.powerWindows !== undefined) && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('power_windows') || 'Power Windows'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.powerWindows}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.safetyRatingWithoutSeatbelts && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('safety_rating_no_seatbelts') || 'Safety Rating (No Seatbelts)'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.safetyRatingWithoutSeatbelts}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Environmental Data */}
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-emerald-600 font-semibold">🌱 {t('environmental_data') || 'Environmental Data'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {yad2ModelInfo.data.co2Emission && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('co2_emission') || 'CO2 Emission'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.co2Emission} g/km</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.noxEmission && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('nox_emission') || 'NOx Emission'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.noxEmission} mg/km</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.pmEmission && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('pm_emission') || 'PM Emission'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.pmEmission} mg/km</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.hcEmission && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('hc_emission') || 'HC Emission'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.hcEmission} mg/km</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.coEmission && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('co_emission') || 'CO Emission'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.coEmission} mg/km</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.greenIndex && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('green_index') || 'Green Index'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.greenIndex}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-purple-600 font-semibold">📋 {t('additional_info') || 'Additional Information'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {yad2ModelInfo.data.fuelTankCapacity && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('fuel_tank_capacity') || 'Fuel Tank Capacity'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.fuelTankCapacity} kg</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.fuelTankCapacityWithoutReserve && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('fuel_tank_capacity_no_reserve') || 'Fuel Tank (No Reserve)'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.fuelTankCapacityWithoutReserve} kg</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.dateOnRoad && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('date_on_road') || 'Date on Road'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.dateOnRoad}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.frameNumber && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('frame_number') || 'Frame Number'}</div>
                          <div className="font-semibold text-gray-900 font-mono text-sm">{yad2ModelInfo.data.frameNumber}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.lastTestDate && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('last_test_date') || 'Last Test Date'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.lastTestDate}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.tokefTestDate && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('tokef_test_date') || 'Tokef Test Date'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.tokefTestDate}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.mileage && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('mileage') || 'Mileage'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.mileage} km</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.rank && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('rank') || 'Rank'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.rank}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.commercialName && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('commercial_name') || 'Commercial Name'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.commercialName}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tires and Colors */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl text-orange-600 font-semibold">🛞 {t('tires_and_colors') || 'Tires and Colors'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {yad2ModelInfo.data.frontTires && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('front_tires') || 'Front Tires'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.frontTires}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.rearTires && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('rear_tires') || 'Rear Tires'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.rearTires}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.carColorGroupID && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('car_color_group_id') || 'Car Color Group ID'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.carColorGroupID}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.yad2ColorID && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('yad2_color_id') || 'Yad2 Color ID'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.yad2ColorID}</div>
                        </div>
                      )}
                      {yad2ModelInfo.data.yad2CarTitle && (
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 font-medium">{t('yad2_car_title') || 'Yad2 Car Title'}</div>
                          <div className="font-semibold text-gray-900">{yad2ModelInfo.data.yad2CarTitle}</div>
                        </div>
                      )}
                    </div>
                  </div>

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

          {/* Target Buyer */}
          {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('target_buyer')}</h2>
            <Textarea
              placeholder={t('target_buyer_placeholder')}
              value={formData.targetBuyer}
              onChange={(e) => setFormData(prev => ({ ...prev, targetBuyer: e.target.value }))}
              className="h-24 rounded-xl py-5"
            />
          </motion.div>
          )}

          {/* Price */}
          {currentStep === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('price')}</h2>
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
          {currentStep === 5 && (
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
          {currentStep === 6 && (
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
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('submitting') : t('submit_listing')}
            </Button>
          </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
} 