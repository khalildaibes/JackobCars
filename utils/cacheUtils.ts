import { LRUCache } from 'lru-cache';

// Create a cache instance with LRU (Least Recently Used) strategy
const cache = new LRUCache<string, any>({
  max: 100, // Maximum number of items
  ttl: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
});

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    return cache.get(key) as T | null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

export const setCachedData = async <T>(key: string, data: T, ttl?: number): Promise<void> => {
  try {
    cache.set(key, data, { ttl: ttl ? ttl * 1000 : undefined });
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    cache.clear();
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}; 