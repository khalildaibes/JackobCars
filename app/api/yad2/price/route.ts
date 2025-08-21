import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
// 675b8fa0b33b7e65fce8501057f7dd775af36b2e31ce8e9dd34ba075f1f6f48d
const YAD2_PRICE_BASE_URL = 'https://gw.yad2.co.il/price-list/calculate-price?';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subModelId = searchParams.get('subModelId');
    const kilometers = searchParams.get('kilometers') || 0;
    const ascentYearOnRoad = searchParams.get('ascentYearOnRoad');
    const ascentMonthOnRoad = searchParams.get('ascentMonthOnRoad');

    if (!subModelId || !ascentYearOnRoad || !ascentMonthOnRoad) {
      return NextResponse.json(
        { error: 'subModelId, ascentYearOnRoad and ascentMonthOnRoad are required' },
        { status: 400 }
      );
    }

    const url = `${YAD2_PRICE_BASE_URL}modelMasterId=${subModelId}&kilometers=${kilometers}&ascentYearOnRoad=${ascentYearOnRoad}`;
    fetch(`${url}`)
      .then(response => {
        console.log("response is", response);
        return NextResponse.json(response); 
      })
      .catch(error => {
        console.log(error)
      });
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: 'Failed to fetch price from Yad2', details: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}




