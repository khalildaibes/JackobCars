// "use client";

// import BrandProfile from "../../components/BrandProfile";
// import BrowseByTypeSection from "./BrowseByTypeSection";
// import CustomerTestimonialsSection from "./CustomerTestimonialsSection";
// import ElectricVehiclesOverviewSection from "./ElectricVehiclesOverviewSection";
// import FeaturedListingsSection from "./FeaturedListingsSection";
// import LatestBlogPostsSection from "./LatestBlogPostsSection";
// import RecentlyAddedSection from "./RecentlyAddedSection";
// import SalesAndReviewsSection from "./SalesAndReviewsSection";
// import React, { Suspense } from "react";
// import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
// import YearSelectBox from "./yearselectbox";

// import { Heading } from "../../components/Heading";
// import { Button } from "../../components/Button";
// import { Img } from "../../components/Img/index";
// import { SeekBar } from "../../components/SeekBar";
// import { SelectBox } from "../../components/SelectBox"
// import { Text } from "../../components/Text"

// const brandList = [
//   { brandImage: "img_brand1_jpg.png", brandName: "Audi" },
//   { brandImage: "img_brand2_jpg.png", brandName: "BMW" },
//   { brandImage: "img_brand3_jpg.png", brandName: "Ford" },
//   { brandImage: "img_brand4_jpg.png", brandName: "Mercedes" },
//   { brandImage: "img_brand5_jpg.png", brandName: "Peugeot" },
//   { brandImage: "img_brand6_jpg.png", brandName: "Volkswagen" },
//   { brandImage: "img_brand7_jpg.png", brandName: "Bentley" },
//   { brandImage: "img_brand8_jpg.png", brandName: "Nissan" },
//   { brandImage: "img_brand9_jpg.png", brandName: "Jeep" },
//   { brandImage: "img_brand10_jpg.png", brandName: "Skoda" },
// ];
// const dropDownOptions = [
//   { label: "Option1", value: "option1" },
//   { label: "Option2", value: "option2" },
//   { label: "Option3", value: "option3" },
// ];

// export default function HomeEightPage() {
//   return (
//     <div className="relative w-full content-center lg:h-auto md:h-auto md:pt-[15%] lg:pt-[5%]">
//     <div className="flex w-full flex-col gap-[114px] overflow-x-scroll bg-white-a700 lg:gap-[114px] md:gap-[85px] sm:gap-[57px]">
//       <div className="mt-[25%] flex flex-col items-center lg:mt-[30px]">
//         <div className=" flex h-[60%] w-[96%] flex-row items-center  justify-center lg:items-start lg:justify-start rounded-[32px] bg-navy-blue bg-cover bg-no-repeat py-7 lg:h-auto lg:w-full lg:px-5 md:h-auto md:w-full md:px-5 sm:py-4">

              
                  
//           <div className=" mb-[52px] flex flex-col items-center ms:items-center bg-white rounded-[30px]  max-w-[85%] md:max-w-[35%] min-w-[25%] px-10 md:justify-start ms:justify-center">
         

//             <Tabs
//               className="mt-[26px] flex  flex-col gap-5 rounded-[16px] bg-white-a700 p-[30px] lg:w-full md:w-full sm:p-4"
//               selectedTabClassName="!text-white !bg-black !"
//               selectedTabPanelClassName="!relative tab-panel--selected"
//             >
//               <TabList className="flex flex-wrap justify-center gap-[-1px] rounded-[16px] border border-solid border-black-900 flex-row items-center">
//                 <Tab className="px-[74px] py-3 text-[16px] font-medium text-black-900 lg:px-8 lg:text-[13px] md:px-5 sm:px-4">
//                   New
//                 </Tab>
//                 <Tab className="px-[74px] py-3 text-[16px] font-medium text-black-900 lg:px-8 lg:text-[13px] md:px-5 sm:px-4">
//                   Used
//                 </Tab>
                
                    

                
//               </TabList>
//               {[...Array(2)].map((_, index) => (
//                 <TabPanel key={`tab-panel${index}`} className="absolute items-center">
//                   <div className="w-full">
//                     <div className="mt-2.5 flex flex-col items-center">
//                       <YearSelectBox></YearSelectBox>
//                       <SelectBox
//                         size="sm"
//                         shape="round"
//                         indicator={
//                           <Img
//                             src="img_border_6x8.png"
//                             width={8}
//                             height={6}
//                             alt="Border"
//                             className="h-[6px] w-[8px]"
//                           />
//                         }
//                         name="Q7"
//                         placeholder={`Select Brand`}
//                         options={dropDownOptions}
//                         className="mt-5 gap-4 self-stretch rounded-lg border px-4"
//                       />
//                           <SelectBox
//                         size="sm"
//                         shape="round"
//                         indicator={
//                           <Img
//                             src="img_border_6x8.png"
//                             width={8}
//                             height={6}
//                             alt="Border"
//                             className="h-[6px] w-[8px]"
//                           />
//                         }
//                         name="Q7"
//                         placeholder={`Select Models`}
//                         options={dropDownOptions}
//                         className="mt-5 gap-4 self-stretch rounded-lg border px-4"
//                       />
//                       <Heading
//                         size="text2xl"
//                         as="h2"
//                         className="mt-3.5 text-[18px] font-medium capitalize lg:text-[15px]"
//                       >
//                         Select Price
//                       </Heading>
//                       <SeekBar
//                         inputValue={[5000, 500000]}
//                         min={5000}
//                         trackColors={["#050b20", "#e9e9e9", "#050b20"]}
//                         className="mt-1.5 flex h-[70px] self-stretch"
//                         trackClassName="h-[3px] w-full "
//                         thumbClassName="flex justify-center items-center h-[28px] w-[28px] rounded-[14px] border-black-900 border-2 border-solid bg-[url(/images/defaultNoData.png)] bg-cover bg-no-repeat "
//                       />


//                       <Button
//                         color="indigo_A400"
//                         size="7xl"
//                         shape="round"
//                         leftIcon={
//                           <Img
//                             src="img_icon_white_a700.svg"
//                             width={14}
//                             height={14}
//                             alt="Icon"
//                             className="mb-1.5 h-[14px] w-[14px] object-contain bg-blue-700 rounded-[50%]"
//                           />
//                         }
//                         className="mt-5 gap-3 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4 items-center justify-center"
//                       >
//                         Advanced Filters
//                       </Button>


//                       <Button
//                         color="indigo_A400"
//                         size="7xl"
//                         shape="round"
//                         leftIcon={
//                           <Img
//                             src="img_icon_white_a700.svg"
//                             width={14}
//                             height={14}
//                             alt="Icon"
//                             className="mb-1.5 h-[14px] w-[14px] object-contain bg-blue-700 rounded-[50%]"
//                           />
//                         }
//                         className="mt-5 gap-3 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4  items-center justify-center"
//                       >
//                         Search
//                       </Button>
//                     </div>
//                   </div>
//                 </TabPanel>
//               ))}
//             </Tabs>
//           </div>
//         </div>

//         {/* browse by type section */}
//         {/* <BrowseByTypeSection />
//         <div className="mt-[30px] flex justify-center self-stretch bg-white-a700 py-2.5">
//           <div className="container-xs mt-[82px] flex items-center justify-center lg:px-5 md:flex-col md:px-5">
//             <Heading as="h4" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
//               Explore Our Premium Brands
//             </Heading>
//             <div className="mb-4 flex flex-1 items-center justify-end gap-2.5 self-end md:self-stretch">
//               <Text as="p" className="text-[15px] font-medium">
//                 Show All Brands
//               </Text>
//               <Img src="img_arrow_left.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
//             </div>
//           </div>
//         </div>
//         <div className="container-xs mt-3.5 lg:px-5 md:px-5">
//           <div className="ml-5 flex gap-[72px] md:ml-0 md:flex-col">
//             <Suspense fallback={<div>Loading feed...</div>}>
//               {brandList.map((d, index) => (
//                 <BrandProfile {...d} key={"group4886" + index} className="w-[10%]" />
//               ))}
//             </Suspense>
//           </div>
//         </div> */}

//         {/* featured listings section */}
//         <FeaturedListingsSection />

//         {/* electric vehicles overview section */}
//         {/* <ElectricVehiclesOverviewSection /> */}

//         {/* sales and reviews section */}
//         <SalesAndReviewsSection />

//         {/* recently added section */}
//         <RecentlyAddedSection />

//         {/* customer testimonials section */}
//         <CustomerTestimonialsSection />

//         {/* latest blog posts section */}
//         <LatestBlogPostsSection />
//       </div>
//     </div>
//     <div className="absolute bottom-[18.47px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
//   </div>
//   );
// }
