import { getLocale } from 'next-intl/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function POST(request: Request) {
  try {
    const {
      brand,
      model,
      year,
      specs,
      images,
      video,
      name,
      slug,
      store,
      publisher,
      services,
      category
    } = await request.json();
    const locale = await getLocale();

    // First, generate car details using ChatGPT
    const prompt = `
      Analyze this ${year} ${brand} ${model} car and provide a detailed response in the following JSON format:
      {
        "description": "A concise one-line description of the ${year} ${brand} ${model}"
      }

      Base the response on typical specifications and features of this car model.
      Make sure all measurements and values are realistic for this type of vehicle.
      Write the response in ${locale} language.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedData = JSON.parse(completion.choices[0].message.content || '{}');

    const derivedName = name || `${brand} ${model} ${year}`;
    const generateSlug = (text: string) =>
      text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    const derivedSlug = slug || `${generateSlug(derivedName)}-${Date.now().toString().slice(-6)}`;

    const mainImage = Array.isArray(images) ? images[0] : images?.main ?? null;
    const additionalImages = Array.isArray(images) ? images.slice(1) : images?.additional ?? [];

    // Now prepare the data for Strapi to match the requested JSON shape
    const carDetails = {
      car: {
        fuel: specs?.fuel ?? 'غير محدد',
        name: derivedName,
        year: year,
        miles: specs?.miles ?? '',
        price: specs?.price ?? 0,
        images: {
          main: mainImage ?? '',
          additional: additionalImages ?? []
        },
        features: [
          { label: 'سنة الصنع', value: year?.toString?.() ?? '' },
          { label: 'عدد الكيلومترات', value: specs?.miles ?? '' },
          { label: 'ناقل الحركة', value: specs?.transmission ?? 'غير محدد' },
          { label: 'نوع الوقود', value: specs?.fuel ?? 'غير محدد' }
        ],
        body_type: specs?.body_type ?? 'غير محدد',
        description: generatedData?.description ?? '',
        transmission: specs?.transmission ?? 'غير محدد'
      }
    } as const;

    const productData = {
      data: {
        categories: 'car-listing',
        quantity: 1,
        name: derivedName,
        slug: derivedSlug,
        price: specs?.price ?? 0,
        details: carDetails,
        locale,
        clicks: 0,
        visits: 0,
        shares: 0,
        image: mainImage ?? undefined,
        store: store ?? undefined,
        services: services ?? [],
        publisher: publisher ?? undefined,
        category: category ?? [],
        video: video ?? undefined,
      }
    };

    // Submit to Strapi
    const strapiResponse = await fetch(`${STRAPI_URL}/api/car-listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify(productData)
    });

    if (!strapiResponse.ok) {
      const error = await strapiResponse.json();
      throw new Error(error.error?.message || 'Failed to create product in Strapi');
    }

    const result = await strapiResponse.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in addListing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: 500 }
    );
  }
} 