"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Heading } from "../../../components/Heading";
import { Text } from "../../../components/Text";
import { SelectBox } from "../../../components/SelectBox";
import { Img } from "../../../components/Img";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Star, Tag, Clock, Grid, List, X, MapPin } from "lucide-react";

interface Product {
  store: any;
  id: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  images: { url: string }[];
  details: {
    car: {
      cons: string[];
      pros: string[];
      fuel: string;
      year: number;
      miles: string;
      price: number;
      store: {
        id: number;
        name: string;
        logo?: string;
        rating: number;
        location: string;
      } | null;
      make: string;
      body_type: string;
      badges: { color: string; label: string; textColor: string }[];
      images: {
        main: string;
        additional: string[];
      };
      actions: {
        save: { icon: string; label: string };
        share: { icon: string; label: string };
        compare: { icon: string; label: string };
      };
      mileage: string;
      features: { icon: string; label: string; value: string }[];
      transmission: string;
      dimensions_capacity: { label: string; value: string }[];
      engine_transmission_details: { label: string; value: string }[];
    };
  };
  video?: { url: string }[];
  colors?: { name: string; quantity: number }[];
  categories: string | string[];
}

interface ProductsClientProps {
  products: Product[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const t = useTranslations("Products");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowFilters(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique categories
  const categories = React.useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach(product => {
      const cats = product.categories;
      if (typeof cats === 'string') {
        cats.split(',').forEach(cat => {
          const trimmedCat = cat.trim();
          if (trimmedCat) categorySet.add(trimmedCat);
        });
      } else if (Array.isArray(cats)) {
        cats.forEach(cat => {
          if (cat) categorySet.add(cat.trim());
        });
      }
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const cats = product.categories;
        return (
          product.name.toLowerCase().includes(query) ||
          product.details.car.fuel.toLowerCase().includes(query) ||
          product.details.car.transmission.toLowerCase().includes(query) ||
          (typeof cats === 'string' 
            ? cats.toLowerCase().includes(query)
            : Array.isArray(cats) && cats.some(cat => cat.toLowerCase().includes(query)))
        );
      });
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => {
        const cats = product.categories;
        if (typeof cats === 'string') {
          return cats
            .split(',')
            .map(cat => cat.trim())
            .includes(selectedCategory);
        }
        return Array.isArray(cats) && cats.includes(selectedCategory);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (selectedSort === "price_low") {
        return a.price - b.price;
      } else if (selectedSort === "price_high") {
        return b.price - a.price;
      }
      // Default to latest
      return parseInt(b.id) - parseInt(a.id);
    });

    return filtered;
  }, [products, selectedCategory, selectedSort, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSort("latest");
    setSearchQuery("");
  };

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
      transition: { duration: 0.3 }
    }
  };
  console.log(products);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-[5%]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm py-8 shadow-lg sticky top-0 z-10"
      >
        <div className="container mx-auto px-4">
          <Heading size="heading2xl" className="mt-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {t("after_market_listings")}
          </Heading>
          <Text className="text-gray-600 mt-2">{t("listings_description")}</Text>
        </div>
      </motion.div>

      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
        {/* Search and Filter Controls */}
        <div className="w-full lg:w-1/4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white/80 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mobile Filters Toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:hidden w-full px-4 py-3 bg-white rounded-xl shadow-sm flex items-center justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <Filter size={20} />
              <span>{t("filters")}</span>
            </div>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </motion.button>

          {/* Filters */}
          <AnimatePresence>
            {(showFilters || !isMobile) && (
              <motion.div
                initial={isMobile ? { opacity: 0, height: 0 } : { opacity: 1 }}
                animate={isMobile ? { opacity: 1, height: "auto" } : { opacity: 1 }}
                exit={isMobile ? { opacity: 0, height: 0 } : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Categories */}
                <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Heading size="text5xl" className="text-lg font-medium text-gray-800">
                      {t("categories")}
                    </Heading>
                    {selectedCategory !== "All" && (
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {t("clear")}
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory("All")}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedCategory === "All"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>All</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          selectedCategory === "All" ? "bg-white/20" : "bg-gray-100"
                        }`}>
                          {products.length}
                        </span>
                      </div>
                    </motion.button>
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category}</span>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            selectedCategory === category ? "bg-white/20" : "bg-gray-100"
                          }`}>
                            {products.filter(p => {
                              const cats = p.categories;
                              if (typeof cats === 'string') {
                                return cats.split(',').map(c => c.trim()).includes(category);
                              }
                              return Array.isArray(cats) && cats.includes(category);
                            }).length}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Heading size="text5xl" className="text-lg font-medium text-gray-800">
                      {t("sort_by")}
                    </Heading>
                    {selectedSort !== "latest" && (
                      <button
                        onClick={() => setSelectedSort("latest")}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {t("reset")}
                      </button>
                    )}
                  </div>
                  <SelectBox
                    shape="square"
                    name="sortOptions"
                    placeholder={t("sort_placeholder")}
                    options={[
                      { label: t("sort_latest"), value: "latest" },
                      { label: t("sort_price_low"), value: "price_low" },
                      { label: t("sort_price_high"), value: "price_high" },
                    ]}
                    value={selectedSort}
                    onChange={(option) => setSelectedSort(option.value)}
                    className="w-full bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Active Filters Summary */}
                {(selectedCategory !== "All" || selectedSort !== "latest" || searchQuery) && (
                  <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <Heading size="text5xl" className="text-lg font-medium text-gray-800">
                        {t("active_filters")}
                      </Heading>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {t("clear_all")}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedCategory !== "All" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t("category")}:</span>
                          <span className="font-medium">{selectedCategory}</span>
                        </div>
                      )}
                      {selectedSort !== "latest" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t("sort")}:</span>
                          <span className="font-medium">
                            {selectedSort === "price_low" ? t("sort_price_low") : t("sort_price_high")}
                          </span>
                        </div>
                      )}
                      {searchQuery && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t("search")}:</span>
                          <span className="font-medium">{searchQuery}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid */}
        <main className="w-full lg:w-3/4">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
            <Text as="p" className="text-sm text-gray-700">
              {t("showing_results", { count: filteredProducts.length })}
            </Text>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={t("grid_view")}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={t("list_view")}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Products Display */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
            }
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex gap-6' : ''
                }`}
              >
                <Link href={`/product/${product.id}`} className="block w-full">
                  <div className={`relative ${viewMode === 'list' ? 'w-48' : 'w-full'}`}>
                    <Img
                      src={product.images?.[0]?.url || "/default-product.png"}
                      alt={product.name}
                      external={true}
                      width={viewMode === 'list' ? 192 : 384}
                      height={viewMode === 'list' ? 192 : 384}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    {product.details.car.badges?.map((badge, index) => (
                      <span
                        key={index}
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium`}
                        style={{
                          backgroundColor: badge.color || '#4B5563',
                          color: badge.textColor || '#FFFFFF'
                        }}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{product.details.car.miles}</span>
                      <span className="mx-2">•</span>
                      <span>{product.details.car.fuel}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center gap-1">
                        {product.details.car.store ? (
                          <div className="flex items-center gap-2">
                            {product.details.car.store.logo ? (
                              <img 
                                src={`http://68.183.215.202${product.details.car.store.logo}`}
                                alt={product.details.car.store.name}
                                className="w-4 h-4 object-contain"
                              />
                            ) : (
                              <Tag size={16} className="text-blue-500" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {product.details.car.store.name}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                <span>{product.details.car.store.rating}</span>
                                <span className="mx-1">•</span>
                                <MapPin size={12} />
                                <span>{product.details.car.store.location}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Tag size={16} className="text-blue-500" />
                            <span className="font-medium">Unknown Store</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {product.details.car.transmission}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
            >
              <div className="flex flex-col items-center gap-4">
                <Tag size={48} className="text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("no_results_found")}
                </h3>
                <p className="text-gray-600">
                  {t("try_adjusting_filters")}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  {t("clear_filters")}
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
