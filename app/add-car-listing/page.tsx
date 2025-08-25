"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Test Page - Add Car Listing
        </h1>
        <p className="text-gray-600">
          If you can see this, the routing is working correctly.
        </p>
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          ✓ Page loaded successfully
        </div>
      </div>
    </div>
  );
} 