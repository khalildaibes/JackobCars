"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
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

// Move these to environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const GOV_API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=";
const GOV_ALTERNATE_API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=03adc637-b6fe-402b-9937-7c3d3afc9140&q=";

interface CarData {
  [key: string]: string;
}

const CarSearch = () => {
  const t = useTranslations("CarSearch");
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

  const fetchCarData = async () => {
    if (!plateNumber) {
      setError(t("please_enter_plate"));
      return;
    }
    
    setLoading(true);
    setError(null);
    let data = null;

    try {
      // First try to fetch from Strapi
      const strapiResponse = await fetch(`${API_BASE_URL}/api/cars?filters[plateNumber]=${plateNumber}`);
      const strapiData = await strapiResponse.json();

      if (strapiData?.data?.length) {
        // Use Strapi data if available
        const carDetails = strapiData.data[0].attributes;
        setCarData(carDetails);
      } else {
        // Fallback to government API
        const govResponse = await fetch(`${GOV_API_URL}${plateNumber}`);
        const primaryData = await govResponse.json();

        if (primaryData?.result?.records?.length) {
          data = primaryData;
        } else {
          const alternateResponse = await fetch(`${GOV_ALTERNATE_API_URL}${plateNumber}`);
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

          // Store in Strapi for future use
          try {
            await fetch(`${API_BASE_URL}/api/cars`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                data: {
                  plateNumber,
                  ...translatedData,
                }
              }),
            });
          } catch (error) {
            console.error('Error storing data in Strapi:', error);
          }
        } else {
          setError(t("no_car_found"));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("error_fetching_data"));
    }

    setLoading(false);
  };

  const getIcon = (key: string) => {
    const IconComponent = iconMap[key as keyof typeof iconMap] || Settings;
    return <IconComponent className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("find_car_plate_heading")}</h1>
          <p className="text-xl text-gray-600">{t("explore_car_specs")}</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => {
                    setPlateNumber(e.target.value);
                    setError(null);
                  }}
                  placeholder={t("enter_plate_number")}
                  className="pr-12"
                  maxLength={8}
                />
                <Car className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button 
                onClick={fetchCarData} 
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading_data")}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t("search_car")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Skeleton className="h-5 w-5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {carData && !loading && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {carData[t("manufacturer_name")]} {carData[t("model_name")]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(carData).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      {getIcon(key)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{key}</p>
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

