'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton variant="circular" width={8} height={8} className="mt-2" />
      <div className="flex-1 space-y-2">
        <Skeleton width="70%" height={14} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
      <div className="space-y-2">
        <Skeleton width={80} height={14} />
        <Skeleton width={60} height={28} />
      </div>
      <Skeleton variant="circular" width={40} height={40} />
    </div>
  );
}