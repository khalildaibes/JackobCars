import React, { useEffect, useState } from 'react';

interface TikTokEmbedProps {
  url: string;
  width?: string | number;
  height?: string | number;
}

const TikTokEmbed: React.FC<TikTokEmbedProps> = ({ url, width = '100%', height = 600 }) => {
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbed = async () => {
      try {
        setError(null);
        setEmbedHtml(null);
        const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('Failed to fetch TikTok embed');
        const data = await res.json();
        setEmbedHtml(data.html);
      } catch (err: any) {
        setError(err.message || 'Error loading TikTok video');
      }
    };
    fetchEmbed();
  }, [url]);

  useEffect(() => {
    // TikTok requires their embed.js script to be loaded
    if (embedHtml) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [embedHtml]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!embedHtml) return <div>Loading TikTok video...</div>;

  return (
    <div
      style={{ width, height, maxWidth: 605, minWidth: 325, margin: '0 auto' }}
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
};

export default TikTokEmbed; 