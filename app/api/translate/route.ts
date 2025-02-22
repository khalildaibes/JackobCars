import { NextResponse } from "next/server";
import { TranslationServiceClient } from "@google-cloud/translate";

const translationClient = new TranslationServiceClient();

export async function POST(req: Request) {
  try {
    // Parse JSON body { text: string, target: string }
    const { text, target } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const projectId = process.env.GOOGLE_PROJECT_ID || "jackobcars";
    const location = "global";

    // Build the Google Cloud Translation request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: "text/plain",
      sourceLanguageCode: "en", // or omit if unknown
      targetLanguageCode: target || "es",
    };

    const [response] = await translationClient.translateText(request);
    const translations = response.translations?.map((t) => t.translatedText);

    return NextResponse.json({ translations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
