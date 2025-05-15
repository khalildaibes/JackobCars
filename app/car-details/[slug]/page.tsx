import { cookies } from 'next/headers';
import CarDetailsContent from './CarDetailsContent';
import Link from 'next/link';

async function getCarDetails(slug: string, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/deals?store_hostname=64.227.112.249`, {
    headers: {
      'Accept-Language': locale
    },
    next: {
      revalidate: 3600 // Revalidate every hour
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch car details: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data || !data.data) {
    throw new Error("Invalid API response structure");
  }

  // Format listings
        const formattedListings = data.data.map((product: any) => {
          // Get the fuel type and normalize it
          const rawFuelType = product.details?.car.fuel || "Unknown";
          let normalizedFuelType = rawFuelType;
          
          // Normalize fuel type values to English
          if (rawFuelType.toLowerCase().includes("plug-in") || 
              rawFuelType.toLowerCase().includes("plug in") || 
              rawFuelType === "היברידי נטען" ||
              rawFuelType === "هجين قابل للشحن") {
            normalizedFuelType = "Plug-in Hybrid";
          } else if (rawFuelType.toLowerCase().includes("hybrid") || 
                    rawFuelType === "היברידי" ||
                    rawFuelType === "هجين") {
            normalizedFuelType = "Hybrid";
          } else if (rawFuelType.toLowerCase().includes("electric") || 
                    rawFuelType === "חשמלי" ||
                    rawFuelType === "كهربائي") {
            normalizedFuelType = "Electric";
          } else if (rawFuelType.toLowerCase().includes("diesel") || 
                    rawFuelType === "דיזל" ||
                    rawFuelType === "ديزل") {
            normalizedFuelType = "Diesel";
          } else if (rawFuelType.toLowerCase().includes("gasoline") || 
                    rawFuelType.toLowerCase().includes("petrol") || 
                    rawFuelType === "בנזין" ||
                    rawFuelType === "بنزين") {
            normalizedFuelType = "Gasoline";
          }

          // Normalize make
          const rawMake = product.details?.car.make || "Unknown";
          let normalizedMake = rawMake;
          
          if (rawMake.toLowerCase().includes("toyota") || rawMake === "טויוטה" || rawMake === "تويوتا") {
            normalizedMake = "Toyota";
          } else if (rawMake.toLowerCase().includes("honda") || rawMake === "הונדה" || rawMake === "هوندا") {
            normalizedMake = "Honda";
          } else if (rawMake.toLowerCase().includes("ford") || rawMake === "פורד" || rawMake === "فورد") {
            normalizedMake = "Ford";
          } else if (rawMake.toLowerCase().includes("chevrolet") || rawMake === "שברולט" || rawMake === "شيفروليه") {
            normalizedMake = "Chevrolet";
          } else if (rawMake.toLowerCase().includes("bmw") || rawMake === "ב.מ.וו" || rawMake === "بي ام دبليو") {
            normalizedMake = "BMW";
          } else if (rawMake.toLowerCase().includes("mercedes") || rawMake === "מרצדס" || rawMake === "مرسيدس") {
            normalizedMake = "Mercedes-Benz";
          } else if (rawMake.toLowerCase().includes("audi") || rawMake === "אאודי" || rawMake === "أودي") {
            normalizedMake = "Audi";
          } else if (rawMake.toLowerCase().includes("tesla") || rawMake === "טסלה" || rawMake === "تيسلا") {
            normalizedMake = "Tesla";
          } else if (rawMake.toLowerCase().includes("lexus") || rawMake === "לקסוס" || rawMake === "لكزس") {
            normalizedMake = "Lexus";
          } else if (rawMake.toLowerCase().includes("subaru") || rawMake === "סובארו" || rawMake === "سوبارو") {
            normalizedMake = "Subaru";
          }

          // Normalize body type
          const rawBodyType = product.details?.car.body_type || "Unknown";
          let normalizedBodyType = rawBodyType;
          
          if (rawBodyType.toLowerCase().includes("sedan") || rawBodyType === "סדאן" || rawBodyType === "سيدان") {
            normalizedBodyType = "Sedan";
          } else if (rawBodyType.toLowerCase().includes("suv") || rawBodyType === "רכב שטח" || rawBodyType === "سيارة رياضية متعددة الاستخدامات") {
            normalizedBodyType = "SUV";
          } else if (rawBodyType.toLowerCase().includes("truck") || rawBodyType === "משאית" || rawBodyType === "شاحنة") {
            normalizedBodyType = "Truck";
          } else if (rawBodyType.toLowerCase().includes("coupe") || rawBodyType === "קופה" || rawBodyType === "كوبيه") {
            normalizedBodyType = "Coupe";
          } else if (rawBodyType.toLowerCase().includes("convertible") || rawBodyType === "קבריולה" || rawBodyType === "كابريوليه") {
            normalizedBodyType = "Convertible";
          } else if (rawBodyType.toLowerCase().includes("hatchback") || rawBodyType === "הצ'בק" || rawBodyType === "هاتشباك") {
            normalizedBodyType = "Hatchback";
          } else if (rawBodyType.toLowerCase().includes("wagon") || rawBodyType === "סטיישן" || rawBodyType === "ستيشن") {
            normalizedBodyType = "Wagon";
          } else if (rawBodyType.toLowerCase().includes("van") || rawBodyType === "ואן" || rawBodyType === "فان") {
            normalizedBodyType = "Van";
          }
          return {
            id: product.id,
            mainImage: product.image?.url ? `http://${product.store.hostname}${product.image.url}` : "/default-car.png",
            alt: product.name || "Car Image",
            title: product.name,
            miles: product.details?.car.miles || "N/A",
            fuel: normalizedFuelType,
            condition: product.details?.car.condition || "Used",
            transmission: product.details?.car.transmission || "Unknown",
            details: product.details?.car || "Unknown",
            price: `$${product.price.toLocaleString()}`,
            mileage: product.details?.car.miles || "N/A",
            year: product.details.car.year,
            pros: product.details.car.pros,
            cons: product.details.car.cons,
            fuelType: normalizedFuelType,
            make: normalizedMake,
            slug: product.slug,
            createdAt: product.createdAt,
            bodyType: normalizedBodyType,
            description: product.details.car.description,
            features: product.details.car.features.map((feature: any) => feature.value) || [],
            category: product.categories ? product.categories.split(",").map((c: string) => c.toLowerCase().trim()) : [],
          };
        });

        // Find the car with matching ID
  const carData = formattedListings.find((car: any) => car.slug.toString() === slug);
  if (!carData) {
    throw new Error("Car not found");
  }

        // Fetch pros and cons
  const prosConsResponse = await fetch(`${baseUrl}/api/prosandcons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
      'Accept-Language': locale
          },
          body: JSON.stringify({
            make: carData.make,
            model: carData.model,
            year: carData.year,
            specs: carData.specs
    }),
    next: {
      revalidate: 3600 // Revalidate every hour
    }
  });

  const prosConsData = await prosConsResponse.json();

  return {
    car: carData,
    listings: formattedListings,
    prosAndCons: prosConsData
  };
}

export default async function CarDetailsPage({ params }: { params: { slug: string } }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'ar';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const initialData = await getCarDetails(params.slug, locale);

    return (
      <>
        <div className='mt-10'>
        </div>
        <CarDetailsContent initialData={initialData} slug={params.slug} />
      </>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link href="/car-listing" className="text-primary hover:text-primary-dark">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }
}


