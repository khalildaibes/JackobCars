"use client";

import { Heading } from "../Heading";
import React from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import { Text } from "../Text";
import Link from "next/link";
import { Input } from "../Input";

interface Props {
  className?: string;
}

export default function Footer2({ ...props }: Props) {
  return (
    <footer {...props} className={`${props.className} flex flex-col`}>
      {/* subscription section */}
      <div className="flex justify-center self-stretch">
        <div className="container-xs flex justify-center lg:px-5 md:px-5">
          <div className="flex w-full items-center justify-between gap-5 rounded-[16px] bg-indigo-a400 md:flex-col">
            <div className="flex rounded-bl-[16px] rounded-tl-[16px] bg-indigo-500 px-5 py-[50px] md:p-5 sm:px-5 sm:py-4">
              <Img
                src="img_gradient_sendin.png"
                width={368}
                height={294}
                alt="Gradient Sendin"
                className="h-[294px] w-full object-cover lg:h-auto md:h-auto"
              />
            </div>
            <div className="mr-[140px] flex w-[44%] flex-col items-start gap-[22px] md:mr-0 md:w-full md:px-5">
              <Heading
                as="h1"
                className="text-[40px] font-bold leading-[48px] !text-white-a700 lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                <>
                  Subscribe To Our Mailing
                  <br />
                  List And Stay Up To Date
                </>
              </Heading>
              <Text as="p" className="text-[15px] font-normal !text-white-a700">
                We’ll keep you updated with the best new jobs.
              </Text>
              <div className="relative h-[78px] content-center self-stretch lg:h-auto md:h-auto">
                <Input
                  color="indigo_500"
                  size="sm"
                  variant="fill"
                  shape="round"
                  type="email"
                  name="Form"
                  placeholder={`Your email address`}
                  className="rounded-[16px] px-[30px]"
                />
                <Button
                  size="8xl"
                  shape="round"
                  className="absolute bottom-0 right-[10.86px] top-0 my-auto min-w-[134px] rounded-[16px] border border-solid border-white-a700 px-[33px] font-medium !text-blue-700 sm:px-4"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[50px] self-stretch bg-white-a700 py-12 md:py-5 sm:py-4">
        {/* footer section */}
        <div className="mb-1 flex justify-center">
          <div className="container-xs flex justify-center lg:px-5 md:px-5">
            <div className="flex w-full items-start justify-between gap-5 md:flex-col">
              <div className="flex w-[68%] items-start justify-between gap-5 self-center md:w-full md:flex-col">
                <div className="flex w-[28%] flex-col items-start gap-4 md:w-full">
                  <Heading size="text3xl" as="p" className="text-[20px] font-medium capitalize lg:text-[17px]">
                    Company
                  </Heading>
                  <ul className="flex flex-col items-start gap-4">
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          About Us
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Blog
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Services
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          FAQs
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Terms
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Contact Us
                        </Text>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex w-[28%] flex-col items-start gap-4 md:w-full">
                  <Heading size="text3xl" as="p" className="text-[20px] font-medium capitalize lg:text-[17px]">
                    Quick Links
                  </Heading>
                  <ul className="flex flex-col items-start gap-4">
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Get in Touch
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Help center
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Live chat
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          How it works
                        </Text>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex w-[30%] flex-col items-start gap-4 self-center md:w-full">
                  <Heading size="text3xl" as="p" className="text-[20px] font-medium capitalize lg:text-[17px]">
                    Our Brands
                  </Heading>
                  <ul className="flex flex-col items-start gap-4">
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Toyota
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Porsche
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Audi
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          BMW
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Ford
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Nissan
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Peugeot
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Volkswagen
                        </Text>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-start gap-4 self-center">
                  <Heading size="text3xl" as="p" className="text-[20px] font-medium capitalize lg:text-[17px]">
                    Vehicles Type
                  </Heading>
                  <ul className="flex flex-col items-start gap-4">
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Sedan
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Hatchback
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          SUV
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Hybrid
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Electric
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Coupe
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Truck
                        </Text>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <Text as="p" className="text-[15px] font-normal">
                          Convertible
                        </Text>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex w-[20%] flex-col items-start gap-[22px] md:w-full">
                <Heading size="text3xl" as="p" className="ml-3 text-[20px] font-medium lg:text-[17px] md:ml-0">
                  Sale Hours
                </Heading>
                <Text
                  as="p"
                  className="ml-3 w-[96%] text-[15px] font-normal leading-[37px] lg:w-full md:ml-0 md:w-full"
                >
                  <>
                    Monday – Friday: 09:00AM – 09:00 PM
                    <br />
                    Saturday: 09:00AM – 07:00PM
                    <br />
                    Sunday: Closed
                  </>
                </Text>
                <Heading size="text3xl" as="p" className="ml-3 text-[20px] font-medium lg:text-[17px] md:ml-0">
                  Connect With Us
                </Heading>
                <div className="flex gap-[9px] self-stretch">
                  <Img src="img_checkmark.svg" width={40} height={40} alt="Checkmark" className="h-[40px]" />
                  <div className="flex gap-2">
                    <Img src="img_checkmark.svg" width={40} height={40} alt="Checkmark" className="h-[40px]" />
                    <Img src="img_checkmark.svg" width={40} height={40} alt="Checkmark" className="h-[40px]" />
                    <Img src="img_checkmark.svg" width={40} height={40} alt="Checkmark" className="h-[40px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center self-stretch border-t border-solid border-gray-300 bg-white-a700 py-[34px] sm:py-4">
        <div className="container-xs flex items-center justify-between gap-5 lg:px-5 md:px-5 sm:flex-col">
          <Text as="p" className="self-end text-[15px] font-normal !text-black-900_01">
            © 2024 exemple.com. All rights reserved.
          </Text>
          <ul className="flex w-[18%] items-start justify-center gap-0.5 sm:w-full">
            <li>
              <Link href="#">
                <Text as="p" className="text-[15px] font-normal">
                  Terms & Conditions
                </Text>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.figma.com/design/PzQUNVEIeMrv8HjdXbjYra?node-id=17-2"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex w-full items-center justify-center gap-2.5 self-center">
                  <div className="h-[4px] w-[4px] rounded-sm bg-black-900" />
                  <Text as="p" className="text-[15px] font-normal">
                    Privacy Notice
                  </Text>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
