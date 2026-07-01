import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ChatBox from './components/ChatBox'
import SharedChat from './components/SharedChat'
import { useEffect } from 'react'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <div className='w-full flex h-dvh'>
              <div className="w-1/6 bg-gray-800 md:flex flex-col p-4 hidden">
                <h1 className="text-white font-semibold text-xl mb-4">Chat History</h1>
                <div className="flex-1 overflow-y-auto">
                  {/* History items will go here */}
                </div>
              </div>
              <div className="md:w-5/6 w-full bg-gray-900">
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
