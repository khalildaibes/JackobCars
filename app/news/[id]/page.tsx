"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { Img } from "../../../components/Img";
import React from "react";

interface Params {
  slug: string;
}

export default function BlogListPage({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchArticles = async () => {
        try {
          const response = await fetch(`/api/articles?slug=${params.id}`);
          if (!response.ok) throw new Error(`Failed to fetch article: ${response.statusText}`);
          const data = await response.json();
          
          if (!data || !data.data || data.data.length === 0) {
            throw new Error("Article not found");
          }

          const article = data.data[0];
          setArticle(article);
        }
        catch (error) {
          console.error('Error fetching article:', error);
          setError(error instanceof Error ? error.message : 'Failed to load article');
        } finally {
          setLoading(false);
        }
      }
      fetchArticles();
    }, [params.id]);

    if (loading) {
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (error || !article) {
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error || 'Article not found'}</p>
          </div>
        </div>
      );
    }

    // The article data is directly in the article object, not in attributes
    const {
      title,
      description,
      publishedAt,
      author,
      cover,
      content,
      blocks,
      conver,
      categories,
    } = article;
    console.log('article:', article);

    // Get author name from author object
    const authorName = author?.name || author?.email || '';

    const renderBlock = (block: any) => {
      console.log('Block:', block); // Debug log

      switch (block.__component) {
        case 'shared.rich-text':
          // Parse the HTML content to handle headings
          const parser = new DOMParser();
          const doc = parser.parseFromString(block.body, 'text/html');
          
          // Replace heading elements with proper styling
          const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach(heading => {
            const level = parseInt(heading.tagName[1]);
            heading.className = `text-${7 - level}xl font-bold mb-4`;
          });

          return (
            <div key={block.id} className="mb-6">
              <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />
            </div>
          );
        case 'shared.media':
          return (
            <div key={block.id} className="my-8">
              <Img
                src={`http://68.183.215.202${block.file?.url}`}
                alt={block.file?.alternativeText || 'Article image'}
                external={true}
                width={1920}
                height={1080}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          );
        case 'shared.quote':
          return (
            <div key={block.id} className="my-8 p-6 bg-gray-50 border-l-4 border-blue-500">
              <blockquote className="text-xl italic text-gray-700">
                {block.quote}
              </blockquote>
              {block.author && (
                <p className="mt-4 text-gray-600">— {block.author}</p>
              )}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <main className="min-h-screen pt-20 bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative h-[40vh] w-full">
          {cover?.url ? (
            <Img
              src={`http://68.183.215.202${cover.url}`}
              alt={title}
              external={true}
              width={1920}
              height={1080}
              className="object-cover md:h-[40vh] h-[30vh] w-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex items-end">
            <div className="container mx-auto px-4 pb-16">
              <div className="max-w-4xl mx-auto text-white">
                <div className="flex items-center space-x-4 text-sm mb-4">
                  {categories?.[0]?.name && (
                    <span className="bg-blue-600 px-3 py-1 rounded-full">
                      {categories[0].name}
                    </span>
                  )}
                  <span>{new Date(publishedAt).toLocaleDateString()}</span>
                  {authorName && (
                    <>
                      <span>•</span>
                      <span>{authorName}</span>
                    </>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
                <p className="text-lg text-gray-300">{description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* First Image from Conver */}
        {conver?.length > 0 && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
                  <Img
                    src={`http://68.183.215.202${conver[0].url}`}
                    alt="Featured gallery image"
                    external={true}
                    width={1920}
                    height={1080}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Blocks */}
        <article className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {blocks?.map((block: any) => renderBlock(block))}
            
            {/* Show message if no content */}
            {(!blocks?.length) && (
              <p className="text-center text-gray-500">No content found in this article.</p>
            )}
          </div>
        </article>
      </main>
    );
}