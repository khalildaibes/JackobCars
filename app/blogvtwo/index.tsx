import { Heading } from "../../components/Heading";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import ArticleDetail from "../../components/ArticleDetail";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import React, { Suspense } from "react";

const articleList = [
  {
    postImage: "img_detail_post_qgc_550x950.png",
    soundButtonLabel: "Sound",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_blog9_qgcqjcnfx.png",
    soundButtonLabel: "Accessories",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "BMW X6 M50i is designed to exceed your sportiest.",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_blog7_qgcqjcnfx.png",
    soundButtonLabel: "Exterior",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "BMW X5 Gold 2024 Sport Review: Light on Sport",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_blog8_qgcqjcnfx.png",
    soundButtonLabel: "Body Kit",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "2024 Kia Sorento Hybrid Review: Big Vehicle With Small-Vehicle",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_detail_post_qgc_550x950.png",
    soundButtonLabel: "Sound",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_blog4_qgcqjcnfx.png",
    soundButtonLabel: "Exterior",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_detail_post_qgc_550x950.png",
    soundButtonLabel: "Sound",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_blog1_qgcqjcnfx.png",
    soundButtonLabel: "Sound",
    authorName: "admin",
    publishDate: "September 19, 2023",
    articleTitle: "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
  {
    postImage: "img_detail_post_qgc_550x950.png",
    soundButtonLabel: "Sound",
    authorName: "admin",
    publishDate: "November 22, 2023",
    articleTitle: "2024 BMW ALPINA XB7 with exclusive details, extraordinary",
    articleDescription: (
      <>
        Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque bibendum orci ac nibh facilisis, at
        malesuada orci congue.
        <br />
        Nullam tempus ...
      </>
    ),
    readMoreLink: "Read More",
  },
];

export default function BlogvTwoPage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
        <div>
          <div className="flex flex-col items-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[38px] sm:py-4">
            <div className="container-xs mt-1 flex flex-col items-start gap-2 lg:px-5 md:px-5">
              <div className="flex self-stretch">
                <div className="flex py-0.5">
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                    Home
                  </Text>
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-1.5 px-1">
                  <Text as="p" className="text-[14px] font-normal">
                    /
                  </Text>
                  <Text as="p" className="text-[15px] font-normal">
                    Blog
                  </Text>
                </div>
              </div>
              <Heading
                as="h1"
                className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                Blog
              </Heading>
            </div>
          </div>
          <div className="mx-[244px] flex md:mx-0">
            <div className="container-xs mb-5 flex items-start lg:px-5 md:flex-col md:px-5">
              <div className="flex flex-1 flex-col gap-[70px] self-center lg:gap-[70px] md:gap-[52px] md:self-stretch sm:gap-[35px]">
                <div className="mr-[60px] flex flex-col gap-12 md:mr-0">
                  <Suspense fallback={<div>Loading feed...</div>}>
                    {articleList.map((d, index) => (
                      <ArticleDetail {...d} key={"group12234" + index} />
                    ))}
                  </Suspense>
                </div>
                <div className="flex w-[14%] justify-center gap-2 lg:w-full md:w-full">
                  <Button
                    size="2xl"
                    shape="round"
                    className="min-w-[40px] rounded-[18px] border border-solid border-black-900 px-[15px] font-medium"
                  >
                    1
                  </Button>
                  <Button size="2xl" className="min-w-[40px] rounded-[18px] px-3.5 font-medium">
                    2
                  </Button>
                  <div className="flex flex-1 justify-center rounded-[18px] border border-solid border-gray-200 bg-gray-50_01 p-3">
                    <Img
                      src="img_arrow_right_black_900_1.svg"
                      width={10}
                      height={12}
                      alt="Arrow Right"
                      className="h-[12px]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-[28%] flex-col items-end gap-[30px] md:w-full">
                <div className="flex w-[84%] flex-col items-start gap-4 rounded-[16px] border border-solid border-gray-200 px-[30px] py-6 lg:w-full md:w-full sm:p-4">
                  <Heading size="text5xl" as="h2" className="text-[18px] font-medium capitalize lg:text-[15px]">
                    Categories
                  </Heading>
                  <div className="flex flex-col items-start justify-center gap-[18px] self-stretch">
                    <Text as="p" className="text-[15px] font-normal">
                      Accessories
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Body Kit
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Exterior
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Fuel Systems
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Interior
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Oil & Filters
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Sound
                    </Text>
                    <Text as="p" className="text-[15px] font-normal">
                      Wheels
                    </Text>
                  </div>
                </div>
                <div className="flex w-[84%] flex-col items-start gap-4 rounded-[16px] border border-solid border-gray-200 px-[30px] py-6 lg:w-full md:w-full sm:p-4">
                  <Heading size="text5xl" as="h3" className="text-[18px] font-medium capitalize lg:text-[15px]">
                    Tags
                  </Heading>
                  <div className="mb-2 self-stretch">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-[11px]">
                        <Button
                          size="lg"
                          shape="round"
                          className="min-w-[114px] rounded-[16px] px-[18px] font-medium capitalize"
                        >
                          Accessories
                        </Button>
                        <div className="flex w-[34%] justify-center rounded-[16px] bg-blue-50 p-1.5">
                          <Heading  as="h4" className="text-[13px] font-medium capitalize">
                            Exterior
                          </Heading>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <div className="flex rounded-[16px] bg-blue-50 p-2">
                          <Heading as="h5" className="text-[13px] font-medium capitalize">
                            Fuel System
                          </Heading>
                        </div>
                        <div className="flex w-[32%] justify-center rounded-[16px] bg-blue-50 p-1.5">
                          <Heading  as="h6" className="text-[13px] font-medium capitalize">
                            Interior
                          </Heading>
                        </div>
                      </div>
                      <div className="flex gap-[11px]">
                        <div className="flex w-[30%] justify-center rounded-[16px] bg-blue-50 p-1.5">
                          <Heading as="p" className="text-[13px] font-medium capitalize">
                            Sound
                          </Heading>
                        </div>
                        <div className="flex w-[32%] justify-center rounded-[16px] bg-blue-50 p-1.5">
                          <Heading as="p" className="text-[13px] font-medium capitalize">
                            Wheels
                          </Heading>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[50px] bg-black-900">
            <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
          </div>
        </div>
        <Footer />
      </div>
      <div className="absolute bottom-[18.56px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
