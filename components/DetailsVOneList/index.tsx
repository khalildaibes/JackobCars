"use client";

import React, { useState } from "react";
import { Text } from "../Text";

interface DetailItem {
  label: React.ReactNode;
  value: React.ReactNode;
}

interface Props {
  className?: string;
  details?: DetailItem[];
}

export default function DetailsVOneList({
  className = "",
  details,
  ...props
}: Props) {
  // Default details array if none is provided
  const detailItems: DetailItem[] = details || [
    { label: "Length", value: "4950mm" },
    { label: "Height", value: "1550mm" },
    { label: "Wheelbase", value: "2580mm" },
    { label: "Height (including roof rails)", value: "1850mm" },
    { label: "Luggage Capacity (Seats Up - Litres)", value: "480" },
    { label: "Luggage Capacity (Seats Down - Litres)", value: "850" },
  ];

  // State to toggle expansion.
  const [expanded, setExpanded] = useState(false);

  return (
    <div {...props} className={`${className} flex flex-col gap-4`}>
      {/* Wrap the details in a container with a max-height of 20vh if not expanded */}
      <div
        className={`flex flex-col gap-4 transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-full" : "max-h-[20vh]"
        }`}
      >
        {detailItems.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-5 w-full">
            <Text as="p" className="text-[15px] font-normal">
              {item.label}
            </Text>
            <Text as="p" className="text-[15px] font-medium">
              {item.value}
            </Text>
          </div>
        ))}
      </div>
      {/* Show toggle button only if there are more than 3 items */}
      {detailItems.length > 3 && (
        <div className="flex justify-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
