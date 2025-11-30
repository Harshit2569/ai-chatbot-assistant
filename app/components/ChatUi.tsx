import { useState, useEffect, useRef } from 'react';

// Types
interface ChatUIProps {
  persona: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
  isError?: boolean;
}

// Custom hook for chat memory
function useChatMemory<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored chat history:', error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  };

  return [state, setValue];
}

// TextToSpeech Component (placeholder - implement as needed)

function TextToSpeech({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech first
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak();
    }
  };

  return (
    <button
      onClick={toggleSpeech}
      className="p-1.5 rounded-full hover:bg-gray-200 transition-colors mb-5"
      title={isSpeaking ? "Stop speaking" : "Speak this message"}
    >
      {isSpeaking ? (
        // Stop icon
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      ) : (
        // Speaker icon
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
}

// CopyButton Component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <svg className="w-4 h-4  text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// FileUpload Component
function FileUpload({ onFileSelect }: { onFileSelect: (text: string, fileName: string) => void }) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is text-based
    if (!file.type.startsWith('text/') && !file.name.match(/\.(txt|md|json|js|ts|jsx|tsx|css|html|py|java|cpp|c)$/)) {
      alert('Please upload a text file (txt, md, js, ts, json, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileSelect(text, file.name);
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 transition-colors flex items-center justify-center">
      <input
        type="file"
        className="hidden"
        accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.css,.html,.py,.java,.cpp,.c,.csv"
        onChange={handleFileChange}
      />
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    </label>
  );
}

// Main ChatUI Component
export default function ChatUI({ persona }: ChatUIProps) {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; text: string } | null>(null);

  // Initialize with empty array on server, use chat memory only on client
  const [messages, setMessages] = useChatMemory<Message[]>("chat-history", []);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clearChat = () => {
    setMessages([]); // wipes chat history
    localStorage.removeItem("chat-history"); // also clear storage
  };

  // Set mounted state and scroll to bottom
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMounted]);

  const sendMessage = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    setIsLoading(true);

    // Prepare message content
    const userMessage = selectedFile
      ? `📎 Uploaded ${selectedFile.name}: ${selectedFile.text.slice(0, 300)}...`
      : input;

    // Optimistic UI update (instant feedback)
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "bot", text: "", isLoading: true },
    ]);

    // Clear input and file preview
    setInput("");
    setSelectedFile(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          persona,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: data.reply, isLoading: false },
      ]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: "⚠️ Sorry, I encountered an error. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = (text: string, fileName: string) => {
    setSelectedFile({ name: fileName, text });
  };

  // Show loading state during SSR and initial hydration
  if (!isMounted) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-black font-semibold text-lg">AI Chat</h2>
            <div className="flex items-center gap-3">
              {/* Online indicator */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-green-600 text-xs sm:text-sm hidden xs:inline">Online</span>
              </div>

              {/* Clear Chat Button */}
              <button
                onClick={clearChat}
                className="text-red-500 text-xs sm:text-sm border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="h-64 sm:h-96 p-4 sm:p-6 bg-white flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xl sm:text-2xl">💬</span>
            </div>
            <p className="text-base sm:text-lg font-medium">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
   
    <div className="w-full bg-white rounded-lg border border-gray-200 max-w-full mx-auto">
  {/* Header - Responsive Style */}
  <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs sm:text-sm">AI</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-black font-semibold text-base sm:text-lg truncate">
            AI Chat Assistant
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm truncate">Ask me anything</p>
        </div>
      </div>
      
      {/* Clear Chat Button in main UI */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          <span className="text-green-600 text-xs sm:text-sm hidden xs:inline">Online</span>
        </div>
        <button
          onClick={clearChat}
          className="text-red-500 text-xs sm:text-sm border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition ml-2"
        >
          Clear Chat
        </button>
      </div>
    </div>
  </div>

  {/* Messages Container - Only show when there are messages */}
  {messages.length > 0 && (
    <div
      ref={chatRef}
      className="h-[400px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white scroll-smooth border-b border-gray-200"
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group relative`}
        >
          <div
            className={`max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 relative ${
              msg.sender === "user"
                ? "bg-black text-white rounded-br-none"
                : msg.isError
                ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none"
                : "bg-gray-100 text-black border border-gray-200 rounded-bl-none"
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              {msg.sender === "bot" && !msg.isError && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                  AI
                </div>
              )}
              {msg.sender === "user" && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                  You
                </div>
              )}
              <div className="flex-1 min-w-0">
                {msg.isLoading ? (
                  <div className="flex space-x-2 py-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                ) : (
                  <div className="flex items-start gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{msg.text}</p>
                    </div>
                    {msg.sender === "bot" && !msg.isError && (
                      <div className="flex-shrink-0 mt-1">
                        <TextToSpeech text={msg.text} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Copy Button */}
            {msg.sender === "bot" && !msg.isLoading && !msg.isError && msg.text && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 m-2 mr-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CopyButton text={msg.text} />
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )}

  {/* Welcome Message - Only show when no messages */}
  {messages.length === 0 && (
    <div className="flex flex-col items-center justify-center h-64 sm:h-96 text-gray-500 px-4 border-b border-gray-200">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl">💬</span>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 text-center">
        Start a conversation
      </h3>
      <p className="text-gray-500 text-center text-sm sm:text-base max-w-xs sm:max-w-md">
        I'm here to help! Ask me anything or upload a file to get started.
      </p>
    </div>
  )}

  {/* Input Area - Always visible */}
  <div className="bg-white px-3 sm:px-6 py-3 sm:py-4">
    {/* File Preview */}
    {selectedFile && (
      <div className="flex items-center gap-2 text-xs sm:text-sm mb-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
        <span className="flex-shrink-0">📎</span>
        <span className="flex-1 truncate text-xs sm:text-sm">{selectedFile.name}</span>
        <button
          onClick={() => setSelectedFile(null)}
          className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-100 flex-shrink-0"
          title="Remove file"
        >
          <span className="text-xs">✕</span>
        </button>
      </div>
    )}

    <div className="flex gap-2 sm:gap-3">
      {/* File Upload Button */}
      <div className="flex-shrink-0">
        <FileUpload onFileSelect={handleFileSelect} />
      </div>

      {/* Input Field */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        disabled={isLoading}
        className="flex-1 bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base min-w-0"
      />

      {/* Send Button */}
      <button
        onClick={sendMessage}
        disabled={(!input.trim() && !selectedFile) || isLoading}
        className="bg-black text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-[70px] sm:min-w-[100px] justify-center"
      >
        {isLoading ? (
          <>
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            <span className="hidden xs:inline text-xs sm:text-sm">Sending...</span>
            <span className="xs:hidden text-xs">...</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Send</span>
            <span className="sm:hidden text-xs">Send</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </div>

   
  </div>
</div>
  );
}