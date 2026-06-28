import React from "react";

const ChatLoadingAnimation = () => {
    return (
        <>
            <div className="w-full flex justify-start mb-6 animate-slideUp">
                <div className="w-full max-w-[85%] md:max-w-[75%] mr-auto">
                    <div className="flex items-start space-x-3">
                        {/* AI Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        
                        {/* Loading bubble */}
                        <div className="flex-1 min-w-0 p-4 rounded-2xl bg-dark-800/90 text-gray-100 border border-dark-700/50 backdrop-blur-sm">
                            <div className="text-xs mb-2 font-medium opacity-70 text-gray-400">
                                AI Assistant
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatLoadingAnimation;