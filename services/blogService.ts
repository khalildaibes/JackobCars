import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Create axios instance with default config
const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Enable credentials
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response || error);
    return Promise.reject(error);
  }
);

interface BlogPost {
  title: string;
  description: string;
  slug: string;
  author: string;
  tags: string[];
  coverImage: {
    url: string;
    alt: string;
  };
  createdAt: string;
  content: any[];
  locale: string;
}

export const blogService = {
  async createBlogPost(post: BlogPost, files: File[]) {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      // Create the data object with all required fields
      const postData = {
        title: post.title,
        description: post.description,
        slug: post.slug,
        tags: post.tags,
        author: post.author,
        content: post.content,
        locale: post.locale,
        coverImage: post.coverImage
      };

      // Append the stringified data to formData
      formData.append('data', JSON.stringify(postData));

      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to create blog post ${response.statusText}`, { cause: response });
      }

      return response.json();
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async getBlogPost(slug: string, locale: string = 'en') {
    try {
      const response = await fetch(`/api/articles?slug=${slug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();
      return data.data[0];
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  async getAllBlogPosts(locale: string = 'en') {
    try {
      const response = await fetch(`/api/articles?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  async updateBlogPost(id: string, post: Partial<BlogPost>, files: File[] = []) {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('data', JSON.stringify(post));

      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  async deleteBlogPost(id: string) {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  async uploadMedia(file: File) {
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('data', JSON.stringify({}));

      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      const data = await response.json();
      return data.data[0];
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }
}; 