"use client";

import React, { useRef } from "react";
import Image from "next/image";
import CustomButton from "../components/CustomButton";
import { useTranslations } from "next-intl";

const Hero = () => {
  const bottomEl = useRef<null | HTMLDivElement>(null);
  const t = useTranslations("Hero");

  const handleScroll = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
     
    <div className="hero absolute  z-[999] max-h-[380px]  overflow-y-hidden overflow-x-hidden">
    <div className="flex-1 pt-8 px-4"> {/* Ensure padding-x is defined */}
          <h1 className="hero__title text-white">
            {t("title")}
          </h1>

          <p className="hero__subtitle ">
            {t("subtitle")}
          </p>

          <CustomButton
            title={t("search_button")}
            containerStyles="bg-primary-blue text-white rounded-full mt-10"
            handleClick={handleScroll}
            isDisabled={false}
          />
        </div>

        <div className="hero__image-container z-[-1] relative overflow-x-hidden sm:overflow-x-hidden max-h-[300px] ">
          <div className="hero__image">
            <Image src="/hero.png" alt={t("hero_image_alt")} fill className="object-contain " />
          </div>

          <div className="hero__image-overlay z-[-999]"></div>
        </div>
      </div>
      <div className="scroll-to" ref={bottomEl}></div>
    </>
  );
};

export default Hero;
