import { Text } from "../Text";
import { Heading } from "../Heading";
import { Img } from "../Img/index";
import HomeEightArticle from "../HomeEightArticle";
import Link from "next/link";
import React, { Suspense } from "react";
import { useTranslations } from "next-intl";

const articleList = [
  {
    detailPostQgc: "img_detail_post_qgc.png",
    link: "Sound",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive details,
        <br />
        extraordinary
      </>
    ),
  },
  {
    detailPostQgc: "img_blog9_qgcqjcn9u.png",
    link: "Accessories",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive details,
        <br />
        extraordinary
      </>
    ),
    p2024bmwalpina: (
      <>
        BMW X6 M50i is designed to exceed your
        <br />
        sportiest.
      </>
    ),
  },
  {
    detailPostQgc: "img_detail_post_qgc.png",
    link: "Sound",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive details,
        <br />
        extraordinary
      </>
    ),
  },
];

export default function LatestBlogPostsSection() {
  // Use the "HomePage" namespace from your JSON translations.
  const t = useTranslations("HomePage");

  return (
    <>
      {/* Latest blog posts section */}
      <div className="mt-[108px] flex justify-center self-stretch">
        <div className="container-xs flex justify-center lg:px-5 md:px-5">
          <div className="flex w-full flex-col gap-6">
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
                  alt="Arrow Left"
                  className="h-[14px]"
                />
              </div>
            </div>
            <div className="flex gap-[30px] md:flex-col">
              <Suspense fallback={<div>{t("loading_cars")}</div>}>
                {articleList.map((d, index) => (
                  <HomeEightArticle {...d} key={"group4922" + index} />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
