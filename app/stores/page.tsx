"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Loader2, MapPin, Phone, Globe, Tag, Eye, Store as StoreIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Store {
  id: number;
  name: string;
  slug: string;
  phone: string;
  address: string;
  details: string;
  hostname: string;
  visits: number;
  tags: string;
  provider?: string;
}

export default function StoresPage() {
  const t = useTranslations("Stores");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error("Failed to fetch stores");
        const data = await response.json();
        setStores(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-gray-700"
        >
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading stores...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-24">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600">
            Our Partner Stores
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our network of trusted automotive stores, each offering unique services and products
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stores by name, services, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 
                pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                shadow-sm hover:shadow-md transition-all duration-300 text-lg"
              />
              <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Link href={`/stores/${store.slug}`} key={store.slug}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
              >
                {/* Store Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{store.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{store.visits} visits</span>
                      </div>
                    </div>
                    <StoreIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Store Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600" />
                    <span>{store.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <span>{store.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <span>{store.hostname}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-start gap-2">
                    <Tag className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div className="flex flex-wrap gap-2">
                      {store.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 text-center">
                  <span className="text-blue-600 font-medium flex items-center justify-center gap-2">
                    View Store Details
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 