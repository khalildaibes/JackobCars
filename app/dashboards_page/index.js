import React from 'react';
import { client as sanityClient } from '../lib/client';
import { strapiClient } from '../lib/strapiClient'; // Import Strapi client
import { Dashboard } from '../components';

const Dashboards = ({ orders }) => {
  return (
    <div>
      <Dashboard orders={orders} />
    </div>
  );
};

// Fetch data for Strapi or Sanity based on environment variable
export const getStaticProps = async () => {
  const isStrapiClient = process.env.STRAPI_CLIENT === 'true';
  let orders = [];

  if (isStrapiClient) {
    try {
      // Fetch orders from Strapi
      const response = await strapiClient.get('/orders', {
        params: { 'pagination[pageSize]': 100, 'populate': '*' },
      });
      orders = response.data.data.map((order) => ({
        id: order.id,
        ...order.attributes, // Adjust to the structure of your Strapi API response
      }));
    } catch (error) {
      console.error('Error fetching orders from Strapi:', error);
    }
  } else {
    try {
      // Fetch orders from Sanity
      const ordersQuery = '*[_type == "orders"]';
      orders = await sanityClient.fetch(ordersQuery);
    } catch (error) {
      console.error('Error fetching orders from Sanity:', error);
    }
  }

  return {
    props: { orders },
    revalidate: 10, // Optionally set revalidation time
  };
};

export default Dashboards;
