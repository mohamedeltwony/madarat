// Performance monitoring utilities for Core Web Vitals and other metrics
// Client-side only implementation

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

// Performance observer for Core Web Vitals
export function initPerformanceMonitoring() {
  // Ensure this only runs on the client
  if (typeof window === 'undefined' || typeof document === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Largest Contentful Paint (LCP)
  observeLCP();
  
  // First Input Delay (FID)
  observeFID();
  
  // Cumulative Layout Shift (CLS)
  observeCLS();
  
  // First Contentful Paint (FCP)
  observeFCP();
  
  // Time to First Byte (TTFB)
  observeTTFB();
  
  // Long Tasks
  observeLongTasks();
  
  // Resource Loading Performance
  observeResourceTiming();
}

// Observe Largest Contentful Paint
function observeLCP() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        const value = lastEntry.startTime;
        const rating = getRating(value, THRESHOLDS.LCP);
        
        reportMetric({
          name: 'LCP',
          value,
          rating,
          entries: [lastEntry],
        });
      }
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observation not supported');
  }
}

// Observe First Input Delay
function observeFID() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const value = entry.processingStart - entry.startTime;
        const rating = getRating(value, THRESHOLDS.FID);
        
        reportMetric({
          name: 'FID',
          value,
          rating,
          entries: [entry],
        });
      });
    });
    
    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID observation not supported');
  }
}

// Observe Cumulative Layout Shift
function observeCLS() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  try {
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      
      const rating = getRating(clsValue, THRESHOLDS.CLS);
      
      reportMetric({
        name: 'CLS',
        value: clsValue,
        rating,
        entries: clsEntries,
      });
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Report final CLS value when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const rating = getRating(clsValue, THRESHOLDS.CLS);
        
        reportMetric({
          name: 'CLS',
          value: clsValue,
          rating,
          entries: clsEntries,
          isFinal: true,
        });
      }
    });
  } catch (e) {
    console.warn('CLS observation not supported');
  }
}

// Observe First Contentful Paint
function observeFCP() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;
          const rating = getRating(value, THRESHOLDS.FCP);
          
          reportMetric({
            name: 'FCP',
            value,
            rating,
            entries: [entry],
          });
        }
      });
    });
    
    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('FCP observation not supported');
  }
}

// Observe Time to First Byte
function observeTTFB() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const value = entry.responseStart - entry.requestStart;
          const rating = getRating(value, THRESHOLDS.TTFB);
          
          reportMetric({
            name: 'TTFB',
            value,
            rating,
            entries: [entry],
          });
        }
      });
    });
    
    observer.observe({ type: 'navigation', buffered: true });
  } catch (e) {
    console.warn('TTFB observation not supported');
  }
}

// Observe Long Tasks
function observeLongTasks() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        reportMetric({
          name: 'Long Task',
          value: entry.duration,
          rating: entry.duration > 50 ? 'poor' : 'good',
          entries: [entry],
        });
      });
    });
    
    observer.observe({ type: 'longtask', buffered: true });
  } catch (e) {
    console.warn('Long Task observation not supported');
  }
}

// Observe Resource Loading Performance
function observeResourceTiming() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        // Track slow resources
        const loadTime = entry.responseEnd - entry.startTime;
        
        if (loadTime > 1000) { // Resources taking more than 1 second
          reportMetric({
            name: 'Slow Resource',
            value: loadTime,
            rating: 'poor',
            entries: [entry],
            details: {
              name: entry.name,
              type: entry.initiatorType,
              size: entry.transferSize,
            },
          });
        }
      });
    });
    
    observer.observe({ type: 'resource', buffered: true });
  } catch (e) {
    console.warn('Resource timing observation not supported');
  }
}

// Get performance rating based on thresholds
function getRating(value, thresholds) {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Report metric to analytics
function reportMetric(metric) {
  // Ensure this only runs on the client
  if (typeof window === 'undefined') return;
  
  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.rating,
      non_interaction: true,
      custom_map: {
        metric_rating: metric.rating,
        metric_value: metric.value,
      },
    });
  }
  
  // Send to console for debugging
  console.log(`${metric.name}:`, {
    value: metric.value,
    rating: metric.rating,
    isFinal: metric.isFinal || false,
  });
  
  // Send to custom analytics endpoint if needed
  if (process.env.NODE_ENV === 'production') {
    sendToAnalytics(metric);
  }
}

// Send metrics to custom analytics endpoint
async function sendToAnalytics(metric) {
  if (typeof window === 'undefined') return;
  
  try {
    await fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.warn('Failed to send performance metric:', error);
  }
}

// Get current performance metrics
export function getCurrentMetrics() {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return {};
  
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  const metrics = {};
  
  if (navigation) {
    metrics.TTFB = navigation.responseStart - navigation.requestStart;
    metrics.DOMContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
    metrics.LoadComplete = navigation.loadEventEnd - navigation.navigationStart;
  }
  
  paint.forEach((entry) => {
    if (entry.name === 'first-contentful-paint') {
      metrics.FCP = entry.startTime;
    }
    if (entry.name === 'first-paint') {
      metrics.FP = entry.startTime;
    }
  });
  
  return metrics;
}

// Performance budget checker
export function checkPerformanceBudget() {
  const metrics = getCurrentMetrics();
  const budget = {
    TTFB: 800,
    FCP: 1800,
    DOMContentLoaded: 3000,
    LoadComplete: 5000,
  };
  
  const results = {};
  
  Object.keys(budget).forEach((metric) => {
    if (metrics[metric] !== undefined) {
      results[metric] = {
        value: metrics[metric],
        budget: budget[metric],
        passed: metrics[metric] <= budget[metric],
        difference: metrics[metric] - budget[metric],
      };
    }
  });
  
  return results;
}

// Resource hints helper
export function addResourceHints() {
  if (typeof document === 'undefined') return;
  
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://en4ha1dlwxxhwad.madaratalkon.com',
  ];
  
  preconnectDomains.forEach((domain) => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${domain}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
  
  // DNS prefetch for analytics
  const dnsPrefetchDomains = [
    '//www.google-analytics.com',
    '//connect.facebook.net',
    '//www.googletagmanager.com',
  ];
  
  dnsPrefetchDomains.forEach((domain) => {
    const existingLink = document.querySelector(`link[href="${domain}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    }
  });
}

// Image loading optimization
export function optimizeImageLoading() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Lazy load images that are not in viewport
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Critical resource preloader
export function preloadCriticalResources() {
  if (typeof document === 'undefined') return;
  
  const criticalResources = [
    { href: '/logo.png', as: 'image', type: 'image/png' },
    { href: '/favicon.png', as: 'image', type: 'image/png' },
  ];
  
  criticalResources.forEach((resource) => {
    // Check if resource is already preloaded
    const existingLink = document.querySelector(`link[href="${resource.href}"][rel="preload"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
} 