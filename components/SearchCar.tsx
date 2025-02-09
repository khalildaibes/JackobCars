import { useState } from "react";
import { SearchBar, CustomFilter } from "@/components";
import { fuels, yearsOfProduction } from "@/constants";

interface MobileFiltersProps {
  selectedFuel: string;
  selectedYear: string;
  setSelectedFuel: (fuel: string) => void;
  setSelectedYear: (year: string) => void;
  handleFilterChange: (title: string, value: string) => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  selectedFuel,
  selectedYear,
  setSelectedFuel,
  setSelectedYear,
  handleFilterChange,
}) => {
  const [isMobileFiltersVisible, setIsMobileFiltersVisible] = useState(true);

  return (
    <div>
      {/* Mobile Filters Button */}
      <button
        className="md:hidden bg-blue-500 text-white p-2 rounded-full mt-4"
        onClick={() => setIsMobileFiltersVisible(!isMobileFiltersVisible)}
      >
        {isMobileFiltersVisible ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Mobile Filters */}
      {isMobileFiltersVisible && (
        <div className="md:hidden mt-4">
          <SearchBar />

        </div>
      )}
    </div>
  );
};

export default MobileFilters;
