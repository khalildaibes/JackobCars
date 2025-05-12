import React, { useEffect, useState } from 'react';

interface InstagramEmbedProps {
  url: string;
  width?: string | number;
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url, width = '100%' }) => {
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbed = async () => {
      try {
        setError(null);
        setEmbedHtml(null);
        const res = await fetch(`https://www.instagram.com/p/BFKjVxkBsCC/embed`);
        if (!res.ok) throw new Error('Failed to fetch Instagram embed');
        const data = await res.json();
        setEmbedHtml(data.html);
      } catch (err: any) {
        setError(err.message || 'Error loading Instagram video');
      }
    };
    fetchEmbed();
  }, [url]);

  useEffect(() => {
    if (embedHtml) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [embedHtml]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!embedHtml) return <div>Loading Instagram post...</div>;

  return (
    <div
      style={{
        width: width,
        maxWidth: 540,
        minWidth: 320,
        margin: '0 auto',
        overflow: 'auto',
      }}
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
};

export default InstagramEmbed;