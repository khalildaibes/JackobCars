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
    const formData = car.formData || {};
    // Extract the needed fields from the car object
    const brand = car.manufacturer_name || formData.makeModel || 'Unknown';
    const model = car.commercial_nickname || formData.commercial_nickname || 'Unknown';
    const year = car.year_of_production || formData.yearOfProduction || 'Unknown';
    const specs = {
      price: car.asking_price || formData.askingPrice || 0,
      miles: car.miles || formData.mileage || '',
      mileage: car.miles || formData.mileage || '',
      fuel: car.fuel_type || formData.fuelType || '',
      transmission: car.transmission || formData.transmission || '',
      body_type: car.body_type || '',
      engine_type: car.engine_type || formData.engineType || '',
      condition: car.condition || formData.currentCondition || '',
      known_problems: car.known_problems || formData.knownProblems || ''
    };
    const images = car.images || {};
    const video = car.video || null;
    
    console.log('Extracted data:', { brand, model, year, specs, images, video });

    // Generate pros and cons using the dedicated API endpoint
    let generatedData = { pros: [], cons: [] };
    try {
      const prosConsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' }/api/prosandcons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: brand,
          model: model,
          year: year,
          specs: specs
        })
      });

      if (prosConsResponse.ok) {
        generatedData = await prosConsResponse.json();
        console.log('Pros/Cons API response:', generatedData);
      } else {
        console.warn('Pros/Cons API failed, using fallback data');
        generatedData = {
          pros: [`مميزات ${brand} ${model} ${year}`],
          cons: [`عيوب ${brand} ${model} ${year}`]
        };
      }
    } catch (error) {
      console.error('Error calling pros/cons API:', error);
      // Fallback data if API fails
      generatedData = {
        pros: [`مميزات ${brand} ${model} ${year}`],
        cons: [`عيوب ${brand} ${model} ${year}`]
      };
    }

        // Generate pros and cons using the dedicated API endpoint
        let generatedDetails = { pros: [], cons: [] };
        try {
          const prosConsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' }/api/prosandcons`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              make: brand,
              model: model,
              year: year,
              specs: specs
            })
          });
    
          if (prosConsResponse.ok) {
            generatedData = await prosConsResponse.json();
            console.log('Pros/Cons API response:', generatedData);
          } else {
            console.warn('Pros/Cons API failed, using fallback data');
            generatedData = {
              pros: [`مميزات ${brand} ${model} ${year}`],
              cons: [`عيوب ${brand} ${model} ${year}`]
            };
          }
        } catch (error) {
          console.error('Error calling pros/cons API:', error);
          // Fallback data if API fails
          generatedData = {
            pros: [`مميزات ${brand} ${model} ${year}`],
            cons: [`عيوب ${brand} ${model} ${year}`]
          };
        }
    

    // Now prepare the data for Strapi with the correct structure
    const productData = {
      data: {
        categories: "car-listing",
        quantity: 1,
        name: car.title,
        slug: generateSlug(`${brand} ${model} ${year}`),
        price: specs.price || 0,
        details: {
          car: {
            description: car.description || generatedDetails.description || "",
            // Owner information
            owner_phone: car.owner_phone || "",
            owner_name: car.owner_name || "",
            owner_email: car.owner_email || "",
            
            // Car specifications
            plate_number: car.plate_number || "",
            color: car.color || "",
            engine_type: car.engine_type || "",
            condition: car.condition || "",
            known_problems: car.known_problems || "",
            trade_in: car.trade_in || "",
            asking_price: car.asking_price || "",
            
            // Manufacturer information
            manufacturer_name: car.manufacturer_name || "",
            commercial_nickname: car.commercial_nickname || "",
            year_of_production: car.year_of_production || "",
            fuel_type: car.engine_type || "",
            trim_level: car.trim_level || "",
            body_type: car.body_type || "",
            transmission: car.transmission || "",
            
            // Car details
            miles: car.miles || "",
            fuel: car.fuel || "",
            name: car.title || "",
            year: parseInt(year) || 0,
            price: specs.price || 0,
            
            // Generated content - use manual input if available, otherwise use generated
            pros: car.pros ? [car.pros] : (generatedData.pros || []),
            cons: car.cons ? [car.cons] : (generatedData.cons || []),
            description: car.description || `سيارة ${brand} ${model} ${year}`,
            
            // Images
            images: {
              main: images?.main?.[0] || "",
              additional: images?.additional || []
            },
            
            // Features array
            features: car.features || [
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
            ]
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