
import CarCard from "../../components/CarCard";
import React from "react";

export default function ShoppagePage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700 mt-[25%]">
        <CarCard car={undefined} />
      </div>
      <div className="absolute bottom-[19.56px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
