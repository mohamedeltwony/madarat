/**
 * Simple CSRF Protection Utility
 * This is a lightweight alternative to next-csrf that works in both client and server environments
 */

// A constant token for development environment
// In production, this should be a server-side generated token from a secure source
const CSRF_TOKEN = 'DEVELOPMENT_TOKEN_1234567890';

/**
 * Function to get the CSRF token in client-side code
 * @returns {string} The CSRF token
 */
export function getCsrfToken() {
  return CSRF_TOKEN;
}

/**
 * Higher-order function to add CSRF protection to API route handlers
 * @param {Function} handler - The API route handler function
 * @returns {Function} - A wrapped handler with CSRF protection
 */
export function csrf(handler) {
  return async (req, res) => {
    // Only verify POST, PUT, PATCH, DELETE requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrfToken = req.headers['csrf-token'] || '';
      
      // Simple token verification
      // In production, this should use a more secure verification method
      if (csrfToken !== CSRF_TOKEN) {
        console.warn('CSRF validation failed', {
          providedToken: csrfToken ? csrfToken.substring(0, 8) + '...' : 'none',
          expectedToken: CSRF_TOKEN.substring(0, 8) + '...',
        });
        
        // Allow the request to proceed in development, but log a warning
        if (process.env.NODE_ENV === 'development') {
          console.warn('CSRF validation bypassed in development mode');
        } else {
          return res.status(403).json({
            error: 'Invalid CSRF token',
            message: 'Form submission rejected due to security validation failure'
          });
        }
      }
    }
    
    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Helper function to get form props for CSRF
 * @returns {Object} Props to be spread onto a form element
 */
export function getFormProps() {
  return {
    'data-csrf': 'true'
  };
} 