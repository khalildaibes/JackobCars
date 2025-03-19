import axios from 'axios';
var url= '68.183.215.202' 
var token = "JWT_TOKEN_HOLDER"
// Create a Strapi client instance
export const strapiClient = axios.create({
  baseURL: `http://${url}:1337/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer c815d4a1cdca66d179b6485f3d584486d7ca6bc8024553c07f4df19830c6d3bcbad322af9ce87e7d53ef49624634938ecd44b3d8b63f9222fbf0d1bc2163daf6b59c7df4fa0f71ca103487f80d63b3df9612e33a0f2ebcbe3472d262df2c4021c904186c6a5ad0144052f754d2e0494b83c3210c469ae4fc5673d5fccffc578a`,
  },
});


// Utility function to get the image URL from Strapi or Sanity
export const getImageUrl = (image) => {
  if (image.url) {
    // For Strapi images
    return process.env.NEXT_PUBLIC_STRAPI_API_URL + image.url;
  } else if (image.asset) {
    // For Sanity images
    return image;
  }
  return ''; // Return an empty string if no valid image is found
};

export const addStrapiData = async (data) => {
  try {
    console.error("data:", data);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding order via API Proxy:", error);
    throw error;
  }
};

// Helper function to fetch data using the Strapi client
export const fetchStrapiData = async (endpoint, params = {}) => {
  try {
    const response = await strapiClient.get(endpoint, {
      params,
    });

    return response.data; // Return the data from the response
  } catch (error) {
    console.error(`Error fetching data from Strapi: ${error}`);
    throw error;
  }
};
