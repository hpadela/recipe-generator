'use client';

import { useState } from 'react';

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: string;
}

// Color mapping for ingredient categories
const CATEGORY_COLORS: Record<string, string> = {
  protein: '#E85D04',
  vegetable: '#5A9A6E',
  dairy: '#5B8FB9',
  spice: '#9B59B6',
  condiment: '#F9DC5C',
  grain: '#C65D3B',
  fruit: '#E74C3C',
  other: '#8B7355',
};

interface IngredientsEditorProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientsEditor({
  ingredients,
  onIngredientsChange,
}: IngredientsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setEditName(ingredient.name);
    setEditQuantity(ingredient.quantity);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    
    onIngredientsChange(
      ingredients.map(ing =>
        ing.id === editingId
          ? { ...ing, name: editName.trim(), quantity: editQuantity.trim() }
          : ing
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter(ing => ing.id !== id));
  };

  const addIngredient = () => {
    if (!newName.trim()) return;
    
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: newName.trim(),
      quantity: newQuantity.trim() || 'as needed',
      category: 'other',
    };
    
    onIngredientsChange([...ingredients, newIngredient]);
    setNewName('');
    setNewQuantity('');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-fraunces), var(--font-serif)', color: 'var(--color-text)' }}
        >
          ✓ Ingredients Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Review and edit before generating your recipe
        </p>
      </div>

      <div className="card p-5">
        <div className="space-y-3">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-amber-mist)' }}
            >
              {/* Category dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[ingredient.category] || CATEGORY_COLORS.other }}
              />

              {editingId === ingredient.id ? (
                /* Edit mode */
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 text-sm py-1 px-2"
                    placeholder="Ingredient name"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-24 text-sm py-1 px-2"
                    placeholder="Quantity"
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-700 px-2"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-red-500 hover:text-red-600 px-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* Display mode */
                <>
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => startEdit(ingredient)}
                  >
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {ingredient.name}
                    </span>
                    <span className="ml-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {ingredient.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add ingredient */}
        {isAdding ? (
          <div 
            className="mt-3 flex gap-2 p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-amber-mist)' }}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 text-sm py-1 px-2"
              placeholder="Ingredient name"
              autoFocus
            />
            <input
              type="text"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="w-24 text-sm py-1 px-2"
              placeholder="Quantity"
            />
            <button
              onClick={addIngredient}
              className="text-green-600 hover:text-green-700 px-2"
            >
              ✓
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="text-red-500 hover:text-red-600 px-2"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 w-full py-3 dashed-border text-center font-medium transition-colors hover:bg-amber-50"
            style={{ color: 'var(--color-primary)' }}
          >
            + Add Ingredient
          </button>
        )}
      </div>
    </div>
  );
}

