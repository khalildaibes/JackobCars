import { useState } from "react";
import SearchBar from "./SearchBar";
// import { fuels, yearsOfProduction } from "@/constants";

interface MobileFiltersProps {
  selectedFuel: string;
  selectedYear: string;
  setSelectedFuel: (fuel: string) => void;
  setSelectedYear: (year: string) => void;
  handleFilterChange: (title: string, value: string) => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  // selectedFuel,
  // selectedYear,
  // setSelectedFuel,
  // setSelectedYear,
  // handleFilterChange,
}) => {
  const [isMobileFiltersVisible, setIsMobileFiltersVisible] = useState(true);

  return (
    <div>
      {/* Mobile Filters Button */}
      <button
        className="md:hidden bg-blue-600text-white p-2 rounded-full mt-4 hide_on_mobile "
        onClick={() => setIsMobileFiltersVisible(!isMobileFiltersVisible)}
      >
        {isMobileFiltersVisible ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Mobile Filters */}
      {isMobileFiltersVisible && (
          <SearchBar />

      )}
    </div>
  );
};

export default MobileFilters;
