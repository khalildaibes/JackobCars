import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
  title: "User Login - Access Your Account on Boxcars.com",
  description:
    "Sign in to Boxcars.com to submit listings, access exclusive deals, and manage your preferences. Keep me signed in for faster access or register for a new account.",
  //ogTitle:'...'
};

export default function LoginPage() {
  return <Page />;
}
