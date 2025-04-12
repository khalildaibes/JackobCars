"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Img } from "../../components/Img";
import Image from "next/image";
// Move these to environment variables
const API_BASE_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=";
const ALTERNATE_API_BASE_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=03adc637-b6fe-402b-9937-7c3d3afc9140&q=";

interface CarData {
  [key: string]: string;
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

  const iconMap = {
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

  const fetchCarData = async () => {
    if (!plateNumber) return;
    // Remove dashes before making the API call
    const cleanPlateNumber = plateNumber.replace(/-/g, '');
    setLoading(true);
    setError(null);
    let data = null;

    try {
      // First fetch with the primary API
      const response = await fetch(`${API_BASE_URL}${cleanPlateNumber}`);
      const primaryData = await response.json();
      console.log(`${API_BASE_URL}${cleanPlateNumber}`)

      // If no records were returned, try the alternate API
      if (primaryData?.result?.records?.length) {
        console.log("record")
        console.log(primaryData?.result?.records)
        data = primaryData;
      } else {
        const alternateResponse = await fetch(`${ALTERNATE_API_BASE_URL}${cleanPlateNumber}`);
        data = await alternateResponse.json();
      }

      if (data?.result?.records?.length) {
        const record = data.result.records[0] as Record<string, unknown>;
        console.log(record)

        const translatedData = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            translationMap[key as keyof typeof translationMap] || key,
            String(value),
          ])
        );

        setCarData(translatedData);
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
                  <Button 
                    onClick={fetchCarData} 
                    disabled={loading}
                    className="rounded-full w-12 h-12 hover:bg-blue-700 transition-colors bg-blue-300"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <Input
                  type="text"
                  value={plateNumber}
                  onChange={handlePlateNumberChange}
                  placeholder={t("enter_plate")}
                  className="w-full px-6 py-8 text-4xl md:text-5xl font-black tracking-[0.1em] bg-transparent border-0 focus:ring-0 text-center uppercase"
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
                    className="rounded-full w-50 text-black   h-12 hover:bg-blue-700 transition-colors bg-[#ffca11]"
                  >
                    Search by VIN
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(carData).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`flex-shrink-0 ${isRTL ? 'order-2' : 'order-1'}`}>
                      {iconMap[key as keyof typeof iconMap] ? (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {React.createElement(iconMap[key as keyof typeof iconMap], {
                            className: "h-5 w-5 text-blue-600"
                          })}
                        </div>
                      ) : null}
                    </div>
                    <div className={isRTL ? 'order-1 text-right' : 'order-2 text-left'}>
                      <p className="text-sm font-medium text-gray-500">{t(key)}</p>
                      <p className="font-semibold text-gray-900">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarSearch;

