import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "Car Buying FAQs - Your Questions Answered by BoxCar",
  description:
    "Get answers to your car buying questions with BoxCar\\'s FAQ page. Learn about vehicle ownership, payment options, and how to find the perfect car for your budget.",
  //ogTitle:'...'
};

export default function FaqspagePage() {
  return <Page />;
}
