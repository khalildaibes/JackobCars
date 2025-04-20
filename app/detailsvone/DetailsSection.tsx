"use client";

import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import Link from "next/link";
import { TabPanel, TabList, Tab, Tabs } from "react-tabs";

export default function DetailsSection() {
  const [carDetails, setCarDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch("/api/deals?populate=*");
      if (!response.ok) throw new Error(`Failed to fetch car details: ${response.statusText}`);

      const data = await response.json();
      if (!data?.data?.length) throw new Error("No car details found");

      console.log("Fetched Car Details:", data.data);

      // Extract the first car's details
      const product = data.data[0];

      setCarDetails({
        id: product.id,
        name: product.name || "Unknown Car",
        price: `$${product.details.car?.price.toLocaleString() || "N/A"}`,
        description: product.details.car?.description || "No description available",
        year: product.details.car?.year || "Unknown Year",
        miles: product.details.car?.miles || "N/A",
        mileage: product.details.car?.mileage || "N/A",
        body_type: product.details.car?.body_type || "N/A",
        fuel: product.details.car?.fuel || "Unknown",
        transmission: product.details.car?.transmission || "Unknown",
        mainImage: product.image
          ? `http://64.227.112.249${product.image[0].url}`
          : "/default-car.png",
        additionalImages: product.details.car?.images?.additional
        // ? product.details.car.images.additional.map((img: string) => `http://64.227.112.249/${img}`)
        ? product.details.car.images.additional.map((img: string) => `${img}`)
        : [],
        badges: product.details.car?.badges || [],
        breadcrumb: product.details.car?.breadcrumb || [],
        video: product.details.car?.video || null,
        actions: product.details.car?.actions || {},
        dimensions_capacity:  product.details.car?.dimensions_capacity ||[],
        // ✅ Added Pros & Cons
        pros: product.details.car?.pros|| [],
        cons: product.details.car?.cons|| [],
        features:product.details.car?.features|| [],
        // ✅ Added Engine & Transmission Details
        engineTransmissionDetails: product.details.car?.engine_transmission_details|| [],
  
        // ✅ Added Dimensions & Capacity
        detailsArray:  product.details.car?.detailsArray || [],
      });

    } catch (error) {
      console.error("Error fetching car details:", error);
      setCarDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, []);

  if (loading) return <p className="text-center">Loading car details...</p>;
  if (!carDetails) return <p className="text-center text-red-500">Car details not available.</p>;

  return (
    <div className="self-stretch ">
      <Tabs
        className="flex w-full flex-col items-center"
        selectedTabClassName="!text-indigo-a400 font-normal text-[15px] bg-blue-600-50 rounded-[18px]"
        selectedTabPanelClassName="mt-5 !relative tab-panel--selected"
      >
        {/* Header Section */}
        <div className="self-stretch bg-black-900">
          <div className="h-[80px] rounded-tl-[40px] rounded-tr-[40px] bg-white-a700" />
        </div>

        {/* Breadcrumb */}
        <div className="container-xs lg:px-5 md:px-5">
          <Breadcrumb
            separator={<Text className="h-[19px] w-[5.81px] text-[14px] font-normal !text-colors">/</Text>}
            className="flex flex-wrap items-center gap-1"
          >
            {carDetails.breadcrumb.map((item: any, index: number) => (
              <BreadcrumbItem key={index} isCurrentPage={item.current}>
                <BreadcrumbLink href={item.link} as={Link}>
                  <Text as="p" className="text-[15px] font-normal !text-indigo-a400">{item.name}</Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>

          {/* Title & Price */}
          <div className="mt-4 flex items-center justify-center md:flex-col">
            <Heading as="h1" className="text-[40px] font-bold lg:text-[34px] md:text-[34px] sm:text-[32px]">
              {carDetails.name}
            </Heading>
            <Heading
              size="headingmd"
              as="h2"
              className="mt-3 self-end text-[30px] font-bold lg:text-[25px] md:text-[24px] sm:text-[22px]"
            >
              {carDetails.price}
            </Heading>
          </div>

          {/* Car Details Tabs */}
          <div className="relative mt-[-4px] flex items-center justify-between gap-5 md:flex-col">
            <TabList className="flex flex-1 gap-2.5 md:self-stretch md:flex-row flex-col">
              <Tab className="flex items-center gap-2.5 p-2">
                <Img src="img_calendar_indigo_a400.svg" width={18} height={18} alt="Calendar" className="h-[18px]" />
                <Text as="p" className="text-[15px] font-normal !text-indigo-a400">{carDetails.year}</Text>
              </Tab>
              <Tab className="flex items-center gap-2.5 p-2">
                <Img src="img_icon_indigo_a400.svg" width={18} height={18} alt="Mileage" className="h-[18px]" />
                <Text as="p" className="text-[15px] font-normal !text-indigo-a400">{carDetails.miles}</Text>
              </Tab>
              <Tab className="flex items-center gap-2.5 p-2">
                <Img src="img_icon_indigo_a400_18x18.svg" width={18} height={18} alt="Transmission" className="h-[18px]" />
                <Text as="p" className="text-[15px] font-normal !text-indigo-a400">{carDetails.transmission}</Text>
              </Tab>
              <Tab className="flex items-center gap-2.5 p-2">
                <Img src="img_icon_4.svg" width={18} height={18} alt="Fuel" className="h-[18px]" />
                <Text as="p" className="text-[15px] font-normal !text-indigo-a400">{carDetails.fuel}</Text>
              </Tab>
            </TabList>
          </div>

          {/* Images Section */}
          <div className="flex flex-col md:flex-row gap-6 mt-5">
            <div className="relative w-[70%] md:w-2/3">
              <Img
                src={carDetails?.mainImage}
                width={812}
                height={550}
                external={true}
                alt="Car Image"
                className="object-contain rounded-lg"
              />
            </div>

            {/* Additional Images */}
            <div className="w-full md:w-1/3 justify-center items-center h-[30%]">
              <div className="grid grid-cols-2 gap-2">
                {carDetails.additionalImages.length > 0 ? (
                  carDetails.additionalImages.map((img: string, index: number) => (
                    <Img
                      key={index}
                      src={img}
                      width={282}
                      // external={true}
                      height={268}
                      alt={img}
                      className="h-[100%] w-full object-fill rounded-[16px]"
                    />
                  ))
                ) : (
                  <p>No additional images available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
