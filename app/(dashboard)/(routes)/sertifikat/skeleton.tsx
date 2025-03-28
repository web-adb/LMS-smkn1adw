import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you're using a utility class merger

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean;
  children?: React.ReactNode;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, isLoaded = false, children, ...props }, ref) => {
    if (isLoaded) {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  children?: React.ReactNode;
}

const SkeletonGroup = ({
  className,
  count = 1,
  children,
  ...props
}: SkeletonGroupProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={className} {...props}>
          {children}
        </div>
      ))}
    </>
  );
};

const SkeletonText = ({
  className,
  lines = 1,
  ...props
}: SkeletonProps & { lines?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', className)}
          {...props}
        />
      ))}
    </div>
  );
};

const SkeletonCircle = ({ className, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      className={cn('rounded-full', className)}
      {...props}
    />
  );
};

const SkeletonCard = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white',
        className
      )}
      {...props}
    >
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-5 space-y-4">
        <SkeletonText lines={1} className="w-3/4" />
        <SkeletonText lines={2} className="w-full" />
        <SkeletonText lines={1} className="w-1/2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export {
  Skeleton,
  SkeletonGroup,
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
};