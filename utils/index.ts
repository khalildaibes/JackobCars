import { CarProps, FilterProps } from "../types";
import { getCachedData, setCachedData } from "./cacheUtils";

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, limit, fuel } = filters;
  
  // Create a unique cache key based on the filters
  const cacheKey = `cars:${manufacturer}:${year}:${model}:${limit}:${fuel}`;
  
  // Try to get cached data first
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
 
  try {
    const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&fuel_type=${fuel}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '9e3e82b628msh0bc3661f2c463f5p128b1ajsn0ffd661be4b8',
        'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
      }
    };
  
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Cache the result for 1 hour
    await setCachedData(cacheKey, result, 60 * 60);
    
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function generateCarImageUrl(car: CarProps, angle: string = "front") {
  if (!car) {
    console.error("Error: Car object is missing.");
    return "";
  }

  const { make, year, model } = car;

  if (!make || !model || !year) {
    console.error("Error: Car object is missing essential details.", car);
    return "";
  }

  // Create a cache key for the image URL
  const cacheKey = `car-image:${make}:${model}:${year}:${angle}`;
  
  // Try to get cached URL first
  const cachedUrl = getCachedData(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  const url = new URL("https://cdn.imagin.studio/getimage");
  const apiKey = process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "";
  
  if (!apiKey) {
    console.warn("Warning: Missing NEXT_PUBLIC_IMAGIN_API_KEY");
  }

  url.searchParams.append("customer", apiKey);
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model?.split(" ")[0] || "");
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", angle);

  const imageUrl = url.toString();
  
  // Cache the URL for 24 hours
  setCachedData(cacheKey, imageUrl, 60 * 60 * 24);

  return imageUrl;
}


export const calculateCarRent = (city_mpg: number, year: number) => {
  // Create a cache key for the rental calculation
  const cacheKey = `car-rent:${city_mpg}:${year}`;
  
  // Try to get cached result first
  const cachedResult = getCachedData(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;

  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;
  const result = rentalRatePerDay.toFixed(0);

  // Cache the result for 1 hour
  setCachedData(cacheKey, result, 60 * 60);

  return result;
};

export const updateSearchParams = (type: string, value: string) => {
  const searchParms = new URLSearchParams(window.location.search);

  searchParms.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParms.toString()}`;

  return newPathname;
};

