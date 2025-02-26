"use client";


import { Heading } from "../../components/Heading";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";import React from "react";
import {
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemState,
  Accordion,
  AccordionItem,
} from "react-accessible-accordion";

const accordionData = [
  { doesBoxCarOwn1: "Does BoxCar own the cars I see online or are they owned by other." },
  { doesBoxCarOwn1: "How do you choose the cars that you sell?" },
  { doesBoxCarOwn1: "Can I save my favorite cars to a list I can view later?" },
  { doesBoxCarOwn1: "Can I be notified when cars I like are added to your inventory?" },
  { doesBoxCarOwn1: "What tools do you have to help me find the right car for me and my budget?" },
];

export default function FAQsSection() {
  return (
    <>
      {/* f a qs section */}
      <div className="flex flex-col items-center gap-2 self-stretch">
        <div className="self-stretch bg-black-900">
          <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
        </div>
        <div className="container-xs flex flex-col items-center gap-[30px] px-14 lg:px-5 md:px-5">
          <Heading
            size="headingmd"
            as="h1"
            className="text-[30px] font-bold lg:text-[25px] md:text-[24px] sm:text-[22px]"
          >
            General
          </Heading>
          <Accordion preExpanded={[0]} className="flex w-[68%] flex-col gap-3.5">
            {accordionData.map((d, i) => (
              <AccordionItem uuid={i} key={`Group 8941${i}`}>
                <div className="flex-1">
                  <AccordionItemHeading className="w-full">
                    <AccordionItemButton>
                      <AccordionItemState>
                        {(props) => (
                          <>
                            <div className="flex flex-wrap items-end justify-between gap-5 bg-gray-50_01 px-10 py-4 md:flex-col sm:px-4">
                              <Heading
                                size="text6xl"
                                as="h2"
                                className="mt-[22px] text-[20px] font-medium lg:text-[17px]"
                              >
                                {d.doesBoxCarOwn1}
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
                          Cras vitae ac nunc orci. Purus amet tortor non at phasellus ultricies hendrerit. Eget a, sit
                          morbi nunc sit id massa.
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
    </>
  );
}
