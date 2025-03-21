import { getLocale } from "next-intl/server";

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);

        // Define allowed filters
        const allowedFilters = ["title"];

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        allowedFilters.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                if (key === "title") queryParams.append("filters[title][$eq]", value);
            }
        });

        // Construct the final API URL with filters
        let apiUrl = `http://68.183.215.202/api/articles?populate=*&locale=he-IL`;
        if (queryParams.toString()) {
            apiUrl += `&${queryParams.toString()}`;
        }

        console.log("Fetching API:", apiUrl);

        // Fetch data from Strapi API
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer c815d4a1cdca66d179b6485f3d584486d7ca6bc8024553c07f4df19830c6d3bcbad322af9ce87e7d53ef49624634938ecd44b3d8b63f9222fbf0d1bc2163daf6b59c7df4fa0f71ca103487f80d63b3df9612e33a0f2ebcbe3472d262df2c4021c904186c6a5ad0144052f754d2e0494b83c3210c469ae4fc5673d5fccffc578a`,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ message: "Failed to fetch articles" }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
