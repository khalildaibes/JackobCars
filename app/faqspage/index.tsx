"use client";

import { Button, Img, Text, Heading } from "../../components";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import FAQsSection from "./FAQsSection";
import React from "react";
import {
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemState,
  Accordion,
  AccordionItem,
} from "react-accessible-accordion";

const accordionData = [
  { doesBoxCarOwn: "Does BoxCar own the cars I see online or are they owned by other." },
  { doesBoxCarOwn: "How do you choose the cars that you sell?" },
  { doesBoxCarOwn: "Can I save my favorite cars to a list I can view later?" },
  { doesBoxCarOwn: "Can I be notified when cars I like are added to your inventory?" },
  { doesBoxCarOwn: "What tools do you have to help me find the right car for me and my budget?" },
];

export default function FaqspagePage() {
  return (
    <div className="w-full overflow-x-scroll bg-white-a700">
      <div>
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
        <div>
          <div className="flex flex-col items-center gap-[116px] lg:gap-[116px] md:gap-[87px] sm:gap-[58px]">
            {/* f a qs section */}
            <FAQsSection />
            <div className="container-xs mb-11 flex flex-col items-center gap-[42px] px-14 lg:px-5 md:px-5">
              <Heading
                size="headingmd"
                as="h3"
                className="text-[30px] font-bold lg:text-[25px] md:text-[24px] sm:text-[22px]"
              >
                Payments
              </Heading>
              <Accordion preExpanded={[0]} className="w-[68%] flex-col">
                {accordionData.map((d, i) => (
                  <AccordionItem uuid={i} key={`Group 8935${i}`}>
                    <div className="flex-1">
                      <AccordionItemHeading className="w-full">
                        <AccordionItemButton>
                          <AccordionItemState>
                            {(props) => (
                              <>
                                <div className="flex flex-wrap items-end justify-between gap-5 bg-gray-50_01 px-10 py-4 md:flex-col sm:px-4">
                                  <Heading
                                    size="text6xl"
                                    as="h4"
                                    className="mt-[22px] text-[20px] font-medium lg:text-[17px]"
                                  >
                                    {d.doesBoxCarOwn}
                                  </Heading>
                                  {props?.expanded ? (
                                    <Img
                                      src="img_vector_2x16.png"
                                      width={16}
                                      height={2}
                                      alt="Vector"
                                      className="mb-3.5 h-[2px] object-cover md:w-full"
                                    />
                                  ) : (
                                    <Img
                                      src="img_plus.svg"
                                      width={16}
                                      height={16}
                                      alt="Plus"
                                      className="mb-1.5 h-[16px] md:w-full"
                                    />
                                  )}
                                </div>
                              </>
                            )}
                          </AccordionItemState>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <div className="flex justify-center bg-gray-50_01 px-10 sm:px-4">
                          <Text as="p" className="mb-10 w-[96%] text-[15px] font-normal leading-[27px]">
                            <>
                              Cras vitae ac nunc orci. Purus amet tortor non at phasellus ultricies hendrerit. Eget a,
                              sit morbi nunc sit id massa.
                              <br />
                              Metus, scelerisque volutpat nec sit vel donec. Sagittis, id volutpat erat vel.
                            </>
                          </Text>
                        </div>
                      </AccordionItemPanel>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          <div className="bg-black-900">
            <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
          </div>
        </div>
        <div className="relative h-[760px] content-center lg:h-auto md:h-auto">
          <Footer className="flex-1" />
          <Button
            size="3xl"
            shape="circle"
            className="absolute bottom-[18.16px] right-5 m-auto w-[40px] rounded-[20px] px-3"
          >
            <Img src="img_arrow_right_white_a700_2.svg" width={10} height={10} />
          </Button>
        </div>
      </div>
    </div>
  );
}
