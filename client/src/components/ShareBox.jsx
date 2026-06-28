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
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-dark-900/90 backdrop-blur-xl rounded-2xl border-2 border-emerald-500/30 p-6 w-full max-w-md shadow-2xl shadow-black/50 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                            Share Chat
                        </h2>
                    </div>
                    <button 
                        onClick={shareLink} 
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <p className="text-gray-400 mb-6 text-sm">
                    Generate a shareable link to let others view your conversation.
                </p>
                
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={sharableLink}
                            className="w-full bg-dark-800/80 text-gray-100 p-4 rounded-xl border border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm backdrop-blur-sm transition-all duration-300"
                            placeholder="Your shareable link will appear here..."
                            readOnly={true}
                            ref={passwordRef}
                        />
                    </div>

                    {sharableLink ? (
                        <button
                            onClick={copyLink}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white py-3.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                            disabled={loading}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {copied ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="w-full bg-dark-700 hover:bg-dark-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-dark-600/50 hover:border-dark-500/50"
                            disabled={loading}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span>Generate Link</span>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <p className="text-xs text-gray-400 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Anyone with this link will be able to view your conversation.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}