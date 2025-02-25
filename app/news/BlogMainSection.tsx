"use client";
import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import BlogVOneArticle from "../../components/BlogVOneArticle";
import Link from "next/link";
import React, { Suspense } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/Breadcrumb";

const articleGrid = [
  {
    detailPostQgc: "img_detail_post_qgc_266x414.png",
    link: "Sound",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
  },
  {
    detailPostQgc: "img_blog9_qgcqjcnb6.png",
    link: "Accessories",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
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
    detailPostQgc: "img_detail_post_qgc_266x414.png",
    link: "Sound",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
  },
  {
    detailPostQgc: "img_blog8_qgcqjcnb6.png",
    link: "Body Kit",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
    p2024bmwalpina: (
      <>
        2024 Kia Sorento Hybrid Review: Big Vehicle
        <br />
        With Small-Vehicle
      </>
    ),
  },
  {
    detailPostQgc: "img_detail_post_qgc_266x414.png",
    link: "Sound",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
  },
  {
    detailPostQgc: "img_blog4_qgcqjcnb6.png",
    link: "Exterior",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
    p2024bmwalpina: (
      <>
        2024 BMW X3 M Sport Seats – available as
        <br />a standalone option
      </>
    ),
  },
  {
    detailPostQgc: "img_blog5_qgcqjcnb6.png",
    link: "Body Kit",
    admin: "admin",
    november222023: "November 22, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
    p2024bmwalpina: (
      <>
        2023 Carnival Standard blind-spot &<br />
        forward collision avoidance
      </>
    ),
  },
  {
    detailPostQgc: "img_blog1_qgcqjcnb6.png",
    link: "Sound",
    admin: "admin",
    november222023: "September 19, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
    p2024bmwalpina: (
      <>
        Golf vs Polo: A Comparison of Two
        <br />
        Volkswagen Classics
      </>
    ),
  },
  {
    detailPostQgc: "img_blog3_qgcqjcnb6.png",
    link: "Oil & Filters",
    admin: "admin",
    november222023: "September 19, 2023",
    p2024BMWALPINA: (
      <>
        2024 BMW ALPINA XB7 with exclusive
        <br />
        details, extraordinary
      </>
    ),
    p2024bmwalpina: (
      <>
        Battle of the SUVs – Kia Sportage vs
        <br />
        Hyundai Tucson
      </>
    ),
  },
];

export default function BlogMainSection() {
  return (
    <>
      {/* Blog main section */}
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center">
          {/* Header with Breadcrumb */}
          <div className="w-full flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-10 sm:py-4">
            <div className="container-xs mt-1 flex flex-col items-start gap-2 px-4 sm:px-5">
              <Breadcrumb
                separator={
                  <Text className="h-5 w-1.5 text-sm font-normal">/</Text>
                }
                className="flex flex-wrap items-center gap-1 w-full"
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" as={Link}>
                    <Text as="p" className="text-sm font-normal text-indigo-a400">
                      Home
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#" as={Link}>
                    <Text as="p" className="text-sm font-normal">Blog</Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <Heading
                as="h1"
                className="text-3xl font-bold capitalize sm:text-2xl"
              >
                Blog
              </Heading>
            </div>
          </div>

          {/* Article Grid */}
          <div className="container-xs px-4 sm:px-5">
            <div className="flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Suspense fallback={<div>Loading feed...</div>}>
                  {articleGrid.map((d, index) => (
                    <BlogVOneArticle {...d} key={"group8977" + index} />
                  ))}
                </Suspense>
              </div>

              {/* Pagination */}
              <div className="mb-5 flex justify-center gap-2 w-full">
                <Button
                  size="2xl"
                  shape="round"
                  className="min-w-[40px] rounded-full border border-black-900 px-4 font-medium"
                >
                  1
                </Button>
                <Button
                  size="2xl"
                  className="min-w-[40px] rounded-full px-3.5 font-medium"
                >
                  2
                </Button>
                <div className="flex flex-1 justify-center rounded-full border border-gray-200 bg-gray-50 p-3">
                  <Img
                    src="img_arrow_right_black_900_1.svg"
                    width={10}
                    height={12}
                    alt="Arrow Right"
                    className="h-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-black-900">
          <div className="h-20 rounded-bl-2xl rounded-br-2xl bg-white-a700" />
        </div>
      </div>
    </>
  );
}
