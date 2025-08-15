import { getLocale } from 'next-intl/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
// Helper function to generate a slug matching /^[A-Za-z0-9-_.~]*$/
function generateSlug(name) {
  const timestamp = Date.now();
  // Replace spaces and invalid characters with '-', allow only A-Za-z0-9-_.~
  return (
    name
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '') // Remove accents
      .replace(/[^A-Za-z0-9\-_.~]+/g, '-') // Replace invalid chars with '-'
      .replace(/-+/g, '-') // Collapse multiple dashes
      .replace(/(^-|-$)/g, '') // Remove leading/trailing dashes
      + '-' + timestamp
  );
}

export async function POST(request) {
  try {
    const locale = await getLocale();
    
    // Get data from request body instead of query parameters
    const requestData = await request.json();
    console.log('Received request data:', JSON.stringify(requestData, null, 2));
    
    const { car } = requestData;
    if (!car) {
      throw new Error('No car data provided in request body');
    }
    
    // Extract the needed fields from the car object
    const brand = car.name?.split(' ')[0] || 'Unknown';
    const model = car.name?.split(' ').slice(1, -1).join(' ') || 'Unknown';
    const year = car.year || 'Unknown';
    const specs = {
      price: car.price || 0,
      miles: car.miles || '',
      mileage: car.mileage || '',
      fuel: car.fuel || '',
      transmission: car.transmission || '',
      body_type: car.body_type || ''
    };
    const images = car.images || {};
    const video = car.video || null;
    
    console.log('Extracted data:', { brand, model, year, specs, images, video });

    // First, generate car details using ChatGPT
    const prompt = `
      Analyze this ${year} ${brand} ${model} car and provide a detailed response in the following JSON format:
      {
        "pros": [
          "5 specific advantages of this car model"
        ],
        "cons": [
          "5 specific disadvantages of this car model"
        ],
        "engine_transmission_details": [
          {
            "label": "Engine Type",
            "value": "specific engine type"
          },
          {
            "label": "Horsepower",
            "value": "estimated HP"
          },
          {
            "label": "Torque",
            "value": "estimated torque"
          },
          {
            "label": "Transmission",
            "value": "${specs.transmission || 'Automatic'}"
          },
          {
            "label": "Drivetrain",
            "value": "drivetrain type"
          },
          {
            "label": "Fuel Economy",
            "value": "${specs.mileage || 'Unknown'}"
          },
          {
            "label": "Emissions",
            "value": "emissions standard"
          }
        ],
        "dimensions_capacity": [
          {
            "label": "Width",
            "value": "estimated width in mm"
          },
          {
            "label": "Width (including mirrors)",
            "value": "estimated total width in mm"
          },
          {
            "label": "Gross Vehicle Weight (kg)",
            "value": "estimated weight in kg"
          },
          {
            "label": "Max. Loading Weight (kg)",
            "value": "estimated max load in kg"
          },
          {
            "label": "Max. Roof Load (kg)",
            "value": "estimated roof load in kg"
          },
          {
            "label": "No. of Seats",
            "value": "typical seat count"
          }
        ],
        "description": "A detailed one-line description of the ${year} ${brand} ${model}"
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

    console.log('ChatGPT response:', completion.choices[0]?.message?.content);
    
    let generatedData;
    try {
      generatedData = JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (parseError) {
      console.error('Failed to parse ChatGPT response:', parseError);
      // Fallback data if ChatGPT fails
      generatedData = {
        pros: ["Reliable", "Fuel efficient", "Good value", "Practical", "Well-built"],
        cons: ["Limited features", "Basic interior", "Average performance", "Standard safety", "Modest styling"],
        engine_transmission_details: [
          { label: "Engine Type", value: "Standard" },
          { label: "Horsepower", value: "Average" },
          { label: "Torque", value: "Standard" },
          { label: "Transmission", value: specs.transmission || "Automatic" },
          { label: "Drivetrain", value: "Front-wheel drive" },
          { label: "Fuel Economy", value: specs.mileage || "Standard" },
          { label: "Emissions", value: "Standard" }
        ],
        dimensions_capacity: [
          { label: "Width", value: "1800 mm" },
          { label: "Width (including mirrors)", value: "2000 mm" },
          { label: "Gross Vehicle Weight (kg)", value: "1500 kg" },
          { label: "Max. Loading Weight (kg)", value: "500 kg" },
          { label: "Max. Roof Load (kg)", value: "75 kg" },
          { label: "No. of Seats", value: "5" }
        ],
        description: `A ${year} ${brand} ${model} vehicle with standard features and reliable performance.`
      };
    }

    // Now prepare the data for Strapi with the correct structure
    const productData = {
      data: {
        categories: "car-listing",
        quantity: 1,
        name: `${brand} ${model} ${year}`,
        slug: generateSlug(`${brand} ${model} ${year}`),

        
        price: specs.price || 0,
        details: {
          car: {
            fuel: specs.fuel || "غير معروف",
            name: `${brand} ${model} ${year}`,
            year: parseInt(year) || 0,
            miles: specs.miles || "",
            price: specs.price || 0,
            images: {
              main: images?.main?.[0] || "",
              additional: images?.additional || []
            },
            features: [
              {
                label: "سنة الصنع",
                value: year.toString()
              },
              {
                label: "عدد الكيلومترات",
                value: specs.miles || ""
              },
              {
                label: "ناقل الحركة",
                value: specs.transmission || "غير محدد"
              },
              {
                label: "نوع الوقود",
                value: specs.fuel || "غير معروف"
              },
              {
                label: "السعر المطلوب",
                value: specs.price?.toString() || ""
              }
            ],
            body_type: specs.body_type || "غير محدد",
            description: generatedData.description || `سيارة ${brand} ${model} ${year}`,
            transmission: specs.transmission || "غير محدد"
          }
        },
        store: [18], // Store ID as array
        image: images?.main?.[0] ? [images.main[0]] : [], // Image ID as array
        publisher: [1], // Publisher ID as array
        category: [], // Empty category array
        services: [], // Empty services array
        clicks: 0,
        visits: 0,
        shares: 0
      }
    };

    // Submit to Strapi
    console.log('Submitting to Strapi:', JSON.stringify(productData, null, 2));
    
    const strapiResponse = await fetch(`${STRAPI_URL}/api/products?locale=${locale}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify(productData)
    });

    if (!strapiResponse.ok) {
      const error = await strapiResponse.json();
      console.error('Strapi error response:', error);
      throw new Error(error.error?.message || 'Failed to create product in Strapi');
    }

    const result = await strapiResponse.json();
    console.log('Strapi success response:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in addListing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: 500 }
    );
  }
} 