"use client";
import React from "react";

import MegaMenu1 from "../MegaMenu1";
import Link from "next/link";
import { Button } from "../Button/index";
import { Img } from "../Img/index";
import { Text } from "../Text/index";

interface Props {
  className?: string;
}

export default function Header({ ...props }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuOpen1, setMenuOpen1] = React.useState(false);
  const [menuOpen2, setMenuOpen2] = React.useState(false);
  const [menuOpen3, setMenuOpen3] = React.useState(false);

  return (
    <header {...props} className={`${props.className} flex justify-between items-center gap-5 relative `}>
      <Img
        src="img_header_logo.svg"
        width={108}
        height={26}
        alt="Header Logo`"
        className="h-[26px] w-[108px] object-contain "
      />
      <div className="flex items-center md:flex-col ">
        <ul className="flex items-center gap-[38px] sm:flex-col">
          <li
            onMouseLeave={() => {
              setMenuOpen(false);
            }}
            onMouseEnter={() => {
              setMenuOpen(true);
            }}
          >
            <div className="flex cursor-pointer items-center gap-1.5 py-2.5">
              <Text as="p" className="text-[15px] font-medium capitalize !text-white-a700">
                Home{" "}
              </Text>
              <div className="white_A700_black_900_00_border mt-2 h-[4px] w-[8px] border-l-4 border-r-4 border-t-4 border-solid" />
            </div>
            {menuOpen ? <MegaMenu1 /> : null}
          </li>
          <li
            onMouseLeave={() => {
              setMenuOpen1(false);
            }}
            onMouseEnter={() => {
              setMenuOpen1(true);
            }}
          >
            <div className="flex cursor-pointer items-center gap-1.5">
              <Text as="p" className="text-[15px] font-medium capitalize !text-white-a700">
                Listings{" "}
              </Text>
              <Img
                src="img_border.png"
                width={8}
                height={4}
                alt="Border"
                className="mt-1.5 h-[4px] w-[8px] object-cover"
              />
            </div>
            {menuOpen1 ? <MegaMenu1 /> : null}
          </li>
          <li
            onMouseLeave={() => {
              setMenuOpen2(false);
            }}
            onMouseEnter={() => {
              setMenuOpen2(true);
            }}
          >
            <div className="flex cursor-pointer items-center gap-1.5 ">
              <Text as="p" className="text-[15px] font-medium capitalize !text-white-a700">
                Blog{" "}
              </Text>
              <div className="white_A700_black_900_00_border mt-1.5 h-[4px] w-[8px] border-l-4 border-r-4 border-t-4 border-solid" />
            </div>
            {menuOpen2 ? <MegaMenu1 /> : null}
          </li>
          <li
            onMouseLeave={() => {
              setMenuOpen3(false);
            }}
            onMouseEnter={() => {
              setMenuOpen3(true);
            }}
          >
            <div className="flex cursor-pointer items-center gap-1.5">
              <Text as="p" className="text-[15px] font-medium capitalize !text-white-a700">
                Pages{" "}
              </Text>
              <div className="white_A700_black_900_00_border mt-1.5 h-[4px] w-[8px] border-l-4 border-r-4 border-t-4 border-solid" />
            </div>
            {menuOpen3 ? <MegaMenu1 /> : null}
          </li>
          <li>
            <Link href="#">
              <Text as="p" className="text-[15px] font-medium capitalize !text-white-a700">
                About
              </Text>
            </Link>
          </li>
          <li>
            <Link href="#">
              <Text as="p" className="text-[15px] font-medium capitalize !text-white-a700">
                Contact
              </Text>
            </Link>
          </li>
        </ul>
        <Img
          src="img_icon.svg"
          width={14}
          height={14}
          alt="Icon"
          className="ml-7 mt-3 h-[14px] self-start md:ml-0 md:w-full"
        />
        <Text as="p" className="ml-2.5 text-[15px] font-medium !text-white-a700 md:ml-0">
          Sign in
        </Text>
        <Button
          size="4xl"
          className="ml-[38px] min-w-[152px] rounded-[22px] border border-solid border-white-a700 px-[23px] font-medium md:ml-0 sm:px-4"
        >
          Submit Listing
        </Button>
      </div>
    </header>
  );
}
export { Header };
