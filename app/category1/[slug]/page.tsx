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
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/deals?category=${params.slug}`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const data = await response.json();
        if (!data || !data.data) throw new Error("Invalid API response structure");
        console.log(data.data);

        // Store all listings with normalization
        const formattedListings = data.data.map((product: any) => {
          // Get the fuel type and normalize it
          const rawFuelType = product.details?.car.fuel || "Unknown";
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
          const rawMake = product.details?.car.make || "Unknown";
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
          const rawBodyType = product.details?.car.body_type || "Unknown";
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

          // Transform the data to match our Product interface
          return {
            id: product.id,
            name: product.name || "Unknown Product",
            slug: product.slug || product.id,
            quantity: product.quantity || 0,
            price: product.price || 0,
            images: product.image ? [{ url: `http://64.227.112.249${product.image[0]?.url}` }] : [],
            details: {
              car: {
                cons: product.details?.car?.cons || [],
                pros: product.details?.car?.pros || [],
                fuel: normalizedFuelType,
                year: product.details?.car?.year || new Date().getFullYear(),
                miles: product.details?.car?.miles || "N/A",
                price: product.details?.car?.price || 0,
                store: product.store || null,
                badges: product.details?.car?.badges || [],
                images: {
                  main: product.details?.car?.images?.main || "",
                  additional: product.details?.car?.images?.additional || []
                },
                actions: {
                  save: { icon: "", label: "Save" },
                  share: { icon: "", label: "Share" },
                  compare: { icon: "", label: "Compare" }
                },
                mileage: product.details?.car?.mileage || "N/A",
                features: product.details?.car?.features || [],
                transmission: product.details?.car?.transmission || "Unknown",
                dimensions_capacity: product.details?.car?.dimensions_capacity || [],
                engine_transmission_details: product.details?.car?.engine_transmission_details || [],
                make: normalizedMake,
                body_type: normalizedBodyType
              }
            },
            video: product.video || [],
            colors: product.colors || [],
            store:product.store||[],
            categories: product.categories || ""
          };
        });

        setProducts(formattedListings);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading products...</span>
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

  if (!products.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <Text className="text-gray-700 text-3xl font-semibold">
            No products found
          </Text>
          <p className="text-gray-600">
            We couldn't find any products in this category.
          </p>
        </div>
      </motion.div>
    );
  }

  return <ProductClient products={products as any} />;
}

function fetchStrapiData(arg0: string, arg1: {
  filters: { categories: { $contains: string; }; }; // ✅ Match text instead of an array
  populate: string; locale: string;
}) {
  throw new Error("Function not implemented.");
}

