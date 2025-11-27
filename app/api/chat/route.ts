
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message, persona } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); // Fixed model name

    // Prepare the prompt
    const prompt = `You are a ${persona}. Answer the user's message helpfully.\nUser: ${message}`;

    // Generate content - FIXED: use generateContent instead of generateText
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}


