import React, { useRef, useState } from "react";
import axios from 'axios';

export default function ShareBox({ shareLink }) {

    const passwordRef = useRef(null);
    const [sharableLink, setSharableLink] = useState('');
    const [loading, setLoading] = useState(false);

    const copyLink = () => {
        passwordRef.current?.select();
        window.navigator.clipboard.writeText(passwordRef.current.value);
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
        <div className="z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Share Link</h2>
                    <button onClick={shareLink} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M11 0.7H13V23.3H11z" transform="rotate(-45.001 12 12)" /><path d="M0.7 11H23.3V13H0.7z" transform="rotate(-45.001 12 12)" /></svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">Copy the link below and share it with others:</p>
                <input
                    type="text"
                    value={sharableLink}
                    className="w-full bg-gray-100 text-gray-800 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    readOnly={true}
                    ref={passwordRef}

                />
                {sharableLink ? <button
                    onClick={copyLink}
                    className="w-full bg-blue-600 disabled:bg-gray-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={loading}
                >
                    Copy Link
                </button> : <button
                    onClick={generateSharableLink}
                    className="w-full bg-blue-600 disabled:bg-gray-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={loading}
                >
                    {loading ? "Genegating..." : "Generate Link"}

                </button>}
            </div>
        </div>
    );
}