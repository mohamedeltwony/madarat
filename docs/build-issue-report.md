# Build Issue Report (April 24, 2025)

## Summary

During the performance optimization process, several Vercel builds failed due to linting/formatting errors reported by ESLint/Prettier, primarily concerning code modified in `src/pages/_app.js`.

## Primary Build Error: Prettier Formatting Conflict

*   **File:** `src/pages/_app.js`
*   **Context:** An error occurred after implementing conditional rendering for the `SearchProvider` component using a JavaScript `.some()` method with an arrow function.
*   **Error Message:** The build logs repeatedly showed conflicting Prettier formatting errors for the line containing the `.some()` condition (`router.pathname.startsWith(path)`).
    *   Initially, the error suggested adding line breaks within the arrow function callback.
    *   After applying the suggested fix, subsequent builds sometimes reported the opposite error, requesting the code be put back on a single line.
    *   Running the local `npm run format` command also reported the error but did not automatically fix it consistently.
*   **Cause:** This indicates a potential inconsistency or sensitivity in how Prettier rules were being interpreted or applied between the local development environment (or the `--fix` command) and the Vercel build environment for this specific complex conditional statement.
*   **Resolution:** After several attempts, the formatting that ultimately allowed the build to pass involved applying specific line breaks within the `.some()` callback, matching the structure requested by the linter in the final error logs (Commit `43c9742`).

```javascript
// Final working format in _app.js
          {[
            '/search',
            '/advanced-search',
            '/posts',
            '/blog',
            // Add other paths that need SearchProvider if necessary
          ].some( // Start .some()
            ( // Put parameter parenthesis on new line
              path // Put parameter on new line
            ) => // Put arrow on new line
              router.pathname.startsWith(path) // Condition on new line
          ) ? ( // Ternary ? on new line
            <SearchProvider>
              {/* ... */}
            </SearchProvider>
          ) : (
            <>
              {/* ... */}
            </>
          )}
```

## Secondary Build Warnings: Google Font Preconnect

*   **File:** `src/pages/_document.js`
*   **Warning Message:** `@next/next/google-font-preconnect` warnings persisted, suggesting `rel="preconnect"` was missing from the Google Font `<link rel="stylesheet">` tag.
*   **Analysis:** The code already included separate, correct `preconnect` links for `fonts.googleapis.com` and `fonts.gstatic.com`. Adding `rel="preconnect"` directly to the `stylesheet` link caused HTML validation errors (duplicate attributes).
*   **Resolution:** The warnings were deemed likely inaccurate or related to a minor linter preference. The standard implementation with separate preconnect links was maintained, and the warnings were ignored as they did not cause build failure.

## Conclusion

The primary build blocker was a persistent Prettier formatting conflict in `_app.js` which was resolved by carefully applying the specific multi-line format requested by the linter in the build logs. The font preconnect warnings were ignored as the implementation was correct.