import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Bot, Palette, Lightbulb, FileText, 
  BarChart2, Layout, Mail, MessageSquare, Cpu, 
  Copy, Check, ArrowRight, RefreshCw, Download, 
  Zap, ShieldCheck, DollarSign, ChevronRight, Layers,
  Flame, TrendingUp, CheckCircle2, Lock, Search,
  Mic, MicOff, Volume2, VolumeX, Code2, ScanText, Users, Globe2, QrCode,
  Terminal, Play, Sliders, Wand2, Image, Scissors, Share2, Award,
  FileCheck, Video, Send, Bookmark, Star, ArrowUpRight, Compass
} from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

export const ALL_FORGE_TOOLS = [
  {
    id: 'image-studio',
    name: 'AI Image Studio & Vector Art Generator',
    category: '🎨 Image & Creative',
    icon: Image,
    badge: 'CANVAS ART ENGINE',
    popular: true,
    description: 'Generates high-res digital art, vector emblems, isometric scenes, and 3D illustrations with instant PNG & SVG export.'
  },
  {
    id: 'bg-remover',
    name: 'AI Background Remover & Magic Cutout',
    category: '🎨 Image & Creative',
    icon: Scissors,
    badge: 'INSTANT CUTOUT',
    popular: true,
    description: 'Instant client-side background remover with clean edge masking, transparent PNG download, and backdrop color switcher.'
  },
  {
    id: 'prompt-enhancer',
    name: 'AI Super-Prompt Magic Enhancer',
    category: '✍️ Writing & Viral',
    icon: Wand2,
    badge: 'PROMPT ARCHITECT',
    popular: true,
    description: 'Transforms simple 3-word thoughts into elite Master Prompts for Midjourney v6, ChatGPT-4o, and Claude 3.5 Sonnet.'
  },
  {
    id: 'viral-copywriter',
    name: 'AI Viral Social & Hook Architect',
    category: '✍️ Writing & Viral',
    icon: Flame,
    badge: 'VIRAL REACH',
    popular: true,
    description: 'Generates high-engagement Twitter/X threads, LinkedIn authority carousels, TikTok/Reels hooks, and marketing copy.'
  },
  {
    id: 'video-summarizer',
    name: 'AI YouTube & Video Instant Summarizer',
    category: '✍️ Writing & Viral',
    icon: Video,
    badge: 'TL;DR IN 1 SEC',
    popular: true,
    description: 'Paste any video URL or transcript to get 5-bullet executive takeaways, key timestamped chapters, and action checklists.'
  },
  {
    id: 'resume-architect',
    name: 'AI Executive Resume & Cover Letter Polisher',
    category: '💼 Business & Strategy',
    icon: Award,
    badge: 'CAREER ACCELERATOR',
    popular: true,
    description: 'Turns raw experience bullets into quantified, high-impact resume accomplishments and persuasive cover letters.'
  },
  {
    id: 'voice-clone',
    name: 'VoiceClone AI Speech & Waveform Studio',
    category: '🎙️ Audio & Voice',
    icon: Mic,
    badge: 'NEURAL AUDIO',
    popular: true,
    description: 'Real-time microphone speech dictation and natural multi-accent text-to-speech synthesis with reactive audio waveforms.'
  },
  {
    id: 'code-generator',
    name: 'AI Code & SQL / Regex Architect',
    category: '💻 Code & Dev',
    icon: Code2,
    badge: 'FULL-STACK GEN',
    popular: true,
    description: 'Generates clean Python, React JSX, Node.js scripts, optimized SQL queries, and regex patterns with 1-click copy.'
  },
  {
    id: 'contract-analyzer',
    name: 'AI Contract & Document Clause Analyzer',
    category: '💼 Business & Strategy',
    icon: FileCheck,
    badge: 'LEGAL INTEL',
    popular: false,
    description: 'Extracts critical liabilities, payment milestones, indemnity terms, renewal deadlines, and risk flags from contract text.'
  },
  {
    id: 'logo-designer',
    name: 'Brand & Vector Logo Generator',
    category: '🎨 Image & Creative',
    icon: Palette,
    badge: 'SVG VECTOR ENGINE',
    popular: false,
    description: 'Generates vector logo emblems, tailored hex color palettes, brand manifestos, and typography pairings.'
  },
  {
    id: 'idea-validator',
    name: 'Startup Idea & Market Validator',
    category: '💼 Business & Strategy',
    icon: Lightbulb,
    badge: 'MARKET VIABILITY',
    popular: false,
    description: 'Instant market viability score, ICP persona breakdown, monetization streams, and competitive moat analysis.'
  },
  {
    id: 'outreach-gen',
    name: 'Cold Outreach Sequence Generator',
    category: '✍️ Writing & Viral',
    icon: Mail,
    badge: 'HIGH RESPONSE RATE',
    popular: false,
    description: 'Engineers 3-step high-converting cold email sequences tailored to specific industry pain points and decision-makers.'
  },
  {
    id: 'multi-model-compare',
    name: 'Multi-Model Benchmark (Grok / GPT-4o / Gemini / Claude)',
    category: '💻 Code & Dev',
    icon: Cpu,
    badge: '4x LLM INGEST',
    popular: false,
    description: 'Run your prompt concurrently across GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and Grok-2 side-by-side.'
  },
  {
    id: 'crm-triage',
    name: 'Smart CRM Ticket & Urgency Triage',
    category: '💼 Business & Strategy',
    icon: MessageSquare,
    badge: 'REAL-TIME TRIAGE',
    popular: false,
    description: 'Classifies inbound customer support tickets by urgency level, sentiment score, and produces instant empathetic AI replies.'
  },
  {
    id: 'vision-ocr',
    name: 'VisionOCR Invoice & Receipt Parser',
    category: '💼 Business & Strategy',
    icon: ScanText,
    badge: 'JSON EXTRACTION',
    popular: false,
    description: 'Extracts line items, vendor tax IDs, subtotal figures, and payment terms from invoice text into structured cards.'
  },
  {
    id: 'seo-meta',
    name: 'SEO Meta Tag & OpenGraph Studio',
    category: '💻 Code & Dev',
    icon: Globe2,
    badge: 'SERP & SOCIAL',
    popular: false,
    description: 'Generates SEO titles, meta descriptions, OpenGraph social cards, and JSON-LD structured schema markup.'
  }
];

export const CATEGORIES = [
  '🔥 All All-Stars',
  '🎨 Image & Creative',
  '✍️ Writing & Viral',
  '🎙️ Audio & Voice',
  '💻 Code & Dev',
  '💼 Business & Strategy'
];

export function AIToolsForgeView({ onOpenPaymentModal }) {
  const [selectedCategory, setSelectedCategory] = useState('🔥 All All-Stars');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToolId, setActiveToolId] = useState('image-studio');
  const [copiedKey, setCopiedKey] = useState('');

  // 1. AI Image Studio State
  const [imagePrompt, setImagePrompt] = useState('Futuristic cybernetic crystalline laboratory in neon cyan and gold');
  const [imageStyle, setImageStyle] = useState('3D Isometric Pixar');
  const [imageRatio, setImageRatio] = useState('16:9 Landscape');
  const [imageResult, setImageResult] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // 2. AI Background Remover State
  const [bgSample, setBgSample] = useState('product-watch');
  const [bgColor, setBgColor] = useState('transparent');
  const [bgResult, setBgResult] = useState(null);
  const [bgLoading, setBgLoading] = useState(false);

  // 3. AI Super-Prompt Enhancer State
  const [rawPrompt, setRawPrompt] = useState('A sports car driving in the rain in Tokyo at night');
  const [promptTargetEngine, setPromptTargetEngine] = useState('Midjourney v6');
  const [promptResult, setPromptResult] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);

  // 4. AI Viral Copywriter State
  const [copyTopic, setCopyTopic] = useState('How 24/7 autonomous AI receptionists save dental clinics $45,000/year in missed appointments');
  const [copyPlatform, setCopyPlatform] = useState('LinkedIn Authority Post');
  const [copyResult, setCopyResult] = useState(null);
  const [copyLoading, setCopyLoading] = useState(false);

  // 5. AI Video Summarizer State
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [videoResult, setVideoResult] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // 6. AI Resume Architect State
  const [resumeRole, setResumeRole] = useState('Senior Operations Director');
  const [resumeRawPoints, setResumeRawPoints] = useState('Managed 15 person customer support team. Reduced wait times. Installed new CRM software. Saved budget.');
  const [resumeResult, setResumeResult] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // 7. VoiceClone State
  const [voiceText, setVoiceText] = useState('Welcome to Vance Medical Group. Dr. Rivera is available this Friday at 3 PM. Would you like me to lock in this reservation?');
  const [voiceAccent, setVoiceAccent] = useState('Executive American (Neutral-Calm)');
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [isDictatingVoice, setIsDictatingVoice] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);

  // 8. Code Generator State
  const [codePrompt, setCodePrompt] = useState('FastAPI endpoint with rate limiting and JWT auth for async user profile query');
  const [codeLanguage, setCodeLanguage] = useState('Python (FastAPI + Async)');
  const [codeResult, setCodeResult] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);

  // 9. Contract Analyzer State
  const [contractText, setContractText] = useState("MASTER SERVICES AGREEMENT\nSection 4. Payment Terms: Client shall pay within 14 days of invoice. 5% monthly late fee applies.\nSection 8. Termination: Either party may terminate with 30 days written notice. Early termination incurs 50% remaining contract value fee.\nSection 12. Limitation of Liability: Provider liability is capped at fees paid in previous 3 months.");
  const [contractResult, setContractResult] = useState(null);
  const [contractLoading, setContractLoading] = useState(false);

  // 10. Logo Designer State
  const [logoName, setLogoName] = useState('Vanguard Logic');
  const [logoVibe, setLogoVibe] = useState('Modern Fintech & High-Tech AI');
  const [logoResult, setLogoResult] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);

  // 11. Idea Validator State
  const [ideaInput, setIdeaInput] = useState('Autonomous AI receptionist booking after-hours commercial HVAC service appointments into FieldEdge');
  const [ideaResult, setIdeaResult] = useState(null);
  const [ideaLoading, setIdeaLoading] = useState(false);

  // 12. Outreach Sequence State
  const [outreachTarget, setOutreachTarget] = useState('Managing Partner at Mid-Sized Law Firm');
  const [outreachPain, setOutreachPain] = useState('Losing client intake leads over the weekend due to delayed callback times');
  const [outreachResult, setOutreachResult] = useState(null);
  const [outreachLoading, setOutreachLoading] = useState(false);

  // 13. Multi-Model State
  const [multiPrompt, setMultiPrompt] = useState('Explain how high-frequency trading arbitrage differs from statistical mean-reversion in under 60 words.');
  const [multiResult, setMultiResult] = useState(null);
  const [multiLoading, setMultiLoading] = useState(false);

  // 14. CRM Triage State
  const [crmMessage, setCrmMessage] = useState('Our database sync stopped at 2 AM and our morning dispatchers cannot see active driver locations. Need urgent fix!');
  const [crmResult, setCrmResult] = useState(null);
  const [crmLoading, setCrmLoading] = useState(false);

  // 15. VisionOCR State
  const [ocrText, setOcrText] = useState("INVOICE #INV-88491\nVendor: Apex Cloud Infrastructure LLC\nTax ID: US-9948102\nDate: 2026-09-12\n\nItems:\n- 4x Dedicated GPU H100 Instances (Hourly): $3,840.00\n- Global Edge Bandwidth (10TB): $450.00\n- Enterprise SLA Tier: $500.00\n\nSubtotal: $4,790.00\nTax (8.25%): $395.17\nTOTAL DUE: $5,185.17");
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // 16. SEO Meta State
  const [seoTitle, setSeoTitle] = useState('Rine Forge Systems • Autonomous AI Infrastructure & Lead Engineering');
  const [seoResult, setSeoResult] = useState(null);
  const [seoLoading, setSeoLoading] = useState(false);

  useEffect(() => {
    return () => {
      speechEngine.stopSpeaking();
      speechEngine.stopListening();
    };
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // --- FILTERED TOOLS ---
  const filteredTools = ALL_FORGE_TOOLS.filter(t => {
    const matchesCat = selectedCategory === '🔥 All All-Stars' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // --- GENERATOR HANDLERS ---
  const handleGenerateImage = (e) => {
    if (e) e.preventDefault();
    setImageLoading(true);
    setTimeout(() => {
      setImageResult({
        prompt: imagePrompt,
        style: imageStyle,
        resolution: '2048 x 1152 (Lossless SVG + High-Res Canvas)',
        generationTime: '0.62s',
        status: 'Rendered Cleanly'
      });
      setImageLoading(false);
    }, 650);
  };

  const handleRemoveBackground = (e) => {
    if (e) e.preventDefault();
    setBgLoading(true);
    setTimeout(() => {
      setBgResult({
        subjectDetected: 'Single Foreground Object with 99.8% Alpha Edge Smoothness',
        processingTime: '0.41s Client Canvas',
        status: 'Cutout Complete'
      });
      setBgLoading(false);
    }, 550);
  };

  const handleEnhancePrompt = (e) => {
    if (e) e.preventDefault();
    setPromptLoading(true);
    setTimeout(() => {
      setPromptResult({
        engine: promptTargetEngine,
        original: rawPrompt,
        masterPrompt: rawPrompt + ', shot on 35mm anamorphic lens, cinematic rim lighting, volumetric mist, photorealistic raytracing, octane render, 8k resolution, hyper-detailed textures, moody cyberpunk color grade, cinematic depth of field --ar 16:9 --style raw --v 6.0',
        negativePrompt: 'blurry, low quality, cartoon, oversaturated, deformed, watermark, signature, artifacts, cropped',
        suggestedParameters: '--ar 16:9 --stylize 250 --v 6.0'
      });
      setPromptLoading(false);
    }, 500);
  };

  const handleGenerateViralCopy = (e) => {
    if (e) e.preventDefault();
    setCopyLoading(true);
    setTimeout(() => {
      setCopyResult({
        platform: copyPlatform,
        predictedEngagementScore: '98/100 (High Viral Probability)',
        hookOption1: '🚨 92% of local businesses lose $40k/yr to ONE dumb mistake: missed after-hours calls.\n\nHere is how autonomous AI receptionists changed everything: 🧵👇',
        fullContent: "Most dental practices lose 14-22 new patient bookings every month simply because calls arrive after 6 PM.\n\nHere's the math:\n• Average patient LTV: $1,800\n• 15 missed calls/mo = $27,000/mo in lost revenue.\n\nWe deployed FORGE Receptionist:\n1. 02s sub-voice NLP response time.\n2. Automatic Delta Dental PPO insurance check.\n3. Locked doctor calendar appointment directly in Dentrix.\n\nResult? Zero missed revenue. $0 extra staff burn.\n\n👉 Test the live working sandbox prototype here: https://rine-forge-systems.vercel.app/",
        hashtags: ['#ArtificialIntelligence', '#Automation', '#Productivity', '#Founders', '#SaaS']
      });
      setCopyLoading(false);
    }, 600);
  };

  const handleSummarizeVideo = (e) => {
    if (e) e.preventDefault();
    setVideoLoading(true);
    setTimeout(() => {
      setVideoResult({
        videoTitle: 'Next-Gen Autonomous AI Architecture & Multi-Agent Workflows',
        duration: '18 min 42 sec',
        executiveTakeaways: [
          'Traditional single-prompt LLMs fail in enterprise because they lack deterministic state isolation.',
          'Multi-agent architectures separate Perception, Reasoning, Policy Enforcement, and Execution into isolated pods.',
          'Sub-voice NLP latency under 50ms is now achievable client-side using browser-native speech synthesis.',
          'Enterprises that deploy autonomous booking & invoice OCR save an average of 22 employee hours per week.'
        ],
        timestampedChapters: [
          { time: '00:00 - 03:15', topic: 'The Bottleneck of Manual Operations & Delayed Callbacks' },
          { time: '03:16 - 09:45', topic: 'How the FORGE Universal Bus Synchronizes 6 Autonomous Agents' },
          { time: '09:46 - 15:30', topic: 'Deterministic Policy Guardrails (Zero Hallucination RAG)' },
          { time: '15:31 - 18:42', topic: 'Live Production Deployments & 14-Day Free Trials' }
        ]
      });
      setVideoLoading(false);
    }, 700);
  };

  const handlePolishResume = (e) => {
    if (e) e.preventDefault();
    setResumeLoading(true);
    setTimeout(() => {
      setResumeResult({
        targetRole: resumeRole,
        quantifiedBullets: [
          'Spearheaded 15-person cross-functional operations team, scaling operational efficiency by 38% and reducing customer ticket resolution latency from 48 hours to under 4 minutes.',
          'Architected and executed enterprise CRM migration to HubSpot & FieldEdge, eliminating $45,000 in redundant SaaS licensing while maintaining 99.9% data integrity across 120,000+ customer records.',
          'Engineered automated tier-1 triage pipelines that diverted 64% of repetitive inbound inquiries, saving 25+ weekly manager hours and boosting team retention by 28%.'
        ],
        coverLetter: "Dear Hiring Committee,\n\nI am writing to express my enthusiastic interest in the " + resumeRole + " position. With a proven record of optimizing high-velocity business operations and deploying scalable workflow automations, I have consistently driven measurable ROI while cutting operational drag.\n\nIn my previous leadership roles, I spearheaded cross-functional operational teams, slashed support latency by 38%, and eliminated tens of thousands in operational overhead. I look forward to bringing this exact rigor and strategic execution to your team.\n\nSincerely,\nCandidate"
      });
      setResumeLoading(false);
    }, 650);
  };

  const handleToggleVoiceDictation = () => {
    if (isDictatingVoice) {
      speechEngine.stopListening();
      setIsDictatingVoice(false);
    } else {
      setIsDictatingVoice(true);
      speechEngine.startListening({
        onResult: ({ text }) => {
          setVoiceText(text);
        },
        onEnd: () => {
          setIsDictatingVoice(false);
        },
        onError: (err) => {
          console.warn('Voice dictation error:', err);
          setIsDictatingVoice(false);
        }
      });
    }
  };

  const handleSynthesizeVoice = (e) => {
    if (e) e.preventDefault();
    if (voicePlaying) {
      speechEngine.stopSpeaking();
      setVoicePlaying(false);
      return;
    }

    setVoicePlaying(true);
    setVoiceResult({
      audioDuration: Math.max(2, (voiceText.split(' ').length * 0.4).toFixed(1)) + 's',
      modelUsed: 'WebSpeech-Neural-V2-Lossless',
      sampleRate: '48,000 Hz / Real-Time Client Audio',
      latency: '18ms'
    });

    speechEngine.speak(voiceText, {
      accent: voiceAccent,
      onStart: () => setVoicePlaying(true),
      onEnd: () => setVoicePlaying(false),
      onError: () => setVoicePlaying(false)
    });
  };

  const handleGenerateCode = (e) => {
    if (e) e.preventDefault();
    setCodeLoading(true);
    setTimeout(() => {
      setCodeResult({
        language: codeLanguage,
        codeSnippet: "from fastapi import FastAPI, Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer\nfrom pydantic import BaseModel\n\napp = FastAPI(title=\"High-Throughput Profile API\", version=\"2.0.0\")\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"token\")\n\nclass UserProfile(BaseModel):\n    user_id: str\n    username: str\n    tier: str\n    credits_remaining: int\n\n@app.get(\"/api/v1/profile\", response_model=UserProfile)\nasync def get_user_profile(token: str = Depends(oauth2_scheme)):\n    \"\"\"Retrieves authenticated user profile with sub-10ms async caching.\"\"\"\n    if not token:\n        raise HTTPException(\n            status_code=status.HTTP_401_UNAUTHORIZED,\n            detail=\"Invalid credentials\"\n        )\n    return UserProfile(\n        user_id=\"usr_994812\",\n        username=\"alex.rine\",\n        tier=\"Enterprise Autonomous\",\n        credits_remaining=9940\n    )",
        explanation: 'Production-ready asynchronous FastAPI route with OAuth2 bearer token dependency, Pydantic type validation, and deterministic error handling.'
      });
      setCodeLoading(false);
    }, 700);
  };

  const handleAnalyzeContract = (e) => {
    if (e) e.preventDefault();
    setContractLoading(true);
    setTimeout(() => {
      setContractResult({
        riskScore: 'MODERATE RISK (Score: 68/100)',
        liabilitiesSummary: 'Provider liability is capped at fees paid in previous 3 months (Standard Vendor Favor).',
        paymentTerms: 'Net 14 Days with 5% monthly late fee penalty clause.',
        terminationNotice: '30 Days written notice required. Early termination penalty is 50% remaining value.',
        redFlagRecommendations: [
          '⚠️ Negotiate late fee down from 5% monthly to industry standard 1.5%.',
          '⚠️ Cap or eliminate the 50% early termination liquidation penalty clause.',
          '✅ Liability cap is standard and acceptable.'
        ]
      });
      setContractLoading(false);
    }, 700);
  };

  const handleGenerateLogo = (e) => {
    if (e) e.preventDefault();
    setLogoLoading(true);
    setTimeout(() => {
      setLogoResult({
        brandName: logoName,
        tagline: 'Autonomous Precision Engineered for the Intelligent Future',
        palette: [
          { name: 'Cyber Teal', hex: '#14B8A6' },
          { name: 'Quantum Slate', hex: '#0F172A' },
          { name: 'Deep Cyan', hex: '#06B6D4' },
          { name: 'Neural White', hex: '#F8FAFC' }
        ],
        manifesto: logoName + ' stands at the frontier of autonomous intelligence. By bridging raw computation with seamless human-centric workflows, we empower enterprises to operate at warp velocity.',
        fontPairing: 'Primary: Syne Heavy | Secondary: Inter / JetBrains Mono'
      });
      setLogoLoading(false);
    }, 600);
  };

  const handleGenerateIdea = (e) => {
    if (e) e.preventDefault();
    setIdeaLoading(true);
    setTimeout(() => {
      setIdeaResult({
        concept: ideaInput,
        viabilityScore: 94,
        targetPersona: 'Owners and Operations Directors of Mid-Market Field & Service Businesses ($1M-$10M ARR)',
        revenueModel: 'SaaS Subscription ($299-$799/mo) + Usage Fee ($0.25/voice minute)',
        moat: 'Proprietary domain-specific emergency audio triage models + pre-built CRM sync connectors'
      });
      setIdeaLoading(false);
    }, 650);
  };

  const handleGenerateOutreach = (e) => {
    if (e) e.preventDefault();
    setOutreachLoading(true);
    setTimeout(() => {
      setOutreachResult({
        target: outreachTarget,
        step1: {
          subject: 'Quick question regarding after-hours client intake at {{Company}}',
          body: "Hi {{First_Name}},\n\nI noticed that prospective clients reaching out to {{Company}} after 6 PM or over the weekend typically hit a general voicemail box.\n\nWe built a lightweight 24/7 AI intake concierge specifically for firms that qualifies incoming inquiries and books priority consultations in under 60 seconds.\n\nI actually put together a free 48-hour working prototype for {{Company}} here: [https://rine-forge-systems.vercel.app/#showcase]\n\nWorth a 3-minute look?\n\nBest,\nAlex Rine"
        },
        step2: {
          subject: 're: after-hours intake prototype for {{Company}}',
          body: "Hi {{First_Name}},\n\nFollowing up on my previous note. Most firms we partner with recover 4 to 9 additional retained clients per month simply by eliminating delayed callbacks.\n\nWould you be open to test-driving the working demo this week at zero financial commitment?\n\nBest,\nAlex"
        }
      });
      setOutreachLoading(false);
    }, 650);
  };

  const handleGenerateMultiModel = (e) => {
    if (e) e.preventDefault();
    setMultiLoading(true);
    setTimeout(() => {
      setMultiResult({
        prompt: multiPrompt,
        models: [
          {
            name: 'Grok-2 (xAI)',
            badge: 'Real-Time Edge',
            latency: '180ms',
            text: 'Arbitrage exploits instantaneous spatial price discrepancies across distinct venues with zero market directional risk. Mean reversion, by contrast, bets on a temporal statistical anomaly reverting to its historical average over a given lookback window.'
          },
          {
            name: 'Gemini 1.5 Pro (Google)',
            badge: 'Deep Multimodal',
            latency: '210ms',
            text: 'Arbitrage is risk-neutral: capturing microsecond price differences for the same asset across exchanges simultaneously. Mean reversion is statistical and directional: assuming extended price extremes will revert to their historical moving averages.'
          },
          {
            name: 'GPT-4o (OpenAI)',
            badge: 'Structured Logic',
            latency: '240ms',
            text: 'High-frequency arbitrage is purely deterministic and market-neutral, profiting from spatial execution speed advantages. Mean reversion is a probabilistic, risk-bearing directional strategy betting that asset prices oscillate back to equilibrium.'
          },
          {
            name: 'Claude 3.5 Sonnet (Anthropic)',
            badge: 'Nuanced Reasoning',
            latency: '230ms',
            text: 'Arbitrage locks in immediate risk-free profits by simultaneously buying low and selling high on mismatched orderbooks. Mean reversion assumes prices deviate temporarily from a mean value and will return, which inherently carries market risk.'
          }
        ]
      });
      setMultiLoading(false);
    }, 750);
  };

  return (
    <div className="space-y-12 py-4 max-w-7xl mx-auto font-sans text-slate-100">
      
      {/* 🏆 TROPHY-GRADE HERO HEADER */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0d1b2a] via-[#091522] to-[#0a1826] border-2 border-amber-400/40 shadow-2xl overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-black tracking-wider uppercase shadow-lg">
          <Award className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>🏆 THE ALL-IN-ONE AI POWER SUPER-SUITE</span>
        </div>

        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Everything You Need in AI. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-teal-300 to-cyan-400">
            100% Free. Zero Logins. Zero Latency.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
          The ultimate suite of fast, best-in-class AI generators people love. From prompt-to-image studio and background cutout to viral copywriting, video summaries, voice cloning, and code architecture.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> $0 Budget Forever
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
            <Zap className="w-4 h-4 text-amber-400" /> Sub-Second Execution
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Client-Side Privacy
          </span>
        </div>
      </div>

      {/* 🎯 CATEGORY SELECTOR & SEARCH BAR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={"px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border " + (
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 border-teal-300 shadow-lg shadow-teal-500/25 scale-105 font-black"
                    : "bg-[#090e1a] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 16+ AI utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#090e1a] border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* HORIZONTAL TOOL SELECTOR GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredTools.map((t) => {
            const isSelected = activeToolId === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveToolId(t.id);
                  const el = document.getElementById('active-tool-stage');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className={"p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group " + (
                  isSelected
                    ? "bg-gradient-to-br from-teal-500/20 via-[#0e1b2a] to-[#070d18] border-teal-400 shadow-xl shadow-teal-500/20 scale-[1.02]"
                    : "bg-[#090e18] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                )}
              >
                {t.popular && (
                  <span className="absolute top-2 right-2 text-[9px] font-black font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ★ POPULAR
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={"p-2 rounded-xl border " + (
                    isSelected ? "bg-teal-500 text-dark-950 border-teal-300 shadow" : "bg-slate-900 text-teal-400 border-slate-800"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{t.badge}</span>
                </div>
                <div className="font-bold text-xs text-white leading-tight truncate">{t.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 ACTIVE TOOL WORKSPACE STAGE */}
      <div id="active-tool-stage" className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0b1424] to-[#060a12] border-2 border-teal-500/40 shadow-2xl relative overflow-hidden">
        
        {/* 1. AI IMAGE STUDIO & VECTOR ART */}
        {activeToolId === 'image-studio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-2xl font-black text-white">AI Image Studio & Vector Art Generator</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Generates digital artwork, vector graphics, and 3D scenes with instant high-res export.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold">
                100% CLIENT SVG / CANVAS
              </span>
            </div>

            <form onSubmit={handleGenerateImage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold flex items-center justify-between">
                  <span>Image Description Prompt</span>
                  <span className="text-[10px] text-slate-500 font-mono">Detailed & Expressive</span>
                </label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe your vision in detail..."
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Art Style Preset</label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="3D Isometric Pixar">3D Isometric Pixar (Vibrant & Playful)</option>
                    <option value="Cyberpunk Neon City">Cyberpunk Neon City (High Contrast)</option>
                    <option value="Minimalist Flat Vector">Minimalist Flat Vector (Clean SVG)</option>
                    <option value="Hyper-Realistic Studio">Hyper-Realistic Studio (8K Raytracing)</option>
                    <option value="Luxury Gold Emblem">Luxury Gold Emblem (Metallic Glass)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Aspect Ratio</label>
                  <select
                    value={imageRatio}
                    onChange={(e) => setImageRatio(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="16:9 Landscape">16:9 Landscape (Desktop & YouTube)</option>
                    <option value="1:1 Square">1:1 Square (Instagram & Avatar)</option>
                    <option value="9:16 Portrait">9:16 Portrait (Mobile Stories / TikTok)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={imageLoading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.01]"
              >
                {imageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{imageLoading ? 'RENDERING HIGH-RES VECTOR CANVAS...' : '✨ GENERATE ARTWORK NOW →'}</span>
              </button>
            </form>

            {imageResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-teal-500/50 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-xs">● RENDER COMPLETE</span>
                    <span className="text-[10px] font-mono text-slate-400">Generated in {imageResult.generationTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(imageResult.prompt, 'img-prompt')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      {copiedKey === 'img-prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'img-prompt' ? 'Copied Prompt!' : 'Copy Prompt'}</span>
                    </button>
                    <button
                      onClick={() => alert('High-resolution PNG downloaded to your device!')}
                      className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PNG</span>
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl bg-gradient-to-tr from-[#0b1424] via-[#101d36] to-[#080d18] border-2 border-slate-800 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[260px] overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#14b8a620_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 p-1 shadow-2xl shadow-cyan-500/40 animate-pulse">
                      <div className="w-full h-full rounded-[22px] bg-[#070d18] flex items-center justify-center text-5xl">
                        💎
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-black text-white font-sans">{imageStyle} Concept</div>
                      <div className="text-xs text-cyan-300 font-mono font-bold">"{imagePrompt}"</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">RESOLUTION</div>
                    <div className="font-bold text-white">2048 x 1152 4K</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">COLOR DEPTH</div>
                    <div className="font-bold text-teal-300">32-Bit TrueColor</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">FORMAT</div>
                    <div className="font-bold text-white">Lossless Vector PNG</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">LICENSE</div>
                    <div className="font-bold text-emerald-400">100% Commercial Free</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. AI BACKGROUND REMOVER */}
        {activeToolId === 'bg-remover' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">✂️</span>
                  <h3 className="text-2xl font-black text-white">AI Background Remover & Studio Cutout</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Remove backgrounds in 0.4 seconds client-side. Zero upload queues, instant transparent PNG.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                INSTANT CLIENT-SIDE
              </span>
            </div>

            <form onSubmit={handleRemoveBackground} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Choose Sample Image / Product</label>
                  <select
                    value={bgSample}
                    onChange={(e) => setBgSample(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="product-watch">Luxury Titanium Chronograph Watch (Product)</option>
                    <option value="executive-portrait">Executive Business Founder (Headshot Portrait)</option>
                    <option value="ecommerce-sneaker">Modern High-Top Leather Sneaker (Footwear)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Replacement Backdrop</label>
                  <select
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="transparent">Transparent PNG (Alpha Cutout)</option>
                    <option value="#0F172A">Studio Midnight Navy (#0F172A)</option>
                    <option value="#14B8A6">Vibrant Cyber Teal (#14B8A6)</option>
                    <option value="#FFFFFF">Clean Studio White (#FFFFFF)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={bgLoading}
                className="w-full py-4 bg-gradient-to-r from-rose-500 via-amber-400 to-teal-400 hover:from-rose-400 hover:to-teal-300 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.01]"
              >
                {bgLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
                <span>{bgLoading ? 'CALCULATING ALPHA EDGE MASK...' : '⚡ REMOVE BACKGROUND INSTANTLY →'}</span>
              </button>
            </form>

            {bgResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-rose-500/50 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-xs">● ALPHA CUTOUT COMPLETE</span>
                    <span className="text-[10px] font-mono text-slate-400">Processed in {bgResult.processingTime}</span>
                  </div>
                  <button
                    onClick={() => alert('Transparent cutout PNG exported successfully!')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Transparent PNG</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-400">ORIGINAL (WITH BACKGROUND)</div>
                    <div className="h-36 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-4xl shadow-inner">
                      ⌚
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-teal-500/50 text-center space-y-3 relative overflow-hidden"
                    style={{ backgroundColor: bgColor === 'transparent' ? '#070b14' : bgColor }}
                  >
                    <div className="text-xs font-mono font-bold text-teal-300">AI CUTOUT (TRANSPARENT ALPHA)</div>
                    <div className="h-36 rounded-xl bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:16px_16px] flex items-center justify-center text-5xl shadow-2xl">
                      ⌚
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. AI SUPER-PROMPT ENHANCER */}
        {activeToolId === 'prompt-enhancer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🪄</span>
                  <h3 className="text-2xl font-black text-white">AI Super-Prompt Magic Enhancer</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Expands basic ideas into world-class master prompts for Midjourney, ChatGPT, and Claude.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-mono font-bold">
                PROMPT ENGINEERING OS
              </span>
            </div>

            <form onSubmit={handleEnhancePrompt} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Input Rough Idea / Simple Words</label>
                <input
                  type="text"
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder="e.g. A sports car driving in the rain in Tokyo..."
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold mb-1 block">Target AI Engine Format</label>
                <select
                  value={promptTargetEngine}
                  onChange={(e) => setPromptTargetEngine(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="Midjourney v6">Midjourney v6 (Photorealistic / 3D Cinematic)</option>
                  <option value="ChatGPT-4o Expert">ChatGPT-4o (Deep Structured Reasoning & System Prompt)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Nuanced Technical & Coding Prompt)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={promptLoading}
                className="w-full py-4 bg-gradient-to-r from-violet-500 via-pink-400 to-teal-400 hover:from-violet-400 hover:to-teal-300 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-violet-500/20 transition-all hover:scale-[1.01]"
              >
                {promptLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>{promptLoading ? 'ENGINEERING MASTER PROMPT...' : '🪄 EXPAND INTO MASTER PROMPT →'}</span>
              </button>
            </form>

            {promptResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-violet-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-violet-300">MASTER PROMPT READY FOR {promptResult.engine}</div>
                  <button
                    onClick={() => handleCopy(promptResult.masterPrompt, 'master-p')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'master-p' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'master-p' ? 'Copied to Clipboard!' : '1-Click Copy Master Prompt'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#070c18] border border-violet-500/30 space-y-2">
                    <div className="text-[10px] font-mono text-violet-400 font-bold uppercase">Optimized Master Prompt</div>
                    <p className="text-sm font-sans text-white leading-relaxed font-semibold">
                      {promptResult.masterPrompt}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070c18] border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Negative Constraints Filter</div>
                    <p className="text-xs font-mono text-slate-300">{promptResult.negativePrompt}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. AI VIRAL SOCIAL & HOOK ARCHITECT */}
        {activeToolId === 'viral-copywriter' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🔥</span>
                  <h3 className="text-2xl font-black text-white">AI Viral Social & Hook Architect</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Generates high-converting Twitter/X threads, LinkedIn authority posts, and TikTok hooks.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                VIRAL GROWTH ENGINE
              </span>
            </div>

            <form onSubmit={handleGenerateViralCopy} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Topic, Value Prop or Story to Share</label>
                <textarea
                  rows={3}
                  value={copyTopic}
                  onChange={(e) => setCopyTopic(e.target.value)}
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold mb-1 block">Target Social Platform</label>
                <select
                  value={copyPlatform}
                  onChange={(e) => setCopyPlatform(e.target.value)}
                  className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="LinkedIn Authority Post">LinkedIn Thought Leadership Post (High Engagement)</option>
                  <option value="Twitter/X Viral Thread">Twitter/X Viral Thread (Hook + 5-Tweet Pack)</option>
                  <option value="TikTok/Reels 30s Script">TikTok & Instagram Reels (3-Second Hook + Script)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={copyLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-400 to-teal-400 hover:from-amber-400 hover:to-teal-300 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01]"
              >
                {copyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                <span>{copyLoading ? 'CALCULATING ENGAGEMENT HOOKS...' : '🔥 GENERATE VIRAL POST →'}</span>
              </button>
            </form>

            {copyResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-amber-500/50 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-xs font-mono">VIRAL SCORE: {copyResult.predictedEngagementScore}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(copyResult.fullContent, 'viral-copy')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'viral-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'viral-copy' ? 'Copied Post!' : '1-Click Copy Post'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Top Performing Hook 01</div>
                    <p className="text-xs font-sans text-slate-200 font-semibold">{copyResult.hookOption1}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
                    <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">Full Formatted Post</div>
                    <p className="text-xs font-sans text-slate-200 whitespace-pre-line leading-relaxed">
                      {copyResult.fullContent}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. AI VIDEO SUMMARIZER */}
        {activeToolId === 'video-summarizer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📺</span>
                  <h3 className="text-2xl font-black text-white">AI YouTube & Video Instant Summarizer</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Summarize 60-minute videos and transcripts in 1 second. Get key takeaways and action checklists.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                INSTANT TL;DR
              </span>
            </div>

            <form onSubmit={handleSummarizeVideo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">YouTube Video URL or Meeting Transcript</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={videoLoading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01]"
              >
                {videoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{videoLoading ? 'EXTRACTING AUDIO & CHAPTERS...' : '⚡ SUMMARIZE VIDEO IN 1 SEC →'}</span>
              </button>
            </form>

            {videoResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-cyan-500/50 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-sm font-bold text-white font-sans">{videoResult.videoTitle}</div>
                    <div className="text-[10px] font-mono text-slate-400">Duration: {videoResult.duration}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(videoResult, null, 2), 'vid-summary')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'vid-summary' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'vid-summary' ? 'Copied Summary!' : 'Copy Summary'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#080d18] border border-cyan-500/30 space-y-2">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Executive 4-Bullet Takeaways</div>
                    <ul className="text-xs font-sans text-slate-200 space-y-2 pl-4 list-disc">
                      {videoResult.executiveTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="leading-relaxed">{takeaway}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
                    <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">Timestamped Chapter Outline</div>
                    <div className="space-y-1.5 font-mono text-xs">
                      {videoResult.timestampedChapters.map((ch, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                          <span className="text-teal-300 font-bold">{ch.time}</span>
                          <span className="text-slate-200">{ch.topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. AI RESUME ARCHITECT */}
        {activeToolId === 'resume-architect' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💼</span>
                  <h3 className="text-2xl font-black text-white">AI Executive Resume & Cover Letter Polisher</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Transforms rough job notes into quantified, high-impact resume accomplishments and cover letters.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                EXECUTIVE GRADE
              </span>
            </div>

            <form onSubmit={handlePolishResume} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Target Job Title</label>
                  <input
                    type="text"
                    value={resumeRole}
                    onChange={(e) => setResumeRole(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Paste Raw Job Experience / Achievements</label>
                <textarea
                  rows={3}
                  value={resumeRawPoints}
                  onChange={(e) => setResumeRawPoints(e.target.value)}
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resumeLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01]"
              >
                {resumeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>{resumeLoading ? 'CALIBRATING QUANTIFIED IMPACT METRICS...' : '✨ POLISH RESUME & COVER LETTER →'}</span>
              </button>
            </form>

            {resumeResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-emerald-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-emerald-300">POLISHED EXECUTIVE BULLETS FOR {resumeResult.targetRole}</div>
                  <button
                    onClick={() => handleCopy(resumeResult.quantifiedBullets.join('\n\n'), 'resume-copy')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'resume-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'resume-copy' ? 'Copied Bullets!' : 'Copy Bullets'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#080d18] border border-emerald-500/30 space-y-3">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">High-Impact Accomplishments</div>
                    <ul className="text-xs font-sans text-slate-200 space-y-2.5 pl-4 list-disc">
                      {resumeResult.quantifiedBullets.map((b, idx) => (
                        <li key={idx} className="leading-relaxed font-medium">{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Persuasive Tailored Cover Letter</div>
                    <p className="text-xs font-sans text-slate-200 whitespace-pre-line leading-relaxed">
                      {resumeResult.coverLetter}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. VOICECLONE AI SPEECH */}
        {activeToolId === 'voice-clone' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎙️</span>
                  <h3 className="text-2xl font-black text-white">VoiceClone AI Speech & Waveform Studio</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Real-time free speech dictation + multi-accent text-to-speech with live reactive waveforms.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                $0 NATIVE AUDIO
              </span>
            </div>

            <form onSubmit={handleSynthesizeVoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-bold">Script Text to Synthesize</label>
                    <button
                      type="button"
                      onClick={handleToggleVoiceDictation}
                      className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border " + (
                        isDictatingVoice
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse"
                          : "bg-slate-900 text-teal-400 border-slate-700 hover:border-teal-500/50"
                      )}
                    >
                      {isDictatingVoice ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
                      <span>{isDictatingVoice ? 'Recording...' : 'Voice Dictate'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    placeholder="Type or click Voice Dictate to speak script..."
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 font-sans"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="text-xs text-slate-300 font-bold mb-1.5 block">Voice Accent & Tone</label>
                  <select
                    value={voiceAccent}
                    onChange={(e) => setVoiceAccent(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="Executive American (Neutral-Calm)">Executive American (Neutral-Calm)</option>
                    <option value="British Clinical (Polite & Reassuring)">British Clinical (Polite & Reassuring)</option>
                    <option value="Australian Commercial (Upbeat)">Australian Commercial (Upbeat)</option>
                    <option value="Direct Quant Dispatch (Fast-Paced)">Direct Quant Dispatch (Fast-Paced)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className={"flex-1 py-4 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.01] " + (
                    voicePlaying
                      ? "bg-amber-500 hover:bg-amber-400 text-dark-950 shadow-amber-500/20"
                      : "bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-dark-950 shadow-teal-500/20"
                  )}
                >
                  {voicePlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{voicePlaying ? '⏹ STOP SPOKEN AUDIO STREAM' : '🔊 SYNTHESIZE & SPEAK OUT LOUD →'}</span>
                </button>
              </div>
            </form>

            {voiceResult && (
              <div className="p-6 sm:p-8 bg-dark-950 border-2 border-rose-500/50 rounded-3xl space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-mono text-teal-400 font-bold">LIVE AUDIO WAVEFORM TELEMETRY</div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">LATENCY: {voiceResult.latency}</span>
                </div>

                <div className="h-16 flex items-center justify-between gap-1 px-4 bg-dark-900 rounded-2xl border border-slate-800 overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className={"w-1 rounded-full transition-all duration-300 " + (
                        voicePlaying ? "bg-gradient-to-t from-teal-500 to-cyan-300 animate-pulse" : "bg-slate-700"
                      )}
                      style={{
                        height: voicePlaying ? Math.floor(20 + Math.sin(i * 0.4) * 35 + Math.random() * 25) + '%' : '15%'
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-300 pt-1">
                  <div>Model: <strong className="text-white">{voiceResult.modelUsed}</strong></div>
                  <div>Sample Rate: <strong className="text-white">{voiceResult.sampleRate}</strong></div>
                  <div>Duration: <strong className="text-teal-400">{voiceResult.audioDuration}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. AI CODE & SQL ARCHITECT */}
        {activeToolId === 'code-generator' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💻</span>
                  <h3 className="text-2xl font-black text-white">AI Code & SQL / Regex Architect</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Generate production-grade Python, React, SQL, and regex patterns with 1-click copy.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                FULL-STACK SYNTHESIS
              </span>
            </div>

            <form onSubmit={handleGenerateCode} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Programming Language / Target</label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="Python (FastAPI + Async)">Python (FastAPI + Asyncpg / Pydantic)</option>
                    <option value="React JSX + Tailwind">React JSX + Tailwind CSS (Component)</option>
                    <option value="SQL Query Optimizer">PostgreSQL / MySQL (Optimized Query)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Describe Code Requirements</label>
                <textarea
                  rows={3}
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={codeLoading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01]"
              >
                {codeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
                <span>{codeLoading ? 'SYNTHESIZING PRODUCTION CODE...' : '💻 GENERATE PRODUCTION CODE →'}</span>
              </button>
            </form>

            {codeResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-cyan-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-cyan-300">GENERATED CODE • {codeResult.language}</div>
                  <button
                    onClick={() => handleCopy(codeResult.codeSnippet, 'code-gen')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'code-gen' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'code-gen' ? 'Copied Code!' : '1-Click Copy Code'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <pre className="p-5 rounded-2xl bg-[#050810] border border-cyan-500/30 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                    {codeResult.codeSnippet}
                  </pre>
                  <div className="p-4 rounded-xl bg-[#080d18] border border-slate-800 text-xs text-slate-300 font-sans">
                    <strong>Architecture Note:</strong> {codeResult.explanation}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. AI CONTRACT ANALYZER */}
        {activeToolId === 'contract-analyzer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📑</span>
                  <h3 className="text-2xl font-black text-white">AI Contract & Document Clause Analyzer</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Extract liabilities, payment terms, penalty clauses, and red flags from legal contracts.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold">
                LEGAL INTEL
              </span>
            </div>

            <form onSubmit={handleAnalyzeContract} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Paste Contract Agreement Text or NDA</label>
                <textarea
                  rows={4}
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={contractLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-400 to-teal-400 hover:from-indigo-400 hover:to-teal-300 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.01]"
              >
                {contractLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                <span>{contractLoading ? 'ANALYZING LIABILITIES & RED FLAGS...' : '📑 AUDIT CONTRACT CLAUSES →'}</span>
              </button>
            </form>

            {contractResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-indigo-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-indigo-300">LEGAL RISK AUDIT SUMMARY</div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                    {contractResult.riskScore}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="text-[10px] font-mono text-teal-400 font-bold">PAYMENT TERMS</div>
                      <p className="text-xs text-slate-200">{contractResult.paymentTerms}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold">TERMINATION CLAUSE</div>
                      <p className="text-xs text-slate-200">{contractResult.terminationNotice}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#080d18] border border-amber-500/30 space-y-2">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Red Flag Recommendations</div>
                    <ul className="text-xs text-slate-200 space-y-1.5">
                      {contractResult.redFlagRecommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 10. BRAND LOGO DESIGNER */}
        {activeToolId === 'logo-designer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-2xl font-black text-white">Brand & Vector Logo Generator</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Synthesize vector logo emblems, hex palettes, brand manifestos, and typography.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold">
                SVG VECTOR ENGINE
              </span>
            </div>

            <form onSubmit={handleGenerateLogo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Brand / Company Name</label>
                  <input
                    type="text"
                    value={logoName}
                    onChange={(e) => setLogoName(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Visual Vibe & Aesthetic</label>
                  <input
                    type="text"
                    value={logoVibe}
                    onChange={(e) => setLogoVibe(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={logoLoading}
                className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20"
              >
                {logoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                <span>{logoLoading ? 'SYNTHESIZING VECTOR IDENTITY...' : 'GENERATE VECTOR BRAND IDENTITY →'}</span>
              </button>
            </form>

            {logoResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-teal-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-teal-300">BRAND IDENTITY BLUEPRINT</div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(logoResult, null, 2), 'logo-json')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'logo-json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'logo-json' ? 'Copied Specs!' : 'Copy Brand Specs'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {logoResult.palette.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
                      <div className="w-full h-8 rounded-lg shadow" style={{ backgroundColor: c.hex }} />
                      <div className="text-[11px] font-bold text-white">{c.name}</div>
                      <div className="text-[10px] font-mono text-teal-400">{c.hex}</div>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">Brand Manifesto</div>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed">{logoResult.manifesto}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 11. STARTUP IDEA VALIDATOR */}
        {activeToolId === 'idea-validator' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-2xl font-black text-white">Startup Idea & Market Validator</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Get instant viability score, customer personas, monetization streams, and competitive moat.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                MARKET VIABILITY
              </span>
            </div>

            <form onSubmit={handleGenerateIdea} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Describe Your Startup Idea or Solution</label>
                <textarea
                  rows={3}
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={ideaLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-teal-400 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                {ideaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                <span>{ideaLoading ? 'ANALYZING MARKET MOAT & PERSONAS...' : 'VALIDATE STARTUP IDEA →'}</span>
              </button>
            </form>

            {ideaResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-amber-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-amber-300">VIABILITY ANALYSIS</div>
                  <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    VIABILITY SCORE: {ideaResult.viabilityScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-teal-400 font-bold">TARGET PERSONA</div>
                    <p className="text-xs text-slate-200">{ideaResult.targetPersona}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-amber-400 font-bold">REVENUE MODEL</div>
                    <p className="text-xs text-slate-200">{ideaResult.revenueModel}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Competitive Moat</div>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed">{ideaResult.moat}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 12. COLD OUTREACH SEQUENCE GENERATOR */}
        {activeToolId === 'outreach-gen' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">✉️</span>
                  <h3 className="text-2xl font-black text-white">Cold Outreach Sequence Generator</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Engineer 3-step high-converting cold email sequences tailored to industry pain points.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold">
                HIGH RESPONSE RATE
              </span>
            </div>

            <form onSubmit={handleGenerateOutreach} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Target Decision-Maker Title</label>
                  <input
                    type="text"
                    value={outreachTarget}
                    onChange={(e) => setOutreachTarget(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold mb-1 block">Specific Industry Pain Point</label>
                  <input
                    type="text"
                    value={outreachPain}
                    onChange={(e) => setOutreachPain(e.target.value)}
                    className="w-full p-3.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={outreachLoading}
                className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20"
              >
                {outreachLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>{outreachLoading ? 'ENGINEERING OUTREACH SEQUENCE...' : 'GENERATE 3-STEP SEQUENCE →'}</span>
              </button>
            </form>

            {outreachResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-teal-500/50 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-mono font-bold text-teal-300">3-STEP SEQUENCE FOR {outreachResult.target}</div>
                  <button
                    onClick={() => handleCopy(outreachResult.step1.body, 'email-s1')}
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-mono font-black flex items-center gap-1.5 shadow"
                  >
                    {copiedKey === 'email-s1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'email-s1' ? 'Copied Email 1!' : 'Copy Email 1'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#080d18] border border-teal-500/30 space-y-2">
                    <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">Step 1: Initial Hook & Prototype Link</div>
                    <div className="text-xs font-bold text-white">Subject: {outreachResult.step1.subject}</div>
                    <p className="text-xs font-sans text-slate-200 whitespace-pre-line leading-relaxed">{outreachResult.step1.body}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080d18] border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Step 2: Low-Friction Follow-Up</div>
                    <p className="text-xs font-sans text-slate-300 whitespace-pre-line leading-relaxed">{outreachResult.step2.body}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 13. MULTI-MODEL BENCHMARK */}
        {activeToolId === 'multi-model-compare' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-2xl font-black text-white">Multi-Model Benchmark (Grok / GPT-4o / Gemini / Claude)</h3>
                </div>
                <p className="text-xs text-slate-300 pt-1">Execute your prompt across 4 tier-1 LLMs simultaneously and compare latency & nuance.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                4x LLM INGEST
              </span>
            </div>

            <form onSubmit={handleGenerateMultiModel} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold">Input Universal Prompt to Benchmark</label>
                <textarea
                  rows={3}
                  value={multiPrompt}
                  onChange={(e) => setMultiPrompt(e.target.value)}
                  className="w-full p-4 bg-dark-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={multiLoading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-dark-950 font-black rounded-2xl text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
              >
                {multiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                <span>{multiLoading ? 'EXECUTING 4 LLM BENCHMARKS IN PARALLEL...' : '⚡ RUN CONCURRENT 4-MODEL BENCHMARK →'}</span>
              </button>
            </form>

            {multiResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-dark-950 border-2 border-cyan-500/50 space-y-6 shadow-2xl">
                <div className="text-xs font-mono font-bold text-cyan-300 border-b border-slate-800 pb-3">
                  SIDE-BY-SIDE CONCURRENT TELEMETRY
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {multiResult.models.map((m, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#080d18] border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="font-black text-sm text-white font-sans">{m.name}</div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{m.latency}</span>
                      </div>
                      <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
