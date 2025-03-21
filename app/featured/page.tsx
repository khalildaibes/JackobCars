"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, DollarSign, Fuel, Calendar } from 'lucide-react';
import { manufacturers } from '../../constants';

const featuredCars = [
  {
    id: 1,
    title: "2024 BMW X5 M",
    price: 108900,
    image: "/cars/bmw-x5.jpg",
    specs: {
      year: 2024,
      mileage: "0",
      fuel: "Gasoline",
      transmission: "Automatic"
    },
    rating: 4.8,
    featured: true
  },
  {
    id: 2,
    title: "2024 Mercedes-Benz EQS",
    price: 104400,
    image: "/cars/mercedes-eqs.jpg",
    specs: {
      year: 2024,
      mileage: "0",
      fuel: "Electric",
      transmission: "Automatic"
    },
    rating: 4.9,
    featured: true
  },
  {
    id: 3,
    title: "2024 Porsche Taycan",
    price: 86700,
    image: "/cars/porsche-taycan.jpg",
    specs: {
      year: 2024,
      mileage: "0",
      fuel: "Electric",
      transmission: "Automatic"
    },
    rating: 4.7,
    featured: true
  }
];

const FeaturedPage = () => {
  const [selectedManufacturer, setSelectedManufacturer] = React.useState("");
  const [priceRange, setPriceRange] = React.useState([0, 200000]);
  const [fuelType, setFuelType] = React.useState("");

  return (
    <PageLayout pageKey="featured">
      <div className="space-y-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Manufacturers</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Featured Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={car.image}
                  alt={car.title}
                  fill
                  className="object-cover"
                />
                {car.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{car.title}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span>{car.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>{car.specs.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Fuel size={16} />
                    <span>{car.specs.fuel}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="text-lg font-semibold text-green-600">
                      {car.price.toLocaleString()}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Want to Feature Your Car?</h3>
          <p className="text-white/80 mb-6">List your vehicle in our featured section and reach thousands of potential buyers.</p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            List Your Car
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default FeaturedPage; 