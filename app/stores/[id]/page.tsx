"use client";
// sdada
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Loader2, MapPin, Phone, Mail, Globe, Clock, Tag, 
  Facebook, Instagram, Navigation, ChevronDown,
  MessageSquare, Search, Navigation2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Img} from "../../../components/Img";
import  CarCard  from "../../../components/CarCard";
import axios from 'axios';
import { ServiceCard } from "../../../components/ServiceCard";

interface Store {
  id: number;
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
    instagram?: string;
    whatsapp?: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  logo?: any;
  balance?: number;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

const defaultOpeningHours = {
  monday: "9:00 AM - 6:00 PM",
  tuesday: "9:00 AM - 6:00 PM",
  wednesday: "9:00 AM - 6:00 PM",
  thursday: "9:00 AM - 6:00 PM",
  friday: "9:00 AM - 6:00 PM",
  saturday: "10:00 AM - 4:00 PM",
  sunday: "Closed"
};
interface Product {
  id: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  categories?: {string }[]; // Categories from Strapi
  image: { url: string }[]; // Image array for localization
  details: {
    images: any;
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

export default function StorePage() {
  const params = useParams();
  const slug = params?.id as string;
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
        
        
        // Fetch products from the store's specific API endpoint
        const productsResponse = await fetch(`/api/deals?store_hostname=${storeDataItem.hostname}`);
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();
        console.log('productsData ', JSON.stringify(productsData, null, 2));

        // Fetch parts from the parts API
        const partsResponse = await fetch(`/api/parts?store_hostname=${storeDataItem.hostname}`);
        if (!partsResponse.ok) throw new Error("Failed to fetch parts, " + partsResponse.statusText);
        const partsData = await partsResponse.json();

        // Fetch services from the services API
        const servicesResponse = await fetch(`/api/services?store_hostname=${storeDataItem.hostname}`);
        if (!servicesResponse.ok) throw new Error("Failed to fetch services, " + servicesResponse.statusText);
        const servicesData = await servicesResponse.json();
        console.log('Services Data:', JSON.stringify(servicesData, null, 2));

        const storeInstance: Store = {
          id: Number(storeDataItem.id),
          name: String(storeDataItem.name || ''),
          phone: String(storeDataItem.phone || ''),
          address: String(storeDataItem.address || ''),
          details: Array.isArray(storeDataItem.details)
            ? storeDataItem.details.map(detail => detail.children?.map(child => child.text).join(' ') || ''
            ).join('\n')
            : String(storeDataItem.details || ''),
          hostname: String(storeDataItem.hostname || ''),
          visits: Number(storeDataItem.visits || 0),
          logo: storeDataItem.logo?.url || null,
          images: storeDataItem.image || [],
          tags: String(storeDataItem.tags || ''),
          provider: storeDataItem.provider ? String(storeDataItem.provider) : undefined,
          email: storeDataItem.email ? String(storeDataItem.email) : undefined,
          socialMedia: storeDataItem.socialMedia ? {
            facebook: storeDataItem.socialMedia.facebook ? String(storeDataItem.socialMedia.facebook) : undefined,
            instagram: storeDataItem.socialMedia.instagram ? String(storeDataItem.socialMedia.instagram) : undefined,
            whatsapp: storeDataItem.socialMedia.whatsapp ? String(storeDataItem.socialMedia.whatsapp) : undefined
          } : undefined,
          location: storeDataItem.location ? {
            lat: Number(storeDataItem.location.lat || 0),
            lng: Number(storeDataItem.location.lng || 0)
          } : undefined,
          balance: Number(storeDataItem.balance || 0),
          openingHours: storeDataItem.openingHours || defaultOpeningHours,
          products: productsData.data?.map((product: any) => ({
            id: String(product.id),
            name: String(product.name || ''),
            slug: String(product.slug || ''),
            quantity: Number(product.quantity || 0),
            price: Number(product.price || 0),
            categories: product.categories ? product.categories.split(',').map((cat: string) => cat.trim()) : [],
            details: {
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
          <span>Loading store details...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Store not found"}</p>
          <Link href="/stores">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Back to Stores
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const openingHours = store.openingHours || defaultOpeningHours;
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
            {store.images && store.images.length > 0 ? (
              <div className="relative md:w-[20%] w-[100%] h-[70%] rounded-xl overflow-hidden shadow-lg">
                <Img
                  src={`${store.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${store.hostname}`}${store.images[0].url}`}
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
                  <span>No image available</span>
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

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <a href={`tel:${store.phone}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
                <span className="text-gray-600">{store.phone}</span>
              </a>
              {store.email && (
                <a href={`mailto:${store.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                  <span className="text-gray-600">{store.email}</span>
                </a>
              )}
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600">{store.address}</span>
              </div>
              </div>
              {store.socialMedia && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex gap-4 justify-center">
                  {store.socialMedia.facebook && (
                    <a
                      href={store.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {store.socialMedia.instagram && (
                    <a
                      href={store.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                </div>
                </div>
              )}
            </div>

          {/* Opening Hours Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <button
                onClick={() => setShowHours(!showHours)}
              className="w-full flex items-center justify-between text-xl font-semibold mb-6 text-gray-800"
              >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Opening Hours</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showHours ? 'rotate-180' : ''}`} />
              </button>
              
              {showHours && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
                >
                  {Object.entries(openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="capitalize font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </motion.div>
              )}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <Navigation className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => handleContact('whatsapp')}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Chat on WhatsApp</span>
              </button>
              
              {/* Navigation Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Get Directions</h3>
                {store.address ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleNavigation('google')}
                      className="flex items-center justify-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-700 font-medium">Google Maps</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('waze')}
                      className="flex items-center justify-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <Navigation2 className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-700 font-medium">Waze</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    Location data not available for this store
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products and Services Sections */}
        <div className="space-y-8">
          {/* Services Section */}
          {filteredServices.length !== 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6 overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800">Services</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategory 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {Array.from(new Set(
                    filteredServices.flatMap(service => 
                      service.categories?.map(cat => cat.name.trim()) || []
                    )
                  )).map(category => (
                    <button 
                      key={category} 
                      onClick={() => setSelectedCategory(category)} 
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices
                  .filter(service => 
                    !selectedCategory || 
                    service.categories?.map(cat => cat.name.trim()).includes(selectedCategory)
                  )
                  .map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      description={service.description}
                      price={service.price ? service.price : 0}
                      image={service.image ? service.image : ''}
                      hostname={store.hostname}
                      onClick={() => {
                        // Add your navigation logic here
                        console.log('Service clicked:', service.id);
                      } } stores={[]} slug={""}                    />
                  ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {filteredProducts.length !== 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6 overflow-x-auto">
              <h2 className="text-2xl font-bold text-gray-800">Cars</h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleFilterChange(null)} 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !selectedCategory 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories
                  .filter(cat => cat !== 'services-product')
                  .map(category => (
                    <button 
                      key={category} 
                      onClick={() => handleFilterChange(category)} 
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
              {filteredProducts
                .filter(product => !product.categories.toString().includes('services-product'))
                .map((product) => (
                  console.log(product),
                  <CarCard 
                    key={product.id} 
                    car={{
                      id: product.id,
                      slug: product.slug,
                      mainImage: product.details.car.images.main 
                        ? ` ${store.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${store.hostname}`}${product.details.car.images.main}`
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
                ))}
            </div>
            </div>
          )}
          {/* Parts Section */}
          {filteredParts.length !== 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Parts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => (
              <Link href={`/parts/${part.slug}?storehostname=${store.hostname}`}>
                
                <div
                  key={part.id}
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-800 to-blue-50 hover:shadow-md transition-all"
                >
                    <Img
                          width={1920}
                          height={1080}
                          external={true}
                          src={`${store.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${store.hostname}`}${part.images[0].url}`}
                          alt={part.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{part.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{part.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">
                      ${part.price.toLocaleString()}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
                </Link>
              ))}
              {filteredParts.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No parts available at this time.</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
} 