"use client";

import React from "react";
import { Button } from "../Button/index";
import { Img } from "../Img/index";
import { Text } from "../Text/index";
import FindCarByPlate from "@/app/findcarbyplate/FindCarByPlate";
import YearSelectBox from "@/components/homeeight/yearselectbox";
import { motion } from "framer-motion";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { SeekBar } from "../SeekBar";
import { SelectBox } from "../SelectBox";
import { Heading } from "../Heading";
import { useTranslations } from "next-intl";

interface Props {
  className?: string;
}

export default function Header({ ...props }: Props) {
  const t = useTranslations("HomePage");

  return (
   
    <div className="flex flex-col h-full !w-full rounded-[32px] bg-navy-blue bg-cover bg-no-repeat lg:h-auto lg:p-5 mt-20 !justify-center !items-center">
    <Heading
      size="text2xl"
      as="h2"
      className="mt-3.5 text-[34px] font-medium capitalize lg:text-[34px] !text-white"
    >
      {t("tab_recommended_for_you")}
    </Heading>
            
    <div className="mb-[52px] flex bg-white rounded-[16px] md:w-[30%] w-[90%] my-[20px] ">        
      <Tabs
        className="mt-[26px] flex w-full flex-col gap-5 rounded-[16px] bg-white-a700 px-[10px] lg:w-full md:w-full sm:p-4 !items-center !justify-center lg:h-[600px]"
        selectedTabClassName="!text-white !bg-black px-[0px] rounded-full h-full"
        selectedTabPanelClassName="!relative tab-panel--selected px-"
      >
<TabList className="relative flex items-center justify-center gap-2 rounded-full bg-gray-200 p-1 w-full">
<Tab className="flex-1 py-2 px-4 text-[16px] flex items-center justify-center font-medium text-gray-700 transition-all duration-300 ease-in-out border border-gray-300 rounded-full hover:bg-gray-100 ui-selected:bg-black ui-selected:text-white ui-selected:border-black">
<Text className="text-center">{t("find_car_plate_heading")}</Text>
</Tab>
<Tab className="flex-1 py-2 px-4 text-[16px] flex items-center justify-center font-medium text-gray-700 transition-all duration-300 ease-in-out border border-gray-300 rounded-full hover:bg-gray-100 ui-selected:bg-black ui-selected:text-white ui-selected:border-black">
<Text className="text-center">{t("tab_recommended_for_you")}</Text>
</Tab>
</TabList>



        <TabPanel className="absolute items-center">
          <motion.div
            className="w-full flex items-center justify-center rounded-lg shadow-lg text-xl font-bold transition-transform"
            transition={{ duration: 0.8 }}
          >
            <div className="">
              <p className="text-center ">
                {t("explore_car_specs")}
              </p>
              <FindCarByPlate />
            </div>
          </motion.div>
        </TabPanel>

        <TabPanel className="absolute items-center">
          <div className="w-full">
            <div className="mt-2.5 flex flex-col items-start">
              <YearSelectBox />
              <SelectBox
                size="sm"
                shape="round"
                indicator={
                  <Img src="img_border_6x8.png" width={8} height={6} alt="Border" className="h-[6px] w-[8px]" />
                }
                name="Q7"
                placeholder={t("select_models")}
                // options={dropDownOptions}
                className="mt-5 gap-4 self-stretch rounded-lg border px-4"
              />
              <Heading size="text2xl" as="h2" className="mt-3.5 text-[18px] font-medium capitalize lg:text-[15px]">
                {t("select_price")}
              </Heading>
              <SeekBar
                inputValue={[5000, 500000]}
                min={5000}
                trackColors={["#050b20", "#e9e9e9", "#050b20"]}
                className="mt-1.5 flex h-[70px] self-stretch"
                trackClassName="h-[3px] w-full"
                thumbClassName="flex justify-center items-center h-[28px] w-[28px] rounded-[14px] border-black-900 border-2 border-solid bg-[url(/images/defaultNoData.png)] bg-cover bg-no-repeat"
              />
              <Button color="indigo_A400" size="7xl" shape="round" className="mt-5 gap-3 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4">
                {t("advanced_filters")}
              </Button>
              <Button color="indigo_A400" size="7xl" shape="round" className="mt-5 gap-3 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4">
                {t("search")}
              </Button>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  </div>
  );
}
export { Header };
