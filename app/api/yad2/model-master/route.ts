import { NextResponse } from 'next/server';

const YAD2_API_BASE_URL = 'https://gw.yad2.co.il/car-data-gov/model-master/?licensePlate=';

export async function GET(request: Request) {
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
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
        Referer: 'https://www.yad2.co.il/',
        Origin: 'https://www.yad2.co.il',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();

    // Try to parse JSON if appropriate; otherwise return an error with snippet
    let parsed: any = null;
    if (contentType.includes('application/json')) {
      try {
        parsed = JSON.parse(rawBody);
      } catch (e: any) {
        return NextResponse.json(
          { error: 'Invalid JSON from Yad2', details: e?.message, snippet: rawBody.slice(0, 300) },
          { status: 502 }
        );
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Yad2', status: response.status, snippet: rawBody.slice(0, 500) },
        { status: response.status }
      );
    }

    if (!parsed) {
      // Upstream returned HTML or other content instead of JSON
      return NextResponse.json(
        { error: 'Upstream did not return JSON', snippet: rawBody.slice(0, 500), contentType },
        { status: 502 }
      );
    }

    console.log('licensePlate data is', parsed);
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}


