import { Metadata } from 'next';
import BlogDetailsContent from './BlogDetailsContent';

async function getBlogPost(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles/${slug}?populate=*`, {
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }

  return response.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  return {
    title: post.data.attributes.title,
    description: post.data.attributes.description,
    openGraph: {
      title: post.data.attributes.title,
      description: post.data.attributes.description,
      images: post.data.attributes.cover?.data?.attributes?.url ? 
        [`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.data.attributes.cover.data.attributes.url}`] : 
        [],
    },
  };
}

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  return <BlogDetailsContent post={post.data} />;
} 