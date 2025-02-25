import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoginSection from "./LoginSection";
import React from "react";

export default function LoginPage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />

        {/* login section */}
        <LoginSection />
        <Footer />
      </div>
      <div className="absolute bottom-[19.17px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
