
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChatMemory } from "../hooks/useChatmemory";
import FileUpload from "./FileUpload";
import TextToSpeech from "./TextSpeech";
import ChatExport from "./ChatExport";

interface ChatUIProps {
  persona: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  isLoading?: boolean;
  isError?: boolean;
}

// Copy to clipboard hook
const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  };

  return { copyToClipboard, isCopied };
};

// Copy button component
const CopyButton = ({ text }: { text: string }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copyToClipboard(text)}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isCopied
          ? "bg-green-100 text-green-600"
          : "bg-white/90 text-gray-600 hover:bg-white hover:shadow-md border border-gray-200"
      }`}
      title={isCopied ? "Copied!" : "Copy message"}
    >
      {isCopied ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
};

export default function ChatUI({ persona }: ChatUIProps) {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; text: string } | null>(null);

  // Initialize with empty array on server, use chat memory only on client
  const [messages, setMessages] = useChatMemory<Message[]>("chat-history", []);
  const chatRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  // Handle uploaded file
  // const handleFileSelect = (text: string, fileName: string) => {
  //   setMessages((prev) => [
  //     ...prev,
  //     { sender: "user", text: `Uploaded ${fileName}: ${text.slice(0, 300)}...` },
  //   ]);
  // };
  const handleFileSelect = (text: string, fileName: string) => {
  // Save the selected file to preview and send later
  setSelectedFile({ name: fileName, text });

 
};


  // Show loading state during SSR and initial hydration
  if (!isMounted) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>
          <div className="flex items-center gap-3">
            {persona && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {persona}
              </span>
            )}
          </div>
        </div>

        {/* Messages Container - Loading State */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-white/80 dark:bg-gray-900/80">
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-lg font-medium">Loading chat...</p>
              <p className="text-sm">Please wait</p>
            </div>
          </div>
        </div>

        {/* Input & Actions - Loading State */}
        <div className="border-t border-gray-200 bg-white dark:bg-gray-900 p-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 relative w-full">
              <input
                disabled
                placeholder="Loading..."
                className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-500"
              />
            </div>
            <button
              disabled
              className="bg-gray-400 text-white px-6 py-3 rounded-2xl font-medium cursor-not-allowed flex items-center gap-2"
            >
              <span>Loading...</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="hidden w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
    
      {/* Header */}
<div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    <h1 className="text-xl font-bold">AI Assistant</h1>
  </div>

  {/* Right side: Export + Persona + New Chat */}
  <div className="flex items-center gap-3">
    <ChatExport chatRef={chatRef} />
    {persona && (
      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{persona}</span>
    )}

    <button
      onClick={() => {
        setMessages([]);        // Clear all messages
        setInput("");           // Clear input box
        setSelectedFile(null);  // Clear any selected file
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" }); // Scroll to top
      }}
      className="bg-white/20 text-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
      title="Start a new chat"
    >
      🔄 New Chat
    </button>
  </div>
</div>


      {/* Messages Container */}
      <div
        ref={chatRef}
        className="h-96 overflow-y-auto p-6 space-y-4 bg-white/80 dark:bg-gray-900/80"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Ask me anything!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } group relative`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                    : msg.isError
                    ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.sender === "bot" && !msg.isError && (
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-1 flex-shrink-0">
                      AI
                    </div>
                  )}
                  {msg.sender === "user" && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mt-1 flex-shrink-0">
                      You
                    </div>
                  )}
                  <div className="flex-1">
                    {msg.isLoading ? (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.sender === "bot" && (
                          <TextToSpeech text={msg.text} />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Copy Button */}
                {msg.sender === "bot" &&
                  !msg.isLoading &&
                  !msg.isError &&
                  msg.text && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <CopyButton text={msg.text} />
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Actions */}
      <div className="border-t border-gray-200 bg-white dark:bg-gray-900 p-6">
     
<div className="flex flex-col sm:flex-row gap-3 items-center">
  <div className="flex-1 relative w-full">
    {/* Input box container */}
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
      
      {/* File upload inside input box */}
      <div className="mr-2 flex-shrink-0">
        <FileUpload onFileSelect={handleFileSelect} />
      </div>

      {/* Text input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none"
      />

      {/* Clear input button */}
      {input && (
        <button
          onClick={() => setInput("")}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          ✕
        </button>
      )}
    </div>

    {/* ✅ File preview appears here below input */}
    {selectedFile && (
      <div className="flex items-center gap-2 text-xs mt-2 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        📎 {selectedFile.name}
        <button
          onClick={() => setSelectedFile(null)}
          className="text-blue-400 hover:text-blue-600"
        >
          ✕
        </button>
      </div>
    )}
  </div>

  {/* Send button */}
  <button
    onClick={sendMessage}
    disabled={(!input.trim() && !selectedFile) || isLoading}
    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
  >
    {isLoading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Sending...
      </>
    ) : (
      <>
        <span>Send</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </>
    )}
  </button>
</div>


        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
  
  {/* Header */}
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <h1 className="text-xl font-bold">AI Assistant</h1>
    </div>

    {/* Right side: Export + Persona + New Chat */}
    <div className="flex items-center gap-3">
      <ChatExport chatRef={chatRef} />
      {persona && (
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{persona}</span>
      )}

      <button
        onClick={() => {
          setMessages([]);
          setInput("");
          setSelectedFile(null);
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
        className="bg-white/20 text-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
        title="Start a new chat"
      >
        <span>🔄</span>
        <span>New Chat</span>
      </button>
    </div>
  </div>

  {/* Messages Container */}
  <div
    ref={chatRef}
    className="h-96 overflow-y-auto p-6 space-y-6 bg-white/80 dark:bg-gray-900/80 scroll-smooth"
  >
    {messages.length === 0 ? (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Ask me anything or upload a file to get started!</p>
          </div>
        </div>
      </div>
    ) : (
      messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group relative`}
        >
          <div
            className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
              msg.sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                : msg.isError
                ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
            }`}
          >
            <div className="flex items-start gap-3">
              {msg.sender === "bot" && !msg.isError && (
                <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-0.5 flex-shrink-0">
                  AI
                </div>
              )}
              {msg.sender === "user" && (
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  You
                </div>
              )}
              <div className="flex-1 min-w-0">
                {msg.isLoading ? (
                  <div className="flex space-x-2 py-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                    {msg.sender === "bot" && !msg.isError && (
                      <div className="flex-shrink-0">
                        <TextToSpeech text={msg.text} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Copy Button */}
            {msg.sender === "bot" && !msg.isLoading && !msg.isError && msg.text && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CopyButton text={msg.text} />
              </div>
            )}
          </div>
        </div>
      ))
    )}
    <div ref={messagesEndRef} />
  </div>

  {/* Input & Actions */}
  <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="flex-1 relative w-full">
        {/* Input box container */}
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 shadow-sm">
          
          {/* File upload inside input box */}
          <div className="mr-3 flex-shrink-0">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Text input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-base"
          />

          {/* Clear input button */}
          {input && (
            <button
              onClick={() => setInput("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-3 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Clear input"
            >
              ✕
            </button>
          )}
        </div>

        {/* File preview appears below input */}
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span>📎</span>
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              title="Remove file"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Send button */}
      <button
        onClick={sendMessage}
        disabled={(!input.trim() && !selectedFile) || isLoading}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0 min-w-[120px] justify-center"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </>
        )}
      </button>
    </div>

    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
      Press Enter to send • Shift + Enter for new line
    </p>
  </div>
</div>
    </>
    
  );
}