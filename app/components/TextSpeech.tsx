"use client";
import React from "react";

interface TTSProps {
  text: string;
}

export default function TextToSpeech({ text }: TTSProps) {
  const speak = () => {
    if (!window.speechSynthesis) return alert("Text-to-speech not supported");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="ml-2 text-sm text-blue-600 hover:text-blue-800"
      title="Play voice"
    >
      🔊
    </button>
  );
}
