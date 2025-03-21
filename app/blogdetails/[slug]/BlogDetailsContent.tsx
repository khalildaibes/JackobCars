"use client";

import React, { useState } from "react";
import { Heading } from "../../../components/Heading";
import { Button } from "../../../components/Button";
import { Img } from "../../../components/Img";
import { Text } from "../../../components/Text";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../../components/Breadcrumb";
import BlogDetailsItem from "../../../components/BlogDetailsItem";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Share2, Calendar, User, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

interface StrapiImage {
  data: {
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText: string;
    };
  };
}

interface Comment {
  id: number;
  attributes: {
    content: string;
    author: string;
    email: string;
    createdAt: string;
  };
}

interface BlogPost {
  id: number;
  attributes: {
    title: string;
    description: string;
    content: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: StrapiImage;
    author: {
      data: {
        attributes: {
          name: string;
          email: string;
          avatar: StrapiImage;
        };
      };
    };
    comments: {
      data: Comment[];
    };
  };
}

interface Props {
  post: BlogPost;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BlogDetailsContent({ post }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    comment: '',
    saveInfo: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const t = useTranslations("BlogDetails");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      saveInfo: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            ...formData,
            article: post.id
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      setFormData({
        name: '',
        email: '',
        website: '',
        comment: '',
        saveInfo: false
      });

      // Refresh the page to show new comment
      window.location.reload();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const coverUrl = post.attributes.cover?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${post.attributes.cover.data.attributes.url}`
    : '/placeholder.jpg';

  const authorAvatarUrl = post.attributes.author?.data?.attributes?.avatar?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${post.attributes.author.data.attributes.avatar.data.attributes.url}`
    : '/default-avatar.jpg';

  return (
    <div className="w-full bg-gray-50 pb-20">
      {/* 🟣 Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-14 rounded-b-[50px] shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto text-center px-6 relative z-10">
          <Breadcrumb className="flex justify-center text-sm space-x-2 mb-6">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" as={Link}>
                <Text className="text-white/80 hover:text-white transition-colors">Home</Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog" as={Link}>
                <Text className="text-white/80 hover:text-white transition-colors">Blog</Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text className="text-white">{post.attributes.title}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading as="h1" className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            {post.attributes.title}
          </Heading>
        </div>
      </motion.div>

      {/* 🔥 Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mt-10">
        {/* 📝 Author Info */}
        <motion.div 
          {...fadeIn}
          className="flex items-center gap-4 border-b border-gray-200 pb-6 mb-8"
        >
          <div className="relative">
            <Img 
              src={authorAvatarUrl}
              width={60} 
              height={60} 
              className="rounded-full ring-2 ring-purple-500 ring-offset-2"
              alt={post.attributes.author?.data?.attributes?.name || "Author"}
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <div>
            <Text className="font-semibold text-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("by")} {post.attributes.author?.data?.attributes?.name}
            </Text>
            <Text className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("postedOn")} {format(new Date(post.attributes.publishedAt), 'MMMM dd, yyyy')}
            </Text>
          </div>
          <Button className="ml-auto flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
            <Share2 className="w-4 h-4" />
            {t("shareButton")}
          </Button>
        </motion.div>

        {/* 🖼 Blog Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Img 
            src={coverUrl}
            width={1200}
            height={600}
            className="w-full rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            alt={post.attributes.cover?.data?.attributes?.alternativeText || post.attributes.title}
          />
        </motion.div>

        {/* 📖 Content */}
        <motion.div 
          {...fadeIn} 
          className="mt-12 prose prose-lg max-w-none"
        >
          <ReactMarkdown>{post.attributes.content}</ReactMarkdown>
        </motion.div>

        {/* 💬 Comments Section */}
        <motion.div {...fadeIn} className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <MessageCircle className="w-6 h-6 text-purple-500" />
            <Heading as="h3" className="text-2xl font-bold">
              {post.attributes.comments?.data?.length || 0} {t("commentsTitle")}
            </Heading>
          </div>
          <div className="space-y-6">
            {post.attributes.comments?.data?.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <BlogDetailsItem 
                  adminImage="/default-avatar.jpg"
                  admin={comment.attributes.author}
                  date={format(new Date(comment.attributes.createdAt), 'MMMM dd, yyyy')}
                  comment={comment.attributes.content}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ✍️ Comment Form */}
        <motion.div 
          {...fadeIn}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <Heading as="h3" className="text-xl font-semibold">{t("leaveComment")}</Heading>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      {t("name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium text-gray-700">
                    {t("website")}
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                    {t("comment")}
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="saveInfo" className="text-sm text-gray-600">
                    {t("saveInfo")}
                  </label>
                </div>
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t("loadingText") : t("submitComment")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
} 