"use client";

import { Heading } from "../Heading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../Breadcrumb";
import { Button } from "../Button";
import { Img } from "../Img";
import { SeekBar } from "../SeekBar";
import { Text } from "../Text";
import { SelectBox } from "../SelectBox";
import ShopPageBackgroundBorder from "../ShopPageBackgroundBorder";
import ShopPageBackgroundBorder1 from "../ShopPageBackgroundBorder1";
import Link from "next/link";
import React, { Suspense } from "react";

const productDetailsList = [
  {
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p1: "(1)",
    electricMotorFor: "Electric Motor For Car Mini",
    p118: "$118",
    link: "Add to cart",
  },
  {
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p1: "(1)",
    electricMotorFor: "Electric Motor For Car Mini",
    p118: "$118",
    link: "Add to cart",
  },
  {
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p1: "(1)",
    electricMotorFor: "Electric Motor For Car Mini",
    p118: "$118",
    link: "Add to cart",
  },
];
const productGrid = [
  {
    s1300x300Jpg: "img_s1_300x300_jpg.png",
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p2: "(2)",
    frontAndRearBrake: "Front and Rear Brake Kit",
    p120: "$120",
    link: "Add to cart",
  },
  {
    s1300x300Jpg: "img_s1_300x300_jpg.png",
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p2: "(1)",
    frontAndRearBrake: "Michelin Defender LTX M/S",
    p120: "$150",
    link: "Add to cart",
    s1300x300jpg: "img_s7_300x300_jpg.png",
  },
  {
    s1300x300Jpg: "img_s1_300x300_jpg.png",
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p2: "(2)",
    frontAndRearBrake: "Front and Rear Brake Kit",
    p120: "$120",
    link: "Add to cart",
  },
  {
    s1300x300Jpg: "img_s1_300x300_jpg.png",
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p2: "(1)",
    frontAndRearBrake: "Front and Rear Brake Kit",
    p120: "$60",
    link: "Add to cart",
    s1300x300jpg: "img_s5_300x300_jpg.png",
  },
  {
    s1300x300Jpg: "img_s1_300x300_jpg.png",
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p2: "(2)",
    frontAndRearBrake: "Front and Rear Brake Kit",
    p120: "$120",
    link: "Add to cart",
  },
  {
    s1300x300Jpg: "img_s1_300x300_jpg.png",
    sSSSS: "SSSSS",
    sSSSS1: "SSSSS",
    p2: "(2)",
    frontAndRearBrake: "Front and Rear Brake Kit",
    p120: "$120",
    link: "Add to cart",
  },
];
const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];
interface Props {
  className?: string;
}

export default function Sales2({ ...props }: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center`}>
      {/* breadcrumb and shop header section */}
      <div className="self-stretch">
        <div className="flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[38px] sm:py-4">
          <div className="container-xs mt-1 flex flex-col items-start gap-2 lg:px-5 md:px-5">
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
                  <Text as="p" className="text-[15px] font-normal !text-black-900">
                    Shop
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading
              size="heading2xl"
              className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]"
            >
              Shop
            </Heading>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1430px] self-stretch lg:px-5 md:px-5">
        <div className="mb-[70px] flex w-full items-start gap-[30px] md:flex-col">
          <div className="flex w-[24%] flex-row gap-[30px] md:w-full">
            <div className="flex flex-col items-start gap-4 rounded-[16px] border border-solid border-gray-200 px-[30px] py-6 sm:p-4">
              <Heading size="text5xl" className="text-[18px] font-medium capitalize lg:text-[15px]">
                Categories
              </Heading>
              <div className="mb-3.5 self-stretch">
                <div className="flex items-start justify-center">
                  <div className="mb-3 flex flex-1">
                    <Text as="p" className="text-[15px] font-normal !text-black-900">
                      Accessories
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (8)
                  </Text>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mb-3 flex flex-1">
                    <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                      Body Kit
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (4)
                  </Text>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mb-3 flex flex-1">
                    <Text as="p" className="text-[15px] font-normal !text-black-900">
                      Exterior
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (3)
                  </Text>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mb-3 flex flex-1">
                    <Text as="p" className="text-[15px] font-normal !text-black-900">
                      Interior
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (2)
                  </Text>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mb-3 flex flex-1">
                    <Text as="p" className="text-[15px] font-normal !text-black-900">
                      Oil & Filters
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (2)
                  </Text>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mb-3 flex flex-1">
                    <Text as="p" className="text-[15px] font-normal !text-black-900">
                      Sound
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (1)
                  </Text>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex flex-1">
                    <Text as="p" className="text-[15px] font-normal !text-black-900">
                      Wheels
                    </Text>
                  </div>
                  <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                    (2)
                  </Text>
                </div>
              </div>
            </div>
            <div className="rounded-[16px] border border-solid border-gray-200 p-[22px] sm:p-4">
              <div className="mb-[52px] flex flex-col items-start gap-4">
                <Heading size="text5xl"  className="text-[18px] font-medium capitalize lg:text-[15px]">
                  Prices
                </Heading>
                <SeekBar
                  inputValue={[5000,50000]}
                  trackColors={["#050b2033", "#050b2033"]}
                  className="flex h-[32px] self-stretch"
                  trackClassName="h-[4px] w-full"
                />
                <div className="flex flex-wrap justify-between gap-5 self-stretch">
                  <Heading  className="text-[13.1px] font-medium">
                    $20
                  </Heading>
                  <Heading className="text-[13.1px] font-medium">
                    $360
                  </Heading>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 self-center md:self-stretch">
            <div className="flex flex-col items-center">
              <div className="self-stretch">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex items-center justify-center sm:flex-col">
                    <Text as="p" className="self-end text-[15px] font-normal !text-black-900">
                      Showing 1–9 of 13 results
                    </Text>
                    <div className="flex flex-1 items-center justify-end gap-[11px] sm:self-stretch">
                      <Text as="p" className="self-end text-[15px] font-normal !text-gray-600_03">
                        Sort by:
                      </Text>
                      <SelectBox
                        shape="square"
                        name="Form   Options"
                        placeholder={`Sort by latest`}
                        options={dropDownOptions}
                        className="w-[20%] bg-[url(/images/img_form_options.png)] bg-cover bg-no-repeat px-3 text-black-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 justify-center gap-[30px] gap-y-[30px] lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    <Suspense fallback={<div>Loading feed...</div>}>
                      {productGrid.map((d, index) => (
                        <ShopPageBackgroundBorder {...d} key={"group371" + index} className="items-start" />
                      ))}
                    </Suspense>
                  </div>
                </div>
              </div>
              {/* <div className="mt-7 flex gap-7 self-stretch md:flex-col">
                <Suspense fallback={<div>Loading feed...</div>}>
                  {productDetailsList.map((d, index) => (
                    <ShopPageBackgroundBorder1 {...d} key={"group372" + index} className="items-center" />
                  ))}
                </Suspense>
              </div> */}

              <div className="mt-[50px] flex w-[16%] justify-center gap-3 lg:w-full md:w-full">
                <Button
                  size="2xl"
                  shape="round"
                  className="min-w-[40px] rounded-[18px] border border-solid border-black-900 px-[15px]"
                >
                  1
                </Button>
                <Button size="2xl" className="min-w-[40px] rounded-[18px] px-3.5">
                  2
                </Button>
                <div className="flex flex-1 justify-center rounded-[18px] border border-solid border-gray-200 bg-gray-50_01 p-3">
                  <Img src="img_arrow_right.svg" width={10} height={12} alt="Arrow Right" className="h-[12px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[60px] self-stretch bg-black-900">
        <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
      </div>
    </div>
  );
}
