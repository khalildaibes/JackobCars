"use client";

import { Text, Img, Heading, BreadcrumbLink, Breadcrumb, BreadcrumbItem } from "../../components";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import UserProfile from "../../components/UserProfile";
import UserProfile3 from "../../components/UserProfile3";
import AboutUsSection from "./AboutUsSection";
import ClientExperienceSection from "./ClientExperienceSection";
import CustomerTestimonialsSection from "./CustomerTestimonialsSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import Link from "next/link";
import React, { Suspense } from "react";
import {
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemState,
  Accordion,
  AccordionItem,
} from "react-accessible-accordion";

const teamProfiles = [
  { userImage: "img_team1_jpg.png", userName: "Courtney Henry", userPosition: "Development Manager" },
  { userImage: "img_team2_jpg.png", userName: "Jerome Bell", userPosition: "Software Tester" },
  { userImage: "img_team3_jpg.png", userName: "Arlene McCoy", userPosition: "Software Developer" },
  { userImage: "img_team4_jpg.png", userName: "Jenny Wilson", userPosition: "UI/UX Designer" },
];
const carBrandsList = [
  { userImage: "img_b1_jpg.png", userName: "Audi" },
  { userImage: "img_b2_jpg.png", userName: "BMW" },
  { userImage: "img_b3_jpg.png", userName: "Ford" },
  { userImage: "img_b4_jpg.png", userName: "Mercedes Benz" },
  { userImage: "img_b5_jpg.png", userName: "Peugeot" },
  { userImage: "img_b6_jpg.png", userName: "Volkswagen" },
];
const accordionData = [
  { doesBoxCarOwn2: "Does BoxCar own the cars I see online or are they owned by other." },
  { doesBoxCarOwn2: "How do you choose the cars that you sell?" },
  { doesBoxCarOwn2: "Can I save my favorite cars to a list I can view later?" },
  { doesBoxCarOwn2: "Can I be notified when cars I like are added to your inventory?" },
  { doesBoxCarOwn2: "What tools do you have to help me find the right car for me and my budget?" },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-scroll bg-white-a700">
      <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
      <div>
        <div className="flex flex-col items-center justify-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[42px] md:py-5 sm:py-4">
          <div className="container-xs flex flex-col items-start gap-1 lg:px-5 md:px-5">
            <Breadcrumb
              separator={<Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">/</Text>}
              className="flex flex-wrap items-center gap-1 self-stretch"
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    Home
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-[15px] font-normal">
                    About Us
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]">
              About Us
            </Heading>
          </div>
        </div>
        <div className="flex flex-col items-center py-6 sm:py-4">
          {/* client experience section */}
          <ClientExperienceSection />

          {/* why choose us section */}
          <WhyChooseUsSection />

          {/* about us section */}
          <AboutUsSection />
          <div className="mt-[66px] flex w-[88%] flex-col items-center gap-[72px] lg:w-full lg:gap-[72px] lg:px-5 md:w-full md:gap-[54px] md:px-5 sm:gap-9">
            <div className="container-xs flex flex-col items-center px-14 md:px-5 sm:px-4">
              <div className="ml-2 flex w-[92%] justify-center lg:w-full md:ml-0 md:w-full">
                <div className="flex w-full justify-center sm:flex-col">
                  <div className="flex flex-col items-start gap-2.5">
                    <Heading
                      size="headingxl"
                      as="h1"
                      className="text-[38px] font-bold lg:text-[32px] md:text-[32px] sm:text-[30px]"
                    >
                      836M
                    </Heading>
                    <Text as="p" className="text-[15px] font-normal">
                      CARS FOR SALE
                    </Text>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2.5 px-14 md:px-5 sm:self-stretch sm:px-4">
                    <Heading
                      size="headingxl"
                      as="h1"
                      className="text-[38px] font-bold lg:text-[32px] md:text-[32px] sm:text-[30px]"
                    >
                      738M
                    </Heading>
                    <Text as="p" className="text-[15px] font-normal">
                      DEALER REVIEWS
                    </Text>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2.5 px-14 md:px-5 sm:self-stretch sm:px-4">
                    <Heading
                      size="headingxl"
                      as="h1"
                      className="text-[38px] font-bold lg:text-[32px] md:text-[32px] sm:text-[30px]"
                    >
                      95M
                    </Heading>
                    <Text as="p" className="text-[15px] font-normal">
                      VISITORS PER DAY
                    </Text>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <Heading
                      size="headingxl"
                      as="h1"
                      className="mr-3 text-[38px] font-bold lg:text-[32px] md:mr-0 md:text-[32px] sm:text-[30px]"
                    >
                      238M
                    </Heading>
                    <Text as="p" className="text-[15px] font-normal">
                      VERIFIED DEALERS
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px w-full self-stretch bg-gray-300_01" />
          </div>
          <div className="container-xs mt-28 lg:px-5 md:px-5">
            <div className="flex flex-col gap-[38px]">
              <div className="flex items-start justify-center md:flex-col">
                <Heading
                  as="h1"
                  className="self-center text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]"
                >
                  Explore Our Premium Brands
                </Heading>
                <div className="mt-3 flex flex-1 items-center justify-end gap-2.5 md:self-stretch">
                  <Link href="#">
                    <Text as="p" className="text-[15px] font-medium">
                      Show All Brands
                    </Text>
                  </Link>
                  <Img
                    src="img_arrow_left_black_900.svg"
                    width={14}
                    height={14}
                    alt="Arrow Left"
                    className="h-[14px]"
                  />
                </div>
              </div>
              <div className="flex gap-[30px] md:flex-col">
                <Suspense fallback={<div>Loading feed...</div>}>
                  {carBrandsList.map((d, index) => (
                    <UserProfile {...d} key={"group9177" + index} />
                  ))}
                </Suspense>
              </div>
            </div>
          </div>
          <div className="mt-[100px] flex justify-center self-stretch bg-white-a700 py-2">
            <div className="container-xs mb-2.5 flex items-center justify-center lg:px-5 md:px-5">
              <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                Our Team
              </Heading>
              <div className="mb-2.5 flex flex-1 items-center justify-end gap-[11px] self-end">
                <Link href="#">
                  <Text as="p" className="text-[15px] font-medium">
                    View All
                  </Text>
                </Link>
                <Img src="img_arrow_left_black_900.svg" width={14} height={14} alt="Arrow Left" className="h-[14px]" />
              </div>
            </div>
          </div>
          <div className="container-xs mt-3.5 lg:px-5 md:px-5">
            <div className="flex gap-[30px] md:flex-col">
              <Suspense fallback={<div>Loading feed...</div>}>
                {teamProfiles.map((d, index) => (
                  <UserProfile3 {...d} key={"group9225" + index} />
                ))}
              </Suspense>
            </div>
          </div>

          {/* customer testimonials section */}
          <CustomerTestimonialsSection />
          <div className="container-xs mb-5 mt-28 flex flex-col items-center px-14 lg:px-5 md:px-5">
            <div className="flex w-[68%] flex-col items-center gap-[38px] lg:w-full md:w-full">
              <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                Frequently Asked Questions
              </Heading>
              <Accordion preExpanded={[0]} className="flex-col self-stretch">
                {accordionData.map((d, i) => (
                  <AccordionItem uuid={i} key={`Group 9201${i}`}>
                    <div className="flex-1">
                      <AccordionItemHeading className="w-full">
                        <AccordionItemButton>
                          <AccordionItemState>
                            {(props) => (
                              <>
                                <div className="flex flex-wrap items-end justify-between gap-5 bg-gray-50_01 px-10 py-4 md:flex-col sm:px-4">
                                  <Heading
                                    size="text6xl"
                                    as="p"
                                    className="mt-[22px] text-[20px] font-medium lg:text-[17px]"
                                  >
                                    {d.doesBoxCarOwn2}
                                  </Heading>
                                  {props?.expanded ? (
                                    <Img
                                      src="img_vector_2x16.png"
                                      width={16}
                                      height={2}
                                      alt="Vector"
                                      className="mb-3.5 h-[2px] object-cover md:w-full"
                                    />
                                  ) : (
                                    <Img
                                      src="img_plus.svg"
                                      width={16}
                                      height={16}
                                      alt="Plus"
                                      className="mb-1.5 h-[16px] md:w-full"
                                    />
                                  )}
                                </div>
                              </>
                            )}
                          </AccordionItemState>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <div className="flex justify-center bg-gray-50_01 px-10 sm:px-4">
                          <Text as="p" className="mb-10 w-[96%] text-[15px] font-normal leading-[27px]">
                            <>
                              Cras vitae ac nunc orci. Purus amet tortor non at phasellus ultricies hendrerit. Eget a,
                              sit morbi nunc sit id massa.
                              <br />
                              Metus, scelerisque volutpat nec sit vel donec. Sagittis, id volutpat erat vel.
                            </>
                          </Text>
                        </div>
                      </AccordionItemPanel>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        <div className="bg-black-900">
          <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
