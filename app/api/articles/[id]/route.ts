import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Helper function to make Strapi API calls
async function strapiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.statusText}`);
  }

  return response.json();
}

// GET /api/articles/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const response = await strapiRequest(
  `/api/articles/${params.id}?locale=${locale}&populate[blocks][populate]=*&populate[cover][populate]=*&populate[categories][populate]=*&populate[comments][populate]=*`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id]
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const postData = JSON.parse(formData.get('data') as string);

    // Handle file uploads if any
    let fileUrls = [];
    if (files.length > 0) {
      const uploadFormData = new FormData();
      files.forEach(file => uploadFormData.append('files', file));

      const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }

      const uploadData = await uploadResponse.json();
      fileUrls = uploadData.map((file: any) => file.url);
    }

    // Update the article
    const response = await strapiRequest(`/api/articles/${params.slug}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          ...postData,
          coverImage: fileUrls[0] || postData.coverImage,
        }
      }),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await strapiRequest(`/api/articles/${params.id}`, {
      method: 'DELETE',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
} 