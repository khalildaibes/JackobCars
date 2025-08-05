import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// GET a specific product
export async function GET(request, { params }) {
  try {
    const { productId } = params;
    
    const response = await fetch(`${STRAPI_URL}/api/deals/${productId}?populate=*`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a specific product
export async function PUT(request, { params }) {
  try {
    const { productId } = params;
    const updateData = await request.json();
    
    console.log('Updating product:', productId, 'with data:', updateData);
    
    // Remove storeId from updateData as it's not needed in Strapi update
    const { storeId, ...strapiUpdateData } = updateData;
    
    console.log('Data to send to Strapi:', strapiUpdateData);
    
    const response = await fetch(`${STRAPI_URL}/api/deals/${productId}`, {
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
        { error: 'Failed to update product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a specific product
export async function DELETE(request, { params }) {
  try {
    const { productId } = params;
    
    const response = await fetch(`${STRAPI_URL}/api/deals/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}