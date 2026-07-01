import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBox from './ChatBox';

export default function SharedChat() {
    const { id } = useParams();
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${id}`);
                const chatData = JSON.parse(response.data.chat.chat);
                // console.log('Fetched chat data:', chatData); // Debug log
                setChat(chatData);
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
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white">Loading shared chat...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <></>
    );
}
