import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify Strapi URL is set
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    console.log(` strapiUrl ${strapiUrl}`);
    if (!strapiUrl) {
      console.error('Strapi URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Log configuration for debugging
    console.log('Attempting to connect to Strapi at:', strapiUrl);
    
    try {
        console.log(` strapiUrl ${strapiUrl}`);
        console.log(` Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`);
        const strapiResponse = await fetch(`${strapiUrl}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          username: body.username,
          email: body.email,
          password: body.password,
        })
      });

      const data = await strapiResponse.json();
      console.log(` data ${JSON.stringify(data)}`);

      if (!strapiResponse.ok) {
        return NextResponse.json(
          { error: data.error?.message || 'Registration failed' },
          { status: strapiResponse.status }
        );
      }

      return NextResponse.json(data);
      
    } catch (fetchError) {
      console.error('Strapi connection error:', fetchError);
      return NextResponse.json(
        { 
          error: 'Unable to connect to authentication service',
          details: 'Please ensure the Strapi server is running'
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration request processing failed' },
      { status: 500 }
    );
  }
} 