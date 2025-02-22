import React from "react";

const shapes = {
  circle: "rounded-[50%]",
  round: "rounded-[14px]",
} as const;
const variants = {
  fill: {
    black_900: "bg-black-900 text-white-a700",
    white_A700: "bg-white-a700 text-black-900",
    light_blue_500: "bg-light_blue-500 text-white-a700",
    white_A700_6c: "bg-white-a700_6c",
    gray_50: "bg-gray-50",
    indigo_A400_11: "bg-indigo-a400_11",
    indigo_A400: "bg-indigo-a400 text-white-a700",
    green_700: "bg-green-700 text-white-a700",
  },
  outline: {
    indigo_A400: "border-indigo-a400 border border-solid text-indigo-a400",
    white_A700: "border-white-a700 border border-solid text-white-a700",
  },
} as const;
const sizes = {
  "13xl": "h-[78px] px-6 text-[15px]",
  "6xl": "h-[54px] px-4",
  "9xl": "h-[60px] pl-6 pr-[34px] text-[12px]",
  "10xl": "h-[62px] px-[34px] text-[15px]",
  "12xl": "h-[72px] px-[30px] text-[34px]",
  "3xl": "h-[42px] px-[30px] text-[15px]",
  md: "h-[30px] px-2",
  "11xl": "h-[70px] px-[18px]",
  "5xl": "h-[50px] px-[30px] text-[15px]",
  xs: "h-[24px] px-1.5",
  "8xl": "h-[58px] px-[26px] text-[15px]",
  "4xl": "h-[46px] px-6 text-[15px]",
  lg: "h-[34px] px-3.5 text-[14px]",
  "7xl": "h-[54px] px-[34px] text-[15px]",
  "2xl": "h-[40px] px-3",
  sm: "h-[28px] px-3.5 text-[14px]",
  xl: "h-[36px] px-3",
} as const;

type ButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: () => void;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "xl",
  color = "white_A700",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${shape && shapes[shape]} ${size && sizes[size]} ${variant && variants[variant]?.[color as keyof (typeof variants)[typeof variant]]}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

export { Button };
