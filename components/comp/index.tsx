import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface LookingForCarProps {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  title: string;
  text: string;
  icon: string;
  variant: 'sell' | 'buy';
}

const LookingForCar: React.FC<LookingForCarProps> = ({
  backgroundColor,
  textColor,
  buttonColor,
  buttonTextColor,
  text,
  icon,
  title,
  variant
}) => {
  return (
    <div
      className={`relative w-full sm:w-[500px] h-[280px] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
        variant === 'sell' ? 'border-2 border-blue-200' : 'border-2 border-blue-100'
      }`}
      style={{ backgroundColor }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${variant === 'sell' ? 'text-blue-800' : 'text-blue-600'}`}>
            {title}
          </h2>
          <p className="text-sm sm:text-base opacity-90" style={{ color: textColor }}>
            {text}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          variant === 'sell' ? 'bg-blue-200' : 'bg-blue-100'
        }`}>
          <Image
            src={icon}
            alt={variant === 'sell' ? 'Sell car icon' : 'Buy car icon'}
            width={24}
            height={24}
            className={`${variant === 'sell' ? 'text-blue-800' : 'text-blue-600'}`}
          />
        </div>
      </div>

      <button
        className={`mt-4 px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
          variant === 'sell' 
            ? 'bg-blue-800 hover:bg-blue-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        style={{ color: buttonTextColor }}
      >
        {variant === 'sell' ? 'List Your Car' : 'Browse Cars'}
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${
        variant === 'sell' ? 'bg-blue-800' : 'bg-blue-600'
      }`} /> */}
    </div>
  );
};

export default LookingForCar;
