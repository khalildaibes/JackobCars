import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function PATCH(request, { params }) {
  try {
    const { imageId } = params;
    const updateData = await request.json();

    // Update work gallery image in Strapi
    const apiUrl = `${STRAPI_URL}/api/work-galleries/${imageId}`;
    
    const strapiData = {
      data: updateData
    };

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to update image in Strapi' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // Transform response to expected format
    const image = {
      id: result.data.id,
      storeId: result.data.attributes.storeId,
      title: result.data.attributes.title,
      description: result.data.attributes.description,
      imageUrl: result.data.attributes.imageUrl,
      category: result.data.attributes.category,
      serviceType: result.data.attributes.serviceType,
      tags: result.data.attributes.tags ? result.data.attributes.tags.split(',').map((tag) => tag.trim()) : [],
      isFeatured: result.data.attributes.isFeatured,
      isBeforeAfter: result.data.attributes.isBeforeAfter,
      beforeImageUrl: result.data.attributes.beforeImageUrl,
      afterImageUrl: result.data.attributes.afterImageUrl,
      customerCar: result.data.attributes.customerCar,
      createdAt: result.data.attributes.createdAt,
      updatedAt: result.data.attributes.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Image updated successfully',
      image: image
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { imageId } = params;

    // Delete work gallery image from Strapi
    const apiUrl = `${STRAPI_URL}/api/work-galleries/${imageId}`;
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to delete image from Strapi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { imageId } = params;

    // Fetch work gallery image from Strapi
    const apiUrl = `${STRAPI_URL}/api/work-galleries/${imageId}?populate=*`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API Error:', errorText);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const result = await response.json();
    
    // Transform response to expected format
    const image = {
      id: result.data.id,
      storeId: result.data.attributes.storeId,
      title: result.data.attributes.title,
      description: result.data.attributes.description,
      imageUrl: result.data.attributes.imageUrl,
      category: result.data.attributes.category,
      serviceType: result.data.attributes.serviceType,
      tags: result.data.attributes.tags ? result.data.attributes.tags.split(',').map((tag) => tag.trim()) : [],
      isFeatured: result.data.attributes.isFeatured,
      isBeforeAfter: result.data.attributes.isBeforeAfter,
      beforeImageUrl: result.data.attributes.beforeImageUrl,
      afterImageUrl: result.data.attributes.afterImageUrl,
      customerCar: result.data.attributes.customerCar,
      createdAt: result.data.attributes.createdAt,
      updatedAt: result.data.attributes.updatedAt,
    };

    return NextResponse.json({
      image: image
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}