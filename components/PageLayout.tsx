"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface PageLayoutProps {
  pageKey: string;
  children: React.ReactNode;
}

const PageLayout = ({ pageKey, children }: PageLayoutProps) => {
  const t = useTranslations('Pages');

  return (
    <div className="min-h-screen bg-gray-50 pb-12 page-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t(`${pageKey}.title`)}
              </h1>
              <p className="text-gray-600 mb-8">
                {t(`${pageKey}.description`)}
              </p>
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageLayout; 