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
  slug: string;
  excerpt: string;
  rating: number;
  imageUrl: string;
  carMake: string;
  carModel: string;
  carYear: number;
  reviewDate: string;
  author: string;
  reviewType: 'road-test' | 'first-drive' | 'comparison' | 'long-term';
  pros: string[];
  cons: string[];
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
  
  // Transform Strapi articles to CarReview format
  return carReviewArticles.slice(0, 4).map((article: any) => ({
    id: article.id,
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || article.description || '',
    rating: 4.5, // Default rating, could be added to Strapi schema
    imageUrl: article.cover?.url || '',
    carMake: extractCarMake(article.title),
    carModel: extractCarModel(article.title),
    carYear: extractCarYear(article.title),
    reviewDate: article.publishedAt || article.createdAt,
    author: article.author?.data?.attributes?.name || 'Editorial Team',
    reviewType: determineReviewType(article.title, article.categories),
    pros: extractProsFromContent(article.description || article.excerpt),
    cons: extractConsFromContent(article.description || article.excerpt)
  }));
};

// Helper functions to extract car info from article content
const extractCarMake = (title: string): string => {
  const makes = ['Toyota', 'BMW', 'Mercedes', 'Tesla', 'Honda', 'Ford', 'Audi', 'Volkswagen'];
  const found = makes.find(make => title.toLowerCase().includes(make.toLowerCase()));
  return found || 'Various';
};

const extractCarModel = (title: string): string => {
  const models = ['Camry', 'X5', 'GLE', 'Model 3', 'CR-V', 'Prius', 'Q7', 'Golf'];
  const found = models.find(model => title.toLowerCase().includes(model.toLowerCase()));
  return found || 'Multiple';
};

const extractCarYear = (title: string): number => {
  const yearMatch = title.match(/20\d{2}/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
};

const determineReviewType = (title: string, categories: any[]): 'road-test' | 'first-drive' | 'comparison' | 'long-term' => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('vs') || titleLower.includes('comparison')) return 'comparison';
  if (titleLower.includes('first drive')) return 'first-drive';
  if (titleLower.includes('long term') || titleLower.includes('months')) return 'long-term';
  return 'road-test';
};

const extractProsFromContent = (content: string): string[] => {
  // Simple extraction - in real implementation, you might parse content better
  return [
    'Great performance',
    'Excellent fuel economy',
    'Advanced features'
  ];
};

const extractConsFromContent = (content: string): string[] => {
  // Simple extraction - in real implementation, you might parse content better
  return [
    'High price point',
    'Complex controls'
  ];
};

const LatestCarReviews: React.FC<LatestCarReviewsProps> = ({
  reviews,
  title,
  viewAllLink = '/reviews'
}) => {
  const t = useTranslations('CarReviews');
  
  // Use React Query to fetch car reviews
  const { data: fetchedReviews, isLoading, error } = useQuery({
    queryKey: ['carReviews'],
    queryFn: fetchCarReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const reviewsToShow = reviews || fetchedReviews || [];

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

  if (isLoading) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error || reviewsToShow.length === 0) {
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
                  src={review.imageUrl ? `http://64.227.112.249${review.imageUrl}` : '/images/default-car-review.jpg'}
                  alt={review.title}
                  className="object-cover w-full h-full"
                  width={400}
                  height={192}
                  external={true}
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewTypeColor(review.reviewType)}`}>
                    {getReviewTypeLabel(review.reviewType)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{review.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                  <User className="w-3 h-3 ml-2" />
                  <span>{review.author}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {review.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {review.excerpt}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-green-600 mb-1">{t('pros')}</h4>
                    <ul className="text-xs text-gray-600">
                      {review.pros.slice(0, 2).map((pro, i) => (
                        <li key={i} className="line-clamp-1">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-red-600 mb-1">{t('cons')}</h4>
                    <ul className="text-xs text-gray-600">
                      {review.cons.slice(0, 2).map((con, i) => (
                        <li key={i} className="line-clamp-1">• {con}</li>
                      ))}
                    </ul>
                  </div>
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