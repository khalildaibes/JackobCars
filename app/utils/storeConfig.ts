interface StoreConfig {
  id: number;
  name: string;
  hostname: string;
  apiToken: string;
}

let storeConfigs: Record<number, StoreConfig> = {};
let isInitialized = false;

export async function initializeStoreConfigs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/stores?populate=*`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch store configurations');
    }

    const data = await response.json();
    
    // Transform the data into our store config format
    storeConfigs = data.data.reduce((acc: Record<string, StoreConfig>, store: any) => {
      acc[store.hostname] = {
        id: store.id,
        name: store.name,
        hostname: store.hostname,
        apiToken: store.apiToken,
      };
      return acc;
    }, {});

    isInitialized = true;

    console.log(`storeConfigs: ${storeConfigs}`);

    return storeConfigs;
  } catch (error) {
    console.error('Error initializing store configs:', error);
    return {};
  }
}

export function getStoreConfig(store_hostname: string): StoreConfig | null {
  console.log("Getting store config for:", storeConfigs);
  return storeConfigs[store_hostname] || null;
}

export function getAllStoreConfigs(): Record<string, StoreConfig> {
  return storeConfigs;
} 