"use client";

import Link from "next/link";
import { Img } from "./Img";

interface ServiceCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  stores: {
    hostname: string;
  }[];
  image: {
    url: string;
  }[];
  slug: string;
  hostname: string;
  onClick?: () => void;
}

export const ServiceCard = ({
  id,
  title,
  description,
  price,
  image,
  stores,
  slug,
  hostname,
  onClick,
}: ServiceCardProps) => {
  return (
    <Link href={`/services/${slug}?store_hostname=${hostname ?? stores[0]?.hostname ?? ""}`}>  
    <div
      key={id}
      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Img
          width={1920}
          height={1080}
          external={true}
          src={`${
            hostname === "64.227.112.249"
              ? process.env.NEXT_PUBLIC_STRAPI_URL
              : `http://${hostname}`
          }${image?.[0]?.url || '/default-service.png'}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative p-6 h-full min-h-[300px] flex flex-col justify-end">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-3">
          <h3 className="text-xl font-semibold text-white line-clamp-1">
            {title}
          </h3>
          
          {description && (
            <p className="text-white/80 text-sm line-clamp-2">{description}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-white">
              ${price.toLocaleString()}
            </span>
            <button
              onClick={onClick}
              className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2 backdrop-blur-sm"
            >
              View Details
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ServiceCard; 