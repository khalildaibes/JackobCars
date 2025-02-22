import React from "react";

const sizes = {
  textxs: "text-[12px] font-normal",
  texts: "text-[13px] font-normal",
  textmd: "text-[14px] font-normal",
  textlg: "text-[15px] font-normal",
  text4xl: "text-[24px] font-normal lg:text-[24px] md:text-[22px] sm:text-[20px]",
  text7xl: "text-[35px] font-normal lg:text-[35px] md:text-[33px] sm:text-[29px]",
  text9xl: "text-[50px] font-normal lg:text-[50px] md:text-[46px] sm:text-[42px]",
};

export type TextProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as ,
  size = "textlg",
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-black-900 font-dmsans ${className} ${sizes[size as keyof typeof sizes]} `}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
