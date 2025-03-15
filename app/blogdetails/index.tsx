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
} from "@/components/Breadcrumb";
import BlogDetailsItem from "../../components/BlogDetailsItem";
import CourseBenefitsList from "../../components/CourseBenefitsList";
import Footer from "../../components/Footer";
import RelatedPostsSection from "./RelatedPostsSection";
import Link from "next/link";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import { useTranslations, useLocale } from "next-intl";
import { cookies } from "next/headers";

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

export default function BlogDetailsPage() {
  const [data, setData] = useState<BlogDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  var locale = useLocale();
const cookieStore = cookies();
// Try to read the locale from a cookie named "NEXT_LOCALE"
const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

// Fallback to a default locale if no cookie is set
locale = cookieLocale ?? 'en';
  useEffect(() => {
    fetch("/api/blogdata")
      .then((res) => res.json())
      .then((json: Record<string, any>) => {
        setData(json[locale]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (!data) return <div className="text-center text-red-500 text-lg">Error loading data.</div>;

  return (
    <div className="w-full bg-gray-50 pb-20">
      {/* 🟣 Header Section */}
      <div className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-14 rounded-b-[50px] shadow-lg">
        <div className="container mx-auto text-center px-6">
          <Breadcrumb className="flex justify-center text-sm space-x-2">
            {data.breadcrumb.map((item, index) => (
              <BreadcrumbItem key={index} isCurrentPage={item.isCurrentPage}>
                <BreadcrumbLink href={item.link} as={Link}>
                  <Text className="text-white">{item.text}</Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Heading as="h1" className="text-5xl font-extrabold mt-4">{data.pageTitle}</Heading>
        </div>
      </div>

      {/* 🔥 Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 mt-10">
        {/* 📝 Author Info */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <Img src={data.authorSection.adminImage} width={50} height={50} className="rounded-full shadow-md" />
          <div>
            <Text className="font-semibold text-lg">{data.authorSection.admin}</Text>
            <Text className="text-gray-500">{data.authorSection.date}</Text>
          </div>
        </div>

        {/* 🖼 Blog Image */}
        <Img src={data.mainImage.src} width={data.mainImage.width}  height={data.mainImage.height} className="w-full rounded-lg shadow-lg" />

        {/* 📖 Content */}
        <div className="mt-8 text-gray-800 space-y-6 text-lg leading-relaxed">
          {data.content.paragraphs.map((para, index) => (
            <Text key={index} as="p">{para}</Text>
          ))}
        </div>

        {/* 📜 Quote Section */}
        <div className="mt-10 bg-gray-100 border-l-4 border-indigo-500 p-6 rounded-lg shadow-md">
          <Text as="p" className="italic text-xl">"{data.quote.text}"</Text>
          <Heading as="h4" className="mt-2 font-medium">{data.quote.author}</Heading>
        </div>

        {/* 🔗 Post Navigation */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <Img src={data.postNavigation.previous.icon} width={20} height={20} />
            <Text className="text-indigo-600 hover:underline">{data.postNavigation.previous.text}</Text>
          </div>
          <div className="flex items-center gap-3">
            <Text className="text-indigo-600 hover:underline">{data.postNavigation.next.text}</Text>
            <Img src={data.postNavigation.next.icon} width={20} height={20} />
          </div>
        </div>

        {/* 💬 Comments Section */}
        <Heading as="h3" className="text-2xl font-bold mt-12">{data.commentCount} Comments</Heading>
        <div className="mt-6 space-y-6">
          {data.comments.map((comment, index) => (
            <BlogDetailsItem key={index} {...comment} />
          ))}
        </div>

        {/* ✍️ Comment Form */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <Heading as="h3" className="text-xl font-semibold">Leave a Comment</Heading>
          <div className="mt-6 grid gap-4">
            <FloatingLabelInput name="name" placeholder={data.commentForm.inputs.name} className="w-full" />
            <FloatingLabelInput name="email" placeholder={data.commentForm.inputs.email} className="w-full" />
            <FloatingLabelInput name="website" placeholder={data.commentForm.inputs.website} className="w-full" />
            <FloatingLabelInput name="comment" placeholder={data.commentForm.inputs.comment} className="w-full h-32" />
          </div>
          <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 rounded-lg">
            {data.commentForm.submitButtonText}
          </Button>
        </div>
      </div>

      {/* 🔗 Related Posts */}
      <RelatedPostsSection />

      {/* 🏁 Footer */}
      <Footer />
    </div>
  );
}
