"use client";

import { Button } from "../../components/Button";
import { FloatingLabelInput } from "../../components/FloatingLabelInput";
import { Img } from "../../components/Img";
import { Heading } from "../../components/Heading";
import React from "react";

export default function FinancingCalculatorSection() {
  return (
    <div className="mt-12 mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-4">
      {/* Section Title */}
      <div className="mb-8 text-center">
        <Heading
          size="text8xl"
          as="p"
          className="text-2xl font-bold text-gray-800 sm:text-xl"
        >
          Financing Calculator
        </Heading>
      </div>

      {/* Input Fields */}
      <div className="space-y-6">
        {/* Row 1: Price & Interest Rate */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <FloatingLabelInput
            name="price"
            placeholder="Price ($)"
            defaultValue="10000"
            floating="contained"
            className="h-14 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-800 sm:w-1/2"
          />
          <FloatingLabelInput
            name="interestRate"
            placeholder="Interest Rate (%)"
            defaultValue="10"
            floating="contained"
            className="h-14 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-800 sm:w-1/2"
          />
        </div>
        {/* Row 2: Loan Term & Down Payment */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <FloatingLabelInput
            name="loanTerm"
            placeholder="Loan Term (years)"
            defaultValue="Loan Term (year)"
            floating="contained"
            className="h-14 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-600 sm:w-1/2"
          />
          <FloatingLabelInput
            name="downPayment"
            placeholder="Down Payment ($)"
            defaultValue="5000"
            floating="contained"
            className="h-14 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-800 sm:w-1/2"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="9xl"
          shape="round"
          rightIcon={
            <div className="flex h-4 w-4 items-center justify-center">
              <Img
                src="img_arrowleft.svg"
                width={16}
                height={16}
                alt="Arrow Left"
                className="object-contain"
              />
            </div>
          }
          className="min-w-[210px] gap-2 rounded-lg border border-indigo-400 px-8 py-2 font-medium text-indigo-400 sm:px-4"
        >
          Calculate
        </Button>
      </div>
    </div>
  );
}
