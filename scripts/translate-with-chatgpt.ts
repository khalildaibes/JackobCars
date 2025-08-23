import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'ar';
 // Parse query params from the URL
 const { searchParams } = new URL(request.url);

      const data = JSON.parse(searchParams.get('data') || '{}');
      console.log('data', data)
    const prompt = `
      translate the following text to ${locale} language:
      you are a assistant for a car company thar sell cars in ${locale} language.
      you are given a car details and you need to translate the car details to ${locale} language.
      the cars details are:
      ${JSON.stringify(data, null, 2)}
      
      Return only the translated version of the car details.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    const description = completion.choices[0].message.content;

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error in createDescription API:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
