"use client";

import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter, Link as LinkIcon, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import SidebarAds from "../../../components/ads/SidebarAds";
import ContentAds from "../../../components/ads/ContentAds";
import Header from "../../../components/Header";
import { 
  leftSidebarAds, 
  rightSidebarAds, 
  mobileAds 
} from "../../../data/ads-data";

// Utility function to sanitize HTML content
const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - you might want to use a library like DOMPurify for production
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

// Utility function to detect RTL content
const isRTLContent = (text: string): boolean => {
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

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

export default function BlogDetailClient({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
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
          setComments(article.comments || []);
          
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

    // Add structured data to page head for better SEO
    useEffect(() => {
      if (article) {
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": article.title,
          "description": article.description,
          "image": article.cover?.url ? `http://64.227.112.249${article.cover.url}` : "/logo-transparent.png",
          "author": {
            "@type": "Person",
            "name": article.author?.name || article.author?.email || "MaxSpeedLimit"
          },
          "publisher": {
            "@type": "Organization",
            "name": "MaxSpeedLimit - ضمن السرعه القانونيه",
            "logo": {
              "@type": "ImageObject",
              "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com'}/logo-transparent.png`
            }
          },
          "datePublished": article.publishedAt,
          "dateModified": article.updatedAt || article.publishedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://maxspeedlimit.com'}/news/${params.id}`
          },
          "articleSection": article.categories?.[0]?.name || "Automotive News",
          "keywords": [
            "MaxSpeedLimit",
            "ضمن السرعه القانونيه", 
            "automotive news",
            "car news",
            article.categories?.[0]?.name || "automotive"
          ].join(", ")
        };

        // Add structured data to page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);

        return () => {
          // Cleanup
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      }
    }, [article, params.id]);

    // Close lightbox on Escape key
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setLightboxSrc(null);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

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
            admin_user: 'Guest',
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

    // Render video embeds for TikTok, Instagram, YouTube, etc.
    const renderVideoEmbed = (videoData: any) => {
      // Handle different video formats
      if (typeof videoData === 'string') {
        const videoUrl = videoData;
        
                 // TikTok embed
         if (videoUrl.includes('tiktok.com')) {
           const videoId = extractTikTokVideoId(videoUrl);
           if (videoId) {
             return (
               <div className="w-full relative group">
                 <div className="relative w-full flex justify-center">
                   <blockquote 
                     className="tiktok-embed h-[600px] md:h-[700px] lg:h-[800px]" 
                     cite={videoUrl}
                     data-video-id={videoId}
                     style={{ 
                       width: '100%', 
                       maxWidth: '400px'
                     }}
                   >
                     <section></section>
                   </blockquote>
                   <script async src="https://www.tiktok.com/embed.js"></script>
                   
                   {/* Fullscreen overlay button */}
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                       onClick={() => {
                         const embedElement = document.querySelector('.tiktok-embed');
                         handleFullscreen(embedElement as HTMLElement);
                       }}
                       className="bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                       title="View in Fullscreen (Press F)"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                       </svg>
                     </button>
                   </div>
                 </div>
               </div>
             );
           }
         }
        
                 // Instagram embed
         if (videoUrl.includes('instagram.com')) {
           return (
             <div className="w-full relative group">
               <div className="relative w-full flex justify-center">
                 <iframe
                   src={`${videoUrl}/embed`}
                   width="100%"
                   height="600"
                   frameBorder="0"
                   scrolling="no"
                   allowTransparency={true}
                   className="rounded-lg h-[600px] md:h-[700px] lg:h-[800px]"
                   style={{ maxWidth: '400px' }}
                 ></iframe>
                 
                 {/* Fullscreen overlay button */}
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button
                     onClick={() => {
                       const iframe = document.querySelector('iframe[src*="instagram.com"]');
                       handleFullscreen(iframe as HTMLElement);
                     }}
                     className="bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                     title="View in Fullscreen (Press F)"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                     </svg>
                   </button>
                 </div>
               </div>
             </div>
           );
         }
        
                 // YouTube embed
         if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
           const videoId = extractYouTubeVideoId(videoUrl);
           if (videoId) {
             return (
               <div className="w-full relative group">
                 <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                   <iframe
                     src={`https://www.youtube.com/embed/${videoId}`}
                     title="YouTube video player"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     className="absolute inset-0 w-full h-full rounded-lg"
                   ></iframe>
                   
                   {/* Fullscreen overlay button */}
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                       onClick={() => {
                         const iframe = document.querySelector('iframe[src*="youtube.com"]');
                         handleFullscreen(iframe as HTMLElement);
                       }}
                       className="bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                       title="View in Fullscreen (Press F)"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                       </svg>
                     </button>
                   </div>
                 </div>
               </div>
             );
           }
         }
        
                 // Generic iframe for other video platforms
         return (
           <div className="w-full relative group">
             <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
               <iframe
                 src={videoUrl}
                 title="Video content"
                 frameBorder="0"
                 allowFullScreen
                 className="absolute inset-0 w-full h-full rounded-lg"
               ></iframe>
               
               {/* Fullscreen overlay button */}
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button
                   onClick={() => {
                     const iframe = document.querySelector('iframe[src*="' + videoUrl.split('/')[2] + '"]');
                     handleFullscreen(iframe as HTMLElement);
                   }}
                   className="bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                   title="View in Fullscreen (Press F)"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                   </svg>
                 </button>
               </div>
             </div>
           </div>
         );
      }
      
      // Handle video object with metadata
      if (typeof videoData === 'object' && videoData.url) {
        return (
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {videoData.thumbnail && (
                <div className="relative" style={{ height: '300px' }}>
                  <img
                    src={videoData.thumbnail}
                    alt={videoData.title || 'Video thumbnail'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{videoData.title || 'Video'}</h3>
                {videoData.description && (
                  <p className="text-gray-600 text-sm">{videoData.description}</p>
                )}
                <div className="mt-3">
                  {renderVideoEmbed(videoData.url)}
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // Fallback for unknown video format
      return (
        <div className="w-full max-w-md">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-gray-600">Video content: {JSON.stringify(videoData)}</p>
          </div>
        </div>
      );
    };

    // Helper functions to extract video IDs
    const extractTikTokVideoId = (url: string): string | null => {
      const match = url.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    };

    const extractYouTubeVideoId = (url: string): string | null => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

         // Fullscreen handler function
     const handleFullscreen = (element: HTMLElement | null) => {
       if (!element) return;
       
       // Add fullscreen styles to the element
       element.style.width = '100vw';
       element.style.height = '100vh';
       element.style.position = 'fixed';
       element.style.top = '0';
       element.style.left = '0';
       element.style.zIndex = '9999';
       element.style.backgroundColor = 'black';
       
       if (element.requestFullscreen) {
         element.requestFullscreen();
       } else if ((element as any).webkitRequestFullscreen) {
         (element as any).webkitRequestFullscreen();
       } else if ((element as any).msRequestFullscreen) {
         (element as any).msRequestFullscreen();
       }
     };

         // Handle fullscreen exit and reset styles
     const handleFullscreenExit = () => {
       const fullscreenElement = document.querySelector('iframe, .tiktok-embed') as HTMLElement;
       if (fullscreenElement) {
         fullscreenElement.style.width = '';
         fullscreenElement.style.height = '';
         fullscreenElement.style.position = '';
         fullscreenElement.style.top = '';
         fullscreenElement.style.left = '';
         fullscreenElement.style.zIndex = '';
         fullscreenElement.style.backgroundColor = '';
       }
     };

     // Keyboard shortcuts for fullscreen
     useEffect(() => {
       const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'f' || e.key === 'F') {
           e.preventDefault();
           const activeElement = document.activeElement;
           if (activeElement && (activeElement.tagName === 'IFRAME' || activeElement.classList.contains('tiktok-embed'))) {
             handleFullscreen(activeElement as HTMLElement);
           }
         }
         // Handle escape key to exit fullscreen
         if (e.key === 'Escape') {
           handleFullscreenExit();
         }
       };

       // Listen for fullscreen change events
       const handleFullscreenChange = () => {
         if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).msFullscreenElement) {
           handleFullscreenExit();
         }
       };

       document.addEventListener('keydown', handleKeyDown);
       document.addEventListener('fullscreenchange', handleFullscreenChange);
       document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
       document.addEventListener('msfullscreenchange', handleFullscreenChange);

       return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('fullscreenchange', handleFullscreenChange);
         document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
         document.removeEventListener('msfullscreenchange', handleFullscreenChange);
       };
     }, []);

    // Render article content blocks
    const renderBlock = (block: any) => {
      switch (block?.__component) {
        case 'shared.rich-text':
          // Check if content contains HTML tags
          const hasHtmlTags = /<[^>]*>/g.test(block?.body || '');
          
          if (hasHtmlTags) {
            // Handle HTML content with proper styling
            const isRTL = isRTLContent(block?.body || '');
            return (
              <div key={block?.id} className="mb-8">
                <div 
                  className="rich-text-content"
                  dir={isRTL ? "rtl" : "ltr"}
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(block?.body || '') 
                  }}
                />
              </div>
            );
          } else {
            // Handle plain text with markdown-style formatting
            const lines = block?.body?.split('\n') || [];
            return (
              <div key={block?.id} className="mb-6 prose prose-lg max-w-none">
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
                  
                  // Process markdown-style formatting
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
          }
        case 'shared.media':
          return (
            <div key={block?.id} className="my-8">
              {block?.file && (
                <button
                  type="button"
                  onClick={() => setLightboxSrc(`http://64.227.112.249${block?.file.url}`)}
                  className="block w-full text-left"
                  aria-label="Open image in fullscreen"
                >
                  <div className="relative w-full h-[300px] sm:h-auto sm:aspect-video rounded-none sm:rounded-xl overflow-hidden shadow-none sm:shadow-lg">
                    <Image
                      src={`http://64.227.112.249${block?.file.url}`}
                      alt={block?.file.alternativeText || 'Media content'}
                      fill
                      className="object-contain"
                    />
                  </div>
                </button>
              )}
            </div>
          );
        case 'shared.quote':
          return (
            <div key={block?.id} className="my-8 p-6 bg-gray-50 border-l-4 border-blue-500">
              <blockquote className="text-xl italic text-gray-700">
                {block?.body}
              </blockquote>
              {block?.title && (
                <p className="mt-4 text-gray-600">— {block?.title}</p>
              )}
            </div>
          );
        default:
          return null;
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
      categories,
      blocks,
      videos,
      content
    } = article;

    const authorName = author?.name || author?.email || '';

    return (
      <div className="min-h-screen bg-white text-gray-800">
        {/* Header */}
        
        
        <main>
          {/* Hero Section - Full Width */}
          <section className="relative w-full min-h-[60vh]">
          {cover?.url ? (
            <Image
              src={`http://64.227.112.249${cover.url}`}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/30" />
          
         {/* Content Container */}
         <div className="relative container mx-auto px-0 sm:px-4 pt-32 pb-20">
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-6">
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
                      onClick={() => {
                        const shareText = `${title}\n\n${description || 'Latest automotive news from MaxSpeedLimit'}\n\n`;
                        const shareUrl = window.location.href;
                        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`, '_blank');
                      }}
                      className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
                      aria-label="Share on WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
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

        {/* Main Layout Container - After Banner */}
        <div className="flex w-full">
          {/* Left Ads Sidebar - Hide on mobile */}
          <SidebarAds 
            ads={leftSidebarAds} 
            title="اعلانات ممولة" 
            position="left" 
          />

          {/* Main Content */}
          <div className="flex-1 lg:max-w-[56%] lg:mx-auto w-full">
            {/* Mobile Banner Ad */}
            <ContentAds 
              layout="mobile-banner" 
              ads={mobileAds} 
              className="mt-8 mb-8 lg:hidden" 
            />

            {/* Article Content */}
            <article className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-8 md:p-12 border border-gray-100">
                  
                  {/* Videos Section - TikTok/Instagram Embeds */}
                  {videos && videos.length > 0 && (
                    <section className="mb-12">
                      <div className="bg-gradient-to-br from-blue-50 via-white to-pink-50 rounded-2xl shadow-2xl p-4 sm:p-8 border border-blue-100">
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                          🎬 Video Content
                        </h2>
                        <div className="space-y-6 mb-12">
                          {Array.isArray(videos) ? videos.map((video, index) => (
                            <div key={index} className="flex justify-center">
                              {renderVideoEmbed(video)}
                            </div>
                          )) : (
                            <div className="flex justify-center">
                              {renderVideoEmbed(videos)}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Article Content Section */}
                  <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100">
                     
                      {/* Content Blocks */}
                      {blocks && blocks.length > 0 ? (
                        <div className="rich-text-content">
                          {blocks.map((block: any) => renderBlock(block))}
                        </div>
                      ) : content && content.length > 0 ? (
                        <div className="rich-text-content">
                          {content.map((item: any, index: number) => {
                            switch (item.type) {
                              case 'paragraph':
                                return (
                                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                                    {item.children?.[0]?.text || ''}
                                  </p>
                                );
                              case 'heading':
                                const HeadingTag = `h${item.level || 2}` as keyof JSX.IntrinsicElements;
                                return (
                                  <HeadingTag key={index} className={`text-${Math.max(2, 5-item.level)}xl font-bold mb-4 text-gray-900`}>
                                    {item.children?.[0]?.text || ''}
                                  </HeadingTag>
                                );
                              default:
                                return null;
                            }
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No article content available.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
            </article>

            {/* Comments Section */}
            <section className="py-8 bg-gray-50">
              <div className="container mx-auto px-0 sm:px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">{t('comments')} ({comments.length})</h2>
                  
                  {/* Comments List */}
                  <div className="space-y-6 mb-8">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            {comment.admin_user?.name && (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {comment.admin_user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">{comment.admin_user?.name || 'Guest'}</h3>
                              <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                            </div>
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
                            <span className="text-sm text-gray-600">{comment.likes || 0}</span>
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

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-0 sm:px-4">
                  <h2 className="text-3xl font-bold mb-8 text-center">{t('related_articles')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedArticles.map((relatedArticle) => (
                      <Link 
                        key={relatedArticle.id} 
                        href={`/news/${relatedArticle.slug}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {relatedArticle.cover?.url && (
                          <div className="relative h-56 sm:h-48 w-full">
                            <Image
                              src={`http://64.227.112.249${relatedArticle.cover.url}`}
                              alt={relatedArticle.title}
                              fill
                              className="object-cover"
                            />
                          </div>
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
          </div>

          {/* Right Ads Section - Hide on mobile */}
          <SidebarAds 
            ads={rightSidebarAds} 
            title="اعلانات ممولة" 
            position="right" 
          />
          </div>
          </main>
          {lightboxSrc && (
            <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
          )}
      </div>
    );
} 
 
// Lightbox Overlay
export function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="relative w-full h-full sm:h-auto sm:w-auto max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Media preview" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}
