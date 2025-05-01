import { Cache } from 'react-native-cache';

// Create a cache instance
const cache = new Cache({
  namespace: 'car-dealer-app',
  policy: {
    maxEntries: 100,
    stdTTL: 60 * 60 * 24, // 24 hours
  },
});

export const getCachedData = async (key: string) => {
  try {
    const cached = await cache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

export const setCachedData = async (key: string, data: any, ttl?: number) => {
  try {
    await cache.set(key, JSON.stringify(data), ttl);
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

export const clearCache = async () => {
  try {
    await cache.clearAll();
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}; 