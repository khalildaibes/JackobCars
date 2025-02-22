import CarSalesHeader from "../CarSalesHeader";
import React, { Suspense } from "react";

const carCategories = [
  { headingText: "836M", subheadingText: "CARS FOR SALE" },
  { headingText: "738M", subheadingText: "DEALER REVIEWS" },
  { headingText: "100M", subheadingText: "VISITORS PER DAY" },
  { headingText: "238M", subheadingText: "VERIFIED DEALERS" },
];

export default function SalesAndReviewsSection() {
  return (
    <>
      {/* sales and reviews section */}
      <div className=" flex justify-center self-stretch  sm:px-4 bg-[url(/images/img_background_820x1860.png)] bg-no-repeat bg-cover rounded-[40px]">
        <div className="flex w-[94%] justify-center  items-center rounded-[16px] bg-gray-100_01 py-[104px] lg:w-full lg:py-8 md:w-full md:py-5 sm:py-4  ">
          <div className="container-xs mb-1.5 flex justify-center items-center  lg:px-5 ">
            <div className="ml-2 flex w-[92%] gap-[80px] lg:ml-0 !items-center md:ml-0  flex-col lg:flex-row lg:gap-[200px]  items-center !justify-center">
              <Suspense fallback={<div>Loading feed...</div>}>
                {carCategories.map((d, index) => (
                  <CarSalesHeader {...d} key={"group5968" + index} className="w-[20%] border h-[90px] text-white rounded-[16px]  items-center justify-center" />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
