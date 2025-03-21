"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../components/Breadcrumb";
import BlogDetailsItem from "../../components/BlogDetailsItem";
import CourseBenefitsList from "../../components/CourseBenefitsList";
import Footer from "../../components/Footer";
import RelatedPostsSection from "./RelatedPostsSection";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Share2, Calendar, User, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import emailjs from '@emailjs/browser';
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

interface BlogDetailsData {
  breadcrumb: { text: string; link: string; isCurrentPage?: boolean }[];
  pageTitle: string;
  authorSection: {
    admin: string;
    categories: string[];
    date: string;
    adminImage: string;
  };
  mainImage: { src: string; width: number; height: number; alt: string };
  content: { paragraphs: string[] };
  quote: { text: string; author: string };
  courseBenefits: Record<string, string>[];
  detailImage: { src: string; width: number; height: number; alt: string };
  requirements: string[];
  socialShare: {
    shareText: string;
    icons: string[];
    tags: { text: string; type: string }[];
  };
  authorComment: { adminImage: string; admin: string; commentText: string };
  postNavigation: {
    previous: { icon: string; text: string };
    next: { icon: string; text: string };
  };
  comments: { adminImage: string; comment: string }[];
  commentCount: number;
  commentForm: {
    inputs: { name: string; email: string; website: string; comment: string };
    checkboxText: string;
    submitButtonText: string;
  };
  relatedPosts: any[];
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BlogDetailsPage() {
  const [data, setData] = useState<BlogDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
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
  const locale = useLocale();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [post, setPost] = useState(null);

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
      // Replace with your actual API endpoint
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        website: '',
        comment: '',
        saveInfo: false
      });

      // Optionally refresh comments
      // await fetchComments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);

    try {
      const templateParams = {
        from_name: emailFormData.name,
        from_email: emailFormData.email,
        subject: emailFormData.subject,
        message: emailFormData.message,
        post_title: data?.pageTitle,
      };

      const response = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      if (response.status === 200) {
        toast.success(t('emailSentSuccess'));
        setIsEmailDialogOpen(false);
        setEmailFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast.error(t('emailSendError'));
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    fetch("/api/blogdata")
      .then((res) => res.json())
      .then((json: Record<string, any>) => {
        setData(json[locale]);
        setLoading(false);
        setPost(json[locale]);
      })
      .catch((err) => {
        console.error("Error fetching blog data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <div className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-14 rounded-b-[50px] shadow-lg">
          <div className="container mx-auto px-6">
            <Skeleton className="h-8 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
          </div>
        </div>
        <div className="container mx-auto px-6 md:px-10 lg:px-20 mt-10">
          <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardContent className="p-6 text-center">
          <Text className="text-red-500 text-lg">{t("errorLoadingData")}</Text>
        </CardContent>
      </Card>
    </div>
  );

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
            {data.breadcrumb.map((item, index) => (
              <BreadcrumbItem key={index} isCurrentPage={item.isCurrentPage}>
                <BreadcrumbLink href={item.link} as={Link}>
                  <Text className="text-white/80 hover:text-white transition-colors">{item.text}</Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Heading as="h1" className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            {data.pageTitle}
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
              src={data.authorSection.adminImage} 
              width={60} 
              height={60} 
              className="rounded-full ring-2 ring-purple-500 ring-offset-2"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <div>
            <Text className="font-semibold text-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("by")} {data.authorSection.admin}
            </Text>
            <Text className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("postedOn")} {data.authorSection.date}
            </Text>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button 
              onClick={() => setIsEmailDialogOpen(true)}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {t("contactAuthor")}
            </Button>
            <Button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
              <Share2 className="w-4 h-4" />
              {t("shareButton")}
            </Button>
          </div>
        </motion.div>

        {/* 🖼 Blog Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Img 
            src={data.mainImage.src} 
            width={data.mainImage.width} 
            height={data.mainImage.height} 
            className="w-full rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
          />
        </motion.div>

        {/* 📖 Content */}
        <motion.div 
          {...fadeIn} 
          className="mt-12 prose prose-lg max-w-none"
        >
          {data.content.paragraphs.map((para, index) => (
            <Text key={index} as="p" className="text-gray-700 leading-relaxed">
              {para}
            </Text>
          ))}
        </motion.div>

        {/* 📜 Quote Section */}
        <motion.div 
          {...fadeIn}
          className="mt-12 bg-gradient-to-br from-purple-50 to-indigo-50 border-l-4 border-purple-500 p-8 rounded-lg shadow-md"
        >
          <Text as="p" className="italic text-xl text-gray-700">"{data.quote.text}"</Text>
          <Heading as="h4" className="mt-4 font-medium text-purple-700">{data.quote.author}</Heading>
        </motion.div>

        {/* 🔗 Post Navigation */}
        <motion.div 
          {...fadeIn}
          className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <Link href="#" className="group flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto">
            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:-translate-x-1 transition-transform" />
            <Text className="text-gray-700 group-hover:text-purple-600 transition-colors">
              {t("previousPost")}
            </Text>
          </Link>
          <Link href="#" className="group flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto">
            <Text className="text-gray-700 group-hover:text-purple-600 transition-colors">
              {t("nextPost")}
            </Text>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 💬 Comments Section */}
        <motion.div {...fadeIn} className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <MessageCircle className="w-6 h-6 text-purple-500" />
            <Heading as="h3" className="text-2xl font-bold">
              {data.commentCount} {t("commentsTitle")}
            </Heading>
          </div>
          <div className="space-y-6">
            {data.comments.map((comment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogDetailsItem adminImage={comment.adminImage} comment={comment.comment} />
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
                      {data?.commentForm.inputs.name}
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
                      {data?.commentForm.inputs.email}
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
                    {data?.commentForm.inputs.website}
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
                    {data?.commentForm.inputs.comment}
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
                    {data?.commentForm.checkboxText}
                  </label>
                </div>
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t("loadingText") : data?.commentForm.submitButtonText}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Dialog */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("contactAuthor")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  {t("name")}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={emailFormData.name}
                  onChange={handleEmailInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t("email")}
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={emailFormData.email}
                  onChange={handleEmailInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  {t("subject")}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={emailFormData.subject}
                  onChange={handleEmailInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  {t("message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={emailFormData.message}
                  onChange={handleEmailInputChange}
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={sendingEmail}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? t("sending") : t("send")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔗 Related Posts */}
      <RelatedPostsSection />

      {/* 🏁 Footer */}
      <Footer />
    </div>
  );
}
