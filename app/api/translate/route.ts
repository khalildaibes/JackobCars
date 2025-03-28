import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use server-side env variable
});

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a professional translator. Translate the following text to ${targetLang}, keep in mind that your are translating for a car website.`
      }, {
        role: "user",
        content: text
      }]
    });

    return NextResponse.json({ 
      translation: response.choices[0].message?.content 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Translation failed' }, 
      { status: 500 }
    );
  }
}
