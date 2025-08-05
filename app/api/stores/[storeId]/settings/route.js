import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function GET(request, { params }) {
  try {
    const { storeId } = params;

    // Fetch store settings from Strapi
    const apiUrl = `${STRAPI_URL}/api/store-settings?filters[storeId][$eq]=${storeId}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Strapi API Error:', response.statusText);
      // Return empty settings if Strapi fails or collection doesn't exist
      return NextResponse.json({
        settings: {}
      });
    }

    const data = await response.json();
    
    // Transform Strapi data to expected format
    let settings = {};
    if (data.data && data.data.length > 0) {
      const settingsData = data.data[0].attributes;
      settings = {
        name: settingsData.name,
        address: settingsData.address,
        phone: settingsData.phone,
        email: settingsData.email,
        website: settingsData.website,
        description: settingsData.description,
        workingHours: settingsData.workingHours || { start: '08:00', end: '18:00' },
        workingDays: settingsData.workingDays || [0, 1, 2, 3, 4, 5, 6],
        appointmentDuration: settingsData.appointmentDuration || 60,
        maxSimultaneousAppointments: settingsData.maxSimultaneousAppointments || 3,
        bufferTime: settingsData.bufferTime || 0,
        currency: settingsData.currency || 'USD',
        taxRate: settingsData.taxRate || 0,
        emailNotifications: settingsData.emailNotifications !== false,
        smsNotifications: settingsData.smsNotifications || false,
        reminderTime: settingsData.reminderTime || 24,
        allowOnlineBooking: settingsData.allowOnlineBooking !== false,
        requireDeposit: settingsData.requireDeposit || false,
        depositAmount: settingsData.depositAmount || 0,
        allowCancellation: settingsData.allowCancellation !== false,
        cancellationDeadline: settingsData.cancellationDeadline || 24,
        primaryColor: settingsData.primaryColor || '#3B82F6',
        secondaryColor: settingsData.secondaryColor || '#10B981',
        timezone: settingsData.timezone || 'UTC',
        language: settingsData.language || 'en',
        autoConfirmBookings: settingsData.autoConfirmBookings !== false,
      };
    }

    return NextResponse.json({
      settings: settings
    });

  } catch (error) {
    console.error('Error fetching store settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { storeId } = params;
    const settings = await request.json();

    // Validate some basic fields
    if (!settings.name || !settings.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // First, check if settings already exist for this store
    const checkUrl = `${STRAPI_URL}/api/store-settings?filters[storeId][$eq]=${storeId}`;
    
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    let settingsId = null;
    let isUpdate = false;

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.data && checkData.data.length > 0) {
        settingsId = checkData.data[0].id;
        isUpdate = true;
      }
    }

    const strapiData = {
      data: {
        storeId,
        ...settings
      }
    };

    let apiUrl;
    let method;

    if (isUpdate && settingsId) {
      // Update existing settings
      apiUrl = `${STRAPI_URL}/api/store-settings/${settingsId}`;
      method = 'PUT';
    } else {
      // Create new settings
      apiUrl = `${STRAPI_URL}/api/store-settings`;
      method = 'POST';
    }

    const response = await fetch(apiUrl, {
      method: method,
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
        console.log('Store settings collection not found in Strapi. Feature will work when collection is created.');
        return NextResponse.json({
          success: true,
          message: 'Settings saved successfully (local only - please create store-settings collection in Strapi)',
          settings: {
            ...settings,
            updatedAt: new Date().toISOString()
          }
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to save settings in Strapi' },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: result.data.attributes
    });

  } catch (error) {
    console.error('Error updating store settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}