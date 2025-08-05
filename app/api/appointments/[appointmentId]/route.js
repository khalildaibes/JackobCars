import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function PATCH(request, { params }) {
  try {
    const { appointmentId } = params;
    const updateData = await request.json();

    // Update appointment in Strapi
    const apiUrl = `${STRAPI_URL}/api/appointments/${appointmentId}`;
    
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
        { error: 'Failed to update appointment in Strapi' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // Transform response to expected format
    const appointment = {
      id: result.data.id,
      storeId: result.data.attributes.storeId,
      storeName: result.data.attributes.storeName,
      customerName: result.data.attributes.customerName,
      customerPhone: result.data.attributes.customerPhone,
      customerEmail: result.data.attributes.customerEmail,
      carMake: result.data.attributes.carMake,
      carModel: result.data.attributes.carModel,
      carYear: result.data.attributes.carYear,
      plateNumber: result.data.attributes.plateNumber,
      serviceType: result.data.attributes.serviceType,
      notes: result.data.attributes.notes,
      selectedDate: result.data.attributes.selectedDate,
      selectedTime: result.data.attributes.selectedTime,
      status: result.data.attributes.status,
      createdAt: result.data.attributes.createdAt,
      updatedAt: result.data.attributes.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: appointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { appointmentId } = params;

    // Delete appointment from Strapi
    const apiUrl = `${STRAPI_URL}/api/appointments/${appointmentId}`;
    
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
        { error: 'Failed to delete appointment from Strapi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { appointmentId } = params;

    // Fetch appointment from Strapi
    const apiUrl = `${STRAPI_URL}/api/appointments/${appointmentId}?populate=*`;
    
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
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const result = await response.json();
    
    // Transform response to expected format
    const appointment = {
      id: result.data.id,
      storeId: result.data.attributes.storeId,
      storeName: result.data.attributes.storeName,
      customerName: result.data.attributes.customerName,
      customerPhone: result.data.attributes.customerPhone,
      customerEmail: result.data.attributes.customerEmail,
      carMake: result.data.attributes.carMake,
      carModel: result.data.attributes.carModel,
      carYear: result.data.attributes.carYear,
      plateNumber: result.data.attributes.plateNumber,
      serviceType: result.data.attributes.serviceType,
      notes: result.data.attributes.notes,
      selectedDate: result.data.attributes.selectedDate,
      selectedTime: result.data.attributes.selectedTime,
      status: result.data.attributes.status,
      createdAt: result.data.attributes.createdAt,
      updatedAt: result.data.attributes.updatedAt,
    };

    return NextResponse.json({
      appointment: appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}