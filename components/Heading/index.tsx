import React from "react";

const sizes = {
  textxl: "text-[16px] font-medium sm:text-[13px]",
  text2xl: "text-[18px] font-medium sm:text-[15px]",
  text3xl: "text-[20px] font-medium sm:text-[17px]",
  text5xl: "text-[26px] font-medium lg:text-[26px] md:text-[24px] sm:text-[22px]",
  text6xl: "text-[30px] font-medium lg:text-[30px] md:text-[28px] sm:text-[25px]",
  text8xl: "text-[39px] font-medium lg:text-[39px] md:text-[37px] sm:text-[33px]",
  text10xl: "text-[52px] font-medium lg:text-[52px] md:text-[44px]",
  text11xl: "text-[70px] font-medium lg:text-[70px] md:text-[48px]",
  headingxs: "text-[14px] font-semibold",
  headings: "text-[20px] font-bold sm:text-[17px]",
  headingmd: "text-[30px] font-bold lg:text-[30px] md:text-[28px] sm:text-[25px]",
  headinglg: "text-[35px] font-bold lg:text-[35px] md:text-[33px] sm:text-[29px]",
  headingxl: "text-[38px] font-bold lg:text-[38px] md:text-[36px] sm:text-[32px]",
  heading2xl: "text-[40px] font-bold lg:text-[40px] md:text-[38px] sm:text-[34px]",
  heading3xl: "text-[70px] font-bold lg:text-[70px] md:text-[48px]",
};

export type HeadingProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "heading2xl",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component
      className={`text-black-900 font-dmsans ${className} ${sizes[size] as keyof typeof sizes}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
