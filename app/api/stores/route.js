import { getLocale } from "next-intl/server";

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);

        // Define allowed filters
        const allowedFilters = ["name", "phone", "address", "details", "hostname", "visits", "tags", "provider", "slug"];

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        allowedFilters.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                if (key === "tags") queryParams.append(`filters[${key}][$containsi]`, value);
                else if (key === "slug") queryParams.append(`filters[${key}][$contains]`, value);
                else queryParams.append(`filters[${key}][$contains]`, value);
            }
        });

        // Construct the final API URL with filters
        let apiUrl = `http://64.227.112.249/api/stores?populate=*`;
        if (queryParams.toString()) {
            apiUrl += `&${queryParams.toString()}`;
        }

        console.log("Fetching API:", apiUrl);

        // Fetch data from Strapi API
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ message: "Failed to fetch stores" }), { status: response.status });
        }

        const data = await response.json();
        


        // Otherwise return all stores
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
} 