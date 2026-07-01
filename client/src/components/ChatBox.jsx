import React, { useState, useEffect, useRef } from "react";
import { model } from "../gemini/gemini.config.js";
import NewMarkdown from "./NewMarkdown.jsx";
import MarkdownViewer from './MarkdownViewer.jsx'
import ChatLoadingAnimation from "./ChatLoadingAnimation.jsx";

function ChatBox() {
	//TO STORE PROMPT STATE ENTERED BY USER
	const [prompt, setPrompt] = useState("");

	//TO STORE PREVIOUS CHAT
	const [geminiHistory, setGeminiHistory] = useState([]);
	const [prevChat, setPrevChat] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const chatContainerRef = useRef(null);

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	};

	// Scroll to bottom when chat history changes
	useEffect(() => {
		scrollToBottom();
	}, [geminiHistory, isLoading]);

	//GET PREVIOUS CHAT FROM LOCAL STORAGE
	useEffect(() => {
		const savedHistory = localStorage.getItem("GeminiHistory");
		if (savedHistory) {
			try {
				const parsedHistory = JSON.parse(savedHistory);
				if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
					setGeminiHistory(parsedHistory);
					setPrevChat(true);
				}
			} catch (error) {
				console.error("Error parsing chat history:", error);
				localStorage.removeItem("GeminiHistory");
			}
		}
	}, []);

	const saveToLocalStorage = (history) => {
		try {
			localStorage.setItem("GeminiHistory", JSON.stringify(history));
		} catch (error) {
			console.error("Error saving to local storage:", error);
		}
	};

	const promptSubmit = async () => {
		if (!prompt.trim()) return;

		const userMessage = {
			role: "user",
			parts: [{ text: prompt.trim() }],
		};

		setPrompt("");
		setIsLoading(true);

		// Add user message to history
		const updatedHistory = [...geminiHistory, userMessage];
		setGeminiHistory(updatedHistory);
		setPrevChat(true);

		// Create chat session with updated history
		const chatSession = model.startChat({
			history: updatedHistory.slice(0, -1),
		});

		try {
			const result = await chatSession.sendMessage(prompt);
			const text = await result.response.text();

			// Add AI response to history
			const newResponse = {
				role: "model",
				parts: [{ text: text }],
			};

			const finalHistory = [...updatedHistory, newResponse];
			setGeminiHistory(finalHistory);
			saveToLocalStorage(finalHistory);
		} catch (error) {
			console.error("Error in chat:", error);
			const errorResponse = {
				role: "model",
				parts: [{ text: "Sorry, there was an error processing your request." }],
			};
			const finalHistory = [...updatedHistory, errorResponse];
			setGeminiHistory(finalHistory);
			saveToLocalStorage(finalHistory);
		} finally {
			setIsLoading(false);
		}
	};

	const clearChat = () => {
		setGeminiHistory([]);
		setPrevChat(false);
		localStorage.removeItem("GeminiHistory");
	};

	const check = (e) => {
		if ((e.code === "Enter" || e.code === "NumpadEnter") && !e.shiftKey) {
			e.preventDefault();
			promptSubmit();
		}
	};

	return (
		<div className="w-full flex flex-col h-dvh">
			<div className="w-full flex-1 flex justify-center overflow-hidden pt-16">
				<div ref={chatContainerRef} className="w-full md:w-9/12 h-full overflow-y-auto px-4 py-2 scroll-smooth">
					{prevChat &&
						geminiHistory.map((chat, index) => (
							<div key={index} className={`w-full animate-fadeIn flex ${chat.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
								<div
									className={`p-4 rounded-lg shadow-lg ${chat.role === "user"
										? "bg-blue-600 text-white max-w-[80%] break-words"
										: "bg-gray-700 text-white max-w-[80%] break-words"
										}`}
									style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
								>
									<div className="font-medium mb-2 text-sm opacity-80">
										{chat.role === "user" ? "You" : "AI Assistant"}
									</div>
									<div className="prose prose-invert max-w-none">
										<NewMarkdown content={chat.parts[0].text} />
									</div>
								</div>
							</div>
						))}
					{isLoading && <ChatLoadingAnimation />}
				</div>
			</div>

			<div className="w-full bg-gray-900 border-t border-gray-700 p-2">
				<form
					onKeyDown={check}
					onSubmit={(e) => {
						e.preventDefault();
						promptSubmit();
					}}
					className="max-w-4xl mx-auto"
				>
					<div className="relative w-full">
						<textarea
							placeholder="Type your message..."
							onChange={(e) => setPrompt(e.target.value)}
							value={prompt}
							className="w-full rounded-xl p-4 pr-24 bg-gray-800 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
							rows="3"
							style={{ minHeight: "60px", maxHeight: "150px" }}
						/>
						<div className="absolute right-2 bottom-9 flex gap-2">
							<button
								type="submit"
								disabled={!prompt.trim()}
								className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
							</button>
						</div>
					</div>
					<p className="text-xs text-gray-400 text-center mt-1">
						Press Shift+Enter for a new line
					</p>
				</form>
			</div>
		</div>
	);
}

export default ChatBox;