"use client";

import { Text } from "../Text";
import { Heading } from "../Heading";
import { Img } from "../Img/index";
import HomeEightArticle from "../HomeEightArticle";
import Link from "next/link";
import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

interface Article {
  id: string;
  image: string;
  category: string;
  author: string;
  date: string;
  slug: string;
  title: string;
  description?: string;
}

interface LatestBlogPostsSectionProps {
  title: string;
  viewAllText: string;
  viewAllLink: string;
  articles: Article[];
  loadingText?: string;
}

export default function LatestBlogPostsSection({
  title,
  viewAllText,
  viewAllLink,
  articles,
  loadingText = "Loading articles..."
}: LatestBlogPostsSectionProps) {
  return (
    <div className="flex justify-center self-stretch">
      <div className="container-xs flex justify-center lg:px-4 md:px-4">
        <div className="flex w-full flex-col gap-4">
          {/* Section Header */}
          <div className="flex items-center justify-center sm:flex-col">
            <Heading
              as="h1"
              className="text-[32px] font-bold lg:text-[28px] md:text-[28px] sm:text-[26px]"
            >
              {title}
            </Heading>
            <div className="mb-3 flex flex-1 items-center justify-end gap-[8px] self-end sm:self-stretch">
              <Link href={viewAllLink}>
                <Text as="p" className="text-[13px] font-medium">
                  {viewAllText}
                </Text>
              </Link>
              <Img
                src="img_arrow_left.svg"
                width={12}
                height={12}
                alt="View all"
                className="h-[12px]"
              />
            </div>
          </div>

          {/* Blog List */}
          <div className="flex gap-[20px] overflow-x-auto">
            <Suspense fallback={<div>{loadingText}</div>}>
              {articles.map((article) => (
                <div key={article.id}>
                  <HomeEightArticle 
                    slug={article.slug}
                    image={article.image}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    title={article.title}
                    description={article.description}
                  />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
