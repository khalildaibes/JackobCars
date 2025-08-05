"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Star, Quote, Verified, CheckCircle } from 'lucide-react';
import { Img } from './Img';
import { Button } from './ui/button';

const CelebrityEndorsement = () => {
  const t = useTranslations("CelebrityEndorsement");

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 mb-12 rounded-2xl overflow-hidden relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/car-pattern.svg')] bg-repeat bg-opacity-5"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-6 right-6 opacity-20">
        <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute bottom-6 left-6 opacity-20">
        <CheckCircle className="w-6 h-6 text-green-500 animate-bounce" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Verified className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              {t('trusted_by_celebrities') || 'Trusted by Celebrities'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('celebrity_headline') || 'The Choice of Stars'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('celebrity_subheadline') || 'Discover why celebrities choose us for their automotive needs'}
          </p>
        </motion.div>

        {/* Main Celebrity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Celebrity Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              {/* Celebrity Photo Placeholder - Replace with actual celebrity image */}
              <div className="relative h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                {/* Replace this div with actual celebrity image */}
                <Img
                  src="/images/celebrity-endorsement.jpg" // Add your celebrity image here
                  alt="Celebrity Endorser"
                  width={600}
                  height={500}
                  className="object-cover w-full h-full"
                  external={false}
                />
                {/* Fallback if no image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium">
                  Celebrity Photo
                </div>
              </div>
              
              {/* Overlay Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Celebrity Choice</span>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white rounded-full px-3 py-1 shadow-lg">
                <div className="flex items-center gap-1">
                  <Verified className="w-4 h-4" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* Floating Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs"
            >
              <Quote className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-700 italic">
                "{t('celebrity_quote') || 'Exceptional service and unmatched quality. This is where I trust my automotive needs.'}"
              </p>
              <p className="text-xs font-semibold text-blue-600 mt-2">
                - {t('celebrity_name') || 'Celebrity Name'}
              </p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            {/* Celebrity Name & Title */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('celebrity_name') || 'Celebrity Name'}
              </h3>
              <p className="text-blue-600 font-medium mb-4">
                {t('celebrity_title') || 'Actor • Producer • Car Enthusiast'}
              </p>
            </div>

            {/* Quote */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Quote className="w-8 h-8 text-blue-600 mb-4" />
              <blockquote className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                "{t('celebrity_testimonial') || 'I\'ve worked with many dealerships over the years, but this one stands out. The professionalism, attention to detail, and exceptional service make them my go-to choice for all automotive needs. When you\'re in the spotlight, you need partners you can trust completely.'}"
              </blockquote>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0 Rating</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🏆', text: t('premium_service') || 'Premium Service' },
                { icon: '🔒', text: t('discretion_privacy') || 'Discretion & Privacy' },
                { icon: '⚡', text: t('fast_delivery') || 'Fast Delivery' },
                { icon: '💎', text: t('luxury_collection') || 'Luxury Collection' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 bg-white/50 rounded-lg p-3"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('explore_collection') || 'Explore Our Collection'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                {t('contact_us') || 'Contact Us'}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>{t('verified_celebrity') || 'Verified Celebrity Customer'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span>{t('five_star_service') || '5-Star Premium Service'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Verified className="w-5 h-5 text-blue-600" />
              <span>{t('trusted_brand') || 'Trusted by Industry Leaders'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CelebrityEndorsement;