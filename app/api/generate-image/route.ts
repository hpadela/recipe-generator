import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Style modifiers for different image styles
const STYLE_MODIFIERS: Record<string, string> = {
  'food-photography': 'Professional food photography style, shallow depth of field, natural side lighting, appetizing presentation on a beautiful plate, warm color temperature, soft shadows',
  'illustrated': 'Warm illustrated style, hand-drawn aesthetic with soft watercolor textures, friendly and inviting, cookbook illustration style',
  'minimalist': 'Clean minimalist style, simple white background, single elegant plate, negative space, modern and sophisticated presentation',
  'rustic': 'Rustic farmhouse style, wooden table surface, natural textures, vintage props, warm earth tones, cozy homemade feel',
  'bright-bold': 'Bright and bold colors, vibrant saturated tones, energetic composition, modern food styling, Instagram-worthy presentation',
  'vintage': 'Vintage retro style, muted warm tones, nostalgic 1970s cookbook aesthetic, soft focus edges, classic presentation',
};

interface ImageRequest {
  prompt: string;
  title: string;
  style: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageRequest = await request.json();
    const { prompt, title, style } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['food-photography'];

    const fullPrompt = `${prompt}. ${styleModifier}. The dish is called "${title}". High quality, appetizing, delicious looking food.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image generated');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Check if it's a content policy error
    if (error instanceof OpenAI.APIError && error.code === 'content_policy_violation') {
      return NextResponse.json(
        { error: 'Image generation failed due to content policy. Try regenerating.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

