import React from 'react';
import { 
  Building2, Cpu, ShieldCheck, Terminal, Award, CheckCircle2, 
  ArrowRight, Sparkles, Layers, Users, Zap, Check 
} from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Alex Rine',
    role: 'Founder & Principal Systems Architect',
    credentials: 'M.S. Computer Engineering (Distributed Systems)',
    focus: 'High-Throughput Agentic Automation, Real-Time Ingest & Microstructure Architecture',
    initials: 'AR',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Lead Systems Architect, 9+ yrs enterprise infrastructure'
  },
  {
    name: 'Dr. Elena Rostova',
    role: 'Lead AI Quant & Research Scientist',
    credentials: 'Ph.D. Computational Intelligence & Neural Dynamics',
    focus: 'Microstructure Alpha Modeling, Statistical Arbitrage & Predictive Timeseries',
    initials: 'ER',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Senior Quantitative Researcher, High-Frequency Orderbook Dynamics'
  },
  {
    name: 'Marcus Thorne',
    role: 'VP of Infrastructure & Cloud Reliability',
    credentials: 'B.S. Software Engineering (MIT) • AWS Solutions Architect Pro',
    focus: 'Fault-Tolerant Microservices, Sub-50ms Execution & Global Edge Routing',
    initials: 'MT',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    experience: '12+ yrs scaling enterprise Kubernetes & real-time event brokers'
  },
  {
    name: 'Sofia Chen',
    role: 'Head of Conversational AI & Voice NLP',
    credentials: 'M.Sc. Natural Language Processing (Stanford AI Lab)',
    focus: 'Zero-Latency Voice Streaming, Multi-Turn Intent Triage & Gemini Integration',
    initials: 'SC',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    experience: 'Lead architect for autonomous healthcare & commercial voice triage'
  },
  {
    name: 'Tariq Al-Mansoor',
    role: 'Head of Cybersecurity & Compliance',
    credentials: 'CISSP • Certified Information Security Manager',
    focus: 'SOC-2 Type II Alignment, Zero-Trust Cryptography & GDPR Verification',
    initials: 'TM',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    experience: 'Ex-Lead Security Auditor for FinTech and HealthTech API ecosystems'
  }
];

const CORE_PRINCIPLES = [
  {
    title: 'Systems Over Slideware',
    desc: 'We do not sell theoretical advisory decks or vague AI roadmaps. We build production systems with real endpoints, error handling, and measurable throughput.'
  },
  {
    title: 'Zero Hallucination Tolerance',
    desc: 'Every conversational and document agent operates within strict RAG guardrails, citation verification, and deterministic fallback logic.'
  },
  {
    title: 'Human-in-the-Loop Governance',
    desc: 'High-risk business actions require explicit human authorization gates. The AI suggests, compiles, and prepares; your team retains final command.'
  },
  {
    title: 'No Data Leakage',
    desc: 'We utilize enterprise zero-retention model APIs and private encrypted stores. Your proprietary business data is never used to train public foundation models.'
  }
];

export function AboutSection({ onNavigate }) {
  return (
    <section id="about" className="py-24 border-t border-slate-850 bg-[#080c14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header & Manifesto */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" /> Engineering Ethos
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            We don’t sell AI hype.<br />
            <span className="text-teal-400">We build systems that do the work.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Most businesses don't need another generic chatbot or an endless consulting engagement. They need high-value, repetitive operational workflows executed autonomously with 99.9% reliability. That is what FORGE engineers.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_PRINCIPLES.map((item, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 hover:border-teal-500/40 transition-all space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-mono font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Leadership & Engineering Team */}
        <div className="space-y-10 pt-6">
          <div className="space-y-3">
            <div className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold">
              Leadership & Systems Architecture
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The Engineering Team Behind FORGE
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl">
              Engineers, researchers, and systems architects with deep background in distributed infrastructure, quantitative finance, and enterprise NLP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700" 
                  />
                  <div>
                    <div className="text-base font-bold text-white">{member.name}</div>
                    <div className="text-xs text-teal-400 font-medium">{member.role}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-300 font-mono text-[11px] bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    🎓 {member.credentials}
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Focus:</strong> {member.focus}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-950/40 via-dark-900 to-indigo-950/40 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-2xl font-extrabold text-white tracking-tight">
              Ready to eliminate your team's most expensive manual bottlenecks?
            </h4>
            <p className="text-sm text-slate-300">
              Get a detailed 48-hour architectural blueprint identifying exactly which workflows can be automated and the estimated ROI.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('audit')}
            className="w-full md:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-sm transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span>GET YOUR FREE AI AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
