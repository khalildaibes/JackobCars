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
import ProductCard from "../../../components/ProductCard";
import ServiceCard from "../../../components/ServiceCard";
import PartCard from "../../../components/PartCard";
import CarCard from "../../../components/CarCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  store: any;
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
      make: string;
      body_type: string;
    };
  };
  video?: { url: string }[];
  colors?: { name: string; quantity: number }[];
  categories: string | string[];
  type: 'product';
}

interface Service {
  id: string;
  name: string;
  slug: string;
  store: any;
  price: number;
  images: { url: string };
  description: string;
  duration: string;
  categories: string | string[];
  type: 'service';
}

interface Part {
  id: string;
  name: string;
  slug: string;
  store: any;
  quantity: number;
  price: number;
  images: { url: string }[];
  description: string;
  compatibility: string[];
  categories: string | string[];
  type: 'part';
}

type Item = Product | Service | Part;

interface ProductsClientProps {
  products: Item[];
}

function isProduct(item: Item): item is Product {
  return item.type === 'product';
}

function isService(item: Item): item is Service {
  return item.type === 'service';
}

function isPart(item: Item): item is Part {
  return item.type === 'part';
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

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const cats = item.categories;
        const nameMatch = item.name.toLowerCase().includes(query);
        const categoryMatch = typeof cats === 'string' 
          ? cats.toLowerCase().includes(query)
          : Array.isArray(cats) && cats.some(cat => cat.toLowerCase().includes(query));

        if (isProduct(item)) {
          return nameMatch || 
                 categoryMatch ||
                 item.details.car.fuel.toLowerCase().includes(query) ||
                 item.details.car.transmission.toLowerCase().includes(query);
        } else if (isService(item)) {
          return nameMatch || 
                 categoryMatch ||
                 item.duration.toLowerCase().includes(query) ||
                 item.description.toLowerCase().includes(query);
        } else if (isPart(item)) {
          return nameMatch || 
                 categoryMatch ||
                 item.description.toLowerCase().includes(query) ||
                 item.compatibility.some(comp => comp.toLowerCase().includes(query));
        }
        return nameMatch || categoryMatch;
      });
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => {
        const cats = item.categories;
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

  // Get unique categories
  const categories = React.useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach(product => {
      const cats = product.categories;
      if (typeof cats === 'string') {
        cats.split(',').forEach(cat => {
          const trimmedCat = cat?.toString().trim();
          if (trimmedCat) categorySet.add(trimmedCat);
        });
      } else if (Array.isArray(cats)) {
        cats.forEach(cat => {
          const trimmedCat = cat?.toString().trim();
          if (trimmedCat) categorySet.add(trimmedCat);
        });
      }
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Debug logging
  React.useEffect(() => {
    console.log('Products:', products);
    console.log('Filtered Products:', filteredProducts);
  }, [products, filteredProducts]);

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

  const renderProductDetails = (item: Product) => (
    <>
      <div className="mt-2 flex items-center gap-2 text-gray-600">
        <Clock size={16} />
        <span>{item.details.car.miles}</span>
        <span className="mx-2">•</span>
        <span>{item.details.car.fuel}</span>
        <span className="mx-2">•</span>
        <div className="flex items-center gap-1">
          {item.store && (
            <div className="flex items-center gap-2">
              {item.details.car.store.logo && (
                <img 
                  src={`http://64.227.112.249${item.details.car.store.logo}`}
                  alt={item.details.car.store.name}
                  className="w-4 h-4 object-contain"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {item.details.car.store.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{item.details.car.store.rating}</span>
                  <span className="mx-1">•</span>
                  <MapPin size={12} />
                  <span>{item.details.car.store.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">
          ${item.price.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {item.details.car.transmission}
          </span>
        </div>
      </div>
    </>
  );

  const renderServiceDetails = (item: Service) => (
    <div className="mt-2 text-gray-600">
      <p>{item.duration}</p>
      <p className="line-clamp-2">{item.description}</p>
      <div className="mt-4">
        <span className="text-2xl font-bold text-blue-600">
          ${item.price.toLocaleString()}
        </span>
      </div>
    </div>
  );

  const renderPartDetails = (item: Part) => (
    <div className="mt-2 text-gray-600">
      <p>Compatibility: {item.compatibility?.join(', ')}</p>
      <p className="line-clamp-2">{item.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">
          ${item.price.toLocaleString()}
        </span>
        <span className="text-sm text-gray-600">
          {item.quantity} in stock
        </span>
      </div>
    </div>
  );

  const renderBadges = (item: Item) => {
    if (!isProduct(item)) return null;
    const product = item as Product;
    if (!product.details?.car?.badges) return null;
    
    return product.details.car.badges.map((badge, index) => (
      <span
        key={index}
        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium`}
        style={{
          backgroundColor: badge.color,
          color: badge.textColor
        }}
      >
        {badge.label}
      </span>
    ));
  };

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
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-6`}
          >
            {filteredProducts.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={` ${
                  viewMode === 'list' ? 'flex gap-6' : ''
                }`}
              >
                {isProduct(item) && (
                  <CarCard 
                    key={item.id} 
                    car={{
                      id: item.id,
                      hostname: item.store?.hostname,
                      slug: item.slug,
                      mainImage: item.images?.[0]?.url || "/default-product.png",
                      title: item.name,
                      year: item.details?.car?.year || new Date().getFullYear(),
                      mileage: item.details?.car?.miles || "N/A",
                      price: `$${item.price.toLocaleString()}`,
                      bodyType: item.details?.car?.body_type || "Unknown",
                      fuelType: item.details?.car?.fuel || "Unknown",
                      make: item.details?.car?.make || "Unknown",
                      condition: "Used",
                      transmission: item.details?.car?.transmission || "Automatic",
                      description: item.details?.car?.features?.map(f => f.value).join(", ") || "",
                      features: item.details?.car?.features?.map(f => f.value) || []
                    }} 
                    variant={viewMode === 'list' ? 'list' : 'grid'}
                  />
                )}
                {isService(item) && (
                  <ServiceCard 
                    key={item.id} 
                    slug={item.slug}
                    id={item.id.toString()}
                    title={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.images}
                    stores={[item.store]}
                    hostname={item.store?.hostname}
                  />
                )}
                {isPart(item) && (
                  <PartCard 
                    key={item.id} 
                    part={{
                      id: parseInt(item.id),
                      images: item.images,
                      title: item.name,
                      slug: item.slug,
                      price: `$${item.price.toLocaleString()}`,
                      description: item.description,
                      features: item.compatibility,
                      categories: Array.isArray(item.categories) 
                        ? item.categories.map(cat => ({ name: cat }))
                        : typeof item.categories === 'string' 
                          ? [{ name: item.categories }] 
                          : [],
                      store: { 
                        hostname: item.store?.hostname || '' 
                      }
                    }} 
                  />
                )}
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
