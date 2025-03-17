
"use client"; // This marks the component as a Client Component


import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FeaturedNews from '../../components/FeaturedNews';
import NewsGrid from '../../components/NewsGrid';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  useEffect(() => {
    // Show welcome toast when the page loads
    // toast.success('Welcome to AutoNews', {
    //   description: 'Discover the latest automotive news and trends',
    //   duration: 5000,
    // });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      
      <main>
        <HeroSection 
          title="The Evolution of Performance: Electric Supercars Redefining Speed"
          description="As battery technology advances, electric vehicles are not just matching but exceeding the performance of traditional supercars. We explore the new generation of high-performance EVs that are challenging everything we thought we knew about automotive excellence."
          imageUrl="https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          category="Electric Performance"
          date="May 18, 2023"
        />
        
        <FeaturedNews />
        
        <NewsGrid />
        
        <section className="py-16 bg-blue-600-50">
          <div className="container mx-auto px-6 md:px-0 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with Automotive Excellence
              </h2>
              <p className="text-gray-600 mb-8">
                Join our community of car enthusiasts and industry professionals to receive curated content about the automotive world.
              </p>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-grow px-4 py-3 mb-4 md:mb-0 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600-700 transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
