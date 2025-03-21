"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { 
  Search, MapPin, Star, Phone, Mail, Loader2, Store, 
  SlidersHorizontal, X, ChevronDown, Clock, Heart, Share2, Navigation 
} from "lucide-react";
import { Img } from "../../components/Img";

interface Store {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  specialties: string[];
  openingHours: string;
  contact: {
    phone: string;
    email: string;
  };
  featured: boolean;
}


interface Filters {
  featured: boolean;
  minRating: number;
  location: string;
  specialty: string;
  sortBy: string;
  openingHours: string;
}

export default function StoresPage() {
  const t = useTranslations("Stores");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    featured: false,
    minRating: 0,
    location: "",
    specialty: "",
    sortBy: "",
    openingHours: "all"
  });

  // Add scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filters.featured) params.append("featured", "true");
      if (filters.minRating > 0) params.append("minRating", filters.minRating.toString());
      if (filters.location) params.append("location", filters.location);
      if (filters.specialty) params.append("specialty", filters.specialty);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.openingHours !== "all") params.append("openingHours", filters.openingHours);
      
      const response = await fetch(`/api/stores?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch stores");
      
      const data = await response.json();
      setStores(data.stores);
    } catch (err) {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [searchTerm, filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const FilterPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{t("filters.title")}</h3>
        <button
          onClick={() => setFilters({
            featured: false,
            minRating: 0,
            location: "",
            specialty: "",
            sortBy: "",
            openingHours: "all"
          })}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t("filters.clear_all")}
        </button>
      </div>

      {/* Featured Filter */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
            className="form-checkbox h-5 w-5 text-emerald-600 rounded border-gray-300"
          />
          <span>{t("filter_featured")}</span>
        </label>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters.rating_min")}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="text-sm text-gray-600 mt-1">{filters.minRating} / 5</div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters.location")}
        </label>
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">{t("filters.any_location")}</option>
          <option value="new_york">New York</option>
          <option value="los_angeles">Los Angeles</option>
          <option value="chicago">Chicago</option>
        </select>
      </div>

      {/* Specialty Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters.specialty")}
        </label>
        <select
          value={filters.specialty}
          onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">{t("filters.any_specialty")}</option>
          <option value="performance">Performance Parts</option>
          <option value="maintenance">Maintenance</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters.sort_by")}
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">{t("filters.sort_options.rating_high")}</option>
          <option value="rating_low">{t("filters.sort_options.rating_low")}</option>
          <option value="reviews_high">{t("filters.sort_options.reviews_high")}</option>
          <option value="reviews_low">{t("filters.sort_options.reviews_low")}</option>
          <option value="name_asc">{t("filters.sort_options.name_asc")}</option>
          <option value="name_desc">{t("filters.sort_options.name_desc")}</option>
        </select>
      </div>

      {/* Opening Hours Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters.hours")}
        </label>
        <select
          value={filters.openingHours}
          onChange={(e) => setFilters({ ...filters, openingHours: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="all">{t("filters.hours_options.all")}</option>
          <option value="open_now">{t("filters.hours_options.open_now")}</option>
          <option value="weekends">{t("filters.hours_options.open_weekends")}</option>
          <option value="24h">{t("filters.hours_options.open_24h")}</option>
        </select>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t("title")}
            </motion.h1>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t("subtitle")}
            </motion.p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Section */}
            <motion.div 
              className="lg:w-1/4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="text-emerald-600" size={20} />
                    <span className="font-medium">{t("filters.title")}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                  />
                </motion.button>
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {(showFilters || window.innerWidth >= 1024) && <FilterPanel />}
              </AnimatePresence>
            </motion.div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Search Bar */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 
                    pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    shadow-sm hover:shadow-md transition-all duration-300 text-lg"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-600" />
                </div>
              </motion.div>

              {/* Stores Grid */}
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={48} className="text-emerald-600" />
                  </motion.div>
                </motion.div>
              ) : error ? (
                <motion.div 
                  className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Store size={64} className="mx-auto text-gray-400 mb-6" />
                  <p className="text-gray-600 mb-6 text-lg">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchStores}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 
                    transition-colors shadow-md hover:shadow-lg font-medium"
                  >
                    {t("try_again")}
                  </motion.button>
                </motion.div>
              ) : stores.length === 0 ? (
                <motion.div 
                  className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Store size={64} className="mx-auto text-gray-400 mb-6" />
                  <p className="text-gray-600 text-lg">{t("no_results")}</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {stores.map((store) => (
                    <motion.div
                      key={store.id}
                      variants={itemVariants}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg 
                      hover:shadow-xl transition-all duration-500 group"
                    >
                      <div className="relative h-56">
                        <Img
                          src={store.image}
                          alt={store.name}
                          external={true}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {store.featured && (
                          <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 
                          rounded-full text-sm font-medium shadow-lg">
                            {t("featured_stores")}
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            <Heart className="h-5 w-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            <Share2 className="h-5 w-5 text-gray-700" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                          {store.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="ml-2 font-medium text-gray-700">{store.rating}</span>
                          </div>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-600">{store.reviewCount} {t("reviews")}</span>
                        </div>
                        <div className="flex items-start space-x-3 text-gray-600 mb-4">
                          <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-emerald-600" />
                          <span>{store.location}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600 mb-4">
                          <Clock className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                          <span>{store.openingHours}</span>
                        </div>
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-700 mb-3">{t("specialties")}</h4>
                          <div className="flex flex-wrap gap-2">
                            {store.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium
                                hover:bg-emerald-100 transition-colors cursor-default"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={`tel:${store.contact.phone}`}
                                className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                title={t("phone")}
                              >
                                <Phone size={20} />
                              </motion.a>
                              <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                href={`mailto:${store.contact.email}`}
                                className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                title={t("email")}
                              >
                                <Mail size={20} />
                              </motion.a>
                            </div>
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 
                                transition-colors text-sm font-medium flex items-center gap-2"
                              >
                                <Navigation size={16} />
                                {t("get_directions")}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 
                                transition-colors text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                              >
                                {t("view_details")}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 