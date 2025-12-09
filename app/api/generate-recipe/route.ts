import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stored prompt for recipe generation (from env)
const RECIPE_PROMPT_ID = process.env.OPENAI_RECIPE_PROMPT_ID!;
const RECIPE_PROMPT_VERSION = process.env.OPENAI_RECIPE_PROMPT_VERSION!;

interface Ingredient {
  name: string;
  quantity: string;
  category?: string;
}

interface RecipeRequest {
  ingredients: Ingredient[];
  dietaryRestrictions: string[];
  customDietary?: string;
  cuisine: string;
  customCuisine?: string;
  skillLevel: string;
  cookingTime: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RecipeRequest = await request.json();
    const {
      ingredients,
      dietaryRestrictions,
      customDietary,
      cuisine,
      customCuisine,
      skillLevel,
      cookingTime,
    } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'No ingredients provided' },
        { status: 400 }
      );
    }

    // Build the dietary restrictions string
    const dietaryList = [...dietaryRestrictions];
    if (customDietary) dietaryList.push(customDietary);
    const dietaryString = dietaryList.filter(d => d !== 'none').join(', ') || 'None';

    // Determine cuisine
    const cuisineStyle = cuisine === 'custom' ? customCuisine : cuisine;

    // Format ingredients as JSON string (matching expected input format)
    const ingredientsJson = JSON.stringify(
      ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
      }))
    );

    // Use prompt variables for stored prompts
    // Note: json_object format requires the word "json" in the input
    const response = await (openai as any).responses.create({
      prompt: {
        id: RECIPE_PROMPT_ID,
        version: RECIPE_PROMPT_VERSION,
        variables: {
          ingredients: ingredientsJson,
          dietary_restrictions: dietaryString,
          cuisine_style: cuisineStyle || 'Any',
          skill_level: skillLevel,
          cooking_time: `${cookingTime} minutes`,
        },
      },
      input: [
        {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'Generate a recipe based on the provided variables. Return the result as JSON.',
            },
          ],
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
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe', details: String(error) },
      { status: 500 }
    );
  }
}
