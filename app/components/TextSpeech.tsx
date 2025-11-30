"use client";
import React, { useState, useEffect } from "react";

interface TTSProps {
  text: string;
}

export default function TextToSpeech({ text }: TTSProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!window.speechSynthesis) {
      return alert("Text-to-speech not supported");
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 1;
    newUtterance.pitch = 1;
    
    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => setIsSpeaking(false);
    newUtterance.onerror = () => setIsSpeaking(false);

    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  };

  const stopSpeaking = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
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
      className="ml-2 mb-5 text-sm text-blue-600 hover:text-blue-800"
      title={isSpeaking ? "Stop voice" : "Play voice"}
    >
      {isSpeaking ? "🔇" : "🔊"}
    </button>
  );
}