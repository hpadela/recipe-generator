'use client';

const SKILL_OPTIONS = [
  { id: 'beginner', label: 'Beginner', description: 'Simple & easy' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', description: 'Challenge me' },
];

interface SkillLevelProps {
  selected: string;
  onSelectionChange: (selected: string) => void;
}

export default function SkillLevel({ selected, onSelectionChange }: SkillLevelProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👨‍🍳</span>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          Skill Level
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SKILL_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectionChange(option.id)}
            className={`pill flex flex-col items-center gap-1 py-4 ${
              selected === option.id ? 'selected' : ''
            }`}
          >
            <span className="font-semibold">{option.label}</span>
            <span 
              className="text-xs"
              style={{ 
                color: selected === option.id ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)' 
              }}
            >
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

