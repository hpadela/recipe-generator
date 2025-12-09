'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export default function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesChange([...images, ...files]);
    }
  }, [images, onImagesChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesChange([...images, ...files]);
    }
  }, [images, onImagesChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📷</span>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          Your Ingredients
        </h3>
      </div>

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          dashed-border p-8 text-center cursor-pointer transition-all
          ${isDragging ? 'bg-amber-50 border-orange-500' : 'bg-amber-50/50'}
          hover:bg-amber-50
        `}
        style={{ 
          backgroundColor: isDragging ? 'var(--color-amber-mist)' : 'rgba(254, 243, 226, 0.5)',
          borderColor: isDragging ? 'var(--color-primary)' : 'var(--color-accent)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ color: 'var(--color-accent)' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-medium" style={{ color: 'var(--color-text)' }}>
            Drop your photo here
          </p>
          <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
            or click to browse
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Ingredient ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

