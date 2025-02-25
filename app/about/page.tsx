import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "About BoxCar - Our Commitment to Quality and Service",
  description:
    "Learn about BoxCar\\'s 45 years in business, our dedication to clients, and why we\\'re the trusted choice for car sales and services. Read customer testimonials and explore our premium brands.",
  //ogTitle:'...'
};

export default function AboutPage() {
  return <Page />;
}
