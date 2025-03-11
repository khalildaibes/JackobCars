"use client";

import CarSalesHeader from "../CarSalesHeader";
import React, { Suspense } from "react";
import { useTranslations } from "next-intl"; // Import translation hook

export default function SalesAndReviewsSection() {
  const t = useTranslations("SalesAndReviews"); // Fetch translations

  const carCategories = [
    { headingText: "836M", subheadingText: t("cars_for_sale") },
    { headingText: "738M", subheadingText: t("dealer_reviews") },
    { headingText: "100M", subheadingText: t("visitors_per_day") },
    { headingText: "238M", subheadingText: t("verified_dealers") },
  ];

  return (
    <>
      {/* Sales and Reviews Section */}
      <div className="flex justify-center self-stretch sm:px-4 bg-grotto-blue bg-no-repeat bg-cover ">
        <div className="flex w-[94%] justify-center items-center rounded-[16px]  pt-[104px] lg:w-full lg:pt-8 md:w-full md:pt-5 sm:pt-4">
          <div className="container-xs mb-1.5 flex justify-center items-center lg:px-5">
            <div className="ml-2 flex w-[92%] gap-[80px] lg:ml-0 items-center md:ml-0 flex-col lg:flex-row lg:gap-[200px] justify-center">
              <Suspense fallback={<div>{t("loading")}</div>}>
                {carCategories.map((d, index) => (
                  <CarSalesHeader {...d} key={"group5968" + index} className="w-[20%] border h-[90px] text-white rounded-[16px] items-center justify-center" />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
