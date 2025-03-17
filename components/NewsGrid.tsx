
import React from 'react';
import NewsCard from './NewsCard';
import { Button } from "../components/ui/button";
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const NewsGrid = () => {
  const newsArticles = [
    {
      id: 1,
      title: "BMW Unveils Revolutionary Aerodynamic Design for Upcoming EV Flagship",
      excerpt: "The German automaker's latest concept promises to set new standards in electric vehicle efficiency and performance.",
      imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Design",
      date: "May 8, 2023",
      author: "James Wilson"
    },
    {
      id: 2,
      title: "Japan's Hydrogen Highway: The Future of Sustainable Transportation",
      excerpt: "With investments in hydrogen infrastructure, Japan aims to lead the world in clean mobility solutions beyond battery electric vehicles.",
      imageUrl: "https://images.unsplash.com/photo-1622185135505-2d795003994a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Infrastructure",
      date: "May 7, 2023",
      author: "Akira Tanaka"
    },
    {
      id: 3,
      title: "Formula E Technology Making Its Way to Production EVs",
      excerpt: "Innovations from electric racing are accelerating the development of more efficient and powerful consumer electric vehicles.",
      imageUrl: "https://images.unsplash.com/photo-1604053627808-18bc326f40a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Motorsport",
      date: "May 5, 2023",
      author: "Elena Rodriguez"
    },
    {
      id: 4,
      title: "Iconic American Muscle Cars Embrace Electrification",
      excerpt: "Traditional performance brands are reimagining their legendary models with high-performance electric powertrains.",
      imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Performance",
      date: "May 3, 2023",
      author: "Robert Johnson"
    },
    {
      id: 5,
      title: "Sustainable Materials Revolutionizing Car Interiors",
      excerpt: "From recycled ocean plastic to plant-based leather alternatives, automakers are embracing eco-friendly cabin materials.",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Sustainability",
      date: "May 1, 2023",
      author: "Emma Thompson"
    },
    {
      id: 6,
      title: "The Rise of Ultra-Fast Charging Networks",
      excerpt: "New charging technologies promise to reduce EV charging times to just minutes, comparable to traditional refueling.",
      imageUrl: "https://images.unsplash.com/photo-1558425555-c256012d7e43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      date: "April 29, 2023",
      author: "Thomas Brown"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-0">
        <div className="mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Latest News</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="outline" className="rounded-full bg-blue-600-600 text-white hover:bg-blue-600-700 border-none">All</Button>
            <Button variant="outline" className="rounded-full text-gray-700 hover:bg-blue-600-50 hover:text-blue-700">Electric</Button>
            <Button variant="outline" className="rounded-full text-gray-700 hover:bg-blue-600-50 hover:text-blue-700">Technology</Button>
            <Button variant="outline" className="rounded-full text-gray-700 hover:bg-blue-600-50 hover:text-blue-700">Industry</Button>
            <Button variant="outline" className="rounded-full text-gray-700 hover:bg-blue-600-50 hover:text-blue-700">Design</Button>
            <Button variant="outline" className="rounded-full text-gray-700 hover:bg-blue-600-50 hover:text-blue-700">Motorsport</Button>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {newsArticles.map((article) => (
            <motion.div key={article.id} variants={item}>
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
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-gray-300 hover:bg-blue-600-50 hover:text-blue-700">
            Load More
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
