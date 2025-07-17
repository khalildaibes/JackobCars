"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import CarCard from "../../components/CarCard";

interface Car {
  id: string;
  name: string;
  store: any;
  slug: string;
  details: {
    car: {
      description: string;
      fuelType: string;
      bodyType: string;
      year: number;
      miles: string;
      price: number;
      images: {
        main: string;
        additional: string[];
      };
      features: { label: string }[];
    };
  };
  hostname: string;
}

export default function ListingsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/deals');
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        
        setCars(data.data || []);
        
        // Extract unique body types and fuel types
        const uniqueBodyTypes = Array.from(new Set(
          data.data.map((car: Car) => car.details.car.bodyType).filter(Boolean)
        ));
        const uniqueFuelTypes = Array.from(new Set(
          data.data.map((car: Car) => car.details.car.fuelType).filter(Boolean)
        ));
        
        setBodyTypes(uniqueBodyTypes as string[]);
        setFuelTypes(uniqueFuelTypes as string[]);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.details.car.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBodyType = !selectedBodyType || car.details.car.bodyType === selectedBodyType;
    const matchesFuelType = !selectedFuelType || car.details.car.fuelType === selectedFuelType;
    return matchesSearch && matchesBodyType && matchesFuelType;
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">All Car Listings</h1>
          
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedBodyType(null)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      !selectedBodyType
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Body Types
                  </button>
                  {bodyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedBodyType(type)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                        selectedBodyType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedFuelType(null)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      !selectedFuelType
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Fuel Types
                  </button>
                  {fuelTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFuelType(type)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                        selectedFuelType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={{
                  id: car.id,
                  hostname: car.store.hostname,
                  slug: car.slug,
                  mainImage: car.details.car.images.main
                    ? `${car.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${car.hostname}`}${car.details.car.images.main}`
                    : "/default-car.png",
                  title: car.name,
                  year: car.details.car.year,
                  mileage: car.details.car.miles,
                  price: car.details.car.price.toString(),
                  bodyType: car.details.car.bodyType || '',
                  fuelType: car.details.car.fuelType || '',
                  make: "Unknown",
                  condition: "Used",
                  transmission: "Automatic",
                  // description: car.details.car.description,
                  features: car.details.car.features.map(feature => feature.label)
                }}
                variant="grid"
              />
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 