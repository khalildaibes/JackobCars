import React from 'react';
import { Metadata } from 'next';
import IndustryNewsList from './components/IndustryNewsList';
import IndustryStats from './components/IndustryStats';
import IndustryTrends from './components/IndustryTrends';

export const metadata: Metadata = {
  title: 'Industry News | Car Dealer',
  description: 'Latest updates and trends in the automotive industry',
};

export default function IndustryNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Industry News</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <IndustryNewsList />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <IndustryStats />
            <IndustryTrends />
          </div>
        </div>
      </div>
    </div>
  );
} 