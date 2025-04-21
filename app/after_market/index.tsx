"use client";

import React, { useState, useEffect } from "react";
import { Img } from "../../components/Img";
import { useTranslations } from "next-intl";
import { Link } from "react-alice-carousel";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter as FilterIcon, X, ChevronDown, Star, DollarSign, Clock, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Category {
  key: string;
  icon: string;
  type: "stores" | "services" | "parts";
  price_range?: "low" | "medium" | "high";
  rating?: number;
  availability?: "in_stock" | "limited" | "out_of_stock";
  location?: string;
}

// Update categories with additional properties
const categories: Category[] = [
  { 
    key: "air_intake_systems", 
    icon: "air-intake-systems.avif", 
    type: "parts",
    price_range: "medium",
    rating: 4.5,
    availability: "in_stock"
  },
  { 
    key: "batteries_starting_charging", 
    icon: "batteries-icon.png", 
    type: "parts",
    price_range: "low",
    rating: 4.3,
    availability: "in_stock"
  },
  { 
    key: "body_armor_protection", 
    icon: "body-armor-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.7,
    availability: "limited"
  },
  { 
    key: "brakes_rotors_pads", 
    icon: "brakes-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.6,
    availability: "in_stock"
  },
  { 
    key: "bumpers", 
    icon: "bumpers-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "cooling", 
    icon: "cooling-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.2,
    availability: "in_stock"
  },
  { 
    key: "deflectors", 
    icon: "deflectors-icon.webp", 
    type: "parts",
    price_range: "low",
    rating: 4.1,
    availability: "in_stock"
  },
  { 
    key: "detailing", 
    icon: "detailing-image.webp", 
    type: "services",
    price_range: "medium",
    rating: 4.8,
    availability: "in_stock"
  },
  { 
    key: "drivetrain", 
    icon: "drivetrain-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.5,
    availability: "limited"
  },
  { 
    key: "engine_components", 
    icon: "engine-components-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.7,
    availability: "in_stock"
  },
  { 
    key: "exhaust_mufflers_tips", 
    icon: "exhaust-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "exterior_styling", 
    icon: "exterior-styling-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.3,
    availability: "in_stock"
  },
  { 
    key: "fabrication", 
    icon: "fabrication-icon.webp", 
    type: "services",
    price_range: "high",
    rating: 4.9,
    availability: "limited"
  },
  { 
    key: "fender_flares_trim", 
    icon: "fender-flares-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.2,
    availability: "in_stock"
  },
  { 
    key: "air_filters", 
    icon: "filters-icon.webp", 
    type: "parts",
    price_range: "low",
    rating: 4.1,
    availability: "in_stock"
  },
  { 
    key: "flooring_floor_mats", 
    icon: "floor-mats-icon.webp", 
    type: "parts",
    price_range: "low",
    rating: 4.3,
    availability: "in_stock"
  },
  { 
    key: "forced_induction", 
    icon: "forced-induction-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.8,
    availability: "limited"
  },
  { 
    key: "fuel_delivery", 
    icon: "fuel-delivery-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "gauges_pods", 
    icon: "gauges-icon.webp", 
    type: "parts",
    price_range: "low",
    rating: 4.2,
    availability: "in_stock"
  },
  { 
    key: "grilles", 
    icon: "grilles-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.3,
    availability: "in_stock"
  },
  { 
    key: "ignition", 
    icon: "ignition-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.5,
    availability: "in_stock"
  },
  { 
    key: "interior_accessories", 
    icon: "interior-accessories-icon.webp", 
    type: "parts",
    price_range: "low",
    rating: 4.2,
    availability: "in_stock"
  },
  { 
    key: "lights", 
    icon: "lights-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.6,
    availability: "in_stock"
  },
  { 
    key: "nerf_bars_running_boards", 
    icon: "nerf-bars-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "oil_oil_filters", 
    icon: "oil-icon.webp", 
    type: "parts",
    price_range: "low",
    rating: 4.3,
    availability: "in_stock"
  },
  { 
    key: "programmers_chips", 
    icon: "programmers-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.7,
    availability: "limited"
  },
  { 
    key: "roof_racks_truck_racks", 
    icon: "roof-rack-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.5,
    availability: "in_stock"
  },
  { 
    key: "safety", 
    icon: "safety-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.8,
    availability: "in_stock"
  },
  { 
    key: "soft_hard_tops", 
    icon: "soft-hard-tops-image.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.6,
    availability: "limited"
  },
  { 
    key: "suspension", 
    icon: "suspension-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.7,
    availability: "in_stock"
  },
  { 
    key: "tires_racing_offroading_drifting", 
    icon: "tire-image.avif", 
    type: "parts",
    price_range: "high",
    rating: 4.8,
    availability: "in_stock"
  },
  { 
    key: "tonneau_covers", 
    icon: "tonneau-covers-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "trailer_hitches", 
    icon: "trailer-hitches-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.5,
    availability: "in_stock"
  },
  { 
    key: "truck_bed_accessories", 
    icon: "truck-bed-icon.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.3,
    availability: "in_stock"
  },
  { 
    key: "truck_bed_liners", 
    icon: "truck-bed-liners-image.webp", 
    type: "parts",
    price_range: "medium",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "wheel_tire_accessories", 
    icon: "wheel-tire-acc-image.avif", 
    type: "parts",
    price_range: "low",
    rating: 4.2,
    availability: "in_stock"
  },
  { 
    key: "wheels", 
    icon: "wheels-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.6,
    availability: "in_stock"
  },
  { 
    key: "winches", 
    icon: "winches-icon.webp", 
    type: "parts",
    price_range: "high",
    rating: 4.5,
    availability: "limited"
  },
  { 
    key: "auto_parts_store", 
    icon: "auto-parts-store-icon.webp", 
    type: "stores",
    price_range: "medium",
    rating: 4.7,
    availability: "in_stock"
  },
  { 
    key: "repair_services", 
    icon: "repair-services-icon.webp", 
    type: "services",
    price_range: "medium",
    rating: 4.8,
    availability: "in_stock"
  },
  { 
    key: "car_wash", 
    icon: "car-wash-icon.webp", 
    type: "services",
    price_range: "low",
    rating: 4.4,
    availability: "in_stock"
  },
  { 
    key: "tire_shops", 
    icon: "tire-shops-icon.webp", 
    type: "stores",
    price_range: "medium",
    rating: 4.6,
    availability: "in_stock"
  },
  { 
    key: "vehicle_rentals", 
    icon: "vehicle-rentals-icon.webp", 
    type: "stores",
    price_range: "high",
    rating: 4.5,
    availability: "limited"
  }
];

const FILTERS = ["stores", "services", "parts"];
const PRICE_RANGES = ["low", "medium", "high"];
const RATINGS = [1, 2, 3, 4, 5];
const AVAILABILITY = ["in_stock", "limited", "out_of_stock"];

interface CategoriesPageProps {
  initialCategory?: string;
}

const CategoriesPage = ({ initialCategory }: CategoriesPageProps) => {
  const t = useTranslations("Categories");
  const searchParams = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState("parts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Handle initial category from URL
  useEffect(() => {
    const category = searchParams.get("category") || initialCategory;
    if (category) {
      // Map URL categories to filter types
      const categoryMap: Record<string, string> = {
        "parts": "parts",
        "service-centers": "services",
        "maintenance-tips": "stores"
      };
      
      const mappedCategory = categoryMap[category];
      if (mappedCategory) {
        setSelectedFilter(mappedCategory);
      }
    }
  }, [searchParams, initialCategory]);

  const filteredCategories = categories
    .filter((category) => category.type === selectedFilter)
    .filter((category) => 
      t(category.key).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((category) => 
      selectedPriceRange.length === 0 || 
      (category.price_range && selectedPriceRange.includes(category.price_range))
    )
    .filter((category) => 
      !selectedRating || 
      (category.rating && category.rating >= selectedRating)
    )
    .filter((category) => 
      selectedAvailability.length === 0 || 
      (category.availability && selectedAvailability.includes(category.availability))
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 mt-[5%] ">
      <div className="max-w-7xl mx-auto ">
        {/* Header Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 bg-white rounded-lg "
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            {t("page_title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("page_description")}
          </p>
        </motion.div> */}

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6 rounded-lg py-4">
          {/* Search Bar with Filter Toggle */}
          <div className="flex gap-4 max-w-4xl mx-auto bg-white rounded-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                />
              </div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden px-6 py-3 rounded-2xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              <FilterIcon size={20} />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </motion.button>
          </div>

          {/* Advanced Filters - Desktop (Always Visible) */}
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTERS.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${selectedFilter === filter
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {t(filter)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} />
                    Price Range
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedPriceRange(
                            selectedPriceRange.includes(range)
                              ? selectedPriceRange.filter((r) => r !== range)
                              : [...selectedPriceRange, range]
                          );
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${selectedPriceRange.includes(range)
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Star size={16} />
                    Minimum Rating
                  </h3>
                  <div className="flex gap-2">
                    {RATINGS.map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                          ${selectedRating === rating
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Clock size={16} />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITY.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedAvailability(
                            selectedAvailability.includes(status)
                              ? selectedAvailability.filter((s) => s !== status)
                              : [...selectedAvailability, status]
                          );
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${selectedAvailability.includes(status)
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mt-6 flex items-center gap-4 border-t pt-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </motion.div>
          </div>

          {/* Advanced Filters - Mobile (Toggleable) */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white rounded-2xl p-6 shadow-xl"
              >
                {/* Same filter content as desktop */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Copy the same filter content from above */}
                  {/* Type Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {FILTERS.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setSelectedFilter(filter)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                            ${selectedFilter === filter
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {t(filter)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign size={16} />
                      Price Range
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setSelectedPriceRange(
                              selectedPriceRange.includes(range)
                                ? selectedPriceRange.filter((r) => r !== range)
                                : [...selectedPriceRange, range]
                            );
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                            ${selectedPriceRange.includes(range)
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                      <Star size={16} />
                      Minimum Rating
                    </h3>
                    <div className="flex gap-2">
                      {RATINGS.map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(rating)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                            ${selectedRating === rating
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                      <Clock size={16} />
                      Availability
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABILITY.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedAvailability(
                              selectedAvailability.includes(status)
                                ? selectedAvailability.filter((s) => s !== status)
                                : [...selectedAvailability, status]
                            );
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                            ${selectedAvailability.includes(status)
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mt-6 flex items-center gap-4 border-t pt-4">
                  <span className="text-gray-700 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {filteredCategories.map((category) => (
            <motion.div
              key={category.key}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/category1/${category.key}`}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
                      <Img
                        src={category.icon}
                        width={48}
                        height={48}
                        alt={t(category.key)}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <p className="text-center font-medium text-gray-800 line-clamp-2">
                        {t(category.key)}
                      </p>
                      {category.rating && (
                        <div className="flex items-center justify-center gap-1 text-sm text-yellow-500">
                          <Star size={14} fill="currentColor" />
                          <span>{category.rating}</span>
                        </div>
                      )}
                      {category.availability && (
                        <div className={`text-xs text-center px-2 py-1 rounded-full ${
                          category.availability === "in_stock" 
                            ? "bg-blue-100 text-blue-700"
                            : category.availability === "limited"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {category.availability.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <Search size={48} className="text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">
                {t("no_results_found")}
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedPriceRange([]);
                  setSelectedRating(null);
                  setSelectedAvailability([]);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
