"use client";

import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/Breadcrumb";
import BlogDetailsItem from "../../components/BlogDetailsItem";
import CourseBenefitsList from "../../components/CourseBenefitsList";
import Link from "next/link";
import React, { Suspense } from "react";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import RelatedPostsSection from "../blogdetails/RelatedPostsSection";
import { useTranslations } from "next-intl";

const commentList = [
  {
    test1150x150Jpg: "img_test1_150x150_jpg_40x40.png",
    admin: "admin",
    november222023: "November 22, 2023",
    reply: "Reply",
    loremIpsumDolor: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim
        <br />
        ad minim veniam.
      </>
    ),
  },
  {
    test1150x150Jpg: "img_test1_150x150_jpg_40x40.png",
    admin: "admin",
    november222023: "November 22, 2023",
    reply: "Reply",
    loremIpsumDolor: (
      <>
        Duis mattis laoreet neque, et ornare neque sollicitudin at. Proin sagittis dolor sed mi elementum pretium. Donec
        et justo ante.
        <br />
        Vivamus egestas sodales est, eu rhoncus urna semper eu.
      </>
    ),
    test1150x150jpg: "img_image_40x40.png",
  },
  {
    test1150x150Jpg: "img_test1_150x150_jpg_40x40.png",
    admin: "admin",
    november222023: "January 3, 2024",
    reply: "Reply",
    loremIpsumDolor: "سي",
    test1150x150jpg: "img_team2_150x150_jpg.png",
  },
];

export default function BlogdetailsPage() {
  // Load the BlogDetailsPage strings
  const t = useTranslations("BlogDetailsPage");
  // Load common strings (like Home)
  const tCommon = useTranslations("Common");

  return (
    <div className="relative w-full">
      {/* Main container */}
      <div className="w-full bg-white-a700 overflow-x-hidden ">
        {/* Header Section */}
        <div className="flex flex-col items-center rounded-t-[16px] bg-white-a700 py-8 sm:py-4 !mt-[30%] md:!mt-[5%]">
          <div className="mx-4 md:mx-[244px] flex flex-col items-start px-4 ">
            <Breadcrumb
              separator={
                <Text className="h-5 w-2 text-sm font-normal !text-colors">/</Text>
              }
              className="flex flex-wrap items-center gap-1 w-full"
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-sm font-normal !text-indigo-a400">
                    {tCommon("Home")}
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-sm font-normal !text-indigo-a400">
                    {t("breadcrumb.accessories")}
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading
              as="h1"
              className="text-3xl font-bold capitalize md:text-2xl sm:text-xl"
            >
              {t("heading.title")}
            </Heading>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-4 md:mx-[244px] flex flex-col items-center gap-12 md:gap-24 sm:gap-12">
          <div className="w-full px-4">
            <div className="flex flex-col items-center">
              {/* Post Meta */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                <div className="flex w-1/4 sm:w-full items-start justify-center gap-2.5">
                  <Img
                    src="img_test1_150x150_jpg_40x40.png"
                    width={40}
                    height={40}
                    alt="Test1 150x150 Jpg"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="mt-2 flex flex-1 items-center justify-center gap-2">
                    <Text as="p" className="text-sm font-normal capitalize">
                      {t("postMeta.admin")}
                    </Text>
                    <div className="mb-1.5 h-1 w-1 rounded-sm bg-gray-300" />
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-3.5 px-1.5 w-full">
                  <div className="flex w-1/3 items-center">
                    <div className="flex flex-1 flex-col items-end justify-center">
                      <Text as="p" className="text-sm font-normal capitalize">
                        {t("postMeta.category")}
                      </Text>
                      <Text as="p" className="text-sm font-normal capitalize">
                        ,{" "}
                      </Text>
                    </div>
                    <div className="flex">
                      <Text as="p" className="text-sm font-normal capitalize">
                        Exterior
                      </Text>
                    </div>
                    <div className="mb-2.5 ml-1.5 h-1 w-1 rounded-sm bg-gray-300" />
                  </div>
                  <Text as="p" className="self-end text-sm font-normal capitalize">
                    {t("postMeta.date")}
                  </Text>
                </div>
              </div>
              {/* Blog Image */}
              <Img
                src="img_blog9_jpg.png"
                width={1400}
                height={494}
                alt={t("blogImageAlt")}
                className="mt-8 w-full rounded-[16px] object-cover"
              />
              {/* Blog Content */}
              <div className="mx-4 mt-8 flex flex-col items-start w-full">
                <Text as="p" className="text-sm font-normal leading-7">
                  {t("blogContent.paragraph1")}
                </Text>
                <Text as="p" className="mt-5 text-sm font-normal leading-7">
                  {t("blogContent.paragraph2")}
                </Text>
                {/* Quote Section */}
                <div className="mt-12 flex flex-col items-start gap-6 w-full rounded-[16px] border-l-4 border-indigo-a400 bg-blue-50 py-8 px-6">
                  <Text as="p" className="ml-2 text-sm font-medium italic leading-7 md:ml-0">
                    {t("quoteSection.text")}
                  </Text>
                  <Heading as="h2" className="ml-2 text-base font-medium md:ml-0">
                    {t("quoteSection.author")}
                  </Heading>
                </div>
                {/* Course Benefits */}
                <div className="mt-12 w-full">
                  <div className="flex flex-col items-start">
                    <Heading size="text8xl" as="h3" className="text-xl font-medium md:text-lg">
                      {t("courseBenefits.whatYoullLearn")}
                    </Heading>
                    <div className="mt-6 flex gap-8 w-full md:flex-col">
                      <CourseBenefitsList />
                      <CourseBenefitsList
                        benefittext1="Build & test a complete mobile app."
                        benefittext2="Learn to design mobile apps & websites."
                        benefittext3="Design 3 different logos."
                        benefittext4="Create low-fidelity wireframe."
                        benefittext5="Downloadable exercise files."
                      />
                    </div>
                    <Img
                      src="img_detail_post_jpg.png"
                      width={924}
                      height={450}
                      alt="Detail Post Jpg"
                      className="mt-8 w-full rounded-[16px] object-cover"
                    />
                    {/* Requirements */}
                    <div className="mt-8 flex flex-col items-start gap-5 w-full">
                      <Heading size="text8xl" as="h4" className="text-xl font-medium md:text-lg">
                        {t("requirements.heading")}
                      </Heading>
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-start justify-center gap-3.5 md:flex-col">
                          <div className="mt-2.5 h-1 w-1 rounded bg-gray-700" />
                          <Text as="p" className="w-full text-sm font-normal leading-7">
                            {t("requirements.item1")}
                          </Text>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="h-1 w-1 rounded bg-gray-700" />
                          <Text as="p" className="text-sm font-normal">
                            {t("requirements.item2")}
                          </Text>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="h-1 w-1 rounded bg-gray-700" />
                          <Text as="p" className="text-sm font-normal">
                            {t("requirements.item3")}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Share Section */}
                <div className="mt-10 flex flex-col items-center w-full border-y border-gray-200 py-10">
                  <Text as="p" className="mb-2 text-sm font-medium">
                    {t("shareSection.shareText")}
                  </Text>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Img
                      src="img_facebook.svg"
                      width={40}
                      height={40}
                      alt="Facebook"
                      className="h-10 w-10"
                    />
                    <Img
                      src="img_facebook.svg"
                      width={44}
                      height={40}
                      alt="Facebook"
                      className="h-10"
                    />
                    <Img
                      src="img_facebook.svg"
                      width={44}
                      height={40}
                      alt="Facebook"
                      className="h-10"
                    />
                    <Img
                      src="img_facebook.svg"
                      width={44}
                      height={40}
                      alt="Facebook"
                      className="h-10"
                    />
                  </div>
                  <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
                    <div className="flex flex-1 rounded-[16px] bg-blue-50 px-4 py-1.5">
                      <Heading as="h5" className="text-xs font-medium capitalize">
                        {t("shareSection.categories.exterior")}
                      </Heading>
                    </div>
                    <Button
                      size="lg"
                      shape="round"
                      className="min-w-[120px] rounded-[16px] px-6 font-medium capitalize"
                    >
                      {t("shareSection.categories.fuelSystem")}
                    </Button>
                    <div className="flex w-1/4 justify-center rounded-[16px] bg-blue-50 p-2 sm:w-full">
                      <Heading as="h6" className="text-xs font-medium capitalize">
                        {t("shareSection.categories.sound")}
                      </Heading>
                    </div>
                  </div>
                </div>
                {/* Pagination / Post Navigation */}
                <div className="mt-14 flex flex-col items-start gap-10 w-full md:flex-col">
                  <div className="flex flex-col items-start">
                    <Heading size="text8xl" as="h4" className="text-xl font-medium md:text-lg">
                      {t("pagination.previousPost")}
                    </Heading>
                    <div className="mt-2 flex">
                      <Text as="p" className="text-sm font-normal">
                        {t("pagination.previousPostTitle")}
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Heading as="h4" className="text-xl font-medium capitalize md:text-lg">
                      {t("pagination.nextPost")}
                    </Heading>
                    <div className="mt-2 flex justify-end">
                      <Text as="p" className="text-sm font-normal">
                        {t("pagination.nextPostTitle")}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              <Heading
                size="text8xl"
                as="p"
                className="mt-8 self-start text-xl font-medium md:text-lg mx-4"
              >
                {t("comments.commentsHeading")}
              </Heading>
              <div className="mx-4 mt-8 w-full">
                <div className="flex flex-col gap-10">
                  <Suspense fallback={<div>Loading feed...</div>}>
                    {commentList.map((d, index) => (
                      <BlogDetailsItem {...d} key={"group12189" + index} />
                    ))}
                  </Suspense>
                </div>
              </div>
              {/* Leave a Comment */}
              <div className="mx-4 mt-12 flex flex-col items-start gap-7 w-full border-t border-gray-200 py-10">
                <Heading size="text8xl" as="p" className="mt-8 text-xl font-medium md:text-lg">
                  {t("comments.leaveAComment")}
                </Heading>
                <div className="flex flex-col items-start justify-center gap-7 w-full">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex gap-6 md:flex-col">
                      <FloatingLabelInput
                        type="text"
                        name="Your Name"
                        placeholder="Name"
                        defaultValue="Your Name"
                        floating="contained"
                        className="h-14 w-full rounded-[12px] border border-gray-200 bg-white-a700 px-4 text-sm text-black-900"
                      />
                      <FloatingLabelInput
                        type="email"
                        name="Your Email"
                        placeholder="Email"
                        defaultValue="Your Email"
                        floating="contained"
                        className="h-14 w-full rounded-[12px] border border-gray-200 bg-white-a700 px-4 text-sm text-black-900"
                      />
                    </div>
                    <FloatingLabelInput
                      name="Your Website"
                      placeholder="Website"
                      defaultValue="Your Website"
                      floating="contained"
                      className="h-14 rounded-[12px] border border-gray-200 bg-white-a700 px-4 text-sm text-black-900"
                    />
                  </div>
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-start gap-4 sm:flex-col">
                      <div className="h-3 w-3 rounded-sm border border-gray-600 bg-white-a700" />
                      <Text as="p" className="text-sm font-normal">
                        {t("comments.saveInfo")}
                      </Text>
                    </div>
                    <FloatingLabelInput
                      name="Label Comment"
                      placeholder="Comment"
                      defaultValue="Comment"
                      floating="contained"
                      className="h-48 rounded-[12px] border border-gray-200 bg-white-a700 px-4 text-xs text-gray-600"
                    />
                  </div>
                  <Button
                    size="6xl"
                    shape="round"
                    className="min-w-[186px] rounded-[16px] border border-indigo-a400 px-8 font-medium sm:px-4"
                  >
                    {t("comments.submitComment")}
                  </Button>
                </div>
              </div>
            </div>
            {/* Related posts section */}
            <RelatedPostsSection />
          </div>
          {/* Footer-ish separator */}
          <div className="bg-black-900">
            <div className="h-20 rounded-b-[16px] bg-white-a700" />
          </div>
        </div>
      </div>
      {/* Optional floating element */}
      <div className="absolute bottom-5 right-5 m-auto h-10 w-8 rounded-full" />
    </div>
  );
}
