import { NextRequest, NextResponse } from 'next/server';

const YAD2_API_URL = 'https://gw.yad2.co.il/car-data-gov/model-master';

export async function GET(request: NextRequest) {
  try {
    // Parse query params from the URL
    const { searchParams } = new URL(request.url);

    const licensePlate = searchParams.get('licensePlate');
    if (!licensePlate) {
      return NextResponse.json({ error: 'licensePlate is required' }, { status: 400 });
    }

    // Convert license plate to number and validate
    const licensePlateNumber = parseInt(licensePlate, 10);
    if (isNaN(licensePlateNumber)) {
      return NextResponse.json({ error: 'licensePlate must be a valid number' }, { status: 400 });
    }

    console.log("Fetching licensePlate:", licensePlateNumber);
    
    // Construct the Yad2 API URL with the exact same format as curl
    const yad2ApiUrl = `${YAD2_API_URL}?licensePlate=${licensePlateNumber}`;
    console.log('Yad2 API URL:', yad2ApiUrl);

    // Use the exact same headers as the curl request
    const response = await fetch(yad2ApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Connection': 'keep-alive',
        'Cookie': 'uzmx=7f9000cc61750b-e4e0-41dc-8ef4-92c87da37ab38-17502794884355508816001-20d4ab5b93199fe81534; __ssds=0; y2018-2-cohort=77; cohortGroup=D; __uzma=b6c14d2a-78fe-4907-a5b5-6f52ac0d5d90; __uzmb=1750279490; __uzme=2623; __uzmc=88037120795730; __uzmd=1755788303; __uzmf=7f9000b6c14d2a-78fe-4907-a5b5-6f52ac0d5d907-1754827678150960626286-0002367fb78e248c62b1207; guest_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InV1aWQiOiI4ZDQ2YTRiMS1kMzE3LTQ0ZDUtOTU3MS1jZTdjNDg1YWY5MjQifSwiaWF0IjoxNzU1NzYxMDkzLCJleHAiOjE3ODczMTg2OTN9.ZFp8GYQbqU6BdsUSoteBDj2fzcB65YS2FR_El6IliKQ; ab.storage.deviceId.716d3f2d-2039-4ea6-bd67-0782ecd0770b=g%3Ae87da835-4baf-acf2-57f7-77d885525504%7Ce%3Aundefined%7Cc%3A1750279497494%7Cl%3A1755760575067; glassix-visitor-id-v2-eee15832-4aee-4db2-873b-7cdb8a61035e=be7d11f7-487c-4b42-9504-6fe988578960; leadSaleRentFree=75; refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImtoYWxpbGRhaWJlczFAZ21haWwuY29tIiwiTWFpbGluZ0VtYWlsIjoia2hhbGlsZGFpYmVzMUBnbWFpbC5jb20iLCJFbWFpbCI6ImtoYWxpbGRhaWJlczFAZ21haWwuY29tIiwiVXNlcklEIjo4Mjc2NzQ5LCJGaXJzdE5hbWUiOiJraGFsaWwiLCJMYXN0TmFtZSI6ImRhaWJlcyIsImlzQ2FyVHJhZGVyIjpudWxsLCJpc0NhckFjY2Vzc29yeVRyYWRlciI6MCwiaXNUb3VyaXNtVHJhZGVyIjowLCJpc1JlYWxFc3RhdGVNYXJrZXRpbmciOjAsIllhZDJUcmFkZSI6MCwiRW1haWxWZXJpZmllZCI6IjIwMjQtMDItMTZUMTA6NDk6MDMuMDAwWiIsImlzVHdvV2hlZWxlZFRyYWRlciI6bnVsbCwiVGl2IjowLCJNYWlsaW5nTGlzdCI6MSwiVVVJRCI6IjNjNmUxYTE1LWNjYTgtMTFlZS1iNDA3LTAyYmExMzBlMzI0MSIsImlhdCI6MTc1NDk4NTM1MCwiZXhwIjoxNzYyNzYxMzUwfQ._Q9MezOjnPGk9Qgssddym_1S5suIcP3B0ycc5eeTWc0; ab.storage.userId.716d3f2d-2039-4ea6-bd67-0782ecd0770b=g%3A3c6e1a15-cca8-11ee-b407-02ba130e3241%7Ce%3Aundefined%7Cc%3A1754985362106%7Cl%3A1755760575067; ab.storage.sessionId.716d3f2d-2039-4ea6-bd67-0782ecd0770b=g%3A2911d7f0-80ca-8ccc-5e27-6bc54435656d%7Ce%3A1755763527131%7Cc%3A1755760575067%7Cl%3A1755761727131; abTestKey=17; canary=never; favorites_userid=fvu8276749; cookie-implementation-disclaimer-consent=1; uzmx=7f9000abfa1688-a355-43d5-a108-c506fc88d2ce2-1754987572410800754620-d19e598e60b8336b43; __uzma=b86d4a2c-5ec2-4736-87f1-f10adf2da77e; __uzmb=1754987571; __uzmc=33054121090253; __uzmd=1755788326; __uzme=4413; __uzmf=7f9000b6c14d2a-78fe-4907-a5b5-6f52ac0d5d907-1754827678150960648880-000dab371070721181d1210',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'If-None-Match': 'W/"16d-O3jHEvLVU8ksvdMyeXfopdZfu84"',
        'Priority': 'u=0, i'
      }
    });

    console.log('Yad2 API response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Yad2 API request failed:', response.status, text);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      return NextResponse.json({ 
        error: 'Failed to fetch from Yad2 API', 
        details: text,
        status: response.status,
        url: yad2ApiUrl
      }, { status: response.status });
    }

    try {
      const data = await response.json();
      console.log('Yad2 license plate data received:', data);
      
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const textResponse = await response.text();
      console.log('Raw response text:', textResponse.substring(0, 1000));
      
      return NextResponse.json({ 
        error: 'Invalid JSON response from Yad2 API',
        details: 'Response is not valid JSON',
        rawResponse: textResponse.substring(0, 500)
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in Yad2 model-master API:', error);
    return NextResponse.json({ 
      error: error?.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}


