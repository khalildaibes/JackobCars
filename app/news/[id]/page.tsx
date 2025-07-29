import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

// Server component for metadata generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com';
  
  try {
    // Fetch article data for metadata
    const response = await fetch(`${baseUrl}/api/articles?slug=${params.id}`, {
      cache: 'no-store' // Ensure fresh data for metadata
    });
    
    if (!response.ok) {
      return {
        title: 'Article Not Found | MaxSpeedLimit',
        description: 'The requested article could not be found.',
      };
    }

    const data = await response.json();
    
    if (!data || !data.data || data.data.length === 0) {
      return {
        title: 'Article Not Found | MaxSpeedLimit',
        description: 'The requested article could not be found.',
      };
    }

    const article = data.data[0];
    const {
      title,
      description,
      cover,
      author,
      publishedAt,
      categories
    } = article;

    // Create image URL for social sharing
    const imageUrl = cover?.url 
      ? `http://64.227.112.249${cover.url}`
      : `${baseUrl}/logo-transparent.png`;

    // Generate article URL
    const articleUrl = `${baseUrl}/news/${params.id}`;
    
    // Get author name
    const authorName = author?.name || author?.email || 'MaxSpeedLimit';
    
    // Get category name
    const categoryName = categories?.[0]?.name || 'Automotive News';

    return {
      title: `${title} | MaxSpeedLimit - ضمن السرعه القانونيه`,
      description: description || 'Latest automotive news and updates from MaxSpeedLimit',
      keywords: [
        'MaxSpeedLimit',
        'ضمن السرعه القانونيه',
        'automotive news',
        'car news',
        categoryName,
        'vehicle updates',
        'car industry'
      ].join(', '),
      authors: [{ name: authorName }],
      publisher: 'MaxSpeedLimit',
      category: categoryName,
      
      // Open Graph metadata for social media
      openGraph: {
        type: 'article',
        title: title,
        description: description || 'Latest automotive news and updates from MaxSpeedLimit',
        url: articleUrl,
        siteName: 'MaxSpeedLimit - ضمن السرعه القانونيه',
        locale: 'en_US',
        alternateLocale: ['ar_SA', 'he_IL'],
        publishedTime: publishedAt,
        authors: [authorName],
        section: categoryName,
        tags: ['automotive', 'cars', 'news', 'MaxSpeedLimit', 'ضمن السرعه القانونيه'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg',
          },
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: title,
            type: 'image/jpeg',
          }
        ],
      },

      // Twitter Card metadata
      twitter: {
        card: 'summary_large_image',
        site: '@MaxSpeedLimit',
        creator: `@${authorName}`,
        title: title,
        description: description || 'Latest automotive news and updates from MaxSpeedLimit',
        images: [imageUrl],
      },

      // Additional metadata for better SEO
      alternates: {
        canonical: articleUrl,
      },
      
      // Schema.org structured data
      other: {
        'article:published_time': publishedAt,
        'article:author': authorName,
        'article:section': categoryName,
        'article:tag': 'automotive,cars,news',
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': title,
        'twitter:image:alt': title,
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'MaxSpeedLimit News | ضمن السرعه القانونيه',
      description: 'Latest automotive news and updates from MaxSpeedLimit',
    };
  }
}

// Server component that renders the client component
export default function BlogDetailPage({ params }: { params: { id: string } }) {
  return <BlogDetailClient params={params} />;
}
