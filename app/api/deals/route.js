import { getLocale } from "next-intl/server";

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);

        // Define allowed filters
        const allowedFilters = ["category", "min_price", "max_price", "fuel", "body_type", "year", "mileage", "store"];

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        allowedFilters.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                if (key === "category") queryParams.append("filters[categories][$contains]", value);
                if (key === "min_price") queryParams.append("filters[price][$gte]", value);
                if (key === "max_price") queryParams.append("filters[price][$lte]", value);
                if (key === "fuel") queryParams.append("filters[fuel][$contains]", value);
                if (key === "body_type") queryParams.append("filters[body_type][$contains]", value);
                if (key === "year") queryParams.append("filters[year][$contains]", value);
                if (key === "mileage") queryParams.append("filters[mileage][$lte]", value);
                if (key === "store") queryParams.append("filters[store][$contains]", value);
            }
        });

        // Construct the final API URL with filters
        let apiUrl = `http://68.183.215.202/api/products?populate=*&locale=${locale}`;
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
            return new Response(JSON.stringify({ message: "Failed to fetch products" }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
