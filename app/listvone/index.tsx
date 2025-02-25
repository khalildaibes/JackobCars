import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CarListingSection from "./CarListingSection";
import FilterSection from "./FilterSection";
import ListingSection from "./ListingSection";
import React from "react";

export default function ListvOnePage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
        <div>
          <div>
            {/* filter section */}
            <FilterSection />

            {/* listing section */}
            <ListingSection />

            {/* car listing section */}
            <CarListingSection />
          </div>
          <div className="relative z-[5] bg-black-900">
            <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
          </div>
        </div>
        <Footer />
      </div>
      <div className="absolute bottom-[18.47px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
