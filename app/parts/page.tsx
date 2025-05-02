"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Img } from "../../components/Img";

interface Part {
  id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
  categories: { name: string }[];
  hostname: string;
  slug: string;
}

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch('/api/parts');
        if (!response.ok) throw new Error('Failed to fetch parts');
        const data = await response.json();
        
        setParts(data.data || []);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          data.data.flatMap((part: Part) => 
            part.categories?.map(cat => cat.name.trim()) || []
          )
        ));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching parts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
                          part.categories?.some(cat => cat.name.trim() === selectedCategory);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">All Parts</h1>
          
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parts..."
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

          {/* Parts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <Link href={`/parts/${part.slug}?storehostname=${part.hostname}`} key={part.id}>
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-800 to-blue-50 hover:shadow-md transition-all">
                  <Img
                    width={1920}
                    height={1080}
                    external={true}
                    src={`${part.hostname === '64.227.112.249' ? process.env.NEXT_PUBLIC_STRAPI_URL : `http://${part.hostname}`}${part.images[0]?.url}`}
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
          </div>

          {filteredParts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No parts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 