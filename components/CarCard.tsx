import { useState, useEffect } from "react";
import Image from "next/image";
import { CarProps } from "@/types";
import { generateCarImageUrl } from "@/utils";
import CustomButton from "./CustomButton";
import CardDetails from "./CardDetails";

interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive } = car;
  const [isOpen, setIsOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const comparedCars = JSON.parse(localStorage.getItem("comparedCars") || "[]");
    setIsAdded(comparedCars.some((c: CarProps) => c.model === car.model));
  }, [car]);

  const addToComparison = () => {
    let comparedCars = JSON.parse(localStorage.getItem("comparedCars") || "[]");
    if (!isAdded) {
      comparedCars.push(car);
      localStorage.setItem("comparedCars", JSON.stringify(comparedCars));
      setIsAdded(true);
    }
  };

  return (
    <div className="car-card group relative p-4 bg-white shadow-md rounded-lg"
    onClick={() => setIsOpen(true)}
>
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {make} {model}
        </h2>
      </div>

      <p className="flex mt-6 text-[32px] font-extrabold">
        <span className="self-start text-[14px] font-semibold">$</span>
        200,000
      </p>

      <div className="relative w-full h-40 my-3 object-contain">
        <Image
          src={generateCarImageUrl(car)}
          alt="car model"
          fill
          priority
          className="object-contain"
        />
      </div>

      <div className="relative flex w-full mt-2">
        {/* Desktop View: Show only on hover */}
        <div className="hidden sm:flex group-hover:flex w-full justify-between text-gray transition-all duration-300">
          <div className="flex flex-col justify-center items-center gap-2">
            <Image src="/steering-wheel.svg" width={20} height={20} alt="steering wheel" />
            <p className="text-[14px]">{transmission === "a" ? "Automatic" : "Manual"}</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image src="/tire.svg" width={20} height={20} alt="tire" />
            <p className="text-[14px]">{drive.toUpperCase()}</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image src="/gas.svg" width={20} height={20} alt="gas" />
            <p className="text-[14px]">{city_mpg} MPG</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col gap-2 p-2 bg-white shadow-md transition-all duration-300 sm:hidden group-hover:flex">
        <CustomButton
          title="View More"
          containerStyles="w-full py-[16px] rounded-full bg-primary-blue"
          textStyles="text-white text-[14px] leading-[17px] font-bold"
          rightIcon="/right-arrow.svg"
          handleClick={() => setIsOpen(true)}
        />
        <CustomButton
          title={isAdded ? "Added" : "Add to Compare"}
          containerStyles={`w-full py-[10px] rounded-full ${isAdded ? "bg-gray-400" : "bg-green-500"} mt-2`}
          textStyles="text-white text-[14px] leading-[17px] font-bold"
          handleClick={addToComparison}
          isDisabled={isAdded}
        />
      </div>

      {/* Mobile View: Always show buttons */}
      <div className="sm:hidden flex flex-col gap-2 mt-4">
        <CustomButton
          title="View More"
          containerStyles="w-full py-[16px] rounded-full bg-primary-blue"
          textStyles="text-white text-[14px] leading-[17px] font-bold"
          rightIcon="/right-arrow.svg"
          handleClick={() => setIsOpen(true)}
        />
        <CustomButton
          title={isAdded ? "Added" : "Add to Compare"}
          containerStyles={`w-full py-[10px] rounded-full ${isAdded ? "bg-gray-400" : "bg-green-500"} mt-2`}
          textStyles="text-white text-[14px] leading-[17px] font-bold"
          handleClick={addToComparison}
          isDisabled={isAdded}
        />
      </div>

      <CardDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} />
    </div>
  );
};

export default CarCard;
