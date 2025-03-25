"use client"; // This marks the component as a Client Component

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import SalesAndReviewsSection from "../components/homeeight/SalesAndReviewsSection";
import CustomerTestimonialsSection from "../components/homeeight/CustomerTestimonialsSection";
import FeaturedListingsSection from "../components/homeeight/FeaturedListingsSection";
import LatestBlogPostsSection from "../components/homeeight/LatestBlogPostsSection";
import RecentlyAddedSection from "../components/homeeight/RecentlyAddedSection";
import {  useTranslations } from "next-intl";
import ResponsiveNewsLayout from "../components/Responsivenews";
import HeroSection from "../components/NewHero";
import LookingForCar from "../components/comp";
import SearchBar from "../components/SearchBar";
import { Img } from "../components/Img";
import Link from "next/link";

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
    

      const response = await fetch(`/api/deals`);
      if (!response.ok) throw new Error(`Failed to fetch homepage: ${response.statusText}`);
  
      const data = await response.json();
      if (!data || !data.data) throw new Error("Invalid API response structure");
  
  

  
      console.log("Fetched Products:",  data);
      // Transform the fetched data into the required listings format
      const formattedListings = data.data.map((product: any) => {
        // Get the fuel type and normalize it
        const rawFuelType = product.details?.car.fuel || "Unknown";
        let normalizedFuelType = rawFuelType;
        
        // Normalize fuel type values to English
        if (rawFuelType.toLowerCase().includes("plug-in") || 
            rawFuelType.toLowerCase().includes("plug in") || 
            rawFuelType === "היברידי נטען" ||
            rawFuelType === "هجين قابل للشحن") {
          normalizedFuelType = "Plug-in Hybrid";
        } else if (rawFuelType.toLowerCase().includes("hybrid") || 
                  rawFuelType === "היברידי" ||
                  rawFuelType === "هجين") {
          normalizedFuelType = "Hybrid";
        } else if (rawFuelType.toLowerCase().includes("electric") || 
                  rawFuelType === "חשמלי" ||
                  rawFuelType === "كهربائي") {
          normalizedFuelType = "Electric";
        } else if (rawFuelType.toLowerCase().includes("diesel") || 
                  rawFuelType === "דיזל" ||
                  rawFuelType === "ديزل") {
          normalizedFuelType = "Diesel";
        } else if (rawFuelType.toLowerCase().includes("gasoline") || 
                  rawFuelType.toLowerCase().includes("petrol") || 
                  rawFuelType === "בנזין" ||
                  rawFuelType === "بنزين") {
          normalizedFuelType = "Gasoline";
        }

        // Normalize make values to English
        const rawMake = product.details?.car.make || "Unknown";
        let normalizedMake = rawMake;
        
        // Normalize make values to English
        if (rawMake.toLowerCase().includes("toyota") || rawMake === "טויוטה" || rawMake === "تويوتا") {
          normalizedMake = "Toyota";
        } else if (rawMake.toLowerCase().includes("honda") || rawMake === "הונדה" || rawMake === "هوندا") {
          normalizedMake = "Honda";
        } else if (rawMake.toLowerCase().includes("ford") || rawMake === "פורד" || rawMake === "فورد") {
          normalizedMake = "Ford";
        } else if (rawMake.toLowerCase().includes("chevrolet") || rawMake === "שברולט" || rawMake === "شيفروليه") {
          normalizedMake = "Chevrolet";
        } else if (rawMake.toLowerCase().includes("bmw") || rawMake === "ב.מ.וו" || rawMake === "بي ام دبليو") {
          normalizedMake = "BMW";
        } else if (rawMake.toLowerCase().includes("mercedes") || rawMake === "מרצדס" || rawMake === "مرسيدس") {
          normalizedMake = "Mercedes-Benz";
        } else if (rawMake.toLowerCase().includes("audi") || rawMake === "אאודי" || rawMake === "أودي") {
          normalizedMake = "Audi";
        } else if (rawMake.toLowerCase().includes("tesla") || rawMake === "טסלה" || rawMake === "تيسلا") {
          normalizedMake = "Tesla";
        } else if (rawMake.toLowerCase().includes("lexus") || rawMake === "לקסוס" || rawMake === "لكزس") {
          normalizedMake = "Lexus";
        } else if (rawMake.toLowerCase().includes("subaru") || rawMake === "סובארו" || rawMake === "سوبارو") {
          normalizedMake = "Subaru";
        }

        // Normalize body type values to English
        const rawBodyType = product.details?.car.body_type || "Unknown";
        let normalizedBodyType = rawBodyType;
        
        // Normalize body type values to English
        if (rawBodyType.toLowerCase().includes("sedan") || rawBodyType === "סדאן" || rawBodyType === "سيدان") {
          normalizedBodyType = "Sedan";
        } else if (rawBodyType.toLowerCase().includes("suv") || rawBodyType === "רכב שטח" || rawBodyType === "سيارة رياضية متعددة الاستخدامات") {
          normalizedBodyType = "SUV";
        } else if (rawBodyType.toLowerCase().includes("truck") || rawBodyType === "משאית" || rawBodyType === "شاحنة") {
          normalizedBodyType = "Truck";
        } else if (rawBodyType.toLowerCase().includes("coupe") || rawBodyType === "קופה" || rawBodyType === "كوبيه") {
          normalizedBodyType = "Coupe";
        } else if (rawBodyType.toLowerCase().includes("convertible") || rawBodyType === "קבריולה" || rawBodyType === "كابريوليه") {
          normalizedBodyType = "Convertible";
        } else if (rawBodyType.toLowerCase().includes("hatchback") || rawBodyType === "הצ'בק" || rawBodyType === "هاتشباك") {
          normalizedBodyType = "Hatchback";
        } else if (rawBodyType.toLowerCase().includes("wagon") || rawBodyType === "סטיישן" || rawBodyType === "ستيشن") {
          normalizedBodyType = "Wagon";
        } else if (rawBodyType.toLowerCase().includes("van") || rawBodyType === "ואן" || rawBodyType === "فان") {
          normalizedBodyType = "Van";
        }

        return {
          id: product.id,
              mainImage: product.image ? `http://68.183.215.202${product.image[0]?.url}` : "/default-car.png",
              alt: product.name || "Car Image",
              title: product.name,
              miles: product.details?.car.miles || "N/A",
              fuel: normalizedFuelType,
              condition: product.details?.car.condition || "Used",
              transmission: product.details?.car.transmission || "Unknown",
              details: product.details?.car.transmission || "Unknown",
              price: `$${product.price.toLocaleString()}`,
              mileage: product.details?.car.miles || "N/A",
              year: product.details.car.year,
              fuelType: normalizedFuelType,
              make: normalizedMake,
              bodyType: normalizedBodyType,
              description: product.details.car.description,
              features: product.details.car.features.map((feature: any) => feature.value) || [],
              category: product.categories ? product.categories.split(",").map((c: string) => c.toLowerCase().trim()) : [],
        };
      });
      
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

  interface Article {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    date: string;
    author: string;
    description: string;
    cover: any;
    categories: any[];
    publishedAt: string;
    locale: string;
    slug: string;
    blocks: any[];
  }

  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const featuredResponse = await fetch('/api/articles?limit=3');
        const featuredData = await featuredResponse.json();
        
        const newsResponse = await fetch('/api/articles?limit=5');
        const newsData = await newsResponse.json();

        const storyResponse = await fetch('/api/articles?limit=8');
        const storyData = await storyResponse.json();

        if (!featuredData.data || !newsData.data || !storyData.data) {
          throw new Error('Invalid data format received from API');
        }
        console.log(newsData.data[0].cover);

        const transformArticle = (article: any) => ({
          id: article.id,
          title: article.title || '',
          excerpt: article.excerpt || '',
          imageUrl: article.cover ? article.cover.url : '',
          category: article.categories?.map((category: any) => category.name).join(', ') || '',
          date: new Date(article.publishedAt).toLocaleDateString() || '',
          author: article.author || '',
          description: article.description || '',
          cover: article.cover || null,
          categories: article.categories || [],
          publishedAt: article.publishedAt || '',
          locale: article.locale || 'en',
          slug: article.slug || '',
          blocks: article.blocks || []
        });
        const transformedFeatured = featuredData.data.map(transformArticle);
        const transformedNews = newsData.data.map(transformArticle);
        const transformedStories = storyData.data.map(transformArticle);

        setFeaturedArticles(transformedFeatured);


        // Extract unique categories
        const allCategories = new Set<string>();
        [...transformedFeatured, ...transformedNews, ...transformedStories].forEach(article => {
          if (article.category) {
            article.category.split(', ').forEach(cat => allCategories.add(cat));
          }
        });

        console.log(allCategories);

      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
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
          <div className="text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative">
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
             {/* latest blog posts section */}
     {/* Category Navigation */}
     <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm">


              {/* Breaking News Section */}
              <div className="my-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-red-600 ml-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">عاجل</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                  {featuredArticles.map((article) => (
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