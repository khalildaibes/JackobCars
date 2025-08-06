import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Next.js app router API routes use the new Request object, not Express-style req.query
export async function GET(request) {
  try {
    // Parse query params from the URL
    const { searchParams } = new URL(request.url);

    const plateNumber = searchParams.get('plateNumber');
    const phoneNumber = searchParams.get('phoneNumber');
    const ownerName = searchParams.get('ownerName');
    const carNickname = searchParams.get('carNickname');
    const locale = searchParams.get('locale');

    // Validate required fields
    if (!plateNumber || !phoneNumber || !ownerName) {
      return NextResponse.json(
        { error: 'Plate number, phone number, and owner name are required' },
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

    // Prepare data for storage
    const carGroupData = {
      data: {
        plateNumber: plateNumber.toUpperCase(),
        phoneNumber: phoneNumber,
        ownerName: ownerName,
        carNickname: carNickname || '',
        locale: locale || 'en',
        joinedDate: new Date().toISOString()
      }
    };

    // Submit to Strapi (assuming there's a car-group-signups collection)
    console.log(`🔗 Attempting to connect to Strapi: ${STRAPI_URL}/api/car-group-signups`);
    console.log(`🔑 Using token: ${STRAPI_TOKEN ? 'Token exists' : 'No token found'}`);
    
    const strapiResponse = await fetch(`${STRAPI_URL}/api/car-group-signups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : undefined
      },
      body: JSON.stringify(carGroupData)
    });

    console.log(`📡 Strapi Response Status: ${strapiResponse.status} ${strapiResponse.statusText}`);

    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.error('❌ Strapi Error:', errorText);
      console.log('💾 Fallback: Logging data locally:', carGroupData);
      
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
      { error: error.message || 'Failed to sign up for car group' },
      { status: 500 }
    );
  }
} 