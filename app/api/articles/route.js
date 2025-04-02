import { getLocale } from "next-intl/server";

export async function GET(req) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);

        // Define allowed filters
        const allowedFilters = ["title", "featured", "limit","slug"];

        // Build query parameters dynamically
        const queryParams = new URLSearchParams();

        allowedFilters.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                if (key === "title") queryParams.append("filters[title][$eq]", value);
                if (key === "featured") queryParams.append("filters[featured][$eq]", value);
                if (key === "limit") queryParams.append("pagination[limit]", value);
                if (key === "slug") queryParams.append("filters[slug][$contains]", value);
                }
        });

        // Construct the final API URL with filters
        let apiUrl = `http://68.183.215.202/api/articles?populate=*&locale=${locale}`;
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
            return new Response(JSON.stringify({ message: "Failed to fetch articles" }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("API Proxy Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const locale = await getLocale();

    // Construct the API URL for creating an article
    const apiUrl = `http://68.183.215.202/api/articles`;

    // Send POST request to Strapi
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          title: body.data.title,
          description: body.data.description,
          content: body.data.content,
          cover: {
            url: body.data.coverImage.url,
            alt: body.data.coverImage.alt
          },
          locale: locale
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify({ 
        message: "Failed to create article",
        error: error 
      }), { 
        status: response.status 
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { 
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("API Create Article Error:", error);
    return new Response(JSON.stringify({ 
      message: "Internal Server Error",
      error: error.message 
    }), { 
      status: 500 
    });
  }
}
