import React from 'react';
import NewsCard from './NewsCard';
import { motion } from 'framer-motion';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
}

interface FeaturedNewsProps {
  articles: Article[];
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ articles }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6 md:px-0">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Featured Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest automotive news, reviews, and insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <NewsCard
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.imageUrl}
                category={article.category}
                date={article.date}
                author={article.author}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
