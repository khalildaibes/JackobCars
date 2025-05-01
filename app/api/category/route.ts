import { NextResponse } from 'next/server';

interface Store {
  id: number;
  hostname: string;
  name: string;
}

interface CategoryResponse {
  data: {
    id: number;
    attributes: {
      name: string;
      slug: string;
      description: string;
      stores: {
        data: Store[];
      };
    };
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  details: {
    car: {
      fuel: string;
      year: number;
      miles: string;
      make: string;
      body_type: string;
    };
  };
}

interface StoreResponse {
  store: Store;
  products: Product[];
  error: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // First, fetch the category information from the main server
    const categoryResponse = await fetch(
      `http://64.227.112.249/api/categories?filters[slug][$eq]=${categorySlug}&populate=stores`
    );

    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch category information');
    }

    const categoryData: CategoryResponse = await categoryResponse.json();
    
    if (!categoryData.data) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const stores = categoryData.data.attributes.stores.data;
    
    // Create an array of promises to fetch products from each store
    const storePromises: Promise<StoreResponse>[] = stores.map(async (store) => {
      try {
        const storeUrl = `http://${store.hostname}/api/products?filters[categories][$contains]=${categorySlug}`;
        const response = await fetch(storeUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch from store ${store.hostname}: ${response.statusText}`);
          return { store, products: [], error: `Failed to fetch products: ${response.statusText}` };
        }

        const data = await response.json();
        return { store, products: data.data || [], error: null };
      } catch (error) {
        console.error(`Error fetching from store ${store.hostname}:`, error);
        return { store, products: [], error: 'Failed to fetch products' };
      }
    });

    // Wait for all store requests to complete
    const storeResults = await Promise.all(storePromises);

    // Combine all products with their store information
    const allProducts = storeResults.flatMap(({ store, products }) => {
      return products.map((product: Product) => ({
        ...product,
        store: {
          id: store.id,
          name: store.name,
          hostname: store.hostname
        }
      }));
    });

    // Filter out stores that failed to respond
    const successfulStores = storeResults
      .filter(result => !result.error)
      .map(result => result.store);

    return NextResponse.json({
      data: {
        category: {
          id: categoryData.data.id,
          name: categoryData.data.attributes.name,
          slug: categoryData.data.attributes.slug,
          description: categoryData.data.attributes.description
        },
        products: allProducts,
        stores: successfulStores,
        meta: {
          totalProducts: allProducts.length,
          totalStores: successfulStores.length,
          failedStores: storeResults.filter(result => result.error).length
        }
      }
    });
  } catch (error) {
    console.error('Error in category API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 