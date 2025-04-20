import { StoreConfig } from '../types/store';

// Cache for store configurations
let storeConfigsCache: Record<string, StoreConfig> = {};
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getStoreConfigs = async (): Promise<Record<string, StoreConfig>> => {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (now - lastFetchTime < CACHE_DURATION && Object.keys(storeConfigsCache).length > 0) {
    return storeConfigsCache;
  }

  try {
    const response = await fetch('/api/stores/config');
    if (!response.ok) {
      throw new Error('Failed to fetch store configurations');
    }

    const { data } = await response.json();
    
    // Transform the data into our store config format
    storeConfigsCache = data.reduce((acc: Record<string, StoreConfig>, store: any) => {
      acc[store.slug] = {
        hostname: store.hostname,
        token: store.token,
        name: store.name,
        id: store.id
      };
      return acc;
    }, {});

    lastFetchTime = now;
    return storeConfigsCache;
  } catch (error) {
    console.error('Error fetching store configs:', error);
    // Return cached data even if it's expired, as a fallback
    return storeConfigsCache;
  }
};

export const getStoreConfig = async (storeId: string): Promise<StoreConfig> => {
  const configs = await getStoreConfigs();
  return configs[storeId] || {
    hostname: '64.227.112.249', // Default store
    token: process.env.DEFAULT_STORE_TOKEN || '',
    name: 'Default Store',
    id: 'default'
  };
}; 