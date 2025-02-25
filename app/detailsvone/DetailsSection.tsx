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
      <div className="w-full">
        <Tabs
          className="flex flex-col items-center"
          selectedTabClassName="!text-indigo-a400 font-normal text-sm bg-blue-50 rounded-lg px-3 py-1"
          selectedTabPanelClassName="mt-5 relative"
        >
          {/* Header section */}
          <div className="w-full bg-black-900">
            <div className="h-20 rounded-tl-2xl rounded-tr-2xl bg-white-a700" />
          </div>
          
          {/* Breadcrumb & Title */}
          <div className="container mx-auto px-4 sm:px-2">
            <Breadcrumb
              separator={<Text className="text-sm font-normal text-gray-600">/</Text>}
              className="flex flex-wrap items-center gap-1"
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-sm font-normal text-indigo-a400">Home</Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-sm font-normal text-indigo-a400">Listings</Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-sm font-normal">Toyota Camry New</Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <div className="mt-4 flex flex-col items-center md:flex-row md:justify-between">
              <Heading as="h1" className="text-2xl font-bold text-gray-800 md:text-3xl">
                Toyota Camry New
              </Heading>
              <div className="mt-3 flex flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  <Text as="p" className="text-sm font-normal">Share</Text>
                  <Button variant="outline" shape="circle" className="w-9 rounded-full border px-2">
                    <Img src="img_twitter.svg" width={12} height={12} alt="Twitter" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Text as="p" className="text-sm font-normal">Save</Text>
                  <Button className="w-9 rounded-full border border-gray-200 px-3">
                    <Img src="img_bookmark_black_900.svg" width={8} height={12} alt="Bookmark" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Text as="p" className="text-sm font-normal">Compare</Text>
                  <Button className="w-9 rounded-full border border-gray-200 px-3">
                    <Img src="img_user_black_900.svg" width={8} height={12} alt="User" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:w-[70%] mt-4 flex flex-col items-center md:flex-row md:justify-between">
              <Text as="p" className="text-sm font-normal text-gray-700 text-center md:text-left">
                3.5 D5 PowerPulse Momentum 5dr AWD Geartronic Estate
              </Text>
              <Heading size="headingmd" as="h2" className="mt-3 text-2xl font-bold text-gray-800 md:text-3xl">
                $40,000
              </Heading>
            </div>

            {/* Tabs for car details */}
            <div className="md:w-[70%] mt-2 flex flex-col items-center md:flex-row justify-between gap-4">
              <TabList className="flex flex-1 gap-2 sm:flex-col md:flex-row">
                <Tab className="flex items-center gap-2 p-2">
                  <Img src="img_calendar_indigo_a400.svg" width={18} height={18} alt="Calendar" className="h-4" />
                  <Text as="p" className="text-sm font-normal text-indigo-a400">2023</Text>
                </Tab>
                <Tab className="flex items-center gap-2 p-2">
                  <Img src="img_icon_indigo_a400.svg" width={18} height={18} alt="Mileage" className="h-4" />
                  <Text as="p" className="text-sm font-normal text-indigo-a400">20 miles</Text>
                </Tab>
                <Tab className="flex items-center gap-2 p-2">
                  <Img src="img_icon_indigo_a400_18x18.svg" width={18} height={18} alt="Transmission" className="h-4" />
                  <Text as="p" className="text-sm font-normal text-indigo-a400">Automatic</Text>
                </Tab>
                <Tab className="flex items-center gap-2 p-2">
                  <Img src="img_icon_4.svg" width={18} height={18} alt="Fuel" className="h-4" />
                  <Text as="p" className="text-sm font-normal text-indigo-a400">Petrol</Text>
                </Tab>
              </TabList>
              <div className="mt-2 flex items-center gap-2">
                <Img src="img_icon_5.svg" width={18} height={18} alt="Offer" className="h-4" />
                <Text as="p" className="text-sm font-medium">Make An Offer Price</Text>
              </div>
            </div>

            {/* Tab Panels */}
            {[...Array(4)].map((_, index) => (
              <TabPanel key={`tab-panel${index}`} className="mt-5">
                <div className="w-full">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Main Image Section */}
                    <div className="relative w-full md:w-2/3">
                      <Img
                        src="img_car8_qgcqjcne9d.png"
                        width={812}
                        height={550}
                        alt="Car Image"
                        className="w-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="flex flex-col items-start ">
                         
                          <Button
                            size="sm"
                            shape="round"
                            className="mt-[10px] min-w-[104px] rounded-lg px-3 font-medium capitalize bg-indigo-400 text-white shadow-md "
                          >
                            Great Price
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                          <Img
                            src="img_user_black_900_16x16.svg"
                            width={16}
                            height={16}
                            alt="User"
                            className="h-4"
                          />
                          <Text as="p" className="text-xs font-normal">Video</Text>
                        </div>
                      </div>
                    </div>

                    {/* Additional Images */}
                    <div className="w-full md:w-1/3">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 sm:flex-col">
                          <Img
                            src="img_car3_qgcqjcn7tt.png"
                            width={282}
                            height={268}
                            alt="Car 3"
                            className="h-[268px] w-1/2 object-contain sm:w-full"
                          />
                          <Img
                            src="img_car11_qgcqjcn7t.png"
                            width={282}
                            height={268}
                            alt="Car 11"
                            className="h-[268px] w-1/2 object-contain sm:w-full"
                          />
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <Img
                            src="img_car10_qgcqjcn7t.png"
                            width={282}
                            height={268}
                            alt="Car 10"
                            className="h-[268px] w-1/2 object-contain sm:w-full"
                          />
                          <Img
                            src="img_car1_qgcqjcn7tt.png"
                            width={282}
                            height={268}
                            alt="Car 1"
                            className="h-[268px] w-1/2 object-contain sm:w-full"
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
    
  );
}
