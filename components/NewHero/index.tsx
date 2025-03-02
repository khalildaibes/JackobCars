import React from "react";
import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <div
      className="relative w-full h-[849.94px] bg-cover bg-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 flex flex-col sm:flex-row  justify-between  items-center md:items-start"
      style={{ backgroundImage: "url(https://s3-alpha-sig.figma.com/img/f333/523b/ec121d452f167e1f8b71256e4e01b459?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=od-2SYXOmdRZcTLJCp8f9y9~X5LhGFGY0ZxkNn5JM83ZZqwL9~qoYZggvDOhvN5cc7nT6DgyA1IKO07yjzic0run2sUi7D4s1ysO9zHhvMiKvX1yDO2xBy3RUtlgWpAQNX1yu3YSL6rebHpZ~VC82QrhjuNUQuESPAwHawLaBDg7scQ26Wx~NUA4BgvsmLh-S3S6UJ1UqZFtCPjqIiPtKQk7e9mYnI6IH9MtbGlFfqfiyusGPi~QIZIJesx4y9Q13qG9Apjpc1x3sjJhA8L3KaWfv4o-nlw6QVpMBcrBOByTQYP2mauagHP-kW4pxbWOyQhVjvYsO8WJ4QLy1WUgLA__)" }}
    >
      {/* Left Content - Text */}
      <div className="flex md:flex-col text-center sm:text-left sm:w-1/2 mt-20 ">
      <h1 className="text-white text-[30px] sm:text-[50px] md:text-[70px] font-bold leading-[40px] sm:leading-[70px] font-['DM Sans'] mt-4">
          Fast, Simple and Easy
        </h1>
        <p className="text-white text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[29.6px] font-['DM Sans'] max-w-[500px]">
          Shop Online. Pickup Today. It’s Fast, Simple and Easy. Learn More.
        </p>
       
      </div>

      {/* Center Content - Search Section */}
      <div className="absolute top-1/2 transform-translate-y-1/2 w-full max-w-[800px] flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md ">
        <div className="flex justify-center sm:justify-start gap-4 sm:gap-[30px] text-gray-800 text-[14px] sm:text-[16px] font-medium">
          <span className="border-b-2 border-gray-800">All</span>
          <span>New</span>
          <span>Used</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center border-b sm:border-r sm:border-b-0 pr-4 w-full sm:w-auto">
            <span className="text-gray-800">Any Makes</span>
          </div>
          <div className="flex items-center border-b sm:border-r sm:border-b-0 px-4 w-full sm:w-auto">
            <span className="text-gray-800">Any Models</span>
          </div>
          <span className="text-gray-800 text-center sm:text-left">Price: All Prices</span>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center">
            Search
          </button>
        </div>
      </div>

      {/* Bottom Content - Category Buttons */}
      <div className="absolute bottom-0 w-full flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
        {[
          { name: "SUV", icon: "/icons/suv.svg" },
          { name: "Sedan", icon: "/icons/sedan.svg" },
          { name: "Hatchback", icon: "/icons/hatchback.svg" },
          { name: "Coupe", icon: "/icons/coupe.svg" }
        ].map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-4 sm:px-[41px] py-[16px] rounded-t-lg inline-flex bg-blue-500 hover:bg-blue-600 transition"
          >
            <Image src={category.icon} width={26} height={35} alt={category.name} />
            <span className="ml-2 text-white text-[14px] sm:text-[15px] font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
