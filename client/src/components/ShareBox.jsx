import React, { useRef, useState } from "react";
import axios from 'axios';

export default function ShareBox({ shareLink }) {

    const passwordRef = useRef(null);
    const [sharableLink, setSharableLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        passwordRef.current?.select();
        window.navigator.clipboard.writeText(passwordRef.current.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const generateSharableLink = async () => {
        setLoading(true);
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api', {
                chat: window.localStorage.getItem("GeminiHistory")
            });
            // console.log("Link generated : ", response);
            if (response.data.success) {
                setSharableLink(`${window.location.origin}/${response.data.data.id}`);
            }

        } catch (error) {
            // console.log("ERROR at ShareBox.jsx : ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4">
            <div className="bg-dark-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-600/50 p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg animate-slideUp">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </div>
                        <h2 className="text-lg sm:text-xl font-display font-bold text-blue-300">
                            Share Chat
                        </h2>
                    </div>
                    <button 
                        onClick={shareLink} 
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-all duration-300 group"
                    >
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                    Generate a shareable link to let others view your conversation. The link will be publicly accessible.
                </p>
                
                <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={sharableLink}
                            className="w-full bg-dark-700/50 text-gray-100 p-3 sm:p-4 rounded-xl border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 pr-10 sm:pr-12 text-sm sm:text-base"
                            placeholder="Your shareable link will appear here..."
                            readOnly={true}
                            ref={passwordRef}
                        />
                        {sharableLink && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>

                    {sharableLink ? (
                        <button
                            onClick={copyLink}
                            className="w-full group relative bg-gradient-to-r from-accent-green to-primary-600 hover:from-accent-green/90 hover:to-primary-500 text-white py-3 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            disabled={loading}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </div>
                        </button>
                    ) : (
                        <button
                            onClick={generateSharableLink}
                            className="w-full group relative bg-slate-400 hover:from-primary-500 hover:to-secondary-500 text-white py-3 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            disabled={loading}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span>Generate Link</span>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                </div>

                <div className="mt-3 sm:mt-4 p-3 rounded-xl bg-dark-700/30 border border-dark-600/30">
                    <div className="flex items-start space-x-2 text-xs sm:text-xs text-gray-400">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Anyone with this link will be able to view your conversation. Make sure you're comfortable sharing this content.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}