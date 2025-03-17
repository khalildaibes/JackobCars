
import React from 'react';
import NewsCard from './NewsCard';
import { motion } from 'framer-motion';

const FeaturedNews = () => {
  const featuredArticles = [
    {
      id: 1,
      title: "The Future of Electric Vehicles: What to Expect in 2023",
      excerpt: "With rapid advancements in battery technology and increased consumer demand, electric vehicles are set to revolutionize the automotive industry.",
      imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bfb1900088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Electric",
      date: "May 15, 2023",
      author: "Michael Chen"
    },
    {
      id: 2,
      title: "New Hydrogen-Powered Concept Cars Unveiled at Geneva Motor Show",
      excerpt: "Leading manufacturers showcase innovative hydrogen fuel cell technology as a sustainable alternative to battery electric vehicles.",
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Concept",
      date: "May 12, 2023",
      author: "Sarah Johnson"
    },
    {
      id: 3,
      title: "Autonomous Driving Technology: The Road to Level 5 Automation",
      excerpt: "As self-driving technology continues to advance, we examine the challenges and milestones on the path to fully autonomous vehicles.",
      imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      date: "May 10, 2023",
      author: "David Williams"
    }
  ];

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
          {featuredArticles.map((article, index) => (
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
