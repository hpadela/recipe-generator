'use client';

import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import DietaryRestrictions from './components/DietaryRestrictions';
import CuisineSelector from './components/CuisineSelector';
import SkillLevel from './components/SkillLevel';
import CookingTime from './components/CookingTime';
import RecipeImageOption from './components/RecipeImageOption';
import IngredientsEditor, { Ingredient } from './components/IngredientsEditor';
import LoadingScreen from './components/LoadingScreen';
import RecipeDisplay, { RecipeData } from './components/RecipeDisplay';

type AppStep = 'form' | 'ingredients' | 'loading' | 'recipe';

// Placeholder recipe data for demonstration
const PLACEHOLDER_RECIPE: RecipeData = {
  title: "Tuscan Baked Eggs with Tomatoes and Parmesan",
  description: "A rustic Italian breakfast or light dinner featuring eggs baked in a bed of blistered cherry tomatoes, topped with shaved parmesan and fresh basil. Simple, elegant, and ready in under 30 minutes.",
  prepTime: "10 min",
  cookTime: "18 min",
  totalTime: "28 minutes",
  servings: "2",
  difficulty: "Medium",
  tags: ["Vegetarian", "One-Pan", "Italian", "Brunch"],
  ingredients: [
    { item: "Cherry tomatoes", amount: "1 cup", preparation: "halved" },
    { item: "Eggs", amount: "4 large" },
    { item: "Parmesan cheese", amount: "50g", preparation: "shaved" },
    { item: "Fresh basil", amount: "8-10 leaves", preparation: "torn" },
    { item: "Olive oil", amount: "2 tbsp" },
    { item: "Salt and pepper", amount: "to taste" },
  ],
  instructions: [
    { 
      step: 1, 
      text: "Preheat your oven to 400°F (200°C). Place an oven-safe skillet or baking dish in the oven while it preheats.",
      tip: "A cast iron skillet works beautifully here and helps create crispy edges on the tomatoes."
    },
    { 
      step: 2, 
      text: "Carefully remove the hot skillet. Add olive oil and swirl to coat. Add the halved cherry tomatoes in a single layer, cut-side down."
    },
    { 
      step: 3, 
      text: "Return to oven and roast for 8-10 minutes until tomatoes are softened and starting to blister."
    },
    { 
      step: 4, 
      text: "Remove skillet and create 4 small wells in the tomatoes. Crack one egg into each well. Season with salt and pepper.",
      tip: "Crack eggs into a small bowl first to avoid shells."
    },
    { 
      step: 5, 
      text: "Scatter half the parmesan over the top. Bake for 6-8 minutes until whites are set but yolks remain runny.",
      tip: "For firmer yolks, add 2-3 minutes."
    },
    { 
      step: 6, 
      text: "Top with remaining parmesan and torn fresh basil. Drizzle with extra olive oil and serve immediately."
    },
  ],
  nutritionEstimate: {
    calories: "320",
    protein: "18g",
    carbs: "6g",
    fat: "25g",
  },
};

// Placeholder ingredients for demonstration
const PLACEHOLDER_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Eggs', quantity: '4 large', category: 'protein' },
  { id: '2', name: 'Cherry Tomatoes', quantity: '~1 cup', category: 'vegetable' },
  { id: '3', name: 'Parmesan Cheese', quantity: '~100g block', category: 'dairy' },
  { id: '4', name: 'Fresh Basil', quantity: '1 bunch', category: 'spice' },
  { id: '5', name: 'Olive Oil', quantity: 'bottle visible', category: 'condiment' },
];

export default function Home() {
  // Current step in the flow
  const [currentStep, setCurrentStep] = useState<AppStep>('form');

  // Form state
  const [images, setImages] = useState<File[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [customDietary, setCustomDietary] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [customCuisine, setCustomCuisine] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [cookingTime, setCookingTime] = useState('30');
  const [wantsImage, setWantsImage] = useState(true);
  const [imageStyle, setImageStyle] = useState('food-photography');

  // Ingredients (after analysis)
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Loading state
  const [loadingSteps, setLoadingSteps] = useState([
    { id: 'analyze', label: 'Ingredients analyzed', status: 'pending' as const },
    { id: 'recipe', label: 'Generating recipe', status: 'pending' as const },
    { id: 'image', label: 'Creating image', status: 'pending' as const },
  ]);

  // Recipe result
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  // Check if form is valid for submission
  const isFormValid = images.length > 0 && (cuisine || customCuisine);

  // Handle analyze button click
  const handleAnalyze = () => {
    // TODO: Call AI to analyze images
    // For now, use placeholder ingredients
    setIngredients(PLACEHOLDER_INGREDIENTS);
    setCurrentStep('ingredients');
  };

  // Handle generate recipe
  const handleGenerateRecipe = () => {
    setCurrentStep('loading');
    
    // Simulate loading progress
    // TODO: Replace with actual API calls
    setLoadingSteps([
      { id: 'analyze', label: 'Ingredients analyzed', status: 'completed' },
      { id: 'recipe', label: 'Generating recipe', status: 'in-progress' },
      { id: 'image', label: 'Creating image', status: 'pending' },
    ]);

    // Simulate recipe generation delay
    setTimeout(() => {
      setLoadingSteps([
        { id: 'analyze', label: 'Ingredients analyzed', status: 'completed' },
        { id: 'recipe', label: 'Generating recipe', status: 'completed' },
        { id: 'image', label: 'Creating image', status: wantsImage ? 'in-progress' : 'completed' },
      ]);

      if (wantsImage) {
        setTimeout(() => {
          setLoadingSteps([
            { id: 'analyze', label: 'Ingredients analyzed', status: 'completed' },
            { id: 'recipe', label: 'Generating recipe', status: 'completed' },
            { id: 'image', label: 'Creating image', status: 'completed' },
          ]);
          setRecipe(PLACEHOLDER_RECIPE);
          setCurrentStep('recipe');
        }, 1500);
      } else {
        setRecipe(PLACEHOLDER_RECIPE);
        setCurrentStep('recipe');
      }
    }, 2000);
  };

  // Handle regenerate (keeps ingredients, regenerates recipe)
  const handleRegenerate = () => {
    handleGenerateRecipe();
  };

  // Handle start over (reset everything)
  const handleStartOver = () => {
    setCurrentStep('form');
    setImages([]);
    setDietaryRestrictions([]);
    setCustomDietary('');
    setCuisine('');
    setCustomCuisine('');
    setSkillLevel('intermediate');
    setCookingTime('30');
    setWantsImage(true);
    setImageStyle('food-photography');
    setIngredients([]);
    setRecipe(null);
    setLoadingSteps([
      { id: 'analyze', label: 'Ingredients analyzed', status: 'pending' },
      { id: 'recipe', label: 'Generating recipe', status: 'pending' },
      { id: 'image', label: 'Creating image', status: 'pending' },
    ]);
  };

  // Handle back to form (from ingredients)
  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              fontFamily: 'var(--font-fraunces), var(--font-serif)', 
              color: 'var(--color-text)' 
            }}
          >
            🐭 MouseChef AI
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Transform what you have into something delicious
          </p>
        </header>

        {/* Form Step */}
        {currentStep === 'form' && (
          <div className="space-y-6 animate-fade-in-up">
            <ImageUpload 
              images={images} 
              onImagesChange={setImages} 
            />

            <DietaryRestrictions
              selected={dietaryRestrictions}
              onSelectionChange={setDietaryRestrictions}
              customRestriction={customDietary}
              onCustomChange={setCustomDietary}
            />

            <CuisineSelector
              selected={cuisine}
              onSelectionChange={setCuisine}
              customCuisine={customCuisine}
              onCustomChange={setCustomCuisine}
            />

            <SkillLevel
              selected={skillLevel}
              onSelectionChange={setSkillLevel}
            />

            <CookingTime
              selected={cookingTime}
              onSelectionChange={setCookingTime}
            />

            <RecipeImageOption
              wantsImage={wantsImage}
              onWantsImageChange={setWantsImage}
              selectedStyle={imageStyle}
              onStyleChange={setImageStyle}
            />

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className={`btn w-full py-4 text-lg ${
                isFormValid ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
              }`}
            >
              Analyze Ingredients →
            </button>
          </div>
        )}

        {/* Ingredients Review Step */}
        {currentStep === 'ingredients' && (
          <div className="space-y-6 animate-fade-in-up">
            <IngredientsEditor
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />

            <div className="flex gap-4">
              <button
                onClick={handleBackToForm}
                className="btn btn-secondary flex-1"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerateRecipe}
                disabled={ingredients.length === 0}
                className={`btn flex-1 py-4 ${
                  ingredients.length > 0 ? 'btn-primary' : 'btn-secondary opacity-50'
                }`}
              >
                Generate Recipe →
              </button>
            </div>
          </div>
        )}

        {/* Loading Step */}
        {currentStep === 'loading' && (
          <LoadingScreen steps={loadingSteps} />
        )}

        {/* Recipe Display Step */}
        {currentStep === 'recipe' && recipe && (
          <div className="animate-fade-in-up">
            <RecipeDisplay
              recipe={recipe}
              onStartOver={handleStartOver}
              onRegenerate={handleRegenerate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
