"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { Img } from "../../../components/Img";
import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

interface Params {
  slug: string;
}

export default function BlogListPage({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
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

          // Fetch related articles
          const relatedResponse = await fetch(`/api/articles?category=${article.categories?.[0]?.id}&limit=3&exclude=${article.id}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedArticles(relatedData.data || []);
          }
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
                    src={image.url}
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

    const shareArticle = (platform: string) => {
      const url = window.location.href;
      const title = article.title;
      let shareUrl = '';

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
          break;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
      <main className="min-h-screen pt-20 bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          {cover?.url ? (
            <Img
              src={cover.url}
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

        {/* Content and Sidebar Layout */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* First Image from Conver */}
              {conver?.length > 0 && (
                <section className="mb-8">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
                    <Img
                      src={conver[0].url}
                      alt="Featured gallery image"
                      external={true}
                      width={1920}
                      height={1080}
                      className="object-cover"
                    />
                  </div>
                </section>
              )}

              {/* Content Blocks */}
              <article>
                {/* Render first half of content blocks */}
                {content?.length > 0 && (
                  <div className="mb-8">
                    {content.slice(0, Math.ceil(content.length / 2)).map((block: any) => renderContent(block))}
                  </div>
                )}

                {/* Gallery Section - Middle Images */}
                {conver?.length > 1 && (
                  <section className="py-12 bg-gray-50 my-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {conver.slice(1, -1).map((image: any, index: number) => (
                        <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
                          <Img
                            src={image.url}
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
                  <section className="mb-8">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
                      <Img
                        src={conver[conver.length - 1].url}
                        alt="Final gallery image"
                        external={true}
                        width={1920}
                        height={1080}
                        className="object-cover"
                      />
                    </div>
                  </section>
                )}

                {/* Show message if no content */}
                {(!content?.length && !blocks?.length) && (
                  <p className="text-center text-gray-500">No content found in this article.</p>
                )}
              </article>

              {/* Social Sharing */}
              <section className="py-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => shareArticle('facebook')}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareArticle('twitter')}
                    className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareArticle('linkedin')}
                    className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareArticle('whatsapp')}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                  <div className="space-y-6">
                    {relatedArticles.map((relatedArticle) => (
                      <article key={relatedArticle.id} className="group">
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
                          <Img
                            src={relatedArticle.cover?.url || '/placeholder.jpg'}
                            alt={relatedArticle.title}
                            external={true}
                            width={800}
                            height={450}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{relatedArticle.description}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modern Video Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Featured Videos</h2>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
                    <div className="relative aspect-video">
                      <Img
                        src={`/video-thumbnail-${index}.jpg`}
                        alt={`Video thumbnail ${index}`}
                        external={true}
                        width={800}
                        height={450}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        Video Title {index}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        Brief description of the video content that provides context and engages viewers.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
}