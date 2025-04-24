"use client"; // This marks the component as a Client Component

import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Img } from '../../components/Img';

interface Article {
  id: number;
  title: string;
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
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
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
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300 disabled:opacity-50"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === articles.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300 disabled:opacity-50"
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
      const response = await fetch(`/api/articles?locale=${selectedLanguage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      console.log(data)
      setNews(data.data || []);
    } catch (err) {
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

  const featuredNews = filteredNews.filter(item => 
    item.categories?.some(tag => tag.name === "featured")
  );

  const latestNews = filteredNews.filter(item => 
    item.categories.some(tag => tag.name === "latest news")
  );

  const featuredStories = filteredNews.filter(item => 
    item.categories.some(tag => tag.name === "featured stories")
  );

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
  const featuredNewsbanner = filteredNews.filter(item => item.categories.some(tag => tag.name === "Featured Banner"))[0]
  return (
    <div className="min-h-screen bg-[#050B20]  md:mt-[5%] mt-[15%] ">
      <main className="max-w-7xl mx-auto px-4 md:mt-[5%] mt-[15%] min-h-screen pb-[5%] bg-white">
        {/* Mobile Title and Category - Only visible on mobile */}
        <div className="md:hidden bg-white rounded-lg p-4 ">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
            <p className="mt-2 text-gray-600">
              {t('subtitle')}
            </p>
          </div>

          <div className="mb-8">
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

        {/* Featured Banner - Desktop Only */}
        <div className="hidden md:block mt-[5%]">
          {filteredNews.length > 0 && (
            <div className="mb-8">
              <div className="p-8 bg-gradient-to-r from-blue-200 to-blue-800 rounded-xl overflow-hidden relative mt-[5%]">
                <div className="flex items-center ">
                  <div className="w-1/2">
                    <h1 className="text-4xl font-bold text-white mb-4">
                      {featuredNewsbanner?.title}
                    </h1>
                    <p className="text-white/80 mb-4">
                      {featuredNewsbanner?.description}
                    </p>
                    <button 
                      onClick={() => router.push(`/news/${featuredNewsbanner?.slug}`)}
                      className="bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-blue-50"
                    >
                      {t('read_now')}
                    </button>
                  </div>
                  <div className="w-1/2 relative h-96">
                    {featuredNewsbanner?.cover?.url && (
                      <Img
                        src={`http://64.227.112.249${featuredNewsbanner?.cover.url}`}
                        alt={featuredNewsbanner?.title}
                        external={true}
                        width={1290}
                        height={1290}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured News - Different layouts for mobile and desktop */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl text-white font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-800 rounded-xl p-4">{t('featured_news')}</h2>
          {featuredNews.length > 0 && (
            <div className="md:hidden space-y-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              {/* Mobile Layout */}
              <article 
                className="relative rounded-lg overflow-hidden cursor-pointer "
                onClick={() => router.push(`/news/${featuredNews[0].slug}`)}
              >
                <div className="aspect-[16/9] relative space-y-4 bg-white  rounded-lg p-4">
                  {featuredNews[0].cover?.url && (
                    <Img
                      src={`http://64.227.112.249${featuredNews[0].cover.url}`}
                      alt={featuredNews[0].title}
                      external={true}
                      width={800}
                      height={450}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-xl font-bold text-white mb-2">{featuredNews[0].title}</h3>
                  <div className="flex items-center text-sm text-white">
                    <span>{featuredNews[0].author?.data?.attributes?.name || 'Unknown Author'}</span>
                    <span className="mx-2">|</span>
                    <span>{formatDate(featuredNews[0].publishedAt)}</span>
                  </div>
                </div>
              </article>

              {featuredNews.slice(1).map((item) => (
                <article
                  key={item.id}
                  onClick={() => router.push(`/news/${item.slug}`)}
                  className="flex items-center space-x-4 cursor-pointer bg-white rounded-lg p-4"
                >
                  <div className="w-24 h-24 relative flex-shrink-0">
                    {item.cover?.url && (
                      <Img
                        src={`http://64.227.112.249${item.cover.url}`}
                        alt={item.title}
                        external={true}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-black mt-1">{item.author?.data?.attributes?.name || 'Unknown Author'}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-6">
              {featuredNews.slice(0, 3).map((item) => (
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
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* View More Link - Mobile Only */}
        <div className="text-center mb-8 md:hidden">
          <a href="#" className="text-white font-semibold hover:underline">
            {t('view_more')}
          </a>
        </div>

        {/* Latest News and Featured Stories - Different layouts for mobile and desktop */}
        <div className="md:grid md:grid-cols-3 md:gap-8">
          {/* Latest News */}
          <div className="md:col-span-2">
            <h2 className="text-2xl text-white font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-800 rounded-xl p-4">{t('latest_news')}</h2>
            <div className="space-y-6">
              {latestNews.map((item) => (
                <article
                  key={item.id}
                  className="md:bg-white md:rounded-xl md:shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/news/${item.slug}`)}
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 aspect-[16/9] md:aspect-auto relative">
                      {item.cover?.url && (
                        <Img
                          src={`http://64.227.112.249${item.cover.url}`}
                          alt={item.title}
                          external={true}
                          width={512}
                          height={512}
                          className="object-cover w-full h-full md:h-48"
                        />
                      )}
                    </div>
                    <div className="mt-3 md:mt-0 md:w-2/3 md:p-4">
                      <div className="text-sm text-gray-600 mb-1">{t('expert_review')}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="text-sm text-gray-600">
                        <span>{t('by')} {item.author?.data?.attributes?.name || 'Unknown Author'}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Featured Stories */}
          <div>
            <h2 className="text-2xl text-white font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-800 rounded-xl p-4">{t('featured_stories')}</h2>
            <div className="space-y-6">
              {featuredStories.map((item) => (
                <article
                  key={item.id}
                  className="md:bg-white md:rounded-xl md:shadow-sm overflow-hidden cursor-pointer p-4"
                  onClick={() => router.push(`/news/${item.slug}`)}
                >
                  <div className="flex items-start space-x-4 px-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Expert Review</div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <div className="text-sm text-gray-600">
                        By {item.author?.data?.attributes?.name || 'Unknown Author'}
                      </div>
                    </div>
                    <div className="w-24 h-24 relative flex-shrink-0">
                      {item.cover?.url && (
                        <Img
                          src={`http://64.227.112.249${item.cover.url}`}
                          alt={item.title}
                          external={true}
                          width={500}
                          height={500}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
