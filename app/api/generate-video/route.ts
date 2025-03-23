import { NextResponse } from 'next/server';

const D_ID_API_KEY = process.env.D_ID_API_KEY;
console.log(D_ID_API_KEY);
const D_ID_API_URL = 'https://api.d-id.com/talks';

export async function POST(request) {
  try {
    const { script, avatar } = await request.json();

    if (!script || !avatar) {
      return NextResponse.json(
        { error: 'Script and avatar are required' },
        { status: 400 }
      );
    }

    // Create talk
    const createResponse = await fetch(D_ID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${D_ID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: script,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural'
          }
        },
        source_url: avatar,
        config: {
          stitch: true,
        },
      }),
    });

    if (!createResponse.ok) {
      console.log(createResponse);
      throw new Error('Failed to create video');
    }

    const { id } = await createResponse.json();

    // Poll for video status
    let result;
    let attempts = 0;
    const maxAttempts = 30;
    const delay = 1000; // 1 second

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`${D_ID_API_URL}/${id}`, {
        headers: {
          'Authorization': `Basic ${D_ID_API_KEY}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check video status');
      }

      result = await statusResponse.json();

      if (result.status === 'done') {
        break;
      } else if (result.status === 'error') {
        throw new Error('Video generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }

    if (!result || result.status !== 'done') {
      throw new Error('Video generation timed out');
    }

    return NextResponse.json({ url: result.result_url });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 