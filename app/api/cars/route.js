// app/api/cars/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const apiUrl = `http://68.183.215.202/api/products?populate=*&locale=${locale}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });
    console.log("response", response.json());

    clearTimeout(timeout);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Failed to fetch products" }),
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("response", response.json());

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
