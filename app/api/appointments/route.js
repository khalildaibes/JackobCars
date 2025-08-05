import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Fetch store configuration from API
const getStoreConfig = async (storeId) => {
  try {
    console.log('🔵 getStoreConfig called with storeId:', storeId);
    // Handle default store mapping
    if (storeId === 'default') {
      storeId = 'ASD Auto Spa Detailing';
      console.log('🔵 Mapped default to:', storeId);
    }
    
    const storeUrl = `${STRAPI_URL || 'http://localhost:3000'}/api/stores?populate=*&filters[name][$contains]=${storeId}`;
    console.log('🔵 Fetching store from URL:', storeUrl);
    const response = await fetch(storeUrl, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
    });

    
    if (!response.ok) {
      console.error('🔴 Failed to fetch store config:', response.status);
      return null;
    }
    
    const responseData = await response.json();
    const storeData = responseData.data[0];

    console.log('🔵 Store data received:', JSON.stringify(storeData, null, 2));
    
    if (!storeData) {
      return null;
    }
    
    // Transform store data to match expected structure
    const workingDays = [];
    if (storeData.additional?.working_hours) {
      const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
      Object.entries(storeData.additional.working_hours).forEach(([day, hours]) => {
        if (!hours.closed && hours.open && hours.close) {
          workingDays.push(dayMap[day]);
        }
      });
    }
    
    // Get working hours for the first available day (or default)
    let workingHours = { start: '08:00', end: '18:00' };
    if (storeData.additional?.working_hours) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      for (const day of days) {
        const dayHours = storeData.additional.working_hours[day];
        if (dayHours && !dayHours.closed && dayHours.open && dayHours.close) {
          workingHours = { start: dayHours.open, end: dayHours.close };
          break;
        }
      }
    }
    
    const storeConfig = {
      id: storeData.id || storeId,
      name: storeData.name || storeId,
      workingHours,
      workingDays: workingDays.length > 0 ? workingDays : [0, 1, 2, 3, 4, 5, 6], // Default to all days if none found
      maxSimultaneousAppointments: storeData.additional?.maxSimultaneousAppointments || 3,
      appointmentDuration: storeData.additional?.appointmentDuration || 60
    };
    console.log('🔵 Returning store config:', JSON.stringify(storeConfig, null, 2));
    return storeConfig;
  } catch (error) {
    console.error('🔴 Error in getStoreConfig:', error);
    console.error('🔴 Error stack in getStoreConfig:', error.stack);
    return null;
  }
};

export async function POST(request) {
  try {
    console.log('🔵 POST /api/appointments - Starting request');
    const appointmentData = await request.json();
    console.log('🔵 Raw appointmentData received:', appointmentData);
    
    const {
      storeId,
      customerName,
      customerPhone,
      customerEmail,
      carMake,
      carModel,
      carYear,
      plateNumber,
      serviceType,
      notes,
      selectedDate,
      selectedTime,
      locale
    } = appointmentData;
    
    console.log('🔵 Extracted storeId:', storeId);
    console.log('🔵 All extracted fields:', {
      storeId,
      customerName,
      customerPhone,
      customerEmail,
      carMake,
      carModel,
      carYear,
      plateNumber,
      serviceType,
      notes,
      selectedDate,
      selectedTime,
      locale
    });

    // Validate required fields
    console.log('🔵 Starting validation...');
    const requiredFields = [
      'storeId', 'customerName', 'customerPhone', 'customerEmail',
      'carMake', 'carModel', 'plateNumber', 'serviceType', 'selectedDate', 'selectedTime'
    ];
    
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        console.log('🔴 Validation failed for field:', field);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    console.log('🔵 Validation passed');

    // Get store configuration
    console.log('🔵 Getting store configuration for storeId:', storeId);
    const store = await getStoreConfig(storeId);
    console.log('🔵 Store configuration result:', store);
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Validate phone number format
    console.log('🔵 Validating phone number:', customerPhone);
    const phoneRegex = /^05[02348]\d{7}$/;
    if (!phoneRegex.test(customerPhone.replace(/\s/g, ''))) {
      console.log('🔴 Phone validation failed for:', customerPhone);
      return NextResponse.json(
        { error: 'Please enter a valid mobile number (050/052/053/054/058)' },
        { status: 400 }
      );
    }
    console.log('🔵 Phone validation passed');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Parse and validate date
    console.log('🔵 Parsing date:', selectedDate);
    const appointmentDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('🔵 Appointment date:', appointmentDate);
    console.log('🔵 Today:', today);

    if (appointmentDate < today) {
      console.log('🔴 Date validation failed - appointment in the past');
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }
    console.log('🔵 Date validation passed');

    // Check if date is a working day
    const dayOfWeek = appointmentDate.getDay();
    if (!store.workingDays.includes(dayOfWeek)) {
      return NextResponse.json(
        { error: 'Store is closed on the selected day' },
        { status: 400 }
      );
    }

    // Validate time slot
    const [hour, minute] = selectedTime.split(':').map(Number);
    const [startHour, startMinute] = store.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = store.workingHours.end.split(':').map(Number);

    const appointmentMinutes = hour * 60 + minute;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (appointmentMinutes < startMinutes || appointmentMinutes >= endMinutes) {
      return NextResponse.json(
        { error: 'Selected time is outside working hours' },
        { status: 400 }
      );
    }

    // Check availability for the selected time slot in Strapi
    console.log('🔵 Checking availability...');
    const dateStr = appointmentDate.toISOString().split('T')[0];
    console.log('🔵 Date string:', dateStr);
    console.log('🔵 storeId before storeName mapping:', storeId);
    const storeName = storeId === 'default' ? 'ASD Auto Spa Detailing' : storeId;
    console.log('🔵 storeName after mapping:', storeName);
    const availabilityUrl = `${STRAPI_URL}/api/appointments?populate=*&filters[store][name][$contains]=${storeName}&filters[selectedDate][$eq]=${dateStr}&filters[selectedTime][$eq]=${selectedTime}`;
    console.log('🔵 Availability URL:', availabilityUrl);

    const availabilityResponse = await fetch(availabilityUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });
    console.log('🔵 Availability response status:', availabilityResponse.status);

    if (availabilityResponse.ok) {
      const existingAppointments = await availabilityResponse.json();
      const sameTimeSlotBookings = existingAppointments.data || [];

      if (sameTimeSlotBookings.length >= store.maxSimultaneousAppointments) {
        return NextResponse.json(
          { error: 'Selected time slot is fully booked' },
          { status: 409 }
        );
      }

      // Check for duplicate booking (same customer, same date/time)
      const duplicateBooking = sameTimeSlotBookings.find((apt) => 
        apt.customerPhone === customerPhone
      );

      if (duplicateBooking) {
        return NextResponse.json(
          { error: 'You already have an appointment at this time' },
          { status: 409 }
        );
      }
    }

    // Create appointment in Strapi
    console.log('🔵 Creating appointment in Strapi...');
    const apiUrl = `${STRAPI_URL}/api/appointments`;
    console.log('🔵 Strapi API URL:', apiUrl);
    
    const strapiData = {
      data: {
        customerName,
        customerPhone,
        customerEmail,
        carMake,
        carModel,
        carYear: carYear || null,
        plateNumber: plateNumber.toUpperCase(),
        serviceType,
        notes: notes || '',
        selectedDate: dateStr,
        selectedTime: selectedTime,
        appointmentDuration: store.appointmentDuration,
        locale: locale || 'en',
        store: [store.id] // Connect to store by name
        
      }
    };
    console.log('🔵 Strapi data payload:', JSON.stringify(strapiData, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiData),
    });
    console.log("🔵 Strapi response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Strapi API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create appointment in Strapi' },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('🔵 Strapi result:', JSON.stringify(result, null, 2));
    console.log('🔵 Final result processing - store.id:', store.id);
    
    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: {
        id: result.data.id,
        store: [store.id],
        customerName,
        selectedDate: dateStr,
        selectedTime,
        serviceType,
        plateNumber: plateNumber.toUpperCase()
      }
    });

  } catch (error) {
    console.error('🔴 Error creating appointment:', error);
    console.error('🔴 Error stack:', error.stack);
    console.error('🔴 Error name:', error.name);
    console.error('🔴 Error message:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve appointments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let storeId = searchParams.get('storeId');
    const date = searchParams.get('date');
    if (storeId === 'default') {
      storeId = 'ASD Auto Spa Detailing'; 
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'StoreId is required' },
        { status: 400 }
      );
    }

    const storeName = storeId === 'default' ? 'ASD Auto Spa Detailing' : storeId;
    let apiUrl = `${STRAPI_URL}/api/appointments?populate=*&filters[store][name][$contains]=${storeName}`;
    
    if (date) {
      apiUrl += `&filters[selectedDate][$eq]=${date}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Strapi API Error:', response.statusText);
      return NextResponse.json({
        storeId,
        appointments: [],
        totalAppointments: 0
      });
    }

    const data = await response.json();
    console.log('🔵 Data received:', JSON.stringify(data, null, 2));
    const data_appointments = data.data;
    console.log('🔵 data_appointments:', data_appointments);

    // Transform Strapi data to expected format
    const appointments = data_appointments.map((item) => ({
      id: item.id,
    //   store: {id:item.store.id},
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      customerEmail: item.customerEmail,
      carMake: item.carMake,
      carModel: item.carModel,
      carYear: Number(item.carYear),
      plateNumber: item.plateNumber,
      serviceType: item.serviceType,
      notes: item.notes,
      selectedDate: new Date(item.selectedDate).toLocaleDateString('en-US', {
        hour12: false,
        timeZone: "Asia/Jerusalem"
      }),
      selectedTime: new Date(item.selectedTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: "Asia/Jerusalem"
      }),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) || [];
    console.log('🔵 Appointments:', JSON.stringify(appointments, null, 2));
    if (date) {
      return NextResponse.json({
        date,
        storeId,
        appointments: appointments
      });
    } else {
      return NextResponse.json({
        storeId,
        totalAppointments: appointments.length,
        appointments: appointments
      });
    }

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}