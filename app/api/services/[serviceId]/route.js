import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// GET a specific service
export async function GET(request, { params }) {
  try {
    const { serviceId } = params;
    let storeId = new URLSearchParams(request.url).get('storeId');
    if (storeId === 'default') {
      storeId = 'ASD Auto Spa Detailing';
    }
    const updateData = await request.json();

    // Update service in Strapi
    const apiUrl = `${STRAPI_URL}/api/servicess?populate=*&filters[stores][name][$contains]=${storeId}&filters[slug][$eq]=${serviceId}`;
    
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
        { error: 'Failed to update service in Strapi' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // Transform response to expected format
    const service = {
      id: result.data.id,
      storeId: result.data.store.id,
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
    //   duration: result.data.duration,
      category: result.data.category,
      isActive: result.data.isActive,
      createdAt: result.data.createdAt,
      updatedAt: result.data.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      service: service
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE a specific service
export async function POST(request, { params }) {
  try {
    const { serviceId } = params;
    const updateData = await request.json();
    
    console.log('PUT request received for service:', serviceId);
    // Remove storeId from updateData as it's not needed in Strapi update
    const { storeId, ...strapiUpdateData } = updateData;
    delete strapiUpdateData.duration;
    delete strapiUpdateData.category;
    delete strapiUpdateData.isActive;
    delete strapiUpdateData.createdAt;
    delete strapiUpdateData.updatedAt;
    console.log('Update data received:', strapiUpdateData);

    
    console.log('Data to send to Strapi:', strapiUpdateData);
    
    // Try the correct endpoint - it might be "servicess" (with double s) in your Strapi
    let apiUrl = `${STRAPI_URL}/api/servicess?filters[slug][$contains]=${serviceId}`;
    console.log('Trying endpoint:', apiUrl);
    
    let response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: strapiUpdateData
      }),
    });

    console.log('Response status for /api/services:', response.status);
    
    // If "services" doesn't work, try "servicess" 
    if (!response.ok && (response.status === 405 || response.status === 404)) {
      console.log('Trying with servicess endpoint...');
      apiUrl = `${STRAPI_URL}/api/servicess?filters[slug][$contains]=${serviceId}`;
      console.log('Trying endpoint:', apiUrl);
      
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: strapiUpdateData
        }),
      });
      
      console.log('Response status for /api/servicess:', response.status);
    }

    console.log('Final Strapi response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi PUT error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: apiUrl
      });
      return NextResponse.json(
        { error: `Failed to update service: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully updated service in Strapi:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



// UPDATE a specific service
export async function PUT(request, { params }) {
    try {
      const { serviceId } = params;
      const updateData = await request.json();
      
      console.log('PUT request received for service:', serviceId);
      // Remove storeId from updateData as it's not needed in Strapi update
      const { storeId, ...strapiUpdateData } = updateData;
      delete strapiUpdateData.duration;
      delete strapiUpdateData.category;
      delete strapiUpdateData.isActive;
      delete strapiUpdateData.createdAt;
      delete strapiUpdateData.updatedAt;
      console.log('Update data received:', strapiUpdateData);
  
      
      console.log('Data to send to Strapi:', strapiUpdateData);
      
      // Try the correct endpoint - it might be "servicess" (with double s) in your Strapi
      let apiUrl = `${STRAPI_URL}/api/servicess/${serviceId}`;
      console.log('Trying endpoint:', apiUrl);
      
      let response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: strapiUpdateData
        }),
      });
    
      console.log('Final Strapi response status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Strapi PUT error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: apiUrl
        });
        return NextResponse.json(
          { error: `Failed to update service: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }
  
      const data = await response.json();
      console.log('Successfully updated service in Strapi:', data);
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error updating service:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
  

// DELETE a specific service
export async function DELETE(request, { params }) {
  try {
    const { serviceId } = params;
    
    console.log('DELETE request for service:', serviceId);
    
    // Try both possible endpoints
    let apiUrl = `${STRAPI_URL}/api/services/${serviceId}`;
    let response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    // If "services" doesn't work, try "servicess"
    if (!response.ok && (response.status === 405 || response.status === 404)) {
      apiUrl = `${STRAPI_URL}/api/servicess/${serviceId}`;
      response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
      });
    }

    console.log('Strapi DELETE response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi DELETE error:', errorText);
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: response.status }
      );
    }

    console.log('Successfully deleted service from Strapi');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}