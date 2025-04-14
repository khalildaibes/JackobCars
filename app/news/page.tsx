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
  const [selectedCategory, setSelectedCategory] = useState('');
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

  const featuredNews = filteredNews.filter(item => 
    item.categories?.some(category => category.name === "featured")
  );

  const latestNews = filteredNews.filter(item => 
    item.categories?.some(category => category.name === "latest news")
  );

  const featuredStories = filteredNews.filter(item => 
    item.categories?.some(category => category.name === "featured stories")
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
    <div className="min-h-screen bg-white">


      <main className="max-w-7xl mx-auto px-4">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-gray-900">News & videos</h1>
          <p className="mt-2 text-gray-600">
            The latest car news, videos and expert reviews, from Cars.com's independent automotive journalists
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">News category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a category</option>
            <option value="featured">Featured</option>
            <option value="latest">Latest News</option>
            <option value="reviews">Expert Reviews</option>
          </select>
        </div>

        {/* Featured News */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured news</h2>
          {featuredNews.length > 0 && (
            <div className="space-y-4">
              {/* Main Featured Article */}
              <article 
                className="relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => router.push(`/news/${featuredNews[0].slug}`)}
              >
                <div className="aspect-[16/9] relative">
                  {featuredNews[0].cover?.url && (
                    <Img
                      src={`http://68.183.215.202${featuredNews[0].cover.url}`}
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
                    <span>{featuredNews[0].author?.data?.name}</span>
                    <span className="mx-2">|</span>
                    <span>{formatDate(featuredNews[0].publishedAt)}</span>
                  </div>
                </div>
              </article>

              {/* Secondary Featured Articles */}
              {featuredNews.slice(1).map((item) => (
                <article
                  key={item.id}
                  onClick={() => router.push(`/news/${item.slug}`)}
                  className="flex items-center space-x-4 cursor-pointer"
                >
                  <div className="w-24 h-24 relative flex-shrink-0">
                    {item.cover?.url && (
                      <Img
                        src={`http://68.183.215.202${item.cover.url}`}
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
                    <p className="text-sm text-gray-600 mt-1">{item.author?.data?.name}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Latest News */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Latest news</h2>
          <div className="space-y-6">
            {latestNews.map((item) => (
              <article
                key={item.id}
                className="cursor-pointer"
                onClick={() => router.push(`/news/${item.slug}`)}
              >
                <div className="aspect-[16/9] relative mb-3">
                  {item.cover?.url && (
                    <Img
                      src={`http://68.183.215.202${item.cover.url}`}
                      alt={item.title}
                      external={true}
                      width={800}
                      height={450}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-1">Expert Review</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="text-sm text-gray-600">
                  By {item.author?.data?.name}
                  <br />
                  {item.author?.data?.attributes?.name}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* View More Link */}
        <div className="text-center mb-8">
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            View more news articles
          </a>
        </div>

        {/* Featured Stories */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured stories</h2>
          <div className="space-y-6">
            {featuredStories.map((item) => (
              <article
                key={item.id}
                className="cursor-pointer"
                onClick={() => router.push(`/news/${item.slug}`)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Expert Review</div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <div className="text-sm text-gray-600">
                      By {item.author?.data?.name}
                      <br />
                      {item.author?.data?.attributes?.name}
                    </div>
                  </div>
                  <div className="w-24 h-24 relative flex-shrink-0">
                    {item.cover?.url && (
                      <Img
                        src={`http://68.183.215.202${item.cover.url}`}
                        alt={item.title}
                        external={true}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Latest Expert Reviews */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Latest expert reviews</h2>
          <div className="space-y-6">
            {latestNews.filter(item => item.categories?.some(cat => cat.name === "review")).map((item) => (
              <article
                key={item.id}
                className="cursor-pointer"
                onClick={() => router.push(`/news/${item.slug}`)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Expert Review</div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <div className="text-sm text-gray-600">
                      By {item.author?.data?.name}
                      <br />
                      {item.author?.data?.attributes?.name}
                    </div>
                  </div>
                  <div className="w-24 h-24 relative flex-shrink-0">
                    {item.cover?.url && (
                      <Img
                        src={`http://68.183.215.202${item.cover.url}`}
                        alt={item.title}
                        external={true}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
