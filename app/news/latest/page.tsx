import React from 'react';
import { Metadata } from 'next';
import LatestNewsSection from './components/LatestNewsSection';
import NewsCategories from './components/NewsCategories';
import TrendingNews from './components/TrendingNews';

export const metadata: Metadata = {
  title: 'Latest News | Car Dealer',
  description: 'Stay updated with the latest news in the automotive industry',
};

export default function LatestNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LatestNewsSection />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <NewsCategories />
            <TrendingNews />
          </div>
        </div>
      </div>
    </div>
  );
} 