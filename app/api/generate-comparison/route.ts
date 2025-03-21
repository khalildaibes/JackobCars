import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { make, model, year, specs } = await request.json();

    const prompt = `
      Analyze this ${year} ${make} ${model} car and provide:
      1. A list of 3-5 major pros/advantages
      2. A list of 3-5 major cons/disadvantages
      3. Additional insights about:
         - Reliability
         - Value for money
         - Performance
         - Safety features
         - Environmental impact
         - Technology features
      
      Car specifications:
      ${JSON.stringify(specs, null, 2)}
      
      Format the response as a JSON object with the following structure:
      {
        "pros": ["pro1", "pro2", ...],
        "cons": ["con1", "con2", ...],
        "additionalFeatures": {
          "reliability": "...",
          "valueForMoney": "...",
          "performance": "...",
          "safetyFeatures": "...",
          "environmentalImpact": "...",
          "technologyFeatures": "..."
        }
      }
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
    console.error('Error generating comparison:', error);
    return NextResponse.json(
      { error: 'Failed to generate comparison' },
      { status: 500 }
    );
  }
} 