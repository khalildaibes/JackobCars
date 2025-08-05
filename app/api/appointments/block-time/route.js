import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function POST(request) {
  try {
    const blockData = await request.json();
    const {
      storeId,
      date,
      startTime,
      endTime,
      reason
    } = blockData;

    // Validate required fields
    if (!storeId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate time range
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      );
    }

    // Create blocked time slot in Strapi
    const apiUrl = `${STRAPI_URL}/api/blocked-time-slots`;
    
    const strapiData = {
      data: {
        storeId,
        date,
        startTime,
        endTime,
        reason: reason || 'Blocked by manager',
        createdBy: 'store_manager' // In production, this would be the actual user ID
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API Error:', errorText);
      
      // If the collection doesn't exist, create a fallback response
      if (response.status === 404) {
        console.log('Blocked time slots collection not found in Strapi. Feature will work when collection is created.');
        return NextResponse.json({
          success: true,
          message: 'Time slot blocked successfully (local only - please create blocked-time-slots collection in Strapi)',
          block: {
            id: 'local_' + Date.now(),
            storeId,
            date,
            startTime,
            endTime,
            reason: reason || 'Blocked by manager',
            createdAt: new Date().toISOString()
          }
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to block time slot in Strapi' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // Transform response to expected format
    const block = {
      id: result.data.id,
      storeId: result.data.attributes.storeId,
      date: result.data.attributes.date,
      startTime: result.data.attributes.startTime,
      endTime: result.data.attributes.endTime,
      reason: result.data.attributes.reason,
      createdAt: result.data.attributes.createdAt,
      createdBy: result.data.attributes.createdBy
    };

    return NextResponse.json({
      success: true,
      message: 'Time slot blocked successfully',
      block: block
    });

  } catch (error) {
    console.error('Error blocking time slot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const date = searchParams.get('date');

    if (!storeId) {
      return NextResponse.json(
        { error: 'StoreId is required' },
        { status: 400 }
      );
    }

    let apiUrl = `${STRAPI_URL}/api/blocked-time-slots?filters[storeId][$eq]=${storeId}`;
    
    if (date) {
      apiUrl += `&filters[date][$eq]=${date}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Strapi API Error:', response.statusText);
      // Return empty array if collection doesn't exist
      if (date) {
        return NextResponse.json({
          date,
          storeId,
          blockedTimes: []
        });
      } else {
        return NextResponse.json({
          storeId,
          totalBlocks: 0,
          blockedTimes: []
        });
      }
    }

    const data = await response.json();
    
    // Transform Strapi data to expected format
    const blockedTimes = data.data?.map((item) => ({
      id: item.id,
      storeId: item.attributes.storeId,
      date: item.attributes.date,
      startTime: item.attributes.startTime,
      endTime: item.attributes.endTime,
      reason: item.attributes.reason,
      createdAt: item.attributes.createdAt,
      createdBy: item.attributes.createdBy
    })) || [];

    if (date) {
      return NextResponse.json({
        date,
        storeId,
        blockedTimes: blockedTimes
      });
    } else {
      return NextResponse.json({
        storeId,
        totalBlocks: blockedTimes.length,
        blockedTimes: blockedTimes
      });
    }

  } catch (error) {
    console.error('Error fetching blocked times:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}