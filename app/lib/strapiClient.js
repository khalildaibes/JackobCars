import axios from 'axios';
var url= '64.227.112.249' 
var token = "JWT_TOKEN_HOLDER"
// Create a Strapi client instance
export const strapiClient = axios.create({
  baseURL: `http://${url}:1337/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer 7c2cfb5a04f948f358b043b829a3133b67c49e5d970abf534ed077049363c30f5c5a5487740e616561459f942b72e86ad0a0eebe6ede288159712261bcff28902457d174b3afb886e5682c1564a68969a4a6e2852ebb7e62d40f51341a24bb73ff7216ed1ce2684f8caeef770162f15d09fb57593651639f04d50bff03e359c8`,
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
