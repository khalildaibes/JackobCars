"use client"; // This marks the component as a Client Component

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import ShowMore from "@/components/ShowMore";
import Hero from "@/components/Hero";
import { fetchCars } from "@/utils";
import { CarProps } from "@/types";
import MobileFilters from "@/components/SearchCar";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import SalesAndReviewsSection from "../components/homeeight/SalesAndReviewsSection";
import CustomerTestimonialsSection from "../components/homeeight/CustomerTestimonialsSection";
import FeaturedListingsSection from "../components/homeeight/FeaturedListingsSection";
import LatestBlogPostsSection from "../components/homeeight/LatestBlogPostsSection";
import RecentlyAddedSection from "../components/homeeight/RecentlyAddedSection";
import {  useTranslations } from "next-intl";
import ResponsiveNewsLayout from "@/components/Responsivenews";
import HeroSection from "@/components/NewHero";
import LookingForCar from "@/components/comp";
import SearchBar from "@/components/SearchBar";
const listings = [
  {
    id: 1,
    image: "img_h92_jpg.png",
    alt: "Car 1",
    title: "Toyota Camry 2020",
    miles: "20,000 miles",
    fuel: "Gasoline",
    condition: "used",
    transmission: "Automatic",
    price: "$20,000",
  },
  {
    id: 2,
    image: "img_h92_jpg.png",
    alt: "Car 2",
    title: "Honda Accord 2019",
    miles: "30,000 miles",
    fuel: "Gasoline",
    condition: "used",
    transmission: "Automatic",
    price: "$18,000",
  },
  {
    id: 3,
    image: "img_h92_jpg.png",
    alt: "Car 3",
    condition: "used",
    title: "Ford Focus 2018",
    miles: "25,000 miles",
    fuel: "Gasoline",
    transmission: "Manual",
    price: "$15,000",
  },
  {
    id: 4,
    image: "img_h46_jpg.png",
    alt: "Car 4",
    condition: "used",
    title: "Chevrolet Malibu 2021",
    miles: "10,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$22,000",
  },
  {
    id: 5,
    image: "img_car9_660x440_jpg_218x328.png",
    alt: "Car 5",
    condition: "used",
    title: "Nissan Altima 2020",
    miles: "15,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$19,000",
  },
  {
    id: 6,
    image: "img_car12_660x440_jpg_1.png",
    alt: "Car 6",
    condition: "new",
    title: "BMW 3 Series 2019",
    miles: "18,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$28,000",
  },
  {
    id: 7,
    image: "img_h21_jpg.png",
    alt: "Car 7",
    condition: "new",
    title: "Audi A4 2018",
    miles: "22,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$27,000",
  },
  {
    id: 8,
    image: "img_car20_660x440_jpg.png",
    alt: "Car 8",
    condition: "new",
    title: "Mercedes C-Class 2020",
    miles: "12,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$35,000",
  },
  {
    id: 9,
    image: "img_car12_660x440_jpg_1.png",
    alt: "Car 9",
    condition: "new",
    title: "Hyundai Sonata 2021",
    miles: "8,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$21,000",
  },
  {
    id: 10,
    image: "img_car9_660x440_jpg_218x328.png",
    alt: "Car 10",
    condition: "new",
    title: "Kia Optima 2019",
    miles: "16,000 miles",
    fuel: "Gasoline",
    transmission: "Automatic",
    price: "$17,000",
  },
];
const FindCarByPlate = dynamic(
  () => import("./findcarbyplate/FindCarByPlate"),
  { ssr: false }
);

async function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  useEffect(() => {
    setSelectedFuel(searchParams.get("fuel") || "");
    setSelectedYear(searchParams.get("year") || "");
  }, [searchParams]);
  
  const selectedManufacturer = searchParams.get("manufacturer");
  const selectedLimit = searchParams.get("limit");
  const selectedModel = searchParams.get("model");
  // const dropDownOptions = [
  //   { label: "Option1", value: "option1" },
  //   { label: "Option2", value: "option2" },
  //   { label: "Option3", value: "option3" },
  // ];
  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function getCars() {
      setIsLoading(true);
      try {
        let allCars: CarProps[] = [];
        if (selectedManufacturer || selectedModel) {
          allCars = await fetchCars({
            manufacturer: selectedManufacturer || "",
            year: selectedYear ? parseInt(selectedYear, 10) : 0,
            fuel: selectedFuel || "",
            limit: selectedLimit ? parseInt(selectedLimit, 10) : 12,
            model: selectedModel || "",
          });
        }
        setFilteredCars(allCars || []);
        
      } catch (error) {
        console.error("Error fetching cars:", error);
        setFilteredCars([]);
      }
      setIsLoading(false);
    }
  
    getCars();
  }, [selectedFuel, selectedYear, selectedManufacturer, selectedLimit, selectedModel]);
  
  const handleFilterChange = useCallback((title: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(title, value);
    } else {
      params.delete(title);
    }
    router.push(`/carsearch?${params.toString()}`);
  }, [router]);

  // Use the "HomePage" namespace to access your translations
  const t = useTranslations("HomePage");
  

  const [listings, setListings] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/deals");
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
  
      const data = await response.json();
      if (!data || !data.data) throw new Error("Invalid API response structure");
  
      console.log("Fetched Products:", data.data);
      
      // Transform the fetched data into the required listings format
      const formattedListings = data.data.map((product: any) => ({
        id: product.id,
        mainImage: product.image
        ? `http://68.183.215.202${data.data[0].image[0].url}`
        : "/default-car.png",
        alt: product.name || "Car Image",
        title: product.name,
        miles: product.details?.miles || "N/A",
        fuel: product.details?.fuel || "Unknown",
        condition: product.details?.condition || "Used", // Default to "Used"
        transmission: product.details?.transmission || "Unknown",
        details: product.details?.transmission || "Unknown",
        price: `$${product.price.toLocaleString()}`,
      }));
      
      // Update state with formatted listings
      setListings(formattedListings);
    } catch (error) {
      console.error("Error fetching products:", error);
      setListings([]); // Ensure listings are reset if there's an error
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
  }, []);


  
  const [homePageData, setHomePageData] = useState({});

  const fetchHomePageData = async () => {
    try {
      const response = await fetch("/api/homepage");
      if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
  
      const data = await response.json();
      if (!data || !data.data) throw new Error("Invalid API response structure");
  
      console.log("Fetched homepage:", data.data);
      
      // Transform the fetched data into the required listings format
      const formattedHomepage ={
        banner: data.data.banner,
        featured: data.data.featured,
        textcards: data.data.textcards,
        locale: data.data.locale,
        localizations:data.data.localizations
      };
      setHomePageData(formattedHomepage);
      console.error("formattedHomepage:", formattedHomepage);

      // Update state with formatted listings
    } catch (error) {
      console.error("Error fetching homepage:", error);
      setHomePageData([]); // Ensure listings are reset if there's an error
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchHomePageData();
  }, []);


  const data = [
    {
      text: t("looking_for_car_text"),
      title: t("looking_for_car_title"),
      backgroundColor: "#050A30",
      textColor: "#E9F2FF",
      buttonColor: "#003060",
      buttonTextColor: "#FFFFFF",
      icon: "/icons/car-icon.svg"
    },
    {
      text: t("sell_your_car_text"),
      title: t("sell_your_car_title"),
      backgroundColor: "#000C66",
      textColor: "#FFFFFF",
      buttonColor: "#FFFFFF",
      buttonTextColor: "#050B20",
      icon: "/icons/car-icon.svg"
    }
  ];
  
  
  return (
    <main className="items-center justify-center w-full overflow-hidden">
      {/* Filters for larger screens */}
      <div className="flex min-h-full items-center justify-center p-4 pt-0 text-center w-full overflow-hidden">
        <div className="hidden sm:block">
          {/* Additional desktop-only filters */}
        </div>
      </div>

      {/* 3D Toggle Button Section */}
      <div className="flex justify-center md:max-w-none ">
        <motion.div
          className="relative w-full flex justify-center items-center sm:hidden"
          transition={{ duration: 0.5 }}
        >
          {activeIndex === 0 && (
            <motion.div
              className="h-full flex items-center justify-center rounded-lg shadow-lg text-xl font-bold plate_background "
              transition={{ duration: 0.8 }}
            >
              <Hero />
            </motion.div>
          )}
          {activeIndex === 1 && (
            <motion.div
              className="w-full flex items-center justify-center rounded-lg shadow-lg text-xl font-bold transition-transform h-[600px] "
              transition={{ duration: 0.8 }}
            >
              <div className="">
                <h1 className="text-center text-3xl font-extrabold">
                  {t("tab_search_by_plate")}
                </h1>
                <p className="text-center">
                  {t("explore_car_specs")}
                </p>
                <FindCarByPlate />
              </div>
            </motion.div>
          )}
          {activeIndex === 2 && (
            <div className=" ">
              <h1 className="text-4xl font-extrabold text-center sm:hidden">
                {t("car_catalogue_heading")}
              </h1>
              <p className="text-center py-2">
                {t("explore_cars_like")}
              </p>
              <MobileFilters
                selectedFuel={selectedFuel}
                selectedYear={selectedYear}
                setSelectedFuel={setSelectedFuel}
                setSelectedYear={setSelectedYear}
                handleFilterChange={handleFilterChange}
              />
            </div>
          )}
        </motion.div>
      </div>
      {/* Loading State */}
      {isLoading && activeIndex === 2 ? (
        <div className="text-center text-xl ">{t("loading_cars")}</div>
      ) : !filteredCars.length ? (
        selectedManufacturer || selectedModel ? (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">
              {t("oops_no_results")}
            </h2>
          </div>
        ) : null
      ) : activeIndex !== 2 ? (
        <section>{/* Other sections can be added here */}</section>
      ) : (
        <section>
          <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <ShowMore
            pageNumber={parseInt(selectedLimit || "12", 10) / 12}
            isNext={parseInt(selectedLimit || "12", 10) > filteredCars.length}
          />
        </section>
      )}
          {/* print fetched products */}
{/* 
  <div className="container mx-auto px-4 py-8">
  <h1 className="text-2xl font-bold mb-4">Products</h1>
  {products.length ? (
    <ul>
      {products.map((product: any) => (
        <li key={product.id} className="mb-2">
          <span>{product.name || product.documentId}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p>No products found</p>
  )}
</div> */}





        <HeroSection />
       
        <div className="justify-center pt-8 gap-6 flex-col flex md:flex-row bg-white">
        <div className="justify-center pt-8 gap-6 flex-col flex md:flex-row">
  {data.map(({ title, text, buttonColor, backgroundColor,icon, buttonTextColor, textColor }, index) => (
    <LookingForCar
      key={index} // Always provide a unique key when mapping over an array
      text={text} // Use the dynamic text
      title={title} // Use the dynamic title
      backgroundColor={backgroundColor}
      textColor={textColor}
      buttonColor={buttonColor}
      buttonTextColor={buttonTextColor}
      icon={icon}
    />
  ))}
</div>

    </div>
      {/* featured listings section */}
      <FeaturedListingsSection listings={listings} />

      {/* sales and reviews section */}
      <SalesAndReviewsSection />

      {/* recently added section */}
      <RecentlyAddedSection listings={listings}/>

      {/* customer testimonials section */}
      {/* <CustomerTestimonialsSection /> */}

      {/* latest blog posts section */}
      <LatestBlogPostsSection />

      {/* Blogs Section */}
      {/* <div className="titleParent w-full max-w-screen-lg mx-auto overflow-x-hidden px-4">
        <div className="titleParent w-full max-w-screen-xl mx-auto overflow-x-hidden px-6">
          <div className="title w-full text-center">
            <div className="titleChild" />
            <div className="featuredWrapper">
              <div className="featured text-2xl font-bold">
                {t("blogs_heading")}
              </div>
            </div>
          </div>

          <div className="blogParent flex flex-wrap justify-center gap-6">
            <div className="blog">
              <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
                <Image
                  className="frameChild w-full h-auto object-cover"
                  width={300}
                  height={250}
                  alt={t("porsche_alt")}
                  src="/hero.png"
                />
                <div className="findYourPlaceWithWrapper text-center">
                  <div className="findYourPlace text-lg font-medium">
                    {t("blog1_title")}
                  </div>
                </div>
              </div>
            </div>

            <div className="blog">
              <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
                <Image
                  className="frameChild w-full h-auto object-cover"
                  width={500}
                  height={350}
                  alt={t("toyota_alt")}
                  src="/hero.png"
                />
                <div className="findYourPlaceWithWrapper p-4 text-center">
                  <div className="findYourPlace text-lg font-medium">
                    {t("blog2_title")}
                  </div>
                </div>
              </div>
            </div>

            <div className="blog">
              <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
                <Image
                  className="frameChild w-full h-auto object-cover"
                  width={500}
                  height={350}
                  alt={t("kia_alt")}
                  src="/hero.png"
                />
                <div className="findYourPlaceWithWrapper p-4 text-center">
                  <div className="findYourPlace text-lg font-medium">
                    {t("blog3_title")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </main>
  );
}

export default function HomePage() {
  return (
      <HomeContent />
  );
}
