"use client";

import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import React, { useState } from "react";


interface ProsConsComparisonProps {
  pros?: string[];
  cons?: string[];
  className?: string;
}

export default function ProsConsComparison({
  pros,
  cons,
  className = "",
}: ProsConsComparisonProps) {
  // Default values in case no props are provided
  const defaultPros = [
    "Excellent fuel economy due to advanced engine technology",
    "Smooth, comfortable ride with outstanding suspension",
    "Spacious and luxurious interior with premium materials",
    "High safety ratings with advanced driver assistance systems",
    "Low maintenance costs compared to competitors",
  ];

  const defaultCons = [
    "High initial purchase price",
    "Limited engine options for customization",
    "Small trunk space for a car of this size",
    "Occasional transmission noise at high speeds",
    "Less sporty handling compared to rivals",
  ];

  const prosList = pros || defaultPros;
  const consList = cons || defaultCons;

  // State to toggle the expansion of each column.
  const [prosExpanded, setProsExpanded] = useState(false);
  const [consExpanded, setConsExpanded] = useState(false);

  return (
    <div className={`${className} flex flex-col md:flex-row gap-8`}>
      {/* Pros Column */}
      <div className="flex-1">
        <Heading as="h3" className="text-xl font-bold mb-4">
          Pros
        </Heading>
        <div
          className={`flex flex-col gap-2 transition-all duration-300 overflow-hidden ${
            !prosExpanded ? "max-h-[20vh]" : ""
          }`}
        >
          {prosList.map((pro, idx) => (
            <Text key={idx} as="p" className="text-sm text-green-700">
              • {pro}
            </Text>
          ))}
        </div>
        {prosList.length > 3 && (
          <div className="mt-2">
            <Button onClick={() => setProsExpanded(!prosExpanded)} size="sm">
              {prosExpanded ? "Show Less" : "Show More"}
            </Button>
          </div>
        )}
      </div>
      {/* Cons Column */}
      <div className="flex-1">
        <Heading as="h3" className="text-xl font-bold mb-4">
          Cons
        </Heading>
        <div
          className={`flex flex-col gap-2 transition-all duration-300 overflow-hidden ${
            !consExpanded ? "max-h-[20vh]" : ""
          }`}
        >
          {consList.map((con, idx) => (
            <Text key={idx} as="p" className="text-sm text-red-700">
              • {con}
            </Text>
          ))}
        </div>
        {consList.length > 3 && (
          <div className="mt-2">
            <Button onClick={() => setConsExpanded(!consExpanded)} size="sm">
              {consExpanded ? "Show Less" : "Show More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
