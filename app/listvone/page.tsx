import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "Browse Our Car Listings | Find Your Next Vehicle",
  description:
    "Discover great deals on cars with our comprehensive listings. From Toyota Camry to Ford Transit, find the perfect match for your needs and budget. Sort by price, condition, and more.",
  //ogTitle:'...'
};

export default function ListvOnePage() {
  return <Page />;
}
