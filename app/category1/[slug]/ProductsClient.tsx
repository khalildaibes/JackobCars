"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Heading } from "../../../components/Heading";
import { Text } from "../../../components/Text";
import { SelectBox } from "../../../components/SelectBox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../../components/Breadcrumb";
import { Img } from "../../../components/Img";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Star, Tag, Clock, Loader2, Grid, List } from "lucide-react";

interface Car {
  id: number;
  category: string;
  image: string;
  title: string;
  price: number;
  fuel: string;
  transmission: string;
}

interface ProductProps {
  product: any;
}

export default function ProductDetailsPage({ product }: ProductProps) {
  const t = useTranslations("Products");
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [carGrid, setCarGrid] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [carCategories, setCarCategories] = useState<{ label: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "latest");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/deals?category=${slug}`);
      if (!response.ok) throw new Error(t("fetch_error"));

      const productData = await response.json();
      if (!productData || !productData.data) throw new Error(t("invalid_response"));

      const formattedCars = productData.data.map((product: any) => ({
        id: product.id,
        category: product.categories || t("unknown_category"),
        image: product.image?.length ? `http://68.183.215.202${product.image[0].url}` : "/default-car.png",
        title: product.name || t("unknown_car"),
        price: product.price || 0,
        fuel: product.details?.car?.fuel || t("unknown_fuel"),
        transmission: product.details?.car?.transmission || t("unknown_transmission"),
      }));

      setCarGrid(formattedCars);
      setFilteredCars(formattedCars);
    } catch (error) {
      console.error("Error fetching products:", error);
      setCarGrid([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const categorySet = new Set<string>();

    carGrid.forEach((car) => {
      if (car.category) {
        car.category.split(",").forEach((cat) => {
          categorySet.add(cat.trim());
        });
      }
    });

    const uniqueCategories = Array.from(categorySet).sort().map((category) => ({
      label: category,
      count: carGrid.filter((car) => car.category.includes(category)).length,
    }));

    setCarCategories([{ label: "All", count: carGrid.length }, ...uniqueCategories]);
  }, [carGrid]);

  useEffect(() => {
    let filtered = [...carGrid];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((car) => car.category.split(",").map((c) => c.trim()).includes(selectedCategory));
    }

    if (selectedSort === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(filtered);
  }, [selectedCategory, selectedSort, carGrid]);

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(filterType, value);
    router.push(`?${params.toString()}`);

    if (filterType === "category") setSelectedCategory(value);
    if (filterType === "sort") setSelectedSort(value);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-[5%]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm py-8 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <Heading size="heading2xl" className="mt-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {t("after_market_listings")}
          </Heading>
          <Text className="text-gray-600 mt-2">{t("listings_description")}</Text>
        </div>
      </motion.div>

      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
        {/* Mobile Filters Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden w-full px-4 py-3 bg-white rounded-xl shadow-sm flex items-center justify-between"
          onClick={() => setShowFilters(!showFilters)}
          aria-label={t("filter_toggle")}
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

        {/* Filter Sidebar */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full lg:w-1/4 space-y-6"
            >
              <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <Heading size="text5xl" className="text-lg font-medium text-gray-800">{t("categories")}</Heading>
                <div className="mt-4 space-y-2">
                  {carCategories.map((cat) => (
                    <motion.button
                      key={cat.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFilterChange("category", cat.label)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedCategory === cat.label
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.label.replaceAll("_", " ")}</span>
                        <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                          {cat.count}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
                <Heading size="text5xl" className="text-lg font-medium text-gray-800">{t("sort_by")}</Heading>
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
                  onChange={(option) => handleFilterChange("sort", option.value)}
                  className="mt-4 w-full bg-cover bg-no-repeat px-3 text-gray-800"
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Car Listings Grid */}
        <main className="w-full lg:w-3/4">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <Text as="p" className="text-sm text-gray-700">
              {t("showing_results", { count: filteredCars.length })}
            </Text>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                aria-label={t("grid_view")}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                aria-label={t("list_view")}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                aria-label={t("loading_spinner")}
              >
                <Loader2 size={40} className="text-blue-600" />
              </motion.div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
              }
            >
              <Suspense fallback={<div className="text-center">{t("loading_cars")}</div>}>
                {filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/car-details/${car.id}`}>
                      <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden
                        ${viewMode === 'list' ? 'flex' : 'flex flex-col'}`}>
                        <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full h-48'}`}>
                          <Img
                            src={car.image}
                            width={328}
                            height={218}
                            className="h-full w-full object-cover"
                            external={true}
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                            ${car.price.toLocaleString()}
                          </div>
                        </div>
                        <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                          <Heading size="text5xl" as="p" className="text-lg font-semibold text-gray-800">
                            {car.title}
                          </Heading>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                              <Clock size={14} />
                              {t("fuel_type")}: {car.fuel}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                              <Tag size={14} />
                              {t("transmission")}: {car.transmission}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </Suspense>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
