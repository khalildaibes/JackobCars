import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PricingSection from "./PricingSection";
import React from "react";

export default function PriceingPage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />

        {/* pricing section */}
        <PricingSection />
        <Footer />
      </div>
      <div className="absolute bottom-[19.37px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
