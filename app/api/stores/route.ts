import { NextResponse } from 'next/server';

// Mock data for stores
const stores = [
  {
    id: 1,
    name: "AutoTech Plus",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    rating: 4.8,
    reviewCount: 127,
    location: "123 Main Street, New York, NY",
    specialties: ["Performance Parts", "Custom Modifications", "Diagnostics"],
    openingHours: "Mon-Sat: 9:00 AM - 6:00 PM",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "contact@autotechplus.com"
    },
    featured: true
  },
  {
    id: 2,
    name: "Elite Car Parts",
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c",
    rating: 4.6,
    reviewCount: 89,
    location: "456 Auto Avenue, Los Angeles, CA",
    specialties: ["OEM Parts", "Accessories", "Maintenance"],
    openingHours: "Mon-Sun: 8:00 AM - 7:00 PM",
    contact: {
      phone: "+1 (555) 987-6543",
      email: "sales@elitecarparts.com"
    },
    featured: false
  },
  {
    id: 3,
    name: "Premium Auto Hub",
    image: "https://images.unsplash.com/photo-1504222490345-c075b6008014",
    rating: 4.9,
    reviewCount: 156,
    location: "789 Gear Street, Chicago, IL",
    specialties: ["Luxury Parts", "Performance Upgrades", "Custom Orders"],
    openingHours: "Mon-Fri: 8:30 AM - 6:30 PM",
    contact: {
      phone: "+1 (555) 456-7890",
      email: "info@premiumautohub.com"
    },
    featured: true
  }
];

export async function GET(request: Request) {
  try {
    // Get search params
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const search = searchParams.get('search')?.toLowerCase();
    
    let filteredStores = [...stores];
    
    // Apply filters
    if (featured === 'true') {
      filteredStores = filteredStores.filter(store => store.featured);
    }
    
    if (search) {
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(search) ||
        store.specialties.some(specialty => specialty.toLowerCase().includes(search)) ||
        store.location.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      stores: filteredStores,
      total: filteredStores.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
} 