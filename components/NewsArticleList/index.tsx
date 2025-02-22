import React from "react";
import { Heading } from "../Heading";
import { Text } from "../Text";

interface Props {
  className?: string;
  headline1?: React.ReactNode;
  author1?: React.ReactNode;
  date1?: React.ReactNode;
  headline2?: React.ReactNode;
  author2?: React.ReactNode;
  date2?: React.ReactNode;
  headline3?: React.ReactNode;
  author3?: React.ReactNode;
  date3?: React.ReactNode;
  description1?: React.ReactNode;
  headline4?: React.ReactNode;
  author4?: React.ReactNode;
  date4?: React.ReactNode;
  description2?: React.ReactNode;
}

export default function NewsArticleList({
  headline1 = "Pervez Musharraf, Former Military Ruler of Pakistan, Dies at 79",
  author1 = "By Ginny Dennis",
  date1 = "Feb. 4, 2023",
  headline2 = "Fears mount around ‘catastrophic’ abortion pills case as decision nears",
  author2 = "By Ginny Dennis",
  date2 = "Feb. 4, 2023",
  headline3 = "London to Istanbul by train: This 10-day rail adventure is a slow traveller’s dream",
  author3 = "By Ginny Dennis",
  date3 = "Feb. 4, 2023",
  description1 = "&lt;&gt;Romantic cross-European train journeys have long been associated with the Orient Express. But you no longer need to fork out thousands to make this fabled journey. &lt;br /&gt;&lt;br /&gt;From Byway to Tailor Made Rail, companies are cropping up to meet renewed demand for long distance train travel. &lt;br /&gt;&lt;br /&gt;An epic trip with the latter takes you all the way...&lt;/&gt;",
  headline4 = "More Airports to Use Greener ‘Glide’ Approach to Landing",
  author4 = "By Ginny Dennis",
  date4 = "Feb. 4, 2023",
  description2 = "&lt;&gt;Eleven more U.S. airports plan to adopt a new way of landing planes that reduces both emissions and noise — all by having incoming planes turn off their engines and glide down to the tarmac like a paraglider.&lt;br /&gt;&lt;br /&gt;The Federal Aviation Administration announced Monday that planes heading to Orlando, Fla.; Kansas City, Mo.; Omaha, Neb.; Nebraska&#39;s Offutt Air Force Base; Reno, Nev.; and six airports in South Florida soon would make idle descents to...&lt;/&gt;",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex items-center self-stretch flex-1`}>
      <div className="flex w-full flex-col gap-[1.50rem] sm:w-full sm:gap-[1.50rem]">
        <div className="flex gap-[1.50rem]">
          <div className="flex h-[21.25rem] w-full flex-col items-center justify-end gap-[0.75rem] bg-gradient bg-cover bg-no-repeat p-[0.75rem] sm:h-auto sm:gap-[0.75rem]">
            <Text
              as="p"
              className="mt-[15.00rem] w-[98%] !font-georgia text-[1.25rem] font-normal leading-[1.38rem] sm:w-full sm:text-[1.06rem]"
            >
              {headline1}
            </Text>
            <div className="flex flex-wrap gap-[1.00rem] self-stretch">
              <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal">
                {author1}
              </Text>
              <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal">
                {date1}
              </Text>
            </div>
          </div>
          <div className="flex h-[21.25rem] w-full flex-col items-center justify-end gap-[0.75rem] bg-gradient1 bg-cover bg-no-repeat p-[0.75rem] sm:h-auto sm:gap-[0.75rem]">
            <Text
              as="p"
              className="mt-[15.00rem] w-[98%] !font-georgia text-[1.25rem] font-normal leading-[1.38rem] sm:w-full sm:text-[1.06rem]"
            >
              {headline2}
            </Text>
            <div className="flex flex-wrap gap-[1.00rem] self-stretch">
              <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal">
                {author2}
              </Text>
              <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal">
                {date2}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex gap-[1.50rem]">
          <div className="flex w-full flex-col gap-[0.75rem] bg-white-a700 p-[0.88rem] sm:gap-[0.75rem]">
            <div className="flex flex-col gap-[0.38rem] sm:gap-[0.38rem]">
              <div className="flex flex-col gap-[0.75rem] sm:gap-[0.75rem]">
                <Heading as="h5" className="text-[1.25rem] font-bold leading-[1.38rem] sm:text-[1.06rem]">
                  {headline3}
                </Heading>
                <div className="flex flex-wrap gap-[1.00rem]">
                  <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal !text-gray-700">
                    {author3}
                  </Text>
                  <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal !text-gray-700">
                    {date3}
                  </Text>
                </div>
              </div>
              <div className="h-[0.13rem] bg-gray-200" />
            </div>
            <Text
              size="textlg"
              as="p"
              className="mb-[0.50rem] !font-georgia text-[1.00rem] font-normal leading-[1.13rem] !text-teal-900 sm:text-[0.81rem]"
            >
              {description1}
            </Text>
          </div>
          <div className="flex w-full flex-col gap-[0.75rem] bg-white-a700 p-[0.88rem] sm:gap-[0.75rem]">
            <div className="flex flex-col gap-[0.38rem] sm:gap-[0.38rem]">
              <div className="flex flex-col gap-[0.75rem] sm:gap-[0.75rem]">
                <Heading as="h5" className="text-[1.25rem] font-bold leading-[1.38rem] sm:text-[1.06rem]">
                  {headline4}
                </Heading>
                <div className="flex flex-wrap gap-[1.00rem]">
                  <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal !text-gray-700">
                    {author4}
                  </Text>
                  <Text size="texts" as="p" className="!font-helvetica text-[0.63rem] font-normal !text-gray-700">
                    {date4}
                  </Text>
                </div>
              </div>
              <div className="h-[0.13rem] bg-gray-200" />
            </div>
            <Text
              size="textlg"
              as="p"
              className="mb-[0.88rem] !font-georgia text-[1.00rem] font-normal leading-[1.13rem] !text-teal-900 sm:text-[0.81rem]"
            >
              {description2}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
