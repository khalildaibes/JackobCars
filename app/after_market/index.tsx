"use client";

import React, { useState } from "react";
import { Img } from "../../components/Img";
import { useTranslations } from "next-intl";
import { Link } from "react-alice-carousel";
interface Category {
  key: string;
  icon: string;
  type: "stores" | "services" | "parts"; // Restrict type values
}

// Define the categories array with proper types
const categories: Category[] = [
  { key: "air_intake_systems", icon: "air-intake-systems.avif", type: "parts" },
  { key: "batteries_starting_charging", icon: "batteries-icon.png", type: "parts" },
  { key: "body_armor_protection", icon: "body-armor-icon.webp", type: "parts" },
  { key: "brakes_rotors_pads", icon: "brakes-icon.webp", type: "parts" },
  { key: "bumpers", icon: "bumpers-icon.webp", type: "parts" },
  { key: "cooling", icon: "cooling-icon.webp", type: "parts" },
  { key: "deflectors", icon: "deflectors-icon.webp", type: "parts" },
  { key: "detailing", icon: "detailing-image.webp", type: "services" },
  { key: "drivetrain", icon: "drivetrain-icon.webp", type: "parts" },
  { key: "engine_components", icon: "engine-components-icon.webp", type: "parts" },
  { key: "exhaust_mufflers_tips", icon: "exhaust-icon.webp", type: "parts" },
  { key: "exterior_styling", icon: "exterior-styling-icon.webp", type: "parts" },
  { key: "fabrication", icon: "fabrication-icon.webp", type: "services" },
  { key: "fender_flares_trim", icon: "fender-flares-icon.webp", type: "parts" },
  { key: "air_filters", icon: "filters-icon.webp", type: "parts" },
  { key: "flooring_floor_mats", icon: "floor-mats-icon.webp", type: "parts" },
  { key: "forced_induction", icon: "forced-induction-icon.webp", type: "parts" },
  { key: "fuel_delivery", icon: "fuel-delivery-icon.webp", type: "parts" },
  { key: "gauges_pods", icon: "gauges-icon.webp", type: "parts" },
  { key: "grilles", icon: "grilles-icon.webp", type: "parts" },
  { key: "ignition", icon: "ignition-icon.webp", type: "parts" },
  { key: "interior_accessories", icon: "interior-accessories-icon.webp", type: "parts" },
  { key: "lights", icon: "lights-icon.webp", type: "parts" },
  { key: "nerf_bars_running_boards", icon: "nerf-bars-icon.webp", type: "parts" },
  { key: "oil_oil_filters", icon: "oil-icon.webp", type: "parts" },
  { key: "programmers_chips", icon: "programmers-icon.webp", type: "parts" },
  { key: "roof_racks_truck_racks", icon: "roof-rack-icon.webp", type: "parts" },
  { key: "safety", icon: "safety-icon.webp", type: "parts" },
  { key: "soft_hard_tops", icon: "soft-hard-tops-image.webp", type: "parts" },
  { key: "suspension", icon: "suspension-icon.webp", type: "parts" },
  { key: "tires_racing_offroading_drifting", icon: "tire-image.avif", type: "parts" },
  { key: "tonneau_covers", icon: "tonneau-covers-icon.webp", type: "parts" },
  { key: "trailer_hitches", icon: "trailer-hitches-icon.webp", type: "parts" },
  { key: "truck_bed_accessories", icon: "truck-bed-icon.webp", type: "parts" },
  { key: "truck_bed_liners", icon: "truck-bed-liners-image.webp", type: "parts" },
  { key: "wheel_tire_accessories", icon: "wheel-tire-acc-image.avif", type: "parts" },
  { key: "wheels", icon: "wheels-icon.webp", type: "parts" },
  { key: "winches", icon: "winches-icon.webp", type: "parts" },
  { key: "auto_parts_store", icon: "auto-parts-store-icon.webp", type: "stores" },
  { key: "repair_services", icon: "repair-services-icon.webp", type: "services" },
  { key: "car_wash", icon: "car-wash-icon.webp", type: "services" },
  { key: "tire_shops", icon: "tire-shops-icon.webp", type: "stores" },
  { key: "vehicle_rentals", icon: "vehicle-rentals-icon.webp", type: "stores" },
];

const parts = categories.filter(cat => cat.type === "parts");
const stores = categories.filter(cat => cat.type === "stores");
const services = categories.filter(cat => cat.type === "services");
const FILTERS = ["stores", "services", "parts"];



const CategoriesPage = () => {
  const t = useTranslations("Categories");
  const [selectedFilter, setSelectedFilter] = useState("parts");
  return (
    <div className="p-6 bg-gray-100 mt-[25%] md:mt-[5%]">
       {/* Tabs for Filtering */}
       <div className="flex justify-center gap-4 mb-6 ">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 text-sm font-medium border rounded-md transition duration-300  
              ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white"  // Selected state (active filter)
                  : "bg-white text-gray-700 "
              }`}
          >
            {t(filter)}
          </button>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">{t("page_title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
        {categories.filter((category) => category.type === selectedFilter).map((category) => (
          <Link href={`/category1/${category.key}`}>
          <div key={category.key} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:bg-blue-600 hover:text-white">
            <Img src={category.icon} width={80} height={80} alt={t(category.key)} />
            <p className="text-center text-sm font-semibold">{t(category.key)}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
