import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "Auto Parts Shop - Find Quality Car Accessories and Kits",
  description:
    "Shop for premium car accessories, body kits, and exterior parts. Discover the latest deals on quality auto parts for your vehicle at our online store.",
  //ogTitle:'...'
};

export default function ShoppagePage() {
  return <Page />;
}
