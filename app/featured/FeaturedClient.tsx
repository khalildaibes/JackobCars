"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, DollarSign, Fuel, Calendar } from 'lucide-react';

const featuredCars = [
  {
    id: 1,
    title: "2024 BMW X5 M",
    price: 108900,
    image: "/images/bmw-x5.jpg",
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
    image: "/images/mercedes-eqs.jpg",
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
    image: "/images/porsche-taycan.jpg",
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

export default function FeaturedClient() {
  return (
    <div className="bg-white-A700 flex flex-col font-dmsans items-center justify-start mx-auto w-full">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Featured Vehicles
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our premium collection of featured vehicles at MaxSpeedLimit - ضمن السرعه القانونيه. 
            Each vehicle is carefully selected for quality, performance, and value.
          </p>
        </motion.div>

        {/* Featured Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Car Image</p>
                  </div>
                </div>
                {car.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{car.title}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium">{car.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">{car.specs.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Fuel size={16} />
                    <span className="text-sm">{car.specs.fuel}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} className="text-blue-600" />
                    <span className="text-lg font-semibold text-blue-600">
                      {car.price.toLocaleString()}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
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
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Want to Feature Your Car?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            List your vehicle in our featured section and reach thousands of potential buyers at MaxSpeedLimit.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            List Your Car
          </button>
        </motion.div>
      </div>
    </div>
  );
} 