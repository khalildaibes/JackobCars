"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const blogPosts = [
  {
    id: 1,
    title: "Is the 2024 Porsche Cayenne S a Good SUV? 4 Pros and 3 Cons",
    excerpt: "The 2024 Porsche Cayenne S brings significant updates to the luxury SUV segment...",
    image: "/blog/porsche-cayenne.jpg",
    category: "Reviews",
    date: "2024-03-15",
    author: "John Doe"
  },
  {
    id: 2,
    title: "Compact Steamroller: 2024 Toyota RAV4 Starts at $29,825",
    excerpt: "Toyota's bestselling SUV returns for 2024 with minor updates and a slight price increase...",
    image: "/blog/toyota-rav4.jpg",
    category: "News",
    date: "2024-03-14",
    author: "Jane Smith"
  },
  {
    id: 3,
    title: "2024 Kia Niro EV Costs $50 More, Nearly Unchanged Otherwise",
    excerpt: "Kia's compact electric crossover carries over with minimal changes for the new model year...",
    image: "/blog/kia-niro.jpg",
    category: "Electric",
    date: "2024-03-13",
    author: "Mike Johnson"
  }
];

const BlogPage = () => {
  const t = useTranslations();

  return (
    <PageLayout pageKey="blog">
      <div className="space-y-8">
        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[400px] rounded-2xl overflow-hidden"
        >
          <Image
            src={blogPosts[0].image}
            alt={blogPosts[0].title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
            <span className="text-blue-400 font-medium mb-2">{blogPosts[0].category}</span>
            <h2 className="text-2xl font-bold text-white mb-2">{blogPosts[0].title}</h2>
            <p className="text-gray-200 mb-4">{blogPosts[0].excerpt}</p>
            <div className="flex items-center gap-4 text-white/80">
              <span>{blogPosts[0].author}</span>
              <span>•</span>
              <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-blue-600 font-medium text-sm">{post.category}</span>
                <h3 className="text-xl font-semibold mt-2 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-gray-600 mb-6">Get the latest automotive news and updates delivered to your inbox.</p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default BlogPage; 