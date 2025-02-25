import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "Membership Plans - Choose Your Ideal Subscription",
  description:
    "Explore our Membership Plans to get the best value on listings with added visibility and support. Choose from Basic, Standard, Extended, or Enterprise options.",
  //ogTitle:'...'
};

export default function PriceingPage() {
  return <Page />;
}
