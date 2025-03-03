"use client";

import React from "react";
import { Img } from "@/components/Img";
import { useTranslations } from "next-intl";

const categories = [
  { key: "air_intake_systems", icon: "air-intake-systems.avif" },
  { key: "batteries_starting_charging", icon: "batteries-icon.png" },
  { key: "body_armor_protection", icon: "body-armor-icon.webp" },
  { key: "brakes_rotors_pads", icon: "brakes-icon.webp" },
  { key: "bumpers", icon: "bumpers-icon.webp" },
  { key: "cooling", icon: "cooling-icon.webp" },
  { key: "deflectors", icon: "deflectors-icon.webp" },
  { key: "detailing", icon: "detailing-image.webp" },
  { key: "drivetrain", icon: "drivetrain-icon.webp" },
  { key: "engine_components", icon: "engine-components-icon.webp" },
  { key: "exhaust_mufflers_tips", icon: "exhaust-icon.webp" },
  { key: "exterior_styling", icon: "exterior-styling-icon.webp" },
  { key: "fabrication", icon: "fabrication-icon.webp" },
  { key: "fender_flares_trim", icon: "fender-flares-icon.webp" },
  { key: "air_filters", icon: "filters-icon.webp" },
  { key: "flooring_floor_mats", icon: "floor-mats-icon.webp" },
  { key: "forced_induction", icon: "forced-induction-icon.webp" },
  { key: "fuel_delivery", icon: "fuel-delivery-icon.webp" },
  { key: "gauges_pods", icon: "gauges-icon.webp" },
  { key: "grilles", icon: "grilles-icon.webp" },
  { key: "ignition", icon: "ignition-icon.webp" },
  { key: "interior_accessories", icon: "interior-accessories-icon.webp" },
  { key: "lights", icon: "lights-icon.webp" },
  { key: "nerf_bars_running_boards", icon: "nerf-bars-icon.webp" },
  { key: "oil_oil_filters", icon: "oil-icon.webp" },
  { key: "programmers_chips", icon: "programmers-icon.webp" },
  { key: "roof_racks_truck_racks", icon: "roof-rack-icon.webp" },
  { key: "safety", icon: "safety-icon.webp" },
  { key: "soft_hard_tops", icon: "soft-hard-tops-image.webp" },
  { key: "suspension", icon: "suspension-icon.webp" },
  { key: "tires_racing_offroading_drifting", icon: "tire-image.avif" },
  { key: "tonneau_covers", icon: "tonneau-covers-icon.webp" },
  { key: "trailer_hitches", icon: "trailer-hitches-icon.webp" },
  { key: "truck_bed_accessories", icon: "truck-bed-icon.webp" },
  { key: "truck_bed_liners", icon: "truck-bed-liners-image.webp" },
  { key: "wheel_tire_accessories", icon: "wheel-tire-acc-image.avif" },
  { key: "wheels", icon: "wheels-icon.webp" },
  { key: "winches", icon: "winches-icon.webp" }
];

const CategoriesPage = () => {
  const t = useTranslations("Categories");

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">{t("page_title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <div key={category.key} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
            <Img src={category.icon} width={80} height={80} alt={t(category.key)} />
            <p className="text-center text-sm font-semibold">{t(category.key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
