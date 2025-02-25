import { Heading } from "../../components";
import UserContactInfo from "../../components/UserContactInfo";
import React, { Suspense } from "react";

const officeLocations = [
  {
    cityName: "San Francisco",
    address: (
      <>
        416 Dewey Blvd, San Francisco,
        <br />
        CA 94116, USA
      </>
    ),
    mapLinkText: "See on Map",
    emailAddress: "alisan@boxcars.com",
    phoneNumber: "+88 656 123 456",
  },
  {
    cityName: "San Francisco",
    address: (
      <>
        416 Dewey Blvd, San Francisco,
        <br />
        CA 94116, USA
      </>
    ),
    mapLinkText: "See on Map",
    emailAddress: "alisan@boxcars.com",
    phoneNumber: "+88 656 123 456",
  },
  {
    cityName: "San Francisco",
    address: (
      <>
        416 Dewey Blvd, San Francisco,
        <br />
        CA 94116, USA
      </>
    ),
    mapLinkText: "See on Map",
    emailAddress: "alisan@boxcars.com",
    phoneNumber: "+88 656 123 456",
  },
];

export default function ContactUsSection1() {
  return (
    <>
      {/* contact us section */}
      <div className="mb-11 mt-[102px] flex flex-col items-center self-stretch">
        <div className="container-xs flex flex-col items-start gap-10 lg:px-5 md:px-5">
          <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
            Our Offices
          </Heading>
          <div className="mr-[88px] flex gap-[106px] self-stretch md:mr-0 md:flex-col">
            <Suspense fallback={<div>Loading feed...</div>}>
              {officeLocations.map((d, index) => (
                <UserContactInfo {...d} key={"group8963" + index} className="w-[34%]" />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
