"use client";

import { notFound } from "next/navigation";
import ProductClient from "./ProductsClient";
import React, { useEffect, useState } from "react";
import { Text } from "../../../components/Text";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  store: any;
  quantity: number;
  price: number;
  images: { url: string }[];
  details: {
    car: {
      cons: string[];
      pros: string[];
      fuel: string;
      year: number;
      miles: string;
      price: number;
      store: {
        id: number;
        name: string;
        logo?: string;
      } | null;
      badges: { color: string; label: string; textColor: string }[];
      images: {
        main: string;
        additional: string[];
      };
      actions: {
        save: { icon: string; label: string };
        share: { icon: string; label: string };
        compare: { icon: string; label: string };
      };
      mileage: string;
      features: { icon: string; label: string; value: string }[];
      transmission: string;
      dimensions_capacity: { label: string; value: string }[];
      engine_transmission_details: { label: string; value: string }[];
      make: string;
      body_type: string;
    };
  };
  video?: { url: string }[];
  colors?: { name: string; quantity: number }[];
  categories: string | string[];
  type: 'product';
}

interface Service {
  id: string;
  name: string;
  slug: string;
  store: any;
  price: number;
  images: { url: string }[];
  description: string;
  duration: string;
  categories: string | string[];
  type: 'service';
}

interface Part {
  id: string;
  name: string;
  slug: string;
  store: any;
  quantity: number;
  price: number;
  images: { url: string }[];
  description: string;
  compatibility: string[];
  categories: string | string[];
  type: 'part';
}

type Item = Product | Service | Part;

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/category?category=${params.slug}`);
        if (!response.ok) throw new Error(`Failed to fetch items: ${response.statusText}`);
        const data = await response.json();
        if (!data || !data.data) throw new Error("Invalid API response structure");
        console.log(data.data);

        // Store all items with normalization
        const formattedItems = data.data.map((item: any) => {
          if (item.type === 'product') {
            // Get the fuel type and normalize it
            const rawFuelType = item.details?.car.fuel || "Unknown";
            let normalizedFuelType = rawFuelType;
            
            // Normalize fuel type values to English
            if (rawFuelType.toLowerCase().includes("plug-in") || 
                rawFuelType.toLowerCase().includes("plug in") || 
                rawFuelType === "היברידי נטען" ||
                rawFuelType === "هجين قابل للشحن") {
              normalizedFuelType = "Plug-in Hybrid";
            } else if (rawFuelType.toLowerCase().includes("hybrid") || 
                      rawFuelType === "היברידי" ||
                      rawFuelType === "هجين") {
              normalizedFuelType = "Hybrid";
            } else if (rawFuelType.toLowerCase().includes("electric") || 
                      rawFuelType === "חשמלי" ||
                      rawFuelType === "كهربائي") {
              normalizedFuelType = "Electric";
            } else if (rawFuelType.toLowerCase().includes("diesel") || 
                      rawFuelType === "דיזל" ||
                      rawFuelType === "ديزل") {
              normalizedFuelType = "Diesel";
            } else if (rawFuelType.toLowerCase().includes("gasoline") || 
                      rawFuelType.toLowerCase().includes("petrol") || 
                      rawFuelType === "בנזין" ||
                      rawFuelType === "بنزين") {
              normalizedFuelType = "Gasoline";
            }

            // Normalize make
            const rawMake = item.details?.car.make || "Unknown";
            let normalizedMake = rawMake;
            
            if (rawMake.toLowerCase().includes("toyota") || rawMake === "טויוטה" || rawMake === "تويوتا") {
              normalizedMake = "Toyota";
            } else if (rawMake.toLowerCase().includes("honda") || rawMake === "הונדה" || rawMake === "هوندا") {
              normalizedMake = "Honda";
            } else if (rawMake.toLowerCase().includes("ford") || rawMake === "פורד" || rawMake === "فورد") {
              normalizedMake = "Ford";
            } else if (rawMake.toLowerCase().includes("chevrolet") || rawMake === "שברולט" || rawMake === "شيفروليه") {
              normalizedMake = "Chevrolet";
            } else if (rawMake.toLowerCase().includes("bmw") || rawMake === "ב.מ.וו" || rawMake === "بي ام دبليو") {
              normalizedMake = "BMW";
            } else if (rawMake.toLowerCase().includes("mercedes") || rawMake === "מרצדס" || rawMake === "مرسيدس") {
              normalizedMake = "Mercedes-Benz";
            } else if (rawMake.toLowerCase().includes("audi") || rawMake === "אאודי" || rawMake === "أودي") {
              normalizedMake = "Audi";
            } else if (rawMake.toLowerCase().includes("tesla") || rawMake === "טסלה" || rawMake === "تيسلا") {
              normalizedMake = "Tesla";
            } else if (rawMake.toLowerCase().includes("lexus") || rawMake === "לקסוס" || rawMake === "لكزس") {
              normalizedMake = "Lexus";
            } else if (rawMake.toLowerCase().includes("subaru") || rawMake === "סובארו" || rawMake === "سوبارو") {
              normalizedMake = "Subaru";
            }

            // Normalize body type
            const rawBodyType = item.details?.car.body_type || "Unknown";
            let normalizedBodyType = rawBodyType;
            
            if (rawBodyType.toLowerCase().includes("sedan") || rawBodyType === "סדאן" || rawBodyType === "سيدان") {
              normalizedBodyType = "Sedan";
            } else if (rawBodyType.toLowerCase().includes("suv") || rawBodyType === "רכב שטח" || rawBodyType === "سيارة رياضية متعددة الاستخدامات") {
              normalizedBodyType = "SUV";
            } else if (rawBodyType.toLowerCase().includes("truck") || rawBodyType === "משאית" || rawBodyType === "شاحنة") {
              normalizedBodyType = "Truck";
            } else if (rawBodyType.toLowerCase().includes("coupe") || rawBodyType === "קופה" || rawBodyType === "كوبيه") {
              normalizedBodyType = "Coupe";
            } else if (rawBodyType.toLowerCase().includes("convertible") || rawBodyType === "קבריולה" || rawBodyType === "كابريوليه") {
              normalizedBodyType = "Convertible";
            } else if (rawBodyType.toLowerCase().includes("hatchback") || rawBodyType === "הצ'בק" || rawBodyType === "هاتشباك") {
              normalizedBodyType = "Hatchback";
            } else if (rawBodyType.toLowerCase().includes("wagon") || rawBodyType === "סטיישן" || rawBodyType === "ستيشن") {
              normalizedBodyType = "Wagon";
            } else if (rawBodyType.toLowerCase().includes("van") || rawBodyType === "ואן" || rawBodyType === "فان") {
              normalizedBodyType = "Van";
            }

            return {
              ...item,
              details: {
                car: {
                  ...item.details.car,
                  fuel: normalizedFuelType,
                  make: normalizedMake,
                  body_type: normalizedBodyType
                }
              }
            };
          }
          return item;
        });

        setItems(formattedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading items...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Text className="text-red-600 text-xl">
            {error}
          </Text>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <Text className="text-gray-700 text-3xl font-semibold">
            No items found
          </Text>
          <p className="text-gray-600">
            We couldn't find any items in this category.
          </p>
        </div>
      </motion.div>
    );
  }

  return <ProductClient products={items as any} />;
}

function fetchStrapiData(arg0: string, arg1: {
  filters: { categories: { $contains: string; }; }; // ✅ Match text instead of an array
  populate: string; locale: string;
}) {
  throw new Error("Function not implemented.");
}

