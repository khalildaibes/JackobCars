"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const API_BASE_URL =
  "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=";

const ALTERNATE_API_BASE_URL =
  "https://data.gov.il/api/3/action/datastore_search?resource_id=03adc637-b6fe-402b-9937-7c3d3afc9140&q=";

const CarSearch = () => {
  const t = useTranslations("CarSearch"); // Fetch translations
  const [plateNumber, setPlateNumber] = useState("");
  const [carData, setCarData] = useState<{ [k: string]: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Dynamic translation map based on the selected language
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
    if (!plateNumber) return;
    setLoading(true);
    let data = null;

    try {
      // First fetch with the primary API
      const response = await fetch(`${API_BASE_URL}${plateNumber}`);
      const primaryData = await response.json();
      console.log(`${API_BASE_URL}${plateNumber}`);

      // If no records were returned, try the alternate API
      if (primaryData?.result?.records?.length) {
        data = primaryData;
      } else {
        const alternateResponse = await fetch(`${ALTERNATE_API_BASE_URL}${plateNumber}`);
        data = await alternateResponse.json();
      }

      if (data?.result?.records?.length) {
        const record = data.result.records[0] as Record<string, unknown>;
        console.log(record);

        const translatedData = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            translationMap[key as keyof typeof translationMap] || key,
            String(value),
          ])
        );

        setCarData(translatedData);
      } else {
        setCarData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  return (
    <div className="items-center justify-center w-full">
      <div dir="rtl" className="p-4 text-center">
        <input
          type="number"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder={t("enter_plate_number")}
          className="border p-2 rounded-md"
        />
        <button
          onClick={fetchCarData}
          className="ml-2 p-2 bg-blue text-white rounded-md my-10"
        >
          {t("search_car")}
        </button>

        {loading && <p>{t("loading_data")}</p>}

        {/* Car Details Section */}
        {carData && (
          <div className="mt-6 bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {carData[t("manufacturer_name")]} {carData[t("model_name")]}
            </h2>
            <div className="space-y-2">
              {Object.entries(carData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-semibold">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarSearch;
