import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "Latest Car Reviews and News - Boxcars.com Blog",
  description:
    "Stay informed with Boxcars.com\\'s auto blog featuring the latest reviews and news on BMW ALPINA XB7, BMW X6 M50i, and more. Discover insights on performance, design, and safety.",
  //ogTitle:'...'
};

export default function BlogvOnePage() {
  return <Page />;
}

