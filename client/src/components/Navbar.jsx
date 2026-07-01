import React, { useState } from "react";
import ShareBox from "./ShareBox";

function Navbar({ sidebarOpen, setSidebarOpen }) {

    const [isShare, setIsShare] = useState(false);

    const clearLocalStorage = () => {
        localStorage.removeItem("GeminiHistory");
        window.location.reload();
    };

    const shareLink = (setIsShare) => {
        setIsShare((prev) => !prev);
    };

    return (
        <>
            <nav className="w-full z-20 fixed bg-dark-800/80 backdrop-blur-md border-b border-dark-700/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen?.(!sidebarOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-all duration-300 group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <div className="flex-shrink-0 group">
                                <div className="flex items-center space-x-2">
                                    {/* Logo icon */}
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    {/* Brand text */}
                                    <div className="hidden sm:flex items-baseline ">
                                        <span className="text-2xl font-display font-bold text-blue-300 relative group-hover:text-blue-200 transition-all duration-300">
                                            Gemini
                                        </span>
                                        <span className="text-2xl font-display font-bold text-purple-300 relative group-hover:text-purple-200 transition-all duration-300">
                                            Chat
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <button
                                    onClick={clearLocalStorage}
                                    className="group relative text-gray-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-dark-600/50 hover:border-accent-orange/50 bg-dark-700/30 hover:bg-dark-600/50 backdrop-blur-sm"
                                >
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span className="hidden sm:inline">Clear Chat</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setIsShare(true)}
                                    className="group relative text-gray-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-dark-600/50 hover:border-primary-500/50 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 hover:from-primary-500/20 hover:to-secondary-500/20 backdrop-blur-sm"
                                >
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        <span className="hidden sm:inline">Share</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
            </nav>
            {
                isShare && <ShareBox shareLink={() => setIsShare(false)} />
            }
        </>
    );
}

export default Navbar;