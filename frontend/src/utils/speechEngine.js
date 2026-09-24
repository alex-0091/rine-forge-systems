/**
 * FORGE Universal Free Speech-to-Text & Text-to-Speech Engine ($0 Spent)
 * 100% Free Forever Architecture:
 * Tier 1: Free Neural Edge AI TTS (Broadcast-grade human neural voice via /api/voice/synthesize)
 * Tier 2: Instant Client-Side Web Speech API (zero-latency, unfreezable browser fallback)
 * - Zero API keys required
 * - Zero logins or payment obstacles
 * - Real-time speech transcription (SpeechRecognition / webkitSpeechRecognition)
 * - Natural text-to-speech audio synthesis with studio inflections
 */

export class ForgeSpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentAudio = null;
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
   * Speak text using Tier 1 Free Neural AI TTS, falling back cleanly to Tier 2 Web Speech
   */
  async speak(text, { voice = 'elena', accent = 'en-US', rate = 1.0, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (!text || !text.trim()) return;

    // Stop any ongoing playback
    this.stopSpeaking();

    // Tier 1: Try Backend Free Neural Edge AI TTS
    let neuralAudioPlayed = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s fast timeout

      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.audio_base64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
          this.currentAudio = audio;

          audio.onplay = () => {
            if (onStart) onStart();
          };
          audio.onended = () => {
            this.currentAudio = null;
            if (onEnd) onEnd();
          };
          audio.onerror = (err) => {
            console.warn('Neural audio playback error, falling back to Web Speech:', err);
            this.currentAudio = null;
            this._speakFallback(text, { accent, rate, pitch, onStart, onEnd, onError });
          };

          await audio.play();
          neuralAudioPlayed = true;
          return;
        }
      }
    } catch (e) {
      // Backend not running or timeout; fall through to Tier 2
      // console.debug('Neural TTS unavailable, using native browser speech:', e.message);
    }

    // Tier 2: Instant Client-Side Web Speech Fallback (Unfreezable)
    if (!neuralAudioPlayed) {
      this._speakFallback(text, { accent, rate, pitch, onStart, onEnd, onError });
    }
  }

  /**
   * Tier 2: Browser Native Web Speech Fallback
   */
  _speakFallback(text, { accent = 'en-US', rate = 1.0, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onError) onError('Text-to-speech is not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = accent.includes('British') ? 'en-GB' : accent.includes('Australian') ? 'en-AU' : 'en-US';

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
        console.warn('Web speech synthesis error:', e);
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Fallback speech error:', err);
      if (onError) onError(err);
      if (onEnd) onEnd();
    }
  }

  /**
   * Cancel any playing speech (both HTML5 Audio and Web Speech)
   */
  stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }
}

export const speechEngine = new ForgeSpeechEngine();
