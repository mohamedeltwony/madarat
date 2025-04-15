# Maintenance

This document provides guidance on maintaining the Next.js WordPress Starter project over time, including updates, troubleshooting, and best practices.

## Regular Maintenance Tasks

### 1. Dependency Updates

Regularly update the project dependencies to ensure security and compatibility:

```bash
# Check for outdated packages
npm outdated

# Update packages to their latest versions
npm update

# Update major versions (be cautious, test thoroughly)
npx npm-check-updates -u
npm install
```

### 2. WordPress Plugin Updates

Keep the WordPress plugins updated, especially:

- WPGraphQL
- Yoast SEO (if used)
- Any other plugins that affect the GraphQL schema

After updating WordPress plugins, test the GraphQL queries to ensure they still work as expected.

### 3. Security Audits

Regularly run security audits:

```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 4. Performance Monitoring

Monitor site performance using:

- Lighthouse in Chrome DevTools
- [Web Vitals](https://web.dev/vitals/)
- Vercel or Netlify Analytics
- [PageSpeed Insights](https://pagespeed.web.dev/)

## Upgrading Next.js

When upgrading to a new major version of Next.js, follow these steps:

1. Check the [Next.js Upgrade Guide](https://nextjs.org/docs/upgrading)
2. Create a backup or branch of your current codebase
3. Update Next.js and related packages:

```bash
npm install next@latest react@latest react-dom@latest eslint-config-next@latest
```

4. Run the project locally and test thoroughly
5. Address any deprecation warnings or breaking changes
6. Update any custom configurations in `next.config.js`

## React Version Updates

When upgrading React, consider:

1. Breaking changes in the React API
2. Compatibility with existing components
3. Testing thoroughly across all pages and features

## SCSS Modernization

The project uses deprecated SCSS `@import` syntax. When ready to modernize:

1. Replace `@import` with `@use` and `@forward`
2. Update references to imported variables and mixins

Example of modern SCSS syntax:

```scss
// Old
@import 'styles/settings/__settings';

// New
@use 'styles/settings/__settings' as settings;

.container {
  background-color: settings.$color-primary;
}
```

## GraphQL Schema Changes

When the WordPress GraphQL schema changes:

1. Update the GraphQL queries in the relevant files in `src/lib/`
2. Test data fetching functionality
3. Update data transformation functions if needed
4. Update TypeScript types if using TypeScript

## Code Quality Maintenance

### 1. Linting

Run linting regularly to maintain code quality:

```bash
npm run lint
```

### 2. Formatting

Keep code formatting consistent:

```bash
npm run format
```

### 3. Git Hooks

The project uses Husky for Git hooks. Ensure they're properly installed:

```bash
npm run prepare
```

## Troubleshooting Common Issues

### 1. GraphQL Errors

If you encounter GraphQL errors:

- Check the WordPress GraphQL endpoint URL
- Verify that WPGraphQL plugin is active
- Inspect the query in GraphiQL (available at your WordPress site's `/graphql` endpoint)
- Check for schema changes after WordPress or plugin updates

### 2. Build Errors

For Next.js build errors:

- Check for syntax errors in components
- Verify that all dynamic paths have fallback options
- Check for missing dependencies
- Look for outdated API usage

### 3. CSS/SCSS Issues

For styling issues:

- Check for global CSS conflicts
- Inspect the generated CSS in DevTools
- Verify SCSS variable scopes
- Test responsiveness across devices

## Best Practices for Long-term Maintenance

### 1. Documentation

Keep documentation up to date:

- Update READMEs when making significant changes
- Document the purpose of custom hooks and utilities
- Comment complex logic
- Document environment variables

### 2. Testing

Implement testing where possible:

- Component testing with React Testing Library
- End-to-end testing with Playwright
- Manual testing of key user flows

### 3. Performance Optimization

Regularly review and optimize performance:

- Use Lighthouse to identify issues
- Optimize image usage
- Minimize JS bundle size
- Implement code splitting

### 4. Disaster Recovery

Prepare for recovery scenarios:

- Maintain regular backups of code and content
- Document deployment and rollback procedures
- Keep track of critical environment variables
- Create a disaster recovery plan

### 5. WordPress Content Management

Best practices for content management:

- Define clear content guidelines for WordPress editors
- Document how content changes impact the frontend
- Set up a staging environment for testing content changes
- Create templates for recurring content types

## Scaling the Project

As the project grows, consider:

1. Implementing a monorepo structure for larger applications
2. Adding TypeScript for better type safety
3. Enhancing the CI/CD pipeline with automated testing
4. Setting up monitoring and error tracking (like Sentry)
5. Implementing internationalization for multiple languages
