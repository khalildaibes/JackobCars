"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import { Building2, Users, BarChart, Award, Send } from 'lucide-react';

const benefits = [
  {
    icon: Building2,
    title: "Brand Exposure",
    description: "Get your brand in front of thousands of potential customers through our platform."
  },
  {
    icon: Users,
    title: "Customer Network",
    description: "Access our extensive network of car enthusiasts and potential buyers."
  },
  {
    icon: BarChart,
    title: "Market Insights",
    description: "Receive detailed analytics and market insights to optimize your business."
  },
  {
    icon: Award,
    title: "Premium Support",
    description: "Dedicated account manager and priority customer support."
  }
];

const PartnershipPage = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <PageLayout pageKey="partnership">
      <div className="space-y-12">
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partnership Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Basic Tier */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Basic Partner</h3>
            <div className="text-3xl font-bold text-blue-600 mb-6">$499<span className="text-lg text-gray-500">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Basic listing features</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Standard analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Email support</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-blue-600 rounded-xl p-6 shadow-lg text-white transform scale-105">
            <h3 className="text-xl font-bold mb-4">Premium Partner</h3>
            <div className="text-3xl font-bold mb-6">$999<span className="text-lg opacity-80">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>All Basic features</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Featured listings</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Advanced analytics</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Get Started
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Enterprise</h3>
            <div className="text-3xl font-bold text-blue-600 mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>All Premium features</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Custom integration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Custom analytics</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
              Contact Sales
            </button>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default PartnershipPage; 