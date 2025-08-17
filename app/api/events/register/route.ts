import { NextRequest, NextResponse } from 'next/server';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    const carManufacturer = searchParams.get('carManufacturer');
    const carModel = searchParams.get('carModel');
    const carYear = searchParams.get('carYear');
    const plateNumber = searchParams.get('plateNumber');
    const message = searchParams.get('message');
    const event_name = searchParams.get('event_name');

    // Validate required fields
    if (!event_name) {
      return NextResponse.json(
        { error: 'Name or phone or email are required' },
        { status: 400 }
      );
    }

    // // Validate email format
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return NextResponse.json(
    //     { error: 'Invalid email format' },
    //     { status: 400 }
    //   );
    // }

    // Here you would typically save to a database
    // For now, we'll just log the registration and return success
    console.log('Event Registration:', {
      name,
    //   phone,
    //   email,
    //   carModel,
    //   carYear,
    //   plateNumber,
    //   message,
    //   timestamp: new Date().toISOString(),
      event: event_name
    });

    // Submit to Strapi (assuming there's a car-group-signups collection)
    const strapiResponse = await fetch(`${STRAPI_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {})
        },
        body: JSON.stringify({
            data:{
            attend_name:name,
            phone:phone,
            car_manufacturer:carManufacturer,
            car_model:carModel,
            car_plate_number:plateNumber,
            car_year:carYear,
            event_name: event_name
        }
        })
      });
  
      if (!strapiResponse.ok) {
        // Log error for debugging
        const errorText = await strapiResponse.text();
        console.error('Strapi Error:', errorText);
        // Return success even if Strapi fails (for demo purposes)
        return NextResponse.json({
          success: true,
          message: 'Successfully signed up',
        });
      }
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      registrationId: `REG-${Date.now()}`,
      event: event_name,
      date: '18 أغسطس 2025',
      time: '6:30 مساءً (18:30)'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
