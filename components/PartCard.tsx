"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Img } from "./Img";

interface PartCardProps {
  part: {
    id: number | string;
    mainImage: string;
    title: string;
    slug: string;
    price: string;
    description: string;
    features?: string[];
    category: string[];
  };
}

const PartCard = ({ part }: PartCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Img
          width={1920}
          height={1080}
          external={true}
          src={part.mainImage}
          alt={part.title}
          className={`w-full h-full object-cover transform transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        {part.category.includes("featured") && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {part.title}
        </h3>

        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">{part.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-blue-600">{part.price}</div>
          <Link
            href={`/parts/${part.slug}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>

        {part.features && part.features.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <div className="flex flex-wrap gap-2">
              {part.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                >
                  {feature}
                </span>
              ))}
              {part.features.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{part.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartCard; 