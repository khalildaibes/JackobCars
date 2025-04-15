import { NextResponse } from 'next/server';

async function fetchServicesFromStrapi() {
  try {
    const response = await fetch(`http://68.183.215.202/api/services?populate=*`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(" services data", data);
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const data = await fetchServicesFromStrapi();
    
    // Transform the data to match the expected format
    const transformedData = data.data.map((service: any) => ({
      id: service.id,
      slug: service.attributes.slug,
      name: service.attributes.title,
      image: service.attributes.image?.data ? service.attributes.image.data.map((img: any) => ({
        url: img.attributes.url
      })) : [],
      details: {
        description: service.attributes.description,
        features: service.attributes.details?.features?.map((feature: string) => ({
          value: feature
        })) || []
      },
      price: service.attributes.price,
      categories: service.attributes.categories?.data?.map((cat: any) => cat.attributes.name).join(',') || '',
      stores: service.attributes.stores?.data?.map((store: any) => ({
        id: store.id,
        name: store.attributes.name
      })) || []
    }));

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 