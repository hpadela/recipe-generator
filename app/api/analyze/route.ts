import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stored prompt for food image analysis (from env)
const ANALYZE_PROMPT_ID = process.env.OPENAI_ANALYZE_PROMPT_ID!;
const ANALYZE_PROMPT_VERSION = process.env.OPENAI_ANALYZE_PROMPT_VERSION!;

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Build image content for the message
    const imageContent: Array<{ type: string; image_url?: string; text?: string }> = images.map((imageData: string) => ({
      type: 'input_image' as const,
      image_url: imageData,
    }));

    // Add text instruction (required for json_object format - must contain word "json")
    imageContent.push({
      type: 'input_text',
      text: 'Analyze these images and identify all food ingredients. Return the results as JSON.',
    });

    const response = await (openai as any).responses.create({
      prompt: {
        id: ANALYZE_PROMPT_ID,
        version: ANALYZE_PROMPT_VERSION,
      },
      input: [
        {
          type: 'message',
          role: 'user',
          content: imageContent,
        },
      ],
      text: {
        format: {
          type: 'json_object',
        },
      },
      reasoning: {},
      max_output_tokens: 2048,
      store: true,
    });

    // Extract the response content
    const content = response.output_text || response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to analyze ingredients', details: String(error) },
      { status: 500 }
    );
  }
}
