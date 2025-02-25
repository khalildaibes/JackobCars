import { Heading, Text, BreadcrumbLink, Breadcrumb, BreadcrumbItem } from "../../components";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CustomerBenefitsSection from "./CustomerBenefitsSection";
import ServicesSection from "./ServicesSection";
import ServicesSection1 from "./ServicesSection1";
import ServicesSection2 from "./ServicesSection2";
import Link from "next/link";
import React from "react";

export default function ServicesPage() {
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Header className="bg-black-900 px-[60px] py-7 md:flex-col md:px-5 sm:p-4" />
        <div>
          <div className="flex flex-col items-center justify-center rounded-tl-[80px] rounded-tr-[80px] bg-white-a700 py-[42px] md:py-5 sm:py-4">
            <div className="container-xs flex flex-col items-start gap-1 lg:px-5 md:px-5">
              <Breadcrumb
                separator={<Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">/</Text>}
                className="flex flex-wrap items-center gap-1 self-stretch"
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" as={Link}>
                    <Text as="p" className="text-[15px] font-normal !text-indigo-a400">
                      Home
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#" as={Link}>
                    <Text as="p" className="text-[15px] font-normal">
                      Services
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <Heading
                as="h1"
                className="text-[40px] font-bold capitalize lg:text-[34px] md:text-[34px] sm:text-[32px]"
              >
                Services
              </Heading>
            </div>
          </div>
          <div className="flex flex-col gap-[114px] py-3.5 lg:gap-[114px] md:gap-[85px] sm:gap-[57px]">
            {/* services section */}
            <ServicesSection />

            {/* customer benefits section */}
            <CustomerBenefitsSection />

            {/* services section */}
            <ServicesSection1 />

            {/* services section */}
            <ServicesSection2 />
          </div>
          <div className="bg-black-900">
            <div className="h-[80px] rounded-bl-[40px] rounded-br-[40px] bg-white-a700" />
          </div>
        </div>
        <Footer />
      </div>
      <div className="absolute bottom-[19.91px] right-5 m-auto h-[40px] w-[2%] rounded-[20px] object-contain" />
    </div>
  );
}
