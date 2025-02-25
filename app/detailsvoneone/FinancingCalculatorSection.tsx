"use client";

import { Button } from "@/components/Button";
import { Img } from "@/components/Img";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import React from "react";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";

export default function FinancingCalculatorSection() {
  return (
    <>
      {/* financing calculator section */}
      <div className="mt-[50px] flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col items-start gap-12 lg:px-5 md:px-5">
          <div className="h-px w-[66%] bg-gray-300_01" />
          <div className="flex flex-col items-start gap-7 self-stretch">
            <Heading size="text8xl" as="p" className="text-[26px] font-medium lg:text-[22px]">
              Financing Calculator
            </Heading>
            <div className="self-stretch">
              <div className="flex flex-col gap-8">
                <div className="flex gap-8 md:flex-col">
                  <FloatingLabelInput
                    name="10000"
                    placeholder={`Price (\\$)`}
                    defaultValue="10000"
                    floating="contained"
                    className="h-[56px] w-[32%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                  />
                  <FloatingLabelInput
                    name="10"
                    placeholder={`Interest Rate`}
                    defaultValue="10"
                    floating="contained"
                    className="h-[56px] w-[32%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                  />
                </div>
                <div className="flex gap-8 md:flex-col">
                  <FloatingLabelInput
                    name="Label   Loan Term"
                    placeholder={`Loan Term (year)`}
                    defaultValue="Loan Term (year)"
                    floating="contained"
                    className="h-[56px] w-[32%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[13px] text-gray-600_03 md:w-full"
                  />
                  <FloatingLabelInput
                    name="5000"
                    placeholder={`Down Payment`}
                    defaultValue="5000"
                    floating="contained"
                    className="h-[56px] w-[32%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                  />
                </div>
              </div>
            </div>
            <Button
              size="9xl"
              shape="round"
              rightIcon={
                <div className="flex h-[14px] w-[14px] items-center justify-center">
                  <Img
                    src="img_arrowleft.svg"
                    width={14}
                    height={14}
                    alt="Arrow Left"
                    className="mt-1 h-[14px] w-[14px] object-contain"
                  />
                </div>
              }
              className="min-w-[210px] gap-2 rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4"
            >
              Calculate{" "}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
