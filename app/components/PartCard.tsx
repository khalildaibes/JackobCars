import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Img } from "./Img";

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
  mainImage?: string;
}

interface PartCardProps {
  part: Part;
}

const PartCard = ({ part }: PartCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Use default image if no image is provided
  const imageUrl = part.mainImage || "/default-part.png";
  const categories = part.categories ? part.categories.split(",").map(c => c.trim().toLowerCase()) : [];

  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/parts/${part.slug}`}>
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Img
            src={imageUrl}
            alt={part.name}
            width={400}
            height={300}
            className={`w-full h-full object-cover transform transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            external={true}
          />
          {categories.includes("featured") && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {part.name}
          </h3>

          <div className="mb-3">
            <p className="text-sm text-gray-600 line-clamp-2">{part.details.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-blue-600">
              ${part.price.toLocaleString()}
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              View Details
            </button>
          </div>

          {part.details?.features && part.details.features.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <div className="flex flex-wrap gap-2">
                {part.details.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                  >
                    {feature.value}
                  </span>
                ))}
                {part.details.features.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{part.details.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PartCard; 