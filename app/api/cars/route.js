// // app/api/cars/route.js

// export async function GET(request) {
//   const apiUrl = "https://server.yousef-style.shop/api/products";

//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     const response = await fetch(apiUrl, {
//       signal: controller.signal,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer 8e185963b4142a43003e224f0e93c359c71a9c07824f9ce25cdb703a41f91e8e354b280c4c6f420439c56a2c080cc8e60bfdddbb1c5146824519651f63bcf3af3ec0ea3a12f7f305f61c8d0e0291b5ab633be185c48ef7ebda624cf8245a3484872bf7a4e4b7790a5fafb50eb4b655a4ed49906da0383c3cfb3cb688cf47d671`,
//       },
//     });

//     clearTimeout(timeout);

//     if (!response.ok) {
//       return new Response(
//         JSON.stringify({ message: "Failed to fetch products" }),
//         { status: 500 }
//       );
//     }

//     const data = await response.json();
//     console.log("response", response.json());

//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) {
//     console.error("API Proxy Error:", error);
//     return new Response(
//       JSON.stringify({ message: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }
