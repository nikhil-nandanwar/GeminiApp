import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initPerformanceMonitoring } from './utils/performance.js'
import { registerServiceWorker } from './utils/serviceWorker.js'

// Initialize performance monitoring
initPerformanceMonitoring()

// Register service worker for caching and offline support
registerServiceWorker()

import App from './App.jsx'

// Get root element with error handling
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
