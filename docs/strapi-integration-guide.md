# 📊 Strapi Integration Guide for Dashboard

This guide explains how the dashboard integrates with your existing Strapi structure to provide real-time data management.

## 🎯 Overview

The dashboard now works with your existing Strapi setup and collections. It uses:
- **Your existing `servicess` and `partss` collections** (note: double 's')
- **Stores relationship structure** with `filters[stores][name][$contains]`
- **Arabic localization** with `locale=ar` and `populate=*`
- **Store name mapping** ('default' → 'ASD Auto Spa Detailing')
- **Your existing multi-store hostname system**

## 📋 Required Strapi Collections

### 1. **Services Collection** (`servicess`) - ✅ EXISTING
**Collection Type**: `servicess` (note: double 's')

**Required Fields for Dashboard:**
```json
{
  "name": "Text (Required)",
  "description": "Long Text",
  "price": "Number (Decimal)",
  "duration": "Number (Integer)", 
  "category": "Text or Enumeration",
  "isActive": "Boolean (Default: true)",
  "stores": "Relation (Many-to-Many) to Stores collection"
}
```

**Dashboard Integration:**
- ✅ **GET**: Uses existing structure with `populate=*&locale=ar`
- ✅ **POST**: Adds dashboard service creation capability
- ✅ **Filtering**: Uses `filters[stores][name][$contains]=${storeName}`

**API Endpoint**: `/api/servicess`

---

### 2. **Products Collection** (`products`)
**Collection Type**: `products`

**Fields:**
```json
{
  "storeId": "Text (Required)",
  "name": "Text (Required)",
  "description": "Long Text",
  "price": "Number (Decimal)",
  "category": "Text",
  "brand": "Text",
  "stock": "Number (Integer, Default: 0)",
  "sku": "Text",
  "isActive": "Boolean (Default: true)",
  "image": "Media (Single)"
}
```

**API Endpoint**: `/api/products`

---

### 3. **Parts Collection** (`partss`) - ✅ EXISTING  
**Collection Type**: `partss` (note: double 's')

**Required Fields for Dashboard:**
```json
{
  "name": "Text (Required)",
  "description": "Long Text",
  "partNumber": "Text (Required)",
  "brand": "Text",
  "price": "Number (Decimal)",
  "stock": "Number (Integer, Default: 0)",
  "minStock": "Number (Integer, Default: 0)",
  "category": "Text or Enumeration",
  "isActive": "Boolean (Default: true)",
  "stores": "Relation (Many-to-Many) to Stores collection"
}
```

**Dashboard Integration:**
- ✅ **GET**: Uses existing structure with `populate=*&locale=ar`
- ✅ **POST**: Adds dashboard parts creation capability  
- ✅ **Filtering**: Uses `filters[stores][name][$contains]=${storeName}`

**API Endpoint**: `/api/partss`

---

### 4. **Appointments Collection** (`appointments`) - 🆕 NEW FOR DASHBOARD
**Collection Type**: `appointments`

**Required Fields:**
```json
{
  "storeName": "Text",
  "customerName": "Text (Required)",
  "customerPhone": "Text (Required)",
  "customerEmail": "Email (Required)",
  "carMake": "Text (Required)",
  "carModel": "Text (Required)",
  "carYear": "Text",
  "plateNumber": "Text (Required)",
  "serviceType": "Text (Required)",
  "notes": "Long Text",
  "selectedDate": "Date (Required)",
  "selectedTime": "Text (Required)",
  "appointmentDuration": "Number (Integer)",
  "status": "Enumeration [confirmed, completed, cancelled, no_show] (Default: confirmed)",
  "locale": "Text (Default: ar)",
  "stores": "Relation (Many-to-Many) to Stores collection"
}
```

**Dashboard Integration:**
- ✅ **CREATE**: Booking system creates appointments
- ✅ **READ**: Dashboard displays appointments with filtering
- ✅ **UPDATE**: Status management and scheduling
- ✅ **Filtering**: Uses `filters[stores][name][$contains]=${storeName}`
- ✅ **Localization**: Supports `locale=ar` parameter

**API Endpoint**: `/api/appointments`

---

### 5. **Work Galleries Collection** (`work-galleries`)
**Collection Type**: `work-galleries`

**Fields:**
```json
{
  "storeId": "Text (Required)",
  "title": "Text (Required)",
  "description": "Long Text",
  "category": "Enumeration [exterior_detail, interior_detail, paint_correction, ceramic_coating, before_after, customer_cars, equipment, team_work]",
  "serviceType": "Text",
  "tags": "Text",
  "isFeatured": "Boolean (Default: false)",
  "isBeforeAfter": "Boolean (Default: false)",
  "imageUrl": "Text",
  "beforeImageUrl": "Text",
  "afterImageUrl": "Text",
  "image": "Media (Single)",
  "beforeImage": "Media (Single)",
  "afterImage": "Media (Single)",
  "customerCar": "JSON"
}
```

**Customer Car JSON Structure:**
```json
{
  "make": "string",
  "model": "string", 
  "year": "string",
  "plateNumber": "string"
}
```

**API Endpoint**: `/api/work-galleries`

---

### 6. **Store Settings Collection** (`store-settings`)
**Collection Type**: `store-settings`

**Fields:**
```json
{
  "storeId": "Text (Required, Unique)",
  "name": "Text (Required)",
  "address": "Text",
  "phone": "Text",
  "email": "Email",
  "website": "Text",
  "description": "Long Text",
  "workingHours": "JSON",
  "workingDays": "JSON",
  "appointmentDuration": "Number (Integer, Default: 60)",
  "maxSimultaneousAppointments": "Number (Integer, Default: 3)",
  "bufferTime": "Number (Integer, Default: 0)",
  "currency": "Text (Default: USD)",
  "taxRate": "Number (Decimal, Default: 0)",
  "emailNotifications": "Boolean (Default: true)",
  "smsNotifications": "Boolean (Default: false)",
  "reminderTime": "Number (Integer, Default: 24)",
  "allowOnlineBooking": "Boolean (Default: true)",
  "requireDeposit": "Boolean (Default: false)",
  "depositAmount": "Number (Decimal, Default: 0)",
  "allowCancellation": "Boolean (Default: true)",
  "cancellationDeadline": "Number (Integer, Default: 24)",
  "primaryColor": "Text (Default: #3B82F6)",
  "secondaryColor": "Text (Default: #10B981)",
  "timezone": "Text (Default: UTC)",
  "language": "Text (Default: en)",
  "autoConfirmBookings": "Boolean (Default: true)"
}
```

**Working Hours JSON Structure:**
```json
{
  "start": "08:00",
  "end": "18:00"
}
```

**Working Days JSON Structure:**
```json
[0, 1, 2, 3, 4, 5, 6]
```
*(0 = Sunday, 1 = Monday, etc.)*

**API Endpoint**: `/api/store-settings`

---

### 7. **Blocked Time Slots Collection** (`blocked-time-slots`) - Optional
**Collection Type**: `blocked-time-slots`

**Fields:**
```json
{
  "storeId": "Text (Required)",
  "date": "Date (Required)",
  "startTime": "Text (Required)",
  "endTime": "Text (Required)",
  "reason": "Text",
  "createdBy": "Text"
}
```

**API Endpoint**: `/api/blocked-time-slots`

---

## 🔐 Strapi Configuration

### 1. **Environment Variables**
Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://64.227.112.249:1337
NEXT_PUBLIC_STRAPI_TOKEN=your_strapi_api_token
```

### 2. **API Permissions**
In Strapi Admin Panel, go to **Settings > Roles > Public**:

Enable these permissions for each collection:
- ✅ **find** (GET all)
- ✅ **findOne** (GET by ID)
- ✅ **create** (POST)
- ✅ **update** (PUT)
- ✅ **delete** (DELETE)

### 3. **Content Types Setup**
1. Go to **Content-Types Builder**
2. Create each collection type with the fields specified above
3. Make sure to set **required** fields as marked
4. Set **default values** where specified
5. Configure **enumerations** with the exact values listed

## 📡 API Integration Points

### Dashboard Overview
- **Stats**: Fetched from multiple collections
- **Services Count**: From `servicess` collection
- **Appointments**: From `appointments` collection

### Appointment Management
- **View Appointments**: GET `/api/appointments`
- **Update Status**: PUT `/api/appointments/{id}`
- **Block Time**: POST `/api/blocked-time-slots`
- **Check Availability**: Calculated from existing appointments

### Products & Services
- **Services**: CRUD operations on `servicess`
- **Products**: CRUD operations on `products`
- **Parts**: CRUD operations on `partss`

### Work Gallery
- **Images**: CRUD operations on `work-galleries`
- **File Uploads**: Media handled by Strapi
- **Categories**: Enumerated values

### Store Settings
- **Configuration**: CRUD operations on `store-settings`
- **Business Hours**: JSON structure
- **Preferences**: Boolean flags and settings

## 🚀 Benefits of Strapi Integration

### ✅ **Data Persistence**
- All data survives server restarts
- Real database storage with relationships
- Backup and restore capabilities

### ✅ **Multi-Store Support**
- Data isolated by `storeId`
- Independent configurations per store
- Scalable for multiple locations

### ✅ **Admin Interface**
- Native Strapi admin panel
- Direct data management
- User role management

### ✅ **API Consistency**
- RESTful API endpoints
- Consistent data structure
- Built-in validation

### ✅ **Media Management**
- File upload handling
- Image optimization
- CDN support

## 🔧 Migration from In-Memory Storage

The dashboard APIs now automatically:
1. **Fetch from Strapi** first
2. **Fallback gracefully** if collections don't exist
3. **Show helpful messages** for missing collections
4. **Continue working** even with partial Strapi setup

### Migration Steps:
1. **Create collections** in Strapi (use the structures above)
2. **Set permissions** for Public role
3. **Test connections** - dashboard will start using Strapi automatically
4. **Import existing data** if needed

## 📊 Data Flow

```
Dashboard Frontend → Next.js API Routes → Strapi API → Database
                 ↓
            Real-time Updates
                 ↓
          Persistent Storage
```

## 🛠️ Troubleshooting

### **Collection Not Found**
- Dashboard shows fallback message
- Create the missing collection in Strapi
- Set proper permissions

### **API Connection Issues**
- Check `NEXT_PUBLIC_STRAPI_URL` 
- Verify `NEXT_PUBLIC_STRAPI_TOKEN`
- Ensure Strapi is running

### **Permission Errors**
- Enable all CRUD permissions for Public role
- Check API token validity

### **Data Structure Issues**
- Follow exact field names and types
- Set required fields properly
- Use correct enumeration values

---

## 🚀 **Integration Summary**

### ✅ **COMPLETED - APIs Updated to Work with Your Existing Structure:**

1. **Services API (`app/api/services/route.js`)**
   - ✅ Enhanced existing GET route to maintain compatibility
   - ✅ Added POST functionality for dashboard service creation
   - ✅ Uses your `servicess` collection (double 's')
   - ✅ Integrates with `filters[stores][name][$contains]` structure
   - ✅ Supports Arabic localization (`locale=ar`)

2. **Parts API (`app/api/parts/route.js`)**
   - ✅ Enhanced existing GET route to maintain compatibility  
   - ✅ Added POST functionality for dashboard parts management
   - ✅ Uses your `partss` collection (double 's')
   - ✅ Stock tracking with real Strapi data

3. **Products API (`app/api/products/route.js`)**
   - ✅ Created new route following your existing pattern
   - ✅ Integrated with stores relationship structure
   - ✅ Ready for dashboard product management

4. **Appointments API (`app/api/appointments/route.ts`)**
   - ✅ Updated to use `filters[stores][name][$contains]=${storeName}`
   - ✅ Supports Arabic localization
   - ✅ Maps 'default' → 'ASD Auto Spa Detailing'
   - ✅ Full booking system functionality

5. **Dashboard Stats (`app/api/dashboard/stats/route.ts`)**
   - ✅ Already updated by you to use correct structure
   - ✅ Calculates real-time statistics from Strapi

### 🆕 **COLLECTIONS TO CREATE (New Dashboard Features):**

These collections need to be created in Strapi for full dashboard functionality:

1. **`stores`** - Store information and configuration (✅ NOW REQUIRED)
2. **`appointments`** - Customer appointment booking
3. **`work-galleries`** - Store work portfolio 
4. **`store-settings`** - Dashboard configuration
5. **`blocked-time-slots`** - Time blocking (optional)

### 🏪 **Stores Collection** (`stores`) - ✅ NOW INTEGRATED
**Collection Type**: `stores`

**Required Fields for Dashboard:**
```json
{
  "name": "Text (Required)",
  "slug": "UID (Optional - for URL-friendly IDs)",
  "address": "Text",
  "phone": "Text",
  "email": "Email",
  "description": "Long Text",
  "website": "Text",
  "hostname": "Text (for multi-store setup)",
  "apiToken": "Text (for multi-store API access)",
  "tags": "JSON (array of tags like ['car-listing', 'service'])",
  "isActive": "Boolean (Default: true)",
  "maxSimultaneousAppointments": "Number (Integer, Default: 3)",
  "workingHours": "JSON (format: {\"start\": \"08:00\", \"end\": \"18:00\"})",
  "workingDays": "JSON (array: [0,1,2,3,4,5,6] where 0=Sunday)",
  "appointmentDuration": "Number (Integer, Default: 60)",
  "services": "Relation (One-to-Many) to Services collection",
  "images": "Media (Multiple)"
}
```

**Dashboard Integration:**
- ✅ **GET**: Fetches stores from Strapi with Arabic localization
- ✅ **LIST**: `/api/stores` returns all stores
- ✅ **SINGLE**: `/api/stores/[storeId]` returns specific store
- ✅ **FILTERING**: Supports slug-based filtering
- ✅ **FALLBACK**: Uses hardcoded data if Strapi unavailable

**API Endpoints**: 
- `/api/stores` (GET all stores)
- `/api/stores/[storeId]` (GET specific store)

### 📊 **What Works Right Now:**

- ✅ **Store information** fetched from Strapi `stores` collection
- ✅ **Dashboard loads** and connects to existing services/parts
- ✅ **Service management** creates entries in your `servicess` collection
- ✅ **Parts management** creates entries in your `partss` collection  
- ✅ **Store configurations** loaded from Strapi (working hours, capacity, etc.)
- ✅ **Multi-store support** with individual store settings
- ✅ **Appointment booking** (when appointments collection is created)
- ✅ **Multi-store filtering** using your stores relationship
- ✅ **Arabic localization** support
- ✅ **Real-time statistics** from actual Strapi data
- ✅ **Graceful fallbacks** if Strapi collections don't exist yet

### 🔧 **Next Steps:**

1. **Create stores collection** - For full store configuration from Strapi
2. **Test existing features** - Services and Parts should work immediately
3. **Create appointments collection** to enable booking system  
4. **Create work-galleries collection** for portfolio management
5. **Create store-settings collection** for dashboard configuration
6. **Set Public role permissions** for new collections

### 🏪 **Priority: Create Stores Collection**
The stores API now expects to fetch data from Strapi. While it has fallbacks, creating the `stores` collection will enable:
- ✅ **Dynamic store configurations** 
- ✅ **Real-time working hours updates**
- ✅ **Appointment capacity management**
- ✅ **Store-specific settings**
- ✅ **Multi-location scaling**

---

## 🎉 **Result**

Your dashboard now:
- **✅ Works with existing Strapi structure** (servicess, partss, stores)
- **✅ Maintains all existing functionality** 
- **✅ Adds powerful dashboard features**
- **✅ Uses real database persistence**
- **✅ Supports multi-store Arabic localization**
- **✅ Scales with your business growth**

The integration respects your existing setup while adding modern dashboard capabilities!