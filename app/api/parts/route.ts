import { NextResponse } from 'next/server';

async function fetchParts(slug?: string) {
  try {
    const url = slug 
      ? `http://68.183.215.202/api/parts?filters[slug][$eq]=${slug}&populate=*`
      : `http://68.183.215.202/api/parts?populate=*`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching parts:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    // Get the slug from query parameters
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const data = await fetchParts(slug || undefined);

    if (slug) {
      // If we're looking for a specific part
      if (!data.data || data.data.length === 0) {
        return NextResponse.json(
          { error: 'Part not found' },
          { status: 404 }
        );
      }

      // Transform single part data
      const part = data.data[0];
      const transformedData = {
        id: part.id,
        slug: part.slug,
        name: part.title,
        image: part.images?.data ? part.images.data.map((img: any) => ({
          url: img.url
        })) : [],
        details: {
          description: part.description,
          features: part.details?.features?.map((feature: string) => ({
            value: feature
          })) || []
        },
        price: part.price,
        categories: part.categories?.data?.map((cat: any) => cat.name).join(',') || '',
        stores: part.stores?.data?.map((store: any) => ({
          id: store.id,
          name: store.name
        })) || []
      };

      return NextResponse.json({ data: transformedData });
    } else {
      // Transform list of parts data
      const transformedData = data.data.map((part: any) => ({
        id: part.id,
        slug: part.slug,
        name: part.title,
        image: part.images?.data ? part.images.data.map((img: any) => ({
          url: img.url
        })) : [],
        details: {
          description: part.description,
          features: part.details?.features?.map((feature: string) => ({
            value: feature
          })) || []
        },
        price: part.price,
        categories: part.categories?.data?.map((cat: any) => cat.name).join(',') || '',
        stores: part.stores?.data?.map((store: any) => ({
          id: store.id,
          name: store.name
        })) || []
      }));

      return NextResponse.json({ data: transformedData });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 