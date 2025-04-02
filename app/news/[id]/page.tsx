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

    const renderContent = (block: any) => {
      console.log('Block:', block); // Debug log

      // Handle the children array structure
      const content = block.children?.map((child: any) => child.text).join('') || '';

      // Function to split content and render images
      const renderContentWithImages = (text: string) => {
        if (!conver?.length) return <div dangerouslySetInnerHTML={{ __html: text }} />;

        const parts = text.split(/\{\{image\}\}/);
        let currentImageIndex = 0;

        return parts.map((part, index) => {
          if (index === parts.length - 1) {
            return <div key={`part-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
          }

          const image = conver[currentImageIndex];
          currentImageIndex++;

          return (
            <React.Fragment key={`fragment-${index}`}>
              <div dangerouslySetInnerHTML={{ __html: part }} />
              {image && (
                <div className="my-8">
                  <Img
                    src={`http://68.183.215.202${image.url}`}
                    alt={`Article image ${currentImageIndex}`}
                    external={true}
                    width={1920}
                    height={1080}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
            </React.Fragment>
          );
        });
      };

      switch (block.type) {
        case 'heading':
          return (
            <div key={block.id} className="mb-6">
              {block.level === 1 && (
                <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: content }}>
                </h1>
              )}
              {block.level === 2 && (
                <h2 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: content }}>
                </h2>
              )}
              {block.level === 3 && (
                <h3 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: content }}>
                </h3>
              )}
            </div>
          );
        case 'paragraph':
          return (
            <div key={block.id} className="mb-4 text-gray-800 leading-relaxed">
              {renderContentWithImages(content)}
            </div>
          );
        case 'list':
          return (
            <div key={block.id} className="mb-4">
              {block.format === 'ordered' ? (
                <ol className="list-decimal pl-6 space-y-2">
                  {block.children?.map((item: any, index: number) => (
                    <li key={index} className="text-gray-800">
                      {renderContentWithImages(item.children?.map((child: any) => child.text).join('') || '')}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  {block.children?.map((item: any, index: number) => (
                    <li key={index} className="text-gray-800">
                      {renderContentWithImages(item.children?.map((child: any) => child.text).join('') || '')}
                    </li>
                  ))}
                </ul>
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
        <section className="relative h-[60vh] w-full">
          {cover?.url ? (
            <Img
              src={`http://68.183.215.202${cover.url}`}
              alt={title}
              external={true}
              width={1920}
              height={1080}
              className="object-cover"
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
                  {author && (
                    <>
                      <span>•</span>
                      <span>{author}</span>
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
            {/* Render first half of content blocks */}
            {content?.length > 0 && (
              <div className="mb-8">
                {content.slice(0, Math.ceil(content.length / 2)).map((block: any) => renderContent(block))}
              </div>
            )}

            {/* Gallery Section - Middle Images */}
            {conver?.length > 1 && (
              <section className="py-12 bg-gray-50 my-12">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {conver.slice(1, -1).map((image: any, index: number) => (
                      <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
                        <Img
                          src={`http://68.183.215.202${image.url}`}
                          alt={`Gallery image ${index + 2}`}
                          external={true}
                          width={1920}
                          height={1080}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Render second half of content blocks */}
            {content?.length > 0 && (
              <div className="mb-8">
                {content.slice(Math.ceil(content.length / 2)).map((block: any) => renderContent(block))}
              </div>
            )}

            {/* Last Image from Conver */}
            {conver?.length > 2 && (
              <section className="py-8">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
                      <Img
                        src={`http://68.183.215.202${conver[0].url}`}
                        alt="Final gallery image"
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

            {/* Show message if no content */}
            {(!content?.length && !blocks?.length) && (
              <p className="text-center text-gray-500">No content found in this article.</p>
            )}
          </div>
        </article>
      </main>
    );
}