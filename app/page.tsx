"use client"; // This marks the component as a Client Component

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CarCard from "../components/CarCard";
import ShowMore from "../components/ShowMore";
import Hero from "../components/Hero";
import { fetchCars } from "../utils";
import { CarProps } from "../types";
import MobileFilters from "../components/SearchCar";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import CustomerTestimonialsSection from "../components/homeeight/CustomerTestimonialsSection";
import LatestBlogPostsSection from "../components/homeeight/LatestBlogPostsSection";
import RecentlyAddedSection from "../components/homeeight/RecentlyAddedSection";
import {  useTranslations } from "next-intl";
import ResponsiveNewsLayout from "../components/Responsivenews";
import SearchBar from "../components/SearchBar";
import { Img } from "../components/Img";
import Link from "next/link";

// Types
interface Deal {
  id: string;
  image: Array<{ url: string }>;
  name: string;
  details: {
    car: {
      fuel: string;
      make: string;
      body_type: string;
      miles: string;
      condition: string;
      transmission: string;
      year: number;
      description: string;
      features: Array<{ value: string }>;
    };
  };
  price: number;
  categories: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  cover: { url: string };
  categories: Array<{ name: string }>;
  publishedAt: string;
  author: string;
  description: string;
  locale: string;
  slug: string;
  blocks: any[];
}

interface HomePageData {
  banner: any;
  featured: any;
  textcards: any;
  locale: string;
  localizations: any;
}

interface Listing {
  id: number;
  mainImage: string;
  alt: string;
  title: string;
  miles: string;
  fuel: string;
  condition: string;
  transmission: string;
  details: string;
  price: string;
  mileage: string;
  year: number;
  fuelType: string;
  make: string;
  bodyType: string;
  description: string;
  features: string[];
  category: string[];
}

// API fetch functions
const fetchHomePageData = async (): Promise<HomePageData> => {
  const response = await fetch("/api/homepage");
  if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data) throw new Error("Invalid API response structure");
  return data.data;
};

const fetchArticles = async () => {
  const [featuredResponse, newsResponse, storyResponse] = await Promise.all([
    fetch('/api/articles?limit=3'),
    fetch('/api/articles?limit=5'),
    fetch('/api/articles?limit=8')
  ]);

  const [featuredData, newsData, storyData] = await Promise.all([
    featuredResponse.json(),
    newsResponse.json(),
    storyResponse.json()
  ]);

  if (!featuredData.data || !newsData.data || !storyData.data) {
    throw new Error('Invalid data format received from API');
  }

  return { featuredData, newsData, storyData };
};

const fetchDeals = async (): Promise<Deal[]> => {
  const response = await fetch('/api/deals');
  if (!response.ok) throw new Error(`Failed to fetch deals: ${response.statusText}`);
  const data = await response.json();
  if (!data?.data) throw new Error("Invalid API response structure");
  return data.data;
};

// Normalization functions
const normalizeFuelType = (rawFuelType: string): string => {
  const fuelTypes = {
    'plug-in': 'Plug-in Hybrid',
    'plug in': 'Plug-in Hybrid',
    'היברידי נטען': 'Plug-in Hybrid',
    'هجين قابل للشحن': 'Plug-in Hybrid',
    'hybrid': 'Hybrid',
    'היברידי': 'Hybrid',
    'هجين': 'Hybrid',
    'electric': 'Electric',
    'חשמלי': 'Electric',
    'كهربائي': 'Electric',
    'diesel': 'Diesel',
    'דיזל': 'Diesel',
    'ديزل': 'Diesel',
    'gasoline': 'Gasoline',
    'petrol': 'Gasoline',
    'בנזין': 'Gasoline',
    'بنزين': 'Gasoline'
  };

  const normalized = Object.entries(fuelTypes).find(([key]) => 
    rawFuelType.toLowerCase().includes(key)
  );
  return normalized ? normalized[1] : rawFuelType;
};

const normalizeMake = (rawMake: string): string => {
  const makes = {
    'toyota': 'Toyota',
    'טויוטה': 'Toyota',
    'تويوتا': 'Toyota',
    'honda': 'Honda',
    'הונדה': 'Honda',
    'هوندا': 'Honda',
    'ford': 'Ford',
    'פורד': 'Ford',
    'فورد': 'Ford',
    'chevrolet': 'Chevrolet',
    'שברולט': 'Chevrolet',
    'شيفروليه': 'Chevrolet',
    'bmw': 'BMW',
    'ב.מ.וו': 'BMW',
    'بي ام دبليو': 'BMW',
    'mercedes': 'Mercedes-Benz',
    'מרצדס': 'Mercedes-Benz',
    'مرسيدس': 'Mercedes-Benz',
    'audi': 'Audi',
    'אאודי': 'Audi',
    'أودي': 'Audi',
    'tesla': 'Tesla',
    'טסלה': 'Tesla',
    'تيسلا': 'Tesla',
    'lexus': 'Lexus',
    'לקסוס': 'Lexus',
    'لكزس': 'Lexus',
    'subaru': 'Subaru',
    'סובארו': 'Subaru',
    'سوبارو': 'Subaru'
  };

  const normalized = Object.entries(makes).find(([key]) => 
    rawMake.toLowerCase().includes(key)
  );
  return normalized ? normalized[1] : rawMake;
};

const normalizeBodyType = (rawBodyType: string): string => {
  const bodyTypes = {
    'sedan': 'Sedan',
    'סדאן': 'Sedan',
    'سيدان': 'Sedan',
    'suv': 'SUV',
    'רכב שטח': 'SUV',
    'سيارة رياضية متعددة الاستخدامات': 'SUV',
    'truck': 'Truck',
    'משאית': 'Truck',
    'شاحنة': 'Truck',
    'coupe': 'Coupe',
    'קופה': 'Coupe',
    'كوبيه': 'Coupe',
    'convertible': 'Convertible',
    'קבריולה': 'Convertible',
    'كابريوليه': 'Convertible',
    'hatchback': 'Hatchback',
    'הצ\'בק': 'Hatchback',
    'هاتشباك': 'Hatchback',
    'wagon': 'Wagon',
    'סטיישן': 'Wagon',
    'ستيشن': 'Wagon',
    'van': 'Van',
    'ואן': 'Van',
    'فان': 'Van'
  };

  const normalized = Object.entries(bodyTypes).find(([key]) => 
    rawBodyType.toLowerCase().includes(key)
  );
  return normalized ? normalized[1] : rawBodyType;
};

// Dynamically import components
const FindCarByPlate = dynamic(() => import("./findcarbyplate/FindCarByPlate"), { ssr: false });
const HeroSection = dynamic(() => import("../components/NewHero"));
const LookingForCar = dynamic(() => import("../components/comp"));
const FeaturedListingsSection = dynamic(() => import("../components/homeeight/FeaturedListingsSection"));
const SalesAndReviewsSection = dynamic(() => import("../components/homeeight/SalesAndReviewsSection"));

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("HomePage");
  const [activeIndex, setActiveIndex] = useState(0);

  // Get search params with memoization
  const { selectedFuel, selectedYear, selectedManufacturer, selectedLimit, selectedModel } = useMemo(() => ({
    selectedFuel: searchParams.get("fuel") || "",
    selectedYear: searchParams.get("year") || "",
    selectedManufacturer: searchParams.get("manufacturer"),
    selectedLimit: searchParams.get("limit"),
    selectedModel: searchParams.get("model")
  }), [searchParams]);

  // React Query hooks
  const { data: carsData, isLoading: isLoadingCars } = useQuery({
    queryKey: ['cars', selectedManufacturer, selectedModel, selectedYear, selectedFuel, selectedLimit],
    queryFn: () => fetchCars({
            manufacturer: selectedManufacturer || "",
            year: selectedYear ? parseInt(selectedYear, 10) : 0,
            fuel: selectedFuel || "",
            limit: selectedLimit ? parseInt(selectedLimit, 10) : 12,
            model: selectedModel || "",
    }),
    enabled: !!selectedManufacturer || !!selectedModel
  });

  const { data: dealsData } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals
  });

  const { data: articlesData } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles
  });

  const { data: homepageData } = useQuery({
    queryKey: ['homepage'],
    queryFn: fetchHomePageData
  });

  // Transform deals data with memoization
  const listings = useMemo(() => {
    if (!dealsData) return [];
    
    return dealsData.map((product: Deal): Listing => ({
      id: parseInt(product.id),
      mainImage: product.image ? `http://68.183.215.202${product.image[0]?.url}` : "/default-car.png",
      alt: product.name || "Car Image",
      title: product.name,
      miles: product.details?.car.miles || "N/A",
      fuel: normalizeFuelType(product.details?.car.fuel || "Unknown"),
      condition: product.details?.car.condition || "Used",
      transmission: product.details?.car.transmission || "Unknown",
      details: product.details?.car.transmission || "Unknown",
      price: `$${product.price.toLocaleString()}`,
      mileage: product.details?.car.miles || "N/A",
      year: product.details.car.year,
      fuelType: normalizeFuelType(product.details?.car.fuel || "Unknown"),
      make: normalizeMake(product.details?.car.make || "Unknown"),
      bodyType: normalizeBodyType(product.details?.car.body_type || "Unknown"),
      description: product.details.car.description,
      features: product.details.car.features.map((feature) => feature.value) || [],
      category: product.categories ? product.categories.split(",").map((c) => c.toLowerCase().trim()) : [],
    }));
  }, [dealsData]);

  // Transform articles data with memoization
  const transformedArticles = useMemo(() => {
    if (!articlesData?.featuredData?.data) return [];
    
    return articlesData.featuredData.data.map((article: Article) => ({
      id: article.id,
      title: article.title || '',
      excerpt: article.excerpt || '',
      imageUrl: article.cover ? article.cover.url : '',
      category: article.categories?.map((category) => category.name).join(', ') || '',
      date: new Date(article.publishedAt).toLocaleDateString() || '',
      author: article.author || '',
      description: article.description || '',
      cover: article.cover || null,
      categories: article.categories || [],
      publishedAt: article.publishedAt || '',
      locale: article.locale || 'en',
      slug: article.slug || '',
      blocks: article.blocks || []
    }));
  }, [articlesData]);

  // Memoized filter change handler
  const handleFilterChange = useCallback((title: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(title, value);
    } else {
      params.delete(title);
    }
    router.push(`/carsearch?${params.toString()}`);
  }, [router]);

  // Memoized data for LookingForCar component
  const lookingForCarData = useMemo(() => [
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
  ], [t]);
  
  return (
    <main className="items-center justify-center w-full overflow-hidden pt-12 ">
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
                setSelectedFuel={(selectedFuel: string) => {
                  handleFilterChange("fuel", selectedFuel);
                }}
                setSelectedYear={(selectedYear: string) => {
                  handleFilterChange("year", selectedYear);
                }}
                handleFilterChange={handleFilterChange}
              />
            </div>
          )}
        </motion.div>
      </div>
      {/* Loading State */}
      {isLoadingCars && activeIndex === 2 ? (
        <div className="text-center text-xl ">{t("loading_cars")}</div>
      ) : !carsData?.length ? (
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
          <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative">
            {carsData.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <ShowMore
            pageNumber={parseInt(selectedLimit || "12", 10) / 12}
            isNext={parseInt(selectedLimit || "12", 10) > carsData.length}
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
        <RecentlyAddedSection 
                listings={listings.filter((listing) => listing)} 
                title="Featured Cars" 
                viewAllLink="/cars"
              />

             {/* latest blog posts section */}
     {/* Category Navigation */}
     <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm">


              {/* Breaking News Section */}
              <div className="my-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-red-600 ml-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">اخر الاخبار</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                  {transformedArticles.map((article) => (
                    article.category.includes('featured') && (
                      <Link href={`/news/${article.slug}`} key={article.id} className="group block">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                          <div className="aspect-[16/9] overflow-hidden">
                            <Img
                              src={`http://68.183.215.202${article.imageUrl}`}
                              alt={article.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              width={1290}
                              height={2040}
                              external={true}
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center mb-3">
                              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                {article.category}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{article.date}</span>
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {article.title}
              </h2>
                            <p className="text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium">{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  ))}
                </div>
                </div>
          </div>



      {/* featured listings section */}
      <FeaturedListingsSection listings={listings} initialFavorites={[]} />

      {/* sales and reviews section */}
      <SalesAndReviewsSection />
      {/* recently added section */}
      <RecentlyAddedSection listings={listings} />

      {/* customer testimonials section */}
      {/* <CustomerTestimonialsSection /> */}
        <div className="justify-center pt-8 gap-6 flex-col flex md:flex-row bg-white">
        <div className="justify-center pt-8 gap-6 flex-col flex md:flex-row">
          {lookingForCarData.map(({ title, text, buttonColor, backgroundColor,icon, buttonTextColor, textColor }, index) => (
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



    </main>
  );
}

export default function HomePage() {
  return (
      <HomeContent />
  );
}


      // {/* Blogs Section */}
      // <div className="titleParent w-full max-w-screen-lg mx-auto overflow-x-hidden px-4">
      //   <div className="titleParent w-full max-w-screen-xl mx-auto overflow-x-hidden px-6">
      //     <div className="title w-full text-center">
      //       <div className="titleChild" />
      //       <div className="featuredWrapper">
      //         <div className="featured text-2xl font-bold">
      //           {t("blogs_heading")}
      //         </div>
      //       </div>
      //     </div>

      //     <div className="blogParent flex flex-wrap justify-center gap-6">
      //       <div className="blog">
      //         <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
      //           <Image
      //             className="frameChild w-full h-auto object-cover"
      //             width={300}
      //             height={250}
      //             alt={t("porsche_alt")}
      //             src="/hero.png"
      //           />
      //           <div className="findYourPlaceWithWrapper text-center">
      //             <div className="findYourPlace text-lg font-medium">
      //               {t("blog1_title")}
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="blog">
      //         <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
      //           <Image
      //             className="frameChild w-full h-auto object-cover"
      //             width={500}
      //             height={350}
      //             alt={t("toyota_alt")}
      //             src="/hero.png"
      //           />
      //           <div className="findYourPlaceWithWrapper p-4 text-center">
      //             <div className="findYourPlace text-lg font-medium">
      //               {t("blog2_title")}
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="blog">
      //         <div className="rectangleParent shadow-md rounded-lg overflow-hidden">
      //           <Image
      //             className="frameChild w-full h-auto object-cover"
      //             width={500}
      //             height={350}
      //             alt={t("kia_alt")}
      //             src="/hero.png"
      //           />
      //           <div className="findYourPlaceWithWrapper p-4 text-center">
      //             <div className="findYourPlace text-lg font-medium">
      //               {t("blog3_title")}
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div> */}