import { useState } from "react";
import PropTypes from "prop-types";
import ShareBox from "./ShareBox";

function Navbar({ sidebarOpen, setSidebarOpen }) {

    const [isShare, setIsShare] = useState(false);

    const clearLocalStorage = () => {
        localStorage.removeItem("GeminiHistory");
        window.location.reload();
    };

    return (
        <>
            <nav className="w-full z-20 fixed border-b border-amber-100 bg-[#f8f4ee]/95 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen?.(!sidebarOpen)}
                                className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-sm shadow-orange-200/80">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="hidden sm:flex items-baseline">
                                    <span className="text-xl font-semibold text-slate-900">
                                        GeminiChat
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={clearLocalStorage}
                                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full text-sm border border-amber-100 bg-[#f8f4ee] hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 group"
                            >
                                <svg className="w-4 h-4 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">Clear Chat</span>
                            </button>
                            <button
                                onClick={() => setIsShare(true)}
                                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full text-sm border border-amber-100 bg-[#f8f4ee] hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 group"
                            >
                                <svg className="w-4 h-4 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                <span className="hidden sm:inline">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {
                isShare && <ShareBox shareLink={() => setIsShare(false)} />
            }
        </>
    );
}

Navbar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired
};

export default Navbar;