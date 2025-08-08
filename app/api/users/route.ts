import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let phoneNumber = searchParams.get('phoneNumber');

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    // Israeli phone number validation: starts with +972 or 0, followed by 8 or 9 digits (mobile or landline)
    // Accepts formats like +972501234567, 0501234567, 0721234567, etc.
    const cleanedPhone = phoneNumber.replace(/\s|-/g, '');
    const israelPhoneRegex = /^(?:\+972|0)([2345789])\d{7,8}$/;
    if (!israelPhoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { error: 'Invalid Israeli phone number format' },
        { status: 400 }
      );
    }

    // Send to Strapi
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const strapiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

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
      message: 'Phone number saved successfully',
      data: result
    });

  } catch (error) {
    console.error('Error saving user phone number:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
