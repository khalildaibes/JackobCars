import React from "react";
import Image from "next/image";
import { Img } from "../../components/Img";

// const categories = [
//   { name: "Apparel and Merchandise", icon: "merch_icon.webp" },
//   { name: "Brakes, Rotors & Pads", icon: "brakes_icon.webp" },
//   { name: "Cooling", icon: "cooling_icon.webp" },
//   { name: "Drivetrain", icon: "drivetrain_icon.webp" },
//   { name: "Detailing", icon: "detailing_icon.webp" },
//   { name: "Exhaust, Mufflers & Tips", icon: "exhaust_icon.webp" },
//   { name: "Suspension", icon: "suspension_icon.webp" },
//   { name: "Exterior Styling", icon: "exterior_styling_icon.webp" },
//   { name: "Oils & Oil Filters", icon: "oil_icon.webp" },
//   { name: "Forced Induction", icon: "forced_induction_icon.webp" },
//   { name: "Fuel Delivery", icon: "fuel_delivery_icon.webp" },
//   { name: "Tonneau Covers", icon: "tonnaeu_covers_icon.webp" },
//   { name: "Gauges & Pods", icon: "gauges_icon.webp" },
//   { name: "Air Intake Systems", icon: "air_intake_systems_icon.webp" },
//   { name: "Interior Accessories", icon: "interior_accessories_icon.webp" },
//   { name: "Fabrication", icon: "fabrication_icon.webp" },
//   { name: "Bumpers", icon: "bumpers_icon.webp" },
//   { name: "Body Armor & Protection", icon: "body_armor_icon.webp" },
//   { name: "Wheels", icon: "wheels_icon.webp" },
//   { name: "Trailer Hitches", icon: "trailer_hitches_icon.webp" },
//   { name: "Air Filters", icon: "filters_icon.webp" },
//   { name: "Roof Racks & Truck Racks", icon: "roof_rack_icon.webp" },
//   { name: "Truck Bed Accessories", icon: "truck_bed_icon.webp" },
//   { name: "Fender Flares & Trim", icon: "fender_flares_icon.webp" },
//   { name: "Lights", icon: "lights_icon.webp" },
//   { name: "Deflectors", icon: "deflectors_icon.webp" },
//   { name: "Ignition", icon: "ignition_icon.webp" },
//   { name: "Flooring and Floor Mats", icon: "floor_mats_icon.webp" },
//   { name: "Batteries, Starting & Charging", icon: "batteries_icon.webp" },
//   { name: "Winches", icon: "winches_icon.webp" },
//   { name: "Safety", icon: "safety_icon.webp" },
//   { name: "Grilles", icon: "grilles_icon.webp" },
//   { name: "Nerf Bars & Running Boards", icon: "nerf_bars_icon.webp" },
//   { name: "Engine Components", icon: "engine_components_icon.webp" },
//   { name: "Programmers & Chips", icon: "programmers_icon.webp" },
//   { name: "Truck Bed Liners", icon: "truck_bed_liners_image_icon.webp" },
//   { name: "Soft Tops & Hard Tops", icon: "soft_hard_tops_image_icon.webp" },
//   { name: "Wheel and Tire Accessories", icon: "wheel_tire_acc_image_icon.webp" },
//   { name: "Tires: Racing, Off-Roading, Drifting", icon: "asd.webp" },
// ];

const categories = [
  { name: "Air Intake Systems", icon: "air-intake-systems.avif" },
  { name: "Batteries, Starting & Charging", icon: "batteries-icon.png" },
  { name: "Body Armor & Protection", icon: "body-armor-icon.webp" },
  { name: "Brakes, Rotors & Pads", icon: "brakes-icon.webp" },
  { name: "Bumpers", icon: "bumpers-icon.webp" },
  { name: "Cooling", icon: "cooling-icon.webp" },
  { name: "Deflectors", icon: "deflectors-icon.webp" },
  { name: "Detailing", icon: "detailing-image.webp" },
  { name: "Drivetrain", icon: "drivetrain-icon.webp" },
  { name: "Engine Components", icon: "engine-components-icon.webp" },
  { name: "Exhaust, Mufflers & Tips", icon: "exhaust-icon.webp" },
  { name: "Exterior Styling", icon: "exterior-styling-icon.webp" },
  { name: "Fabrication", icon: "fabrication-icon.webp" },
  { name: "Fender Flares & Trim", icon: "fender-flares-icon.webp" },
  { name: "Air Filters", icon: "filters-icon.webp" },
  { name: "Flooring and Floor Mats", icon: "floor-mats-icon.webp" },
  { name: "Forced Induction", icon: "forced-induction-icon.webp" },
  { name: "Fuel Delivery", icon: "fuel-delivery-icon.webp" },
  { name: "Gauges & Pods", icon: "gauges-icon.webp" },
  { name: "Grilles", icon: "grilles-icon.webp" },
  { name: "Ignition", icon: "ignition-icon.webp" },
  { name: "Interior Accessories", icon: "interior-accessories-icon.webp" },
  { name: "Lights", icon: "lights-icon.webp" },
  { name: "Nerf Bars & Running Boards", icon: "nerf-bars-icon.webp" },
  { name: "Oil & Oil Filters", icon: "oil-icon.webp" },
  { name: "Programmers & Chips", icon: "programmers-icon.webp" },
  { name: "Roof Racks & Truck Racks", icon: "roof-rack-icon.webp" },
  { name: "Safety", icon: "safety-icon.webp" },
  { name: "Soft Tops & Hard Tops", icon: "soft-hard-tops-image.webp" },
  { name: "Suspension", icon: "suspension-icon.webp" },
  { name: "Tires: Racing, Off-Roading, Drifting", icon: "tire-image.avif" },
  { name: "Tonneau Covers", icon: "tonneau-covers-icon.webp" },
  { name: "Trailer Hitches", icon: "trailer-hitches-icon.webp" },
  { name: "Truck Bed Accessories", icon: "truck-bed-icon.webp" },
  { name: "Truck Bed Liners", icon: "truck-bed-liners-image.webp" },
  { name: "Wheel and Tire Accessories", icon: "wheel-tire-acc-image.avif" },
  { name: "Wheels", icon: "wheels-icon.webp" },
  { name: "Winches", icon: "winches-icon.webp" },
];



const CategoriesPage = () => {
  return (
    <div className="p-6 bg-gray-100 ">
      <div className="mt-[5%]">
      <h1 className="text-3xl font-bold text-center mb-6">Performance Auto Parts for Cars and Trucks</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <Img src={category.icon} width={80} height={80} alt={category.name} className="mb-2 " />
            <p className="text-center text-sm font-semibold">{category.name}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default CategoriesPage;