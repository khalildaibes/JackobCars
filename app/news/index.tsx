import ResponsiveNewsLayout from "../../components/Responsivenews";
import BlogMainSection from "./BlogMainSection";
import React from "react";

export default function BlogvOnePage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto ">
      <div className="w-full overflow-x-scroll bg-white-a700 mt-[6%]">
      <ResponsiveNewsLayout />

        {/* blog main section */}
        <BlogMainSection />
      </div>
      <div className="absolute bottom-[19.16px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
