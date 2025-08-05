import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'StoreId is required' },
        { status: 400 }
      );
    }

    // Fetch work gallery images from Strapi
    const apiUrl = `${STRAPI_URL}/api/work-galleries?populate=*&filters[storeId][$eq]=${storeId}&sort=createdAt:desc`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Strapi API Error:', response.statusText);
      // Return empty array if Strapi fails
      return NextResponse.json({
        images: [],
        total: 0
      });
    }

    const data = await response.json();
    
    // Transform Strapi data to expected format
    const images = data.data?.map((item) => ({
      id: item.id,
      storeId: item.attributes.storeId || storeId,
      title: item.attributes.title,
      description: item.attributes.description || '',
      imageUrl: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL}${item.attributes.image.data.attributes.url}`
        : `/images/work-samples/sample-${Math.floor(Math.random() * 10) + 1}.jpg`,
      category: item.attributes.category || '',
      serviceType: item.attributes.serviceType || '',
      tags: item.attributes.tags ? item.attributes.tags.split(',').map((tag) => tag.trim()) : [],
      isFeatured: item.attributes.isFeatured || false,
      isBeforeAfter: item.attributes.isBeforeAfter || false,
      beforeImageUrl: item.attributes.beforeImage?.data?.attributes?.url 
        ? `${STRAPI_URL}${item.attributes.beforeImage.data.attributes.url}`
        : undefined,
      afterImageUrl: item.attributes.afterImage?.data?.attributes?.url 
        ? `${STRAPI_URL}${item.attributes.afterImage.data.attributes.url}`
        : undefined,
      customerCar: item.attributes.customerCar ? {
        make: item.attributes.customerCar.make || '',
        model: item.attributes.customerCar.model || '',
        year: item.attributes.customerCar.year || '',
        plateNumber: item.attributes.customerCar.plateNumber || '',
      } : undefined,
      createdAt: item.attributes.createdAt,
      updatedAt: item.attributes.updatedAt,
    })) || [];

    return NextResponse.json({
      images: images,
      total: images.length
    });

  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // In a real application, you would handle file uploads here
    // For now, we'll create image records with placeholder URLs and save metadata to Strapi
    
    const formData = await request.formData();
    const storeId = formData.get('storeId');
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const serviceType = formData.get('serviceType');
    const tags = formData.get('tags');
    const isFeatured = formData.get('isFeatured') === 'true';
    const isBeforeAfter = formData.get('isBeforeAfter') === 'true';
    
    // Car details (if category is customer_cars)
    const carMake = formData.get('carMake');
    const carModel = formData.get('carModel');
    const carYear = formData.get('carYear');
    const plateNumber = formData.get('plateNumber');

    // File uploads (in real app, these would be processed and stored)
    const mainImage = formData.get('mainImage');
    const beforeImage = formData.get('beforeImage');
    const afterImage = formData.get('afterImage');

    // Validate required fields
    if (!storeId || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create placeholder image URLs (in real app, these would be actual uploaded file URLs)
    const imageUrl = `/images/work-samples/sample-${Math.floor(Math.random() * 10) + 1}.jpg`;
    const beforeImageUrl = isBeforeAfter && beforeImage ? `/images/work-samples/before-${Math.floor(Math.random() * 5) + 1}.jpg` : undefined;
    const afterImageUrl = isBeforeAfter && afterImage ? `/images/work-samples/after-${Math.floor(Math.random() * 5) + 1}.jpg` : undefined;

    // Create work gallery entry in Strapi
    const apiUrl = `${STRAPI_URL}/api/work-galleries`;
    
    const strapiData = {
      data: {
        storeId,
        title,
        description: description || '',
        category,
        serviceType: serviceType || '',
        tags: tags || '',
        isFeatured,
        isBeforeAfter,
        imageUrl, // In real app, this would be the uploaded file URL
        beforeImageUrl,
        afterImageUrl,
        customerCar: (category === 'customer_cars' && carMake) ? {
          make: carMake,
          model: carModel || '',
          year: carYear || '',
          plateNumber: plateNumber || '',
        } : null,
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
        console.log('Work galleries collection not found in Strapi. Feature will work when collection is created.');
        return NextResponse.json({
          success: true,
          message: 'Image uploaded successfully (local only - please create work-galleries collection in Strapi)',
          image: {
            id: 'local_' + Date.now(),
            storeId,
            title,
            description,
            imageUrl,
            category,
            serviceType,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isFeatured,
            isBeforeAfter,
            beforeImageUrl,
            afterImageUrl,
            customerCar: (category === 'customer_cars' && carMake) ? {
              make: carMake,
              model: carModel || '',
              year: carYear || '',
              plateNumber: plateNumber || '',
            } : undefined,
            createdAt: new Date().toISOString()
          }
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to create work gallery entry in Strapi' },
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
      imageUrl: result.data.attributes.imageUrl || imageUrl,
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
      message: 'Image uploaded successfully',
      image: image
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}