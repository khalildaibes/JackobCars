"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import Image

import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import { Menu, X } from "../node_modules/lucide-react";
export default function Navbar() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const [selectedFuel, setSelectedFuel] = useState(searchParams.get("fuel") || "");
  // const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle for mobile menu

  // const handleFilterChange = (title: string, value: string) => {
  //   const params = new URLSearchParams(window.location.search);
  //   if (value) {
  //     params.set(title, value);
  //   } else {
  //     params.delete(title);
  //   }
  //   router.push(`/carsearch?${params.toString()}`);
  // };

  return (
    <nav className="fixed  w-full bg-white shadow-md p-3 flex items-center justify-center gap-[25px] z-50  ">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
  <div className="lg:w-full w-[200px] h-20 flex items-center justify-center rounded-full shadow-lg md:shadow-xl  bg-white p-2 md:p-3">
    <Image src="/logo.svg" alt="JackobCar's Logo" width={200} height={200} className="object-fill" />
  </div>
</Link>

{/* Mobile Menu Button */}
<button className="md:hidden text-gray-700  " 
  onClick={() => setIsMenuOpen(!isMenuOpen)}>
  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
</button>


      {/* Nav Links (Hidden on mobile, shown when menu is open) */}
      <div
        className={`${
          isMenuOpen ? "flex top-16 " : "hidden "
        } md:flex flex-col md:flex-row gap-4   left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:w-[40%] sm:w-[40%] md:p-0 transition-all `}
      >
        <Link href="/sell"  onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl ">Sell Cars</button>
        </Link>
        <Link href="/findcarbyplate" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">Find Cars By Plate number</button>
        </Link>
        <Link href="/news" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <button className="bg-red-500 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">News</button>
        </Link>
        <Link href="/accessories" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">Car Accessories</button>
        </Link>
        <Link href="/comparison" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full w-full md:w-auto shadow-lg md:shadow-xl">Compare Cars</button>
        </Link>
      </div>

      {/* Search & Filters (Hidden in mobile menu for now) */}
      {/* <div className="hidden md:flex items-center space-x-4">
        <SearchBar />
      </div> */}


    <LanguageSwitcher />
    </nav>
  );
}
