import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ChatBox from './components/ChatBox'
import SharedChat from './components/SharedChat'
import { useEffect, useState } from 'react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside or on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='w-full flex h-dvh bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 overflow-hidden'>
              {/* Mobile sidebar overlay */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden animate-fadeIn"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              {/* Sidebar */}
              <div className={`
                fixed md:relative top-0 left-0 h-full 
                w-80 xs:w-72 sm:w-80 md:w-1/6 lg:w-1/5 xl:w-1/6 2xl:w-1/6
                bg-gradient-to-b from-dark-800/95 to-dark-900/95 backdrop-blur-md 
                border-r border-dark-700/50 flex flex-col p-3 md:p-4 z-30
                transform transition-transform duration-300 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${sidebarOpen ? 'md:flex' : 'hidden md:flex'}
              `}>
                {/* Mobile close button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-all duration-300 z-40"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-blue-300 mt-8 md:mt-0">
                  <h1 className="font-display font-bold text-lg md:text-xl mb-4 md:mb-6 animate-slideIn">Chat History</h1>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scroll">
                  <div className="space-y-2 md:space-y-3">
                    {/* Placeholder for future chat history items */}
                    <div className="p-3 md:p-4 rounded-xl bg-dark-700/30 border border-dark-600/30 hover:bg-dark-600/40 transition-all duration-300 cursor-pointer animate-fadeIn opacity-50">
                      <div className="text-sm text-gray-300 font-medium">Previous chats will appear here</div>
                      <div className="text-xs text-gray-500 mt-1">Start a conversation to see history</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
                  <div className="text-xs text-gray-400 text-center">
                    💡 Tip: Your conversations are saved locally
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex-1 relative overflow-hidden min-w-0">
                {/* Background gradient effects - responsive */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-secondary-900/5 pointer-events-none"></div>
                <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-secondary-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{animationDelay: '1s'}}></div>
                
                <ChatBox />
              </div>
            </div>
          </>
        } />
        <Route path="/:id" element={<SharedChat />} />
      </Routes>
    </Router>
  )
}

export default App;
