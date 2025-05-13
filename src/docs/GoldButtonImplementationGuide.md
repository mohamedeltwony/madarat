# Gold Button Implementation Guide

This document provides guidance on how to implement gold-bordered buttons with transparent backgrounds in the travel website.

## Problem Background

We've experienced issues with gold buttons where:
- Semi-transparent backgrounds (rgba) allow underlying page colors to show through
- This results in unwanted olive/dark gold button backgrounds instead of pure black
- Various implementations using iframes and CSS isolation had mixed results

## Recommended Solution: EnhancedGoldButton

The `EnhancedGoldButton` component provides the best solution:

- Uses solid `#000000` background instead of semi-transparent backgrounds
- Simple, clean implementation with regular CSS (no iframes)
- Fully responsive and accessible
- Supports links, buttons, icons, and dropdown variations

## Implementation Guide

### Basic Button

```jsx
import { EnhancedGoldButton } from '../components/UI';

// Simple button with onClick handler
<EnhancedGoldButton 
  text="Click Me" 
  onClick={() => handleClick()}
/>

// Button with icon
<EnhancedGoldButton 
  text="Learn More" 
  icon={<FiChevronRight />}
  onClick={() => handleClick()}
/>
```

### Link Buttons

```jsx
// Internal link (uses Next.js Link)
<EnhancedGoldButton 
  text="Go to Home" 
  href="/"
/>

// External link (uses regular anchor)
<EnhancedGoldButton 
  text="Visit Website" 
  href="https://example.com"
  external
/>
```

### Dropdown Button

```jsx
import { EnhancedGoldDropdownButton } from '../components/UI';

// Define dropdown items
const dropdownItems = [
  { text: 'Profile', href: '/profile' },
  { text: 'Settings', href: '/settings' },
  { type: 'divider' }, // Optional divider
  { text: 'Logout', onClick: () => handleLogout() }
];

// Render dropdown button
<EnhancedGoldDropdownButton 
  text="Account" 
  items={dropdownItems}
  icon={<FiChevronDown />}
/>
```

## Component Properties

### EnhancedGoldButton

| Property  | Type     | Description                                    | Default  |
|-----------|----------|------------------------------------------------|----------|
| text      | string   | Button text                                    | Required |
| href      | string   | URL for link buttons                           | null     |
| onClick   | function | Click handler for button type                  | null     |
| className | string   | Additional CSS classes                         | ''       |
| icon      | element  | Icon element (typically React Icons component) | null     |
| external  | boolean  | Use regular anchor for external links          | false    |
| ariaLabel | string   | Accessibility label                            | Same as text |

### EnhancedGoldDropdownButton

| Property  | Type     | Description                                     | Default  |
|-----------|----------|-------------------------------------------------|----------|
| text      | string   | Button text                                     | Required |
| items     | array    | Array of dropdown items                         | []       |
| className | string   | Additional CSS classes                          | ''       |
| icon      | element  | Icon element (typically React Icons component)  | null     |
| ariaLabel | string   | Accessibility label                             | Same as text |

#### Dropdown Item Format
```js
// Link item (internal)
{ text: 'Profile', href: '/profile' }

// Link item (external)
{ text: 'Website', href: 'https://example.com', external: true }

// Button item
{ text: 'Logout', onClick: () => handleLogout() }

// Divider
{ type: 'divider' }
```

## Styling Guidelines

- Always place buttons against dark backgrounds for best results
- The buttons use solid black backgrounds with gold borders
- Avoid using rgba() backgrounds for gold buttons throughout the site

## Test Pages

The following test pages showcase the gold button implementations:

- `/enhanced-gold-buttons` - Demonstrates the new EnhancedGoldButton components
- `/button-comparison` - Compares different gold button implementations against various backgrounds

## Legacy Implementations

The following implementations are kept for reference but new development should use the EnhancedGoldButton components:

- SimpleGoldButton
- PureDivGoldButton
- OptimizedGoldButton
- PureBlackGoldButton 