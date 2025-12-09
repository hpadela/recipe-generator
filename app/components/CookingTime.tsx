'use client';

const TIME_OPTIONS = [
  { id: '15', label: '15', sublabel: 'min', icon: '⚡' },
  { id: '30', label: '30', sublabel: 'min', icon: '🕐' },
  { id: '45', label: '45', sublabel: 'min', icon: '🕐' },
  { id: '60', label: '60', sublabel: 'min', icon: '🕐' },
];

interface CookingTimeProps {
  selected: string;
  onSelectionChange: (selected: string) => void;
}

export default function CookingTime({ selected, onSelectionChange }: CookingTimeProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🕐</span>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          Cooking Time
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {TIME_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectionChange(option.id)}
            className={`pill flex flex-col items-center gap-0.5 py-3 ${
              selected === option.id ? 'selected' : ''
            }`}
          >
            <span className="text-sm">{option.icon}</span>
            <span className="font-bold text-lg">{option.label}</span>
            <span 
              className="text-xs"
              style={{ 
                color: selected === option.id ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)' 
              }}
            >
              {option.sublabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

