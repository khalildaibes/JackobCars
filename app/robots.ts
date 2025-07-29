import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com';
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/private/",
          "/admin/",
          "/api/",
          "/dashboard/",
          "/_next/",
          "/.*\\?*",
          "/search?*"
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/private/",
          "/admin/",
          "/dashboard/"
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/private/",
          "/admin/",
          "/dashboard/"
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
