
import { Heading } from "../../components/Heading";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import React from "react";

export default function ClientExperienceSection() {
  return (
    <>
      {/* client experience section */}
      <div className="flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col gap-[132px] lg:gap-[99px] lg:px-5 md:gap-[99px] md:px-5 sm:gap-[66px]">
          <div className="flex items-start justify-between gap-5 md:flex-col">
            <Heading
              as="h2"
              className="w-[36%] text-[40px] font-bold leading-[54px] lg:w-[36%] lg:text-[34px] md:w-full md:text-[34px] sm:text-[32px]"
            >
              <>
                We Value Our Clients And
                <br />
                Want Them To Have A Nice
                <br />
                Experience
              </>
            </Heading>
            <div className="flex w-[48%] flex-col items-center gap-[22px] self-center md:w-full">
              <Text as="p" className="text-[15px] font-normal leading-[27px]">
                <>
                  Lorem ipsum dolor sit amet consectetur. Convallis integer enim eget sit urna. Eu duis lectus amet
                  <br />
                  vestibulum varius. Nibh tellus sit sit at lorem facilisis. Nunc vulputate ac interdum aliquet
                  <br />
                  vestibulum in tellus.
                </>
              </Text>
              <Text as="p" className="text-[15px] font-normal leading-[27px]">
                <>
                  Sit convallis rhoncus dolor purus amet orci urna. Lobortis vulputate vestibulum consectetur donec
                  <br />
                  ipsum egestas velit laoreet justo. Eu dignissim egestas egestas ipsum. Sit est nunc pellentesque at
                  <br />a aliquam ultrices consequat. Velit duis velit nec amet eget eu morbi. Libero non diam sit
                  viverra
                  <br />
                  dignissim. Aliquam tincidunt in cursus euismod enim.
                </>
              </Text>
              <Text as="p" className="text-[15px] font-normal">
                Magna odio sed ornare ultrices. Id lectus mi amet sit at sit arcu mi nisl. Mauris egestas arcu mauris.
              </Text>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-[30px] md:flex-col">
              <div className="flex w-[14%] flex-col gap-[30px] md:w-full">
                <div className="flex flex-col items-start rounded-[16px] bg-indigo-a400 px-7 py-[22px] sm:p-4">
                  <Heading
                    size="text10xl"
                    as="h3"
                    className="text-[52px] font-medium !text-white-a700 lg:text-[44px] md:text-[32px] sm:text-[26px]"
                  >
                    45
                  </Heading>
                  <Heading
                    size="headinglg"
                    as="h4"
                    className="mb-[104px] text-[32px] font-bold leading-[44px] !text-white-a700 lg:text-[27px] md:text-[26px] sm:text-[24px]"
                  >
                    <>
                      Years in
                      <br />
                      Business
                    </>
                  </Heading>
                </div>
                <Img src="img_g1_jpg.png" width={198} height={198} alt="G1 Jpg" className="h-[198px] object-cover" />
              </div>
              <Img
                src="img_g2_jpg.png"
                width={566}
                height={540}
                alt="G2 Jpg"
                className="h-[540px] w-[42%] object-contain md:w-full"
              />
              <div className="flex flex-1 flex-col gap-[30px] md:self-stretch">
                <Img src="img_g3_jpg.png" width={566} height={300} alt="G3 Jpg" className="h-[300px] object-cover" />
                <div className="flex gap-[30px] sm:flex-col">
                  <Img
                    src="img_g4_jpg.png"
                    width={210}
                    height={210}
                    alt="G4 Jpg"
                    className="h-[210px] w-[38%] object-contain sm:w-full"
                  />
                  <Img
                    src="img_g5_jpg.png"
                    width={328}
                    height={210}
                    alt="G5 Jpg"
                    className="h-[210px] w-[60%] object-contain sm:w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
