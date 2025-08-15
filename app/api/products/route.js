import { getLocale } from "next-intl/server";
import { getStoreConfig, initializeStoreConfigs } from '../../utils/storeConfig';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);
        let storeHostname = searchParams.get('store_hostname');

        // Define allowed filters
        const allowedFilters = ["category", "min_price", "max_price", "brand", "store", "slug"];

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        allowedFilters.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                if (key === "category") queryParams.append("filters[categories][$contains]", value);
                if (key === "min_price") queryParams.append("filters[price][$gte]", value);
                if (key === "max_price") queryParams.append("filters[price][$lte]", value);
                if (key === "brand") queryParams.append("filters[brand][$contains]", value);
                if (key === "store") queryParams.append("filters[store][$contains]", value);
                if (key === "slug") queryParams.append("filters[slug][$contains]", value);
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
        let apiUrl = storeHostname.includes('64.227.112.249') ? 
            `http://${baseUrl.replace('http://', '')}/api/products?populate=*` : 
            `http://${baseUrl.replace('http://', '')}/api/products?populate=*`;
        if (queryParams.toString()) {
            apiUrl += `&${queryParams.toString()}`;
        }

        console.log("Fetching API:", apiUrl);
        console.log("Store Hostname:", storeHostname);
        console.log("API Token:", apiToken);
        // Fetch data from the appropriate store API
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: storeHostname.includes('64.227.112.249') ? `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` : `Bearer ${apiToken}`,
            },
        });
        console.log("Response:", response);
        if (!response.ok) {
            return new Response(JSON.stringify({ message: "Failed to fetch products", error: response.statusText }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const productData = await request.json();
        let {
            storeId,
            name,
            description,
            price,
            category,
            brand,
            stock,
            sku
        } = productData;

        // Handle default store mapping
        if (storeId === 'default') {
            storeId = 'ASD Auto Spa Detailing';
        }

        // Validate required fields
        if (!storeId || !name || !price || !category) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400 }
            );
        }

        // Create product in Strapi using your existing structure
        const apiUrl = `${STRAPI_URL}/api/products`;
        
        const strapiData = {
            data: {
                name,
                description: description || '',
                price: parseFloat(price),
                category,
                brand: brand || '',
                stock: parseInt(stock) || 0,
                sku: sku || '',
                isActive: true,
                stores: {
                    connect: [{ name: storeId }] // Connect to store by name
                }
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify(strapiData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Strapi API Error:', errorText);
            return new Response(
                JSON.stringify({ error: 'Failed to create product in Strapi' }),
                { status: 500 }
            );
        }

        const result = await response.json();
        
        // Transform response to expected format
        const product = {
            id: result.data.id,
            storeId: storeId,
            name: result.data.name,
            description: result.data.description,
            price: result.data.price,
            category: result.data.category,
            brand: result.data.brand,
            stock: result.data.stock,
            sku: result.data.sku,
            isActive: result.data.isActive,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt,
        };

        return new Response(JSON.stringify({
            success: true,
            message: 'Product created successfully',
            product: product
        }), { status: 200 });

    } catch (error) {
        console.error('Error creating product:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}