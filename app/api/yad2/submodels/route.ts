import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get('modelId');

  if (!modelId) {
    return NextResponse.json({ error: 'Model ID is required' }, { status: 400 });
  }
//   http://64.227.112.249:3000/fetch-json?mode=direct&url=
  try {
    const response = await fetch(`https://gw.yad2.co.il/price-list/search-options/${modelId}/sub-models`,{
        headers: {
            'Accept': 'application/json',

            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    });
    console.log('Response:', response);
    if (!response.ok) {
      console.error('Yad2 API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch submodels' }, { status: response.status });
    }

    const data = await response.json();
    console.log('Submodels data received:', JSON.stringify(data, null, 2));
    console.log('Submodels fetched successfully for model:', modelId);
    console.log('Data structure:', {
      hasData: !!data.data,
      dataLength: data.data?.length || 0,
      firstItem: data.data?.[0] || null,
      message: data.message
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching submodels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
