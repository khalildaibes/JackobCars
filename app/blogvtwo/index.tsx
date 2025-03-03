"use client";

import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import ArticleDetail from "../../components/ArticleDetail";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

const articleList = [
  {
    postImage: "img_detail_post_qgc_550x950.png",
    soundButtonLabel: "sound",
    authorName: "author",
    publishDate: "publish_date",
    articleTitle: "blog_title_1",
    articleDescription: "blog_description_1",
    readMoreLink: "read_more",
  },
  {
    postImage: "img_blog9_qgcqjcnfx.png",
    soundButtonLabel: "accessories",
    authorName: "author",
    publishDate: "publish_date",
    articleTitle: "blog_title_2",
    articleDescription: "blog_description_2",
    readMoreLink: "read_more",
  },
  {
    postImage: "img_blog7_qgcqjcnfx.png",
    soundButtonLabel: "exterior",
    authorName: "author",
    publishDate: "publish_date",
    articleTitle: "blog_title_3",
    articleDescription: "blog_description_3",
    readMoreLink: "read_more",
  }
];

export default function BlogvTwoPage() {
  const t = useTranslations("BlogDetailsPage");

  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
        <div>
          <div className="flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[38px] sm:py-4">
            <div className="container-xs mt-1 flex flex-col items-start gap-2 lg:px-5 md:px-5">
              <div className="flex self-stretch">
                <div className="flex py-0.5">
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    {t("home")}
                  </Text>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-1.5 px-1">
                  <Text as="p" className="text-[14px] font-normal">
                    /
                  </Text>
                  <Text as="p" className="text-[15px] font-normal">
                    {t("blog_page")}
                  </Text>
                </div>
              </div>
              <Heading
                as="h1"
                className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                {t("blog_page")}
              </Heading>
            </div>
          </div>
          <div className="mx-[244px] flex md:mx-0">
            <div className="container-xs mb-5 flex items-start lg:px-5 md:flex-col md:px-5">
              <div className="flex flex-1 flex-col gap-[70px] self-center lg:gap-[70px] md:gap-[52px] md:self-stretch sm:gap-[35px]">
                <div className="mr-[60px] flex flex-col gap-12 md:mr-0">
                  <Suspense fallback={<div>Loading feed...</div>}>
                    {articleList.map((article, index) => (
                      <ArticleDetail
                        {...article}
                        key={"group12234" + index}
                        articleTitle={t(article.articleTitle)}
                        articleDescription={t(article.articleDescription)}
                        readMoreLink={t(article.readMoreLink)}
                        authorName={t(article.authorName)}
                        publishDate={t(article.publishDate)}
                        soundButtonLabel={t(article.soundButtonLabel)}
                      />
                    ))}
                  </Suspense>
                </div>
                <div className="flex w-[14%] justify-center gap-2 lg:w-full md:w-full">
                  <Button
                    size="2xl"
                    shape="round"
                    className="min-w-[40px] rounded-[18px] border border-solid border-black-900 px-[15px] font-medium"
                  >
                    1
                  </Button>
                  <Button size="2xl" className="min-w-[40px] rounded-[18px] px-3.5 font-medium">
                    2
                  </Button>
                  <div className="flex flex-1 justify-center rounded-[18px] border border-solid border-gray-200 bg-gray-50_01 p-3">
                    <Img
                      src="img_arrow_right_black_900_1.svg"
                      width={10}
                      height={12}
                      alt={t("arrow_right")}
                      className="h-[12px]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-[28%] flex-col items-end gap-[30px] md:w-full">
                <div className="flex w-[84%] flex-col items-start gap-4 rounded-[16px] border border-solid border-gray-200 px-[30px] py-6 lg:w-full md:w-full sm:p-4">
                  <Heading size="text5xl" as="h2" className="text-[18px] font-medium capitalize lg:text-[15px]">
                    {t("categories")}
                  </Heading>
                  <div className="flex flex-col items-start justify-center gap-[18px] self-stretch">
                    <Text as="p">{t("accessories")}</Text>
                    <Text as="p">{t("body_kit")}</Text>
                    <Text as="p">{t("exterior")}</Text>
                    <Text as="p">{t("fuel_systems")}</Text>
                    <Text as="p">{t("interior")}</Text>
                    <Text as="p">{t("oil_filters")}</Text>
                    <Text as="p">{t("sound")}</Text>
                    <Text as="p">{t("wheels")}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
