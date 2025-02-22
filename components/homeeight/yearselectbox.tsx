import { Heading } from "../Heading";
import { SelectBox } from "../SelectBox";
import { Img } from "../Img/index";
import React, { useState } from 'react';

const YearSelectBox = () => {
  // Generate options from 1980 to 2025
  const allYears = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i);
  const years = ["Not Selected", ...allYears];

  // State to hold selected years (initialize with undefined)
  const [selectedFrom, setSelectedFrom] = useState<string | undefined>(undefined);
  const [selectedUntil, setSelectedUntil] = useState<string | undefined>(undefined);

  // Handler for 'From' year selection
  const handleFromChange = (newValue: unknown) => {
    const selectedOption = newValue as { label: string; value: string };
    setSelectedFrom(selectedOption.value); // Store only the value
  };

  // Handler for 'Until' year selection
  const handleUntilChange = (newValue: unknown) => {
    const selectedOption = newValue as { label: string; value: string };
    setSelectedUntil(selectedOption.value); // Store only the value
  };

  return (
    <div className="flex flex-row gap-4 items-center w-[100%] justify-center">
        <Heading
            size="text2xl"
            as="h2"
            className="ml-3.5 text-[18px] font-medium capitalize lg:text-[15px] "
        >
            Make Year
        </Heading>
    <div className="flex flex-row gap-4 items-center w-[100%] justify-center">
      {/* 'From' Year SelectBox */}
      <SelectBox
        size="sm"
        shape="round"
        indicator={
          <Img
            src="img_border_6x8.png"
            width={8}
            height={6}
            alt="Border"
            className="h-[6px] w-[8px]"
          />
        }
        name="From"
        placeholder="From"
        options={years.map(year => ({ label: year.toString(), value: year.toString() }))}
        className="gap-4 self-stretch rounded-lg border px-4 "
        value={selectedFrom} // Controlled value for 'From'
        onChange={handleFromChange} // Update state on change
      />

      {/* 'Until' Year SelectBox */}
      <SelectBox
        size="sm"
        shape="round"
        indicator={
          <Img
            src="img_border_6x8.png"
            width={8}
            height={6}
            alt="Border"
            className="h-[6px] w-[8px]"
          />
        }
        name="Until"
        placeholder="Until"
        options={years.map(year => ({ label: year.toString(), value: year.toString() }))}
        className="gap-4 self-stretch rounded-lg border px-4"
        value={selectedUntil} // Controlled value for 'Until'
        onChange={handleUntilChange} // Update state on change
      />

        </div>
    </div>
  );
};

export default YearSelectBox;
