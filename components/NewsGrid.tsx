"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

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
  blocks: Array<{
    type: string;
    content: string;
    image?: {
      url: string;
      alt: string;
    };
  }>;
}

interface NewsGridProps {
  articles: Article[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ articles }) => {
  const t = useTranslations('NewsPage');
  const [displayArticles, setDisplayArticles] = useState<Article[]>(articles);

  // Default articles if none provided
  const defaultArticles: Article[] = [
    {
      id: 1,
      title: t('blog_title_1'),
      excerpt: t('blog_subtitle_1'),
      imageUrl: '/images/blog1.jpg',
      category: t('blog_category_sound'),
      date: t('blog_date_1'),
      author: t('admin'),
      description: t('blog_subtitle_1'),
      cover: null,
      categories: [{ name: t('blog_category_sound') }],
      publishedAt: '2023-11-22',
      locale: 'en',
      slug: 'blog-1',
      blocks: []
    },
    {
      id: 2,
      title: t('blog_title_2'),
      excerpt: t('blog_subtitle_2'),
      imageUrl: '/images/blog2.jpg',
      category: t('blog_category_accessories'),
      date: t('blog_date_2'),
      author: t('admin'),
      description: t('blog_subtitle_2'),
      cover: null,
      categories: [{ name: t('blog_category_accessories') }],
      publishedAt: '2023-11-22',
      locale: 'en',
      slug: 'blog-2',
      blocks: []
    },
    {
      id: 3,
      title: t('blog_title_3'),
      excerpt: t('blog_subtitle_3'),
      imageUrl: '/images/blog3.jpg',
      category: t('blog_category_sound'),
      date: t('blog_date_3'),
      author: t('admin'),
      description: t('blog_subtitle_3'),
      cover: null,
      categories: [{ name: t('blog_category_sound') }],
      publishedAt: '2023-11-22',
      locale: 'en',
      slug: 'blog-3',
      blocks: []
    },
    {
      id: 4,
      title: t('blog_title_4'),
      excerpt: t('blog_subtitle_4'),
      imageUrl: '/images/blog4.jpg',
      category: t('blog_category_accessories'),
      date: t('blog_date_1'),
      author: t('admin'),
      description: t('blog_subtitle_4'),
      cover: null,
      categories: [{ name: t('blog_category_accessories') }],
      publishedAt: '2023-11-22',
      locale: 'en',
      slug: 'blog-4',
      blocks: []
    },
    {
      id: 5,
      title: t('blog_title_1'),
      excerpt: t('blog_subtitle_1'),
      imageUrl: '/images/blog5.jpg',
      category: t('blog_category_sound'),
      date: t('blog_date_2'),
      author: t('admin'),
      description: t('blog_subtitle_1'),
      cover: null,
      categories: [{ name: t('blog_category_sound') }],
      publishedAt: '2023-11-22',
      locale: 'en',
      slug: 'blog-5',
      blocks: []
    }
  ];

  // Use default articles if no articles provided
  React.useEffect(() => {
    setDisplayArticles(articles.length > 0 ? articles : defaultArticles);
  }, [articles]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t('latest_news')}</h2>
          <Link 
            href="/news"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            {t('view_all')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <Link 
              href={`/news/${article.slug}`}
              key={article.id}
              className="group"
            >
              <motion.article
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    {t('read_more')}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
