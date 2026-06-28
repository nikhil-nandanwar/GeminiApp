import React, { useEffect, useState, useCallback, useMemo, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Lazy load components for better performance
const Navbar = React.lazy(() => import('./components/Navbar'))
const ChatBox = React.lazy(() => import('./components/ChatBox'))
const SharedChat = React.lazy(() => import('./components/SharedChat'))

// Loading fallback component
const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center h-screen bg-dark-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
))

LoadingFallback.displayName = 'LoadingFallback'

// Memoized sidebar component for better performance
const Sidebar = React.memo(({ sidebarOpen, onClose }) => (
  <div className={`
    fixed md:relative top-0 left-0 h-full 
    w-72 md:w-64 lg:w-72
    bg-gradient-to-b from-dark-800/95 to-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 flex flex-col p-4 z-30
    transform transition-transform duration-300 ease-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    ${sidebarOpen ? 'md:flex' : 'hidden md:flex'}
  `}>
    {/* Mobile close button */}
    <button
      onClick={onClose}
      className="md:hidden absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-all duration-300 z-40"
      aria-label="Close sidebar"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div className="mt-8 md:mt-0">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="font-semibold text-white text-lg">Chat History</h1>
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto custom-scroll">
      <div className="space-y-2">
        {/* Placeholder for future chat history items */}
        <div className="p-4 rounded-xl bg-dark-700/30 border border-dark-600/30 text-gray-400 text-sm hover:bg-dark-700/50 hover:border-dark-600/50 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No previous chats</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Sidebar footer */}
    <div className="mt-4 pt-4 border-t border-dark-700/50">
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
        <p className="text-xs text-gray-400">Start a new conversation to see your chat history here.</p>
      </div>
    </div>
  </div>
))

Sidebar.displayName = 'Sidebar'

// Memoized main content component
const MainContent = React.memo(({ sidebarOpen, onSidebarClose }) => (
  <div className='w-full flex h-dvh bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 overflow-hidden'>
    {/* Mobile sidebar overlay */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden animate-fadeIn"
        onClick={onSidebarClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSidebarClose()
          }
        }}
        aria-label="Close sidebar overlay"
      />
    )}
    
    {/* Sidebar */}
    <Sidebar sidebarOpen={sidebarOpen} onClose={onSidebarClose} />
    
    {/* Main content */}
    <div className="flex-1 relative overflow-hidden min-w-0">
      <Suspense fallback={<LoadingFallback />}>
        <ChatBox />
      </Suspense>
    </div>
  </div>
))

MainContent.displayName = 'MainContent'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoized sidebar close handler
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Memoized sidebar toggle handler
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Close sidebar when clicking outside or on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    // Use passive listener for better performance
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized routes configuration
  const routes = useMemo(() => [
    {
      path: "/",
      element: (
        <>
          <Suspense fallback={<LoadingFallback />}>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </Suspense>
          <MainContent sidebarOpen={sidebarOpen} onSidebarClose={handleSidebarClose} />
        </>
      )
    },
    {
      path: "/:id",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <SharedChat />
        </Suspense>
      )
    }
  ], [sidebarOpen, handleSidebarClose]);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  )
}

export default React.memo(App)
