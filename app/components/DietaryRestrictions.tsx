'use client';

import { useState } from 'react';

const DIETARY_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'keto', label: 'Keto' },
];

interface DietaryRestrictionsProps {
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  customRestriction: string;
  onCustomChange: (value: string) => void;
}

export default function DietaryRestrictions({
  selected,
  onSelectionChange,
  customRestriction,
  onCustomChange,
}: DietaryRestrictionsProps) {
  const toggleOption = (id: string) => {
    if (id === 'none') {
      // If selecting "None", clear all others
      onSelectionChange(selected.includes('none') ? [] : ['none']);
    } else {
      // Remove "none" if selecting something else
      const withoutNone = selected.filter(s => s !== 'none');
      if (selected.includes(id)) {
        onSelectionChange(withoutNone.filter(s => s !== id));
      } else {
        onSelectionChange([...withoutNone, id]);
      }
    }
  };

  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        Dietary Restrictions
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {DIETARY_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`tag ${selected.includes(option.id) ? 'selected' : ''}`}
          >
            {selected.includes(option.id) && option.id !== 'none' && (
              <span className="mr-1">✓</span>
            )}
            {option.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Something else..."
        value={customRestriction}
        onChange={(e) => onCustomChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
}

