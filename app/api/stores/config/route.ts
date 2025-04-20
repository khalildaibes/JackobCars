import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch stores from your central database or API
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/stores?populate=*`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stores');
    }

    const data = await response.json();

    // Transform the data into our store config format
    const storeConfigs = data.data.map((store: any) => ({
      id: store.id,
      slug: store.slug,
      hostname: store.hostname,
      token: store.apiToken, // Make sure this field exists in your Strapi store model
      name: store.name,
      // Add any other store-specific configuration you need
    }));

    return NextResponse.json({ data: storeConfigs });
  } catch (error) {
    console.error('Error fetching store configs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store configurations' },
      { status: 500 }
    );
  }
} 