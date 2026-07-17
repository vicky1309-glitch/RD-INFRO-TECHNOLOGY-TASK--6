import { useState, useRef, useCallback, useEffect } from "react";

// Wraps the browser's SpeechRecognition API to power voice search
// ("Weather in London") and a lightweight voice assistant
// ("Will it rain tomorrow?").
export default function useVoiceSearch({ onResult } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onResult) onResult(text);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setListening(true);
    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  return { listening, transcript, supported, startListening, stopListening };
}

// Parses simple voice commands like "weather in London" or
// "will it rain tomorrow" into a structured intent.
export function parseVoiceCommand(text) {
  const lower = text.toLowerCase().trim();

  const cityMatch = lower.match(/weather (?:in|for|at) (.+)/);
  if (cityMatch) {
    return { intent: "SEARCH_CITY", city: cityMatch[1].trim() };
  }

  if (lower.includes("rain")) {
    return { intent: "ASK_RAIN" };
  }

  if (lower.includes("hot") || lower.includes("temperature")) {
    return { intent: "ASK_TEMPERATURE" };
  }

  return { intent: "SEARCH_CITY", city: lower };
}
