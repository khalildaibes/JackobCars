"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import { Car, Search, FileCheck, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Search Cars",
    description: "Browse through our extensive collection of cars or use our advanced search filters to find exactly what you're looking for."
  },
  {
    icon: FileCheck,
    title: "Compare Features",
    description: "Compare different cars side by side, examining their specifications, features, and prices to make an informed decision."
  },
  {
    icon: Car,
    title: "Book a Test Drive",
    description: "Schedule a test drive with your selected vehicle at a time that's convenient for you."
  },
  {
    icon: Star,
    title: "Make Your Choice",
    description: "Once you've found your perfect car, our team will guide you through the purchase process."
  }
];

const HowItWorks = () => {
  return (
    <PageLayout pageKey="how_it_works">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default HowItWorks; 