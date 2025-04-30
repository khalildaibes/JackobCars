import { NextResponse } from 'next/server';

export async function GET(request) {
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
    const categoryResponse =  await fetch(
      `http://64.227.112.249/api/categorys?filters[slug][$eq]=${categorySlug}&populate=stores&populate[stores][populate]=*&populate[products][populate]=*&populate[parts][populate]=*&populate[services][populate]=*`,
   {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
});

    if (!categoryResponse.ok) {
      console.log(categoryResponse);
      throw new Error('Failed to fetch category information');
    }

    const categoryData = await categoryResponse.json();
    
    if (!categoryData.data) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    console.log(categoryData);
    // First, fetch all stores
    const storesResponse =   await fetch(
      `http://64.227.112.249/api/stores?populate=*`,
   {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
});
    if (!storesResponse.ok) {
      throw new Error('Failed to fetch stores');
    }
    const storesData = await storesResponse.json();
    const stores = storesData.data || [];

    
    // Create an array of promises to fetch products, services, and parts from each store
    const storePromises = stores.map(async (store) => {
      console.log(store);
      try {
        // Fetch products
          const productsUrl = `http://${store.hostname}/api/products?filters[category][slug][$contains]=${categorySlug}&populate=*`;
        const productsResponse = await fetch(productsUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.apiToken}`,
          }
        });
        
        // Fetch services
        const servicesUrl = `http://${store.hostname}/api/servicess?filters[categories][slug][$contains]=${categorySlug}&populate=* `;
        const servicesResponse = await fetch(servicesUrl, {
          headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${store.apiToken}`,
          }
        });
        // Fetch parts
        const partsUrl = `http://${store.hostname}/api/partss?filters[categories][slug][$contains]=${categorySlug}&populate=*`;
        const partsResponse = await fetch(partsUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.apiToken}`,
          }
        });
        console.log(`http://${store.hostname}/api/partss?filters[categories][slug][$contains]=${categorySlug}&populate=*`, partsResponse, servicesResponse, productsResponse);
        const [productsData, servicesData, partsData] = await Promise.all([
          productsResponse.ok ? productsResponse.json() : { data: [] },
          servicesResponse.ok ? servicesResponse.json() : { data: [] },
          partsResponse.ok ? partsResponse.json() : { data: [] }
        ]);
        console.log(`productsData ${productsData.data.toString()}`);
        console.log(`servicesData ${servicesData.data.toString()}`);
        console.log(`partsData ${partsData.data.toString()}`);
        return {
          store,
          products: productsData.data || [],
          services: servicesData.data || [],
          parts: partsData.data || [],
          error: null
        };
      } catch (error) {
        console.error(`Error fetching from store ${store.hostname}:`, error);
        return { store, products: [], services: [], parts: [], error: 'Failed to fetch data' };
      }
    });

    // Wait for all store requests to complete
    const storeResults = await Promise.all(storePromises);
    console.log('storeResults', storeResults);

    // Combine all items with their store information
    const allItems = storeResults.flatMap(({ store, products, services, parts }) => {
      const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        store: store,
        quantity: product.quantity || 0,
        price: product.price || 0,
        images: product.images || [],
        details: {
          car: {
            cons: product.details?.car?.cons || [],
            pros: product.details?.car?.pros || [],
            fuel: product.details?.car?.fuel || "Unknown",
            year: product.details?.car?.year || new Date().getFullYear(),
            miles: product.details?.car?.miles || "N/A",
            price: product.details?.car?.price || 0,
            store: store,
            badges: product.details?.car?.badges || [],
            images: {
              main: product.details?.car?.images?.main || "",
              additional: product.details?.car?.images?.additional || []
            },
            actions: {
              save: { icon: "", label: "Save" },
              share: { icon: "", label: "Share" },
              compare: { icon: "", label: "Compare" }
            },
            mileage: product.details?.car?.mileage || "N/A",
            features: product.details?.car?.features || [],
            transmission: product.details?.car?.transmission || "Unknown",
            dimensions_capacity: product.details?.car?.dimensions_capacity || [],
            engine_transmission_details: product.details?.car?.engine_transmission_details || [],
            make: product.details?.car?.make || "Unknown",
            body_type: product.details?.car?.body_type || "Unknown"
          }
        },
        video: product.video || [],
        colors: product.colors || [],
        categories: product.categories || "",
        type: 'product'
      }));

      const formattedServices = services.map((service) => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        store: store,
        price: service.price || 0,
        images: service.images || [],
        description: service.description || "",
        duration: service.duration || "N/A",
        categories: service.categories || "",
        type: 'service'
      }));

      const formattedParts = parts.map((part) => ({
        id: part.id,
        name: part.name,
        slug: part.slug,
        store: store,
        quantity: part.quantity || 0,
        price: part.price || 0,
        images: part.images || [],
        description: part.description || "",
        compatibility: part.compatibility || [],
        categories: part.categories || "",
        type: 'part'
      }));

      return [...formattedProducts, ...formattedServices, ...formattedParts];
    });

    return NextResponse.json({
      data: allItems
    });
  } catch (error) {
    console.error('Error in category API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 