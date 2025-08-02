'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, TrendingUp, Eye, Heart } from 'lucide-react';
import { Img } from '../Img';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

interface Feature {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  publishDate: string;
  author: string;
  readTime: number;
  category: string;
  featured?: boolean;
  tags: string[];
  views?: number;
  likes?: number;
}

interface FeaturesFromJackobProps {
  features?: Feature[];
  title?: string;
  viewAllLink?: string;
}

// Fetch function for latest articles
const fetchLatestFeatures = async (): Promise<Feature[]> => {
  const response = await fetch('/api/articles?limit=12&sort=createdAt:desc');
  if (!response.ok) throw new Error('Failed to fetch latest features');
  
  const data = await response.json();
  if (!data?.data) return [];
  
  // Transform Strapi articles to Feature format
  return data.data.map((article: any, index: number) => ({
    id: article.id,
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || article.description || '',
    imageUrl: article.cover?.url || '',
    publishDate: article.publishedAt || article.createdAt,
    author: article.author?.data?.attributes?.name || 'Editorial Team',
    readTime: estimateReadTime(article.description || article.excerpt || ''),
    category: article.categories?.[0]?.name || 'Editorial',
    featured: index === 0, // Mark first article as featured
    tags: article.categories?.map((cat: any) => cat.name) || [],
    views: Math.floor(Math.random() * 5000) + 1000, // Random views for demo
    likes: Math.floor(Math.random() * 500) + 50 // Random likes for demo
  }));
};

// Helper function to estimate read time
const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const FeaturesFromJackob: React.FC<FeaturesFromJackobProps> = ({
  features,
  title,
  viewAllLink = '/news'
}) => {
  const t = useTranslations('FeaturesFromJackob');
  
  // Use React Query to fetch latest features
  const { data: fetchedFeatures, isLoading, error } = useQuery({
    queryKey: ['latestFeatures'],
    queryFn: fetchLatestFeatures,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const featuresToShow = features || fetchedFeatures || [];
  
  if (isLoading) {
    return (
      <motion.section className="w-full bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </motion.section>
    );
  }

  if (error || featuresToShow.length === 0) {
    return null; // Don't render if no features available
  }

  const featuredArticle = featuresToShow.find(f => f.featured) || featuresToShow[0];
  const featuredArticle2 = featuresToShow.find(f => f.featured && f.id !== featuredArticle.id) || featuresToShow[1];
  const otherFeatures = featuresToShow.filter(f => f.id !== featuredArticle.id && f.id !== featuredArticle2.id).slice(0, 5);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 mb-8"
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
          {t('view_all')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Article */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-xl overflow-hidden group flex flex-col gap-4"
          >
            <Link href={`/news/${featuredArticle.slug}`}>
              <div className="relative h-80">
                <Img
                  src={featuredArticle.imageUrl ? `http://64.227.112.249${featuredArticle.imageUrl}` : '/images/default-feature.jpg'}
                  alt={featuredArticle.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  width={1290}
                  height={1290}
                  external={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t('featured')}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                        {featuredArticle.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(featuredArticle.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{featuredArticle.author}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-white/90 line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{featuredArticle.views?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{featuredArticle.likes}</span>
                      </div>
                      <span>{featuredArticle.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href={`/news/${featuredArticle2.slug}`}>
              <div className="relative h-80 ">
                <Img
                  src={featuredArticle2.imageUrl ? `http://64.227.112.249${featuredArticle2.imageUrl}` : '/images/default-feature.jpg'}
                  alt={featuredArticle2.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  width={1290}
                  height={1290}
                  external={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t('featured')}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                        {featuredArticle2.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(featuredArticle2.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{featuredArticle2.author}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                      {featuredArticle2.title}
                    </h3>
                    <p className="text-white/90 line-clamp-2">
                      {featuredArticle2.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{featuredArticle2.views?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{featuredArticle2.likes}</span>
                      </div>
                      <span>{featuredArticle2.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Other Features */}
        <div className="space-y-4">
          {otherFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <Link href={`/news/${feature.slug}`}>
                <div className="flex gap-3 p-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Img
                      src={feature.imageUrl ? `http://64.227.112.249${feature.imageUrl}` : '/images/default-feature.jpg'}
                      alt={feature.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      width={1290}
                      height={1290}
                      external={true}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                        {feature.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {feature.readTime} min
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{feature.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(feature.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">{t('trending_topics')}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Extract trending topics from articles */}
          {Array.from(new Set(featuresToShow.flatMap(f => f.tags))).slice(0, 8).map((topic, index) => (
            <Link
              key={index}
              href={`/news?category=${encodeURIComponent(topic)}`}
              className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors"
            >
              #{topic.replace(/\s+/g, '')}
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesFromJackob; 