"use client";
// sdada
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Loader2, MapPin, Phone, Mail, Globe, Clock, Tag, 
  Facebook, Instagram, Navigation, ChevronDown,
  MessageSquare, Search
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Img } from "../../../components/Img";

interface Store {
  id: number;
  name: string;
  phone: string;
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
  logo?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
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
    car: {
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

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const storeResponse = await fetch(`/api/stores?slug=${slug}`);
        if (!storeResponse.ok) throw new Error("Failed to fetch store");
        const storeData = await storeResponse.json();
        
        if (!storeData) {
          throw new Error("Store not found");
        }

        const storeDataItem = storeData.data[0];
        console.log('Store Data:', JSON.stringify(storeDataItem, null, 2));
        const storeInstance: Store = {
          id: Number(storeDataItem.id),
          name: String(storeDataItem.name || ''),
          phone: String(storeDataItem.phone || ''),
          address: String(storeDataItem.address || ''),
          details: String(storeDataItem.details[0].children[0].text || ''),
          hostname: String(storeDataItem.hostname || ''),
          visits: Number(storeDataItem.visits || 0),
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
          logo: storeDataItem.logo ? {
            data: storeDataItem.logo.data ? {
              attributes: {
                url: String(storeDataItem.logo.data.attributes?.url || '')
              }
            } : undefined
          } : undefined,
          openingHours: storeDataItem.openingHours || defaultOpeningHours,
          products: storeDataItem.products.map((product: any) => ({
            ...product,
            categories: product.categories || "",
          })) as Product[]
        };

        setStore(storeInstance);
        setFilteredProducts(storeInstance.products);
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
        product.categories.split(',').map(cat => cat.trim()).includes(category)
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

  const handleNavigation = () => {
    if (!store?.location) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`,
      '_blank'
    );
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
      product.categories.split(',').map(cat => cat.trim())
    )
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Store Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex justify-between items-start">
            <div className="flex gap-6">
              {store.logo?.data && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={store.logo.data.attributes.url}
                    alt={store.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{store.name}</h1>
                <p className="text-gray-600 max-w-2xl mb-6">{store.details}</p>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Contact & Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>{store.phone}</span>
              </div>
              {store.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{store.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{store.address}</span>
              </div>
              {/* <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>{store.hostname}</span>
              </div> */}
                <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>{store.details}</span>
              </div> 
              {store.socialMedia && (
                <div className="flex gap-4 mt-4">
                  {store.socialMedia.facebook && (
                    <a
                      href={store.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {store.socialMedia.instagram && (
                    <a
                      href={store.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Opening Hours */}
            <div>
              <button
                onClick={() => setShowHours(!showHours)}
                className="flex items-center gap-2 text-gray-600 mb-4"
              >
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Opening Hours</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showHours ? 'rotate-180' : ''}`} />
              </button>
              
              {showHours && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm text-gray-600">
                      <span className="capitalize">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Products Filter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <button 
              onClick={() => handleFilterChange(null)} 
              className={`px-4 py-2 rounded-lg ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              All
            </button>
            {categories.map(category => (
              <button 
                key={category} 
                onClick={() => handleFilterChange(category)} 
                className={`px-4 py-2 rounded-lg ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105">
                <Img
                  src={product.image[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  external={true}
                  width={300}
                  height={200}
                  className="object-cover rounded"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price}</p>
                <Link href={`/products/${product.slug}`}>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No products found.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleContact('whatsapp')}
          >
            <MessageSquare size={24} />
          </motion.button>
          {store.location && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNavigation}
            >
              <Navigation size={24} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
} 