import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { model } from "../gemini/gemini.config.js";
import NewMarkdown from "./NewMarkdown.jsx";
import ChatLoadingAnimation from "./ChatLoadingAnimation.jsx";

// Memoized chat message component for better performance
const ChatMessage = React.memo(({ chat, index }) => {
  const isUser = chat.role === "user";
  
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-6 animate-slideUp`} style={{ animationDelay: `${index * 50}ms` }}>
      <div className={`w-full max-w-[85%] md:max-w-[75%] ${isUser ? "ml-auto" : "mr-auto"}`}>
        <div className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
            isUser 
							? "bg-gradient-to-br from-orange-500 to-amber-400 shadow-orange-200/80" 
							: "bg-gradient-to-br from-white to-slate-100 shadow-slate-200/90 border border-slate-200"
          }`}>
            {isUser ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
							<svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          
          <div className={`flex-1 min-w-0 p-4 rounded-2xl ${
            isUser
							? "bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-[0_14px_30px_rgba(249,115,22,0.18)]"
							: "bg-[#f8f4ee] text-slate-700 border border-amber-100 shadow-[0_14px_30px_rgba(120,113,108,0.1)] backdrop-blur-sm"
          }`}>
						<div className={`text-xs mb-2 font-medium opacity-70 ${isUser ? "text-sky-50" : "text-slate-400"}`}>
              {isUser ? "You" : "AI Assistant"}
            </div>
						<div className="prose prose-slate max-w-none prose-sm">
							<NewMarkdown content={chat.parts[0].text} />
						</div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
ChatMessage.propTypes = {
	chat: PropTypes.shape({
		role: PropTypes.string.isRequired,
		parts: PropTypes.arrayOf(
			PropTypes.shape({
				text: PropTypes.string.isRequired
			})
		).isRequired
	}).isRequired,
	index: PropTypes.number.isRequired
};

// Memoized welcome screen component
const WelcomeScreen = React.memo(() => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4 animate-fadeIn">
		<div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_24px_50px_rgba(249,115,22,0.18)] animate-float">
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <div className="space-y-3 max-w-lg">
			<h2 className="text-3xl font-bold text-slate-900">
        Welcome to <span className="gradient-text">GeminiChat</span>
      </h2>
			<p className="text-slate-500 text-base max-w-md mx-auto">
        Start a conversation with AI. Ask anything, get intelligent responses.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
      {[
        { text: "Ask for creative ideas", icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )},
        { text: "Research any topic", icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )},
        { text: "Write and edit content", icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )},
        { text: "Solve complex problems", icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )}
      ].map((item, index) => (
				<div key={index} className="p-4 rounded-2xl bg-[#f8f4ee] border border-amber-100 hover:border-orange-200 hover:bg-orange-50/70 hover:shadow-[0_10px_30px_rgba(120,113,108,0.08)] transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-3">
						<div className="text-orange-500 group-hover:scale-110 transition-transform">{item.icon}</div>
						<span className="text-slate-600 text-sm font-medium">{item.text}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));

WelcomeScreen.displayName = 'WelcomeScreen';

function ChatBox() {
	//TO STORE PROMPT STATE ENTERED BY USER
	const [prompt, setPrompt] = useState("");

	//TO STORE PREVIOUS CHAT
	const [geminiHistory, setGeminiHistory] = useState([]);
	const [prevChat, setPrevChat] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const chatContainerRef = useRef(null);

	// Memoized scroll function
	const scrollToBottom = useCallback(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, []);

	// Scroll to bottom when chat history changes
	useEffect(() => {
		scrollToBottom();
	}, [geminiHistory, isLoading, scrollToBottom]);

	// Memoized localStorage operations
	const saveToLocalStorage = useCallback((history) => {
		try {
			localStorage.setItem("GeminiHistory", JSON.stringify(history));
		} catch (error) {
			console.error("Error saving to local storage:", error);
		}
	}, []);

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

	// Memoized prompt submit function
	const promptSubmit = useCallback(async () => {
		if (!prompt.trim()) return;

		const userMessage = {
			role: "user",
			parts: [{ text: prompt.trim() }],
		};

		const currentPrompt = prompt.trim();
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
			const result = await chatSession.sendMessage(currentPrompt);
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
	}, [prompt, geminiHistory, saveToLocalStorage]);

	// Memoized key check function
	const check = useCallback((e) => {
		if ((e.code === "Enter" || e.code === "NumpadEnter") && !e.shiftKey) {
			e.preventDefault();
			promptSubmit();
		}
	}, [promptSubmit]);

	// Memoized input handler
	const handleInputChange = useCallback((e) => {
		setPrompt(e.target.value);
	}, []);

	// Memoized auto-resize handler
	const handleInputResize = useCallback((e) => {
		e.target.style.height = 'auto';
		e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
	}, []);

	// Memoized form submit handler
	const handleFormSubmit = useCallback((e) => {
		e.preventDefault();
		promptSubmit();
	}, [promptSubmit]);

	// Memoized computed values
	const isSubmitDisabled = useMemo(() => !prompt.trim() || isLoading, [prompt, isLoading]);

	return (
		<div className="w-full flex flex-col h-dvh relative">
			{/* Chat messages area */}
			<div className="w-full flex-1 flex justify-center overflow-hidden pt-16">
				<div ref={chatContainerRef} className="w-full max-w-4xl h-full overflow-y-auto px-4 py-8 scroll-smooth custom-scroll mx-auto">
					{!prevChat && <WelcomeScreen />}
					
					{prevChat &&
						geminiHistory.map((chat, index) => (
							<ChatMessage key={`${chat.role}-${index}`} chat={chat} index={index} />
						))}
					{isLoading && <ChatLoadingAnimation />}
				</div>
			</div>

			{/* Input area */}
			<div className="w-full bg-[#f8f4ee]/95 backdrop-blur-xl border-t border-amber-100 p-4 shadow-[0_-12px_40px_rgba(120,113,108,0.1)]">
				<form
					onKeyDown={check}
					onSubmit={handleFormSubmit}
					className="max-w-4xl mx-auto"
				>
					<div className="relative w-full">
						<div className="relative">
							<textarea
								placeholder="Write a message. Shift+Enter adds a new line."
								onChange={handleInputChange}
								value={prompt}
								className="w-full rounded-[1.25rem] p-4 pr-14 bg-[#f3ede4] text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 border border-amber-100 text-sm shadow-sm transition-all duration-300"
								rows="1"
								style={{ 
									minHeight: "52px", 
									maxHeight: "140px",
									lineHeight: "1.5"
								}}
								onInput={handleInputResize}
							/>
							<div className="absolute right-3 bottom-3">
								<button
									type="submit"
									disabled={isSubmitDisabled}
									className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_12px_24px_rgba(249,115,22,0.18)] hover:shadow-[0_14px_28px_rgba(249,115,22,0.24)]"
								>
									{isLoading ? (
										<svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
					<div className="mt-2 text-xs text-slate-400 text-center sm:text-right">
						Shift+Enter for new line
					</div>
				</form>
			</div>
		</div>
	);
}

export default React.memo(ChatBox);