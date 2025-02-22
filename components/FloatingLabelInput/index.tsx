"use client";
import React from "react";

const shapes = {
  round: "rounded-[12px]",
} as const;

const variants = {
  ftxtFillWhiteA70019: {
    white_A700_19: "bg-white-a700_19",
  },
  ftxtOutlineGray200: {
    white_A700: "border-gray-200 border border-solid bg-white-a700",
  },
} as const;

const sizes = {
  sm: "h-[68px] px-[22px] text-[15px]",
  xs: "h-[56px] px-3.5 text-[15px]",
} as const;

type FloatingLabelInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> &
  Partial<{
    label: string;
    floating?: "normal" | "contained";
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
    color: string;
  }>;

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      label = "",
      prefix,
      suffix,
      onChange,
      floating = "normal",
      shape,
      variant = "ftxtOutlineGray200",
      size = "xs",
      color = "white_A700",
      ...restProps
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const labelRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useLayoutEffect(() => {
      const input = inputRef.current;
      const label = labelRef.current;

      let timer: NodeJS.Timeout;
      let requestId: number;

      function fixOffset() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          if (requestId) cancelAnimationFrame(requestId);
          requestId = requestAnimationFrame(() => {
            if (!input || !label) return;
            const computedStyle = getComputedStyle(input);
            label.style.left = `${input.offsetLeft + parseFloat(computedStyle.paddingInlineStart)}px`;
          });
        }, 60);
      }

      fixOffset();
      input!.addEventListener("focus", fixOffset);
      window.addEventListener("resize", fixOffset);

      return () => {
        input!.removeEventListener("focus", fixOffset);
        window.removeEventListener("resize", fixOffset);
      };
    }, []);

    return (
      <label
        floating-label={floating}
        className={`${className} flex items-center justify-center gap-2 cursor-text  ${(shape && shapes[shape]) || ""} ${variants[variant]?.[color as keyof (typeof variants)[typeof variant]] || variants[variant] || ""} ${sizes[size] || ""}`}
      >
        {!!prefix && prefix}
        <input
          floating-input=""
          ref={inputRef}
          type={type}
          name={name}
          placeholder={placeholder || label}
          onChange={onChange}
          {...restProps}
        />
        {!!(label || placeholder) && (
          <div floating-text="" ref={labelRef}>
            {label || placeholder}
          </div>
        )}
        {!!suffix && suffix}
      </label>
    );
  },
);

export { FloatingLabelInput };
