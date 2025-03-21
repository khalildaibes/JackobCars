"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, MapPin, Star, Phone, Mail, Loader2, Store } from "lucide-react";
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

export default function StoresPage() {
  const t = useTranslations("Stores");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (showFeaturedOnly) params.append("featured", "true");
      
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
  }, [searchTerm, showFeaturedOnly]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-24">
        {/* Header Section */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 mb-4">
              {t("title")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 
                pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                shadow-sm"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="mt-4 flex items-center justify-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded border-gray-300 
                  focus:ring-emerald-500"
                />
                <span className="text-gray-700">{t("filter_featured")}</span>
              </label>
            </div>
          </motion.div>

          {/* Stores Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={40} className="text-emerald-600" />
              </motion.div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Store size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchStores}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                transition-colors"
              >
                {t("try_again")}
              </button>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12">
              <Store size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">{t("no_results")}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
            >
              {stores.map((store) => (
                <motion.div
                  key={store.id}
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg 
                  hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Img
                      src={store.image}
                      alt={store.name}
                      external={true}
                      width={328}
                      height={218}
                      className="object-cover"
                    />
                    {store.featured && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 
                      rounded-full text-sm font-medium">
                        {t("featured_stores")}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{store.name}</h3>
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-2 text-gray-700">{store.rating}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">{store.reviewCount} {t("reviews")}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                      <span>{store.location}</span>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">{t("specialties")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {store.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <a
                            href={`tel:${store.contact.phone}`}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                          >
                            <Phone size={20} />
                          </a>
                          <a
                            href={`mailto:${store.contact.email}`}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                          >
                            <Mail size={20} />
                          </a>
                        </div>
                        <button
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                          transition-colors text-sm font-medium"
                        >
                          {t("view_details")}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
  );
} 