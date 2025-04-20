"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Img } from "../../../components/Img";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Part {
  id: string;
  slug: string;
  name: string;
  image: Array<{ url: string }>;
  details: {
    description: string;
    features: Array<{ value: string }>;
  };
  price: number;
  categories: string;
  stores: Array<{ id: string; name: string }>;
}

const PartDetails = () => {
  const { slug } = useParams();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const t = useTranslations("PartDetails");

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(`/api/parts?slug=${slug}`);
        if (!response.ok) throw new Error('Part not found');
        const data = await response.json();
        setPart(data.data);
      } catch (error) {
        console.error('Error fetching part:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPart();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Part not found</h1>
        <Link href="/parts" className="text-blue-600 hover:underline">
          Back to Parts
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Back Button */}
      <Link
        href="/parts"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Parts
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Img
              src={`http://64.227.112.249${part.image[activeImage]?.url || '/default-part.png'}`}
              alt={part.name}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              external={true}
            />
          </div>
          {part.image.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {part.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <Img
                    src={`http://64.227.112.249${img.url}`}
                    alt={`${part.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    external={true}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Part Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{part.name}</h1>
            <div className="flex items-center gap-2">
              {part.categories.split(',').map((category, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  {category.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            ${part.price.toLocaleString()}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{part.details.description}</p>
          </div>

          {part.details.features && part.details.features.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {part.details.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {part.stores && part.stores.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Available at</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {part.stores.map((store) => (
                  <li
                    key={store.id}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{store.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Call to Action */}
          <div className="flex gap-4 pt-6">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Store
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PartDetails; 