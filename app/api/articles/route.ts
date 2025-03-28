import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

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

// GET /api/articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug');

    let endpoint = '/api/articles';
    if (slug) {
      endpoint += `?filters[slug][$eq]=${slug}`;
    }
    endpoint += `&locale=${locale}&populate=*&sort=createdAt:desc`;

    const data = await strapiRequest(endpoint);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST /api/articles
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const postData = JSON.parse(formData.get('data') as string);

    // First, upload files if any
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

    // Create the article
    const response = await strapiRequest('/api/articles', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          ...postData,
          coverImage: fileUrls[0] || null,
        }
      }),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const response = await strapiRequest(`/api/articles/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
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