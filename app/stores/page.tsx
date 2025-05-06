"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MapPin, Phone, Globe, Tag, Eye, Store as StoreIcon, ArrowRight, Filter, X, Search } from "lucide-react";
import Link from "next/link";

interface Store {
  balance: number;
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
  category: string;
  location: string;
  services: string[];
}

interface FilterState {
  categories: string[];
  locations: string[];
  services: string[];
}

export default function StoresPage() {
  const t = useTranslations("Stores");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    services: []
  });
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    services: []
  });

  // Handle initial filters from URL
  useEffect(() => {
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const service = searchParams.get("service");
    const search = searchParams.get("search");
    
    const newFilters: FilterState = {
      categories: category ? [category] : [],
      locations: location ? [location] : [],
      services: service ? [service] : []
    };

    setSelectedFilters(newFilters);
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // Get all available options for suggestions
  const getAllOptions = () => {
    const options: { type: keyof FilterState; value: string }[] = [
      ...availableFilters.categories.map(cat => ({ type: 'categories' as const, value: cat })),
      ...availableFilters.locations.map(loc => ({ type: 'locations' as const, value: loc })),
      ...availableFilters.services.map(serv => ({ type: 'services' as const, value: serv }))
    ];
    return options;
  };

  const filteredOptions = getAllOptions().filter(option =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option: { type: keyof FilterState; value: string }) => {
    toggleFilter(option.type, option.value);
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error("Failed to fetch stores");
        const data = await response.json();
        
        // Transform the data to ensure proper types
        const storesData = (data.data || []).map((store: any) => ({
          ...store,
          services: Array.isArray(store.services) ? store.services : [],
          category: String(store.category || ''),
          location: String(store.location || ''),
          tags: String(store.tags || ''),
          visits: Number(store.visits || 0),
          details: String(store.details || '')
        }));

        setStores(storesData);

        // Extract unique filters from the transformed data
        const filters: FilterState = {
          categories: Array.from(new Set(storesData.map(store => store.category).filter(Boolean))),
          locations: Array.from(new Set(storesData.map(store => store.location).filter(Boolean))),
          services: Array.from(new Set(storesData.flatMap(store => store.services).filter(Boolean)))
        };
        setAvailableFilters(filters);
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

  const updateURLWithFilters = (filters: FilterState, search: string = '') => {
    const params = new URLSearchParams();
    
    if (filters.categories.length > 0) {
      params.set('category', filters.categories[0]);
    }
    if (filters.locations.length > 0) {
      params.set('location', filters.locations[0]);
    }
    if (filters.services.length > 0) {
      params.set('service', filters.services[0]);
    }
    if (search) {
      params.set('search', search);
    }

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(newURL, { scroll: false });
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [type]: selectedFilters[type].includes(value)
        ? selectedFilters[type].filter(item => item !== value)
        : [...selectedFilters[type], value]
    };
    setSelectedFilters(newFilters);
    updateURLWithFilters(newFilters, searchTerm);
  };

  const clearFilters = () => {
    const newFilters = {
      categories: [],
      locations: [],
      services: []
    };
    setSelectedFilters(newFilters);
    setSearchTerm("");
    router.push('', { scroll: false });
  };

  // Update URL when search term changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updateURLWithFilters(selectedFilters, searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const filteredStores = stores.filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedFilters.categories.length === 0 || 
      selectedFilters.categories.some(category => 
        store.tags.toLowerCase().includes(category.toLowerCase()) ||
        store.category.toLowerCase() === category.toLowerCase()
      );

    const matchesLocation = 
      selectedFilters.locations.length === 0 || 
      selectedFilters.locations.includes(store.location);

    const matchesService = 
      selectedFilters.services.length === 0 || 
      selectedFilters.services.some(service => store.services.includes(service));

    return matchesSearch && matchesCategory && matchesLocation && matchesService;
  });

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
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600">
            {t('partner_stores')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('discover_stores')}
          </p>
        </div>

        {/* Quick Filter Links */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <Link 
            href="/stores?category=service-centers"
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Service Centers
          </Link>
          <Link 
            href="/stores?category=dealerships"
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Dealerships
          </Link>
          <Link 
            href="/stores?category=parts"
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Parts Stores
          </Link>
        </div>

        {/* Unified Search and Filter */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by category, location, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 
                pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                shadow-sm hover:shadow-md transition-all duration-300 text-lg"
            />
            <Search className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            
            {/* Suggestions Dropdown */}
            {searchTerm && filteredOptions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <button
                    key={`${option.type}-${option.value}`}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">
                        {option.type.charAt(0).toUpperCase() + option.type.slice(1)}:
                      </span>
                      <span>{option.value}</span>
                    </div>
                    {selectedFilters[option.type].includes(option.value) && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Filters */}
          {(selectedFilters.categories.length > 0 || 
            selectedFilters.locations.length > 0 || 
            selectedFilters.services.length > 0) && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(([type, values]) =>
                  values.map((value) => (
                    <span
                      key={`${type}-${value}`}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      <span className="text-gray-500 text-xs">
                        {type.charAt(0).toUpperCase() + type.slice(1)}:
                      </span>
                      {value}
                      <button
                        onClick={() => toggleFilter(type as keyof FilterState, value)}
                        className="hover:text-blue-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  {t('clear_all')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {t('found_stores', { count: filteredStores.length })}
        </div>

        {/* Stores Grid */}
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
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        {String(store.name)}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{store.visits} {t('visits')}</span>
                      </div>
                    </div>
                    <StoreIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Store Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600" />
                    <span>{String(store.address)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <span>{String(store.phone)}</span>
                  </div>

                  {/* <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <span>{String(store.details)}</span>
                  </div> */}

                  {/* Tags */}
                  <div className="flex items-start gap-2">
                    <Tag className="w-5 h-5 mt-1 flex-shrink-0 text-blue-600" />
                    <div className="flex flex-wrap gap-2">
                      {String(store.tags).split(',').filter(Boolean).map((tag, index) => (
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
                    {t('view_store_details')}
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