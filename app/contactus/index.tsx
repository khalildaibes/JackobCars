"use client";

import {
  Img,
  Text,
  Heading,
  Button,
  FloatingLabelInput,
  BreadcrumbLink,
  Breadcrumb,
  BreadcrumbItem,
} from "../../components";
import AddressCard from "../../components/AddressCard";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ContactUsSection from "./ContactUsSection";
import ContactUsSection1 from "./ContactUsSection1";
import Link from "next/link";
import React, { Suspense } from "react";

const contactDetails = [
  {
    pinImage: "img_pin_svg.svg",
    addressHeading: "Address",
    addressText: (
      <>
        123 Queensberry Street, North
        <br />
        Melbourne VIC3051, Australia.
      </>
    ),
  },
  { pinImage: "img_mail_1_svg.svg", addressHeading: "Email", addressText: "ali@boxcars.com" },
  { pinImage: "img_phone_1_svg.svg", addressHeading: "Phone", addressText: "+76 956 123 456" },
];

export default function ContactUsPage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
        <div>
          <div className="flex flex-col items-center justify-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[42px] md:py-5 sm:py-4">
            <div className="container-xs flex flex-col items-start gap-1 lg:px-5 md:px-5">
              <Breadcrumb
                separator={<Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">/</Text>}
                className="flex flex-wrap items-center gap-1 self-stretch"
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" as={Link}>
                    <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                      Home
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#" as={Link}>
                    <Text as="p" className="text-[15px] font-normal">
                      Contact Us
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <Link href="#" className="lg:text-[34px] md:text-[34px] sm:text-[32px]">
                <Heading as="h1" className="text-[40px] font-bold capitalize">
                  Contact Us
                </Heading>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {/* contact us section */}
            <ContactUsSection />
            <div className="container-xs mt-[62px] lg:px-5 md:px-5">
              <div className="flex items-start md:flex-col">
                <div className="flex flex-1 flex-col items-start self-center md:self-stretch">
                  <Heading as="h6" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
                    Get In Touch
                  </Heading>
                  <Text as="p" className="mt-3 text-[15px] font-normal leading-[27px]">
                    <>
                      Etiam pharetra egestas interdum blandit viverra morbi consequat mi non bibendum
                      <br />
                      egestas quam egestas nulla.
                    </>
                  </Text>
                  <div className="mt-10 flex flex-col items-start justify-center gap-[30px] self-stretch">
                    <div className="self-stretch">
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-center gap-8 md:flex-col">
                          <FloatingLabelInput
                            type="text"
                            name="Ali"
                            placeholder={`First Name*`}
                            defaultValue="Ali"
                            floating="contained"
                            className="h-[56px] w-[46%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                          />
                          <FloatingLabelInput
                            type="text"
                            name="Tufan"
                            placeholder={`Last Name*`}
                            defaultValue="Tufan"
                            floating="contained"
                            className="h-[56px] w-[46%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                          />
                        </div>
                        <div className="flex justify-center gap-8 md:flex-col">
                          <FloatingLabelInput
                            type="email"
                            name="example gmail com"
                            placeholder={`Email*`}
                            defaultValue="example@gmail.com"
                            floating="contained"
                            className="h-[56px] w-[46%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                          />
                          <FloatingLabelInput
                            type="number"
                            name=" 90 123 456 789"
                            placeholder={`Phone`}
                            defaultValue="+90 123 456 789"
                            floating="contained"
                            className="h-[56px] w-[46%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[15px] text-black-900 md:w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <FloatingLabelInput
                      name="Label   Message"
                      placeholder={`Message`}
                      defaultValue="Message"
                      floating="contained"
                      className="h-[218px] w-[92%] rounded-[12px] border border-solid border-gray-200 bg-white-a700 px-3.5 text-[13px] text-gray-600_03"
                    />
                    <Button
                      size="9xl"
                      shape="round"
                      className="min-w-[162px] rounded-[16px] border border-solid border-indigo-a400 px-[29px] font-medium sm:px-4"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
                <div className="mt-1.5 flex w-[44%] flex-col items-end md:w-full">
                  <div className="flex w-[90%] flex-col gap-[34px] rounded-[16px] border border-solid border-gray-300_01 px-[26px] py-[30px] lg:w-full md:w-full sm:p-4">
                    <div className="ml-3.5 mr-7 mt-1.5 flex flex-col items-start gap-3.5 md:mx-0">
                      <Heading size="text6xl" as="p" className="text-[20px] font-medium lg:text-[17px]">
                        Contact details
                      </Heading>
                      <Text as="p" className="text-[15px] font-normal leading-[27px]">
                        <>
                          Etiam pharetra egestas interdum blandit viverra morbi consequat
                          <br />
                          mi non bibendum egestas quam egestas nulla.
                        </>
                      </Text>
                    </div>
                    <div className="ml-3.5 mr-[236px] flex flex-col gap-7 md:mx-0">
                      <Suspense fallback={<div>Loading feed...</div>}>
                        {contactDetails.map((d, index) => (
                          <AddressCard {...d} key={"group8942" + index} />
                        ))}
                      </Suspense>
                    </div>
                    <div className="mr-3.5 flex flex-col items-start gap-4 md:mr-0">
                      <Text as="p" className="ml-3.5 text-[15px] font-medium md:ml-0">
                        Follow us
                      </Text>
                      <div className="flex gap-[9px] self-stretch">
                        <Img src="img_facebook.svg" width={40} height={40} alt="Facebook" className="h-[40px]" />
                        <Img src="img_facebook.svg" width={40} height={40} alt="Facebook" className="h-[40px]" />
                        <Img src="img_facebook.svg" width={40} height={40} alt="Facebook" className="h-[40px]" />
                        <Img src="img_facebook.svg" width={40} height={40} alt="Facebook" className="h-[40px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* contact us section */}
            <ContactUsSection1 />
          </div>
          <div className="bg-black-900">
            <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
          </div>
        </div>
        <Footer />
      </div>
      <div className="absolute bottom-[19.91px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
