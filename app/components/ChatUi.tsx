
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

// export default function ChatUI({ persona }: ChatUIProps) {
//   const [input, setInput] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<{ name: string; text: string } | null>(null);

//   // Initialize with empty array on server, use chat memory only on client
//   const [messages, setMessages] = useChatMemory<Message[]>("chat-history", []);
//   const chatRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//   // Set mounted state and scroll to bottom
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (isMounted) {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, isMounted]);

 
//   const sendMessage = async () => {
//   if ((!input.trim() && !selectedFile) || isLoading) return;

//   setIsLoading(true);

//   // Prepare message content
//   const userMessage = selectedFile
//     ? `📎 Uploaded ${selectedFile.name}: ${selectedFile.text.slice(0, 300)}...`
//     : input;

//   // Optimistic UI update (instant feedback)
//   setMessages((prev) => [
//     ...prev,
//     { sender: "user", text: userMessage },
//     { sender: "bot", text: "", isLoading: true },
//   ]);

//   // Clear input and file preview
//   setInput("");
//   setSelectedFile(null);

//   try {
//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         message: userMessage,
//         persona,
//       }),
//     });

//     const data = await res.json();

//     setMessages((prev) => [
//       ...prev.slice(0, -1),
//       { sender: "bot", text: data.reply, isLoading: false },
//     ]);
//   } catch (error) {
//     console.error("Chat API error:", error);
//     setMessages((prev) => [
//       ...prev.slice(0, -1),
//       {
//         sender: "bot",
//         text: "⚠️ Sorry, I encountered an error. Please try again.",
//         isError: true,
//       },
//     ]);
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Handle uploaded file
//   // const handleFileSelect = (text: string, fileName: string) => {
//   //   setMessages((prev) => [
//   //     ...prev,
//   //     { sender: "user", text: `Uploaded ${fileName}: ${text.slice(0, 300)}...` },
//   //   ]);
//   // };
//   const handleFileSelect = (text: string, fileName: string) => {
//   // Save the selected file to preview and send later
//   setSelectedFile({ name: fileName, text });

 
// };


//   // Show loading state during SSR and initial hydration
//   if (!isMounted) {
//     return (
//       <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//             <h1 className="text-xl font-bold">AI Assistant</h1>
//           </div>
//           <div className="flex items-center gap-3">
//             {persona && (
//               <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
//                 {persona}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Messages Container - Loading State */}
//         <div className="h-96 overflow-y-auto p-6 space-y-4 bg-white/80 dark:bg-gray-900/80">
//           <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
//             <div className="text-center">
//               <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
//                 <span className="text-2xl">💬</span>
//               </div>
//               <p className="text-lg font-medium">Loading chat...</p>
//               <p className="text-sm">Please wait</p>
//             </div>
//           </div>
//         </div>

//         {/* Input & Actions - Loading State */}
//         <div className="border-t border-gray-200 bg-white dark:bg-gray-900 p-6">
//           <div className="flex flex-col sm:flex-row gap-3 items-center">
//             <div className="flex-1 relative w-full">
//               <input
//                 disabled
//                 placeholder="Loading..."
//                 className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-500"
//               />
//             </div>
//             <button
//               disabled
//               className="bg-gray-400 text-white px-6 py-3 rounded-2xl font-medium cursor-not-allowed flex items-center gap-2"
//             >
//               <span>Loading...</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
    
//     <div className="hidden w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
  
//   {/* Header */}
//   <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex items-center justify-between">
//     <div className="flex items-center gap-3">
//       <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//       <h1 className="text-xl font-bold">AI Assistant</h1>
//     </div>

//     {/* Right side: Export + Persona + New Chat */}
//     <div className="flex items-center gap-3">
//       <ChatExport chatRef={chatRef} />
//       {persona && (
//         <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{persona}</span>
//       )}

//       <button
//         onClick={() => {
//           setMessages([]);
//           setInput("");
//           setSelectedFile(null);
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }}
//         className="bg-white/20 text-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
//         title="Start a new chat"
//       >
//         <span>🔄</span>
//         <span>New Chat</span>
//       </button>
//     </div>
//   </div>

//   {/* Messages Container */}
//   <div
//     ref={chatRef}
//     className="h-96 overflow-y-auto p-6 space-y-6 bg-white/80 dark:bg-gray-900/80 scroll-smooth"
//   >
//     {messages.length === 0 ? (
//       <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
//         <div className="text-center space-y-4">
//           <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
//             <span className="text-3xl">💬</span>
//           </div>
//           <div className="space-y-2">
//             <p className="text-lg font-medium">Start a conversation</p>
//             <p className="text-sm">Ask me anything or upload a file to get started!</p>
//           </div>
//         </div>
//       </div>
//     ) : (
//       messages.map((msg, index) => (
//         <div
//           key={index}
//           className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group relative`}
//         >
//           <div
//             className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
//               msg.sender === "user"
//                 ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
//                 : msg.isError
//                 ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none"
//                 : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
//             }`}
//           >
//             <div className="flex items-start gap-3">
//               {msg.sender === "bot" && !msg.isError && (
//                 <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-xs text-white font-bold mt-0.5 flex-shrink-0">
//                   AI
//                 </div>
//               )}
//               {msg.sender === "user" && (
//                 <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
//                   You
//                 </div>
//               )}
//               <div className="flex-1 min-w-0">
//                 {msg.isLoading ? (
//                   <div className="flex space-x-2 py-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 ) : (
//                   <div className="flex items-start gap-2">
//                     <div className="flex-1">
//                       <p className="whitespace-pre-wrap break-words">{msg.text}</p>
//                     </div>
//                     {msg.sender === "bot" && !msg.isError && (
//                       <div className="flex-shrink-0">
//                         <TextToSpeech text={msg.text} />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Copy Button */}
//             {msg.sender === "bot" && !msg.isLoading && !msg.isError && msg.text && (
//               <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <CopyButton text={msg.text} />
//               </div>
//             )}
//           </div>
//         </div>
//       ))
//     )}
//     <div ref={messagesEndRef} />
//   </div>

//   {/* Input & Actions */}
//   <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
//     <div className="flex flex-col sm:flex-row gap-4 items-start">
//       <div className="flex-1 relative w-full">
//         {/* Input box container */}
//         <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 shadow-sm">
          
//           {/* File upload inside input box */}
//           <div className="mr-3 flex-shrink-0">
//             <FileUpload onFileSelect={handleFileSelect} />
//           </div>

//           {/* Text input */}
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message..."
//             disabled={isLoading}
//             className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-base"
//           />

//           {/* Clear input button */}
//           {input && (
//             <button
//               onClick={() => setInput("")}
//               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-3 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//               title="Clear input"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         {/* File preview appears below input */}
//         {selectedFile && (
//           <div className="flex items-center gap-2 text-sm mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
//             <span>📎</span>
//             <span className="flex-1 truncate">{selectedFile.name}</span>
//             <button
//               onClick={() => setSelectedFile(null)}
//               className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
//               title="Remove file"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Send button */}
//       <button
//         onClick={sendMessage}
//         disabled={(!input.trim() && !selectedFile) || isLoading}
//         className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0 min-w-[120px] justify-center"
//       >
//         {isLoading ? (
//           <>
//             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             <span>Sending...</span>
//           </>
//         ) : (
//           <>
//             <span>Send</span>
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//               />
//             </svg>
//           </>
//         )}
//       </button>
//     </div>

//     <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
//       Press Enter to send • Shift + Enter for new line
//     </p>
//   </div>
// </div>

// {/* Chat Container */}
// <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

//   {/* Header */}
//   <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
//     <div className="flex items-center gap-2 sm:gap-3">
//       <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
//       <h1 className="text-lg sm:text-xl font-bold">AI Assistant</h1>
//     </div>

//     {/* Right side: Export + Persona + New Chat */}
//     <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//       <ChatExport chatRef={chatRef} />
//       {persona && (
//         <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
//           {persona}
//         </span>
//       )}

//       <button
//         onClick={() => {
//           setMessages([]);
//           setInput("");
//           setSelectedFile(null);
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }}
//         className="bg-white/20 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-1 sm:gap-2"
//         title="Start a new chat"
//       >
//         <span>🔄</span>
//         <span>New Chat</span>
//       </button>
//     </div>
//   </div>

//   {/* Messages Container */}
//   <div
//     ref={chatRef}
//     className="h-[70vh] sm:h-96 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white/80 dark:bg-gray-900/80 scroll-smooth"
//   >
//     {messages.length === 0 ? (
//       <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
//         <div className="text-center space-y-3 sm:space-y-4">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
//             <span className="text-2xl sm:text-3xl">💬</span>
//           </div>
//           <div className="space-y-1 sm:space-y-2">
//             <p className="text-base sm:text-lg font-medium">Start a conversation</p>
//             <p className="text-sm">Ask me anything or upload a file to get started!</p>
//           </div>
//         </div>
//       </div>
//     ) : (
//       messages.map((msg, index) => (
//         <div
//           key={index}
//           className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group relative`}
//         >
//           <div
//             className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 shadow-sm relative text-sm sm:text-base ${
//               msg.sender === "user"
//                 ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
//                 : msg.isError
//                 ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none"
//                 : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
//             }`}
//           >
//             <div className="flex items-start gap-2 sm:gap-3">
//               {msg.sender === "bot" && !msg.isError && (
//                 <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-[10px] sm:text-xs text-white font-bold mt-0.5 flex-shrink-0">
//                   AI
//                 </div>
//               )}
//               {msg.sender === "user" && (
//                 <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold mt-0.5 flex-shrink-0">
//                   You
//                 </div>
//               )}
//               <div className="flex-1 min-w-0">
//                 {msg.isLoading ? (
//                   <div className="flex space-x-1 sm:space-x-2 py-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                   </div>
//                 ) : (
//                   <div className="flex items-start gap-1 sm:gap-2">
//                     <div className="flex-1">
//                       <p className="whitespace-pre-wrap break-words">{msg.text}</p>
//                     </div>
//                     {msg.sender === "bot" && !msg.isError && (
//                       <div className="flex-shrink-0">
//                         <TextToSpeech text={msg.text} />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Copy Button */}
//             {msg.sender === "bot" && !msg.isLoading && !msg.isError && msg.text && (
//               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <CopyButton text={msg.text} />
//               </div>
//             )}
//           </div>
//         </div>
//       ))
//     )}
//     <div ref={messagesEndRef} />
//   </div>

//   {/* Input & Actions */}
//   <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
//     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start">
//       <div className="flex-1 relative w-full">
//         {/* Input box container */}
//         <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 shadow-sm">
          
//           {/* File upload inside input box */}
//           <div className="mr-2 sm:mr-3 flex-shrink-0">
//             <FileUpload onFileSelect={handleFileSelect} />
//           </div>

//           {/* Text input */}
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message..."
//             disabled={isLoading}
//             className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-sm sm:text-base"
//           />

//           {/* Clear input button */}
//           {input && (
//             <button
//               onClick={() => setInput("")}
//               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2 sm:ml-3 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//               title="Clear input"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         {/* File preview below input */}
//         {selectedFile && (
//           <div className="flex items-center gap-2 text-xs sm:text-sm mt-2 sm:mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
//             <span>📎</span>
//             <span className="flex-1 truncate">{selectedFile.name}</span>
//             <button
//               onClick={() => setSelectedFile(null)}
//               className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
//               title="Remove file"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Send button */}
//       <button
//         onClick={sendMessage}
//         disabled={(!input.trim() && !selectedFile) || isLoading}
//         className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
//       >
//         {isLoading ? (
//           <>
//             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             <span>Sending...</span>
//           </>
//         ) : (
//           <>
//             <span>Send</span>
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//               />
//             </svg>
//           </>
//         )}
//       </button>
//     </div>

//     <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 sm:mt-4">
//       Press <kbd className="font-semibold">Enter</kbd> to send •{" "}
//       <kbd className="font-semibold">Shift + Enter</kbd> for new line
//     </p>
//   </div>
// </div>

//     </>
    
//   );
// }
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

  const handleFileSelect = (text: string, fileName: string) => {
    setSelectedFile({ name: fileName, text });
  };

  // Show loading state during SSR and initial hydration
  if (!isMounted) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-black font-semibold text-lg">AI Chat</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="h-96 p-6 bg-white flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-lg font-medium">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {/* Header - Simple Style */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h2 className="text-black font-semibold text-lg">AI Chat Assistant</h2>
              <p className="text-gray-500 text-sm">Ask me anything</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatRef}
        className="h-[500px] overflow-y-auto p-6 space-y-4 bg-white scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Start a conversation</h3>
            <p className="text-gray-500 text-center max-w-md">
              I'm here to help! Ask me anything or upload a file to get started.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group relative`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 relative ${
                  msg.sender === "user"
                    ? "bg-black text-white rounded-br-none"
                    : msg.isError
                    ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none"
                    : "bg-gray-100 text-black border border-gray-200 rounded-bl-none"
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.sender === "bot" && !msg.isError && (
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                      AI
                    </div>
                  )}
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                      You
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {msg.isLoading ? (
                      <div className="flex space-x-2 py-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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

      {/* Input Area - Simple Style */}
      <div className="bg-white px-6 py-4 border-t border-gray-200">
        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm mb-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <span>📎</span>
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-100"
              title="Remove file"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-3">
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
            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={(!input.trim() && !selectedFile) || isLoading}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "Help me code",
            "Explain this",
            "Fix this bug",
            "Optimize this"
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => setInput(action)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg border border-gray-300 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
