import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'ar';
    
    const body = await request.json();
    const { make, model, year, specs } = body;

    const prompt = `
      Analyze this ${year} ${make} ${model} car and provide a detailed analysis in ${locale} language.
      Focus on the following aspects:
      1. A list of 3-5 major pros/advantages
      2. A list of 3-5 major cons/disadvantages
      3. Reliability assessment
      
      Car specifications:
      ${JSON.stringify(specs, null, 2)}
      
      Format the response as a JSON object with the following structure:
      {
        "pros": ["pro1", "pro2", ...],
        "cons": ["con1", "con2", ...],
        "reliability": {
          "rating": "rating from 1-5",
          "description": "detailed reliability assessment",
          "common_issues": ["issue1", "issue2", ...]
        }
      }

      Make sure to provide a detailed and comprehensive analysis of the car.
      All text should be in ${locale} language.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(response || '{}');

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error in prosandcons API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 