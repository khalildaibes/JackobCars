"use client";
// sdada
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Loader2, MapPin, Phone, Mail, Globe, Clock, Tag, 
  Facebook, Instagram, Navigation, ChevronDown,
  MessageSquare, Search, Navigation2, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Img} from "../../../components/Img";
import  CarCard  from "../../../components/CarCard";
import axios from 'axios';
import { ServiceCard } from "../../../components/ServiceCard";
import { useTranslations } from "use-intl";
import ChatPopup from '../../../components/ChatPopup';
import { useUserActivity } from "../../../context/UserActivityContext";

interface WorkingHours {
  open?: string;
  close?: string;
  closed?: boolean;
}

interface Store {
  logo: { url: string };
  id: string;
  name: string;
  phone: string;
  images: { url: string }[];
  address: string;
  details: string;
  hostname: string;
  visits: number;
  tags: string;
  products: Product[];
  provider?: string;
  email?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  openingHours: {
    [key: string]: WorkingHours;
  };
  additional?: {
    storechatassistant?: {
      url: string;
    };
    working_hours?: {
      [key: string]: WorkingHours;
    };
  };


  balance: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  categories?: string[]; // Categories from Strapi
  image: { url: string }[]; // Image array for localization
  details: {
    images: { url: string }[]; // Add this line to match the interface
    car: {
      description: string;
      fuelType: string;
      bodyType: string;
      cons: string[]; // List of disadvantages
      pros: string[]; // List of advantages
      fuel: string; // Fuel type
      year: number; // Car manufacturing year
      miles: string; // Mileage
      price: number; // Car price
      badges: { color: string; label: string; textColor: string }[]; // Strapi badges
      images: {
        main: string;
        additional: string[];
      };
      actions: {
        save: { icon: string; label: string };
        share: { icon: string; label: string };
        compare: { icon: string; label: string };
      };
      mileage: string; // Fuel efficiency
      features: { icon: string; label: string; value: string }[];
      transmission: string;
      dimensions_capacity: { label: string; value: string }[];
      engine_transmission_details: { label: string; value: string }[];
    };
  };
  video?: { url: string }[];
  colors?: { name: string; quantity: number }[];
}

interface ChatPopupProps {
  storeName?: string;
  chatUrl?: string;
  variant?: 'inline' | 'popup';
  openOnRender?: boolean;
}

export default function StorePage() {
  const params = useParams();
  const slug = params?.id as string;
  const t = useTranslations("StorePage");
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHours, setShowHours] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showProProducts, setShowProProducts] = useState(false);
  const [filteredParts, setFilteredParts] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const pathname = usePathname();
  const isStorePage = pathname.startsWith('/stores/');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const storeResponse = await fetch(`/api/stores?slug=${slug}`);
        if (!storeResponse.ok) throw new Error("Failed to fetch store");
        const storeData = await storeResponse.json();
        console.log('Store Data:', JSON.stringify(storeData, null, 2));

        if (!storeData || !storeData.data || !Array.isArray(storeData.data) || storeData.data.length === 0) {
          throw new Error("Store not found");
        }

        const storeDataItem = storeData.data[0];
        if (!storeDataItem) {
          throw new Error("Invalid store data structure");
        }
        
        
        // Fetch products from the store's specific API endpoint only if store has car-listing tag
        let productsData = { data: [] };
        let partsData = { data: [] };
        if (storeDataItem.tags?.includes('car-listing')) {
          const productsResponse = await fetch(`/api/deals?store_hostname=${storeDataItem.hostname}`);
          if (!productsResponse.ok) throw new Error("Failed to fetch products");
          productsData = await productsResponse.json();
          console.log('productsData ', JSON.stringify(productsData, null, 2));
                  // Fetch parts from the parts API
          const partsResponse = await fetch(`/api/parts?store_hostname=${storeDataItem.hostname}`);
          if (!partsResponse.ok) throw new Error("Failed to fetch parts, " + partsResponse.statusText);
          partsData = await partsResponse.json();

        }


        // Fetch services from the services API
        const servicesResponse = await fetch(`/api/services?store_hostname=${storeDataItem.hostname}`);
        if (!servicesResponse.ok) throw new Error("Failed to fetch services, " + servicesResponse.statusText);
        const servicesData = await servicesResponse.json();
        console.log('Services Data:', JSON.stringify(servicesData, null, 2));

        const storeInstance: Store = {
          id: String(storeDataItem.id),
          name: String(storeDataItem.name || ''),

          address: String(storeDataItem.address || ''),
          phone: String(storeDataItem.phone || ''),
          email: storeDataItem.email ? String(storeDataItem.email) : '',
          logo: storeDataItem.logo ,

          tags: String(storeDataItem.tags || ''),
          socialMedia: storeDataItem.socialMedia ? {
            facebook: storeDataItem.socialMedia.facebook ? String(storeDataItem.socialMedia.facebook) : undefined,
            twitter: storeDataItem.socialMedia.twitter ? String(storeDataItem.socialMedia.twitter) : undefined,
            instagram: storeDataItem.socialMedia.instagram ? String(storeDataItem.socialMedia.instagram) : undefined,
            whatsapp: storeDataItem.socialMedia.whatsapp ? String(storeDataItem.socialMedia.whatsapp) : undefined
          } : {
            facebook: undefined,
            twitter: undefined,
            instagram: undefined,
            whatsapp: undefined
          },
          location: storeDataItem.location ? {
            lat: Number(storeDataItem.location.lat || 0),
            lng: Number(storeDataItem.location.lng || 0)
          } : {
            lat: 0,
            lng: 0
          },
          openingHours: storeDataItem.additional?.working_hours || {},
          additional: storeDataItem.additional || {},
          images: storeDataItem.image ? storeDataItem.image.map((img: any) => img.url || '') : [],
          products: productsData.data?.map((product: any) => ({
            id: String(product.id),
            name: String(product.name || ''),
            slug: String(product.slug || ''),
            quantity: Number(product.quantity || 0),
            image: product.image || [],
            price: Number(product.price || 0),
            categories: product.categories ? product.categories.split(',').map((cat: string) => cat.trim()) : [],
            details: {
              images: product.image || [],
              car: {
                description: product.details?.car?.description || '',
                fuelType: product.details?.car?.fuel || '',
                bodyType: product.details?.car?.body_type || '',
                cons: [],
                pros: [],
                fuel: product.details?.car?.fuel || '',
                year: Number(product.details?.car?.year || 0),
                miles: String(product.details?.car?.miles || ''),
                price: Number(product.details?.car?.price || 0),
                badges: [],
                images: {
                  main: product.details?.car?.images?.main || '',
                  additional: product.details?.car?.images?.additional || []
                },
                actions: {
                  save: { icon: 'bookmark', label: 'Save' },
                  share: { icon: 'share', label: 'Share' },
                  compare: { icon: 'compare', label: 'Compare' }
                },
                mileage: String(product.details?.car?.miles || ''),
                features: product.details?.car?.features?.map((feature: any) => ({
                  icon: '',
                  label: feature.label,
                  value: feature.value
                })) || [],
                transmission: product.details?.car?.transmission || '',
                dimensions_capacity: [],
                engine_transmission_details: []
              }
            }
          })) || [],
          hostname: String(storeDataItem.hostname || ''),
          visits: Number(storeDataItem.visits || 0),
          balance: Number(storeDataItem.balance || 0),
          details: String(storeDataItem.details || '')
        };

        setStore(storeInstance);
        setFilteredProducts(storeInstance.products);
        setFilteredParts(partsData.data || []);
        setFilteredServices(servicesData.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch store data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStore();
    }
  }, [slug]);

  const handleFilterChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category === null) {
      setFilteredProducts(store?.products || []);
    } else {
      setFilteredProducts(store?.products.filter(product => 
        product.categories.toString().split(',').map(cat => cat.trim()).includes(category)
      ) || []);
    }
  };

  const handleContact = (method: 'phone' | 'email' | 'whatsapp') => {
    if (!store) return;

    switch (method) {
      case 'phone':
        window.location.href = `tel:${store.phone}`;
        break;
      case 'email':
        window.location.href = `mailto:${store.email}`;
        break;
      case 'whatsapp':
        window.location.href = `https://wa.me/${store.phone.replace(/[^0-9]/g, '')}`;
        break;
    }
  };

  const handleNavigation = (type: 'google' | 'waze') => {
    if (!store?.location) return;
    
    const { lat, lng } = store.location;
    if (type === 'google') {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        '_blank'
      );
    } else {
    window.open(
        `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17`,
      '_blank'
    );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-gray-700"
        >
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>{t("loading_store_details")}</span>
        </motion.div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || t("store_not_found")}</p>
          <Link href="/stores">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              {t("back_to_stores")}
            </button>
          </Link>
        </div>
      </div>
    );
  }
  const { logActivity } = useUserActivity();

  useEffect(() => {
    logActivity("store_view", { id: store.id, title: store.name });
  }, [store.id]);

  const openingHours = store.openingHours || {};
  const tags = store.tags ? store.tags.split(',').map(tag => tag.trim()) : [];
  const categories = Array.from(new Set(
    store.products.flatMap(product => 
      product.categories.toString().split(',').map(cat => cat.trim())
    )
  ));
  return (
    <div className="min-h-screen bg-[#050B20] pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Store Header with Logo */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {store.logo ? (
              <div className="relative md:w-[20%] w-[100%] h-[70%] rounded-xl overflow-hidden shadow-lg">
                <Img
                  src={`${store.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${store.hostname}/`}${store.logo.url}`}
                  external={true}
                  alt={store.name}
                  width={1024}
                  height={1024}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="relative md:w-[20%] w-[100%] h-[70%] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <span>{t("no_image_available")}</span>
                </div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{store.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{store.details}</p>
              <div className="flex flex-wrap gap-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                    className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
              </div>
            </div>
          </div>
          </div>

        {/* Compact Info Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-800">{t("contact_information")}</h3>
              </div>
              <a href={`tel:${store.phone}`} className="block text-sm text-gray-600 hover:text-blue-600">
                {store.phone}
              </a>
              {store.email && (
                <a href={`mailto:${store.email}`} className="block text-sm text-gray-600 hover:text-blue-600">
                  {store.email}
                </a>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-800">{t("get_directions")}</h3>
              </div>
              <p className="text-sm text-gray-600">{store.address}</p>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <button 
                onClick={() => setShowHours(!showHours)}
                className="w-full flex items-center justify-between gap-2 mb-2"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-medium text-gray-800">{t("opening_hours")}</h3>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showHours ? 'rotate-180' : ''}`} />
              </button>
              {showHours && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  <div className="flex flex-col gap-1">
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => {
                      const hours = store.additional?.working_hours?.[day] as WorkingHours;
                      return (
                        <div
                          key={day}
                          className="flex justify-between items-center rounded-lg bg-gray-100 px-3 py-1 text-xs sm:text-sm font-medium text-gray-700"
                        >
                          <span className="capitalize">{t(`days.${day}`)}</span>
                          <span className="text-gray-600 font-normal">
                            {hours?.closed ? t("closed") : hours ? `${hours.open} - ${hours.close}` : t("closed")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-800">{t("quick_actions")}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleContact('whatsapp')}
                  className="px-2 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {t("chat_on_whatsapp")}
                </button>
                {store.address && (
                  <>
                    <button
                      onClick={() => handleNavigation('google')}
                      className="px-2 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      {t("google_maps")}
                    </button>
                    <button
                      onClick={() => handleNavigation('waze')}
                      className="px-2 py-1 text-xs rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                    >
                      {t("waze")}
                    </button>
                  </>
                )}
              </div>
              {store.socialMedia && (
                <div className="flex gap-2 pt-1">
                  {store.socialMedia.facebook && (
                    <a
                      href={store.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      <Facebook className="w-3 h-3 text-blue-600" />
                    </a>
                  )}
                  {store.socialMedia.instagram && (
                    <a
                      href={store.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      <Instagram className="w-3 h-3 text-blue-600" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products and Services Sections */}
        <div className="space-y-8">
          {/* Services Section */}
          {filteredServices.length !== 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t("services")}</h2>
                <Link href={`/stores/${store.id}/services?store_hostname=${store.hostname}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {t("view_all_services")} →
                </Link>
              </div>
              <div className="relative">
                <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                  <div className="flex gap-6 min-w-max">
                    {filteredServices
                      .slice(0, 4)
                      .map((service) => (
                        <div key={service.id} className="w-[280px] flex-shrink-0 snap-start">
                          <ServiceCard
                            id={service.id}
                            title={service.title}
                            description={service.description}
                            price={service.price ? service.price : 0}
                            image={service.image ? service.image : ''}
                            hostname={store.hostname}
                            onClick={() => {
                              console.log('Service clicked:', service.id);
                            }}
                            stores={[]}
                            slug={""}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          {filteredProducts.length !== 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t("products")}</h2>
                <Link href={`/stores/${store.id}/listings?store_hostname=${store.hostname}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {t("view_all_cars")} →
                </Link>
              </div>
              <div className="relative">
                <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                  <div className="flex gap-6 min-w-max">
                    {filteredProducts
                      .filter(product => !product.categories.toString().includes('services-product'))
                      .slice(0, 4)
                      .map((product) => (
                        <div key={product.id} className="w-[280px] flex-shrink-0 snap-start">
                          <CarCard
                            car={{
                              id: product.id,
                              slug: product.slug,
                              mainImage: product.details.car.images.main
                                ? `${store.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${store.hostname}`}${product.details.car.images.main}`
                                : "/default-car.png",
                              title: product.name,
                              year: product.details.car.year,
                              mileage: product.details.car.miles,
                              price: product.details.car.price.toString(),
                              bodyType: product.details.car.bodyType || '',
                              fuelType: product.details.car.fuel || '',
                              description: product.details.car.description,
                              location: '',
                              features: product.details.car.features.map(feature => feature.label)
                            }}
                            variant="grid"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parts Section */}
          {filteredParts.length !== 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Featured Parts</h2>
                <Link href={`/stores/${store.id}/parts?store_hostname=${store.hostname}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {t("view_all_parts")} →
                </Link>
              </div>
              <div className="relative">
                <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                  <div className="flex gap-6 min-w-max">
                    {filteredParts
                      .slice(0, 4)
                      .map((part) => (
                        <div key={part.id} className="w-[280px] flex-shrink-0 snap-start">
                          <Link href={`/parts/${part.slug}?storehostname=${store.hostname}`}>
                            <div className="p-6 rounded-xl bg-white hover:shadow-md transition-all border border-gray-200 h-[450px] flex flex-col">
                              <Img
                                width={1920}
                                height={1080}
                                external={true}
                                src={`${store.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${store.hostname}`}${part.images[0].url}`}
                                alt={part.title}
                                className="w-full h-48 object-cover rounded-t-lg flex-shrink-0"
                              />
                              <div className="flex flex-col flex-grow">
                                <div className="h-[60px]">
                                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{part.title}</h3>
                                </div>
                                <div className="h-[72px]">
                                  <p className="text-gray-600 line-clamp-3">{t("description")}: {part.description}</p>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                  <span className="text-blue-600 font-semibold">
                                    {t("price")}: {part.price.toLocaleString()}
                                  </span>
                                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    {t("view_details")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
             
            </div>
            
          )}
        </div>
      </div>
        {/* Chat */}
        {store && (
              <ChatPopup
                storeName={store.name}
                chatUrl={store.additional?.storechatassistant?.url}
                openOnRender={true}
              />
            )}
    </div>
    
  );
} 