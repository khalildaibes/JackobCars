'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, User, ArrowRight } from 'lucide-react';
import { Img } from '../Img';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

interface CarReview {
  id: string;
  title: string;
  excerpt?: string;
  cover?: { url: string };
  categories?: Array<{ name: string }>;
  publishedAt: string;
  author?: {
    data?: {
      attributes?: {
        name: string;
        email?: string;
      };
    };
  };
  description?: string;
  locale?: string;
  slug: string;
  blocks?: any[];
}

interface LatestCarReviewsProps {
  reviews?: CarReview[];
  title?: string;
  viewAllLink?: string;
}

// Fetch function for car review articles
const fetchCarReviews = async (): Promise<CarReview[]> => {
  const response = await fetch('/api/articles?limit=8&sort=createdAt:desc');
  if (!response.ok) throw new Error('Failed to fetch car reviews');
  
  const data = await response.json();
  if (!data?.data) return [];
  
  // Filter articles that have 'car review' in their categories
  const carReviewArticles = data.data.filter((article: any) => 
    article.categories?.some((category: any) => 
      category.name.toLowerCase().includes('car review') || 
      category.name.toLowerCase().includes('review')
    )
  );
  
  return carReviewArticles.slice(0, 4);
};

const LatestCarReviews: React.FC<LatestCarReviewsProps> = ({
  reviews,
  title,
  viewAllLink = '/reviews'
}) => {
  const t = useTranslations('CarReviews');
  
  // Use React Query to fetch car reviews if none provided
  const { data: fetchedReviews, isLoading, error } = useQuery({
    queryKey: ['carReviews'],
    queryFn: fetchCarReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !reviews || reviews.length === 0, // Only fetch if no reviews provided
  });
  
  const reviewsToShow = reviews || fetchedReviews || [];
  console.log("reviewsToShow", reviewsToShow);

  const getReviewTypeColor = (type: string) => {
    switch (type) {
      case 'road-test': return 'bg-blue-100 text-blue-800';
      case 'first-drive': return 'bg-green-100 text-green-800';
      case 'comparison': return 'bg-purple-100 text-purple-800';
      case 'long-term': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReviewTypeLabel = (type: string) => {
    switch (type) {
      case 'road-test': return t('road_test');
      case 'first-drive': return t('first_drive');
      case 'comparison': return t('comparison');
      case 'long-term': return t('long_term');
      default: return t('review');
    }
  };

  if (isLoading && (!reviews || reviews.length === 0)) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error && (!reviews || reviews.length === 0)) {
    return null; // Don't render if no reviews available and fetch failed
  }

  if (reviewsToShow.length === 0) {
    return null; // Don't render if no reviews available
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title || t('title')}</h2>
          <p className="text-gray-600">{t('description')}</p>
        </div>
        <Link 
          href={viewAllLink}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('view_all_reviews')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {reviewsToShow.slice(0, 4).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/news/${review.slug}`}>
              <div className="relative h-48">
                <Img
                  src={review.cover?.url ? `http://64.227.112.249${review.cover.url}` : '/images/default-car-review.jpg'}
                  alt={review.title}
                  className="object-cover w-full h-full"
                  width={1290}
                  height={1290}
                  external={true}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t('review')}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">4.5</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{review.publishedAt ? new Date(review.publishedAt).toLocaleDateString() : 'N/A'}</span>
                  <User className="w-3 h-3 ml-2" />
                  <span>{review.author?.data?.attributes?.name || 'Editorial Team'}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {review.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {review.excerpt || review.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {review.categories?.[0]?.name || 'General'}
                  </span>
                  <span className="text-blue-600 hover:text-blue-800">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default LatestCarReviews; 