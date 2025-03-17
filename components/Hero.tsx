"use client";

import React, { useRef } from "react";
import Image from "next/image";
import CustomButton from "../components/CustomButton";

const Hero = () => {
  const bottomEl = useRef<null | HTMLDivElement>(null);

  const handleScroll = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
     
    <div className="hero absolute  z-[999] max-h-[380px]  overflow-y-hidden overflow-x-hidden">
    <div className="flex-1 pt-8 px-4"> {/* Ensure padding-x is defined */}
          <h1 className="hero__title text-white">
            Find, or Buy a car — quickly and easily!
          </h1>

          <p className="hero__subtitle ">
            Streamline your car rental experience with our effortless booking
            process.
          </p>

          <CustomButton
            title="Explore Cars"
            containerStyles="bg-primary-blue text-white rounded-full mt-10"
            handleClick={handleScroll}
            isDisabled={false}
          />
        </div>

        <div className="hero__image-container z-[-1] relative overflow-x-hidden sm:overflow-x-hidden max-h-[420px] ">
          <div className="hero__image">
            <Image src="/hero.png" alt="hero" fill className="object-contain " />
          </div>

          <div className="hero__image-overlay z-[-999]"></div>
        </div>
      </div>
      <div className="scroll-to" ref={bottomEl}></div>
    </>
  );
};

export default Hero;
