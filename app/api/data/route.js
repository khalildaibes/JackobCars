import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(req) {
    try {
        const filePath = join(process.cwd(), "app", "data", "manufacturers_new_structure.json");
        console.log("filePath:", filePath);
        const fileContent = readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        console.log("API Response Data loaded successfully");
        return new Response(JSON.stringify(data), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ 
            message: "Internal Server Error", 
            error: error.message 
        }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
