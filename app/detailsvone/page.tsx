import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  // title: "Toyota Camry New | Detailed Car Information",
  title: "Detailed Car Information",
  description:
    "Get an in-depth look at the new Toyota Camry. With only 20 miles, this sedan offers a sleek design, advanced features, and a comfortable ride. Read reviews and schedule a test drive today.",
  //ogTitle:'...'
};

export default function DetailsvOnePage() {
  return <Page />;
}
