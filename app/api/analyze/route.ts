import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Build the content array with all images
    const imageContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = images.map(
      (imageData: string) => ({
        type: 'image_url' as const,
        image_url: {
          url: imageData,
          detail: 'high' as const,
        },
      })
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert culinary assistant that identifies ingredients from photos. 
Analyze the provided image(s) and identify all visible food ingredients.
Return a JSON object with the following structure:
{
  "ingredients": [
    {
      "name": "ingredient name",
      "quantity": "estimated quantity (e.g., '4 large', '~1 cup', 'bottle visible')",
      "category": "one of: protein, vegetable, dairy, spice, condiment, grain, fruit, other"
    }
  ],
  "notes": "any relevant observations about the ingredients"
}
Be thorough but only include items you can clearly identify as food ingredients.
Estimate quantities based on what's visible in the image.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please identify all the food ingredients visible in these image(s):',
            },
            ...imageContent,
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to analyze ingredients' },
      { status: 500 }
    );
  }
}

