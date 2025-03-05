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
import Header from "../../components/Header";
import RelatedPostsSection from "./RelatedPostsSection";
import Link from "next/link";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import { useLocale, useTranslations } from "next-intl";

// Define TypeScript interfaces for the JSON data structure.
interface BreadcrumbItemType {
  text: string;
  link: string;
  isCurrentPage?: boolean;
}

interface CommentType {
  adminImage: string;
  comment: string;
}

interface BlogDetailsData {
  breadcrumb: BreadcrumbItemType[];
  pageTitle: string;
  authorSection: {
    admin: string;
    categories: string[];
    date: string;
    adminImage: string;
  };
  mainImage: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  content: {
    paragraphs: string[];
  };
  quote: {
    text: string;
    author: string;
  };
  courseBenefits: Record<string, string>[]; // each benefit can be an object with keys like benefittext1, benefittext2, etc.
  detailImage: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  requirements: string[];
  socialShare: {
    shareText: string;
    icons: string[];
    tags: { text: string; type: string }[];
  };
  authorComment: {
    adminImage: string;
    admin: string;
    commentText: string;
  };
  postNavigation: {
    previous: { icon: string; text: string };
    next: { icon: string; text: string };
  };
  comments: CommentType[];
  commentCount: number;
  commentForm: {
    inputs: {
      name: string;
      email: string;
      website: string;
      comment: string;
    };
    checkboxText: string;
    submitButtonText: string;
  };
  relatedPosts: any[]; // adjust as needed}
  
}

export default function BlogdetailsPage() {
  const [data, setData] = useState<BlogDetailsData | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const t = useTranslations("BlogDetailsPage");
  const locale = useLocale();
  useEffect(() => {
    fetch("/api/blogdata")
      .then((res) => res.json())
      .then((json: Map<string,any>) => {
        
        console.log("Fetched Data:",locale);
        setData(json[locale]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!data) return <div>Error loading data. Please try again later.</div>;

  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <div>
          {/* Top Section: Breadcrumb and Page Title */}
          <div className="flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[38px] sm:py-4">
            <div className="container-xs mt-1 flex flex-col items-start gap-2 lg:px-5 md:px-5">
              {/* Ensure breadcrumb is not undefined */}
              <Breadcrumb
                separator={<Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">/</Text>}
                className="flex flex-wrap items-center gap-1 self-stretch"
              >
                {data?.breadcrumb?.map((item, index) => (
                  <BreadcrumbItem key={index} isCurrentPage={item.isCurrentPage}>
                    <BreadcrumbLink href={item.link} as={Link}>
                      <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                        {item.text}
                      </Text>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
              <Heading as="h1" className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]">
                {data?.pageTitle ?? "Untitled Blog"}
              </Heading>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="mx-[244px] flex flex-col items-center gap-24 lg:gap-24 md:mx-0 md:gap-[72px] sm:gap-12">
            <div className="container-xs lg:px-5 md:px-5">
              <div className="flex flex-col items-center">
                {/* Ensure authorSection exists */}
                {data?.authorSection && (
                  <div className="flex items-center gap-1.5 self-stretch sm:flex-col">
                    <div className="flex w-[8%] items-start justify-center gap-2.5 sm:w-full">
                      <Img
                        src={data.authorSection.adminImage}
                        width={40}
                        height={40}
                        alt="Author Image"
                        className="h-[40px] self-center rounded-[20px] object-cover"
                      />
                      <div className="mt-2 flex flex-1 items-center justify-center gap-2">
                        <Text as="p" className="text-[15px] font-normal capitalize">
                          {data.authorSection.admin}
                        </Text>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-3.5 px-1.5 sm:self-stretch">
                      <div className="flex w-[12%] items-center">
                        <Text as="p" className="text-[15px] font-normal capitalize">
                          {data.authorSection.categories?.join(", ")}
                        </Text>
                      </div>
                      <Text as="p" className="self-end text-[15px] font-normal capitalize">
                        {data.authorSection.date}
                      </Text>
                    </div>
                  </div>
                )}

                {/* Ensure mainImage exists */}
                {data?.mainImage && (
                  <Img
                    src={data.mainImage.src}
                    // width={data.mainImage.width}
                    // height={data.mainImage.height}
                    width={40}
                    height={40}
                    alt={data.mainImage.alt}
                    className="mt-[30px] h-[494px] w-full rounded-[16px] object-cover lg:h-auto md:h-auto"
                  />
                )}

                {/* Ensure content exists */}
                <div className="mx-[236px] mt-[38px] flex flex-col items-start self-stretch md:mx-0">
                  {data?.content?.paragraphs?.map((para, index) => (
                    <Text key={index} as="p" className="text-[15px] font-normal leading-[27px]">
                      {para}
                    </Text>
                  ))}
                </div>

                {/* Ensure quote exists */}
                {data?.quote && (
                  <div className="mt-[50px] flex flex-col items-start gap-[18px] self-stretch rounded-[16px] border-l-[16px] border-solid border-indigo-a400 bg-blue-50 py-[38px] pl-[50px] pr-14 md:px-5 sm:p-4">
                    <Text as="p" className="ml-2 text-[15px] font-medium italic leading-[27px] md:ml-0">
                      {data.quote.text}
                    </Text>
                    <Heading as="h2" className="ml-2 text-[17px] font-medium lg:text-[14px] md:ml-0">
                      {data.quote.author}
                    </Heading>
                  </div>
                )}

                {/* Related Posts Section */}
                <RelatedPostsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
