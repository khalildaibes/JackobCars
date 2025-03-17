import { notFound } from "next/navigation";
import { fetchStrapiData } from "../../lib/strapiClient";
import ProductClient from "./ProductsClient";
import React from "react";

interface Product {
    id: string;
    name: string;
    slug: string;
    quantity: number;
    price: number;
    categories?: { id: number; name: string }[]; // Categories from Strapi
    image: { url: string }[]; // Image array for localization
    details: {
      car: {
        cons: string[]; // List of disadvantages
        pros: string[]; // List of advantages
        fuel: string; // Fuel type
        year: number; // Car manufacturing year
        miles: string; // Mileage
        price: number; // Car price
        badges: { color: string; label: string; textColor: string }[]; // Strapi badges
        images: {
          main: string;
          additional: string[];
        };
        actions: {
          save: { icon: string; label: string };
          share: { icon: string; label: string };
          compare: { icon: string; label: string };
        };
        mileage: string; // Fuel efficiency
        features: { icon: string; label: string; value: string }[];
        transmission: string;
        dimensions_capacity: { label: string; value: string }[];
        engine_transmission_details: { label: string; value: string }[];
      };
    };
    video?: { url: string }[];
    colors?: { name: string; quantity: number }[];
  }
  

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const productData = await fetchStrapiData(`/products`, {
      filters: { categories: { $includes: "new" } },
      populate: "*",
      locale:"en"
    });

    if (!productData?.data?.length) return notFound(); // If no product, return 404

    const product = productData.data[0];
    console.log("product",product)

    return <ProductClient product={product} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}
