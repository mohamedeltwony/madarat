import React, { lazy, Suspense } from 'react';

// Direct imports
import HomepageStyleButton from './HomepageStyleButton';
import HeaderGoldButton from './HeaderGoldButton';
import BorderButton from './BorderButton/BorderButton';
import AnimatedBorderButton from './AnimatedBorderButton';

// Re-export these components
export {
  HomepageStyleButton,
  HeaderGoldButton,
  BorderButton,
  AnimatedBorderButton,
};

// Lazy load SparkleButton component
const SparkleButtonLazy = lazy(() => import('./SparkleButton'));

// Fallback component while loading
const SparkleButtonFallback = (props) => {
  const { children, className, ...rest } = props;
  return (
    <button className={className || ''} {...rest}>
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
