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
    quantity: number;
    price: number;
    categories?: { id: number; name: string }[]; // Categories from Strapi
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
  

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?category=${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data.products)) {
          throw new Error("Invalid API response structure");
        }

        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

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

  return <ProductClient product={products[0]} />;
}

function fetchStrapiData(arg0: string, arg1: {
  filters: { categories: { $contains: string; }; }; // ✅ Match text instead of an array
  populate: string; locale: string;
}) {
  throw new Error("Function not implemented.");
}

