import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, PhoneCall, PhoneOff, ArrowRight, CheckCircle2, 
  AlertCircle, Sparkles, RefreshCw, Volume2, ShieldCheck, UserCheck, 
  HelpCircle, MessageSquare, Clock, Zap
} from 'lucide-react';
import { VoiceOrb } from './VoiceOrb';

export function VoiceLiveInterface({ businessId, onCallEnded }) {
  const [session, setSession] = useState(null);
  const [orbState, setOrbState] = useState('IDLE'); // IDLE, LISTENING, THINKING, SPEAKING, TRANSFER_REQUIRED, ERROR
  const [transcript, setTranscript] = useState([]);
  const [toolLogs, setToolLogs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [handoffNotice, setHandoffNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  const recognitionRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Check Web Speech API Support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setMicSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'en-US';

        recog.onstart = () => {
          setIsMicActive(true);
          setOrbState('LISTENING');
        };

        recog.onresult = (event) => {
          const spoken = event.results[0][0].transcript;
          setIsMicActive(false);
          if (spoken) {
            handleProcessTurn(spoken);
          }
        };

        recog.onerror = (e) => {
          console.warn('Speech recognition error:', e.error);
          setIsMicActive(false);
          setOrbState('IDLE');
        };

        recog.onend = () => {
          setIsMicActive(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, [session]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Speech Synthesis Helper
  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setOrbState('SPEAKING');
      utterance.onend = () => setOrbState('IDLE');
      utterance.onerror = () => setOrbState('IDLE');

      // Pick natural female voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google US')));
      if (naturalVoice) utterance.voice = naturalVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Voice Session
  const handleStartCall = async () => {
    setLoading(true);
    setHandoffNotice(null);
    setToolLogs([]);
    try {
      const res = await fetch('/api/v1/channels/voice/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'receptionist',
          channel: 'BROWSER',
          caller_identifier: 'Guest-Browser'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSession(data);
        setOrbState('SPEAKING');
        setTranscript([{ role: 'agent', text: data.greeting, timestamp: new Date().toLocaleTimeString() }]);
        speakText(data.greeting);
      } else {
        setOrbState('ERROR');
      }
    } catch (e) {
      console.error('Failed to start voice session', e);
      setOrbState('ERROR');
    } finally {
      setLoading(false);
    }
  };

  // Process Conversational Turn
  const handleProcessTurn = async (spokenText) => {
    if (!session || !spokenText.trim()) return;

    const userMsg = spokenText.trim();
    setInputText('');
    setOrbState('THINKING');
    setTranscript(prev => [...prev, { role: 'customer', text: userMsg, timestamp: new Date().toLocaleTimeString() }]);

    try {
      const res = await fetch(`/api/v1/channels/voice/session/${session.session_id}/turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_transcript: userMsg })
      });

      if (res.ok) {
        const data = await res.json();
        setTranscript(prev => [...prev, { role: 'agent', text: data.agent_reply, timestamp: new Date().toLocaleTimeString() }]);

        if (data.tool_calls && data.tool_calls.length > 0) {
          setToolLogs(prev => [...prev, ...data.tool_calls]);
        }

        if (data.status === 'TRANSFER_REQUIRED') {
          setOrbState('TRANSFER_REQUIRED');
          setHandoffNotice(data.notice || 'Human handoff triggered');
        } else {
          speakText(data.agent_reply);
        }
      } else {
        setOrbState('ERROR');
      }
    } catch (e) {
      console.error('Turn processing failed', e);
      setOrbState('ERROR');
    }
  };

  // Request Human Handoff
  const handleRequestHandoff = async () => {
    if (!session) return;
    setOrbState('THINKING');
    try {
      const res = await fetch(`/api/v1/channels/voice/session/${session.session_id}/handoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Caller clicked Human Handoff button' })
      });

      if (res.ok) {
        const data = await res.json();
        setOrbState('TRANSFER_REQUIRED');
        setHandoffNotice(data.notice);
        setTranscript(prev => [...prev, { role: 'agent', text: data.agent_reply, timestamp: new Date().toLocaleTimeString() }]);
        speakText(data.agent_reply);
      }
    } catch (e) {
      console.error('Handoff error', e);
    }
  };

  // End Voice Session
  const handleEndCall = async () => {
    if (!session) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current && isMicActive) {
      recognitionRef.current.stop();
    }

    try {
      await fetch(`/api/v1/channels/voice/session/${session.session_id}/end`, {
        method: 'POST'
      });
    } catch (e) {
      console.error('End call error', e);
    }

    setSession(null);
    setOrbState('IDLE');
    setIsMicActive(false);
    if (onCallEnded) onCallEnded();
  };

  // Toggle Microphone Listening
  const toggleMicrophone = () => {
    if (!session) return;
    if (isMicActive) {
      recognitionRef.current?.stop();
      setIsMicActive(false);
      setOrbState('IDLE');
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn('Mic start failed, already running?', e);
      }
    }
  };

  return (
    <div className="bg-[#0e1320]/85 backdrop-blur-2xl rounded-3xl border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              VOICE ENGINE V5
            </span>
            <span className="text-xs font-semibold text-slate-400">• Provider: Web Speech + Neural AI</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Elena — Interactive AI Voice Receptionist
          </h2>
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-2">
          {!session ? (
            <button
              onClick={handleStartCall}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
              <span>Start Live Voice Call</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-soft transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Col: Organic Voice Orb (5 Cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-center space-y-4">
          <VoiceOrb state={orbState} />

          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Orb State: <span className="text-indigo-400 font-black">{orbState}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {orbState === 'IDLE' && 'Awaiting speech or typed inquiry.'}
              {orbState === 'LISTENING' && 'Listening through microphone...'}
              {orbState === 'THINKING' && 'Checking business knowledge & tools...'}
              {orbState === 'SPEAKING' && 'Streaming voice response...'}
              {orbState === 'TRANSFER_REQUIRED' && 'Routing to human operator.'}
            </div>
          </div>

          {/* Microphone Capture Button (When in Session) */}
          {session && (
            <div className="pt-2 flex items-center gap-2">
              {micSupported ? (
                <button
                  onClick={toggleMicrophone}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isMicActive
                      ? 'bg-cyan-500 text-white animate-pulse shadow-glow-blue'
                      : 'bg-white/[0.05] border border-white/[0.12] text-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isMicActive ? 'Listening (Speak Now)' : 'Click to Speak'}</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Mic access not supported; use text input below</span>
              )}

              <button
                onClick={handleRequestHandoff}
                className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-amber-400 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                title="Request operator transfer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Human Handoff</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Live Dialogue Transcript & Tool Telemetry (7 Cols) */}
        <div className="md:col-span-7 flex flex-col h-[340px] rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-3">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Live Turn Transcript
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {session ? 'LIVE DIALOGUE' : 'READY TO CONNECT'}
            </span>
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                <Volume2 className="w-8 h-8 text-slate-500" />
                <div>No active conversation. Click "Start Live Voice Call" to talk to Elena.</div>
              </div>
            ) : (
              transcript.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col ${msg.role === 'customer' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] font-mono text-slate-400 mb-0.5 px-1">
                    {msg.role === 'customer' ? 'You (Caller)' : 'Elena (AI Receptionist)'} • {msg.timestamp}
                  </div>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.role === 'customer'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                        : 'bg-white/[0.05] border border-white/[0.09] text-slate-200 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Tool Execution Logs Stream */}
          {toolLogs.length > 0 && (
            <div className="pt-2 border-t border-white/[0.08] mt-2">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Grounded Tool Executions:
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto">
                {toolLogs.map((tl, tidx) => (
                  <span 
                    key={tidx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-mono font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    {tl.tool}: {JSON.stringify(tl.result).slice(0, 35)}...
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Truthful Handoff Alert */}
          {handoffNotice && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Handoff Notice:</span> {handoffNotice}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spoken Text / Input Bar */}
      {session && (
        <form 
          onSubmit={(e) => { e.preventDefault(); handleProcessTurn(inputText); }}
          className="pt-2 flex items-center gap-2 border-t border-white/[0.08]"
        >
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your response or question (e.g. 'Are you open Saturday? Can I book at 3 PM?')..."
            className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all disabled:opacity-40"
          >
            <span>Send Turn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
