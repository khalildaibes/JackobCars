import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "after_market Parts & Services | Car Dealer",
  description:
    "Explore our comprehensive after_market solutions including parts, accessories, service centers, and maintenance tips. Find everything you need for your vehicle.",
  openGraph: {
    title: "after_market Parts & Services | Car Dealer",
    description: "Find quality parts, service centers, and maintenance tips for your vehicle",
    type: "website",
  },
};

interface after_marketPageProps {
  searchParams: {
    category?: string;
  };
}

export default function after_marketPage({ searchParams }: after_marketPageProps) {
  return <Page initialCategory={searchParams.category} />;
}
