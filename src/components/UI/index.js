import React, { lazy, Suspense } from 'react';

// Direct imports
import HomepageStyleButton from './HomepageStyleButton';
import HeaderGoldButton from './HeaderGoldButton';
import BorderButton from './BorderButton/BorderButton';
import AnimatedBorderButton from './AnimatedBorderButton';
import GoldenButton from './GoldenButton';
import PureButton from './PureButton';
import IsolatedButton from './IsolatedButton';
import CSSFreeButton from './CSSFreeButton';
import SVGButton from './SVGButton';
import SVGDropdownButton from './SVGDropdownButton';
import CanvasButton from './CanvasButton';
import CanvasDropdownButton from './CanvasDropdownButton';
import IframeButton from './IframeButton';
import IframeDropdownButton from './IframeDropdownButton';
import FinalButton from './FinalButton';
import FinalDropdownButton from './FinalDropdownButton';
import ImprovedButton from './ImprovedButton';
import ImprovedDropdownButton from './ImprovedDropdownButton';
import UltimateButton from './UltimateButton';
import UltimateDropdownButton from './UltimateDropdownButton';
import IsolatedGoldButton from './IsolatedGoldButton';
import IsolatedGoldDropdownButton from './IsolatedGoldDropdownButton';
import GoldLinkButton from './GoldLinkButton';
import GoldLinkDropdownButton from './GoldLinkDropdownButton';
import EnhancedGoldButton from './EnhancedGoldButton';
import SimpleGoldButton from './SimpleGoldButton';
import PureDivGoldButton from './PureDivGoldButton';
import OptimizedGoldButton from './OptimizedGoldButton';
import PureBlackGoldButton from './PureBlackGoldButton';
import EnhancedGoldDropdownButton from './EnhancedGoldDropdownButton';

// Re-export all components
export {
  HomepageStyleButton,
  HeaderGoldButton,
  BorderButton,
  AnimatedBorderButton,
  GoldenButton,
  PureButton,
  IsolatedButton,
  CSSFreeButton,
  SVGButton,
  SVGDropdownButton,
  CanvasButton,
  CanvasDropdownButton,
  IframeButton,
  IframeDropdownButton,
  FinalButton,
  FinalDropdownButton,
  ImprovedButton,
  ImprovedDropdownButton,
  UltimateButton,
  UltimateDropdownButton,
  IsolatedGoldButton,
  IsolatedGoldDropdownButton,
  GoldLinkButton,
  GoldLinkDropdownButton,
  EnhancedGoldButton,
  SimpleGoldButton,
  PureDivGoldButton,
  OptimizedGoldButton,
  PureBlackGoldButton,
  EnhancedGoldDropdownButton,
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
