"use client";

import { Button, FloatingLabelInput, Text, RatingBar, Heading, Img, GoogleMap, Slider } from "../../components";
import DetailsVOne1 from "../../components/DetailsVOne1";
import DetailsVTwo1 from "../../components/DetailsVTwo1";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { ReactTable } from "../../components/ReactTable";
import DetailsSection from "./DetailsSection";
import DetailsSection1 from "./DetailsSection1";
import FinancingCalculatorSection from "./FinancingCalculatorSection";
import RelatedListingsSection from "./RelatedListingsSection";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import AliceCarousel, { EventObject } from "react-alice-carousel";
import { TabPanel, Tabs } from "react-tabs";

const tableData = [
  {
    interior: " Air Conditioner",
    safety: " Anti-lock Braking",
    exterior: " Fog Lights Front",
    comfortConvenience: " Android Auto",
  },
  {
    interior: " Digital Odometer",
    safety: " Brake Assist",
    exterior: " Rain Sensing Wiper",
    comfortConvenience: " Apple CarPlay",
  },
];

type TableRowType = {
  interior: string;
  safety: string;
  exterior: string;
  comfortConvenience: string;
};

export default function DetailsvTwoPage() {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef<AliceCarousel>(null);
  const tableColumns = React.useMemo(() => {
    const tableColumnHelper = createColumnHelper<TableRowType>();
    return [
      tableColumnHelper.accessor("interior", {
        cell: (info) => (
          <div className="flex items-center gap-[13px]">
            <div className="flex flex-col items-center self-end rounded-lg bg-indigo-a400_11 p-1">
              <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
            </div>
            <Text as="p" className="text-[15px] font-normal">
              {info.getValue<string>()}
            </Text>
          </div>
        ),
        header: (info) => (
          <Heading size="text5xl" as="h5" className="text-left text-[18px] font-medium lg:text-[15px]">
            Interior
          </Heading>
        ),
        meta: { width: "232px" },
      }),
      tableColumnHelper.accessor("safety", {
        cell: (info) => (
          <div className="flex items-end gap-[13px]">
            <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
              <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
            </div>
            <Text as="p" className="text-[15px] font-normal">
              {info.getValue<string>()}
            </Text>
          </div>
        ),
        header: (info) => (
          <Heading size="text5xl" as="h6" className="text-left text-[18px] font-medium lg:text-[15px]">
            Safety
          </Heading>
        ),
        meta: { width: "232px" },
      }),
      tableColumnHelper.accessor("exterior", {
        cell: (info) => (
          <div className="flex items-end gap-3.5">
            <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
              <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
            </div>
            <Text as="p" className="text-[15px] font-normal">
              {info.getValue<string>()}
            </Text>
          </div>
        ),
        header: (info) => (
          <Heading size="text5xl" as="p" className="text-left text-[18px] font-medium lg:text-[15px]">
            Exterior
          </Heading>
        ),
        meta: { width: "232px" },
      }),
      tableColumnHelper.accessor("comfortConvenience", {
        cell: (info) => (
          <div className="flex items-center gap-[13px]">
            <div className="flex flex-col items-center self-end rounded-lg bg-indigo-a400_11 p-1">
              <Img src="img_checkmark_indigo_a400.svg" width={8} height={10} alt="Checkmark" className="h-[10px]" />
            </div>
            <Text as="p" className="text-[15px] font-normal">
              {info.getValue<string>()}
            </Text>
          </div>
        ),
        header: (info) => (
          <Heading size="text5xl" as="p" className="text-left text-[18px] font-medium lg:text-[15px]">
            Comfort & Convenience
          </Heading>
        ),
        meta: { width: "204px" },
      }),
    ];
  }, []);

  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 py-7 md:flex-col sm:py-4" />
        <div>
          <div>
            <Tabs
              className="mb-3.5 flex flex-col items-center self-stretch"
              selectedTabClassName=""
              selectedTabPanelClassName="!relative tab-panel--selected"
            >
              {/* details section */}
              <DetailsSection />
              <div className="container-xs mt-[30px] flex flex-col items-start lg:px-5 md:px-5">
                {[...Array(4)].map((_, index) => (
                  <TabPanel key={`tab-panel${index}`} className="absolute self-stretch">
                    <div className="w-full self-stretch">
                      <div className="flex items-start md:flex-col">
                        <div className="w-[69%] self-center md:w-full">
                          <div className="mr-[34px] flex flex-col items-start md:mr-0">
                            <div className="relative h-[550px] content-center self-stretch lg:h-auto md:h-auto">
                              <div className="mx-auto flex w-full">
                                <Slider
                                  autoPlay
                                  autoPlayInterval={2000}
                                  responsive={{
                                    "0": { items: 1 },
                                    "551": { items: 1 },
                                    "1051": { items: 1 },
                                    "1441": { items: 1 },
                                  }}
                                  disableDotsControls
                                  activeIndex={sliderState}
                                  onSlideChanged={(e: EventObject) => {
                                    setSliderState(e?.item);
                                  }}
                                  ref={sliderRef}
                                  items={[...Array(3)].map(() => (
                                    <React.Fragment key={Math.random()}>
                                      <div className="relative h-[550px] content-center lg:h-auto md:h-auto">
                                        <Img
                                          src="img_car11_qgcqjcnfp.png"
                                          width={930}
                                          height={550}
                                          alt="Car11 Qgcqjcnfp"
                                          className="h-[550px] w-full flex-1 rounded-[16px] object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 flex-col items-start gap-[440px] px-2.5 lg:gap-[330px] md:gap-[330px] sm:gap-[220px]">
                                          <div className="ml-5 flex w-[10%] items-start justify-center rounded-[14px] bg-indigo-a400 lg:w-full md:ml-0 md:w-full">
                                            <Button
                                              size="sm"
                                              shape="round"
                                              className="relative z-[1] min-w-[56px] self-center rounded-[14px] px-3.5 font-medium capitalize"
                                            >
                                              Sale
                                            </Button>
                                            <Text
                                              size="textxl"
                                              as="p"
                                              className="relative ml-[-42px] mt-1 text-[14px] font-medium capitalize !text-white-a700"
                                            >
                                              Featured
                                            </Text>
                                          </div>
                                          <Button
                                            size="2xl"
                                            shape="round"
                                            leftIcon={
                                              <div className="flex h-[16px] w-[16px] items-center justify-center">
                                                <Img
                                                  src="img_user_black_900_16x16.svg"
                                                  width={16}
                                                  height={16}
                                                  alt="User"
                                                  className="h-[16px] w-[16px] object-contain"
                                                />
                                              </div>
                                            }
                                            className="min-w-[102px] gap-1 rounded-[12px] px-[18px]"
                                          >
                                            Video
                                          </Button>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 justify-between gap-5 px-2.5">
                                <Button
                                  size="3xl"
                                  onClick={() => {
                                    sliderRef?.current?.slidePrev();
                                  }}
                                  className="w-[60px] rounded-[20px] px-3"
                                >
                                  <Img src="img_icon_white_a700_40x60.svg" width={12} height={12} />
                                </Button>
                                <Button
                                  size="3xl"
                                  onClick={() => {
                                    sliderRef?.current?.slideNext();
                                  }}
                                  className="w-[60px] rounded-[20px] px-3"
                                >
                                  <Img src="img_arrow_right_white_a700_1.svg" width={10} height={12} />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-11 flex flex-col items-start self-stretch">
                              <Heading size="text8xl" as="h2" className="text-[26px] font-medium lg:text-[22px]">
                                Car Overview
                              </Heading>
                              <div className="mt-7 flex gap-5 self-stretch md:flex-col">
                                <div className="flex w-full flex-col gap-[22px]">
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-start gap-3">
                                      <Img
                                        src="img_icon_6.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Body
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 pl-20 pr-14 lg:pl-8 md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        Sedan
                                      </Text>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="flex items-start gap-3 self-center">
                                      <Img
                                        src="img_icon_black_900.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Mileage
                                      </Text>
                                    </div>
                                    <Text as="p" className="text-[15px] font-medium">
                                      250
                                    </Text>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-start gap-3">
                                      <Img
                                        src="img_icon_black_900_18x18.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Fuel Type
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 pl-16 pr-14 lg:pl-8 md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        Petrol
                                      </Text>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="mb-1 flex items-center gap-3 self-center">
                                      <Img
                                        src="img_calendar_black_900_1.svg"
                                        width={18}
                                        height={18}
                                        alt="Calendar"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Year
                                      </Text>
                                    </div>
                                    <Text as="p" className="text-[15px] font-medium">
                                      2021
                                    </Text>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-center gap-3">
                                      <Img
                                        src="img_icon_18x18.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Transmission
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 px-[52px] md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        Manual
                                      </Text>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-start gap-3">
                                      <Img
                                        src="img_settings_black_900_18x18.svg"
                                        width={18}
                                        height={18}
                                        alt="Settings"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Drive Type
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 pl-[60px] pr-14 md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        Rear-Wheel Drive
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex w-full flex-col gap-[22px]">
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-center gap-3">
                                      <Img
                                        src="img_icon_black_900_14x14.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Condition
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 pl-16 pr-14 lg:pl-8 md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        Used
                                      </Text>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="flex items-start gap-3 self-center">
                                      <Img
                                        src="img_icon_7.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Engine Size
                                      </Text>
                                    </div>
                                    <Text as="p" className="text-[15px] font-medium">
                                      4.0
                                    </Text>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-center gap-3">
                                      <Img
                                        src="img_settings_18x18.svg"
                                        width={18}
                                        height={18}
                                        alt="Settings"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Door
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 pl-20 pr-14 lg:pl-8 md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        4 Doors
                                      </Text>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="flex items-start gap-3 self-center">
                                      <Img
                                        src="img_vector.svg"
                                        width={18}
                                        height={18}
                                        alt="Vector"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Cylinder
                                      </Text>
                                    </div>
                                    <Text as="p" className="text-[15px] font-medium">
                                      12
                                    </Text>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-center gap-3">
                                      <Img
                                        src="img_lock_black_900_2.svg"
                                        width={18}
                                        height={18}
                                        alt="Lock"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        Color
                                      </Text>
                                    </div>
                                    <div className="flex flex-1 pl-[78px] pr-14 lg:pl-8 md:px-5 sm:px-4">
                                      <Text as="p" className="text-[15px] font-medium">
                                        Black
                                      </Text>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="mb-1 flex items-center gap-3 self-center">
                                      <Img
                                        src="img_icon_8.svg"
                                        width={18}
                                        height={18}
                                        alt="Icon"
                                        className="h-[18px]"
                                      />
                                      <Text as="p" className="self-end text-[15px] font-normal">
                                        VIN
                                      </Text>
                                    </div>
                                    <Text as="p" className="text-[15px] font-medium">
                                      FCB123792
                                    </Text>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-[50px] h-px w-full self-stretch bg-gray-300_01" />
                            </div>
                            <div className="mt-12 flex flex-col gap-[60px] self-stretch sm:gap-[30px]">
                              <div className="flex flex-col items-start gap-5">
                                <Heading size="text8xl" as="h3" className="text-[26px] font-medium lg:text-[22px]">
                                  Description
                                </Heading>
                                <Text as="p" className="text-[15px] font-normal leading-[27px]">
                                  <>
                                    Quisque imperdiet dignissim enim dictum finibus. Sed consectetutr convallis enim
                                    eget laoreet. Aenean vitae nisl mollis, porta risus
                                    <br />
                                    vel, dapibus lectus. Etiam ac suscipit eros, eget maximus
                                  </>
                                </Text>
                                <Text as="p" className="text-[15px] font-normal leading-[27px]">
                                  <>
                                    Etiam sit amet ex pharetra, venenatis ante vehicula, gravida sapien. Fusce eleifend
                                    vulputate nibh, non cursus augue placerat
                                    <br />
                                    pellentesque. Sed venenatis risus nec felis mollis, in pharetra urna euismod. Morbi
                                    aliquam ut turpis sit amet ultrices. Vestibulum
                                    <br />
                                    mattis blandit nisl, et tristique elit scelerisque nec. Fusce eleifend laoreet dui
                                    eget aliquet. Ut rutrum risus et nunc pretium scelerisque.
                                  </>
                                </Text>
                                <Button
                                  size="7xl"
                                  shape="round"
                                  leftIcon={
                                    <Img
                                      src="img_icon_indigo_a400_22x22.svg"
                                      width={22}
                                      height={22}
                                      alt="Icon"
                                      className="h-[22px] w-[22px] object-contain"
                                    />
                                  }
                                  className="min-w-[236px] gap-2.5 rounded-[12px] px-[34px] font-medium capitalize sm:px-4"
                                >
                                  Car-Brochure.pdf
                                </Button>
                              </div>
                              <div className="h-px bg-gray-300_01" />
                            </div>
                            <Heading
                              size="text8xl"
                              as="h4"
                              className="mt-[46px] text-[26px] font-medium lg:text-[22px]"
                            >
                              Features
                            </Heading>
                            <ReactTable
                              bodyProps={{ className: "" }}
                              className="mr-[26px] mt-8 self-stretch md:mr-0 sm:block sm:overflow-x-auto sm:whitespace-nowrap"
                              columns={tableColumns}
                              data={tableData}
                            />
                          </div>
                        </div>
                        <div className="flex w-[30%] flex-col items-end gap-[30px] md:w-full">
                          <div className="flex w-[92%] justify-center rounded-[16px] border border-solid border-gray-300_01 p-[26px] lg:w-full md:w-full sm:p-4">
                            <div className="flex w-full flex-col items-start">
                              <Heading size="text3xl" as="p" className="text-[16px] font-normal lg:text-[13px]">
                                Our Price
                              </Heading>
                              <div className="mt-3 flex flex-wrap items-center self-stretch">
                                <Heading
                                  size="text3xl"
                                  as="p"
                                  className="mb-1 self-end text-[16px] font-normal line-through lg:text-[13px]"
                                >
                                  $180,000
                                </Heading>
                                <Heading
                                  size="headingmd"
                                  as="h3"
                                  className="ml-1 text-[30px] font-bold lg:text-[25px] md:text-[24px] sm:text-[22px]"
                                >
                                  $165,000
                                </Heading>
                              </div>
                              <Text as="p" className="mt-1 text-[15px] font-normal">
                                Instant Saving: $15,000
                              </Text>
                              <div className="mt-8 flex flex-col gap-5 self-stretch">
                                <Button
                                  size="9xl"
                                  shape="round"
                                  leftIcon={
                                    <Img
                                      src="img_icon_9.svg"
                                      width={18}
                                      height={18}
                                      alt="Icon"
                                      className="h-[18px] w-[18px] object-contain"
                                    />
                                  }
                                  className="gap-2.5 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4"
                                >
                                  Make An Offer Price
                                </Button>
                                <Button
                                  size="9xl"
                                  shape="round"
                                  leftIcon={
                                    <div className="flex h-[18px] w-[18px] items-center justify-center">
                                      <Img
                                        src="img_settings_black_900_18x18.svg"
                                        width={18}
                                        height={18}
                                        alt="Settings"
                                        className="h-[18px] w-[18px] object-contain"
                                      />
                                    </div>
                                  }
                                  className="gap-2.5 self-stretch rounded-[16px] border border-solid border-black-900 px-[33px] font-medium sm:px-4"
                                >
                                  Schedule Test Drive
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex w-[92%] flex-col items-center justify-center rounded-[16px] border border-solid border-gray-200 p-[30px] lg:w-full md:w-full sm:p-4">
                            <div className="w-[24%] self-start rounded-[40px] border border-solid border-gray-200 p-1.5 lg:w-full md:w-full">
                              <Img
                                src="img_test1_150x150_jpg_68x68.png"
                                width={68}
                                height={68}
                                alt="Test1 150x150 Jpg"
                                className="h-[68px] w-full rounded-[34px] object-cover lg:h-auto md:h-auto"
                              />
                            </div>
                            <Heading
                              size="text6xl"
                              as="p"
                              className="mt-2.5 self-start text-[20px] font-medium lg:text-[17px]"
                            >
                              admin
                            </Heading>
                            <Text as="p" className="mt-2 self-start text-[15px] font-normal">
                              943 Broadway, Brooklyn
                            </Text>
                            <div className="mt-3.5 flex items-center justify-center self-stretch">
                              <Img
                                src="img_overlay.svg"
                                width={40}
                                height={40}
                                alt="Overlay"
                                className="h-[40px] w-[14%] rounded-[50%]"
                              />
                              <Text as="p" className="ml-1.5 mt-2 self-start text-[15px] font-medium">
                                Get Direction
                              </Text>
                              <Img
                                src="img_overlay_indigo_a400.svg"
                                width={40}
                                height={40}
                                alt="Overlay"
                                className="ml-9 h-[40px] w-[14%] rounded-[50%]"
                              />
                              <div className="flex flex-1 justify-center">
                                <Text as="p" className="text-[15px] font-medium">
                                  +88-123456789
                                </Text>
                              </div>
                            </div>
                            <Button
                              size="9xl"
                              shape="round"
                              rightIcon={
                                <div className="flex h-[14px] w-[14px] items-center justify-center">
                                  <Img
                                    src="img_arrow_left_indigo_a400_1.svg"
                                    width={14}
                                    height={14}
                                    alt="Arrow Left"
                                    className="my-0.5 h-[14px] w-[14px] object-contain"
                                  />
                                </div>
                              }
                              className="mt-[30px] gap-2 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium !text-indigo-a400 sm:px-4"
                            >
                              Message Dealer
                            </Button>
                            <Button
                              size="9xl"
                              shape="round"
                              rightIcon={
                                <div className="flex h-[14px] w-[14px] items-center justify-center">
                                  <Img
                                    src="img_arrowleft_green_400.svg"
                                    width={14}
                                    height={14}
                                    alt="Arrow Left"
                                    className="my-0.5 h-[14px] w-[14px] object-contain"
                                  />
                                </div>
                              }
                              className="mt-3.5 gap-2.5 self-stretch rounded-[16px] border border-solid border-green-400 px-[33px] font-medium !text-green-400 sm:px-4"
                            >
                              Chat Via Whatsapp{" "}
                            </Button>
                            <div className="mx-[60px] mb-1 mt-4 flex items-center justify-center gap-2 self-stretch md:mx-0">
                              <Text as="p" className="text-[15px] font-normal">
                                View All stock at this dealer
                              </Text>
                              <Img
                                src="img_arrow_left_black_900.svg"
                                width={14}
                                height={14}
                                alt="Arrow Left"
                                className="h-[14px] self-end"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                ))}
                <div className="mt-3 flex items-start self-stretch md:flex-col">
                  <div className="flex w-[30%] self-center md:w-full md:flex-row sm:flex-col">
                    <DetailsVTwo1 className="w-[58%]" />
                    <DetailsVTwo1 className="mb-9 w-[40%]" />
                  </div>
                  <div className="ml-[72px] flex w-[18%] flex-col gap-4 md:ml-0 md:w-full">
                    <div className="flex items-center gap-3.5">
                      <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
                        <Img
                          src="img_checkmark_indigo_a400.svg"
                          width={8}
                          height={10}
                          alt="Checkmark"
                          className="h-[10px]"
                        />
                      </div>
                      <Text as="p" className="text-[15px] font-normal">
                        Rear Spoiler
                      </Text>
                    </div>
                    <div className="flex items-center gap-[13px]">
                      <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
                        <Img
                          src="img_checkmark_indigo_a400.svg"
                          width={8}
                          height={10}
                          alt="Checkmark"
                          className="h-[10px]"
                        />
                      </div>
                      <Text as="p" className="text-[15px] font-normal">
                        Windows - Electric
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-[18px] md:self-stretch">
                    <div className="flex items-center gap-3.5">
                      <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
                        <Img
                          src="img_checkmark_indigo_a400.svg"
                          width={8}
                          height={10}
                          alt="Checkmark"
                          className="h-[10px]"
                        />
                      </div>
                      <Text as="p" className="text-[15px] font-normal">
                        Bluetooth
                      </Text>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
                        <Img
                          src="img_checkmark_indigo_a400.svg"
                          width={8}
                          height={10}
                          alt="Checkmark"
                          className="h-[10px]"
                        />
                      </div>
                      <Text as="p" className="text-[15px] font-normal">
                        HomeLink
                      </Text>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <div className="flex flex-col items-center rounded-lg bg-indigo-a400_11 p-1">
                        <Img
                          src="img_checkmark_indigo_a400.svg"
                          width={8}
                          height={10}
                          alt="Checkmark"
                          className="h-[10px]"
                        />
                      </div>
                      <Text as="p" className="text-[15px] font-normal">
                        Power Steering
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="mt-[54px] h-px w-[66%] bg-gray-300_01" />
              </div>

              {/* details section */}
              <DetailsSection1 />
              <div className="container-xs mt-11 flex flex-col items-start gap-[26px] lg:px-5 md:px-5">
                <Heading size="text8xl" as="p" className="text-[26px] font-medium lg:text-[22px]">
                  Location
                </Heading>
                <div className="flex flex-col items-start self-stretch">
                  <div className="flex self-stretch">
                    <Text as="p" className="self-end text-[15px] font-normal">
                      990 Metropolitan Ave, Brooklyn
                    </Text>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2.5 self-stretch">
                    <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                      Get Direction
                    </Text>
                    <Img
                      src="img_arrow_left_indigo_a400_1.svg"
                      width={14}
                      height={14}
                      alt="Arrow Left"
                      className="h-[14px]"
                    />
                  </div>
                  <div className="relative mt-5 h-[450px] w-[66%] rounded-[16px] bg-gray-300_02">
                    <GoogleMap
                      showMarker={false}
                      className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[450px] flex-1 rounded-[16px]"
                    />
                    <div className="absolute bottom-[-2px] left-0 right-0 mx-auto flex flex-1 flex-col items-center">
                      <div className="ml-3 flex flex-col items-center self-start rounded border-2 border-solid border-black-900_33_01 md:ml-0">
                        <Button size="md" shape="square" className="w-[30px]">
                          <Img src="defaultNoData.png" width={30} height={30} />
                        </Button>
                        <Link
                          href="#"
                          className="flex h-[30px] w-[30px] items-center justify-center rounded-bl-sm rounded-br-sm bg-white-a700 lg:text-[18px]"
                        >
                          <Text
                            size="text7xl"
                            as="p"
                            className="text-center !font-lucidaconsole text-[22px] font-normal !text-black-900_01"
                          >
                            −
                          </Text>
                        </Link>
                      </div>
                      <Button size="5xl" shape="circle" className="mt-[104px] w-[44px] rounded-[22px] px-3 shadow-lg">
                        <Img src="img_linkedin.svg" width={12} height={16} />
                      </Button>
                      <div className="mt-[210px] flex flex-col items-end self-stretch">
                        <div className="flex w-[22%] items-center justify-center bg-white-a700_b2 px-1 lg:w-full md:w-full">
                          <div className="flex">
                            <Heading
                              size="textxs"
                              as="p"
                              className="!font-helveticaneue text-[10.48px] font-medium !text-light_blue-800"
                            >
                              Leaflet
                            </Heading>
                          </div>
                          <Text
                            size="texts"
                            as="p"
                            className="!font-helveticaneue text-[11px] font-medium !text-blue_gray-900"
                          >
                            | ©{" "}
                          </Text>
                          <div className="flex flex-1">
                            <Heading
                              size="textxs"
                              as="p"
                              className="!font-helveticaneue text-[10.48px] font-medium !text-light_blue-800"
                            >
                              OpenStreetMap
                            </Heading>
                          </div>
                        </div>
                        <Heading
                          size="textxs"
                          as="p"
                          className="relative mr-1 mt-[-8px] !font-helveticaneue text-[10.66px] font-medium !text-blue_gray-900 md:mr-0"
                        >
                          contributors
                        </Heading>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* financing calculator section */}
              <FinancingCalculatorSection />
              <div className="container-xs mt-[50px] lg:px-5 md:px-5">
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col items-start gap-[46px]">
                    <div className="h-px w-[66%] bg-gray-300_01" />
                    <div className="flex flex-col items-start gap-7 self-stretch">
                      <Heading size="text8xl" as="p" className="text-[26px] font-medium lg:text-[22px]">
                        1 Review
                      </Heading>
                      <div className="flex items-center gap-[42px] self-stretch md:flex-col">
                        <div className="relative h-[234px] w-[24%] lg:h-auto md:h-auto md:w-full">
                          <Img
                            src="img_image_2.png"
                            width={220}
                            height={220}
                            alt="Image"
                            className="h-[220px] w-full flex-1 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 flex-col items-center px-14 md:px-5 sm:px-4">
                            <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                              Overral Rating
                            </Text>
                            <Heading
                              as="h1"
                              className="text-[40px] font-bold !text-indigo-a400 lg:text-[34px] md:text-[34px] sm:text-[32px]"
                            >
                              4.0
                            </Heading>
                            <Text as="p" className="text-[15px] font-medium !text-indigo-a400">
                              Out of 5
                            </Text>
                          </div>
                        </div>
                        <div className="mr-[468px] flex flex-1 gap-12 md:mr-0 md:flex-col md:self-stretch">
                          <DetailsVOne1
                            comfort="Comfort"
                            perfect="Perfect"
                            p50="5.0"
                            exteriorStyling="Exterior Styling"
                            perfect1="Good"
                            p501="4.0"
                            performance="Performance"
                            perfect2="Perfect"
                            p502="5.0"
                          />
                          <DetailsVOne1
                            comfort="Interior Design"
                            perfect="Perfect"
                            p50="5.0"
                            exteriorStyling="Value For The Money"
                            perfect1="Perfect"
                            p501="5.0"
                            performance="Reliability"
                            perfect2="Perfect"
                            p502="5.0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-10">
                    <div className="self-stretch">
                      <div className="flex flex-col gap-3.5">
                        <div className="flex flex-wrap items-center">
                          <Img
                            src="img_team2_150x150_jpg.png"
                            width={40}
                            height={40}
                            alt="Team2 150x150 Jpg"
                            className="h-[40px] rounded-[20px] object-cover"
                          />
                          <Heading
                            size="text5xl"
                            as="p"
                            className="ml-3 text-[18px] font-medium capitalize lg:text-[15px]"
                          >
                            demo
                          </Heading>
                          <Text size="textxl" as="p" className="ml-3.5 text-[14px] font-normal">
                            November 30, 2023
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <RatingBar
                            value={1}
                            isEditable={true}
                            color="#d0d0d0"
                            activeColor="#d0d0d0"
                            size={18}
                            starCount={2}
                            className="flex gap-2.5 self-end"
                          />
                          <Text as="p" className="text-[15px] font-normal">
                            4.8
                          </Text>
                        </div>
                        <Text as="p" className="text-[15px] font-normal leading-[27px]">
                          <>
                            Etiam sit amet ex pharetra, venenatis ante vehicula, gravida sapien. Fusce eleifend
                            vulputate nibh, non cursus augue placerat
                            <br />
                            pellentesque. Sed venenatis risus nec felis mollis,
                          </>
                        </Text>
                      </div>
                    </div>
                    <div className="flex w-[66%] flex-col items-start gap-7 border-t border-solid border-gray-200 lg:w-full md:w-full">
                      <Heading size="text8xl" as="p" className="mt-[38px] text-[26px] font-medium lg:text-[22px]">
                        Add a review
                      </Heading>
                      <div className="flex flex-col items-start justify-center gap-7 self-stretch">
                        <div className="self-stretch">
                          <div className="flex flex-col gap-[30px]">
                            <div className="flex justify-center md:flex-col">
                              <Text as="p" className="text-[15px] font-normal">
                                Comfort
                              </Text>
                              <div className="flex flex-1 items-center justify-center px-14 md:self-stretch md:px-5 sm:px-4">
                                <RatingBar
                                  value={1}
                                  isEditable={true}
                                  color="#d0d0d0"
                                  activeColor="#d0d0d0"
                                  size={18}
                                  starCount={1}
                                  className="flex gap-2.5"
                                />
                                <div className="flex items-center gap-[104px] px-[18px]">
                                  <Text as="p" className="text-[15px] font-normal">
                                    Interior Design
                                  </Text>
                                  <RatingBar
                                    value={1}
                                    isEditable={true}
                                    color="#d0d0d0"
                                    activeColor="#d0d0d0"
                                    size={18}
                                    starCount={1}
                                    className="flex gap-2.5"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center md:flex-col">
                              <Text as="p" className="text-[15px] font-normal">
                                Exterior Styling
                              </Text>
                              <div className="flex flex-1 items-center justify-center px-14 md:self-stretch md:px-5 sm:px-4">
                                <RatingBar
                                  value={1}
                                  isEditable={true}
                                  color="#d0d0d0"
                                  activeColor="#d0d0d0"
                                  size={18}
                                  starCount={1}
                                  className="flex gap-2.5"
                                />
                                <div className="flex items-center gap-[60px] pl-14 pr-16 lg:pr-8 md:px-5 sm:px-4">
                                  <Text as="p" className="text-[15px] font-normal">
                                    Value For The Money
                                  </Text>
                                  <RatingBar
                                    value={1}
                                    isEditable={true}
                                    color="#d0d0d0"
                                    activeColor="#d0d0d0"
                                    size={18}
                                    starCount={1}
                                    className="flex gap-2.5"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center md:flex-col">
                              <Text as="p" className="text-[15px] font-normal">
                                Performance
                              </Text>
                              <div className="flex w-[64%] items-center justify-between gap-5 px-[114px] lg:px-8 md:w-full md:px-5 sm:px-4">
                                <RatingBar
                                  value={1}
                                  isEditable={true}
                                  color="#d0d0d0"
                                  activeColor="#d0d0d0"
                                  size={18}
                                  starCount={1}
                                  className="flex gap-2.5"
                                />
                                <Text as="p" className="mr-[22px] text-[15px] font-normal lg:mr-0 md:mr-0">
                                  Reliability
                                </Text>
                              </div>
                              <RatingBar
                                value={1}
                                isEditable={true}
                                color="#d0d0d0"
                                activeColor="#d0d0d0"
                                size={18}
                                starCount={1}
                                className="flex gap-2.5"
                              />
                            </div>
                            <div className="flex gap-[22px] md:flex-col">
                              <FloatingLabelInput
                                type="text"
                                name="Ali   "
                                placeholder={`Name`}
                                defaultValue="Ali..."
                                floating="contained"
                                className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                              />
                              <FloatingLabelInput
                                type="email"
                                name="Example   "
                                placeholder={`Email`}
                                defaultValue="Example..."
                                floating="contained"
                                className="h-[56px] w-full rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-6 self-stretch">
                          <div className="flex items-start gap-3 sm:flex-col">
                            <div className="h-[12px] w-[12px] rounded-sm border border-solid border-gray-600_01 bg-white-a700" />
                            <Text as="p" className="self-center text-[15px] font-normal">
                              Save my name, email, and website in this browser for the next time I comment.
                            </Text>
                          </div>
                          <FloatingLabelInput
                            name="Label   Review"
                            placeholder={`Review`}
                            defaultValue="Review"
                            floating="contained"
                            className="h-[198px] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[13px] text-gray-600_03"
                          />
                        </div>
                        <Button
                          size="9xl"
                          shape="round"
                          className="min-w-[164px] rounded-[16px] border border-solid border-indigo-a400 px-[29px] font-medium sm:px-4"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* related listings section */}
              <RelatedListingsSection />
            </Tabs>
          </div>
          <div className="bg-black-900">
            <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
          </div>
        </div>
        <Footer />
      </div>
      <div className="absolute bottom-[18.81px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
