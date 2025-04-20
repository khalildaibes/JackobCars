import { NextRequest } from "next/server";
import { getLocale } from "next-intl/server"; // Correct method for locale in async functions

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get("category") || "";
    
    // Correct way to retrieve locale in a server function
    const locale = await getLocale();

    console.log("Detected Locale:", locale);

    const apiUrl = `http://64.227.112.249/api/homepage?populate=*&locale=${encodeURIComponent(locale)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Failed to fetch homepage" }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
