import { CarProps, FilterProps } from "../types";

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, limit, fuel } = filters;
 
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
    console.log(result);
      return result;
    
  } catch (error) {
    console.error(error);
      return ;
    
  }

}

export function generateCarImageUrl(car: CarProps, angle: string = "front") {
  if (!car) {
    console.error("Error: Car object is missing.");
    return "";
  }

  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, year, model } = car;

  if (!make || !model || !year) {
    console.error("Error: Car object is missing essential details.", car);
    return "";
  }

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

  console.log("Generated Image URL:", url.toString());

  return url.toString();
}


export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;

  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

export const updateSearchParams = (type: string, value: string) => {
  const searchParms = new URLSearchParams(window.location.search);

  searchParms.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParms.toString()}`;

  return newPathname;
};

