import { Text, Img, Heading, Button } from "./..";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export default function Footer({ ...props }: Props) {
  return (
    <footer {...props} className={`${props.className} flex flex-col`}>
      <div className="flex flex-col items-center gap-16 self-stretch bg-black-900 sm:gap-8">
        <div className="container-xs mt-[58px] lg:px-5 md:px-5">
          <div className="flex items-center justify-between gap-5 md:flex-col">
            <div className="flex flex-col items-start gap-1.5">
              <Heading
                size="text6xl"
                as="p"
                className="text-[30px] font-medium !text-white-a700 lg:text-[25px] md:text-[24px] sm:text-[22px]"
              >
                Join BoxCar
              </Heading>
              <Text as="p" className="text-[15px] font-normal !text-white-a700">
                Receive pricing updates, shopping tips & more!
              </Text>
            </div>
            <div className="relative h-[70px] w-[38%] content-center self-end lg:h-auto md:h-auto md:w-full">
              <Link href="#" className="rounded-[34px] bg-white-a700_21 sm:p-4">
                <Text as="p" className="py-6 pl-[30px] pr-[34px] text-[15px] font-normal !text-white-a700">
                  Your email address
                </Text>
              </Link>
              <Button
                color="indigo_A400"
                size="5xl"
                className="absolute bottom-0 right-[11.31px] top-0 my-auto min-w-[114px] rounded-[24px] border border-solid border-indigo-a400 px-[29px] font-medium sm:px-4"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center self-stretch bg-black-900">
          <div className="container-xs flex justify-center self-end lg:px-5 md:px-5">
            <div className="h-px w-full bg-white-a700_1c" />
          </div>
        </div>
      </div>
      <div className="flex justify-center self-stretch bg-black-900 py-[50px] md:py-5 sm:py-4">
        <div className="container-xs mb-1 flex justify-center lg:px-5 md:px-5">
          <div className="flex w-full items-start justify-between gap-5 md:flex-col">
            <div className="flex w-[72%] items-start justify-between gap-5 self-center md:w-full md:flex-col">
              <div className="flex w-[28%] flex-col items-start gap-4 md:w-full">
                <Heading
                  size="text3xl"
                  as="p"
                  className="text-[20px] font-medium capitalize !text-white-a700 lg:text-[17px]"
                >
                  Company
                </Heading>
                <ul className="flex flex-col items-start gap-3">
                  <li>
                    <Link href="#">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        About Us
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Blog" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Blog
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Services" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Services
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="FAQs" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        FAQs
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Terms" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Terms
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Contact Us
                      </Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex w-[28%] flex-col items-start gap-4 md:w-full">
                <Heading
                  size="text3xl"
                  as="p"
                  className="text-[20px] font-medium capitalize !text-white-a700 lg:text-[17px]"
                >
                  Quick Links
                </Heading>
                <ul className="flex flex-col items-start gap-3">
                  <li>
                    <Link href="#">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Get in Touch
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Help center
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Live chat
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        How it works
                      </Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex w-[30%] flex-col items-start gap-4 self-center md:w-full">
                <Heading
                  size="text3xl"
                  as="p"
                  className="text-[20px] font-medium capitalize !text-white-a700 lg:text-[17px]"
                >
                  Our Brands
                </Heading>
                <ul className="flex flex-col items-start gap-3">
                  <li>
                    <Link href="Toyota" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Toyota
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Porsche" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Porsche
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Audi" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Audi
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="BMW" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        BMW
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Ford" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Ford
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Nissan" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Nissan
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Peugeot" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Peugeot
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Volkswagen" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Volkswagen
                      </Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-start gap-4 self-center">
                <Heading
                  size="text3xl"
                  as="p"
                  className="text-[20px] font-medium capitalize !text-white-a700 lg:text-[17px]"
                >
                  Vehicles Type
                </Heading>
                <ul className="flex flex-col items-start gap-3">
                  <li>
                    <Link href="Sedan" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Sedan
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Hatchback" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Hatchback
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="SUV" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        SUV
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Hybrid" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Hybrid
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Electric" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Electric
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Coupe" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Coupe
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Truck" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Truck
                      </Text>
                    </Link>
                  </li>
                  <li>
                    <Link href="Convertible" target="_blank" rel="noreferrer">
                      <Text as="p" className="text-[15px] font-normal !text-white-a700">
                        Convertible
                      </Text>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex w-[14%] flex-col items-start gap-6 md:w-full">
              <Heading
                size="text3xl"
                as="p"
                className="ml-3 text-[20px] font-medium !text-white-a700 lg:text-[17px] md:ml-0"
              >
                Our Mobile App
              </Heading>
              <ul className="!ml-3 flex flex-col gap-3 self-stretch md:ml-0">
                <li>
                  <Link href="#">
                    <Img
                      src="img_link.png"
                      width={198}
                      height={60}
                      alt="Link"
                      className="h-[60px] rounded-[16px] object-contain lg:w-[198px] md:w-[198px]"
                    />
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <Img
                      src="img_link.png"
                      width={198}
                      height={60}
                      alt="Link"
                      className="h-[60px] rounded-[16px] object-contain lg:w-[198px] md:w-[198px]"
                    />
                  </Link>
                </li>
              </ul>
              <Heading
                size="text3xl"
                as="p"
                className="ml-3 text-[20px] font-medium !text-white-a700 lg:text-[17px] md:ml-0"
              >
                Connect With Us
              </Heading>
              <div className="flex justify-center gap-[9px] self-stretch">
                <Img src="img_user.svg" width={40} height={40} alt="User" className="h-[40px]" />
                <Img src="img_user.svg" width={40} height={40} alt="User" className="h-[40px]" />
                <Img src="img_user.svg" width={40} height={40} alt="User" className="h-[40px]" />
                <Img src="img_user.svg" width={40} height={40} alt="User" className="h-[40px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center self-stretch border-t border-solid border-white-a700_1e bg-black-900 py-[34px] sm:py-4">
        <div className="container-xs flex items-center justify-between gap-5 lg:px-5 md:px-5 sm:flex-col">
          <Text as="p" className="self-end text-[15px] font-normal !text-white-a700">
            © 2024 exemple.com. All rights reserved.
          </Text>
          <ul className="flex w-[18%] items-start justify-center gap-0.5 sm:w-full">
            <li>
              <Link href="#">
                <Text as="p" className="text-[15px] font-normal !text-white-a700">
                  Terms & Conditions
                </Text>
              </Link>
            </li>
            <li>
              <div className="flex w-full items-center justify-center gap-2.5 self-center">
                <div className="h-[4px] w-[4px] rounded-sm bg-white-a700" />
                <Link href="#">
                  <Text as="p" className="text-[15px] font-normal !text-white-a700">
                    Privacy Notice
                  </Text>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
