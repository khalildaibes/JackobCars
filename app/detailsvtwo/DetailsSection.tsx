import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

import Link from "next/link";
import React from "react";
import { TabList, Tab } from "react-tabs";

export default function DetailsSection() {
  return (
    <>
      {/* details section */}
      <div className="self-stretch">
        <div className="flex flex-col items-center">
          <div className="self-stretch bg-black-900">
            <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
          </div>
          <div className="container-xs flex flex-col items-start lg:px-5 md:px-5">
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
                    Ranger Black – 2021
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" className="mt-4 text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Ranger Black – 2021
            </Heading>
            <Text as="p" className="mt-1.5 text-[15px] font-normal">
              2.0 D5 PowerPulse Momentum 5dr AWD Geartronic Estate
            </Text>
            <div className="mt-7 flex items-center self-stretch md:flex-col">
              <TabList className="flex flex-1 gap-2.5 md:self-stretch">
                <Tab className="flex items-center gap-2.5 p-2">
                  <Img src="img_calendar_indigo_a400.svg" width={18} height={18} alt="Calendar" className="h-[18px]" />
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    2021
                  </Text>
                </Tab>
                <Tab className="flex items-center gap-2.5 p-2">
                  <Img src="img_icon_indigo_a400.svg" width={18} height={18} alt="Icon" className="h-[18px]" />
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    250 miles
                  </Text>
                </Tab>
                <Tab className="flex w-[16%] items-start justify-center gap-2.5 p-1">
                  <Img
                    src="img_icon_indigo_a400_18x18.svg"
                    width={18}
                    height={18}
                    alt="Icon"
                    className="mt-1 h-[18px]"
                  />
                  <div className="flex flex-1 justify-center self-center py-0.5">
                    <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                      Manual
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
              <div className="flex w-[44%] gap-2.5 self-end md:w-full">
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
          </div>
        </div>
      </div>
    </>
  );
}
