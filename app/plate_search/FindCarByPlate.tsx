"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
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
import Image from "next/image";

// Move these to environment variables
const API_BASE_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=";
const ALTERNATE_API_BASE_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=03adc637-b6fe-402b-9937-7c3d3afc9140&q=";
const OWNERSHIP_HISTORY_API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=bb2355dc-9ec7-4f06-9c3f-3344672171da&q=";
const VEHICLE_SPECS_API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=142afde2-6228-49f9-8a29-9b6c3a0cbe40&q=";

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

const CarSearch = () => {
  const t = useTranslations("CarSearch");
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  const resultsRef = React.useRef<HTMLDivElement>(null);
  
  const [plateNumber, setPlateNumber] = useState("");
  const [carData, setCarData] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const translationMap: Record<string, string> = {
    _id: t("id"),
    mispar_rechev: t("plate_number"),
    tozeret_cd: t("manufacturer_code"),
    sug_degem: t("model_type"),
    tozeret_nm: t("manufacturer_name"),
    degem_cd: t("model_code"),
    degem_nm: t("model_name"),
    ramat_gimur: t("trim_level"),
    ramat_eivzur_betihuty: t("safety_equipment_level"),
    kvutzat_zihum: t("pollution_group"),
    shnat_yitzur: t("year_of_production"),
    degem_manoa: t("engine_model"),
    mivchan_acharon_dt: t("last_inspection_date"),
    tokef_dt: t("validity_date"),
    baalut: t("ownership"),
    misgeret: t("chassis"),
    tzeva_cd: t("color_code"),
    tzeva_rechev: t("car_color"),
    zmig_kidmi: t("front_tire"),
    zmig_ahori: t("rear_tire"),
    sug_delek_nm: t("fuel_type"),
    horaat_rishum: t("registration_order"),
    moed_aliya_lakvish: t("road_entry_date"),
    kinuy_mishari: t("commercial_nickname"),
    rank: t("rank"),
  };

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

  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPlateNumber(e.target.value);
    setPlateNumber(formattedValue);
    setError(null);
  };

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

  const fetchCarPerformanceData = async (manufacturer: string, model: string, year: string, trim: string) => {
    try {
      setLoadingPerformance(true);
      const response = await fetch('/api/generate-car-information', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manufacturer,
          model,
          year,
          locale,
          trim
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch performance data');
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError(t('error_loading_info'));
    } finally {
      setLoadingPerformance(false);
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

  const fetchCarData = async () => {
    if (!plateNumber) return;
    // Remove dashes before making the API call
    const cleanPlateNumber = plateNumber.replace(/-/g, '');
    setLoading(true);
    setError(null);
    setCarImage(null);
    setOwnershipHistory([]);
    setVehicleSpecs(null);
    let data = null;

    try {
      // First fetch with the primary API
      const response = await fetch(`${API_BASE_URL}${cleanPlateNumber}`);
      const primaryData = await response.json();

      // If no records were returned, try the alternate API
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

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/car-showroom-dark.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">
            {t("title")}
          </h1>
          <p className="text-xl text-white mb-12 text-center max-w-2xl">
            {t("subtitle")}
          </p>
          
          <div className="w-full max-w-xl">
            <div className="relative">
              <div className="relative flex items-center bg-[#ffca11] rounded shadow-lg p-2">
                <div className="flex items-center gap-4">
                  <Image 
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
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
            </div>
            
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16 rounded-t-3xl -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("how_it_works")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("step1_title")}</h3>
              <p className="text-gray-600">{t("step1_desc")}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("step2_title")}</h3>
              <p className="text-gray-600">{t("step2_desc")}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("step3_title")}</h3>
              <p className="text-gray-600">{t("step3_desc")}</p>
            </div>
          </div>
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
              {carImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={carImage} 
                    alt={`${carData.manufacturer_name} ${carData.model_name}`}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              )}

              {/* Performance Data */}
              {loadingPerformance && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-lg">{t('loading_info')}</span>
                </div>
              )}

              {performanceData && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Performance Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Gauge className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold">{t('performance')}</h3>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(performanceData.performance).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{t(key)}</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tuning Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div 
                        className="flex items-center gap-3 mb-4 cursor-pointer"
                        onClick={() => setExpandedSections(prev => ({ ...prev, tuning: !prev.tuning }))}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold">{t('tuning')}</h3>
                        <div className="ml-auto">
                          <svg 
                            className={`w-6 h-6 transform transition-transform ${expandedSections.tuning ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {expandedSections.tuning && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('tuning_potential')}</span>
                            <span className="font-semibold">{renderRating(performanceData.tuning.tuning_potential)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">{t('tuning_notes')}</span>
                            <p className="mt-1 font-semibold">{performanceData.tuning.tuning_notes}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">{t('common_upgrades')}</span>
                            <ul className="mt-1 list-disc list-inside">
                              {performanceData.tuning.common_upgrades.map((upgrade, index) => (
                                <li key={index} className="font-semibold">{upgrade}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Handling Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div 
                        className="flex items-center gap-3 mb-4 cursor-pointer"
                        onClick={() => setExpandedSections(prev => ({ ...prev, handling: !prev.handling }))}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold">{t('handling')}</h3>
                        <div className="ml-auto">
                          <svg 
                            className={`w-6 h-6 transform transition-transform ${expandedSections.handling ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {expandedSections.handling && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('handling_rating')}</span>
                            <span className="font-semibold">{renderRating(performanceData.handling.handling_rating)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">{t('suspension_type')}</span>
                            <p className="mt-1 font-semibold">{performanceData.handling.suspension_type}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">{t('driving_characteristics')}</span>
                            <p className="mt-1 font-semibold">{performanceData.handling.driving_characteristics}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reliability Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div 
                        className="flex items-center gap-3 mb-4 cursor-pointer"
                        onClick={() => setExpandedSections(prev => ({ ...prev, reliability: !prev.reliability }))}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold">{t('reliability')}</h3>
                        <div className="ml-auto">
                          <svg 
                            className={`w-6 h-6 transform transition-transform ${expandedSections.reliability ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {expandedSections.reliability && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('reliability_rating')}</span>
                            <span className="font-semibold">{renderRating(performanceData.reliability.reliability_rating)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">{t('common_issues')}</span>
                            <ul className="mt-1 list-disc list-inside">
                              {performanceData.reliability.common_issues.map((issue, index) => (
                                <li key={index} className="font-semibold">{issue}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('maintenance_cost')}</span>
                            <span className="font-semibold">{renderRating(performanceData.reliability.maintenance_cost)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Priority Fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {priorityFields.map((key) => (
                  carData[key] && (
                    <div key={key} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                      {iconMap[key as keyof typeof iconMap] && (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          {React.createElement(iconMap[key as keyof typeof iconMap], {
                            className: "h-6 w-6 text-blue-600"
                          })}
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-500 text-center">{t(key)}</p>
                      <p className="font-semibold text-gray-900 text-center">{carData[`${key}_value`] || carData[key]}</p>
                    </div>
                  )
                ))}
              </div>

              {/* Other Fields */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              </div>

              {/* Ownership History Section */}
              {ownershipHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <User className="h-6 w-6 text-blue-600" />
                    {t('ownership_history')} ({ownershipHistory.length} {t('records')})
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      {ownershipHistory.map((record, index) => (
                        <div key={record._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{t(record.baalut)}</p>
                              <p className="text-sm text-gray-500">
                                {record.baalut_dt.toString().slice(0, 4)}/{record.baalut_dt.toString().slice(4)}
                              </p>
                            </div>
                          </div>
                          {index === 0 && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {t('current_owner')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Specs Section */}
              {vehicleSpecs && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <Tag className="h-6 w-6 text-blue-600" />
                    {t('vehicle_specs')}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      {Object.entries(vehicleSpecs).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Tag className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{t(key)}</p>
                              <p className="text-sm text-gray-500">{value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarSearch;

