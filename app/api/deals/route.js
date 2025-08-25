import { getLocale } from "next-intl/server";
import { getStoreConfig, initializeStoreConfigs } from '../../../app/utils/storeConfig';

export async function GET(req) {
    try {
        console.log("Deals API route accessed");
        
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);
        let storeHostname = searchParams.get('store_hostname');
        console.log("Store Hostname:", storeHostname);

        // For now, let's test with a simple direct call to Strapi
        const baseUrl = '64.227.112.249';
        const apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
        
        // Construct the final API URL
        let apiUrl = `http://${baseUrl}:1337/api/products?populate=*`;

        console.log("Final API URL:", apiUrl);
        console.log("Using API Token:", apiToken ? "Token exists" : "No token");

        // Fetch data from Strapi
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiToken}`,
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
