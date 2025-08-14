import { NextResponse } from 'next/server';

const YAD2_API_BASE_URL = 'https://gw.yad2.co.il/car-data-gov/model-master/?licensePlate=';

export async function GET(request) {
  try {
 // Parse query params from the URL
 const { searchParams } = new URL(request.url);

 // These must match how you call it from the client:
 // /api/car-group-signup?plateNumber=...&phoneNumber=...&ownerName=...&carNickname=...&locale=...
 const licensePlate = searchParams.get('licensePlate');
  if (!licensePlate || typeof licensePlate !== 'string') {
      return NextResponse.json({ error: 'licensePlate is required' }, { status: 400 });
    }

    const url = `${YAD2_API_BASE_URL}${encodeURIComponent(licensePlate)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0',
      },
      // Revalidate on each request; adjust if needed
      cache: 'no-store',
    });
    const data = await response.json();
    console.log("licensePlate data is", data);
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: 'Failed to fetch from Yad2', details: text }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}


