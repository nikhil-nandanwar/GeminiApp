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
		<div className="w-full flex flex-col h-dvh relative">
			{/* Chat messages area */}
			<div className="w-full flex-1 flex justify-center overflow-hidden pt-16">
				<div ref={chatContainerRef} className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl h-full overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 scroll-smooth custom-scroll mx-auto">
					{!prevChat && (
						<div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fadeIn px-4">
							<div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow animate-float">
								<svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div className="space-y-3 max-w-lg">
								<h2 className="text-2xl md:text-3xl font-display font-bold text-white relative">
									<span className="relative z-10">Welcome to GeminiChat</span>
									<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-lg blur-sm"></div>
								</h2>
								<p className="text-gray-400 text-base md:text-lg max-w-md mx-auto">
									Start a conversation with AI. Ask anything, get intelligent responses.
								</p>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
								{[
									{ icon: "💡", text: "Ask for creative ideas", color: "from-accent-yellow/20 to-accent-orange/20" },
									{ icon: "🔍", text: "Research any topic", color: "from-accent-green/20 to-primary-500/20" },
									{ icon: "📝", text: "Write and edit content", color: "from-secondary-500/20 to-accent-pink/20" },
									{ icon: "🧮", text: "Solve complex problems", color: "from-primary-500/20 to-accent-purple/20" }
								].map((item, index) => (
									<div key={index} className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${item.color} border border-dark-600/30 hover:border-primary-500/30 transition-all duration-300 cursor-pointer group`}>
										<div className="flex items-center space-x-2 md:space-x-3">
											<span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
											<span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300 text-sm md:text-base">{item.text}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					
					{prevChat &&
						geminiHistory.map((chat, index) => (
							<div key={index} className={`w-full animate-fadeIn flex ${chat.role === "user" ? "justify-end" : "justify-start"} mb-4 md:mb-6`}>
								<div className={`group relative w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] ${chat.role === "user" ? "ml-auto" : "mr-auto"}`}>
									{/* Avatar */}
									<div className={`flex items-start space-x-2 md:space-x-3 ${chat.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
										<div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
											chat.role === "user" 
												? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow" 
												: "bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-glow"
										}`}>
											{chat.role === "user" ? (
												<svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
											) : (
												<svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
												</svg>
											)}
										</div>
										
										{/* Message bubble */}
										<div className={`flex-1 min-w-0 p-3 md:p-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 group-hover:shadow-xl ${
											chat.role === "user"
												? "bg-gradient-to-br from-primary-600/90 to-primary-700/90 text-white border-primary-500/30 group-hover:border-primary-400/50"
												: "bg-dark-800/60 text-gray-100 border-dark-600/30 group-hover:border-dark-500/50"
										}`}>
											<div className={`font-medium mb-2 text-xs md:text-sm opacity-80 ${chat.role === "user" ? "text-primary-100" : "text-gray-400"}`}>
												{chat.role === "user" ? "You" : "AI Assistant"}
											</div>
											<div className="prose prose-invert max-w-none prose-sm md:prose-base overflow-hidden">
												<div className="break-words overflow-wrap-anywhere">
													<NewMarkdown content={chat.parts[0].text} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					{isLoading && <ChatLoadingAnimation />}
				</div>
			</div>

			{/* Input area */}
			<div className="w-full bg-dark-900/80 backdrop-blur-md border-t border-dark-700/50 p-3 md:p-4 safe-area-bottom">
				<form
					onKeyDown={check}
					onSubmit={(e) => {
						e.preventDefault();
						promptSubmit();
					}}
					className="max-w-4xl mx-auto"
				>
					<div className="relative w-full group">
						<div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div className="relative">
							<textarea
								placeholder="Type your message... (Shift+Enter for new line)"
								onChange={(e) => setPrompt(e.target.value)}
								value={prompt}
								className="w-full rounded-2xl p-3 md:p-4 pr-12 md:pr-16 bg-dark-800/80 backdrop-blur-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-dark-600/50 focus:border-primary-500/50 transition-all duration-300 shadow-lg text-sm md:text-base"
								rows="1"
								style={{ 
									minHeight: "44px", 
									maxHeight: "120px",
									lineHeight: "1.5"
								}}
								onInput={(e) => {
									e.target.style.height = 'auto';
									e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
								}}
							/>
							<div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex gap-2">
								<button
									type="submit"
									disabled={!prompt.trim() || isLoading}
									className="group p-2 md:p-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-glow-lg transform hover:scale-105 active:scale-95"
								>
									{isLoading ? (
										<svg className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 px-1 gap-2 sm:gap-0">
						<p className="text-xs text-gray-500 hidden sm:block">
							AI responses may contain inaccuracies. Verify important information.
						</p>
						<div className="flex items-center justify-center sm:justify-end space-x-2 text-xs text-gray-500">
							<kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-dark-700 border border-dark-600 rounded hidden sm:inline">Shift</kbd>
							<span className="hidden sm:inline">+</span>
							<kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-dark-700 border border-dark-600 rounded hidden sm:inline">Enter</kbd>
							<span className="hidden sm:inline">for new line</span>
							<span className="sm:hidden text-center">Shift+Enter for new line</span>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ChatBox;