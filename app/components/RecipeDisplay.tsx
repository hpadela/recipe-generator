'use client';

import { useState } from 'react';

export interface RecipeData {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  difficulty: string;
  tags: string[];
  ingredients: Array<{
    item: string;
    amount: string;
    preparation?: string;
  }>;
  instructions: Array<{
    step: number;
    text: string;
    tip?: string;
  }>;
  nutritionEstimate: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  imageUrl?: string;
}

interface RecipeDisplayProps {
  recipe: RecipeData;
  onStartOver: () => void;
  onRegenerate: () => void;
}

export default function RecipeDisplay({ recipe, onStartOver, onRegenerate }: RecipeDisplayProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Recipe Header */}
      {recipe.imageUrl && (
        <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(61,35,20,0.8) 0%, transparent 50%)' }}
          />
          <h1 
            className="absolute bottom-4 left-4 right-4 text-white text-2xl font-bold"
            style={{ fontFamily: 'var(--font-fraunces), var(--font-serif)' }}
          >
            {recipe.title}
          </h1>
        </div>
      )}

      {!recipe.imageUrl && (
        <div 
          className="rounded-xl p-6 mb-6"
          style={{ background: 'linear-gradient(135deg, #E85D04 0%, #F9DC5C 100%)' }}
        >
          <h1 
            className="text-white text-2xl font-bold"
            style={{ fontFamily: 'var(--font-fraunces), var(--font-serif)' }}
          >
            {recipe.title}
          </h1>
        </div>
      )}

      {/* Quick Stats */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <span className="text-xl">🔪</span>
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>{recipe.prepTime}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Prep</p>
          </div>
          <div>
            <span className="text-xl">🔥</span>
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>{recipe.cookTime}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Cook</p>
          </div>
          <div>
            <span className="text-xl">🍽️</span>
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>{recipe.servings}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Serves</p>
          </div>
          <div>
            <span className="text-xl">📊</span>
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>{recipe.difficulty}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Level</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.tags.map((tag) => (
          <span 
            key={tag}
            className="tag text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p 
        className="mb-6 leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {recipe.description}
      </p>

      {/* Ingredients */}
      <div className="card p-5 mb-6">
        <h2 
          className="text-lg font-bold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Ingredients
        </h2>
        <div className="space-y-3">
          {recipe.ingredients.map((ingredient, index) => (
            <label
              key={index}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checkedIngredients.has(index)}
                onChange={() => toggleIngredient(index)}
                className="mt-1 w-5 h-5 rounded border-2 accent-orange-500"
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span className={checkedIngredients.has(index) ? 'line-through opacity-50' : ''}>
                <strong style={{ color: 'var(--color-text)' }}>{ingredient.amount}</strong>{' '}
                <span style={{ color: 'var(--color-text)' }}>{ingredient.item}</span>
                {ingredient.preparation && (
                  <span style={{ color: 'var(--color-primary)' }}>, {ingredient.preparation}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="card p-5 mb-6">
        <h2 
          className="text-lg font-bold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Instructions
        </h2>
        <div className="space-y-6">
          {recipe.instructions.map((instruction) => (
            <div key={instruction.step} className="flex gap-4">
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {instruction.step}
              </div>
              <div className="flex-1">
                <p style={{ color: 'var(--color-text)' }}>{instruction.text}</p>
                {instruction.tip && (
                  <div 
                    className="mt-2 p-3 rounded-lg text-sm flex items-start gap-2"
                    style={{ backgroundColor: 'var(--color-amber-mist)' }}
                  >
                    <span>💡</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{instruction.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition */}
      <div className="card p-5 mb-6">
        <h2 
          className="text-lg font-bold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Estimated Nutrition <span className="font-normal text-sm" style={{ color: 'var(--color-text-secondary)' }}>(per serving)</span>
        </h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {recipe.nutritionEstimate.calories.replace('~', '').replace(' per serving', '')}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Calories</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {recipe.nutritionEstimate.protein}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Protein</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {recipe.nutritionEstimate.carbs}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Carbs</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {recipe.nutritionEstimate.fat}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Fat</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 no-print">
        <button
          onClick={handlePrint}
          className="btn btn-secondary flex-1"
        >
          🖨️ Print
        </button>
        <button
          onClick={onRegenerate}
          className="btn btn-secondary flex-1"
        >
          🔄 Regenerate
        </button>
        <button
          onClick={onStartOver}
          className="btn btn-primary flex-1"
        >
          ↺ Start Over
        </button>
      </div>
    </div>
  );
}

