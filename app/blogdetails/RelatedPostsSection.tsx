import { Heading } from "../../components/Heading";
import BlogDetailsArticle from "../../components/BlogDetailsArticle";
import React, { Suspense } from "react";

const articlePreviewList = [
  {
    blog7Qgcqjcnfx: "img_blog7_qgcqjcnfx_252x436.png",
    link: "Exterior",
    admin: "admin",
    november222023: "November 22, 2023",
    bMWX5Gold2024: (
      <>
        BMW X5 Gold 2024 Sport Review: Light on
        <br />
        Sport
      </>
    ),
  },
  {
    blog7Qgcqjcnfx: "img_blog7_qgcqjcnfx_252x436.png",
    link: "Body Kit",
    admin: "admin",
    november222023: "November 22, 2023",
    bMWX5Gold2024: (
      <>
        BMW X5 Gold 2024 Sport Review: Light on
        <br />
        Sport
      </>
    ),
    blog7qgcqjcnfx: "img_blog8_qgcqjcnfx_252x436.png",
    bmwx5gold2024: (
      <>
        2024 Kia Sorento Hybrid Review: Big Vehicle
        <br />
        With Small-Vehicle
      </>
    ),
  },
  {
    blog7Qgcqjcnfx: "img_blog7_qgcqjcnfx_252x436.png",
    link: "Exterior",
    admin: "admin",
    november222023: "November 22, 2023",
    bMWX5Gold2024: (
      <>
        BMW X5 Gold 2024 Sport Review: Light on
        <br />
        Sport
      </>
    ),
    blog7qgcqjcnfx: "img_blog4_qgcqjcnfx_252x436.png",
    bmwx5gold2024: (
      <>
        2024 BMW X3 M Sport Seats – available as a<br />
        standalone option
      </>
    ),
  },
];

export default function RelatedPostsSection() {
  return (
    <>
      {/* related posts section */}
      <div className="mb-[50px] flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col items-start gap-9 px-3.5 lg:px-5 md:px-5">
          <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
            Related Posts
          </Heading>
          <div className="flex gap-[30px] self-stretch md:flex-col">
            <Suspense fallback={<div>Loading feed...</div>}>
              {articlePreviewList.map((d, index) => (
                <BlogDetailsArticle {...d} key={"group9126" + index} />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
