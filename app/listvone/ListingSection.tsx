
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/Breadcrumb";
import { SelectBox } from "@/components/SelectBox";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import Link from "next/link";
import React from "react";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function ListingSection() {
  return (
    <>
      {/* listing section */}
      <div>
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
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" as={Link}>
                  <Text as="p" className="text-[15px] font-normal">
                    Listing v1
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" className="mt-3 text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Listing v1
            </Heading>
            <div className="mt-[34px] flex items-start self-stretch sm:flex-col">
              <Text as="p" className="self-end text-[15px] font-normal">
                Showing 1 – 12 of 15 results
              </Text>
              <div className="mb-1 flex flex-1 items-center justify-end gap-3.5 sm:self-stretch">
                <Text as="p" className="mb-2 self-end text-[15px] font-normal !text-gray-600_03">
                  Sort by
                </Text>
                <SelectBox
                  shape="round"
                  name="Combobox menu"
                  placeholder={`Default`}
                  options={dropDownOptions}
                  className="w-[14%] rounded-lg border px-3.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
