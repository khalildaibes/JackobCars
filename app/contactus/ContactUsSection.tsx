import { Heading } from "../../components/Heading";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";
import { GoogleMap } from "../../components/GoogleMap";

export default function ContactUsSection() {
  return (
    <>
      {/* contact us section */}
      <div className="flex justify-center self-stretch px-14 md:px-5 sm:px-4">
        <div className="flex w-[94%] justify-center rounded-[16px] bg-gray-600 lg:w-full md:w-full">
          <div className="flex w-full rounded-[16px] bg-gray-300_03 md:flex-col">
            <div className="relative h-[600px] flex-1 content-center lg:h-auto md:h-auto md:w-full md:flex-none md:self-stretch md:px-5">
              <GoogleMap showMarker={false} className="h-[600px] flex-1" />
              <div className="absolute bottom-0 left-0 right-0 top-0 mx-2.5 my-auto flex h-max flex-1 flex-col items-start gap-[422px] lg:mx-0 lg:gap-[316px] md:mx-0 md:gap-[316px] sm:gap-[211px]">
                <div className="flex w-[24%] items-start justify-center gap-4 rounded-sm bg-white-a700 p-2 shadow-2xl lg:w-full md:w-full">
                  <div className="flex flex-1 flex-col items-start self-center">
                    <div className="flex self-stretch">
                      <Text  as="p" className="!font-roboto text-[14px] font-medium !text-black-900_01">
                        lastminute.com London Eye
                      </Text>
                    </div>
                    <Text
                      size="textmd"
                      as="p"
                      className="mt-1.5 !font-roboto text-[12px] font-normal !text-gray-700_02"
                    >
                      Riverside Building, County Hall,
                    </Text>
                    <Text size="textmd" as="p" className="!font-roboto text-[12px] font-normal !text-gray-700_02">
                      London SE1 7PB, United Kingdom
                    </Text>
                    <div className="flex items-center self-stretch">
                      <Text  as="p" className="!font-roboto text-[14px] font-medium !text-gray-700_02">
                        4.5
                      </Text>
                      <Img
                        src="img_settings_14x54.png"
                        width={54}
                        height={14}
                        alt="Settings"
                        className="h-[14px] w-[30%] self-end object-contain"
                      />
                      <Text
                        size="textmd"
                        as="p"
                        className="ml-2.5 self-end !font-roboto text-[12px] font-normal !text-blue-600"
                      >
                        173,278 reviews
                      </Text>
                    </div>
                    <div className="mt-2 flex self-stretch">
                      <Text size="textmd" as="p" className="!font-roboto text-[12px] font-normal !text-blue-600">
                        View larger map
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <Img
                      src="img_image_22x22.png"
                      width={22}
                      height={22}
                      alt="Image"
                      className="ml-3.5 h-[22px] object-cover md:ml-0"
                    />
                    <Text size="textmd" as="p" className="!font-roboto text-[12px] font-normal !text-blue-600">
                      Directions
                    </Text>
                  </div>
                </div>
                <div className="flex flex-col items-center rounded-[3px] border-2 border-solid border-white-a700 bg-white-a700 p-0.5 shadow-3xl">
                  <Img
                    src="img_region_map.png"
                    width={38}
                    height={38}
                    alt="Region Map"
                    className="h-[38px] object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="w-[28%] md:w-full md:px-5">
              <div className="flex sm:flex-col">
                <Img
                  src="img_vt.png"
                  width={256}
                  height={196}
                  alt="Vt"
                  className="h-[196px] w-[52%] object-contain sm:w-full"
                />
                <Img
                  src="img_vt_196x226.png"
                  width={226}
                  height={196}
                  alt="Vt"
                  className="h-[196px] w-[46%] object-contain sm:w-full"
                />
              </div>
              <div className="flex sm:flex-col">
                <Img
                  src="img_vt_256x256.png"
                  width={256}
                  height={256}
                  alt="Vt"
                  className="h-[256px] w-[52%] object-contain sm:w-full"
                />
                <Img
                  src="img_vt_256x226.png"
                  width={226}
                  height={256}
                  alt="Vt"
                  className="h-[256px] w-[46%] object-contain sm:w-full"
                />
              </div>
              <div className="flex sm:flex-col">
                <div className="relative z-[1] flex flex-1 items-center justify-center sm:self-stretch">
                  <div className="flex flex-1 flex-col items-end">
                    <Img
                      src="img_vt_148x256.png"
                      width={256}
                      height={148}
                      alt="Vt"
                      className="h-[148px] w-full object-cover lg:h-auto md:h-auto"
                    />
                    <Heading
                     
                      as="h2"
                      className="relative mr-[30px] mt-[-14px] flex justify-center bg-gray-100_b2 px-1 !font-roboto text-[10px] font-normal !text-black-900_01 md:mr-0"
                    >
                      Keyboard shortcuts
                    </Heading>
                  </div>
                  <Heading
                   
                    as="h3"
                    className="relative ml-[-28px] self-end bg-gray-100_b2 px-1 !font-roboto text-[10px] font-normal !text-black-900_01"
                  >
                    Map data ©2024 Google
                  </Heading>
                </div>
                <div className="relative ml-[-90px] h-[148px] w-[38%] content-center lg:h-auto md:h-auto sm:ml-0 sm:w-full">
                  <Img
                    src="img_vt_148x226.png"
                    width={226}
                    height={148}
                    alt="Vt"
                    className="h-[148px] w-full flex-1 object-cover"
                  />
                  <div className="absolute bottom-px left-0 right-0 mx-auto flex-1">
                    <div className="flex flex-col items-end gap-2">
                      <Img
                        src="img_minimize_white_a700.svg"
                        width={40}
                        height={80}
                        alt="Minimize"
                        className="mr-2.5 h-[80px] w-[18%] rounded-sm object-contain md:mr-0"
                      />
                      <div className="flex justify-end self-stretch">
                        <div className="flex w-[16%] justify-center bg-gray-100_b2 px-1">
                          <div className="flex w-full justify-center">
                            <Heading
                             
                              as="h4"
                              className="!font-roboto text-[10px] font-normal !text-black-900_01"
                            >
                              Terms
                            </Heading>
                          </div>
                        </div>
                        <div className="flex w-[42%] justify-center bg-gray-100_b2 px-1">
                          <div className="flex w-full justify-center">
                            <Heading
                             
                              as="h5"
                              className="!font-roboto text-[10px] font-normal !text-black-900_01"
                            >
                              Report a map error
                            </Heading>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
