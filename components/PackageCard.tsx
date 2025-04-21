"use client";

import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Wine, Star, MapPin, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from 'next/image';

interface PackageCardProps {
  title: string;
  subtitle?: string;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  nights: number;
  image: string;
  startDate: string;
  endDate: string;
  guests: number;
  rooms: number;
  packageType: string;
}

const PackageCard = ({ 
  title, 
  subtitle,
  location, 
  price, 
  originalPrice,
  rating,
  nights,
  image,
  startDate,
  endDate,
  guests,
  rooms,
  packageType
}: PackageCardProps) => {
  const t = useTranslations("Package");

  const renderStars = (rating: number) => {
    return Array(Math.floor(rating)).fill(null).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <Card className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Section with Icon and Type */}
        <div className="w-full md:w-[200px] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
          <div className="mb-4">
            <Wine className="w-12 h-12 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-center">{packageType}</h3>
          <p className="text-sm text-gray-500 text-center">{subtitle}</p>
        </div>

        {/* Middle Section with Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
            <div className="flex">{renderStars(rating)}</div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{startDate} - {endDate}</span>
            </div>
            <span>•</span>
            <span>{nights} {t('nights')}</span>
            <span>•</span>
            <span>{rooms} {t('rooms')}, {guests} {t('guests')}</span>
          </div>
        </div>

        {/* Right Section with Price and Button */}
        <div className="w-full md:w-[250px] p-6 flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center mb-4">
            {originalPrice && (
              <p className="text-red-500 line-through text-sm">${originalPrice}</p>
            )}
            <p className="text-3xl font-bold">${price}</p>
            <p className="text-sm text-gray-500">{t('total_price')}</p>
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {t('book_now')}
          </Button>
        </div>
      </div>

      {/* Circular Image */}
      <div className="absolute top-6 right-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </Card>
  );
};

export default PackageCard; 