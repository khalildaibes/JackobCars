import { cookies, headers } from 'next/headers';
import CarDetailsContent from './CarDetailsContent';
import Link from 'next/link';


export default function CarDetailsPage({ params, searchParams }: { params: { slug: string }, searchParams?: { hostname?: string } }) {
  // Get hostname from searchParams or fallback to default
  const baseUrl = searchParams?.hostname || process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
  console.log('baseUrl', baseUrl);
  try {
    return (
      <>
        <div className='mt-10'>
        </div>
        <CarDetailsContent slug={params.slug} hostname={baseUrl} />
      </>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error.message}</h1>
          <Link href="/car-listing" className="text-primary hover:text-primary-dark">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }
}


