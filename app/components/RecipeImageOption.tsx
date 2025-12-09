'use client';

const IMAGE_STYLES = [
  { id: 'food-photography', label: 'Food Photography' },
  { id: 'illustrated', label: 'Illustrated' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'rustic', label: 'Rustic' },
  { id: 'bright-bold', label: 'Bright & Bold' },
  { id: 'vintage', label: 'Vintage' },
];

interface RecipeImageOptionProps {
  wantsImage: boolean;
  onWantsImageChange: (wants: boolean) => void;
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export default function RecipeImageOption({
  wantsImage,
  onWantsImageChange,
  selectedStyle,
  onStyleChange,
}: RecipeImageOptionProps) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        Generate Recipe Card Image?
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => onWantsImageChange(true)}
          className={`pill py-3 font-semibold ${wantsImage ? 'selected' : ''}`}
        >
          Yes, please!
        </button>
        <button
          onClick={() => onWantsImageChange(false)}
          className={`pill py-3 font-semibold ${!wantsImage ? 'selected' : ''}`}
        >
          No thanks
        </button>
      </div>

      {wantsImage && (
        <div className="animate-fade-in-up">
          <p 
            className="text-sm mb-3 font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Choose a style:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {IMAGE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className={`pill text-sm py-2 ${selectedStyle === style.id ? 'selected' : ''}`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

