import React, { lazy, Suspense } from 'react';

// Lazy load SparkleButton component
const SparkleButtonLazy = lazy(() => import('./SparkleButton'));

// Fallback component while loading
const SparkleButtonFallback = (props) => {
  const { children, className, ...rest } = props;
  return (
    <button 
      className={className || ''} 
      {...rest}
    >
      {children}
    </button>
  );
};

// Exported SparkleButton with Suspense
export const SparkleButton = (props) => (
  <Suspense fallback={<SparkleButtonFallback {...props} />}>
    <SparkleButtonLazy {...props} />
  </Suspense>
);

// Export any other UI components here 