// Performance utilities for asset optimization and monitoring
export class PerformanceMonitor {
  static instance = null;
  
  constructor() {
    if (PerformanceMonitor.instance) {
      return PerformanceMonitor.instance;
    }
    
    this.metrics = new Map();
    this.observers = new Map();
    this.initialized = false;
    
    PerformanceMonitor.instance = this;
  }
  
  static getInstance() {
    if (!PerformanceMonitor.instance) {
      new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  init() {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    
    this.initCoreWebVitals();
    this.initResourceTiming();
    this.initNavigationTiming();
    this.initialized = true;
  }
  
  initCoreWebVitals() {
    // Measure Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('LCP', lastEntry.startTime);
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }
      
      // Measure First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.metrics.set('FID', entry.processingStart - entry.startTime);
            console.log('FID:', entry.processingStart - entry.startTime);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }
      
      // Measure Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.set('CLS', clsValue);
              console.log('CLS:', clsValue);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }
  }
  
  initResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.transferSize === 0) {
              console.log('Resource loaded from cache:', entry.name);
            } else {
              console.log('Resource loaded from network:', entry.name, 'Size:', entry.transferSize);
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (error) {
        console.warn('Resource observer not supported:', error);
      }
    }
  }
  
  initNavigationTiming() {
    if (window.performance && window.performance.navigation) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navTiming = performance.getEntriesByType('navigation')[0];
          if (navTiming) {
            const metrics = {
              'DNS Lookup': navTiming.domainLookupEnd - navTiming.domainLookupStart,
              'TCP Connection': navTiming.connectEnd - navTiming.connectStart,
              'TTFB': navTiming.responseStart - navTiming.requestStart,
              'DOM Loading': navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
              'Total Load Time': navTiming.loadEventEnd - navTiming.loadEventStart
            };
            
            console.log('Navigation Timing:', metrics);
            Object.entries(metrics).forEach(([key, value]) => {
              this.metrics.set(key, value);
            });
          }
        }, 0);
      });
    }
  }
  
  measureCustomTiming(name, startTime, endTime) {
    const duration = endTime - startTime;
    this.metrics.set(name, duration);
    console.log(`Custom Timing - ${name}:`, duration);
    return duration;
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
  
  static preloadImages(srcArray) {
    return Promise.all(srcArray.map(this.preloadImage));
  }
  
  static lazyLoadImage(img, options = {}) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            if (image.dataset.src) {
              image.src = image.dataset.src;
              image.removeAttribute('data-src');
            }
            observer.unobserve(image);
          }
        });
      }, { threshold: 0.1, ...options });
      
      observer.observe(img);
      return observer;
    } else {
      // Fallback for browsers without IntersectionObserver
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    }
  }
  
  static webpSupported() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  static avifSupported() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  }
  
  static getOptimalFormat() {
    if (this.avifSupported()) return 'avif';
    if (this.webpSupported()) return 'webp';
    return 'png';
  }
}

// Bundle size optimization utilities
export class BundleOptimizer {
  static trackBundleSize() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            console.log(`Bundle: ${entry.name}, Size: ${entry.transferSize} bytes, Gzipped: ${entry.encodedBodySize} bytes`);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }
  
  static measureRenderTime(componentName, renderFunction) {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    console.log(`${componentName} render time: ${endTime - startTime}ms`);
    return result;
  }
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance();
    monitor.init();
    BundleOptimizer.trackBundleSize();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.log('Performance Metrics:', monitor.getMetrics());
      }, 2000);
    });
  }
};