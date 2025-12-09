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

type AppStep = 'form' | 'analyzing' | 'ingredients' | 'loading' | 'recipe';

type LoadingStepStatus = 'pending' | 'in-progress' | 'completed';

interface LoadingStep {
  id: string;
  label: string;
  status: LoadingStepStatus;
}

// Helper to compress and convert File to base64 data URL
// Resizes large images and compresses to JPEG for smaller payload
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = () => {
      img.onload = () => {
        // Max dimension for uploaded images (keeps quality while reducing size)
        const MAX_DIM = 1200;
        let { width, height } = img;
        
        // Only resize if image is larger than max dimension
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 0.8 quality for good balance of size/quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { id: 'analyze', label: 'Ingredients analyzed', status: 'pending' },
    { id: 'recipe', label: 'Generating recipe', status: 'pending' },
    { id: 'image', label: 'Creating image', status: 'pending' },
  ]);

  // Recipe result
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Check if form is valid for submission
  const isFormValid = images.length > 0 && (cuisine || customCuisine);

  // Handle analyze button click - calls the real API
  const handleAnalyze = async () => {
    setError(null);
    setCurrentStep('analyzing');

    try {
      // Convert all images to base64
      const base64Images = await Promise.all(images.map(fileToBase64));

      // Call the analyze API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: base64Images }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze ingredients';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response might not be JSON (e.g., "Request Entity Too Large")
          const text = await response.text().catch(() => '');
          if (text.includes('Entity Too Large') || response.status === 413) {
            errorMessage = 'Images are too large. Please use smaller or fewer images.';
          } else if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Convert API response to our Ingredient format
      const analyzedIngredients: Ingredient[] = data.ingredients.map(
        (ing: { name: string; quantity: string; category?: string }, index: number) => ({
          id: String(index + 1),
          name: ing.name,
          quantity: ing.quantity,
          category: ing.category || 'other',
        })
      );

      setIngredients(analyzedIngredients);
      setCurrentStep('ingredients');
    } catch (err) {
      console.error('Error analyzing:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze ingredients');
      setCurrentStep('form');
    }
  };

  // Handle generate recipe - calls the real APIs
  const handleGenerateRecipe = async () => {
    setError(null);
    setCurrentStep('loading');

    // Reset loading steps
    setLoadingSteps([
      { id: 'analyze', label: 'Ingredients analyzed', status: 'completed' },
      { id: 'recipe', label: 'Generating recipe', status: 'in-progress' },
      { id: 'image', label: 'Creating image', status: wantsImage ? 'pending' : 'completed' },
    ]);

    try {
      // Step 1: Generate recipe
      const recipeResponse = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          dietaryRestrictions,
          customDietary,
          cuisine,
          customCuisine,
          skillLevel,
          cookingTime,
        }),
      });

      if (!recipeResponse.ok) {
        const errorData = await recipeResponse.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const recipeData = await recipeResponse.json();

      // Update loading state
      setLoadingSteps([
        { id: 'analyze', label: 'Ingredients analyzed', status: 'completed' },
        { id: 'recipe', label: 'Generating recipe', status: 'completed' },
        { id: 'image', label: 'Creating image', status: wantsImage ? 'in-progress' : 'completed' },
      ]);

      // Step 2: Generate image (if requested)
      let imageUrl: string | undefined;
      if (wantsImage && recipeData.featuredImagePrompt) {
        try {
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: recipeData.featuredImagePrompt,
              title: recipeData.title,
              style: imageStyle,
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageUrl = imageData.imageUrl;
          }
        } catch (imgErr) {
          console.error('Image generation failed:', imgErr);
          // Continue without image - not a fatal error
        }
      }

      // Update loading state to complete
      setLoadingSteps([
        { id: 'analyze', label: 'Ingredients analyzed', status: 'completed' },
        { id: 'recipe', label: 'Generating recipe', status: 'completed' },
        { id: 'image', label: 'Creating image', status: 'completed' },
      ]);

      // Format the recipe for display
      const formattedRecipe: RecipeData = {
        title: recipeData.title,
        description: recipeData.description,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        totalTime: recipeData.totalTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        tags: recipeData.tags || [],
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
        nutritionEstimate: recipeData.nutritionEstimate || {
          calories: 'N/A',
          protein: 'N/A',
          carbs: 'N/A',
          fat: 'N/A',
        },
        imageUrl,
      };

      setRecipe(formattedRecipe);
      setCurrentStep('recipe');
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recipe');
      setCurrentStep('ingredients');
    }
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
    setError(null);
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
            className="text-3xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{ 
              fontFamily: 'var(--font-fraunces), var(--font-serif)', 
              color: 'var(--color-text)' 
            }}
          >
            {/* Mouse Chef Icon */}
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Chef Hat */}
              <ellipse cx="32" cy="16" rx="14" ry="8" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1.5"/>
              <rect x="20" y="14" width="24" height="12" fill="#FAFAFA"/>
              <rect x="18" y="24" width="28" height="6" rx="1" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1.5"/>
              <circle cx="26" cy="12" r="3" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1"/>
              <circle cx="32" cy="10" r="3.5" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1"/>
              <circle cx="38" cy="12" r="3" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1"/>
              
              {/* Mouse Ears */}
              <circle cx="18" cy="36" r="8" fill="#D4A574" stroke="#B8956E" strokeWidth="1.5"/>
              <circle cx="18" cy="36" r="4" fill="#F5C9B8"/>
              <circle cx="46" cy="36" r="8" fill="#D4A574" stroke="#B8956E" strokeWidth="1.5"/>
              <circle cx="46" cy="36" r="4" fill="#F5C9B8"/>
              
              {/* Mouse Face */}
              <ellipse cx="32" cy="46" rx="16" ry="14" fill="#D4A574" stroke="#B8956E" strokeWidth="1.5"/>
              
              {/* Inner Face */}
              <ellipse cx="32" cy="48" rx="12" ry="10" fill="#E8C4A8"/>
              
              {/* Eyes */}
              <ellipse cx="26" cy="44" rx="3" ry="3.5" fill="#2D2D2D"/>
              <circle cx="25" cy="43" r="1" fill="#FFFFFF"/>
              <ellipse cx="38" cy="44" rx="3" ry="3.5" fill="#2D2D2D"/>
              <circle cx="37" cy="43" r="1" fill="#FFFFFF"/>
              
              {/* Nose */}
              <ellipse cx="32" cy="52" rx="4" ry="3" fill="#F5A9B8"/>
              <ellipse cx="32" cy="51.5" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.5"/>
              
              {/* Whiskers */}
              <line x1="18" y1="50" x2="26" y2="52" stroke="#B8956E" strokeWidth="1" strokeLinecap="round"/>
              <line x1="18" y1="54" x2="26" y2="54" stroke="#B8956E" strokeWidth="1" strokeLinecap="round"/>
              <line x1="38" y1="52" x2="46" y2="50" stroke="#B8956E" strokeWidth="1" strokeLinecap="round"/>
              <line x1="38" y1="54" x2="46" y2="54" stroke="#B8956E" strokeWidth="1" strokeLinecap="round"/>
              
              {/* Smile */}
              <path d="M28 56 Q32 59 36 56" stroke="#B8956E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            MouseChef AI
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Transform what you have into something delicious
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'rgba(214, 69, 69, 0.1)', 
              borderColor: 'var(--color-error)',
              color: 'var(--color-error)'
            }}
          >
            <p className="font-medium">⚠️ {error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

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

        {/* Analyzing Step (loading state for image analysis) */}
        {currentStep === 'analyzing' && (
          <LoadingScreen 
            steps={[
              { id: 'analyze', label: 'Analyzing ingredients', status: 'in-progress' },
              { id: 'recipe', label: 'Generating recipe', status: 'pending' },
              { id: 'image', label: 'Creating image', status: 'pending' },
            ]} 
          />
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
