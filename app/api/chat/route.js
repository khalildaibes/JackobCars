import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const chatUrl = body.chatUrl || 'http://64.227.112.249:5678/webhook-test/cfdce0db-04e5-4f9a-9d23-df65829955a0';
    
    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: body.message
      }),
    });

    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('Raw response length:', responseText.length);
    console.log('Raw response content:', responseText);

    if (!responseText.trim()) {
      throw new Error('Empty response received from server');
    }

    return NextResponse.json({message:responseText});
  } catch (error) {
    console.error('Chat proxy error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process chat request: ' + error.message },
      { status: 500 }
    );
  }
} 

// what is your Car Detailing Assistant - Knowledge Base