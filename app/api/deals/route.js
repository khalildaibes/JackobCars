import { getLocale } from "next-intl/server";
import { getStoreConfig, initializeStoreConfigs } from '../../../app/utils/storeConfig';

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);
        let storeHostname = searchParams.get('store_hostname');
        console.log("Store Hostname:", storeHostname);

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

        let baseUrl;
        let apiToken;

        if (storeHostname) {
            // Initialize store configs if not already done
            await initializeStoreConfigs();
            
            // Get store configuration from cache
            const storeConfig = getStoreConfig(storeHostname);
            console.log("Store Config:", storeConfig);
            
            if (storeConfig) {
                baseUrl = `${storeConfig.hostname}`;
                apiToken = storeConfig.apiToken;
            } else {
                // Fallback to default values if store config not found
                baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
                apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
            }
        } else {
            // Use default values if no store ID provided
            baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
            apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
            storeHostname = 'npm run dev';
        }
        
        // Construct the final API URL with filters
        let apiUrl = storeHostname.includes('64.227.112.249') ? `http://${baseUrl}/api/products?populate=*` : `http://${baseUrl}/api/products?populate=*`;
        if (queryParams.toString()) {
            apiUrl += `&${queryParams.toString()}`;
        }

        console.log("Final API URL:", apiUrl);
        console.log("Using API Token:", apiToken ? "Token exists" : "No token");

        // Fetch data from the appropriate store API
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: storeHostname.includes('64.227.112.249') ? `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` : `Bearer ${apiToken}`,
            },
        });

        if (!response.ok) {
            console.error("API Response Error:", response.status, response.statusText);
            return new Response(JSON.stringify({ message: "Failed to fetch products", error: response.statusText }), { status: response.status });
        }

        const data = await response.json();
        console.log("API Response Data:", data);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
