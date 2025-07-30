import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'MaxSpeedLimit - ضمن السرعه القانونيه';
    const description = searchParams.get('description') || 'Premium Car Dealer';

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #050B20 0%, #1a2332 50%, #2d3748 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            color: 'white',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(66, 153, 225, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(129, 140, 248, 0.1) 0%, transparent 50%)
              `,
              zIndex: 1,
            }}
          />

          {/* Car Icons */}
          <div
            style={{
              position: 'absolute',
              top: '50px',
              left: '50px',
              fontSize: '60px',
              opacity: 0.1,
              transform: 'rotate(-15deg)',
            }}
          >
            🚗
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              right: '50px',
              fontSize: '60px',
              opacity: 0.1,
              transform: 'rotate(15deg)',
            }}
          >
            🏎️
          </div>

          {/* Badge */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              background: 'rgba(66, 153, 225, 0.2)',
              color: '#4299e1',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid rgba(66, 153, 225, 0.3)',
            }}
          >
            Premium Car Dealer
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 2,
              padding: '60px',
              maxWidth: '900px',
            }}
          >
            {/* Logo Section */}
            <div style={{ marginBottom: '40px' }}>
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: '#ffffff',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                MaxSpeedLimit
              </div>
              <div
                style={{
                  fontSize: '36px',
                  marginBottom: '30px',
                  color: '#e2e8f0',
                  fontWeight: 600,
                }}
              >
                ضمن السرعه القانونيه
              </div>
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: '28px',
                marginBottom: '20px',
                color: '#cbd5e0',
                fontWeight: 500,
              }}
            >
              {description}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '22px',
                lineHeight: 1.4,
                color: '#a0aec0',
                marginBottom: '30px',
                maxWidth: '800px',
                textAlign: 'center',
              }}
            >
              High-quality vehicles, auto parts, services, and financing solutions. 
              Discover the best cars with competitive pricing.
            </div>

            {/* Website */}
            <div
              style={{
                fontSize: '20px',
                color: '#4299e1',
                fontWeight: 600,
                background: 'rgba(66, 153, 225, 0.1)',
                padding: '12px 24px',
                borderRadius: '8px',
              }}
            >
              maxspeedlimit.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 