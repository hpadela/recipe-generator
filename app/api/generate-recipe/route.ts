import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Build ingredients list
    const ingredientsList = ingredients
      .map(ing => `${ing.name} (${ing.quantity})`)
      .join(', ');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert chef creating personalized recipes. Generate a complete recipe based on the provided ingredients and preferences.

Return a JSON object with this exact structure:
{
  "title": "Recipe title",
  "description": "A brief, appetizing 2-3 sentence description",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "totalTime": "X minutes",
  "servings": "X servings",
  "difficulty": "Easy/Medium/Hard",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity",
      "preparation": "optional prep instructions (e.g., 'diced', 'minced')"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "text": "Instruction text",
      "tip": "Optional helpful tip for this step"
    }
  ],
  "featuredImagePrompt": "A detailed prompt for generating an appetizing photo of this dish",
  "nutritionEstimate": {
    "calories": "~XXX per serving",
    "protein": "Xg",
    "carbs": "Xg",
    "fat": "Xg"
  }
}

Guidelines:
- Use primarily the ingredients provided, but you may add common pantry staples (salt, pepper, oil, etc.)
- Respect all dietary restrictions strictly
- Match the cuisine style requested
- Adjust complexity based on skill level (${skillLevel})
- Keep total time within ${cookingTime} minutes
- Include 3-6 helpful tips throughout the instructions
- Make the featuredImagePrompt vivid and specific for food photography`,
        },
        {
          role: 'user',
          content: `Create a recipe with these parameters:

AVAILABLE INGREDIENTS:
${ingredientsList}

DIETARY RESTRICTIONS: ${dietaryString}

CUISINE STYLE: ${cuisineStyle || 'Any'}

SKILL LEVEL: ${skillLevel}

MAXIMUM COOKING TIME: ${cookingTime} minutes

Please create a delicious recipe that makes the best use of these ingredients.`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}

