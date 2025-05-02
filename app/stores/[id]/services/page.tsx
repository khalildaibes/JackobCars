"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { ServiceCard } from "../../../../components/ServiceCard";

interface Service {
  categories: any;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  hostname: string;
  slug: string;
}

export default function StoreServicesPage() {
  const params = useParams();
  const storeId = params?.id as string;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/services?store_hostname=${storeId}`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        
        setServices(data.data || []);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          data.data.flatMap((service: Service) => 
            service.categories?.map(cat => cat.name.trim()) || []
          )
        )) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [storeId]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
                          service.categories?.some(cat => cat.name.trim() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B20] pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Store Services</h1>
          
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    !selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
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
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                price={service.price}
                image={{ url: service.image }}
                hostname={service.hostname}
                onClick={() => {
                  console.log('Service clicked:', service.id);
                }}
                stores={[]}
                slug={service.slug}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 