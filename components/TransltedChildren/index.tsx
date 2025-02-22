"use client";

import React from "react";
import TranslateText from "../transltedtext";

interface TranslateChildrenProps {
  children: React.ReactNode;
  targetLang?: string;
}

export default function TranslateChildren({
  children,
  targetLang = "es",
}: TranslateChildrenProps) {
  // Recursively process each child
  function renderTranslated(child: React.ReactNode): React.ReactNode {
    // 1. If it's a plain string, wrap in <TranslateText>
    if (typeof child === "string") {
      return <TranslateText text={child} targetLang={targetLang} />;
    }

    // 2. If it's a valid React element, clone it and process its children
   if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
  const typedChild = child as React.ReactElement<{ children?: React.ReactNode }>;
  return React.cloneElement(typedChild, {
    children: React.Children.map(typedChild.props.children, renderTranslated),
  });
}


    // 3. Otherwise, return the child as is (e.g., null, undefined, or non-string data)
    return child;
  }

  return <>{React.Children.map(children, renderTranslated)}</>;
}
