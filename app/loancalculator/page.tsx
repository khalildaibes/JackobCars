import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "Auto Loan Calculator - Calculate Your Car Loan Payments",
  description:
    "Use our Auto Loan Calculator to easily calculate your monthly car loan payments. Adjust loan terms, down payment, and interest rate to see payment changes.",
  //ogTitle:'...'
};

export default function LoancalculatorPage() {
  return <Page />;
}
