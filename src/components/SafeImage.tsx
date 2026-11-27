import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { isSafeMediaUrl } from '../utils/urlSafety';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  onClick,
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || !isSafeMediaUrl(src) || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 border border-slate-200 text-slate-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-7 h-7 text-slate-400 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-xs">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={loading}
      onError={() => setHasError(true)}
      onClick={onClick}
      className={className}
    />
  );
}
