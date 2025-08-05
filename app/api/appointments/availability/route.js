import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Fetch store configuration from API
const getStoreConfig = async (storeId) => {
  try {
    // Handle default store mapping
    if (storeId === 'default') {
      storeId = 'ASD Auto Spa Detailing';
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stores?name=${storeId}`);
    
    if (!response.ok) {
      console.error('Failed to fetch store config:', response.status);
      return null;
    }
    
    const storeData = await response.json();
    
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
    
    return {
      id: storeData.id || storeId,
      name: storeData.name || storeId,
      workingHours,
      workingDays: workingDays.length > 0 ? workingDays : [0, 1, 2, 3, 4, 5, 6], // Default to all days if none found
      maxSimultaneousAppointments: storeData.additional?.maxSimultaneousAppointments || 3,
      appointmentDuration: storeData.additional?.appointmentDuration || 60
    };
  } catch (error) {
    console.error('Error fetching store config:', error);
    return null;
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const date = searchParams.get('date');

    if (!storeId || !date) {
      return NextResponse.json(
        { error: 'StoreId and date are required' },
        { status: 400 }
      );
    }

    // Get store configuration
    const store = await getStoreConfig(storeId);
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Check if the requested date is a working day
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();
    
    if (!store.workingDays.includes(dayOfWeek)) {
      return NextResponse.json({
        slots: [],
        message: 'Store is closed on this day'
      });
    }

    // Generate time slots based on store working hours
    const generateTimeSlots = () => {
      const slots = [];
      const [startHour, startMinute] = store.workingHours.start.split(':').map(Number);
      const [endHour, endMinute] = store.workingHours.end.split(':').map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      for (let minutes = startMinutes; minutes < endMinutes; minutes += store.appointmentDuration) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }

      return slots;
    };

    // Get existing appointments for this date and store from Strapi
    const storeName = storeId === 'default' ? 'ASD Auto Spa Detailing' : storeId;
    const apiUrl = `${STRAPI_URL}/api/appointments?populate=*&filters[stores][name][$contains]=${storeName}&filters[selectedDate][$eq]=${date}&filters[status][$ne]=cancelled`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    let existingAppointments = [];
    if (response.ok) {
      const data = await response.json();
      existingAppointments = data.data || [];
    }

    // Count bookings per time slot
    const bookingCounts = {};
    existingAppointments.forEach((appointment) => {
      const time = appointment.attributes.selectedTime;
      bookingCounts[time] = (bookingCounts[time] || 0) + 1;
    });

    // Check for blocked time slots from Strapi
    const blockedTimesUrl = `${STRAPI_URL}/api/blocked-time-slots?populate=*&filters[stores][name][$contains]=${storeName}&filters[date][$eq]=${date}`;
    
    let blockedTimes = [];
    try {
      const blockedResponse = await fetch(blockedTimesUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
      });
      
      if (blockedResponse.ok) {
        const blockedData = await blockedResponse.json();
        blockedTimes = blockedData.data || [];
      }
    } catch (error) {
      console.log('No blocked times collection found or accessible');
    }

    // Check if a time slot is blocked
    const isTimeBlocked = (time) => {
      return blockedTimes.some((block) => {
        const startTime = block.attributes.startTime;
        const endTime = block.attributes.endTime;
        return time >= startTime && time < endTime;
      });
    };

    // Generate availability data
    const timeSlots = generateTimeSlots();
    const slots = timeSlots.map(time => ({
      time,
      bookedCount: bookingCounts[time] || 0,
      available: (bookingCounts[time] || 0) < store.maxSimultaneousAppointments && !isTimeBlocked(time),
      maxCapacity: store.maxSimultaneousAppointments,
      isBlocked: isTimeBlocked(time)
    }));

    return NextResponse.json({
      date,
      storeId,
      slots,
      storeInfo: {
        name: store.name,
        maxSimultaneousAppointments: store.maxSimultaneousAppointments,
        appointmentDuration: store.appointmentDuration
      }
    });

  } catch (error) {
    console.error('Error getting availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}