
export async function GET(req) {
    try {

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        // Construct the final API URL with filters
        let apiUrl = `http://64.227.112.249/api/authors?populate=*`;


        console.log("Fetching API:", apiUrl);

        // Fetch data from Strapi API
        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ message: "Failed to fetch authors" }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
