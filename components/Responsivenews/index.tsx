"use client";
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { Img } from "../../components/Img";
import "react-circular-progressbar/dist/styles.css";
import { Slider } from "../Slider2";

const newsItems = [
  {
    id: 1,
    highlightTitle: "Tesla Unveils New Electric Roadster with Record-Setting Speed",
    author: "By John Doe",
    time: "Just now",
    progressValue: 60,
    previewTitle: "Revolutionary design sparks excitement in the auto industry",
    previewDescription:
      "Tesla's latest Roadster promises incredible performance with cutting-edge design and sustainable electric power, set to redefine electric vehicles.",
    previewThumbnail: "img_h74_jpg.png",
    rightText:
      "Industry experts believe this new Roadster will set the benchmark for future electric cars, blending speed and efficiency.",
    rightImage: "img_h74_jpg.png",
    rightHeading: "Tesla's Roadster Raises the Bar for Electric Cars",
  },
  {
    id: 2,
    highlightTitle: "Ford Announces Revamped Mustang with Advanced Tech Features",
    author: "By Jane Smith",
    time: "2 hours ago",
    progressValue: 80,
    previewTitle: "A new era for American muscle cars",
    previewDescription:
      "Ford's updated Mustang incorporates state-of-the-art technology and design enhancements that promise an exhilarating driving experience while honoring its classic roots.",
    previewThumbnail: "img_car5_660x440_jpg_1.png",
    rightText:
      "The new Mustang is set to compete fiercely in the sports car market with its improved performance and sleek aesthetics.",
    rightImage: "img_car5_660x440_jpg_1.png",
    rightHeading: "Ford Mustang Reinvents Classic Muscle Car Experience",
  },
  {
    id: 3,
    highlightTitle: "BMW Rolls Out Next-Gen iX: The Future of Luxury EVs",
    author: "By Alex Turner",
    time: "1 hour ago",
    progressValue: 65,
    previewTitle: "Luxury meets sustainability in BMW's latest release",
    previewDescription:
      "BMW introduces the new iX electric SUV, combining modern luxury with cutting-edge electric technology for a premium driving experience.",
    previewThumbnail: "img_h92_jpg.png",
    rightText:
      "With advanced features and an eco-friendly design, the BMW iX is poised to become a strong contender in the luxury EV market.",
    rightImage: "img_h92_jpg.png",
    rightHeading: "BMW iX Sets New Standards in Electric Luxury",
  },
];

const ResponsiveNewsLayout = () => {
  const router = useRouter();

  const handleFilterChange = useCallback((title: number) => {
    router.push(`/blogdetails?title=${title.toString()}`);
  }, [router]);

  return (
    <div className="container mx-auto px-4 mt-8 mt-[20%] md:mt-[0%]">
      {/* Slider showing one news item at a time */}
      <Slider
        responsive={{ 0: { items: 1 } }}
        autoPlay={true}
        autoPlayInterval={3000}
        items={newsItems.map((news) => (
          <div
            key={news.id}
            className="bg-white mb-8"
            onClick={() => handleFilterChange(news.id)}
          >

          <div className="mb-6 flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Highlight Section */}
            <div className="flex flex-col gap-2 bg-gradient-to-r from-gray-900 to-bluebg-cover bg-no-repeat p-6 sm:p-4 rounded-[16px]">
             
            </div>
          </div>
          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-6 bg-gray-900 px-6 sm:px-4 py-4 rounded-[16px]">
              <Text
                size="textlg"
                as="p"
                className="w-full sm:w-1/3 font-georgia text-base font-normal leading-snug text-blue-100 lg:text-sm"
              >
                {news.rightText}
              </Text>
              <div className="flex flex-col w-full sm:w-2/3">
                <Img
                  src={news.rightImage}
                  width={326}
                  height={240}
                  alt="News Image"
                  className="object-cover w-full h-60 rounded-[16px]"
                />
                <Heading
                  as="h3"
                  className="mt-4 text-xl font-bold leading-relaxed text-gray-100 lg:text-lg"
                >
                  {news.rightHeading}
                </Heading>
              </div>
            </div>
          </div>
          </div>

          </div>
        ))}
      />
    </div>
  );
};

export default ResponsiveNewsLayout;



// <div className="mb-6 flex flex-col md:flex-row gap-6">
// {/* Left Column */}
// <div className="flex-1 flex flex-col gap-6">
//   {/* Highlight Section */}
//   <div className="flex flex-col gap-2 bg-gradient-to-r from-gray-900 to-bluebg-cover bg-no-repeat p-6 sm:p-4 rounded-[16px]">
//     <Heading
//       size="headinglg"
//       as="h1"
//       className="mt-auto text-xl font-bold leading-relaxed text-gray-100 lg:text-lg"
//     >
//       {news.highlightTitle}
//     </Heading>
//     <div>
//       <Text
//         size="texts"
//         as="p"
//         className="mb-2 w-full font-georgia text-xs font-normal leading-tight text-white"
//       >
//         {news.previewDescription}
//       </Text>
//       <div className="flex-shrink-0">
//       <Img
//         src={news.previewThumbnail}
//         width={20}
//         height={40}
//         alt="Article Thumbnail"
//         className="object-fit w-full rounded-[16px]"
//       />
//     </div>
      
//       </div>
//     <div className="flex flex-wrap gap-4 text-white" >
//       <Text
//         size="texts"
//         as="p"
//         className="font-helvetica text-xs font-normal"
//       >
//         {news.author}
//       </Text>
//       <Text
//         size="texts"
//         as="p"
//         className="font-helvetica text-xs font-normal text-white"
//       >
//         {news.time}
//       </Text>
//     </div>
    
//   </div>
//   {/* Article Preview */}
//   <div className="flex flex-col md:flex-row gap-6 rounded-[16px]">
//     <div className="flex-1 flex flex-col items-start gap-2">
//       <Heading
//         size="headingxs"
//         as="h2"
//         className="text-sm font-bold"
//       >
//         {news.previewTitle}
//       </Heading>
//       <Text
//         size="texts"
//         as="p"
//         className="mb-2 w-full font-georgia text-xs font-normal leading-tight text-teal-900"
//       >
//         {news.previewDescription}
//       </Text>
//     </div>
//     <div className="flex-shrink-0">
//       <Img
//         src={news.previewThumbnail}
//         width={106}
//         height={60}
//         alt="Article Thumbnail"
//         className="object-contain w-full rounded-[16px]"
//       />
//     </div>
//   </div>
// </div>
// {/* Right Column */}
// <div className="flex-1 flex flex-col gap-6">
//   <div className="flex flex-col sm:flex-row items-start gap-6 bg-gray-900 px-6 sm:px-4 py-4 rounded-[16px]">
//     <Text
//       size="textlg"
//       as="p"
//       className="w-full sm:w-1/3 font-georgia text-base font-normal leading-snug text-blue-100 lg:text-sm"
//     >
//       {news.rightText}
//     </Text>
//     <div className="flex flex-col w-full sm:w-2/3">
//       <Img
//         src={news.rightImage}
//         width={326}
//         height={240}
//         alt="News Image"
//         className="object-cover w-full h-60 rounded-[16px]"
//       />
//       <Heading
//         as="h3"
//         className="mt-4 text-xl font-bold leading-relaxed text-gray-100 lg:text-lg"
//       >
//         {news.rightHeading}
//       </Heading>
//     </div>
//   </div>
// </div>
// </div>