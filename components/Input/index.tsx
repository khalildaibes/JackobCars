"use client";
import React from "react";

const shapes = {
  round: "rounded-[16px]",
} as const;

const variants = {
  outline: {
    gray_200: "border-gray-200 border border-solid text-black-900",
  },
  fill: {
    white_A700: "bg-white-a700 text-black-900",
    indigo_500: "bg-indigo-500 text-white-a700",
  },
} as const;

const sizes = {
  md: "h-[82px] px-[30px] text-[15px]",
  sm: "h-[78px] px-[30px] text-[15px]",
  xs: "h-[72px] px-[30px] text-[15px]",
} as const;

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> &
  Partial<{
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "outline",
      size = "xs",
      color = "white_A700",
      ...restProps
    },
    ref,
  ) => {
    return (
      <label
        className={`${className} flex items-center justify-center sm:px-4 cursor-text text-[15px] flex-grow rounded-[16px]  ${shape && shapes[shape]} ${variant && (variants[variant]?.[color as keyof (typeof variants)[typeof variant]] || variants[variant])} ${size && sizes[size]}`}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input ref={ref} type={type} name={name} placeholder={placeholder} onChange={onChange} {...restProps} />
        {!!suffix && suffix}
      </label>
    );
  },
);

export { Input };
