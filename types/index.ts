import { MouseEventHandler } from "react";

export interface CustomButtonProps {
  title: string;
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
  textStyles?: string;
  rightIcon?: string;
  isDisabled?: boolean;
}

export interface SearchManufacturerProps {
  manufacturer: string;
  setManufacturer: (manufacturer: string) => void;
}

export interface CarProps {
  mainImage: string;
  alt: string;
  title: string;
  miles: string | number;
  condition: string;
  details: string;
  price: string;
  mileage: string | number;
  category: string[];
  id: number;
  make: string;
  model: string;
  year: number;
  fuel: string;
  city_mpg: number;
  transmission: string;
  drive: string;
  class?: string; // Make properties optional if not necessary
  combination_mpg?: number;
  cylinders?: number;
  displacement?: number;
}

export interface FilterProps {
  manufacturer?: string;
  year?: number;
  model?: string;
  limit?: number;
  fuel?: string;
}

export interface OptionProps {
  title: string;
  value: string;
}


interface CustomFilterProps {
  title: string;
  options: { title: string; value: string }[];
  selected: string;
  onChange: (value: string) => void; // Ensure onChange is defined
}


export interface ShowMoreProps {
  pageNumber: number;
  isNext: boolean;
}


