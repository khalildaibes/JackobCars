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
            src={`http://68.183.215.202${currentArticle.ImgUrl}`}
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
                      src={`http://68.183.215.202${article.ImgUrl}`}
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
  categories: any;
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
      url: any;
    };
    author: {
      data: {
        name: string;
        attributes: {
          name: string;
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

  return (
    <div className="min-h-screen bg-gray-50 mt-[5%]">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">{t('welcome')}</h1>
            <p className="text-xl mb-8">{t('description')}</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Link
                href="/findcarbyplate"
                className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('search_by_plate')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/carsearch"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-blue-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('quick_actions.search_cars')}</h3>
            <p className="text-gray-600">{t('quick_actions.search_cars_desc')}</p>
          </Link>
          <Link
            href="/blog/create"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-blue-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('quick_actions.create_post')}</h3>
            <p className="text-gray-600">{t('quick_actions.create_post_desc')}</p>
          </Link>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-blue-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('quick_actions.contact_us')}</h3>
            <p className="text-gray-600">{t('quick_actions.contact_us_desc')}</p>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t('news_grid.title')}</h2>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'ar' | 'he-IL')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">{t('language_selector.english')}</option>
            <option value="ar">{t('language_selector.arabic')}</option>
            <option value="he-IL">{t('language_selector.hebrew')}</option>
          </select>
        </div>

        {uploadStatus.error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {t('error.upload_error')}
          </div>
        )}

        {uploadStatus.success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
            {t('error.upload_success')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {item.cover?.url && (
                <div className="relative h-48">
                  <Img
                    src={`http://68.183.215.202${item.cover?.url}`}
                    alt={item.title}
                    external={true}
                    width={1024}
                    height={1024}
                    className="object-cover w-full h-full"
                    onError={async (e) => {
                      const imgElement = e.target as HTMLImageElement;
                      const response = await fetch(imgElement.src);
                      const blob = await response.blob();
                      const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
                      await handleImageUpload(file, item.id);
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {item.tags?.data.map((tag) => (
                    <span
                      key={tag.attributes.name}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag.attributes.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{item.author?.data?.name || t('news_grid.anonymous')}</span>
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
                <button
                  onClick={() => router.push(`/news/${item.slug}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('news_grid.read_more')}
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('news_grid.no_articles')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
