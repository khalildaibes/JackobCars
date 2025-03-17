
import { SelectBox } from "../../components/SelectBox";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function FilterSection() {
  return (
    <>
      {/* filter section */}
      <div>
        <div className="flex justify-center bg-black-900 py-6 sm:py-4">
          <div className="container-xs mb-[30px] flex justify-center px-14 lg:px-5 md:px-5">
            <div className="flex w-[90%] items-center justify-center rounded-[36px] bg-white-a700 px-1 py-2.5 lg:w-full md:w-full md:flex-col">
              <div className="flex flex-1 items-center justify-center md:flex-col md:self-stretch">
                <SelectBox
                  shape="square"
                  name="VerticalBorder"
                  placeholder={`Condition`}
                  options={dropDownOptions}
                  className="flex-grow !border-r px-3.5"
                />
                <div className="flex flex-1 items-center justify-between gap-5 border-r border-solid border-gray-200 px-[30px] py-1.5 md:self-stretch sm:px-4">
                  <Text as="p" className="self-end text-[15px] font-normal">
                    Any Makes
                  </Text>
                  <div className="black_900_black_900_00_border h-[5px] w-[8px] border-l-4 border-r-4 border-t-[5px] border-solid" />
                </div>
                <div className="flex-1 border-r border-solid border-gray-200 px-1 md:self-stretch">
                  <div className="px-6 sm:px-4">
                    <div className="flex items-center justify-between gap-5 py-1.5">
                      <Text as="p" className="self-end text-[15px] font-normal">
                        Any Models
                      </Text>
                      <div className="black_900_black_900_00_border h-[5px] w-[8px] border-l-4 border-r-4 border-t-[5px] border-solid" />
                    </div>
                  </div>
                </div>
                <Text as="p" className="text-[15px] font-normal capitalize">
                  Prices:
                </Text>
                <Text as="p" className="ml-7 text-[15px] font-normal capitalize md:ml-0">
                  All Prices
                </Text>
              </div>
              <div className="flex w-[34%] items-center justify-center px-1 md:w-full sm:flex-col">
                <div className="flex w-full gap-2 border-l border-solid border-gray-200 px-[26px] py-1.5 sm:w-full sm:px-4">
                  <Img src="img_icon_black_900_20x20.svg" width={20} height={20} alt="Icon" className="h-[20px]" />
                  <Text as="p" className="text-[15px] font-normal">
                    More Filters
                  </Text>
                </div>
                <div className="flex w-full items-start justify-center gap-2.5 rounded-[26px] border border-solid border-indigo-a400 bg-indigo-a400 p-4 sm:w-full">
                  <Img src="img_icon_white_a700.svg" width={14} height={14} alt="Icon" className="h-[14px]" />
                  <Text as="p" className="self-center text-[15px] font-medium !text-white-a700">
                    Find Listing
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
