import Sales2 from "../../components/Sales2";
import React from "react";

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
  return (
    <div className="relative w-full content-center lg:h-auto md:h-auto">
      <div className="w-full overflow-x-scroll bg-white-a700">
        <Sales2 carGrid={carData} breadcrumbLinks={breadcrumbLinks} pageTitle="Cars for Sale" />
      </div>
    </div>
  );
}
