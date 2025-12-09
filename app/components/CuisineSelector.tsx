'use client';

const CUISINE_OPTIONS = [
  { id: 'italian', label: 'Italian', emoji: '🍝' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'asian', label: 'Asian', emoji: '🍜' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'american', label: 'American', emoji: '🍔' },
  { id: 'indian', label: 'Indian', emoji: '🍛' },
];

interface CuisineSelectorProps {
  selected: string;
  onSelectionChange: (selected: string) => void;
  customCuisine: string;
  onCustomChange: (value: string) => void;
}

export default function CuisineSelector({
  selected,
  onSelectionChange,
  customCuisine,
  onCustomChange,
}: CuisineSelectorProps) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        Cuisine Style
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {CUISINE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectionChange(option.id)}
            className={`pill flex flex-col items-center gap-1 py-3 ${
              selected === option.id ? 'selected' : ''
            }`}
          >
            <span className="text-xl">{option.emoji}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Something else..."
        value={customCuisine}
        onChange={(e) => {
          onCustomChange(e.target.value);
          if (e.target.value) {
            onSelectionChange('custom');
          }
        }}
        className="w-full"
      />
    </div>
  );
}

