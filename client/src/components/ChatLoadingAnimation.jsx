import React from "react";

const ChatLoadingAnimation = () => {
    return (
        <>
            <div className="w-full animate-fadeIn flex justify-start mb-4">
                <div className="p-4 rounded-lg shadow-lg bg-gray-700 text-white max-w-[80%]">
                    <div className="font-medium mb-2 text-sm opacity-80">
                        AI Assistant
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatLoadingAnimation;