"use client";

import { useState } from "react";

const API_BASE_URL =
  "https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=";

const ALTERNATE_API_BASE_URL =
  "https://data.gov.il/api/3/action/datastore_search?resource_id=03adc637-b6fe-402b-9937-7c3d3afc9140&q=";

const translationMap: Record<string, string> = {
  _id: "מזהה",
  mispar_rechev: "מספר רכב",
  tozeret_cd: "תוצרת קוד",
  sug_degem: "סוג דגם",
  tozeret_nm: "שם תוצרת",
  degem_cd: "קוד דגם",
  degem_nm: "שם דגם",
  ramat_gimur: "רמת גימור",
  ramat_eivzur_betihuty: "רמת איבזור בטיחותי",
  kvutzat_zihum: "קבוצת זיהום",
  shnat_yitzur: "שנת ייצור",
  degem_manoa: "דגם מנוע",
  mivchan_acharon_dt: "מבחן אחרון תוקף",
  tokef_dt: "תוקף תאריך",
  baalut: "בעלות",
  misgeret: "מסגרת",
  tzeva_cd: "קוד צבע",
  tzeva_rechev: "צבע רכב",
  zmig_kidmi: "צמיג קדמי",
  zmig_ahori: "צמיג אחורי",
  sug_delek_nm: "סוג דלק",
  horaat_rishum: "הוראת רישום",
  moed_aliya_lakvish: "מועד עלייה לכביש",
  kinuy_mishari: "כינוי מסחרי",
  rank: "דירוג",
};

const CarSearch = () => {
  const [plateNumber, setPlateNumber] = useState("");
  const [carData, setCarData] = useState<{ [k: string]: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCarData = async () => {
    if (!plateNumber) return;
    setLoading(true);
    let data = null;

    try {
      // First fetch with the primary API
      const response = await fetch(`${API_BASE_URL}${plateNumber}`);
      const primaryData = await response.json();
      console.log(`${API_BASE_URL}${plateNumber}`)

      // If no records were returned, try the alternate API
      if (primaryData?.result?.records?.length) {
        console.log("record")
        console.log(primaryData?.result?.records)
        data = primaryData;
      } else {
        const alternateResponse = await fetch(`${ALTERNATE_API_BASE_URL}${plateNumber}`);
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
      } else {
        setCarData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  return (
    <div dir="rtl" className="p-4 text-center">
      <input
        type="number"
        value={plateNumber}
        onChange={(e) => setPlateNumber(e.target.value)}
        placeholder="הכנס מספר רכב"
        className="border p-2 rounded-md"
      />
      <button
        onClick={fetchCarData}
        className="ml-2 p-2 bg-blue-500 text-white rounded-md"
      >
        חפש רכב
      </button>

      {loading && <p>טוען נתונים...</p>}

      {/* Car Details Section */}
      {carData && (
        <div className="mt-6 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {carData["שם תוצרת"]} {carData["שם דגם"]}
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
  );
};

export default CarSearch;
