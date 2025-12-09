'use client';

interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface LoadingScreenProps {
  steps: LoadingStep[];
}

export default function LoadingScreen({ steps }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Animated loader */}
      <div className="relative w-24 h-24 mb-8">
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            background: 'linear-gradient(135deg, #E85D04 0%, #F9DC5C 100%)',
            opacity: 0.2 
          }}
        />
        <div 
          className="absolute inset-2 rounded-full animate-spin"
          style={{ 
            background: 'conic-gradient(from 0deg, transparent 0%, #E85D04 50%, transparent 100%)',
          }}
        />
        <div 
          className="absolute inset-4 rounded-full"
          style={{ backgroundColor: 'var(--color-background)' }}
        />
      </div>

      {/* Title */}
      <h2 
        className="text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: 'var(--font-fraunces), var(--font-serif)', color: 'var(--color-text)' }}
      >
        Creating your recipe...
      </h2>
      <p 
        className="mb-8 text-center"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        This usually takes about 10-15 seconds
      </p>

      {/* Progress steps */}
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="w-6 h-6 flex items-center justify-center">
              {step.status === 'completed' && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#5A9A6E" />
                  <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {step.status === 'in-progress' && (
                <div 
                  className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
                />
              )}
              {step.status === 'pending' && (
                <div 
                  className="w-5 h-5 rounded-full border-2"
                  style={{ borderColor: 'var(--color-accent)' }}
                />
              )}
            </div>

            {/* Step label */}
            <span
              className={`font-medium ${step.status === 'pending' ? 'opacity-50' : ''}`}
              style={{ 
                color: step.status === 'completed' 
                  ? 'var(--color-success)' 
                  : step.status === 'in-progress'
                  ? 'var(--color-text)'
                  : 'var(--color-text-secondary)'
              }}
            >
              {step.label}
              {step.status === 'in-progress' && '...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

