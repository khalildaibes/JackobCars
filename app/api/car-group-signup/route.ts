import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get('phoneNumber');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const plateNumber = searchParams.get('plateNumber');
    const city = searchParams.get('city');
    const interestedInVip = searchParams.get('interestedInVip');
    const source = searchParams.get('source');

    // Validate required fields
    if (!phoneNumber || !username || !email) {
      return NextResponse.json(
        { error: 'Phone number, username, and email are required' },
        { status: 400 }
      );
    }

    // Validate phone number format (Israeli specific)
    const cleanedPhone = phoneNumber.replace(/\s|-/g, '');
    const israelPhoneRegex = /^(?:\+972|0)([2345789])\d{7,8}$/;
    if (!israelPhoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { error: 'Invalid Israeli phone number format' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send to Strapi (POST request to Strapi's /api/users)
    const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiToken) {
      console.error('STRAPI_API_TOKEN not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(`${strapiUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          phoneNumber: phoneNumber,
          username: username,
          email: email,
          plateNumber: plateNumber || '',
          city: city || '',
          interestedInVip: interestedInVip === 'true',
          source: source || 'vip_car_community',
          createdAt: new Date().toISOString(),
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Strapi API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'VIP registration successful',
      data: result
    });

  } catch (error) {
    console.error('Error saving VIP user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
