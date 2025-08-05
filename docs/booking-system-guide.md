# 📅 Appointment Booking System - Complete Guide

## 🚀 Overview

A comprehensive appointment booking system that allows customers to schedule car service appointments with calendar availability, time slot management, and store-specific configuration.

## ✨ Features

### 🏪 Multi-Store Support
- Each store has independent configuration
- Configurable working hours and days
- Different appointment capacities per store
- Store-specific contact information

### 📅 Smart Calendar System
- Interactive calendar with available/busy slots
- Real-time availability checking
- Time slot visualization with capacity indicators
- Working days/hours enforcement

### 📝 Complete Booking Flow
- Customer information collection
- Vehicle details capture
- Service type selection
- Date/time slot selection
- Form validation and confirmation

### 🌍 Multi-Language Support
- English, Arabic, Hebrew translations
- RTL layout support for Arabic/Hebrew
- Localized date/time formatting

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly calendar interface
- Optimized form layouts

## 🗂️ File Structure

```
📁 Booking System Files
├── 📄 app/book-appointment/page.tsx          # Main booking page
├── 📁 app/api/
│   ├── 📄 stores/[storeId]/route.ts          # Store configuration API
│   └── 📁 appointments/
│       ├── 📄 route.ts                       # Create/get appointments
│       └── 📄 availability/route.ts          # Check time slot availability
├── 📁 components/
│   ├── 📄 BookingCalendar.tsx               # Calendar with time slots
│   └── 📄 StoreHeader.tsx                   # Store information display
├── 📄 app/admin/appointments/page.tsx        # Admin management view
└── 📄 messages/{locale}.json                # Translation files
```

## ⚙️ Store Configuration

### Default Store Settings
```typescript
{
  id: 'default',
  name: 'ASD - Auto Spa Detailing',
  maxSimultaneousAppointments: 3,  // 3 customers per time slot
  workingHours: { start: '08:00', end: '18:00' },
  workingDays: [0,1,2,3,4,5,6],   // Sunday to Saturday
  appointmentDuration: 60          // 60 minutes per appointment
}
```

### Configurable Parameters
- **Max Simultaneous Appointments**: How many customers can book the same time slot
- **Working Hours**: Start and end times (24-hour format)
- **Working Days**: Array of days (0=Sunday, 6=Saturday)
- **Appointment Duration**: Minutes per appointment slot

## 🎯 How to Use

### 1. **Access Booking Page**
```
/book-appointment?storeId=default
/book-appointment?storeId=store1
/book-appointment?storeId=store2
```

### 2. **Customer Journey**
1. **Store Information** - Displays store details, hours, contact info
2. **Calendar Selection** - Choose available date from calendar
3. **Time Slot Selection** - Pick from available time slots
4. **Form Completion** - Fill customer, vehicle, and service details
5. **Booking Confirmation** - Submit and receive confirmation

### 3. **Admin Management**
Visit `/admin/appointments` to:
- View all stores and their settings
- See appointment lists per store
- Monitor booking capacity
- Quick links to test booking system

## 🔧 API Endpoints

### Store Configuration
```bash
GET /api/stores/[storeId]
# Returns store configuration and settings
```

### Appointment Availability  
```bash
GET /api/appointments/availability?storeId=default&date=2024-01-15
# Returns available time slots for specific date
```

### Create Appointment
```bash
POST /api/appointments
# Creates new appointment with validation
```

### Get Appointments
```bash
GET /api/appointments?storeId=default&date=2024-01-15
# Returns appointments for store/date
```

## 📋 Form Validation

### Required Fields
- ✅ Customer Name (min 2 characters)
- ✅ Phone Number (Israeli format: 050/052/053/054/058)
- ✅ Email Address (valid format)
- ✅ Car Make & Model
- ✅ Plate Number (auto-uppercase)
- ✅ Service Type (dropdown selection)
- ✅ Date & Time Selection

### Validation Rules
- **Phone**: Must match pattern `05[02348]\d{7}`
- **Email**: Standard email validation
- **Date**: Cannot be in the past, must be working day
- **Time**: Must be within working hours
- **Capacity**: Checks available slots before booking

## 🎨 Service Types Available

- **Basic Wash** - Quick exterior cleaning
- **Premium Wash** - Comprehensive wash & dry
- **Full Detail** - Complete interior/exterior detailing
- **Interior Detail** - Deep interior cleaning
- **Exterior Detail** - Paint correction & protection
- **Ceramic Coating** - Long-term paint protection
- **Paint Protection** - Protective film application

## 🌍 Multi-Language Support

### Translation Keys Structure
```json
"BookingPage": {
  "select_datetime": "Select Date & Time",
  "customer_info": "Customer Information", 
  "vehicle_info": "Vehicle Information",
  "service_type": "Service Type",
  "book_appointment": "Book Appointment",
  // ... 70+ translation keys
}
```

### Supported Languages
- **English** (`en`) - Default language
- **Arabic** (`ar`) - RTL layout, Arabic translations
- **Hebrew** (`he-IL`) - RTL layout, Hebrew translations

## 💾 Data Storage

### Current Implementation
- **In-Memory Storage**: Appointments stored in memory (demo)
- **Store Configuration**: Static configuration in API

### Production Recommendations
- **Database**: Replace in-memory with PostgreSQL/MongoDB
- **Cache**: Redis for availability caching
- **Email**: Send confirmation emails
- **SMS**: Appointment reminders
- **Calendar**: Integration with Google Calendar/Outlook

## 🚨 Booking Logic & Validation

### Time Slot Management
1. **Generate Slots**: Based on working hours & duration
2. **Check Capacity**: Compare bookings vs max capacity
3. **Prevent Conflicts**: Block duplicate customer bookings
4. **Real-time Updates**: Refresh availability after each booking

### Capacity Example
```
Store: 3 simultaneous appointments
Time: 10:00 AM
Current Bookings: 2
Status: 1 slot available ✅

Time: 2:00 PM  
Current Bookings: 3
Status: Fully booked ❌
```

## 🔧 Customization

### Adding New Stores
1. Add store config in `/api/stores/[storeId]/route.ts`
2. Update store list in admin page
3. Create booking links with new storeId

### Modifying Working Hours
```typescript
workingHours: {
  start: '09:00',  // 9 AM start
  end: '17:00'     // 5 PM end
}
```

### Changing Appointment Duration
```typescript
appointmentDuration: 30  // 30-minute slots
appointmentDuration: 90  // 90-minute slots
```

### Adding New Services
1. Add service to dropdown options in booking form
2. Add translations for new service type
3. Update validation if needed

## 🎯 Testing the System

### Quick Test Scenarios

1. **Basic Booking Flow**
   - Visit `/book-appointment?storeId=default`
   - Select tomorrow's date
   - Choose available time slot
   - Fill form with valid data
   - Submit booking

2. **Capacity Testing**
   - Book 3 appointments for same time slot
   - Try booking 4th appointment (should be blocked)
   - Verify slot shows as "Fully Booked"

3. **Multi-Store Testing**
   - Test different stores with different configurations
   - Verify working hours/days enforcement
   - Check appointment duration differences

4. **Validation Testing**
   - Try invalid phone numbers
   - Test past dates selection
   - Submit incomplete forms

### Admin Monitoring
- Visit `/admin/appointments` 
- View all appointments across stores
- Monitor booking patterns
- Test booking links

## 🚀 Deployment Notes

### Environment Variables
```bash
NEXT_PUBLIC_STRAPI_URL=your_strapi_url
NEXT_PUBLIC_STRAPI_TOKEN=your_strapi_token
```

### Database Migration (For Production)
1. Create appointments table
2. Create stores configuration table  
3. Update API endpoints to use database
4. Add indexes for performance

## 📞 Integration Points

### Current Integrations
- **StoreInfo Component**: Links to booking page
- **Translation System**: Multi-language support
- **Toast Notifications**: Success/error feedback

### Future Integration Opportunities
- **Email Service**: SendGrid/Mailgun for confirmations
- **SMS Service**: Twilio for reminders
- **Payment**: Stripe for deposits
- **Calendar**: Google Calendar sync
- **CRM**: Customer management system

---

## 🎉 Congratulations!

You now have a fully functional appointment booking system with:
- ✅ Multi-store support with configurable settings
- ✅ Interactive calendar with real-time availability
- ✅ Complete booking form with validation
- ✅ Multi-language support (EN/AR/HE)
- ✅ Admin management interface
- ✅ Responsive design for all devices
- ✅ Time slot capacity management
- ✅ Comprehensive API endpoints

The system is ready for production use with proper database integration and notification services!