"use client";

import { Heading } from "@/components/Heading";
import {Text} from "../../components/Text";
import { Button } from "@/components/Button";
import metadata from "libphonenumber-js/metadata.full.json";
import React from "react";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import { SelectBox } from "@/components/SelectBox";
import { DatePicker } from "@/components/DatePicker";

export default function ServicesSection2() {
  const countryOptions = React.useMemo(() => {
    return Object.entries(metadata.countries).map(([code, data]) => {
      const callingCode = `${data[0]}`;

      const display = {
        code,
        callingCode: `+${callingCode}`,
        imgSrc: `https://catamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
      };

      return {
        value: code,
        label: (
          <>
            <Text as="p" className="text-[15px] font-normal">
              {"display.callingCode"}
            </Text>
          </>
        ),
      };
    });
  }, []);

  return (
    <>
      {/* services section */}
      <div className="mb-[30px] flex justify-center">
        <div className="container-xs flex items-start justify-between gap-5 lg:px-5 md:flex-col md:px-5">
          <div className="flex w-[64%] flex-col items-start justify-center self-center rounded-[16px] border border-solid border-gray-300_01 bg-gray-50_01 px-10 py-[30px] md:w-full sm:p-4">
            <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              Schedule Service
            </Heading>
            <Text as="p" className="mt-3 text-[15px] font-normal leading-[27px]">
              <>
                Use our loan calculator to calculate payments over the life of your loan. Enter your information to
                <br />
                see how much your monthly payments could be. You can adjust length of loan, down payment and
                <br />
                interest rate to see how those changes raise or lower your payments.
              </>
            </Text>
            <div className="mt-[18px] flex flex-col gap-[30px] self-stretch">
              <div>
                <div className="flex flex-col gap-8">
                  <div className="flex gap-8 md:flex-col">
                    <FloatingLabelInput
                      type="text"
                      name="Ali"
                      placeholder={`Name`}
                      defaultValue="Ali"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                    />
                    <FloatingLabelInput
                      type="email"
                      name="example   "
                      placeholder={`Email`}
                      defaultValue="example..."
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                    />
                  </div>
                  <div className="flex gap-8 md:flex-col">
                    <div className="flex h-[56px] w-full items-center justify-center rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-1">
                      <SelectBox
                        options={countryOptions}
                        defaultValue={countryOptions.find((option) => option.value === "TR")}
                        className="mt-5 max-h-[18px] flex-shrink-0 items-center justify-center bg-transparent pl-2.5"
                      />
                      <input
                        name="Group 11208"
                        type="tel"
                        className="ml-3.5 flex h-[16px] flex-grow items-center justify-center px-3"
                      />
                    </div>
                    <FloatingLabelInput
                      name="Add Model"
                      placeholder={`Make Model`}
                      defaultValue="Add Model"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                    />
                  </div>
                  <div className="flex gap-8 md:flex-col">
                    <FloatingLabelInput
                      name="10 000"
                      placeholder={`Mileage (optional)`}
                      defaultValue="10.000"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                    />
                    <DatePicker
                      name="Input"
                      placeholder={`Best time`}
                      className="flex w-full gap-[34px] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 py-2 text-[13px] text-gray-600_03"
                    />
                  </div>
                </div>
              </div>
              <Button
                size="9xl"
                shape="round"
                className="mb-5 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4"
              >
                Request a Service
              </Button>
            </div>
            <Text as="p" className="mt-[18px] text-[15px] font-normal leading-[27px]">
              <>
                By submitting this form you will be scheduling a service appointment at no obligation and will be
                contacted within 48
                <br />
                hours by a service advisor.
              </>
            </Text>
          </div>
          <div className="flex w-[28%] flex-col items-start justify-center gap-3 rounded-[16px] border border-solid border-gray-300_01 px-[30px] py-[26px] md:w-full sm:p-4">
            <Heading size="text6xl" as="p" className="text-[20px] font-medium lg:text-[17px]">
              Opening hours
            </Heading>
            <div className="self-stretch">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Sunday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 12:00
                  </Text>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Monday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 17:00
                  </Text>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Tuesday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 17:00
                  </Text>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Wednesday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 17:00
                  </Text>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Thursday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 17:00
                  </Text>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Friday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 17:00
                  </Text>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                  <Text as="p" className="text-[15px] font-normal">
                    Saturday
                  </Text>
                  <Text as="p" className="text-[15px] font-medium">
                    8:00 - 12:00
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
