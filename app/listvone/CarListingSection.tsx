
import { Button } from "../../components/Button";
import { Img } from "../../components/Img";
import ListVOneArticle from "../../components/ListVOneArticle";
import React, { Suspense } from "react";

const carDetailsGrid = [
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Toyota Camry New",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$40,000",
    viewDetails: "View Details",
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "C-Class – 2023",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$150,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car14_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        4.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20miles: "50 Miles",
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Ford Transit – 2021",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Diesel",
    automatic: "Manual",
    p40000: "$22,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car13_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        4.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20miles: "2500 Miles",
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Low Mileage",
    toyotaCamryNew: "New GLC – 2023",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$95,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car19_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        4.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Audi A6 3.5 – New",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$58,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car12_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Toyota Camry New",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$250,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car17_660x440_jpg.png",
    p35d5powerpulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Sale",
    toyotaCamryNew: "Ranger Black – 2021",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Manual",
    p40000: "$180,000",
    viewDetails: "$165,000",
    car8660x440jpg: "img_car11_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        2.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20miles: "250 Miles",
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Toyota Camry New",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$40,000",
    viewDetails: "$35,000",
    car8660x440jpg: "img_car6_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        2.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Low Mileage",
    toyotaCamryNew: "Toyota Camry New",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "Automatic",
    p40000: "$25,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car3_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        2.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "T-Cross – 2023",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "CVT",
    p40000: "$15,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car9_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        4.0 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20miles: "15 Miles",
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Corolla Altis – 2023",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Petrol",
    automatic: "CVT",
    p40000: "$45,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car5_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20miles: "15000 Miles",
  },
  {
    car8660x440Jpg: "img_car8_660x440_jpg.png",
    link: "Great Price",
    toyotaCamryNew: "Toyota Camry New",
    p35D5PowerPulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20Miles: "20 Miles",
    petrol: "Diesel",
    automatic: "CVT",
    p40000: "$35,000",
    viewDetails: "View Details",
    car8660x440jpg: "img_car1_660x440_jpg_218x326.png",
    p35d5powerpulse: (
      <>
        3.5 D5 PowerPulse Momentum 5dr AW…
        <br />
        Geartronic Estate
      </>
    ),
    p20miles: "10 Miles",
  },
];

export default function CarListingSection() {
  return (
    <>
      {/* car listing section */}
      <div className="mb-[30px] mt-[54px] flex flex-col items-center">
        <div className="container-xs flex flex-col items-center gap-[60px] lg:px-5 md:px-5 sm:gap-[30px]">
          <div className="grid grid-cols-4 justify-center gap-[30px] self-stretch lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            <Suspense fallback={<div>Loading feed...</div>}>
              {carDetailsGrid.map((d, index) => (
                <ListVOneArticle {...d} key={"group9135" + index} />
              ))}
            </Suspense>
          </div>
          <div className="flex w-[10%] justify-center gap-2 lg:w-full md:w-full">
            <Button
              size="2xl"
              shape="round"
              className="min-w-[40px] rounded-[18px] border border-solid border-black-900 px-[15px] font-medium"
            >
              1
            </Button>
            <Button size="2xl" className="min-w-[40px] rounded-[18px] px-3.5 font-medium">
              2
            </Button>
            <div className="flex flex-1 justify-center rounded-[18px] border border-solid border-gray-200 bg-gray-50_01 p-3">
              <Img
                src="img_arrow_right_black_900_1.svg"
                width={10}
                height={12}
                alt="Arrow Right"
                className="h-[12px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
