import { NextResponse } from 'next/server';

const GOV_API_BASE_URL = 'https://data.gov.il/he/api/3/action/datastore_search';
const RESOURCE_ID = '053cea08-09bc-40ec-8f7a-156f0677aff3';

export async function GET(request) {
  try {
    // Parse query params from the URL
    const { searchParams } = new URL(request.url);

    const licensePlate = searchParams.get('licensePlate');
    if (!licensePlate) {
      return NextResponse.json({ error: 'licensePlate is required' }, { status: 400 });
    }

    console.log("Fetching government car data for license plate:", licensePlate);
    
    // Construct the government API URL with the exact same format as curl
    const govApiUrl = `${GOV_API_BASE_URL}?resource_id=${RESOURCE_ID}&q=${licensePlate}`;
    console.log('Government API URL:', govApiUrl);

    // Use the exact same headers as the curl request
    const response = await fetch(govApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Connection': 'keep-alive',
        'Cookie': 'ckan=10e7df5b3f4e4266ed3d992b34989169b2015915gAJ9cQAoWAcAAABfZG9tYWlucQFOWAUAAABfcGF0aHECWAEAAAAvcQNYAwAAAF9pZHEEWCAAAABmY2EwYTE1YWY3N2Y0ODQ1YTMxNzNkYmU5OTU5ZWNkNXEFWgYAAABfZnJlc2hxBolYDgAAAF9jcmVhdGlvbl90aW1lcQdHQdm0xWFZFXxYDgAAAF9hY2Nlc3NlZF90aW1lcQhHQdopzIOQtoFYCAAAAF9leHBpcmVzcQljZGF0ZXRpbWUKZGF0ZXRpbWUKcQpjX19jb2RlY3MKZW5jb2RlCnELWAsAAAAHw7YBEwMODgAAAHEMWAYAAABsYXRpbjFxDWJxDlJxEFJxEVgSAAAAYW5hbHl0aWNzX3JvcRJyUnETKFgLAAAAY3Vycl9vcmdfaWRxFFgkAAAAZTlEMmNlM2ItZDY2MS00ZmVhLTgyOTEtNjU2MjVhZDhmMzY0cRVYDwAAYW5hbHl0aWNzNF9jb2RlcRZdcRdYDA==; rbzid=g7yHZClGMy6hHX0R7t0XUKXqmSv7OeGAmSHp4VAXy/FT87hcPOtLWmChq8lP8EGvUCrjdPOcwV+j9vVxJ8GmOgCPA0q8i4KtBlxz6MbeAuMJpYCgsJuW8VdIB/45lWgMC/+4xI/gNUYPAT1xSAtjXQP+9s+p4YLnRJuFQEWWXFwcHgqhJRLmylV7nzL++Zj8OegjbMn9yIaLMy9+Xfi1RQ==; rbzsessionid=6523bc43d37b89be36c6a847afab8ac8; ckan=3619d27817a185dae476caafd2159978e1642deegAJ9cQAoWAcAAABfZG9tYWlucQFOWAUAAABfcGF0aHECWAEAAAAvcQNYAwAAAF9pZHEEWCAAAAA1N2I3M2U0MjZhMGU0Y2Y5ODQ4MmIwMTcxMWQzZjU0MnEFWgYAAABfZnJlc2hxBolYDgAAAF9jcmVhdGlvbl90aW1lcQdHQdopxuiV54VYDgAAAF9hY2Nlc3NlZF90aW1lcQhHQdopzLPQEe5YCAAAAF9leHBpcmVzcQljZGF0ZXRpbWUKZGF0ZXRpbWUKcQpjX19jb2RlY3MKZW5jb2RlCnELWAsAAAAHw7YBEwMODgAAAHEMWAYAAABsYXRpbjFxDWJxDlJxEFJxEVgSAAAAYW5hbHl0aWNzX3JvcRJyUnETKFgLAAAAY3Vycl9vcmdfaWRxFFgkAAAAZTlEMmNlM2ItZDY2MS00ZmVhLTgyOTEtNjU2MjVhZDhmMzY0cRVYDwAAYW5hbHl0aWNzNF9jb2RlcRZdcRdYDA==',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'TE': 'trailers',
        'Alt-Used': 'data.gov.il',
        'Priority': 'u=0, i',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    console.log('Government API response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Government API request failed:', response.status, text);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      return NextResponse.json({ 
        error: 'Failed to fetch from government API', 
        details: text,
        status: response.status,
        url: govApiUrl
      }, { status: response.status });
    }

    try {
      const data = await response.json();
      console.log('Government car data received:', data);
      console.log('Data structure:', {
        hasResult: !!data.result,
        hasRecords: !!data.result?.records,
        recordCount: data.result?.records?.length || 0,
        success: data.success,
        help: data.help
      });
      
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const textResponse = await response.text();
      console.log('Raw response text:', textResponse.substring(0, 1000));
      
      return NextResponse.json({ 
        error: 'Invalid JSON response from government API',
        details: 'Response is not valid JSON',
        rawResponse: textResponse.substring(0, 500)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in government car data API:', error);
    return NextResponse.json({ 
      error: error?.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
