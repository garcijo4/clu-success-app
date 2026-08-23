'use client';

// Text-to-speech via the browser's built-in Web Speech API.
// Notes (design plan §4.1):
//  - Speech must be started by a user gesture (iOS Safari refuses otherwise).
//  - getVoices() populates asynchronously; subscribe to `voiceschanged`.
//  - Always cancel() on flip / card change / unmount so utterances don't stack.

import { useCallback, useEffect, useState } from 'react';

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!speechSupported()) return;
    setSupported(true);
    // Touch getVoices() so the list is warm by the time the student taps.
    const warm = () => window.speechSynthesis.getVoices();
    warm();
    window.speechSynthesis.addEventListener('voiceschanged', warm);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', warm);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!speechSupported()) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!speechSupported() || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const toggle = useCallback(
    (text: string) => (speaking ? stop() : speak(text)),
    [speaking, speak, stop],
  );

  return { supported, speaking, speak, stop, toggle };
}
