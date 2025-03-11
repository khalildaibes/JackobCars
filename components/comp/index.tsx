import React from "react";
import Image from "next/image";

interface LookingForCarProps {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  title:string;
  text: string;
  icon:string
}

const LookingForCar: React.FC<LookingForCarProps> = ({
  backgroundColor,
  textColor,
  buttonColor,
  buttonTextColor,
  text,
  icon,
  title
}) => {
  return (
    <div
      className="relative w-full sm:w-[685px] h-[393.72px] rounded-lg p-6 sm:p-10 flex flex-col justify-center"
      style={{ backgroundColor }}
    >
      <h2 className="text-[24px] sm:text-[30px] font-bold" style={{ color: textColor }}>
        {title}
        
      </h2>
      <p className="text-[14px] sm:text-[15px] mt-4" style={{ color: textColor }}>
      {text}

      </p>
      <button
        className="mt-6 px-6 py-3 rounded-lg flex items-center"
        style={{ backgroundColor: buttonColor, color: buttonTextColor }}
      >
        Get Started
        <svg
          className="ml-2"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5526 0.505005H5.99698C5.78202 0.505005 5.60808 0.678948 5.60808 0.893906C5.60808 1.10886 5.78202 1.28281 5.99698 1.28281H13.6138L1.05535 13.8412C0.903426 13.9931 0.903426 14.2392 1.05535 14.3911C1.13129 14.467 1.23082 14.505 1.33032 14.505C1.42981 14.505 1.52931 14.467 1.60529 14.3911L14.1637 1.8327V9.44948C14.1637 9.66444 14.3376 9.83838 14.5526 9.83838C14.7676 9.83838 14.9415 9.66444 14.9415 9.44948V0.893906C14.9415 0.678948 14.7675 0.505005 14.5526 0.505005Z"
            fill="white"
          />
        </svg>
      </button>
      <div className="absolute bottom-4 right-4">
      </div>
    </div>
  );
};

export default LookingForCar;
