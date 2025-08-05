import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// GET a specific part
export async function GET(request, { params }) {
  try {
    const { partId } = params;
    
    const response = await fetch(`${STRAPI_URL}/api/parts/${partId}?populate=*`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch part' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching part:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a specific part
export async function PUT(request, { params }) {
  try {
    const { partId } = params;
    const updateData = await request.json();
    
    console.log('Updating part:', partId, 'with data:', updateData);
    
    // Remove storeId from updateData as it's not needed in Strapi update
    const { storeId, ...strapiUpdateData } = updateData;
    
    console.log('Data to send to Strapi:', strapiUpdateData);
    
    const response = await fetch(`${STRAPI_URL}/api/parts/${partId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: strapiUpdateData
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi PUT error:', errorText);
      return NextResponse.json(
        { error: 'Failed to update part' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating part:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a specific part
export async function DELETE(request, { params }) {
  try {
    const { partId } = params;
    
    const response = await fetch(`${STRAPI_URL}/api/parts/${partId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete part' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting part:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}