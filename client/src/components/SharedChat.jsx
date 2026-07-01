import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SharedChat() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${id}`);
                const chatData = JSON.parse(response.data.chat.chat);
                // console.log('Fetched chat data:', chatData); // Debug log
                window.localStorage.setItem("GeminiHistory", JSON.stringify(chatData));
                setLoading(false);
                navigate('/');
            } catch (error) {
                console.error("Error fetching shared chat:", error);
                setError(error.response?.data?.message || "Failed to load chat");
                setLoading(false);
            }
        };

        fetchChat();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.16),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">
                <div className="text-center space-y-6 animate-fadeIn max-w-md mx-auto px-4">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_24px_50px_rgba(249,115,22,0.18)] animate-pulse mx-auto">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Loading Shared Chat
                        </h2>
                        <p className="text-slate-500">Retrieving conversation data...</p>
                    </div>
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.16),transparent_40%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">
                <div className="text-center space-y-6 animate-fadeIn max-w-md mx-auto px-4">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-black to-orange-500 flex items-center justify-center shadow-[0_24px_50px_rgba(15,23,42,0.18)] mx-auto">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Chat Not Found
                        </h2>
                        <p className="text-slate-500 leading-relaxed">{error}</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="group px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-all duration-300 shadow-[0_12px_24px_rgba(15,23,42,0.12)] transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Go Home</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <></>
    );
}
