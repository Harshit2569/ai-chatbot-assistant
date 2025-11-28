

"use client";

import { useState, useEffect } from "react";
import ChatUI from "./components/ChatUi";
import { PersonaSelector } from "./components/PersonalSelector";


export default function Home() {
  const [persona, setPersona] = useState<string>("Teacher");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-6 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <div
      className={`text-center mb-12 sm:mb-16 transition-all duration-700 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5 relative">
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-2xl sm:text-3xl">🤖</span>
          </div>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
          AI Chat Assistant
        </h1>
      </div>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-2">
        Experience intelligent conversations with different AI personalities. 
        Choose a persona and start chatting with your personal AI companion!
      </p>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
      {/* Sidebar (moves on top in mobile) */}
      <div className="lg:col-span-1 order-1 lg:order-none">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-5 border border-white/20 dark:border-gray-700/20 transition-colors duration-300">
          {/* Persona Selection */}
        <div className="mb-5 sm:mb-6">
  {/* Header (visible on larger screens only, hidden on mobile because PersonaSelector has its own header) */}
  <div className="hidden sm:flex items-center justify-between mb-3">
    <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
      Personas
    </h2>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
  </div>

  {/* Persona Selector Component (now handles mobile header + toggle itself) */}
  <PersonaSelector persona={persona} setPersona={setPersona} />
</div>

          {/* Active Persona */}
          <div className="mb-5 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {persona.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white dark:border-gray-800"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                  {persona}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {getPersonaDescription(persona)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Quick Tips
            </h3>
            <div className="space-y-2">
              {[
                { icon: "💡", text: "Be specific with questions" },
                { icon: "🔄", text: "Switch personas for different views" },
                { icon: "🎯", text: "Use examples to guide AI" },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-500 transition-colors duration-300"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50 rounded flex items-center justify-center text-purple-600 dark:text-purple-300 text-xs flex-shrink-0">
                    {tip.icon}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight flex-1">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 order-2">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/20 transition-colors duration-300">
          <ChatUI persona={persona} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {[
            {
              icon: "⚡",
              title: "Fast",
              description: "Instant AI responses",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              icon: "🎭",
              title: "Personas",
              description: "Multiple AI personalities",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: "🔒",
              title: "Secure",
              description: "Privacy first approach",
              gradient: "from-green-500 to-blue-500",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white text-base sm:text-lg mb-2 sm:mb-3 shadow-sm`}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { number: "99.9%", label: "Uptime" },
            { number: "24/7", label: "Active" },
            { number: "50ms", label: "Speed" },
            { number: "5★", label: "Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors duration-300"
            >
              <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="text-center mt-12 sm:mt-16 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 flex-wrap">
        {["🚀", "✨", "🎯", "💫"].map((emoji, index) => (
          <div
            key={index}
            className="text-xl sm:text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
          >
            {emoji}
          </div>
        ))}
      </div>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        Powered by Advanced AI • Built with Modern Web Technologies • Secure & Reliable
      </p>
    </div>
  </div>

  <style jsx>{`
    .bg-size-200 {
      background-size: 200% 200%;
    }
    .animate-gradient {
      animation: gradient 3s ease infinite;
    }
    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `}</style>
</main>

  
    </>
    
  );
}

// Enhanced helper function for persona descriptions
function getPersonaDescription(persona: string): string {
  const descriptions: { [key: string]: string } = {
    "Teacher": "Patient, explanatory, and great for learning complex topics with detailed examples",
    "Assistant": "Helpful, efficient, and perfect for everyday tasks and productivity",
    "Coach": "Motivational, goal-oriented, and excellent for personal development",
    "Consultant": "Analytical, strategic, and ideal for business insights and planning",
    "Friend": "Casual, empathetic, and wonderful for relaxed conversations and support",
    "Expert": "Technical, precise, and perfect for specialized knowledge and deep dives",
    "Creative": "Imaginative, innovative, and great for brainstorming and artistic projects"
  };
  return descriptions[persona] || "Specialized AI assistant tailored to your needs";
}