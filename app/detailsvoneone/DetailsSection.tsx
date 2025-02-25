"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import Link from "next/link";
import React from "react";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";

export default function DetailsSection() {
  return (
    <>
      {/* details section */}
      <div className="self-stretch">
        <Tabs
          className="flex w-full flex-col items-center"
          selectedTabClassName="!text-indigo-a400 font-normal text-[15px] bg-blue-50 rounded-[18px]"
          selectedTabPanelClassName="mt-5 !relative tab-panel--selected"
        >
          <div className="self-stretch bg-black-900">
            <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
          </div>
          <div className="container-xs lg:px-5 md:px-5">
            <Breadcrumb
              separator={<Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">/</Text>}
              className="flex flex-wrap items-center gap-1"
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    Home
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    Listings
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-[15px] font-normal">
                    Toyota Camry New
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="mt-4 flex items-center justify-center md:flex-col">
              <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                Toyota Camry New
              </Heading>
              <div className="flex flex-1 justify-center gap-2.5 md:self-stretch">
                <div className="flex flex-1 items-center justify-end gap-[13px]">
                  <Text as="p" className="mb-1.5 self-end text-[15px] font-normal">
                    Share{" "}
                  </Text>
                  <Button variant="outline" shape="circle" className="w-[36px] rounded-[18px] !border px-2.5">
                    <Img src="img_twitter.svg" width={12} height={12} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Text as="p" className="text-[15px] font-normal">
                    Save
                  </Text>
                  <Button className="w-[36px] rounded-[18px] border border-solid border-gray-200 px-3">
                    <Img src="img_bookmark_black_900.svg" width={8} height={12} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Text as="p" className="mb-1.5 self-end text-[15px] font-normal">
                    Compare
                  </Text>
                  <Button className="w-[36px] rounded-[18px] border border-solid border-gray-200 px-3">
                    <Img src="img_user_black_900.svg" width={8} height={12} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <Text as="p" className="text-[15px] font-normal">
                3.5 D5 PowerPulse Momentum 5dr AWD Geartronic Estate
              </Text>
              <Heading
                size="headingmd"
                as="h2"
                className="mt-3 self-end text-[30px] font-bold lg:text-[25px] md:text-[24px] sm:text-[22px]"
              >
                $40,000
              </Heading>
            </div>
            <div className="relative mt-[-4px] flex items-center justify-between gap-5 md:flex-col">
              <TabList className="flex flex-1 gap-2.5 md:self-stretch sm:flex-col">
                <Tab className="flex items-center gap-2.5 p-2">
                  <Img src="img_calendar_indigo_a400.svg" width={18} height={18} alt="Calendar" className="h-[18px]" />
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    2023
                  </Text>
                </Tab>
                <Tab className="flex items-center gap-2.5 p-2">
                  <Img src="img_icon_indigo_a400.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    20 miles
                  </Text>
                </Tab>
                <Tab className="flex w-[16%] items-start justify-center gap-2.5 p-1 sm:w-full">
                  <Img
                    src="img_icon_indigo_a400_18x18.svg"
                    width={18}
                    height={18}
                    alt="Icon"
                    className="mt-1 h-[18px]"
                  />
                  <div className="flex flex-1 justify-center self-center">
                    <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                      Automatic
                    </Text>
                  </div>
                </Tab>
                <Tab className="flex items-start gap-2.5 p-1">
                  <Img src="img_icon_4.svg" width={18} height={18} alt="Icon" className="mt-1 h-[18px]" />
                  <div className="flex self-center py-0.5">
                    <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                      Petrol
                    </Text>
                  </div>
                </Tab>
              </TabList>
              <div className="mb-1 flex items-center gap-[11px] self-end">
                <Img src="img_icon_5.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
                <Text as="p" className="text-[15px] font-medium">
                  Make An Offer Price
                </Text>
              </div>
            </div>
            {[...Array(4)].map((_, index) => (
              <TabPanel key={`tab-panel${index}`} className="absolute mt-5 justify-center">
                <div className="w-full">
                  <div className="flex items-center gap-2.5 md:flex-col">
                    <div className="relative h-[550px] flex-1 content-center lg:h-auto md:h-auto md:w-full md:flex-none md:self-stretch">
                      <Img
                        src="img_car8_qgcqjcne9d.png"
                        width={812}
                        height={550}
                        alt="Car8 Qgcqjcne9d"
                        className="h-[550px] w-full flex-1 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 top-0 mx-2.5 my-auto h-max flex-1 lg:mx-0 md:mx-0">
                        <div className="flex flex-col items-start gap-[440px] lg:gap-[330px] md:gap-[330px] sm:gap-[220px]">
                          <div className="mx-5 flex flex-col items-start self-stretch md:mx-0">
                            <div className="flex rounded-[14px] bg-indigo-a400 p-1">
                              <Text
                                as="p"
                                className="text-[14px] font-medium capitalize !text-white-a700"
                              >
                                Featured
                              </Text>
                            </div>
                            <Button
                              size="sm"
                              shape="round"
                              className="relative mt-[-28px] min-w-[104px] rounded-[14px] px-3.5 font-medium capitalize"
                            >
                              Great Price
                            </Button>
                          </div>
                          <div className="flex items-start gap-1 rounded-[12px] bg-white-a700 p-2">
                            <Img
                              src="img_user_black_900_16x16.svg"
                              width={16}
                              height={16}
                              alt="User"
                              className="h-[16px]"
                            />
                            <Text as="p" className="self-center text-[15px] font-normal">
                              Video
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[42%] justify-center md:w-full">
                      <div className="flex w-full flex-col gap-2.5">
                        <div className="flex gap-2.5 sm:flex-col">
                          <Img
                            src="img_car3_qgcqjcn7tt.png"
                            width={282}
                            height={268}
                            alt="Car3 Qgcqjcn7tt"
                            className="h-[268px] w-[50%] object-contain sm:w-full"
                          />
                          <Img
                            src="img_car11_qgcqjcn7t.png"
                            width={282}
                            height={268}
                            alt="Car11 Qgcqjcn7t"
                            className="h-[268px] w-[50%] object-contain sm:w-full"
                          />
                        </div>
                        <div className="flex gap-2.5 sm:flex-col">
                          <Img
                            src="img_car10_qgcqjcn7t.png"
                            width={282}
                            height={268}
                            alt="Car10 Qgcqjcn7t"
                            className="h-[268px] w-[50%] object-contain sm:w-full"
                          />
                          <Img
                            src="img_car1_qgcqjcn7tt.png"
                            width={282}
                            height={268}
                            alt="Car1 Qgcqjcn7tt"
                            className="h-[268px] w-[50%] object-contain sm:w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
}
