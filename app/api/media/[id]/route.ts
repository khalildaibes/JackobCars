import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get the hostname from the request headers or query params
    const hostname = request.headers.get('host') || request.nextUrl.searchParams.get('hostname');
    
    if (!hostname) {
      return NextResponse.json({ error: 'Hostname is required' }, { status: 400 });
    }
    
    // Validate the ID parameter
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 });
    }

    // Construct the Strapi media URL
    const strapiUrl = `http://${hostname}/api/files/${id}`;
    
    console.log('Fetching media from:', strapiUrl);
    
    // Fetch the media file from Strapi
    const response = await fetch(strapiUrl);
    
    if (!response.ok) {
      console.error('Strapi API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Get the media file data
    const mediaData = await response.json();
    console.log('Media data from Strapi:', mediaData);
    
    // Get the actual file URL
    const fileUrl = `http://${hostname}${mediaData.url}`;
    console.log('Fetching file from:', fileUrl);
    
    // Fetch the actual file content
    const fileResponse = await fetch(fileUrl);
    
    if (!fileResponse.ok) {
      console.error('File fetch error:', fileResponse.status, fileResponse.statusText);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get the file content and headers
    const fileBuffer = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    const contentLength = fileResponse.headers.get('content-length');
    
    console.log('File loaded successfully:', {
      contentType,
      contentLength,
      fileSize: fileBuffer.byteLength
    });
    
    // Create response with proper headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    headers.set('Access-Control-Allow-Origin', '*'); // Allow CORS
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // Return the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error serving media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
