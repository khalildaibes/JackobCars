"use client";

import { FloatingLabelInput } from "../../components/FloatingLabelInput";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";
import { CheckBox } from "../../components/CheckBox";
import { Input } from "../../components/Input";

export default function LoginSection() {
  return (
    <>
      {/* Login Section */}
      <div className="flex flex-col items-center w-full px-4 sm:px-2">
        <Tabs
          className="flex flex-col items-center gap-6 sm:gap-4 w-full max-w-lg"
          selectedTabClassName="!text-black-900"
          selectedTabPanelClassName="!relative tab-panel--selected w-full"
        >
          <div className="w-full bg-black-900">
            <div className="h-20 rounded-tl-3xl rounded-tr-3xl bg-white-a700" />
          </div>

          <div className="w-full max-w-md flex flex-col items-center gap-6 sm:gap-4 px-6 sm:px-4">
            <TabList className="flex w-full justify-center gap-7 border-b border-gray-200 py-2">
              <Tab className="text-lg font-medium text-black-900 sm:text-sm">Sign in</Tab>
              <Tab className="text-lg font-medium text-black-900 sm:text-sm">Register</Tab>
            </TabList>

            {[...Array(2)].map((_, index) => (
              <TabPanel key={`tab-panel${index}`} className="w-full max-w-sm flex flex-col items-center">
                <FloatingLabelInput
                  type="email"
                  name="email"
                  placeholder="Username Or Email"
                  floating="contained"
                  className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 text-lg sm:text-sm"
                />
                <FloatingLabelInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  floating="contained"
                  suffix={
                    <Img src="img_icon_black_900_10x20.svg" width={20} height={10} alt="Icon" className="h-3 w-5" />
                  }
                  className="w-full mt-5 h-14 rounded-xl border border-gray-200 bg-white px-4 text-lg sm:text-sm"
                />
                <div className="mt-4 flex w-full items-center justify-between">
                  <CheckBox size="xs" name="Keep me signed in" label="Keep me signed in" id="Keepmesignedin" />
                  <Text as="p" className="text-indigo-600 underline text-sm cursor-pointer">
                    Lost Your Password?
                  </Text>
                </div>
                <Button
                  size="lg"
                  shape="round"
                  className="mt-6 w-full rounded-xl bg-indigo-600 text-white py-3 text-lg font-medium sm:text-sm"
                >
                  Login
                </Button>

                <div className="my-6 flex flex-col items-center gap-4">
                  <Button size="sm" className="min-w-[40px] px-2 uppercase">
                    or
                  </Button>
                  <div className="flex flex-col w-full gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      shape="round"
                      leftIcon={<Img src="img_facebook_blue_700.svg" width={8} height={16} alt="Facebook" />}
                      className="w-full rounded-xl border px-6 text-lg sm:px-3 sm:text-sm"
                    >
                      Login with Facebook
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      shape="round"
                      leftIcon={<Img src="img_contrast.svg" width={12} height={16} alt="Google" />}
                      className="w-full rounded-xl border px-6 text-lg sm:px-3 sm:text-sm"
                    >
                      Login with Google
                    </Button>
                  </div>
                </div>

                <Input
                  variant="fill"
                  shape="round"
                  type="password"
                  name="Background"
                  placeholder={`Username: demo\nPassword: demo`}
                  className="w-full rounded-xl px-4 py-2 text-center sm:px-3 sm:text-sm"
                />
              </TabPanel>
            ))}
          </div>
        </Tabs>

        <div className="w-full bg-black-900">
          <div className="h-20 rounded-bl-3xl rounded-br-3xl bg-white-a700" />
        </div>
      </div>
    </>
  );
}
