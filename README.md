# Car Dealer App - Next.js Project

This is a comprehensive car dealership application built with [Next.js](https://nextjs.org/). The application provides a platform for car listings, news articles, parts, and services management.

## Project Structure

### Key Pages and Components

1. **Home Page** (`/`)
   - Components:
     - Hero Section
       - Data Source: Featured cars API endpoint
       - Displays: Latest featured cars with high-quality images
     - Featured Cars Section
       - Data Source: Featured cars API with sorting by date
       - Displays: Car cards with price, make, model, and key features
     - Latest News Section
       - Data Source: News API endpoint with category filtering
       - Displays: News articles with images, titles, and excerpts
     - Customer Testimonials
       - Data Source: Testimonials API
       - Displays: User reviews with ratings and comments
     - Recently Added Cars
       - Data Source: Cars API with date sorting
       - Displays: Latest car listings with basic information
     - Service Cards
       - Data Source: Services API
       - Displays: Available services with pricing and descriptions
     - Part Cards
       - Data Source: Parts API
       - Displays: Featured car parts with prices and availability
   - Required State:
     - Featured cars list (from API)
     - Latest news articles (from API)
     - Recent car listings (from API)
     - Customer testimonials (from API)
     - Available services (from API)
     - Featured parts (from API)
   - Features:
     - Real-time updates for new listings
     - Responsive carousel for featured items
     - Quick search functionality
     - Category-based filtering

2. **Car Listing Page** (`/car-listing`)
   - Components:
     - Search Filters
       - Data Source: Filter options from API
       - Includes: Make, model, price range, year, mileage, fuel type
     - Car Cards Grid
       - Data Source: Filtered cars API
       - Displays: Car images, specifications, and pricing
     - Pagination
       - Handles: Large dataset navigation
   - Required State:
     - Filter parameters (make, model, price range, etc.)
     - Current page number
     - Total results count
     - Sort preferences
   - Features:
     - Advanced filtering system
     - Sort by price, date, mileage
     - Save search preferences
     - Compare cars functionality

3. **Car Details Page** (`/car-details/[id]`)
   - Components:
     - Car Image Gallery
       - Data Source: Car images API
       - Features: Zoom, full-screen view
     - Specifications Table
       - Data Source: Car details API
       - Displays: Technical specifications
     - Features List
       - Data Source: Car features API
       - Displays: Available features and options
     - Contact Form
       - Handles: User inquiries
       - Integrates: Email notification system
     - Similar Cars Section
       - Data Source: Similar cars API based on make/model
   - Required State:
     - Car details (from API)
     - Similar cars list (from API)
     - Contact form data (local state)
   - Features:
     - Image gallery with thumbnails
     - 360-degree view option
     - Price calculator
     - Financing options
     - Schedule test drive

4. **News Section** (`/news`)
   - Components:
     - News Grid
       - Data Source: News API with pagination
       - Displays: Articles with images and metadata
     - Category Filters
       - Data Source: News categories API
       - Handles: Category-based filtering
     - Search Bar
       - Features: Full-text search across articles
   - Required State:
     - News articles list (from API)
     - Selected category (local state)
     - Search query (local state)
   - Features:
     - Article sharing
     - Related articles
     - Author information
     - Comment system

5. **Dashboard** (`/dashboard`)
   - Components:
     - User Profile
       - Data Source: User API
       - Displays: Personal information and preferences
     - Saved Cars
       - Data Source: User favorites API
       - Features: Quick access to saved listings
     - Recent Activity
       - Data Source: User activity API
       - Displays: View history and interactions
     - Settings Panel
       - Handles: User preferences and notifications
   - Required State:
     - User information (from API)
     - Saved listings (from API)
     - Activity history (from API)
     - User preferences (local state)
   - Features:
     - Profile customization
     - Notification settings
     - Saved searches
     - Activity tracking

6. **Parts & Services** (`/parts` and `/services`)
   - Components:
     - Category Navigation
       - Data Source: Parts/services categories API
     - Product Grid
       - Data Source: Parts/services API with filtering
     - Search & Filter
       - Features: Advanced search capabilities
   - Required State:
     - Category selection
     - Search parameters
     - Filter preferences
   - Features:
     - Part compatibility check
     - Service scheduling
     - Price comparison
     - Availability status

7. **Dealerships** (`/dealerships`)
   - Components:
     - Location Map
       - Data Source: Dealership locations API
       - Integrates: Google Maps API
     - Dealer List
       - Data Source: Dealerships API
       - Displays: Contact info and inventory
   - Required State:
     - Dealership locations
     - Selected region
     - Search radius
   - Features:
     - Location-based search
     - Inventory preview
     - Contact information
     - Business hours

## Data Handling

### API Integration
- The application uses React Query for data fetching and caching
- API endpoints are organized in the `/app/api` directory
- Data is fetched using server-side and client-side methods
- API endpoints include:
  - `/api/cars` - Car listings and details
  - `/api/news` - News articles and categories
  - `/api/parts` - Car parts and accessories
  - `/api/services` - Available services
  - `/api/users` - User management
  - `/api/dealerships` - Dealership information

### State Management
- Local state for UI components using React's useState
- Global state management for user data and preferences
- Form state management for user inputs
- Cache management for API responses
- Real-time updates using WebSocket connections

### Data Models

1. **Car Model**
```typescript
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  condition: string;
  features: string[];
  images: string[];
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dealer: {
    id: string;
    name: string;
    contact: string;
  };
  specifications: {
    engine: string;
    horsepower: number;
    torque: number;
    fuelEconomy: string;
    seating: number;
    color: string;
  };
}
```

2. **News Article Model**
```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  publishDate: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  image: {
    url: string;
    alt: string;
    caption: string;
  };
  tags: string[];
  relatedArticles: string[];
  comments: {
    id: string;
    user: string;
    content: string;
    date: string;
  }[];
}
```

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Setup

Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
NEXT_PUBLIC_EMAIL_SERVICE_API_KEY=your_email_service_key
```

## Features

- Responsive design for all devices
- Multi-language support
- Advanced search and filtering
- Real-time updates
- User authentication and authorization
- Image optimization
- SEO optimization
- Performance monitoring
- Payment integration
- Email notifications
- Social media sharing
- Analytics tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Content Management Manual

This section explains how to manage different types of content through the admin interface or API. Each content type can be controlled through specific categories and variables.

### 1. Home Page Content Management

#### Featured Cars
- **How to Feature a Car:**
  1. Go to the car listing in the admin panel
  2. Add "featured" to the categories array
  3. Set `isFeatured: true` in the car properties
  4. Optionally set `featuredOrder: number` to control display order

- **Example Car JSON:**
```json
{
  "id": "car123",
  "make": "Toyota",
  "model": "Camry",
  "categories": ["featured", "sedan", "new"],
  "isFeatured": true,
  "featuredOrder": 1,
  "featuredUntil": "2024-12-31"
}
```

#### News Articles
- **How to Feature News:**
  1. Add "featured" to the categories array
  2. Set `isFeatured: true`
  3. Set `featuredOrder` for display priority
  4. Set `featuredUntil` for automatic removal

- **Example News JSON:**
```json
{
  "id": "news123",
  "title": "Latest Car Technology",
  "categories": ["featured", "technology", "news"],
  "isFeatured": true,
  "featuredOrder": 2,
  "featuredUntil": "2024-12-31"
}
```

### 2. Car Listings Management

#### Categories and Tags
- **Available Categories:**
  - `featured` - Shows in featured section
  - `new` - New arrivals
  - `used` - Used vehicles
  - `certified` - Certified pre-owned
  - `sale` - On sale/clearance
  - `popular` - Popular models

- **Vehicle Types:**
  - `sedan`
  - `suv`
  - `truck`
  - `van`
  - `luxury`
  - `sports`
  

#### Example Car Listing:
```json
{
  "id": "car456",
  "make": "Honda",
  "model": "Civic",
  "categories": ["featured", "new", "sedan"],
  "tags": ["fuel-efficient", "family"],
  "price": 25000,
  "year": 2024,
  "condition": "new",
  "status": "available",
  "showInListing": true,
  "priority": 1
}
```

### 3. Parts and Services Management

#### Parts Categories
- **Main Categories:**
  - `engine`
  - `transmission`
  - `brakes`
  - `suspension`
  - `electrical`
  - `interior`
  - `exterior`

- **Visibility Controls:**
  - `isFeatured` - Show in featured section
  - `showInCatalog` - Show in parts catalog
  - `isOnSale` - Mark as on sale
  - `stockStatus` - Available/Out of stock

#### Example Part:
```json
{
  "id": "part123",
  "name": "Brake Pads",
  "categories": ["brakes", "featured"],
  "compatibility": ["Toyota", "Honda"],
  "price": 49.99,
  "isFeatured": true,
  "showInCatalog": true,
  "stockStatus": "available",
  "featuredOrder": 3
}
```

### 4. News and Blog Management

#### Article Categories
- **Main Categories:**
  - `news` - General news
  - `reviews` - Car reviews
  - `tips` - Maintenance tips
  - `events` - Upcoming events
  - `promotions` - Special offers

- **Visibility Controls:**
  - `isPublished` - Show on site
  - `isFeatured` - Show in featured section
  - `publishDate` - When to show
  - `expiryDate` - When to remove

#### Example News Article:
```json
{
  "id": "article123",
  "title": "Winter Car Maintenance Tips",
  "categories": ["tips", "featured"],
  "tags": ["maintenance", "winter"],
  "isPublished": true,
  "isFeatured": true,
  "publishDate": "2024-01-01",
  "expiryDate": "2024-03-31",
  "featuredOrder": 1
}
```

### 5. Services Management

#### Service Categories
- **Main Categories:**
  - `maintenance`
  - `repair`
  - `inspection`
  - `detailing`
  - `emergency`

- **Visibility Controls:**
  - `isAvailable` - Service availability
  - `isFeatured` - Show in featured section
  - `requiresAppointment` - Appointment needed
  - `estimatedTime` - Service duration

#### Example Service:
```json
{
  "id": "service123",
  "name": "Oil Change",
  "categories": ["maintenance", "featured"],
  "price": 49.99,
  "isAvailable": true,
  "isFeatured": true,
  "requiresAppointment": true,
  "estimatedTime": "30 minutes"
}
```

### 6. Content Display Rules

#### Home Page Display Logic
1. **Featured Section:**
   - Limited to 6 items
   - Must have "featured" in categories

2. **Recent Listings:**
   - Limited to 12 items
   - Must have valid status

3. **News Section:**
   - Articles with `isPublished: true`
   - Within publish/expiry dates
   - Sorted by publish date
   - Limited to 8 items

#### Category Page Display Logic
1. **Filtering:**
   - Items must match selected category
   - Items must be available/published
   - Items must be within date ranges

2. **Sorting Options:**
   - Price (low to high)
   - Date (newest first)
   - Featured items first
   - Alphabetical

### 7. Content Management Best Practices

1. **Adding New Content:**
   - Always include required categories
   - Set appropriate visibility flags
   - Add relevant tags for searchability
   - Set proper dates for time-sensitive content

2. **Updating Content:**
   - Check category validity
   - Update dates if needed
   - Verify visibility settings
   - Update related content

3. **Removing Content:**
   - Set `isPublished: false`
   - Remove from categories
   - Update expiry date
   - Archive if needed

4. **Featured Content:**
   - Limit number of featured items
   - Set appropriate display order
   - Use expiry dates
   - Rotate content regularly




   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

   🧱 هيكل المشروع
الصفحات والمكونات الأساسية
1. 🏠 الصفحة الرئيسية (/)

تتضمن الأقسام التالية:

    قسم البطل (Hero)
    يعرض سيارات مميزة بصور عالية الجودة.

    السيارات المميزة
    يعرض سيارات حسب الأحدث مع معلومات مثل: السعر، الشركة، الموديل، والمواصفات.

    أحدث الأخبار
    يعرض مقالات إخبارية بها صور وعناوين ومُلخصات.

    آراء العملاء
    يعرض تقييمات وتعليقات العملاء.

    السيارات المضافة مؤخرًا
    يعرض السيارات الجديدة التي أُضيفت مؤخرًا.

    خدمات متوفرة
    يعرض بطاقات للخدمات وأسعارها.

    قطع الغيار
    يعرض قطع مميزة مع الأسعار والتوفر.

🧠 بيانات تُجلب من الـ API:

    السيارات، الأخبار، الخدمات، قطع الغيار، تقييمات العملاء...

2. 🚘 صفحة عرض السيارات (/car-listing)

    فلاتر البحث: مثل الشركة، السعر، الوقود...

    بطاقات السيارات: تُعرض في شبكة.

    صفحات التنقل: للمحتوى الكبير.

🎯 المزايا:

    فلترة متقدمة

    مقارنة السيارات

    حفظ إعدادات البحث

3. 📄 صفحة تفاصيل السيارة (/car-details/[id])

    معرض صور

    مواصفات تفصيلية

    قائمة الميزات

    نموذج تواصل

    سيارات مشابهة

🧠 المزايا:

    عرض 360 درجة

    حاسبة السعر

    حجز تجربة قيادة

4. 📰 قسم الأخبار (/news)

    عرض شبكة المقالات

    فلترة حسب الفئة

    شريط بحث

    مشاركة المقالات

    التعليقات

5. 👤 لوحة التحكم (/dashboard)

    الملف الشخصي

    سيارات محفوظة

    النشاط الأخير

    إعدادات المستخدم

6. 🧩 قطع الغيار والخدمات (/parts, /services)

    تصفح حسب الفئات

    البحث والتصفية

    مقارنة الأسعار

    حالة التوفر

    جدولة الخدمات

7. 🗺️ الوكالات (/dealerships)

    خريطة المواقع (Google Maps)

    قائمة الوكلاء

    معاينة المخزون

    معلومات التواصل وساعات العمل

🔌 التعامل مع البيانات
📡 تكامل الـ API

    استخدام React Query للسحب والتخزين المؤقت

    مجلد /app/api يحتوي جميع نقاط البيانات

    دعم لجلب البيانات من السيرفر أو المتصفح

💾 إدارة الحالة

    useState للمكونات

    إدارة حالة المستخدم

    تحديثات فورية عبر WebSocket

📘 نماذج البيانات
1. نموذج السيارة:

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  ...
}

2. نموذج المقال:

interface Article {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  category: { name: string };
  image: { url: string };
}

🚀 بدء التشغيل

npm install
npm run dev

ثم افتح: http://localhost:3000
⚙️ إعداد البيئة

أنشئ ملف .env.local:

NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

💡 الميزات الرئيسية

    تصميم متجاوب

    دعم لغات متعددة

    فلترة متقدمة وبحث

    التحديث الفوري

    تسجيل دخول ومستخدمين

    تحسين الصور والسرعة

    دفع إلكتروني وإشعارات

    مشاركة في السوشيال

    تتبع تحليلي

🧑‍💻 للمساهمة

    اعمل Fork للمشروع

    أنشئ فرع جديد

    نفذ التعديلات وادفعها

    افتح Pull Request

📝 إدارة المحتوى (دليل مختصر)
⭐ المقالات والسيارات المميزة:

    أضف featured للفئة

    حدد isFeatured: true

    استخدم featuredOrder للترتيب

🏷️ الفئات:

    featured, new, used, sale, popular

🧩 إدارة القطع:

    engine, brakes, electrical, interior...

🧼 إدارة الخدمات:

    maintenance, repair, inspection...

⚙️ قواعد العرض:

    الصفحة الرئيسية: 6 مميزة + 12 حديثة

    حسب التاريخ والحالة