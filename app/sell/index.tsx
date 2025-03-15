"use client"; // This marks the component as a Client Component

import FeaturedListingsSection from "@/components/homeeight/FeaturedListingsSection";
import Sales2 from "../../components/Sales2";
import React, { useEffect, useState } from "react";

// Example Car Data
const carData = [
  { id: 1, category: "Sedan", image: "img_background_392x684.png", title: "Toyota Camry 2020", price: 20000, fuel: "Petrol", transmission: "Automatic" },
  { id: 2, category: "SUV", image: "img_car8_660x440_jpg.png", title: "Honda CR-V 2019", price: 28000, fuel: "Petrol", transmission: "Automatic" },
  { id: 3, category: "Truck", image: "img_car5_660x440_jpg_1.png", title: "Ford F-150 2021", price: 35000, fuel: "Diesel", transmission: "Manual" },
  { id: 4, category: "Coupe", image: "img_car19_660x440_jpg_218x326.png", title: "BMW M4 2022", price: 60000, fuel: "Petrol", transmission: "Automatic" },
  { id: 5, category: "Convertible", image: "img_h10_jpg.png", title: "Mazda MX-5 2021", price: 30000, fuel: "Petrol", transmission: "Manual" },
  { id: 6, category: "SUV", image: "img_h72_jpg.png", title: "Toyota Highlander 2023", price: 45000, fuel: "Hybrid", transmission: "Automatic" },
  { id: 7, category: "Sedan", image: "img_h93_jpg.png.png", title: "Mercedes-Benz C-Class 2020", price: 42000, fuel: "Diesel", transmission: "Automatic" },
  { id: 8, category: "Hatchback", image: "img_h70_jpg.png", title: "Volkswagen Golf 2019", price: 18000, fuel: "Petrol", transmission: "Manual" },
  { id: 9, category: "Coupe", image: "img_h91_jpg.png.png", title: "Audi TT 2020", price: 40000, fuel: "Petrol", transmission: "Automatic" },
  { id: 10, category: "Truck", image: "img_blog3_gqcqjcnfx.png", title: "Chevrolet Silverado 2021", price: 38000, fuel: "Diesel", transmission: "Automatic" },
  { id: 11, category: "Convertible", image: "hero.png", title: "Porsche 911 Cabriolet 2022", price: 120000, fuel: "Petrol", transmission: "Automatic" },
  { id: 12, category: "Sedan", image: "img_blog5_gqcqjcnfx.png", title: "Honda Accord 2022", price: 27000, fuel: "Hybrid", transmission: "Automatic" },
];

const breadcrumbLinks = [
  { label: "Home", href: "/" },
  { label: "Cars for Sale", href: "/cars" },
];

export default function ShoppagePage() {
  
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
    return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="mt-[5%]">
              <FeaturedListingsSection listings={listings} initialFavorites={[]} />
      </div>
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Sales2 carGrid={carData} breadcrumbLinks={breadcrumbLinks} pageTitle="Cars for Sale" />
      </div>
    </div>
  );
}
