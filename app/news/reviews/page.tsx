import React from 'react';
import { Metadata } from 'next';
import ReviewList from './components/ReviewList';
import ReviewFilters from './components/ReviewFilters';
import PopularReviews from './components/PopularReviews';

export const metadata: Metadata = {
  title: 'Car Reviews | Car Dealer',
  description: 'Expert reviews and analysis of the latest car models',
};

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Car Reviews</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ReviewFilters />
          <ReviewList />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <PopularReviews />
          </div>
        </div>
      </div>
    </div>
  );
} 