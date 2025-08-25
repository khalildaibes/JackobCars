import * as React from "react";

type CarData = Record<string, any>;
type TFn = ((key: string) => string | undefined) | undefined;

interface Props {
  data: CarData | undefined;
  t?: TFn;
}

const CarDetailsSections: React.FC<Props> = ({ data: raw, t }) => {
  const data = raw ?? {};

  const tLabel = (key: string, fallback: string) =>
    (typeof t === "function" ? t(key) : undefined) || fallback;

  const show = (v: any) =>
    v !== null && v !== undefined && v !== "" && v !== "null";

  const formatValue = (key: string, val: any) => {
    if (val === true || val === 1 || val === "Yes") return tLabel("yes", "Yes");
    if (val === false || val === 0 || val === "No") return tLabel("no", "No");

    // Units
    if (["enginePower", "koah_sus"].includes(key)) return `${val} hp`;
    if (["engineCapacity", "nefah_manoa"].includes(key)) return `${val} cc`;
    if (["totalWeight", "mishkal_kolel"].includes(key)) return `${val} kg`;
    if (["kosher_grira_im_blamim", "kosher_grira_bli_blamim"].includes(key))
      return `${val} kg`;
    if (
      ["co2Emission", "kamut_CO2", "coEmission", "kamut_CO", "hcEmission", "kamut_HC", "kamut_HC_NOX", "noxEmission", "kamut_NOX", "kamut_PM10"].includes(
        key
      )
    ) {
      // Use g/km default
      return `${val} g/km`;
    }

    // Generic formatting
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  const LABELS: Record<string, string> = {
    // Key specs
    commercialName: tLabel("commercial_name", "Commercial Name"),
    commercialNickname: tLabel("commercial_nickname", "Commercial Nickname"),
    manufacturerName: tLabel("manufacturer", "Manufacturer"),
    tozeret_nm: tLabel("manufacturer_he", "Manufacturer (HE)"),
    modelName: tLabel("model", "Model"),
    subModelTitle: tLabel("submodel", "Submodel"),
    carYear: tLabel("year", "Year"),
    enginePower: tLabel("power_hp", "Power (hp)"),
    koah_sus: tLabel("power_hp_he", "Power (hp)"),
    engineCapacity: tLabel("engine_capacity", "Engine Capacity"),
    nefah_manoa: tLabel("engine_capacity_he", "Engine Capacity"),
    fuelType: tLabel("fuel_type", "Fuel Type"),
    transmission: tLabel("transmission", "Transmission"),
    driveType: tLabel("drive_type", "Drive Type"),
    bodyType: tLabel("body_type", "Body Type"),
    seatingCapacity: tLabel("seating_capacity", "Seating Capacity"),
    doors: tLabel("doors", "Doors"),

    // Drivetrain / tires
    frontTires: tLabel("front_tires", "Front Tires"),
    rearTires: tLabel("rear_tires", "Rear Tires"),

    // Dimensions & capacities
    totalWeight: tLabel("total_weight", "Total Weight"),
    mishkal_kolel: tLabel("gross_weight", "Gross Weight"),
    height: tLabel("height", "Height"),
    kosher_grira_im_blamim: tLabel("towing_braked", "Towing (braked)"),
    kosher_grira_bli_blamim: tLabel("towing_unbraked", "Towing (unbraked)"),
    fuelTankCapacity: tLabel("fuel_tank_capacity", "Fuel Tank Capacity"),
    fuelTankCapacityWithoutReserve: tLabel(
      "fuel_tank_no_reserve",
      "Fuel Tank (No Reserve)"
    ),

    // Safety & ADAS
    abs: tLabel("abs", "ABS"),
    airbags: tLabel("airbags", "Airbags"),
    powerWindows: tLabel("power_windows", "Power Windows"),
    safetyRating: tLabel("safety_rating", "Safety Rating"),
    safetyRatingWithoutSeatbelts: tLabel(
      "safety_rating_no_seatbelts",
      "Safety (No Seatbelts)"
    ),
    bakarat_stiya_menativ_ind: tLabel(
      "lane_depart_warn",
      "Lane Departure Warning"
    ),
    bakarat_stiya_menativ_makor_hatkana: tLabel(
      "lane_depart_source",
      "Lane Departure Source"
    ),
    nitur_merhak_milfanim_ind: tLabel(
      "front_distance_monitor",
      "Front Distance Monitoring"
    ),
    nitur_merhak_milfanim_makor_hatkana: tLabel(
      "front_distance_source",
      "Front Distance Source"
    ),
    shlita_automatit_beorot_gvohim_ind: tLabel(
      "auto_high_beam",
      "Auto High Beam"
    ),
    teura_automatit_benesiya_kadima_ind: tLabel(
      "auto_forward_lighting",
      "Auto Forward Lighting"
    ),
    hayshaney_lahatz_avir_batzmigim_ind: tLabel("tpms", "Tire Pressure Monitoring"),
    zihuy_holchey_regel_ind: tLabel("pedestrian_detect", "Pedestrian Detection"),
    zihuy_tamrurey_tnua_ind: tLabel("traffic_sign_rec", "Traffic Sign Recognition"),
    zihuy_rechev_do_galgali: tLabel("two_wheeler_detect", "Two-Wheelers Detection"),

    // Emissions & environment
    co2Emission: tLabel("co2_emission", "CO₂ Emission"),
    noxEmission: tLabel("nox_emission", "NOx Emission"),
    pmEmission: tLabel("pm_emission", "PM Emission"),
    hcEmission: tLabel("hc_emission", "HC Emission"),
    coEmission: tLabel("co_emission", "CO Emission"),
    greenIndex: tLabel("green_index", "Green Index"),
    pollutionGroup: tLabel("pollution_group", "Pollution Group"),
    kamut_CO2: tLabel("co2_emission_raw", "CO₂ (raw)"),
    kamut_CO: tLabel("co_emission_raw", "CO (raw)"),
    kamut_HC: tLabel("hc_emission_raw", "HC (raw)"),
    kamut_HC_NOX: tLabel("hc_nox_raw", "HC+NOx (raw)"),
    kamut_NOX: tLabel("nox_emission_raw", "NOx (raw)"),
    kamut_PM10: tLabel("pm10_raw", "PM10 (raw)"),
    kamut_CO2_city: tLabel("co2_city", "CO₂ City"),
    kamut_CO2_hway: tLabel("co2_highway", "CO₂ Highway"),
    kamut_CO_city: tLabel("co_city", "CO City"),
    kamut_CO_hway: tLabel("co_highway", "CO Highway"),
    kamut_HC_city: tLabel("hc_city", "HC City"),
    kamut_HC_hway: tLabel("hc_highway", "HC Highway"),
    kamut_NOX_city: tLabel("nox_city", "NOx City"),
    kamut_NOX_hway: tLabel("nox_highway", "NOx Highway"),
    kamut_PM10_city: tLabel("pm10_city", "PM10 City"),
    kamut_PM10_hway: tLabel("pm10_highway", "PM10 Highway"),

    // Ownership & dates
    owner: tLabel("owner", "Owner Type"),
    dateOnRoad: tLabel("date_on_road", "Date on Road"),
    lastTestDate: tLabel("last_test_date", "Last Test Date (MOT)"),
    tokefTestDate: tLabel("tokef_test_date", "Valid Until"),

    // Identifiers
    frameNumber: tLabel("frame_number", "Frame Number"),
    modelId: tLabel("model_id", "Model ID"),
    subModelId: tLabel("submodel_id", "Submodel ID"),
    manufacturerId: tLabel("manufacturer_id", "Manufacturer ID"),
    tozeret_cd: tLabel("manufacturer_code", "Manufacturer Code"),
    sug_degem: tLabel("model_kind", "Model Kind"),
    sug_mamir_cd: tLabel("catalyst_code", "Catalyst Code"),
    sug_mamir_nm: tLabel("catalyst_name", "Catalyst Name"),
    sug_tkina_cd: tLabel("standard_code", "Standard Code"),
    sug_tkina_nm: tLabel("standard_name", "Standard Name"),

    // Colors
    yad2CarTitle: tLabel("yad2_color_name", "Color Name (Yad2)"),
    carColorGroupID: tLabel("color_group_id", "Color Group ID"),
    yad2ColorID: tLabel("yad2_color_id", "Yad2 Color ID"),

    // Misc
    rank: tLabel("rank", "Rank"),
    carTitle: tLabel("car_title", "Car Title"),
    merkav: tLabel("body_he", "Body (HE)"),
    tozar: tLabel("brand_he", "Brand (HE)"),
  };

  const FieldCard: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <div className="bg-white p-3 rounded-lg border">
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="font-semibold text-gray-900 break-words">{value}</div>
    </div>
  );

  const Section: React.FC<{
    title: string;
    color:
      | "blue"
      | "green"
      | "yellow"
      | "emerald"
      | "violet"
      | "orange"
      | "rose"
      | "slate";
    fields: string[];
    shownSet: Set<string>;
  }> = ({ title, color, fields, shownSet }) => {
    const bg = `bg-${color}-50`;
    const border = `border-${color}-200`;
    const text = `text-${color}-600`;
    const visible = fields.filter((k) => show((data as any)[k]));
    if (!visible.length) return null;
    visible.forEach((k) => shownSet.add(k));
    return (
      <div className={`${bg} rounded-lg p-4 border ${border}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xl ${text} font-semibold`}>{title}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map((k) => (
            <FieldCard
              key={k}
              label={
                LABELS[k] ||
                k.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              }
              value={formatValue(k, (data as any)[k])}
            />
          ))}
        </div>
      </div>
    );
  };

  // -- Importance order
  const shown = new Set<string>();

  const keySpecs = [
    "commercialName",
    // "commercialNickname",
    "manufacturerName",
    // "tozeret_nm",
    // "modelName",
    "subModelTitle",
    "carYear",
    "enginePower",
    // "koah_sus",
    "engineCapacity",
    // "nefah_manoa",
    "fuelType",
    "transmission",
    "driveType",
    "bodyType",
    "seatingCapacity",
    "doors",
  ];

  const drivetrainTires = ["frontTires", "rearTires"];

  const dimensionsCap = [
    "totalWeight",
    // "mishkal_kolel",
    "height",
    "kosher_grira_im_blamim",
    "kosher_grira_bli_blamim",
    "fuelTankCapacity",
    "fuelTankCapacityWithoutReserve",
  ];

  const safetyADAS = [
    "abs",
    "airbags",
    "powerWindows",
    "safetyRating",
    "safetyRatingWithoutSeatbelts",
    "bakarat_stiya_menativ_ind",
    "bakarat_stiya_menativ_makor_hatkana",
    "nitur_merhak_milfanim_ind",
    "nitur_merhak_milfanim_makor_hatkana",
    "shlita_automatit_beorot_gvohim_ind",
    "teura_automatit_benesiya_kadima_ind",
    "hayshaney_lahatz_avir_batzmigim_ind",
    "zihuy_holchey_regel_ind",
    "zihuy_tamrurey_tnua_ind",
    "zihuy_rechev_do_galgali",
  ];

  const emissions = [
    "co2Emission",
    "noxEmission",
    "pmEmission",
    "hcEmission",
    "coEmission",
    "greenIndex",
    "pollutionGroup",
    "kamut_CO2",
    "kamut_CO",
    "kamut_HC",
    "kamut_HC_NOX",
    "kamut_NOX",
    "kamut_PM10",
    "kamut_CO2_city",
    "kamut_CO2_hway",
    "kamut_CO_city",
    "kamut_CO_hway",
    "kamut_HC_city",
    "kamut_HC_hway",
    "kamut_NOX_city",
    "kamut_NOX_hway",
    "kamut_PM10_city",
    "kamut_PM10_hway",
  ];

  const ownershipDates = ["owner", "dateOnRoad", "lastTestDate", "tokefTestDate"];

  const identifiers = [
    "frameNumber",
    "modelId",
    "subModelId",
    "manufacturerId",
    "tozeret_cd",
    "sug_degem",
    "sug_mamir_cd",
    "sug_mamir_nm",
    "sug_tkina_cd",
    "sug_tkina_nm",
  ];

  const colors = ["yad2CarTitle", "carColorGroupID", "yad2ColorID"];

  const allKeys = Object.keys(data || {});
  // We'll compute `otherKeys` after sections render to populate `shown`
  // but since we need it now, we’ll compute it on the current `shown` (will be updated as sections render)
  // To fix order, we’ll render sections first, then compute others.
  return (
    <div className="space-y-4">
      <Section
        title={`🔑 ${tLabel("key_specs", "Key Specifications")}`}
        color="blue"
        fields={keySpecs}
        shownSet={shown}
      />
      <Section
        title={`📜 ${tLabel("ownership_dates", "Ownership & Dates")}`}
        color="rose"
        fields={ownershipDates}
        shownSet={shown}
      />
       <Section
        title={`🎨 ${tLabel("colors", "Colors")}`}
        color="orange"
        fields={colors}
        shownSet={shown}
      />
      <Section
        title={`🛞 ${tLabel("drivetrain_tires", "Drivetrain & Tires")}`}
        color="orange"
        fields={drivetrainTires}
        shownSet={shown}
      />
      <Section
        title={`📏 ${tLabel("dimensions_capacities", "Dimensions & Capacities")}`}
        color="violet"
        fields={dimensionsCap}
        shownSet={shown}
      />
      <Section
        title={`🛡️ ${tLabel("safety_adas", "Safety & ADAS")}`}
        color="yellow"
        fields={safetyADAS}
        shownSet={shown}
      />
      
      <Section
        title={`🌱 ${tLabel("emissions_environment", "Emissions & Environment")}`}
        color="emerald"
        fields={emissions}
        shownSet={shown}
      />
      
      <Section
        title={`🔖 ${tLabel("identifiers", "Identifiers")}`}
        color="slate"
        fields={identifiers}
        shownSet={shown}
      />
     

      {/* Other Fields (anything not shown above) */}
      {/* {(() => {
        const shownNow = shown;
        const otherKeys = allKeys.filter((k) => show((data as any)[k]) && !shownNow.has(k));
        if (!otherKeys.length) return null;
        return (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl text-slate-700 font-semibold">
                📦 {tLabel("other_fields", "Other Fields")}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherKeys.map((k) => (
                <FieldCard
                  key={k}
                  label={
                    LABELS[k] ||
                    k.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                  }
                  value={formatValue(k, (data as any)[k])}
                />
              ))}
            </div>
          </div>
        );
      })()} */}
    </div>
  );
};

export default CarDetailsSections;
