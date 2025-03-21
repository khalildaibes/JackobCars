import { Heading } from "../../components/Heading";
import BlogDetailsArticle from "../../components/BlogDetailsArticle";
import React, { Suspense } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function RelatedPostsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heading 
            as="h2" 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Related Posts
          </Heading>
          <div className="mt-4 w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"/>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            {articlePreviewList.map((article, index) => (
              <motion.div
                key={index}
                variants={item}
                className="transform transition-all duration-300 hover:scale-105"
              >
                <BlogDetailsArticle {...article} />
              </motion.div>
            ))}
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
