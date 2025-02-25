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
  relatedPosts: any[]; // adjust as needed
}

export default function BlogdetailsPage() {
  const [data, setData] = useState<BlogDetailsData | null>(null);

  useEffect(() => {
    // Change the path as needed (e.g., "/api/blogdata" if using an API route)
    fetch("/api/blogdata")
      .then((res) => res.json())
      .then((json: BlogDetailsData) => setData(json))
      .catch((err) => console.error("Error fetching blog data:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <div>
          {/* Top Section: Breadcrumb and Page Title */}
          <div className="flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[38px] sm:py-4">
            <div className="container-xs mt-1 flex flex-col items-start gap-2 lg:px-5 md:px-5">
              <Breadcrumb
                separator={
                  <Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">
                    /
                  </Text>
                }
                className="flex flex-wrap items-center gap-1 self-stretch"
              >
                {data.breadcrumb.map((item, index) => (
                  <BreadcrumbItem key={index} isCurrentPage={item.isCurrentPage}>
                    <BreadcrumbLink href={item.link} as={Link}>
                      <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                        {item.text}
                      </Text>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
              <Heading
                as="h1"
                className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                {data.pageTitle}
              </Heading>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="mx-[244px] flex flex-col items-center gap-24 lg:gap-24 md:mx-0 md:gap-[72px] sm:gap-12">
            <div className="container-xs lg:px-5 md:px-5">
              <div className="flex flex-col items-center">
                {/* Author and Categories */}
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
                      <div className="mb-1.5 h-[4px] w-[4px] self-end rounded-sm bg-gray-300_01" />
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3.5 px-1.5 sm:self-stretch">
                    <div className="flex w-[12%] items-center">
                      <div className="flex flex-1 flex-col items-end justify-center">
                        <Text as="p" className="text-[15px] font-normal capitalize">
                          {data.authorSection.categories.join(", ")}
                        </Text>
                      </div>
                    </div>
                    <Text as="p" className="self-end text-[15px] font-normal capitalize">
                      {data.authorSection.date}
                    </Text>
                  </div>
                </div>

                {/* Main Blog Image */}
                <Img
                  src={data.mainImage.src}
                  width={data.mainImage.width}
                  height={data.mainImage.height}
                  alt={data.mainImage.alt}
                  className="mt-[30px] h-[494px] w-full rounded-[16px] object-cover lg:h-auto md:h-auto"
                />

                {/* Blog Content */}
                <div className="mx-[236px] mt-[38px] flex flex-col items-start self-stretch md:mx-0">
                  {data.content.paragraphs.map((para, index) => (
                    <Text
                      key={index}
                      as="p"
                      className="text-[15px] font-normal leading-[27px]"
                    >
                      {para}
                    </Text>
                  ))}

                  {/* Quote Section */}
                  <div className="mt-[50px] flex flex-col items-start gap-[18px] self-stretch rounded-[16px] border-l-[16px] border-solid border-indigo-a400 bg-blue-50 py-[38px] pl-[50px] pr-14 md:px-5 sm:p-4">
                    <Text
                      as="p"
                      className="ml-2 text-[15px] font-medium italic leading-[27px] md:ml-0"
                    >
                      {data.quote.text}
                    </Text>
                    <Heading
                      as="h2"
                      className="ml-2 text-[17px] font-medium lg:text-[14px] md:ml-0"
                    >
                      {data.quote.author}
                    </Heading>
                  </div>

                  {/* Course Benefits */}
                  <div className="mt-12 self-stretch">
                    <div className="flex flex-col items-start">
                      <Heading
                        size="text8xl"
                        as="h3"
                        className="text-[26px] font-medium lg:text-[22px]"
                      >
                        What you’ll learn
                      </Heading>
                      <div className="mt-[22px] flex gap-[30px] self-stretch md:flex-col">
                        {data.courseBenefits.map((benefit, index) => (
                          <CourseBenefitsList key={index} {...benefit} />
                        ))}
                      </div>

                      {/* Detail Image */}
                      <Img
                        src={data.detailImage.src}
                        width={data.detailImage.width}
                        height={data.detailImage.height}
                        alt={data.detailImage.alt}
                        className="mt-11 h-[450px] w-full object-cover lg:h-auto md:h-auto"
                      />

                      {/* Requirements */}
                      <div className="mt-11 flex flex-col items-start gap-5 self-stretch">
                        <Heading
                          size="text8xl"
                          as="h4"
                          className="text-[26px] font-medium lg:text-[22px]"
                        >
                          Requirements
                        </Heading>
                        <div className="flex flex-col gap-4 self-stretch">
                          {data.requirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-center gap-3.5 md:flex-col"
                            >
                              <div className="mt-2.5 h-[6px] w-[6px] rounded-[3px] bg-gray-700_01 md:mt-0" />
                              <Text
                                as="p"
                                className="w-[94%] self-center text-[15px] font-normal leading-[27px]"
                              >
                                {req}
                              </Text>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Share Section */}
                  <div className="mt-10 flex items-center self-stretch border-b border-t border-solid border-gray-200 py-14 md:py-5 sm:flex-col sm:py-4">
                    <Text
                      as="p"
                      className="mb-2 self-end text-[15px] font-medium"
                    >
                      {data.socialShare.shareText}
                    </Text>
                    {data.socialShare.icons.map((icon, index) => (
                      <Img
                        key={index}
                        src={icon}
                        width={40}
                        height={40}
                        alt="Social Icon"
                        className="h-[40px] sm:w-full"
                      />
                    ))}
                    <div className="flex flex-1 rounded-[16px] bg-blue-50 px-5 py-1.5 sm:self-stretch">
                      <Heading
                        as="h5"
                        className="text-[13px] font-medium capitalize"
                      >
                        {data.socialShare.tags[0].text}
                      </Heading>
                    </div>
                    <Button
                      size="lg"
                      shape="round"
                      className="min-w-[120px] rounded-[16px] pl-5 pr-6 font-medium capitalize sm:pr-4"
                    >
                      {data.socialShare.tags[1].text}
                    </Button>
                    <div className="flex w-[8%] justify-center rounded-[16px] bg-blue-50 p-1.5 sm:w-full">
                      <Heading
                        as="h6"
                        className="text-[13px] font-medium capitalize"
                      >
                        {data.socialShare.tags[2].text}
                      </Heading>
                    </div>
                  </div>

                  {/* Author Comment Section */}
                  <div className="mr-4 mt-14 flex items-start gap-[30px] self-stretch md:mr-0 md:flex-col">
                    <Img
                      src={data.authorComment.adminImage}
                      width={70}
                      height={70}
                      alt="Author Comment Image"
                      className="h-[70px] w-[8%] rounded-[34px] object-contain md:w-full"
                    />
                    <div className="flex flex-1 flex-col items-start gap-2.5 self-center md:self-stretch">
                      <Heading
                        size="headingxs"
                        as="h6"
                        className="text-[18px] font-bold capitalize lg:text-[15px]"
                      >
                        {data.authorComment.admin}
                      </Heading>
                      <Text as="p" className="text-[15px] font-normal leading-[27px]">
                        {data.authorComment.commentText}
                      </Text>
                    </div>
                  </div>

                  {/* Post Navigation Section */}
                  <div className="mt-[58px] flex items-center gap-[30px] self-stretch border-b border-t border-solid border-gray-200 py-10 md:flex-col sm:py-4">
                    <div className="flex w-full flex-col gap-1.5">
                      <div className="flex items-center gap-[7px]">
                        <Img
                          src={data.postNavigation.previous.icon}
                          width={12}
                          height={12}
                          alt="Previous Post Icon"
                          className="h-[12px]"
                        />
                        <Heading
                          as="p"
                          className="text-[17px] font-medium capitalize lg:text-[14px]"
                        >
                          Previous Post
                        </Heading>
                      </div>
                      <div className="flex">
                        <Text
                          as="p"
                          className="text-[14px] font-normal"
                        >
                          {data.postNavigation.previous.text}
                        </Text>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-1.5">
                      <div className="flex items-center justify-end">
                        <Heading
                          as="p"
                          className="text-[17px] font-medium capitalize lg:text-[14px]"
                        >
                          Next Post
                        </Heading>
                        <Img
                          src={data.postNavigation.next.icon}
                          width={10}
                          height={12}
                          alt="Next Post Icon"
                          className="h-[12px]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Text
                          as="p"
                          className="self-end text-[14px] font-normal"
                        >
                          {data.postNavigation.next.text}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <Heading
                    size="text8xl"
                    as="p"
                    className="ml-[236px] mt-[38px] self-start text-[26px] font-medium lg:text-[22px] md:ml-0"
                  >
                    {data.commentCount} Comments
                  </Heading>
                  <div className="mx-[236px] mt-[38px] self-stretch md:mx-0">
                    <div className="flex flex-col gap-10">
                      <Suspense fallback={<div>Loading feed...</div>}>
                        {data.comments.map((comment, index) => (
                          <BlogDetailsItem
                            key={"group12189" + index}
                            {...comment}
                          />
                        ))}
                      </Suspense>
                    </div>
                  </div>

                  {/* Comment Form Section */}
                  <div className="mx-[236px] mt-12 flex flex-col items-start gap-7 self-stretch border-t border-solid border-gray-200 md:mx-0">
                    <Heading
                      size="text8xl"
                      as="p"
                      className="mt-[38px] text-[26px] font-medium lg:text-[22px]"
                    >
                      Leave a Comment
                    </Heading>
                    <div className="flex flex-col items-start justify-center gap-7 self-stretch">
                      <div className="flex flex-col gap-[22px] self-stretch">
                        <div className="flex gap-[22px] md:flex-col">
                          <FloatingLabelInput
                            type="text"
                            name="Your Name"
                            placeholder={data.commentForm.inputs.name}
                            defaultValue={data.commentForm.inputs.name}
                            floating="contained"
                            className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                          />
                          <FloatingLabelInput
                            type="email"
                            name="Your Email"
                            placeholder={data.commentForm.inputs.email}
                            defaultValue={data.commentForm.inputs.email}
                            floating="contained"
                            className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                          />
                        </div>
                        <FloatingLabelInput
                          name="Your Website"
                          placeholder={data.commentForm.inputs.website}
                          defaultValue={data.commentForm.inputs.website}
                          floating="contained"
                          className="h-[56px] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                        />
                      </div>
                      <div className="flex flex-col gap-6 self-stretch">
                        <div className="flex items-start gap-3 sm:flex-col">
                          <div className="h-[12px] w-[12px] rounded-sm border border-solid border-gray-600_01 bg-white-a700" />
                          <Text
                            as="p"
                            className="self-center text-[15px] font-normal"
                          >
                            {data.commentForm.checkboxText}
                          </Text>
                        </div>
                        <FloatingLabelInput
                          name="Label Comment"
                          placeholder={data.commentForm.inputs.comment}
                          defaultValue={data.commentForm.inputs.comment}
                          floating="contained"
                          className="h-[198px] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[13px] text-gray-600_03"
                        />
                      </div>
                      <Button
                        size="6xl"
                        shape="round"
                        className="min-w-[186px] rounded-[16px] border border-solid border-indigo-a400 px-[29px] font-medium sm:px-4"
                      >
                        {data.commentForm.submitButtonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Posts Section */}
              <RelatedPostsSection />
            </div>
            <div className="bg-black-900">
              <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
            </div>
          </div>
          <div className="absolute bottom-5 right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
        </div>
      </div>
    </div>
  );
}
