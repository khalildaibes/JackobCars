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

/**
 * API endpoint for adding car listings
 * 
 * Expected request structure:
 * {
 *   car: {
 *     // Basic car information
 *     title: string,
 *     makeModel: string,
 *     year: string,
 *     plateNumber: string,
 *     mileage: string,
 *     color: string,
 *     engineType: string,
 *     transmission: string,
 *     
 *     // Condition and trade-in
 *     currentCondition: string,
 *     knownProblems: string,
 *     pros: string,
 *     cons: string,
 *     tradeIn: string,
 *     description: string,
 *     
 *     // Pricing and region
 *     askingPrice: string,
 *     priceNegotiable: boolean,
 *     region: string,
 *     
 *     // Owner information
 *     name: string,
 *     email: string,
 *     phone: string,
 *     
 *     // Car type and ownership
 *     carType: string,
 *     ownerType: string,
 *     previousOwners: array,
 *     
 *     // Package and terms
 *     selectedPackage: string,
 *     termsAccepted: boolean,
 *     
 *     // Images and video
 *     images: object,
 *     video: object,
 *     
 *     // Manufacturer and model details
 *     manufacturerName: string,
 *     modelId: string,
 *     subModelId: string,
 *     commercialNickname: string,
 *     yearOfProduction: string,
 *     
 *     // Technical specifications
 *     engineCapacity: string,
 *     bodyType: string,
 *     seatingCapacity: string,
 *     fuelType: string,
 *     abs: string,
 *     airbags: string,
 *     powerWindows: string,
 *     driveType: string,
 *     totalWeight: string,
 *     height: string,
 *     fuelTankCapacity: string,
 *     co2Emission: string,
 *     greenIndex: string,
 *     commercialName: string,
 *     rank: string,
 *     
 *     // Additional fields
 *     engineCode: string,
 *     frameNumber: string,
 *     lastTestDate: string,
 *     tokefTestDate: string,
 *     frontTires: string,
 *     rearTires: string,
 *     pollutionGroup: string,
 *     dateOnRoad: string,
 *     owner: string,
 *     carTitle: string,
 *     carColorGroupID: string,
 *     yad2ColorID: string,
 *     yad2CarTitle: string,
 *     
 *     // Engine power and performance
 *     enginePower: string,
 *     doors: string,
 *     trimLevel: string,
 *     
 *     // Environmental data
 *     noxEmission: string,
 *     pmEmission: string,
 *     hcEmission: string,
 *     coEmission: string,
 *     
 *     // Safety and features
 *     safetyRating: string,
 *     safetyRatingWithoutSeatbelts: string,
 *     fuelTankCapacityWithoutReserve: string
 *   },
 *   formData: object, // Additional form data (optional)
 *   submission_timestamp: string, // ISO timestamp
 *   form_version: string // Version identifier
 * }
 */
export async function POST(request) {
  try {
    const locale = await getLocale();
    
    // Get data from request body instead of query parameters
    const requestData = await request.json();
    console.log('Received request data:', JSON.stringify(requestData, null, 2));
    
    let { car, formData } = requestData;
    if (!car) {
      throw new Error('No car data provided in request body');
    }
    
    // Validate required fields
    const requiredFields = [];
    const missingFields = requiredFields.filter(field => !car[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Extract the needed fields from the car object (this is the main data source)
    const brand = car.manufacturerName || car.manufacturer_name || car.makeModel || 'Unknown';
    const model = car.commercialNickname || car.commercial_nickname || car.modelName || 'Unknown';
    const year = car.yearOfProduction || car.year_of_production || car.year || car.carYear || 'Unknown';
    
    const specs = {
      price: car.askingPrice || car.asking_price || 0,
      miles: car.mileage || car.miles || '',
      mileage: car.mileage || car.miles || '',
      fuel: car.fuelType || car.fuel_type || car.engineType || '',
      transmission: car.transmission || '',
      body_type: car.bodyType || car.body_type || '',
      engine_type: car.engineType || car.engine_type || '',
      condition: car.currentCondition || car.condition || '',
      known_problems: car.knownProblems || car.known_problems || ''
    };
    
    const images = car.images || [];
    const video = car.video || null;
    
    console.log('Extracted data:', { brand, model, year, specs, images, video });
    
    // Validate video if present
    if (video && video.file) {
      // Note: Video validation should be done on the frontend before submission
      // This is just a safety check for the API
      console.log('Video file received:', video.file.name, video.file.size, video.file.type);
    }

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

    // Now prepare the data for Strapi with the correct structure
    const productData = {
      data: {
        categories: "car-listing",
        quantity: 1,
        name: car.title || `${brand} ${model} ${year}`,
        slug: generateSlug(`${brand} ${model} ${year}`),
        price: specs.price || 0,
        details: {
          car: {
            // Basic car information
            title: car.title || "",
            makeModel: car.makeModel || "",
            year: car.year || parseInt(year) || 0,
            plateNumber: car.plateNumber || "",
            mileage: car.mileage || car.miles || "",
            color: car.color || "",
            engineType: car.engineType || car.engine_type || "",
            transmission: car.transmission || "",
            
            // Condition and trade-in
            currentCondition: car.currentCondition || car.condition || "",
            knownProblems: car.knownProblems || car.known_problems || "",
            pros: car.pros ? [car.pros] : (generatedData.pros || []),
            cons: car.cons ? [car.cons] : (generatedData.cons || []),
            tradeIn: car.tradeIn || car.trade_in || "",
            description: car.description || `سيارة ${brand} ${model} ${year}`,
            
            // Pricing and region
            askingPrice: car.askingPrice || car.asking_price || specs.price || 0,
            priceNegotiable: car.priceNegotiable || false,
            region: car.region || "",
            
            // Owner information
            name: car.name || car.owner_name || "",
            email: car.email || car.owner_email || "",
            phone: car.phone || car.owner_phone || "",
            
            // Car type and ownership
            carType: car.carType || "",
            ownerType: car.ownerType || "",
            previousOwners: car.previousOwners || [],
            
            // Package and terms
            selectedPackage: car.selectedPackage || "website_release",
            termsAccepted: car.termsAccepted || false,
            
            // Images
            images: {
              main: images?.main || "",
              additional: images?.additional || []
            },
            
            // Video
            video: video?.file ? {
              id: video.file.id,
              url: video.file.url,
              file: video.file.name,
              type: video.file.type,
              size: video.file.size
            } : null,
            
            // Manufacturer and model details
            manufacturerName: car.manufacturerName || car.manufacturer_name || "",
            modelId: car.modelId || "",
            subModelId: car.subModelId || "",
            commercialNickname: car.commercialNickname || car.commercial_nickname || "",
            yearOfProduction: car.yearOfProduction || car.year_of_production || "",
            
            // Technical specifications
            engineCapacity: car.engineCapacity || "",
            bodyType: car.bodyType || car.body_type || "",
            seatingCapacity: car.seatingCapacity || "",
            fuelType: car.fuelType || car.fuel_type || car.engine_type || "",
            abs: car.abs || "",
            airbags: car.airbags || "",
            powerWindows: car.powerWindows || "",
            driveType: car.driveType || "",
            totalWeight: car.totalWeight || "",
            height: car.height || "",
            fuelTankCapacity: car.fuelTankCapacity || "",
            co2Emission: car.co2Emission || "",
            greenIndex: car.greenIndex || "",
            commercialName: car.commercialName || "",
            rank: car.rank || "",
            
            // Additional technical data
            engineCode: car.engineCode || "",
            frameNumber: car.frameNumber || "",
            lastTestDate: car.lastTestDate || "",
            tokefTestDate: car.tokefTestDate || "",
            frontTires: car.frontTires || "",
            rearTires: car.rearTires || "",
            pollutionGroup: car.pollutionGroup || "",
            dateOnRoad: car.dateOnRoad || "",
            owner: car.owner || "",
            carTitle: car.carTitle || "",
            carColorGroupID: car.carColorGroupID || "",
            yad2ColorID: car.yad2ColorID || "",
            yad2CarTitle: car.yad2CarTitle || "",
            
            // Engine power and performance
            enginePower: car.enginePower || "",
            doors: car.doors || "",
            trimLevel: car.trimLevel || car.trim_level || "",
            
            // Environmental data
            noxEmission: car.noxEmission || "",
            pmEmission: car.pmEmission || "",
            hcEmission: car.hcEmission || "",
            coEmission: car.coEmission || "",
            
            // Safety and features
            safetyRating: car.safetyRating || "",
            safetyRatingWithoutSeatbelts: car.safetyRatingWithoutSeatbelts || "",
            fuelTankCapacityWithoutReserve: car.fuelTankCapacityWithoutReserve || "",
            
            // Legacy fields for backward compatibility
            miles: car.miles || car.mileage || "",
            fuel: car.fuel || car.fuelType || "",
            price: specs.price || 0,
            
            // Features array with enhanced data
            features: car.features || [
              {
                label: "سنة الصنع",
                value: (car.year || year).toString()
              },
              {
                label: "عدد الكيلومترات",
                value: (car.mileage || car.miles || specs.miles || "").toString()
              },
              {
                label: "ناقل الحركة",
                value: car.transmission || specs.transmission || "غير محدد"
              },
              {
                label: "نوع الوقود",
                value: car.fuelType || specs.fuel || "غير معروف"
              },
              {
                label: "السعر المطلوب",
                value: (car.askingPrice || specs.price || "").toString()
              },
              {
                label: "نوع السيارة",
                value: car.carType || "غير محدد"
              },
              {
                label: "نوع المالك",
                value: car.ownerType || "غير محدد"
              },
              {
                label: "المنطقة",
                value: car.region || "غير محدد"
              },
              {
                label: "الحزمة المختارة",
                value: car.selectedPackage || "website_release"
              }
            ]
          }
        },
        store: [18], // Store ID as array
        image: images?.length > 0 ? images[0] : [], // Image ID as array
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