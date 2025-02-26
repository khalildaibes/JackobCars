"use client";


import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";

export default function LoanCalculatorSection() {
  return (
    <>
      {/* loan calculator section */}
      <div>
        <div className="flex flex-col items-center gap-11">
          <div className="self-stretch bg-black-900">
            <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
          </div>
          <div className="container-xs mb-[34px] lg:px-5 md:px-5">
            <div className="flex items-center justify-center rounded-[16px] border border-solid border-gray-200 md:flex-col">
              <div className="flex w-[64%] flex-col items-start md:w-full">
                <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                  Auto Loan Calculator
                </Heading>
                <Text as="p" className="mt-1.5 text-[15px] font-normal leading-[27px]">
                  <>
                    Use our loan calculator to calculate payments over the life of your loan. Enter your information to
                    <br />
                    see how much your monthly payments could be. You can adjust length of loan, down payment and
                    <br />
                    interest rate to see how those changes raise or lower your payments.
                  </>
                </Text>
                <div className="mt-[50px] self-stretch">
                  <div className="flex flex-col items-start gap-[30px]">
                    <div className="flex gap-[33px] self-stretch md:flex-col">
                      <FloatingLabelInput
                        name="10000"
                        placeholder={`Price (\\$)`}
                        defaultValue="10000"
                        floating="contained"
                        className="h-[56px] w-[38%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                      />
                      <FloatingLabelInput
                        name="10"
                        placeholder={`Interest Rate`}
                        defaultValue="10"
                        floating="contained"
                        className="h-[56px] w-[38%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                      />
                    </div>
                    <div className="flex gap-[33px] self-stretch md:flex-col">
                      <FloatingLabelInput
                        name="Label   Loan Term"
                        placeholder={`Loan Term (year)`}
                        defaultValue="Loan Term (year)"
                        floating="contained"
                        className="h-[56px] w-[38%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[13px] text-gray-600_03 md:w-full"
                      />
                      <FloatingLabelInput
                        name="5000"
                        placeholder={`Down Payment`}
                        defaultValue="5000"
                        floating="contained"
                        className="h-[56px] w-[38%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                      />
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
                      className="min-w-[684px] gap-2 rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4"
                    >
                      Calculate{" "}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex w-[32%] flex-col items-start justify-center gap-7 bg-blue-50 px-[50px] py-[132px] lg:py-8 md:w-full md:p-5 sm:p-4">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <Heading size="text6xl" as="h2" className="text-[20px] font-medium lg:text-[17px]">
                    Monthly Payment
                  </Heading>
                  <Heading size="text5xl" as="h3" className="text-[18px] font-medium !text-indigo-a400 lg:text-[15px]">
                    $0
                  </Heading>
                </div>
                <Heading size="text6xl" as="h4" className="text-[20px] font-medium lg:text-[17px]">
                  Total Interest
                </Heading>
                <Heading size="text5xl" as="h5" className="text-[18px] font-medium !text-indigo-a400 lg:text-[15px]">
                  $0
                </Heading>
                <Heading size="text6xl" as="h6" className="text-[20px] font-medium lg:text-[17px]">
                  Total Payment
                </Heading>
                <Heading size="text5xl" as="p" className="text-[18px] font-medium !text-indigo-a400 lg:text-[15px]">
                  $0
                </Heading>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black-900">
          <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
        </div>
      </div>
    </>
  );
}
