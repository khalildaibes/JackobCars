'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { blogService } from '../../../app/services/blogService';

// Types for our blog content
type ContentBlockType = 'text' | 'heading' | 'image' | 'video';

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  headingLevel?: 1 | 2 | 3;
  file?: File;
  fileUrl?: string; // For preview
  alt?: string;
  htmlContent?: string; // For rich text content
}

interface BlogContent {
  title: string;
  description: string;
  slug: string;
  author: string;
  tags: string[];
  coverImage: {
    file?: File;
    fileUrl?: string;
    alt: string;
  };
  createdAt: string;
  content: ContentBlock[];
}

interface BlogTranslations {
  ar: BlogContent | null;
  en: BlogContent | null;
  'he-IL': BlogContent | null;
}

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />
});

// Add these new interfaces and functions after the existing interfaces
interface ExtractedImage {
  id: string;
  base64: string;
  originalText: string;
}

// Function to extract base64 images from content and replace with placeholders
const extractImagesFromContent = (content: string): { 
  processedContent: string;
  extractedImages: ExtractedImage[];
} => {
  const images: ExtractedImage[] = [];
  let processedContent = content;

  // Regular expression to match base64 images
  const base64Regex = /data:image\/[^;]+;base64,[^\s}]+/g;
  const matches = processedContent.match(base64Regex);

  if (matches) {
    matches.forEach((match, index) => {
      const imageId = `image_${Date.now()}_${index}`;
      images.push({
        id: imageId,
        base64: match,
        originalText: match
      });
      processedContent = processedContent.replace(match, `{{${imageId}}}`);
    });
  }

  return { processedContent, extractedImages: images };
};

// Function to convert base64 to File object
const base64ToFile = async (base64String: string, filename: string): Promise<File> => {
  const res = await fetch(base64String);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

// Define the PreviewModal props interface
interface PreviewModalProps {
  translations: BlogTranslations;
  previewLanguage: 'en' | 'ar' | 'he-IL';
  writingLanguage: 'en' | 'ar' | 'he-IL';
  isTranslating: boolean;
  isPublishing: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  handlePublish: () => void;
  setPreviewLanguage: (lang: 'en' | 'ar' | 'he-IL') => void;
}

export default function BlogEditor() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [blog, setBlog] = useState<BlogContent>({
    title: '',
    description: '',
    slug: '',
    author: '',
    tags: [],
    coverImage: {
      alt: '',
    },
    createdAt: new Date().toISOString(),
    content: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [translations, setTranslations] = useState<BlogTranslations>({
    en: null,
    ar: null,
    'he-IL': null
  });
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'ar' | 'he-IL'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [writingLanguage, setWritingLanguage] = useState<'en' | 'ar' | 'he-IL'>('en');

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      headingLevel: type === 'heading' ? 2 : undefined,
    };
    setBlog(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlog(prev => ({
      ...prev,
      content: prev.content.map(block => 
        block.id === id ? { ...block, ...updates } : block
      )
    }));
  };

  const removeBlock = (id: string) => {
    setBlog(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== id)
    }));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blog.content.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === blog.content.length - 1)
    ) return;

    const newContent = [...blog.content];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    
    setBlog(prev => ({ ...prev, content: newContent }));
  };

  const handleFileUpload = async (id: string, file: File, type: 'image' | 'video') => {
    // Create a preview URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    updateBlock(id, {
      file,
      fileUrl,
      content: file.name
    });
  };

  const renderFileBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(block.id, file, 'image');
                  }
                }}
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Choose Image
              </button>
              <span className="text-gray-600">
                {block.content || 'No file chosen'}
              </span>
            </div>
            {block.fileUrl && (
              <div className="relative">
                <img
                  src={block.fileUrl}
                  alt={block.alt || 'Preview'}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Alt text"
              className="w-full p-2 border rounded"
              value={block.alt || ''}
              onChange={e => updateBlock(block.id, { alt: e.target.value })}
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(block.id, file, 'video');
                  }
                }}
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Choose Video
              </button>
              <span className="text-gray-600">
                {block.content || 'No file chosen'}
              </span>
            </div>
            {block.fileUrl && (
              <div className="relative">
                <video
                  src={block.fileUrl}
                  controls
                  className="max-w-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderEditor = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full p-3 border rounded-lg"
          value={blog.title}
          onChange={e => setBlog(prev => ({ ...prev, title: e.target.value }))}
        />
        <textarea
          placeholder="Blog Description"
          className="w-full p-3 border rounded-lg"
          rows={3}
          value={blog.description}
          onChange={e => setBlog(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => addBlock('text')}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Text
        </button>
        <button
          onClick={() => addBlock('heading')}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Heading
        </button>
        <button
          onClick={() => addBlock('image')}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Image
        </button>
        <button
          onClick={() => addBlock('video')}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Video
        </button>
      </div>

      <div className="space-y-4">
        {blog.content.map((block, index) => (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium capitalize">{block.type}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blog.content.length - 1}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {block.type === 'text' && (
              <div className="relative">
                <ReactQuill
                  value={block.content || ''}
                  onChange={(content) => updateBlock(block.id, { 
                    content,
                    htmlContent: content
                  })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link'],
                      ['clean']
                    ],
                  }}
                  className="h-64 bg-white rounded-lg"
                  theme="snow"
                  placeholder="Start writing..."
                />
                <style jsx global>{`
                  .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                  }
                  .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background: #f9fafb;
                  }
                  .ql-editor {
                    min-height: 200px;
                  }
                  /* Hide the arrows */
                  .ql-toolbar .ql-formats {
                    display: none;

                  }
                  .ql-toolbar .ql-formats:last-child {
                    margin-right: 0;
                  }
                  .ql-toolbar .ql-formats button {
                    display: none;
                  }
                  .ql-toolbar .ql-formats select {
                    display: none;
                  }
                `}</style>
              </div>
            )}

            {block.type === 'heading' && (
              <div className="flex gap-2">
                <select
                  value={block.headingLevel}
                  onChange={e => updateBlock(block.id, { headingLevel: Number(e.target.value) as 1 | 2 | 3 })}
                  className="p-2 border rounded"
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  value={block.content}
                  onChange={e => updateBlock(block.id, { content: e.target.value })}
                />
              </div>
            )}

            {(block.type === 'image' || block.type === 'video') && renderFileBlock(block)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <article className="prose lg:prose-xl max-w-none">
      <h1>{blog.title}</h1>
      <p className="text-gray-600">{blog.description}</p>
      
      {blog.content.map(block => {
        switch (block.type) {
          case 'text':
            return (
              <div 
                key={block.id}
                className="my-4"
                dangerouslySetInnerHTML={{ __html: block.htmlContent || block.content }}
              />
            );
          
          case 'heading':
            const HeadingTag = `h${block.headingLevel}` as keyof JSX.IntrinsicElements;
            return <HeadingTag key={block.id}>{block.content}</HeadingTag>;
          
          case 'image':
            return (
              <figure key={block.id}>
                <img 
                  src={block.fileUrl} 
                  alt={block.alt || block.content} 
                  className="w-full rounded-lg"
                />
                {block.alt && (
                  <figcaption className="text-center text-gray-500">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          
          case 'video':
            return (
              <div key={block.id} className="aspect-video">
                <video
                  src={block.fileUrl}
                  controls
                  className="w-full h-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          
          default:
            return null;
        }
      })}
    </article>
  );

  // Update the translateText function to properly handle the API call
  const translateText = async (text: string, targetLang: 'ar' | 'en' | 'he-IL') => {
    try {
      const langMap = {
        'ar': 'Arabic',
        'en': 'English',
        'he-IL': 'Hebrew'
      };

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang: langMap[targetLang]
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Update the translateBlog function to handle image placeholders
  const translateBlog = async (blog: BlogContent, targetLang: 'ar' | 'en' | 'he-IL'): Promise<BlogContent> => {
    try {
      // Translate basic fields
      const [translatedTitle, translatedDescription, translatedAuthor] = await Promise.all([
        translateText(blog.title, targetLang),
        translateText(blog.description, targetLang),
        translateText(blog.author, targetLang)
      ]);

      // Translate content blocks
      const translatedContent = await Promise.all(
        blog.content.map(async (block) => {
          const newBlock = { ...block };
          
          if (block.type === 'text') {
            // Split content by image placeholders
            const parts = block.content.split(/(\{\{image_[^}]+\}\})/g);
            
            // Translate only text parts, preserve image placeholders
            const translatedParts = await Promise.all(
              parts.map(async (part) => {
                if (part.startsWith('{{image_') && part.endsWith('}}')) {
                  return part; // Keep image placeholder as is
                }
                return await translateText(part, targetLang);
              })
            );
            
            // Rejoin the content
            newBlock.content = translatedParts.join('');
            newBlock.htmlContent = newBlock.content;
          }
          else if (block.type === 'heading') {
            newBlock.content = await translateText(block.content, targetLang);
          }
          else if (block.type === 'image' && block.alt) {
            newBlock.alt = await translateText(block.alt, targetLang);
          }

          return newBlock;
        })
      );

      // Return translated blog content
      return {
        ...blog,
        title: translatedTitle,
        description: translatedDescription,
        author: translatedAuthor,
        slug: generateSlug(translatedTitle),
        content: translatedContent,
        coverImage: {
          ...blog.coverImage,
          alt: await translateText(blog.coverImage.alt, targetLang)
        }
      };
    } catch (error) {
      console.error('Translation error:', error);
      return blog;
    }
  };

  // Function to upload files to Strapi
  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  // Function to create blog entry in Strapi
  const createBlogEntry = async (content: BlogContent, locale: string) => {
    try {
      const response = await fetch(`/api/articles/${locale}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            title: content.title,
            description: content.description,
            slug: content.slug,
            author: content.author,
            tags: content.tags,
            categories :[],
            content: content.content,
            conver: {
              url: content.coverImage.fileUrl || '',
              alt: content.coverImage.alt
            },
          }
        })
      });

      if (!response.ok) {
        console.log(response.json());
        throw new Error('Failed to create blog entry');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Blog creation error:', error);
      throw error;
    }
  };

  // Update the handlePublish function to handle extracted images
  const handlePublish = async () => {
    try {
      setIsPublishing(true);

      // Process each content block to extract images
      const processedBlocks = await Promise.all(blog.content.map(async (block) => {
        if (block.type === 'text' && block.content) {
          const { processedContent, extractedImages } = extractImagesFromContent(block.content);
          
          // Convert extracted images to files and upload them
          const imageFiles = await Promise.all(
            extractedImages.map(async (img) => {
              const file = await base64ToFile(img.base64, `${img.id}.jpg`);
              return { id: img.id, file };
            })
          );

          // Upload images to Strapi
          const uploadedImages = await uploadFiles(imageFiles.map(img => img.file));

          // Replace placeholders with image URLs
          let finalContent = processedContent;
          uploadedImages.forEach((uploadedImage, index) => {
            const placeholder = `{{${imageFiles[index].id}}}`;
            const imageUrl = uploadedImage.url;
            finalContent = finalContent.replace(placeholder, `<img src="${imageUrl}" alt="Embedded Image" />`);
          });

          return {
            ...block,
            content: finalContent,
            htmlContent: finalContent
          };
        }
        return block;
      }));

      // Update blog content with processed blocks
      const processedBlog = {
        ...blog,
        content: processedBlocks
      };

      // Create blog post for each language
      const locales = ['en', 'ar', 'he-IL'];
      
      await Promise.all(
        locales.map(async (locale) => {
          const translatedContent = locale === writingLanguage 
            ? processedBlog 
            : await translateBlog(processedBlog, locale as 'ar' | 'en' | 'he-IL');

          await createBlogEntry(translatedContent, locale);
        })
      );

      alert('Blog published successfully in all languages!');
      router.push('/blog');
    } catch (error) {
      console.error('Publishing error:', error);
      alert('Error publishing blog. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Update the handlePreviewOpen function to properly handle translations
  const handlePreviewClick = async () => {
    setIsPreviewOpen(true);
    setIsTranslating(true);

    try {
      const newTranslations: BlogTranslations = {
        en: null,
        ar: null,
        'he-IL': null,
        [writingLanguage]: blog // Set the original content
      };

      // Determine which languages need translation
      const languagesToTranslate = ['en', 'ar', 'he-IL'].filter(
        lang => lang !== writingLanguage
      ) as Array<'en' | 'ar' | 'he-IL'>;

      // Translate to other languages
      const translationResults = await Promise.all(
        languagesToTranslate.map(async (targetLang) => {
          const translatedContent = await translateBlog(blog, targetLang);
          return { lang: targetLang, content: translatedContent };
        })
      );

      // Update translations with results
      translationResults.forEach(({ lang, content }) => {
        newTranslations[lang] = content;
      });

      setTranslations(newTranslations);
      setPreviewLanguage(writingLanguage); // Show original language first
    } catch (error) {
      console.error('Translation error:', error);
      alert('Error translating content. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (title: string) => {
    setBlog(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (currentTag && !blog.tags.includes(currentTag)) {
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle cover image upload
  const handleCoverImageUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setBlog(prev => ({
      ...prev,
      coverImage: {
        ...prev.coverImage,
        file,
        fileUrl
      }
    }));
  };

  const currentContent = translations[previewLanguage];
  const isOriginalLanguage = previewLanguage === writingLanguage;

  // Add this language selector component at the top of your editor
  const LanguageSelector = () => (
    <div className="mb-6 flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">
        Writing Language:
      </label>
      <select
        value={writingLanguage}
        onChange={(e) => setWritingLanguage(e.target.value as 'en' | 'ar' | 'he-IL')}
        className="px-3 py-2 border rounded"
      >
        <option value="en">English</option>
        <option value="ar">Arabic</option>
        <option value="he-IL">Hebrew</option>
      </select>
    </div>
  );

  // Update the ReactQuill configuration to handle image uploads
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const range = this.quill.getSelection(true);
                this.quill.insertEmbed(range.index, 'image', e.target?.result);
              };
              reader.readAsDataURL(file);
            }
          };
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-[10%]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Blog Post</h1>
        <div className="flex gap-4 items-center">
          <LanguageSelector />
          <button
            onClick={handlePreviewClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Preview
          </button>
        </div>
      </div>

      <div className={`${writingLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
        {/* Metadata Section */}
        <div className="space-y-6 mb-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={blog.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter blog title"
              dir={writingLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              value={blog.slug}
              onChange={(e) => setBlog(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full p-2 border rounded-md"
              placeholder="url-friendly-slug"
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              value={blog.author}
              onChange={(e) => setBlog(prev => ({ ...prev, author: e.target.value }))}
              className="w-full p-2 border rounded-md"
              placeholder="Author name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={blog.description}
              onChange={(e) => setBlog(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Brief description of the blog post"
              dir={writingLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverImageUpload(file);
                }}
                className="hidden"
                id="cover-image-upload"
              />
              <label
                htmlFor="cover-image-upload"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Choose Cover Image
              </label>
              {blog.coverImage.fileUrl && (
                <div className="relative mt-2">
                  <img
                    src={blog.coverImage.fileUrl}
                    alt={blog.coverImage.alt}
                    className="max-h-48 rounded-md"
                  />
                </div>
              )}
              <input
                type="text"
                value={blog.coverImage.alt}
                onChange={(e) => setBlog(prev => ({
                  ...prev,
                  coverImage: { ...prev.coverImage, alt: e.target.value }
                }))}
                className="w-full p-2 border rounded-md mt-2"
                placeholder="Image alt text"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 p-2 border rounded-md"
                placeholder="Add a tag"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Creation Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Creation Date
            </label>
            <input
              type="datetime-local"
              value={blog.createdAt.slice(0, 16)} // Format for datetime-local input
              onChange={(e) => setBlog(prev => ({
                ...prev,
                createdAt: new Date(e.target.value).toISOString()
              }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {isPreview ? renderPreview() : renderEditor()}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <PreviewModal
          translations={translations}
          previewLanguage={previewLanguage}
          writingLanguage={writingLanguage}
          isTranslating={isTranslating}
          isPublishing={isPublishing}
          setIsPreviewOpen={setIsPreviewOpen}
          handlePublish={handlePublish}
          setPreviewLanguage={setPreviewLanguage}
        />
      )}
    </div>
  );
}

// Update the PreviewModal component to accept props
const PreviewModal: React.FC<PreviewModalProps> = ({
  translations,
  previewLanguage,
  writingLanguage,
  isTranslating,
  isPublishing,
  setIsPreviewOpen,
  handlePublish,
  setPreviewLanguage
}) => {
  const currentContent = translations[previewLanguage];
  const isOriginalLanguage = previewLanguage === writingLanguage;

  return (
    <Dialog
      open={true}
      onClose={() => !isTranslating && setIsPreviewOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6">
          {isTranslating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg text-gray-600">Translating your content...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-2xl font-bold">
                  Preview Blog Post
                </Dialog.Title>
                <div className="flex gap-2">
                  <select
                    value={previewLanguage}
                    onChange={(e) => setPreviewLanguage(e.target.value as 'en' | 'ar' | 'he-IL')}
                    className="px-3 py-2 border rounded"
                    disabled={isTranslating}
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="he-IL">Hebrew</option>
                  </select>
                  
                  {isOriginalLanguage && (
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      Original
                    </span>
                  )}

                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    disabled={isTranslating}
                  >
                    Close
                  </button>
                  
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing || !translations.ar || !translations['he-IL']}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                      ${(isPublishing || !translations.ar || !translations['he-IL']) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>

              {currentContent ? (
                <article className={`prose lg:prose-xl max-w-none ${previewLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
                  <h1>{currentContent.title}</h1>
                  <p className="text-gray-600 text-lg">{currentContent.description}</p>
                  
                  <div className="mt-8">
                    {currentContent.content.map((block) => (
                      <div key={block.id} className="mb-6">
                        {block.type === 'text' && (
                          <div 
                            className="my-4"
                            dangerouslySetInnerHTML={{ __html: block.htmlContent || block.content }}
                          />
                        )}

                        {block.type === 'heading' && (
                          <div className={`text-${
                            block.headingLevel === 1 ? '3xl' : 
                            block.headingLevel === 2 ? '2xl' : 'xl'
                          } font-bold mb-4`}>
                            {block.content}
                          </div>
                        )}

                        {block.type === 'image' && (
                          <figure className="my-4">
                            <img
                              src={block.fileUrl}
                              alt={block.alt || ''}
                              className="w-full rounded-lg"
                            />
                            {block.alt && (
                              <figcaption className="text-center text-gray-500 mt-2">
                                {block.alt}
                              </figcaption>
                            )}
                          </figure>
                        )}

                        {block.type === 'video' && (
                          <div className="aspect-video my-4">
                            <video
                              src={block.fileUrl}
                              controls
                              className="w-full rounded-lg"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              ) : (
                <div className="text-center py-8">
                  <p>Translation not available for {previewLanguage}</p>
                </div>
              )}
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 