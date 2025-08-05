import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://64.227.112.249:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let storeId = searchParams.get('storeId');
    if (storeId === 'default') {
      storeId = 'ASD Auto Spa Detailing';
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'StoreId is required' },
        { status: 400 }
      );
    }

    // Calculate current date ranges
    const now = new Date();
    // Use Israel time (Asia/Jerusalem) for "today"
    const israelNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
    // Calculate "today" in Israel time, and get the date string in Asia/Jerusalem timezone
    const today = new Date(israelNow.getFullYear(), israelNow.getMonth(), israelNow.getDate());
    // Format today as YYYY-MM-DD in Israel time
    const pad = (n) => n.toString().padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    // Initialize default stats
    let stats = {
      todayAppointments: 0,
      weekAppointments: 0,
      monthRevenue: 0,
      totalServices: 0,
      pendingAppointments: 0,
      completedToday: 0,
    };

    try {
      // Fetch all appointments for this store from Strapi
      const appointmentsUrl = `${STRAPI_URL}/api/appointments?populate=*&filters[store][name][$contains]=${storeId}`;
      
      const appointmentsResponse = await fetch(appointmentsUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
      });

      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        const allAppointments = appointmentsData.data || [];

        // Calculate appointment stats
        const todayAppointments = allAppointments.filter((apt) =>{ 
         console.log(`${apt.selectedDate} === ${todayStr}`);
            return apt.selectedDate === todayStr
        }
        );

        const weekAppointments = allAppointments.filter((apt) => {
          const aptDate = apt.selectedDate;
          return aptDate >= startOfWeekStr && aptDate <= endOfWeekStr;
        });

        const pendingAppointments = allAppointments.filter((apt) => {
          const aptDate = apt.selectedDate;
          const aptTime = apt.selectedTime;
          
          // If appointment is on a future date, it's pending
          if (aptDate > todayStr) {
            console.log(`Future appointment: ${aptDate} > ${todayStr}`);
            return true;
          }
          
          // If appointment is today, check if time hasn't passed
          if (aptDate === todayStr) {
            const now = new Date(israelNow);
            const [aptHour, aptMinute] = aptTime.split(':').map(Number);
            const appointmentDateTime = new Date(israelNow);
            appointmentDateTime.setHours(aptHour, aptMinute, 0, 0);
            
            const isPending = appointmentDateTime > now;
            console.log(`Today appointment: ${aptTime}, current: ${now.getHours()}:${now.getMinutes()}, pending: ${isPending}`);
            return isPending;
          }
          
          // Past date appointments are not pending
          console.log(`Past appointment: ${aptDate} < ${todayStr}`);
          return false;
        });

        const completedToday = todayAppointments.filter((apt) => {
            const aptDate = new Date(apt.selectedDate);
            const today = new Date(todayStr);
            if (
                aptDate.getFullYear() === today.getFullYear() &&
                aptDate.getMonth() === today.getMonth() &&
                aptDate.getDate() === today.getDate()
            ) {
                return apt;
            }
            return false;
        });

        // Mock revenue calculation (in real app, this would come from payment records)
        const monthRevenue = weekAppointments.length * 50; // Average $50 per service

        stats.todayAppointments = todayAppointments.length;
        stats.weekAppointments = weekAppointments.length;
        stats.monthRevenue = monthRevenue;
        stats.pendingAppointments = pendingAppointments.length;
        stats.completedToday = completedToday.length;
      }
    } catch (error) {
      console.log('Could not fetch appointments from Strapi:', error);
    }

    try {
      // Fetch services count from Strapi
      const servicesUrl = `${STRAPI_URL}/api/servicess?populate=*&filters[stores][name][$contains]=${storeId}`;
      
      const servicesResponse = await fetch(servicesUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
      });

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        stats.totalServices = servicesData.data?.length || 0;
      }
    } catch (error) {
      console.log('Could not fetch services from Strapi:', error);
      stats.totalServices = 7; // Default fallback
    }

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    
    // Return default stats if everything fails
    return NextResponse.json({
      todayAppointments: 0,
      weekAppointments: 0,
      monthRevenue: 0,
      totalServices: 7,
      pendingAppointments: 0,
      completedToday: 0,
    });
  }
}