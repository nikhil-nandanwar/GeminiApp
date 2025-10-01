import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initPerformanceMonitoring } from './utils/performance.js'
import { registerServiceWorker } from './utils/serviceWorker.js'

// Initialize performance monitoring
initPerformanceMonitoring()

// Register service worker for caching and offline support
registerServiceWorker()

// Lazy load the main App component
const App = React.lazy(() => import('./App.jsx'))

// App loading fallback
const AppFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading GeminiChat...</p>
    </div>
  </div>
)

// Get root element with error handling
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<AppFallback />}>
      <App />
    </React.Suspense>
  </React.StrictMode>
)
