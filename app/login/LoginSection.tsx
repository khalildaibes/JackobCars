"use client";

import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";

export default function LoginSection() {
  return (
    <>
      {/* login section */}
      <div>
        <Tabs
          className="flex flex-col items-center gap-[34px] self-stretch"
          selectedTabClassName="!text-black-900"
          selectedTabPanelClassName="lg:w-full !relative tab-panel--selected"
        >
          <div className="self-stretch bg-black-900">
            <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
          </div>
          <div className="container-xs mb-16 flex flex-col items-center gap-[30px] px-14 lg:px-5 md:px-5">
            <TabList className="flex flex-wrap items-start gap-7 border-b border-solid border-gray-200 py-1">
              <Tab className="mb-2 text-[16px] font-medium text-black-900 lg:text-[13px]">Sign in</Tab>
              <Tab className="text-[16px] font-medium text-black-900 lg:text-[13px]">Register</Tab>
            </TabList>
            {[...Array(2)].map((_, index) => (
              <TabPanel key={`tab-panel${index}`} className="absolute w-[38%] items-center lg:w-full md:w-full">
                <div className="w-full">
                  <div>
                    <div>
                      <FloatingLabelInput
                        type="email"
                        name="ali   "
                        placeholder={`Username Or Email`}
                        defaultValue="ali..."
                        floating="contained"
                        className="h-[56px] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900"
                      />
                      <FloatingLabelInput
                        type="password"
                        name="Label   Password"
                        placeholder={`Password`}
                        defaultValue="Password"
                        floating="contained"
                        suffix={
                          <Img
                            src="img_icon_black_900_10x20.svg"
                            width={20}
                            height={10}
                            alt="Icon"
                            className="my-1 h-[10px] w-[20px] object-contain"
                          />
                        }
                        className="mt-[22px] h-[56px] gap-4 rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-4 text-[13px] text-gray-600_03"
                      />
                      <div className="mt-5 flex items-center justify-center">
                        <CheckBox
                          size="xs"
                          name="Keep me signed in"
                          label=" Keep me signed in"
                          id="Keepmesignedin"
                          className="gap-1.5 py-0.5 text-[15px] text-black-900"
                        />
                        <div className="flex flex-1 justify-end">
                          <Text as="p" className="text-[15px] font-medium !text-indigo-a400 underline">
                            Lost Your Password?
                          </Text>
                        </div>
                      </div>
                      <Button
                        size="9xl"
                        shape="round"
                        rightIcon={
                          <div className="flex h-[14px] w-[14px] items-center justify-center">
                            <Img
                              src="img_arrowleft.svg"
                              width={14}
                              height={14}
                              alt="Arrow Left"
                              className="my-0.5 h-[14px] w-[14px] object-contain"
                            />
                          </div>
                        }
                        className="mt-[30px] gap-2 self-stretch rounded-[16px] border border-solid border-indigo-a400 px-[33px] font-medium sm:px-4"
                      >
                        Login
                      </Button>
                      <div className="mx-1 my-[18px] flex flex-col items-center gap-[30px] md:mx-0">
                        <Button size="sm"className="min-w-[40px] px-2 uppercase">
                          or
                        </Button>
                        <div className="flex gap-[30px] self-stretch">
                          <Button
                            size="10xl"
                            variant="outline"
                            shape="round"
                            leftIcon={
                              <div className="flex h-[16px] w-[8px] items-center justify-center">
                                <Img
                                  src="img_facebook_blue_700.svg"
                                  width={8}
                                  height={16}
                                  alt="Facebook"
                                  className="mb-0.5 h-[16px] w-[8px] object-contain"
                                />
                              </div>
                            }
                            className="w-full gap-2 rounded-[16px] !border px-[31px] sm:px-4"
                          >
                            Login with Facebook
                          </Button>
                          <Button
                            size="10xl"
                            variant="outline"
                            shape="round"
                            leftIcon={
                              <div className="flex h-[16px] w-[12px] items-center justify-center">
                                <Img
                                  src="img_contrast.svg"
                                  width={12}
                                  height={16}
                                  alt="Contrast"
                                  className="mb-0.5 h-[16px] w-[12px] object-contain"
                                />
                              </div>
                            }
                            className="w-full gap-2 rounded-[16px] !border px-[33px] sm:px-4"
                          >
                            Login with Google
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Input
                      variant="fill"
                      shape="round"
                      type="password"
                      name="Background"
                      placeholder={`Username: demo
Password: demo`}
                      className="mx-2.5 rounded-[16px] px-[30px] leading-[30px] md:mx-0 sm:px-4"
                    />
                  </div>
                </div>
              </TabPanel>
            ))}
          </div>
        </Tabs>
        <div className="bg-black-900">
          <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
        </div>
      </div>
    </>
  );
}
