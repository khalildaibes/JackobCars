import React from "react";
import { Metadata } from "next";
import CarSearch1 from ".";

export const metadata: Metadata = {
  title: "Contact BoxCar - Get in Touch with Our Team Today",
  description:
    "Reach out to BoxCar for any inquiries or assistance. Find our contact details, office locations, and follow us for updates. We\\'re here to help with all your car-related needs.",
  //ogTitle:'...'
};

export default function ContactUsPage() {
    return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        {/* Car Search Section Below Nav */}
        <CarSearch1 />
      </div>
    );
  }
