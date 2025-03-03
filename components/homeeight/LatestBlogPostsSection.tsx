"use client";

import { Text } from "../Text";
import { Heading } from "../Heading";
import { Img } from "../Img/index";
import HomeEightArticle from "../HomeEightArticle";
import Link from "next/link";
import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

export default function LatestBlogPostsSection() {
  // Fetch translations from the "HomePage" namespace
  const t = useTranslations("HomePage");

  // Example article list with translations applied
  const articleList = [
    {
      detailPostQgc: "img_detail_post_qgc.png",
      link: t("blog_category_sound"),
      admin: t("admin"),
      november222023: t("blog_date_1"),
      p2024BMWALPINA: (
        <>
          {t("blog_title_3")}
          <br />
          {t("blog_subtitle_3")}
        </>
      ),
    },
    {
      detailPostQgc: "img_blog9_qgcqjcn9u.png",
      link: t("blog_category_accessories"),
      admin: t("admin"),
      november222023: t("blog_date_2"),
      p2024BMWALPINA: (
        <>
          {t("blog_title_2")}
          <br />
          {t("blog_subtitle_2")}
        </>
      ),
      p2024bmwalpina: (
        <>
          {t("blog_title_3")}
          <br />
          {t("blog_subtitle_3")}
        </>
      ),
    },
    {
      detailPostQgc: "img_detail_post_qgc.png",
      link: t("blog_category_sound"),
      admin: t("admin"),
      november222023: t("blog_date_3"),
      p2024BMWALPINA: (
        <>
          {t("blog_title_4")}
          <br />
          {t("blog_subtitle_4")}
        </>
      ),
    },
  ];

  return (
    <>
      {/* Latest blog posts section */}
      <div className="mt-[108px] flex justify-center self-stretch">
        <div className="container-xs flex justify-center lg:px-5 md:px-5">
          <div className="flex w-full flex-col gap-6">
            {/* Section Header */}
            <div className="flex items-center justify-center sm:flex-col">
              <Heading
                as="h1"
                className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                {t("blogs_heading")}
              </Heading>
              <div className="mb-4 flex flex-1 items-center justify-end gap-[11px] self-end sm:self-stretch">
                <Link href="#">
                  <Text as="p" className="text-[15px] font-medium">
                    {t("view_all")}
                  </Text>
                </Link>
                <Img
                  src="img_arrow_left.svg"
                  width={14}
                  height={14}
                  alt={t("arrow_left")}
                  className="h-[14px]"
                />
              </div>
            </div>

            {/* Blog List */}
            <div className="flex gap-[30px] overflow-x-auto">
              <Suspense fallback={<div>{t("loading_cars")}</div>}>
                {articleList.map((d, index) => (
                  <div key={"group4922" + index}>
                    <HomeEightArticle {...d} />
                  </div>
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
