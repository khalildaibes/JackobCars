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
      Create a detailed and engaging description for this ${data.year} ${data.make} ${data.model} car in ${locale} language.
      
      The description should be comprehensive and include:
      1. An overview of the car's design and style
      2. Key features and specifications
      3. Performance characteristics
      4. Comfort and convenience features
      5. Safety features
      6. Overall appeal and target audience
      
      Car specifications:
      ${JSON.stringify(data, null, 2)}
      
      The description should be:
      - Written in ${locale} language
      - Engaging and informative
      - Approximately 150-200 words
      - Professional yet appealing to potential buyers
      - Highlight the car's strengths and unique selling points
      
      Return only the description text, no JSON formatting or additional text.
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
