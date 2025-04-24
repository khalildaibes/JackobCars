"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { Img } from "../../../components/Img";
import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter, Link as LinkIcon, MessageCircle } from "lucide-react";

interface Params {
  slug: string;
}

interface Comment {
  id: number;
  body: string;
  date: string;
  admin_user: {
    name: string;
    email: string;
    };
  likes: number;
}

export default function BlogListPage({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const t = useTranslations('NewsPage');
  
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
          setComments(article.comments);
          // Fetch related articles based on categories
          if (article.categories && article.categories.length > 0) {
            const categoryIds = article.categories.map((cat: any) => cat.id).join(',');
            const relatedResponse = await fetch(`/api/articles?categories=${categoryIds}&limit=3`);
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              setRelatedArticles(relatedData.data.filter((a: any) => a.id !== article.id));
            }
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

    const handleCommentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      setSubmittingComment(true);
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            article_id: article.id,
            body: newComment,
            admin_user: 'Guest', // This should be replaced with actual user info when authentication is implemented
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to post comment');
        }

        const data = await response.json();
        setComments(prevComments => [...prevComments, data.data]);
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment:', error);
        // You might want to show an error message to the user
      } finally {
        setSubmittingComment(false);
      }
    };

    const handleLike = async (commentId: number) => {
      try {
        const response = await fetch(`/api/comments/${commentId}/like`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to like comment');
        }

        const data = await response.json();
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes: data.likes }
              : comment
          )
        );
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    };

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

    // Get author name from author object
    const authorName = author?.name || author?.email || '';

    const renderContent = (content: any[]) => {
      return content.map((item, index) => {
        switch (item.type) {
          case 'heading':
            const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag key={index} className={`text-${7 - item.level}xl font-bold mb-4`}>
                {item.children[0].text}
              </HeadingTag>
            );
          case 'paragraph':
            const text = item.children[0].text;
            // Split text by newlines and render each line
            const lines = text.split('\n');
            return (
              <p key={index} className="mb-4 whitespace-pre-line">
                {lines.map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
          default:
            return null;
        }
      });
    };

    const renderBlock = (block: any) => {
      switch (block.__component) {
        case 'shared.rich-text':
          // Split the content by newlines and process each line
          const lines = block.body.split('\n');
          return (
            <div key={block.id} className="mb-6 prose prose-lg max-w-none">
              {lines.map((line: string, index: number) => {
                // Check if line is a heading
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-4xl font-bold mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-3xl font-bold mb-4">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-2xl font-bold mb-4">{line.substring(4)}</h3>;
                } else if (line.startsWith('#### ')) {
                  return <h4 key={index} className="text-xl font-bold mb-4">{line.substring(5)}</h4>;
                } else if (line.startsWith('##### ')) {
                  return <h5 key={index} className="text-lg font-bold mb-4">{line.substring(6)}</h5>;
                } else if (line.startsWith('###### ')) {
                  return <h6 key={index} className="text-base font-bold mb-4">{line.substring(7)}</h6>;
                }
                // Check for bold text
                const boldRegex = /\*\*(.*?)\*\*/g;
                const italicRegex = /\*(.*?)\*/g;
                const linkRegex = /\[(.*?)\]\((.*?)\)/g;
                
                let processedLine = line;
                
                // Process links
                processedLine = processedLine.replace(linkRegex, (match, text, url) => {
                  return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
                });
                
                // Process bold text
                processedLine = processedLine.replace(boldRegex, (match, text) => {
                  return `<strong class="font-bold">${text}</strong>`;
                });
                
                // Process italic text
                processedLine = processedLine.replace(italicRegex, (match, text) => {
                  return `<em class="italic">${text}</em>`;
                });
                
                return (
                  <div 
                    key={index} 
                    className="mb-4 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: processedLine }}
                  />
                );
              })}
            </div>
          );
        case 'shared.media':
          return (
            <div key={block.id} className="my-8">
              {block.file && (
                
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <Img
                    src={`http://64.227.112.249${block.file.url}`}
                    alt={block.file.alternativeText || 'Media content'}
                    external={true}
                    width={block.file.width || 1920}
                    height={block.file.height || 1080}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          );
        case 'shared.quote':
          return (
            <div key={block.id} className="my-8 p-6 bg-gray-50 border-l-4 border-blue-500">
              <blockquote className="text-xl italic text-gray-700">
                {block.body}
              </blockquote>
              {block.title && (
                <p className="mt-4 text-gray-600">— {block.title}</p>
              )}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <main className="min-h-screen bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative w-full min-h-[60vh]">
          {cover?.url ? (
            <Img
              src={`http://64.227.112.249${cover.url}`}
              alt={title}
              external={true}
              width={1920}
              height={1080}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/30" />
          
          {/* Content Container */}
          <div className="relative container mx-auto px-4 pt-32 pb-20">
            <div className="max-w-4xl mx-auto">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/90">
                {categories?.[0]?.name && (
                  <span className="bg-blue-600/90 px-4 py-1.5 rounded-full font-medium">
                    {categories[0].name}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(publishedAt).toLocaleDateString()}
                  </span>
                  {authorName && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {authorName}
                    </span>
                  )}
                </div>
              </div>

              {/* Title and Description */}
              <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  {title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Social Sharing Options */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg w-full">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">{t('share_article')}</h3>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, '_blank')}
                      className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                      className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      aria-label="Share on Instagram"
                    >
                      <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + window.location.href)}`, '_blank')}
                      className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      aria-label="Share on WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        // You might want to add a toast notification here
                      }}
                      className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      aria-label="Copy link"
                    >
                      <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* First Image from Conver */}
        {/* {conver?.length > 0 && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
                  <Img
                    src={`http://64.227.112.249${conver[0].url}`}
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
        )} */}

        {/* Content Blocks */}
        <article className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* {content && renderContent(content)} */}
            {blocks?.map((block: any) => renderBlock(block))}
            
            {/* Show message if no content */}
            {(!content?.length && !blocks?.length) && (
              <p className="text-center text-gray-500">No content found in this article.</p>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">{t('comments')} ({comments.length})</h2>
              
              {/* Comments List */}
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {comment.admin_user && comment.admin_user.name && (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {comment.admin_user.name.toUpperCase()}
                          </span>
                        </div>
                        )}
                        {comment.admin_user && comment.admin_user.name && (
                        <div>
                          <h3 className="font-medium text-gray-900">{comment.admin_user && comment.admin_user.name}</h3>
                          <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                        </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleLike(comment.id)}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label="Like comment"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                        </button>
                        <span className="text-sm text-gray-600">{comment.likes}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.body}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {t('no_comments')}
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{t('add_comment')}</h3>
                <form className="space-y-4" onSubmit={handleCommentSubmit}>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('your_comment')}
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('write_comment')}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? t('posting_comment') : t('post_comment')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* View Car on Market Section */}
        {article?.car && (
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">{t('view_car_on_market')}</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      {article.car.images?.main && (
                        <Img
                          src={`http://64.227.112.249${article.car.images.main}`}
                          alt={article.car.name}
                          external={true}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-bold mb-2">{article.car.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600">{t('year')}</p>
                          <p className="font-semibold">{article.car.year}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('price')}</p>
                          <p className="font-semibold">${article.car.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('mileage')}</p>
                          <p className="font-semibold">{article.car.mileage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t('transmission')}</p>
                          <p className="font-semibold">{article.car.transmission}</p>
                        </div>
                      </div>
                      <Link 
                        href={`/car-listing/${article.car.slug}`}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t('view_details')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">{t('related_articles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <Link 
                    key={relatedArticle.id} 
                    href={`/news/${relatedArticle.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {relatedArticle.cover?.url && (
                      <Img
                        src={`http://64.227.112.249${relatedArticle.cover.url}`}
                        alt={relatedArticle.title}
                        external={true}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        {relatedArticle.categories?.[0]?.name && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {relatedArticle.categories[0].name}
                          </span>
                        )}
                        <span>{new Date(relatedArticle.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{relatedArticle.title}</h3>
                      <p className="text-gray-600 line-clamp-3">{relatedArticle.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    );
}