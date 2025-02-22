// components/TranslateText.tsx
"use client";

import React, { useEffect, useState } from "react";

type TranslateTextProps = {
  text: string;
  targetLang?: string; // e.g., "es"
};

export default function TranslateText({ text, targetLang = "es" }: TranslateTextProps) {
  const [translated, setTranslated] = useState(text);
  useEffect(() => {

    
    async function fetchTranslation() {
      try {
        console.log("Translating:", text);
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, target: targetLang }),
        });
        const data = await res.json();
        console.log("Translation response:", data);
        if (data.translations && data.translations[0]) {
          setTranslated(data.translations[0]);
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    }
    if (text.trim()) {
      fetchTranslation();
    }
  }, [text, targetLang]);
  

  return <>{translated}</>;
}
