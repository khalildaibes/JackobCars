import { getLocale } from "next-intl/server";

export async function POST(request) {
    try {
        const locale = await getLocale();
        console.log("Detected Locale:", locale);

        // Get the form data from the request body
        const formData = await request.formData();
        const video = formData.get('video');
        
        console.log('Received video:', video);
        
        if (!video) {
            return new Response(JSON.stringify({ message: "No video provided" }), { status: 400 });
        }

        // Create a new FormData for the Strapi API
        const strapiFormData = new FormData();
        strapiFormData.append('files', video);
        
        // Upload to Strapi
        const response = await fetch('http://64.227.112.249:1337/api/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer 7c2cfb5a04f948f358b043b829a3133b67c49e5d970abf534ed077049363c30f5c5a5487740e616561459f942b72e86ad0a0eebe6ede288159712261bcff28902457d174b3afb886e5682c1564a68969a4a6e2852ebb7e62d40f51341a24bb73ff7216ed1ce2684f8caeef770162f15d09fb57593651639f04d50bff03e359c8`,
            },
            body: strapiFormData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Strapi upload failed:", response.status, errorText);
            return new Response(JSON.stringify({ 
                message: "Failed to upload video", 
                error: response.statusText,
                status: response.status 
            }), { status: response.status });
        }

        const data = await response.json();
        console.log("Strapi upload response:", JSON.stringify(data, null, 2));
        return new Response(JSON.stringify(data), { status: 200 });
        
    } catch (error) {
        console.error("Video Upload Error:", error);
        return new Response(JSON.stringify({ 
            message: "Internal Server Error",
            error: error.message 
        }), { status: 500 });
    }
}