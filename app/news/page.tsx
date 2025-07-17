"use client"; // This marks the component as a Client Component

import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Img } from '../../components/Img';
import AdBanner, { AdSlider } from '../../components/AdBanner';
import TikTokEmbed from '../../components/TikTokEmbed';
import "../styles/newspage.css";

interface Article {
  id: number;
  title: string;
  createdAt : string;
  excerpt: string;
  ImgUrl: string;
  category: string;
  date: string;
  author: string;
  description: string;
  cover: {
    url: string;
  } | null;
  categories: Array<{ name: string }>;
  publishedAt: string;
  locale: string;
  slug: string;
  blocks: any[];
}

interface StoryViewerProps {
  articles: Article[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StoryViewer = ({ articles, currentIndex, onClose, onNext, onPrevious }: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const currentArticle = articles[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total duration

    return () => clearInterval(timer);
  }, [currentIndex, onNext]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4">
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1">
          {articles.map((_, index) => (
            <div
              key={index}
              className="h-1 bg-gray-600 flex-1 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-50 ${
                  index === currentIndex ? 'w-full' : index < currentIndex ? 'w-full' : 'w-0'
                }`}
                style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300"
        >
          ×
        </button>

        {/* Story content */}
        <div className="relative aspect-[9/16] bg-white rounded-lg overflow-hidden">
          <Image
            src={`http://64.227.112.249${currentArticle.ImgUrl}`}
            alt={currentArticle.title}
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-white text-xl font-bold mb-2">{currentArticle.title}</h2>
            <p className="text-white text-sm">{currentArticle.excerpt}</p>
            <div className="flex justify-between items-center mt-2 text-white text-xs">
              <span>{currentArticle.date}</span>
              <span>{currentArticle.author}</span>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl hover:text-gray-300 disabled:opacity-50"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === articles.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-xl hover:text-gray-300 disabled:opacity-50"
        >
          ›
        </button>
      </div>
    </div>
  );
};

const StoryNews = ({ articles }: { articles: Article[] }) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleClose = () => {
    setSelectedStoryIndex(null);
  };

  const handleNext = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < articles.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto py-6 bg-white border-b rounded-lg">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 rtl:space-x-reverse rounded-lg">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500">
                    <Image
                      src={`http://64.227.112.249${article.ImgUrl}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    {/* <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {article.category}
                    </div> */}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[80px] text-center truncate">
                  {article.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewer
            articles={articles}
            currentIndex={selectedStoryIndex}
            onClose={handleClose}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: { 
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}) => {
  const t = useTranslations('HomePage');

  return (
    <div className="w-full py-4 bg-white border-b rounded-lg">
      <div className="container mx-auto px-4 rounded-lg">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onSelectCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  cover: {
    url: string;
  };
  categories: Array<{ name: string }>;
  author: {
    data: {
      attributes: {
        name: string;
        email: string;
      };
    };
  };
  tags: {
    data: Array<{
      attributes: {
        name: string;
      };
    }>;
  };
}

// Add the LinkByUploadAction function
async function LinkByUploadAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const formDataToSend = new FormData();
    formDataToSend.append("files", data.files);
    formDataToSend.append("ref", data.ref);
    formDataToSend.append("refId", data.refId);
    formDataToSend.append("field", data.field);

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
      method: "post",
      body: formDataToSend,
    });

    const result = await response.json();

    if (result.error) {
      return {
        uploadError: result.error.message,
        uploadSuccess: null,
      };
    }

    return {
      uploadSuccess: "Image uploaded successfully!",
      uploadError: null,
    };
  } catch (error: any) {
    return {
      uploadError: error.message,
      uploadSuccess: null,
    };
  }
}
// Update mock ads data with proper images and structure
const mockAds = [
  {
    id: 1,
    imageUrl: '/Dark Blue Modern Car Rental Promotion Facebook Post.png',
    link: 'https://example.com/ad1',
    alt: 'Advertisement 1',
    position: 'left'
  },
  {
    id: 2,
    imageUrl: '/Blue and White Modern Car Repair Services Poster.png',
    link: 'https://example.com/ad2',
    alt: 'Advertisement 2',
    position: 'right'
  },
  {
    id: 3,
    imageUrl: '/Blue and Black Modern Car Repair Service Instagram Post.png',
    link: 'https://example.com/ad3',
    alt: 'Advertisement 3',
    position: 'left'
  },
  {
    id: 4,
    imageUrl: '/Black Gold Modern Car Parts Track Tires Sale Instagram Post.png',
    link: 'https://example.com/ad4',
    alt: 'Advertisement 4',
    position: 'right'
  }
];
const middleDesktopAds = [
  {
    id: 1,
    imageUrl: '/Blue and Black Car For Rent Instagram Post.png',
    link: 'https://example.com/ad1',
    alt: 'Advertisement 1',
    position: 'left'
  },
  {
    id: 2,
    imageUrl: '/Black Gold Modern Car Parts Track Tires Sale Instagram Post.png',
    link: 'https://example.com/ad2',
    alt: 'Advertisement 2',
    position: 'right'
  },
  {
    id: 3,
    imageUrl: '/Black Blue Bold Car Repair Service Facebook Post.png',
    link: 'https://example.com/ad3',
    alt: 'Advertisement 3',
    position: 'left'
  },
  {
    id: 4,
    imageUrl: '/Blue and White Modern Car Repair Services Poster.png',
    link: 'https://example.com/ad4',
    alt: 'Advertisement 4',
    position: 'right'
  }
];

// Separate arrays for each ad section
const leftAds = mockAds.filter(ad => ad.position === 'left');
const rightAds = mockAds.filter(ad => ad.position === 'right');
const topMobileAds = mockAds.slice(0, 2); // Adjust as needed
const bottomMobileAds = mockAds.slice(2); // Adjust as needed

export default function NewsPage() {
  const router = useRouter();
  const t = useTranslations('NewsPage');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | 'he-IL'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ success: string | null; error: string | null }>({
    success: null,
    error: null
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [selectedLanguage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles?locale=${selectedLanguage}&sort=createdAt:desc`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      console.log('Raw API response:', data);
      console.log('Articles data:', data.data);

      const sortedNews = data.data ? data.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
      console.log('Sorted news:', sortedNews);
      setNews(sortedNews);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Filtered news:', filteredNews);



  // If no categorized news, show all news in each section for now
  const trendingNews = filteredNews.slice(0, 10);

  const featuredNewsbanner = filteredNews.length > 0 ? filteredNews[0] : null;

  const handleImageUpload = async (file: File, refId: string) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('ref', 'article');
      formData.append('refId', refId);
      formData.append('field', 'cover');

      const result = await LinkByUploadAction(null, formData);
      
      if (result.uploadError) {
        setUploadStatus({ success: null, error: result.uploadError });
        return false;
      }

      setUploadStatus({ success: result.uploadSuccess, error: null });
      return true;
    } catch (error) {
      setUploadStatus({ success: null, error: 'Failed to upload image' });
      return false;
    }
  };


  const featuredNews = filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "featured")
  );

  const latestNews = filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "latest news")
  );
  
  const localNews = filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "local news")
  );
  
  const worldNews = filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "world news")
  );
  
  const featuredStories = filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "featured stories")
  );

  // Fallback logic - if no categorized news, use all news
  const displayFeaturedStories = featuredStories.length > 0 ? featuredStories : filteredNews.slice(0, 3);
  const displayLocalNews = localNews.length > 0 ? localNews : filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "local news")
  );
  const displayWorldNews = worldNews.length > 0 ? worldNews : filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "world news")
  );
  const displayLatestNews = latestNews.length > 0 ? latestNews : filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "latest news")
  );

  console.log('Display arrays:', {
    trendingNews: trendingNews.length,
    total: filteredNews.length,
    featuredNews: featuredNews.length,
    featuredStories: displayFeaturedStories.length,
    localNews: displayLocalNews.length,
    worldNews: displayWorldNews.length,
    latestNews: displayLatestNews.length
  });
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">{t('error.loading')}</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="news-container">
        <main className="news-section">
          {/* Trending News Ticker */}
          {trendingNews.length > 0 && (
            <>
              <style jsx global>{`
                @keyframes ticker {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-ticker {
                  display: inline-block;
                  animation: ticker 90s linear infinite;
                }
              `}</style>
              <div className="news-trending-ticker lg:mt-[5%] md:mt-[5%] mt-[20%]">
                <div className="news-trending-content">
                  <span className="news-trending-label">
                    {t('trending')}
                  </span>
                  <div className="news-trending-items">
                    <div className="news-trending-scroll">
                      {trendingNews.map((item, idx) => (
                        <span key={item.id} className="inline-flex items-center">
                          <span 
                            className="hover:underline cursor-pointer transition-colors" 
                            onClick={() => router.push(`/news/${item.slug}`)}
                          >
                            {item.title}
                          </span>
                          {idx < trendingNews.length - 1 && <span className="mx-4">•</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Mobile Ads - Top */}
          {/* <div className="lg:hidden grid grid-cols-2 gap-4 mb-8">
            <AdSlider ads={topMobileAds} />
I notice there's a lint error indicating that `TikTokEmbed` is not defined. We need to import it first. Here's the corrected version:
           
            <div className="mb-8  bg-white rounded-lg p-4">
              <label className="block text-sm font-medium text-white mb-1">{t('news_category')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('choose_category')}</option>
                <option value="featured">{t('featured')}</option>
                <option value="latest">{t('latest')}</option>
                <option value="reviews">{t('reviews')}</option>
              </select>
            </div>
          </div>
{/* 
          {/* Featured Banner - Desktop Only 
          <div className="hidden md:block mt-[5%]">
            {filteredNews.length > 0 && (
              <div className="mb-8">
                <div className="relative bg-gradient-to-r from-blue-200 to-blue-800 rounded-xl overflow-hidden mt-[5%] h-96">
                  {/* Background image 
                  {featuredNewsbanner?.cover?.url && (
                    <Img
                      src={`http://64.227.112.249${featuredNewsbanner?.cover.url}`}
                      alt={featuredNewsbanner?.title}
                      external={true}
                      width={1290}
                      height={1290}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )}
                  {/* Overlay 
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  {/* Centered text 
                  <div className="relative z-20 flex flex-col items-center justify-center h-full w-full text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">
                      {featuredNewsbanner?.title}
                    </h1>
                    <p className="text-white/80 mb-4 text-base">
                      {featuredNewsbanner?.description}
                    </p>
                    <button 
                      onClick={() => router.push(`/news/${featuredNewsbanner?.slug}`)}
                      className="bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-blue-50"
                    >
                      {t('read_now')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div> */}

            {/* Hero Featured Article */}
            {displayFeaturedStories.length > 0 && (
              <div className="news-feature-article mb-12">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: displayFeaturedStories[0]?.cover?.url 
                      ? `url(http://64.227.112.249${displayFeaturedStories[0].cover.url})`
                      : 'none'
                  }}
                />
                <div className="news-feature-content">
                  <span className="news-tag mb-4">
                    {t('featured_story')}
                  </span>
                  <h1 className="news-feature-title">
                    {displayFeaturedStories[0]?.title}
                  </h1>
                  <p className="news-feature-excerpt">
                    {displayFeaturedStories[0]?.description}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-white/80">
                    <span>By {displayFeaturedStories[0]?.author?.data?.attributes?.name || t('unknown_author')}</span>
                    <span>•</span>
                    <span>{formatDate(displayFeaturedStories[0]?.publishedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Stories Grid */}
            <div className="news-magazine-layout mb-12">
              <div>
                <h2 className="news-heading-md mb-8">{t('featured_stories')}</h2>
                <div className="news-grid news-grid-5">
                  {displayFeaturedStories.slice(1).map((item) => (
                    <article
                      key={item.id}
                      className="news-card group cursor-pointer"
                      onClick={() => router.push(`/news/${item.slug}`)}
                    >
                      <div className="news-card-image relative overflow-hidden">
                        {item.cover?.url && (
                          <Img
                            src={`http://64.227.112.249${item.cover.url}`}
                            alt={item.title}
                            external={true}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="news-card-content">
                        <span className="news-tag news-tag-secondary mb-3">
                          {t('featured')}
                        </span>
                        <h3 className="news-heading-xs mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="news-body-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="news-caption">
                            By {item.author?.data?.attributes?.name || t('unknown_author')}
                          </span>
                          <span className="news-caption">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
         
          {/* Featured News - Different layouts for mobile and desktop */}
          <section className="mb-8 px-4 ">
            

            {/* Desktop Layout */}
            {/* <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-6 mb-8">
                {featuredNews.slice(2, 5).map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="relative h-48">
                      {item.cover?.url && (
                        <Img
                          src={`http://64.227.112.249${item.cover.url}`}
                          alt={item.title}
                          external={true}
                          width={512}
                          height={512}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-2xl mb-2 px-2">{item.title}</h3>
                      <p className="text-gray-600 text-base px-2">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div> */}
          </section>

          {/* View More Link - Mobile Only */}
          <div className="text-center mb-8 hidden lg:block ">
            <a href="#" className="text-white font-semibold hover:underline">
              {t('view_more')}
            </a>
          </div>

          {/* News Sections */}
          <div className="space-y-12">
            {/* Local News Section */}
            <section>
              <h2 className="news-heading-md mb-8">{t('local_news')}</h2>
              <div className="news-grid news-grid-3">
                {displayLocalNews.map((item) => (
                  <article
                    key={item.id}
                    className="news-card group cursor-pointer"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="news-card-image news-card-small">
                          {item.cover?.url && (
                            <Img
                              src={`http://64.227.112.249${item.cover.url}`}
                              alt={item.title}
                              external={true}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                      </div>
                      <div className="md:w-2/3 news-card-content">
                        <span className="news-tag news-tag-blue mb-2">{t('local')}</span>
                        <h3 className="news-heading-xs mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="news-body-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="news-caption">
                            By {item.author?.data?.attributes?.name || t('unknown_author')}
                          </span>
                          <span className="news-caption">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* World News Section */}
            <section>
              <h2 className="news-heading-md mb-8">{t('world_news')}</h2>
              <div className="news-grid news-grid-3">
                {displayWorldNews.map((item) => (
                  <article
                    key={item.id}
                    className="news-card group cursor-pointer"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="news-card-image news-card-small">
                          {item.cover?.url && (
                            <Img
                              src={`http://64.227.112.249${item.cover.url}`}
                              alt={item.title}
                              external={true}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                      </div>
                      <div className="md:w-2/3 news-card-content">
                        <span className="news-tag mb-2">{t('world')}</span>
                        <h3 className="news-heading-xs mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="news-body-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="news-caption">
                            By {item.author?.data?.attributes?.name || t('unknown_author')}
                          </span>
                          <span className="news-caption">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Latest News Section */}
            <section>
              <h2 className="news-heading-md mb-8">{t('latest_news')}</h2>
              <div className="news-grid news-grid-3">
                {displayLatestNews.map((item) => (
                  <article
                    key={item.id}
                    className="news-card group cursor-pointer"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="news-card-image relative overflow-hidden">
                      {item.cover?.url && (
                        <Img
                          src={`http://64.227.112.249${item.cover.url}`}
                          alt={item.title}
                          external={true}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="news-card-content">
                      <span className="news-tag news-tag-secondary mb-3">{t('latest')}</span>
                      <h3 className="news-heading-xs mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="news-body-sm mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="news-caption">
                          By {item.author?.data?.attributes?.name || t('unknown_author')}
                        </span>
                        <span className="news-caption">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* All News Section */}
          {filteredNews.length > 0 && (
            <section className="mt-12">
              <h2 className="news-heading-md mb-8">
                {t('all_news')} ({filteredNews.length} {t('articles')})
              </h2>
              <div className="news-grid news-grid-1 gap-6">
                {filteredNews.map((item) => (
                  <article
                    key={item.id}
                    className="news-card group cursor-pointer"
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/4">
                        <div className="news-card-image news-card-small">
                          {item.cover?.url && (
                            <Img
                              src={`http://64.227.112.249${item.cover.url}`}
                              alt={item.title}
                              external={true}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                      </div>
                      <div className="md:w-3/4 news-card-content">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.categories?.map((cat, index) => (
                            <span key={index} className="news-tag news-tag-secondary text-xs">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                        <h3 className="news-heading-xs mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="news-body-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="news-caption">
                            By {item.author?.data?.attributes?.name || t('unknown_author')}
                          </span>
                          <span className="news-caption">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
