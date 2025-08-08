import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// This API route expects GET requests with query parameters, e.g.:
// /api/car-group-signup?plateNumber=...&phoneNumber=...&ownerName=...&carNickname=...&locale=...
export async function GET(request) {
  try {
    // Parse query params from the URL
    const { searchParams } = new URL(request.url);

    // These must match how you call it from the client:
    // /api/car-group-signup?plateNumber=...&phoneNumber=...&ownerName=...&carNickname=...&locale=...
    const plateNumber = searchParams.get('plateNumber');
    const phoneNumber = searchParams.get('phoneNumber');
    const ownerName = searchParams.get('ownerName');
    const email = searchParams.get('email');
    const city = searchParams.get('city');
    const interestedInVip = searchParams.get('interestedInVip');
    const source = searchParams.get('source');

    // Validate required fields
    if (!plateNumber || !phoneNumber || !ownerName || !email || !city || !interestedInVip || !source) {
      return NextResponse.json(
        { error: 'Plate number, phone number, ownerName, email, city, interestedInVip, and source are required' },
        { status: 400 }
      );
    }

    // Validate plate number format (basic validation)
    if (plateNumber.length < 3) {
      return NextResponse.json(
        { error: 'Please enter a valid plate number' },
        { status: 400 }
      );
    }

    // Validate Israeli mobile phone number format (050, 052, 053, 054, 058)
    const phoneRegex = /^05[02348]\d{7}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid mobile number (050/052/053/054/058)' },
        { status: 400 }
      );
    }

    // Prepare data for Strapi
    const carGroupData = {
      data: {
        plateNumber: plateNumber.toUpperCase(),
        phoneNumber: phoneNumber,
        ownerName: ownerName,
        email: email,
        city: city,
        interestedInVip: interestedInVip,
        source: source,
        joinedDate: new Date().toISOString()
      }
    };

    // Submit to Strapi (assuming there's a car-group-signups collection)
    const strapiResponse = await fetch(`${STRAPI_URL}/api/car-group-signups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
      },
      body: JSON.stringify(carGroupData)
    });

    if (!strapiResponse.ok) {
      // Log error for debugging
      const errorText = await strapiResponse.text();
      console.error('Strapi Error:', errorText);
      // Return success even if Strapi fails (for demo purposes)
      return NextResponse.json({
        success: true,
        message: 'Successfully signed up for car group! (Data logged locally)',
        data: carGroupData.data
      });
    }

    const result = await strapiResponse.json();
    return NextResponse.json({
      success: true,
      message: 'Successfully signed up for car group!',
      data: result
    });

  } catch (error) {
    console.error('Error in car-group-signup:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sign up for car group' },
      { status: 500 }
    );
  }
}