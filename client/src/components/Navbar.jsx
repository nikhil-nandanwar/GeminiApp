import React, { useState } from "react";
import ShareBox from "./ShareBox";

function Navbar() {

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
            <nav className="w-full z-10 fixed bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-2xl font-bold text-blue-500">Gemini</span>
                                <span className="text-2xl font-bold text-white">Chat</span>
                            </div>
                        </div>
                        <div className="block">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={clearLocalStorage}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors border border-gray-500"
                                >
                                    Clear Chat
                                </button>
                                <button
                                    onClick={() => setIsShare(true)}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors border border-gray-500"
                                >
                                    Share
                                </button>
                            </div>
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

export default Navbar;