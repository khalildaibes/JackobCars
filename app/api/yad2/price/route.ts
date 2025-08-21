

import { NextRequest, NextResponse } from 'next/server';
const PROXY_BASE_URL = 'http://64.227.112.249:3000/fetch-json?mode=direct&url=';
const YAD2_PRICE_BASE_URL = 'https://gw.yad2.co.il/price-list/calculate-price?';
export async function GET(request: NextRequest) {
  try {
    // Parse query params from the URL
    const { searchParams } = new URL(request.url);
    const modelMasterId = searchParams.get('subModelId');
    const kilometers = searchParams.get('kilometers');
    const ascentYearOnRoad = searchParams.get('ascentYearOnRoad');

    if (!modelMasterId || !kilometers || !ascentYearOnRoad) {
      return NextResponse.json({ error: 'modelMasterId, kilometers, and ascentYearOnRoad are required' }, { status: 400 });
    }

    // Convert license plate to number and validate
    const licensePlateNumber = parseInt(modelMasterId, 10);
    if (isNaN(licensePlateNumber)) {
      return NextResponse.json({ error: 'licensePlate must be a valid number' }, { status: 400 });
    }

    console.log("Fetching modelMasterId:", modelMasterId);
    
    // Construct the proxy request with proper parameters
    const proxyUrl = `${PROXY_BASE_URL}`;
    const targetUrl = `${YAD2_PRICE_BASE_URL}modelMasterId=${modelMasterId}&kilometers=${kilometers}&ascentYearOnRoad=${ascentYearOnRoad}`;
    
    console.log('Target Yad2 URL:', targetUrl);
    console.log('Proxy URL:', proxyUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      
    });
    console.log('Proxy response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Proxy request failed:', response.status, text);
      return NextResponse.json({ 
        error: 'Failed to fetch from proxy service', 
        details: text 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('License plate data received:', data);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in model-master API:', error);
    return NextResponse.json({ 
      error: error?.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}


