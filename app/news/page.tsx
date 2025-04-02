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

const NewsPage = () => {
  const t = useTranslations('NewsPage');
  const [activeTab, setActiveTab] = useState('LATEST');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CAR NEWS</h1>
        <nav className="flex space-x-6">
          <Link href="/news" className="text-gray-900 hover:text-gray-600">{t('news')}</Link>
          <Link href="/reviews" className="text-gray-900 hover:text-gray-600">{t('reviews')}</Link>
          <Link href="/buying" className="text-gray-900 hover:text-gray-600">{t('buying')}</Link>
          <button className="text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 mb-8 border-b">
        {['LATEST', 'POPULAR', 'FEATURED'].map((tab) => (
          <button
            key={tab}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-black text-black' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured Article */}
      <div className="mb-12">
        <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
          <Img
            src="/path-to-featured-image.jpg"
            alt="New Electric SUV"
            className="w-full h-full object-cover"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-3xl font-bold text-white mb-3">
              New Electric SUV Debuts with 300-Mile Range
            </h2>
            <p className="text-white/90 mb-4">
              The new electric SUV offers a 300-mile range, fast charging capabilities, and a suite of advanced technology features.
            </p>
            <button className="text-white font-medium hover:underline">
              READ MORE →
            </button>
          </div>
        </div>
      </div>

      {/* Latest News Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">LATEST NEWS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video relative">
              <Img
                src="/path-to-image1.jpg"
                alt="2024 Sports Sedan"
                className="w-full h-full object-cover"
                width={400}
                height={300}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">2024 Sports Sedan Boasts Over 500 Horsepower</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video relative">
              <Img
                src="/path-to-image2.jpg"
                alt="New Luxury Flagship"
                className="w-full h-full object-cover"
                width={400}
                height={300}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Review: A Closer Look at the New Luxury Flagship</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video relative">
              <Img
                src="/path-to-image3.jpg"
                alt="Compact SUV"
                className="w-full h-full object-cover"
                width={400}
                height={300}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Spy Shots: Facelifted Compact SUV Spotted Testing</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">LATEST ARTICLES</h2>
        <div className="space-y-6">
          <article className="flex gap-6">
            <div className="w-1/4">
              <Img
                src="/path-to-article-image.jpg"
                alt="Luxury Carmaker"
                className="w-full aspect-[4/3] object-cover rounded-lg"
                width={300}
                height={225}
              />
            </div>
            <div className="w-3/4">
              <h3 className="text-xl font-bold mb-2">Luxury Carmaker Unveils Their Latest Flagship Model</h3>
              <p className="text-gray-600">Description of the latest flagship model...</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
