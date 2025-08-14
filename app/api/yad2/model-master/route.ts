import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

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
// For this example you need the node-fetch npm packages: `npm i node-fetch`


    const url = `${YAD2_API_BASE_URL}${encodeURIComponent(licensePlate)}`;
    // fetch(`https://api.scraperapi.com/?api_key=0a06de12ff661cc5e1da2364c97be83b&url=${url}`)
    //   .then(response => {
    //     console.log("response is", response);
    //     return NextResponse.json(response); 
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   });

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0',
      },
      // Revalidate on each request; adjust if needed
        // cache: 'no-store',
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


