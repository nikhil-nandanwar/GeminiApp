import React from "react";

const ChatLoadingAnimation = () => {
    return (
        <>
            <div className="w-full flex justify-start mb-6 animate-slideUp">
                <div className="w-full max-w-[85%] md:max-w-[75%] mr-auto">
                    <div className="flex items-start space-x-3">
                        {/* AI Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-[0_10px_20px_rgba(249,115,22,0.16)]">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        
                        {/* Loading bubble */}
                        <div className="flex-1 min-w-0 p-4 rounded-2xl bg-white text-slate-700 border border-slate-200 shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur-sm">
                            <div className="text-xs mb-2 font-medium opacity-70 text-slate-400">
                                AI Assistant
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatLoadingAnimation;