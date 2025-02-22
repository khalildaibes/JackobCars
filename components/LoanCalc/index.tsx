"use client";

import React from "react";
import { Heading } from "../Heading";
import { Button } from "../Button";
import { FloatingLabelInput } from "../FloatingLabelInput";
import { Img } from "../Img";
import { Text } from "../Text";


export default function AutoLoanCalculatorSection() {
  return (
    <>
      {/* auto loan calculator section */}
      <div className="mt-[114px] self-stretch">
        <div className="flex h-[890px] items-center justify-center bg-[url(/images/img_background_890x1920.png)] bg-cover bg-no-repeat py-[200px] lg:h-auto lg:py-8 md:h-auto md:py-5 sm:py-4">
          <div className="container-xs flex lg:px-5 md:px-5">
            <div className="flex w-[38%] flex-col gap-9 rounded-[16px] bg-white-a700 p-[38px] lg:w-full md:w-full sm:p-4">
              <div className="flex flex-col items-start gap-2">
                <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                  Auto Loan Calculator
                </Heading>
                <Text as="p" className="text-[15px] font-normal leading-[27px]">
                  <>
                    Use this car payment calculator to estimate monthly
                    <br />
                    payments on your next new or used auto loan.
                  </>
                </Text>
              </div>
              <div>
                <div className="flex flex-col gap-8">
                  <div className="flex gap-8 sm:flex-col">
                    <FloatingLabelInput
                      name="10000"
                      placeholder={`Price (\\$)`}
                      defaultValue="10000"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 px-3.5 text-[15px] text-black-900 sm:w-full"
                    />
                    <FloatingLabelInput
                      name="10"
                      placeholder={`Interest Rate`}
                      defaultValue="10"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 px-3.5 text-[15px] text-black-900 sm:w-full"
                    />
                  </div>
                  <div className="flex gap-8 sm:flex-col">
                    <FloatingLabelInput
                      name="Label   Loan Term"
                      placeholder={`Loan Term (year)`}
                      defaultValue="Loan Term (year)"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 px-3.5 text-[13px] text-gray-600_02 sm:w-full"
                    />
                    <FloatingLabelInput
                      name="5000"
                      placeholder={`Down Payment`}
                      defaultValue="5000"
                      floating="contained"
                      className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 px-3.5 text-[15px] text-black-900 sm:w-full"
                    />
                  </div>
                </div>
              </div>
              <Button
                color="indigo_A400"
                size="7xl"
                shape="round"
                rightIcon={
                  <div className="flex h-[14px] w-[14px] items-center justify-center">
                    <Img
                      src="img_arrowleft_white_a700.svg"
                      width={14}
                      height={14}
                      alt="Arrow Left"
                      className="mb-0.5 mt-1 h-[14px] w-[14px] object-contain"
                    />
                  </div>
                }
                className="mb-2.5 gap-2 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4"
              >
                Calculate{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
