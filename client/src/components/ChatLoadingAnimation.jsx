import React from "react";

const ChatLoadingAnimation = () => {
    return (
        <>
            <div className="w-full animate-fadeIn flex justify-start mb-4 md:mb-6">
                <div className="group relative w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] mr-auto">
                    <div className="flex items-start space-x-2 md:space-x-3">
                        {/* AI Avatar */}
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center flex-shrink-0 shadow-glow">
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        
                        {/* Loading bubble */}
                        <div className="flex-1 min-w-0 p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-sm border bg-dark-800/60 text-gray-100 border-dark-600/30">
                            <div className="font-medium mb-2 text-xs md:text-sm opacity-80 text-gray-400">
                                AI Assistant
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                                <span className="text-xs md:text-sm text-gray-400 animate-pulse ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatLoadingAnimation;