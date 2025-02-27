"use client";

import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import React, { useState } from "react";


interface DetailItem {
  label: React.ReactNode;
  value: React.ReactNode;
}

interface Props {
  className?: string;
  details?: DetailItem[];
}

export default function EngineTransmissionDetails({
  className = "",
  details,
  ...props
}: Props) {
  // Default engine and transmission details if none provided.
  const detailItems: DetailItem[] = details || [
    { label: "Engine Type", value: "V6" },
    { label: "Horsepower", value: "300 HP" },
    { label: "Torque", value: "280 lb-ft" },
    { label: "Transmission", value: "8-Speed Automatic" },
    { label: "Drivetrain", value: "All-Wheel Drive" },
    { label: "Fuel Economy", value: "22 MPG City / 30 MPG Highway" },
  ];

  // State to control expansion of the details container.
  const [expanded, setExpanded] = useState(false);

  return (
    <div {...props} className={`${className} flex flex-col gap-4`}>


      {/* Details Container */}
      <div
        className={`flex flex-col gap-4 transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-full" : "max-h-[20vh]"
        }`}
      >
        {detailItems.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-5 w-full">
            <Text as="p" className="text-sm font-normal">
              {item.label}
            </Text>
            <Text as="p" className="text-sm font-medium">
              {item.value}
            </Text>
          </div>
        ))}
      </div>

      {/* Toggle Button: Only show if there are more than 3 items */}
      {detailItems.length > 3 && (
        <div className="flex justify-end">
          <Button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-indigo-600 hover:underline"
            size="sm"
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
}
