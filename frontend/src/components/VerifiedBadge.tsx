"use client";

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function VerifiedBadge({ size = 'md', showLabel = true }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className={`inline-flex items-center gap-1 bg-verified-green/10 text-verified-green rounded-full font-medium ${sizeClasses[size]}`}>
      <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {showLabel && <span>Tasdiqlangan</span>}
    </div>
  );
}

interface VerifiedBadgeRowProps {
  isVerified: boolean;
}

export function VerifiedBadgeRow({ isVerified }: VerifiedBadgeRowProps) {
  if (!isVerified) return null;
  
  return (
    <div className="flex items-center gap-2">
      <VerifiedBadge size="sm" showLabel={true} />
    </div>
  );
}
