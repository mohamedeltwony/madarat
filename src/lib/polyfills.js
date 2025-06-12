/**
 * Global polyfills for SSR compatibility
 * Must be imported before any other modules that might use browser APIs
 */

// Check if we're in a Node.js environment
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  // Set up global.self to point to global
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  
  // Set up window if not defined
  if (typeof global.window === 'undefined') {
    global.window = global;
  }
  
  // Set up document if not defined
  if (typeof global.document === 'undefined') {
    global.document = {
      documentElement: { dir: 'rtl', lang: 'ar' },
      createElement: () => ({}),
      getElementsByTagName: () => [],
      cookie: '',
      readyState: 'complete',
      addEventListener: () => {},
      removeEventListener: () => {},
      title: '',
    };
  }
  
  // Set up navigator if not defined
  if (typeof global.navigator === 'undefined') {
    global.navigator = {
      userAgent: 'node',
      platform: 'node',
      language: 'ar',
      languages: ['ar'],
      serviceWorker: undefined,
    };
  }
  
  // Set up location if not defined
  if (typeof global.location === 'undefined') {
    global.location = {
      href: '',
      origin: '',
      pathname: '',
      search: '',
      hash: '',
      hostname: '',
      port: '',
      protocol: 'https:',
    };
  }
}

export default function initializePolyfills() {
  // This function can be called to ensure polyfills are set up
  if (typeof window === 'undefined' && typeof global !== 'undefined') {
    global.self = global.self || global;
  }
} 