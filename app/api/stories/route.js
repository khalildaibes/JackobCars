import { getLocale } from "next-intl/server";
import { getStoreConfig, initializeStoreConfigs } from '../../utils/storeConfig';

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);
        let storeHostname = searchParams.get('store_hostname');

        // Define allowed filters
        const allowedFilters = ["category", "min_price", "max_price", "store"];

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        allowedFilters.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                queryParams.set(key, value);
            }
        });

        let baseUrl;
        let apiToken;
        console.log("Store Hostname:", storeHostname);
        if (storeHostname) {
            // Initialize store configs if not already done
            await initializeStoreConfigs();
            
            // Get store configuration from cache
            const storeConfig = getStoreConfig(storeHostname);
            console.log("Store Config:", storeConfig);

            if (storeConfig) {
                baseUrl = `${storeConfig.hostname}`;
                apiToken = storeConfig.apiToken;
                console.log("Base URL:", baseUrl);
            } else {
                // Fallback to default values if store config not found
                baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
                apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
            }
        } else {
            // Use default values if no store ID provided
            baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
            apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
            storeHostname = '64.227.112.249';
        }
        
        // Construct the final API URL with filters
        let apiUrl =  storeHostname.includes('64.227.112.249') ? `http://${baseUrl}/api/stories?populate=*` : `http://${baseUrl}/api/stories?populate=*`;
        if (queryParams.toString()) {
            apiUrl += `&${queryParams.toString()}`;
        }

        console.log("Fetching API:", apiUrl);

        // Fetch data from the appropriate store API
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: storeHostname.includes('64.227.112.249') ? `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` : `Bearer ${apiToken}`,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ message: "Failed to fetch services", error: response.statusText }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
} 