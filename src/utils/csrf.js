import { nextCsrf } from 'next-csrf';

// Generate a random secret if not provided (for development only)
const getSecret = () => {
  if (process.env.CSRF_SECRET) {
    return process.env.CSRF_SECRET;
  }

  // In production, this will log a warning to set a proper secret
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'WARNING: No CSRF_SECRET environment variable set in production. Using a fallback secret is not recommended.'
    );
  }

  // Return a development-only fallback
  return 'DEVELOPMENT_ONLY_SECRET_DO_NOT_USE_IN_PRODUCTION_12345678';
};

// Configure next-csrf
export const { csrf, getCsrfToken } = nextCsrf({
  // Secret should be a secure, random string
  secret: getSecret(),
  
  // Use secure cookies in production
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  
  // Error handling
  onError: (err, req, res) => {
    // Log the error (but don't expose it to the client)
    console.error('CSRF Error:', err.code, err.message);
    
    // Return a clear error with 403 Forbidden status
    res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Form submission rejected due to security validation failure',
    });
  },
});

// Helper function to create form props with CSRF token
export const getFormProps = () => ({
  'data-csrf': 'true',
}); 