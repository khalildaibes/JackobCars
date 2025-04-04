import { getLocale } from 'next-intl/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://68.183.215.202:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function POST(request) {
  try {
    const { brand, model, year, specs, images, video } = await request.json();
    const locale = await getLocale();

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
            "value": "${specs.transmission}"
          },
          {
            "label": "Drivetrain",
            "value": "drivetrain type"
          },
          {
            "label": "Fuel Economy",
            "value": "${specs.mileage}"
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

    const generatedData = JSON.parse(completion.choices[0].message.content || '{}');

    // Now prepare the data for Strapi
    const productData = {
      data: {
        car: {
          name: `${brand} ${model} ${year}`,
          description: generatedData.description,
          price: specs.price,
          year: year,
          miles: specs.miles,
          mileage: specs.mileage,
          fuel: specs.fuel,
          transmission: specs.transmission,
          body_type: specs.body_type,
          pros: generatedData.pros,
          cons: generatedData.cons,
          features: [
            { icon: 'img_calendar.svg', label: 'Year', value: year.toString() },
            { icon: 'img_mileage.svg', label: 'Mileage', value: specs.miles },
            { icon: 'img_transmission.svg', label: 'Transmission', value: specs.transmission },
            { icon: 'img_fuel.svg', label: 'Fuel', value: specs.fuel },
            { icon: 'img_offer.svg', label: 'Offer', value: 'Make an Offer Price' }
          ],
          badges: [
            {
              color: 'blue-400',
              label: 'Best Seller',
              textColor: 'white'
            }
          ],
          dimensions_capacity: generatedData.dimensions_capacity,
          engine_transmission_details: generatedData.engine_transmission_details,
          images: images,
          video: video,
          actions: {
            save: {
              icon: 'img_bookmark.svg',
              label: 'Save'
            },
            share: {
              icon: 'img_share.svg',
              label: 'Share'
            },
            compare: {
              icon: 'img_compare.svg',
              label: 'Compare'
            }
          },
          breadcrumb: [
            {
              link: '#',
              name: 'Home'
            },
            {
              link: '#',
              name: 'Listings'
            },
            {
              link: '#',
              name: `${brand} ${model} ${year}`,
              current: true
            }
          ]
        }
      }
    };

    // Submit to Strapi
    const strapiResponse = await fetch(`${STRAPI_URL}/api/products`, {
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

  } catch (error) {
    console.error('Error in addListing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create listing' },
      { status: 500 }
    );
  }
} 