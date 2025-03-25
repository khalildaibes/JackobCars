"use client"; // This marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FeaturedNews from '../../components/FeaturedNews';
import NewsGrid from '../../components/NewsGrid';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from 'react-alice-carousel';
import { Img } from '../../components/Img';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
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
          <Img
            width={100}
            height={100}
            external={true}
            src={`http://68.183.215.202${currentArticle.imageUrl}`}
            alt={currentArticle.title}
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
      <div className="w-full overflow-x-auto py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 rtl:space-x-reverse">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => handleStoryClick(index)}
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500">
                    <Img
                      src={`http://68.183.215.202${article.imageUrl}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      external={true}
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {article.category}
                    </div>
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
  return (
    <div className="w-full py-4 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onSelectCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            الكل
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

const Index = () => {
  const t = useTranslations('NewsPage');
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [storyArticles, setStoryArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const featuredResponse = await fetch('/api/articles?limit=3');
        const featuredData = await featuredResponse.json();
        
        const newsResponse = await fetch('/api/articles?limit=5');
        const newsData = await newsResponse.json();

        const storyResponse = await fetch('/api/articles?limit=8');
        const storyData = await storyResponse.json();

        if (!featuredData.data || !newsData.data || !storyData.data) {
          throw new Error('Invalid data format received from API');
        }
        console.log(newsData.data[0].cover);

        const transformArticle = (article: any) => ({
          id: article.id,
          title: article.title || '',
          excerpt: article.excerpt || '',
          imageUrl: article.cover ? article.cover.url : '',
          category: article.categories?.map((category: any) => category.name).join(', ') || '',
          date: new Date(article.publishedAt).toLocaleDateString() || '',
          author: article.author || '',
          description: article.description || '',
          cover: article.cover || null,
          categories: article.categories || [],
          publishedAt: article.publishedAt || '',
          locale: article.locale || 'en',
          slug: article.slug || '',
          blocks: article.blocks || []
        });
        const transformedFeatured = featuredData.data.map(transformArticle);
        const transformedNews = newsData.data.map(transformArticle);
        const transformedStories = storyData.data.map(transformArticle);

        setFeaturedArticles(transformedFeatured);
        setNewsArticles(transformedNews);
        setStoryArticles(transformedStories);

        // Extract unique categories
        const allCategories = new Set<string>();
        [...transformedFeatured, ...transformedNews, ...transformedStories].forEach(article => {
          if (article.category) {
            article.category.split(', ').forEach(cat => allCategories.add(cat));
          }
        });
        setCategories(Array.from(allCategories));
        console.log(allCategories);

      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredFeaturedArticles = selectedCategory
    ? featuredArticles.filter(article => article.category.includes(selectedCategory))
    : featuredArticles;

  const filteredNewsArticles = selectedCategory
    ? newsArticles.filter(article => article.category.includes(selectedCategory))
    : newsArticles;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen rtl bg-gray-50"
      dir="rtl"
    >
      <main>
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="py-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-right text-gray-900">أخبار السيارات</h1>
            <p className="text-gray-600 mt-2">آخر أخبار وتطورات عالم السيارات</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : (
            <>
              {/* Stories Section */}
              <div className="mb-12">
                <StoryNews articles={storyArticles.filter(article => article.category.includes('story'))} />
              </div>

              {/* Category Navigation */}
              <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Breaking News Section */}
              <div className="my-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-red-600 ml-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">عاجل</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFeaturedArticles.map((article) => (
                    article.category.includes('featured') && (
                      <Link href={`/news/${article.slug}`} key={article.id} className="group block">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                          <div className="aspect-[16/9] overflow-hidden">
                            <Img
                              src={`http://68.183.215.202${article.imageUrl}`}
                              alt={article.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              width={1290}
                              height={2040}
                              external={true}
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center mb-3">
                              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                {article.category}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{article.date}</span>
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {article.title}
              </h2>
                            <p className="text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium">{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Latest News Grid */}
              <div className="my-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-blue-600 ml-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">أحدث الأخبار</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredNewsArticles.map((article) => (
                    <Link href={`/news/${article.slug}`} key={article.id} className="group block">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md h-full">
                        <div className="aspect-[4/3] overflow-hidden">
                          <Img 
                            src={`http://68.183.215.202${article.imageUrl}`}
                            alt={article.title}
                            width={1290}
                            height={2040}
                            external={true}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <span className="text-xs text-gray-500">{article.date}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <span className="text-xs text-gray-500">{article.author}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
          </div>
      </main>
    </motion.div>
  );
};

export default Index;
