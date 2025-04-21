import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockProducts = {
  "bumpers": [
    {
      id: "1",
      name: "Heavy-Duty Front Bumper",
      slug: "heavy-duty-front-bumper",
      quantity: 15,
      price: 599.99,
      categories: [{ id: 1, name: "bumpers" }],
      image: [{ url: "/images/bumpers/front-bumper-1.jpg" }],
      details: {
        car: {
          cons: ["Installation requires professional help", "Heavier than stock bumper"],
          pros: ["Enhanced protection", "Winch compatible", "Stylish design"],
          fuel: "N/A",
          year: 2023,
          miles: "N/A",
          price: 599.99,
          badges: [
            { color: "bg-blue-100", label: "New Arrival", textColor: "text-blue-800" },
            { color: "bg-blue-100", label: "In Stock", textColor: "text-blue-800" }
          ],
          images: {
            main: "/images/bumpers/front-bumper-1.jpg",
            additional: [
              "/images/bumpers/front-bumper-1-side.jpg",
              "/images/bumpers/front-bumper-1-angle.jpg"
            ]
          },
          actions: {
            save: { icon: "heart", label: "Save" },
            share: { icon: "share", label: "Share" },
            compare: { icon: "compare", label: "Compare" }
          },
          mileage: "N/A",
          features: [
            { icon: "shield", label: "Material", value: "Steel" },
            { icon: "weight", label: "Weight", value: "85 lbs" },
            { icon: "tool", label: "Installation", value: "Professional" }
          ],
          transmission: "N/A",
          dimensions_capacity: [
            { label: "Width", value: "76 inches" },
            { label: "Height", value: "12 inches" },
            { label: "Depth", value: "14 inches" }
          ],
          engine_transmission_details: []
        }
      },
      colors: [
        { name: "Matte Black", quantity: 10 },
        { name: "Textured Black", quantity: 5 }
      ]
    }
  ],
  // Add more categories and products as needed
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }

    // Get products for the specified category
    const products = mockProducts[category as keyof typeof mockProducts] || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 