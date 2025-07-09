import { getLocale } from "next-intl/server";
import { NextResponse } from "next/server";

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
                if (key === "sort") queryParams.append("sort", value);
                }
        });

        // Construct the final API URL with filters
        let apiUrl = `http://64.227.112.249/api/articles?&locale=${locale}&sort=createdAt:desc&populate[blocks][populate]=*&populate[cover][populate]=*&populate[categories][populate]=*&populate[comments][populate]=*`;
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


export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);

    // Handle file uploads
    if (contentType?.includes('multipart/form-data')) {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const fileInfo = formData.get('fileInfo');
        const locale = formData.get('locale') || 'en';

        if (!file) {
          return NextResponse.json(
            { error: 'No file provided' },
            { status: 400 }
          );
        }

        // Create FormData for Strapi
        const strapiFormData = new FormData();
        strapiFormData.append('files', file);
        if (fileInfo) {
          strapiFormData.append('fileInfo', fileInfo);
        }

        // Upload to Strapi
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: strapiFormData,
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload Error Response:', errorText);
          return NextResponse.json(
            { error: 'Failed to upload file', details: errorText },
            { status: uploadResponse.status }
          );
        }

        const uploadData = await uploadResponse.json();
        return NextResponse.json(uploadData);
      } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { error: 'File upload failed', details: error.message },
          { status: 500 }
        );
      }
    }

    // Handle blog creation
    try {
      const data = await request.json();
      console.log('Request data:', data);

      if (!data || typeof data !== 'object') {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }

      const { locale = 'en', ...articleData } = data;

      // Create the article in Strapi
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?locale=${locale}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: articleData }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Strapi Error Response:', errorText);
        return NextResponse.json(
          { error: 'Failed to create article', details: errorText },
          { status: response.status }
        );
      }

      const responseData = await response.json();
      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Blog creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create article', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
