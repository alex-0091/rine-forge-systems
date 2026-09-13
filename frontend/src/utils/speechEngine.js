/**
 * FORGE Universal Free Speech-to-Text & Text-to-Speech Engine ($0 Spent)
 * 100% Client-Side Web Speech API & Web Audio API
 * - Zero API keys required
 * - Zero logins or payment obstacles
 * - Real-time speech transcription (SpeechRecognition / webkitSpeechRecognition)
 * - Natural text-to-speech audio synthesis (window.speechSynthesis)
 */

export class ForgeSpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  /**
   * Check if speech recognition is supported in current browser
   */
  isSupported() {
    return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start listening for voice input
   */
  startListening({ onResult, onStart, onEnd, onError }) {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (onResult) {
          onResult({
            text: finalTranscript || interimTranscript,
            isFinal: !!finalTranscript
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn('Speech recognition error event:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      console.warn('Speech start error:', err);
      if (onError) onError(err.message || 'Microphone access denied or busy.');
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Speech stop error:', e);
      }
    }
    this.isListening = false;
  }

  /**
   * Text-to-Speech audio synthesis using browser native voices
   */
  speak(text, { accent = 'en-US', rate = 1.0, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onError) onError('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = accent.includes('British') ? 'en-GB' : accent.includes('Australian') ? 'en-AU' : 'en-US';

    // Pick natural voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Premium')));
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Cancel any playing speech
   */
  stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechEngine = new ForgeSpeechEngine();
