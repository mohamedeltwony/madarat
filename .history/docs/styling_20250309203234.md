# Styling

This document covers the styling approach, organization, and best practices for the Next.js WordPress Starter project.

## Styling Architecture

The project uses a combination of:

1. **SCSS Modules**: Component-scoped styling
2. **Global SCSS**: Base styles and variables
3. **CSS Variables**: For theme values shared between JS and CSS

## Directory Structure

```
src/
└── styles/
    ├── globals.scss         # Global styles
    ├── wordpress.scss       # WordPress-specific styles
    ├── _variables.module.scss   # SCSS variables
    ├── variables.js         # JS exports of CSS variables
    ├── settings/
    │   ├── __settings.scss  # Imported settings
    │   ├── _colors.scss     # Color variables
    │   ├── _display.scss    # Display utilities
    │   └── _typography.scss # Typography settings
    └── pages/
        ├── Home.module.scss # Page-specific styles
        ├── Post.module.scss
        └── ...
```

## Component Styling

Each component has its own scoped SCSS module file:

```
ComponentName/
├── ComponentName.js
├── ComponentName.module.scss
└── index.js
```

Example usage:

```jsx
// ComponentName.js
import styles from './ComponentName.module.scss';

const ComponentName = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Title</h2>
    </div>
  );
};
```

```scss
// ComponentName.module.scss
@import 'styles/settings/__settings';

.container {
  padding: 1rem;
  background-color: $color-gray-100;
}

.title {
  font-size: 1.5rem;
  color: $color-primary;
}
```

## Global Variables

### SCSS Variables

SCSS variables are defined in `src/styles/_variables.module.scss`:

```scss
// Colors
$color-primary: #1a365d;
$color-primary-dark: color.adjust($color-primary, $lightness: -10%);
$color-gray-100: #f7fafc;
$color-gray-500: #718096;

// Progress bar
$progressbar-color: $color-primary;
```

### CSS Variables

CSS variables are defined for use in both CSS and JavaScript:

```scss
/* CSS Variables */
.variables {
  --progressbar-color: #{$progressbar-color};
}
```

### JavaScript Variables

For variables that need to be accessed in JavaScript, we use a separate JS file:

```javascript
// src/styles/variables.js
const variables = {
  progressbarColor: '#1a365d',
};

export default variables;
```

Usage in JavaScript:

```jsx
import variables from '../styles/variables';

// ...
<NextNProgress height={4} color={variables.progressbarColor} />;
```

## Responsive Design

The project uses a mobile-first approach with breakpoints defined in `src/styles/settings/_display.scss`:

```scss
// Breakpoints
$breakpoint-small: 576px;
$breakpoint-medium: 768px;
$breakpoint-large: 992px;
$breakpoint-extra-large: 1200px;

// Media query mixins
@mixin breakpoint-small-up {
  @media (min-width: $breakpoint-small) {
    @content;
  }
}

@mixin breakpoint-medium-up {
  @media (min-width: $breakpoint-medium) {
    @content;
  }
}

// ... etc
```

Usage:

```scss
.container {
  width: 100%;

  @include breakpoint-medium-up {
    width: 80%;
  }

  @include breakpoint-large-up {
    width: 70%;
  }
}
```

## SASS Deprecation Warnings

The project currently uses the `@import` syntax in SCSS files which is deprecated in Dart Sass 3.0.0. When you run the development server, you'll see warnings like:

```
Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0
```

These should eventually be updated to use the modern `@use` and `@forward` syntax:

Current (deprecated):

```scss
@import 'styles/settings/__settings';
```

Modern:

```scss
@use 'styles/settings/__settings' as settings;
```

## RTL Support

The project includes RTL (Right-to-Left) support for Arabic content, set in `src/pages/_app.js`:

```jsx
useEffect(() => {
  // Set RTL direction
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
}, []);
```

## Typography

Typography settings are defined in `src/styles/settings/_typography.scss`:

```scss
// Font families
$font-family-base: 'Cairo', sans-serif;
$font-family-heading: $font-family-base;

// Font weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 600;
$font-weight-extra-bold: 700;

// Font sizes
$font-size-base: 1rem;
$font-size-small: 0.875rem;
$font-size-large: 1.25rem;
```

## Best Practices

1. **Use CSS Modules**: Keep styles scoped to components
2. **Import SCSS Settings**: Import common settings at the top of each SCSS file
3. **Mobile-First**: Start with mobile styling and use breakpoints for larger screens
4. **Consistent Naming**: Use BEM-like naming for CSS classes
5. **Avoid !important**: Only use as a last resort
6. **Use Variables**: For colors, spacing, breakpoints, etc.
7. **Organize by Component**: Each component should have its own SCSS module file
8. **Consider Migration**: Update to modern `@use` syntax when possible
