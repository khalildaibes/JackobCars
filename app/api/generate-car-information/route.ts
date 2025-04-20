import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { manufacturer, model, year, locale, trim } = await req.json();

    const languagePrompt = {
      'en': 'Respond in English',
      'he-IL': 'Respond in Hebrew',
      'ar': 'Respond in Arabic'
    }[locale] || 'Respond in English';

    const prompt = `${languagePrompt}. Generate detailed performance and technical information about the ${year} ${manufacturer} ${model} ${trim} car. 
    make sure all the keys exists in the json, with the correct data type, act like you are a car expert and dont make the response too long.
    use correct units for the data, use metric units as in they use in ${locale}.
    give accurate asnswers in the values, dont make up values or make the response too long.
    make the values only as a short ansert to the key, dont make it too long.
    Provide the information in a JSON format with the following structure:
    {
      "performance": {
        "acceleration": "0-100 km/h time in seconds ",
        "top_speed": "Maximum speed in km/h ",
        "horsepower": "Engine horsepower ",
        "torque": "Engine torque in Nm ",
        "fuel_consumption_city": "City fuel consumption in L/100km ",
        "fuel_consumption_highway": "Highway fuel consumption in L/100km "
      },
      "tuning": {
        "tuning_potential": "Rating from 1-5 ",
        "tuning_notes": "Brief notes about tuning possibilities ",
        "common_upgrades": ["List of 3 common upgrades"]
      },
      "handling": {
        "handling_rating": "Rating from 1-5 ",
        "suspension_type": "Type of suspension ",
        "driving_characteristics": "Brief description of driving characteristics "
      },
      "reliability": {
        "reliability_rating": "Rating from 1-5 in ${locale}",
        "common_issues": ["List of 2-3 common issues in ${locale}"],
        "maintenance_cost": "Maintenance cost rating from 1-5 in ${locale}"
      }
    }
    Make sure all text values are in the requested language. Keep responses concise but informative.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(response));
  } catch (error) {
    console.error('Error generating car information:', error);
    return NextResponse.json(
      { error: 'Failed to generate car information' },
      { status: 500 }
    );
  }
} 