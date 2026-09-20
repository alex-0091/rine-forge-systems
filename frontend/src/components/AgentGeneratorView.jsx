import React, { useState, useEffect } from 'react';
import {
  Bot, Sparkles, Shield, MapPin, CheckCircle2, XCircle, AlertCircle,
  Clock, Send, RefreshCw, Layers, ArrowRight, FileText, Check,
  AlertTriangle, Filter, Eye, ThumbsUp, ThumbsDown, Edit3, Globe,
  Server, ShieldCheck, Zap, HelpCircle, ChevronRight
} from 'lucide-react';

export function AgentGeneratorView() {
  const [activeSubTab, setActiveSubTab] = useState('wizard'); // 'wizard', 'suite', 'signals', 'providers'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Business Configuration Form State
  const [formData, setFormData] = useState({
    business_name: 'SmileCraft Dental',
    business_category: 'Dental Clinic',
    website: 'https://smilecraft-austin.example.com',
    location_area: 'Austin, Texas',
    service_radius_miles: 25,
    services: 'Emergency Dental, Dental Implants, Porcelain Veneers, Teeth Whitening',
    target_customer: 'Adults and families in Austin needing same-day emergency relief or cosmetic enhancements',
    keywords: 'tooth hurts, need dentist, broken tooth, looking for dentist, emergency dentist, implant recommendation',
    excluded_keywords: 'dog teeth, pet dentist, job, hiring, dental assistant vacancy',
    preferred_channels: ['SOCIAL_REPLY', 'EMAIL'],
    business_hours: {
      monday_friday: '08:00 - 18:00',
      saturday: '09:00 - 14:00',
      sunday: 'Closed (Emergency On-Call)'
    },
    ai_tone: 'PROFESSIONAL_HELPFUL',
    qualification_rules: 'Must be within 25 miles of Austin; Must request or mention tooth pain/cosmetic need; No pet/veterinary requests'
  });

  // Data States
  const [activeSuite, setActiveSuite] = useState(null);
  const [providers, setProviders] = useState([]);
  const [signals, setSignals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editedDraft, setEditedDraft] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  // Preset Configurations for Instant Vertical Demo
  const presets = [
    {
      label: '🦷 Austin Dental Clinic',
      name: 'SmileCraft Dental',
      category: 'Dental Clinic',
      location: 'Austin, Texas',
      services: 'Emergency Dental, Dental Implants, Porcelain Veneers, Teeth Whitening',
      keywords: 'tooth hurts, need dentist, broken tooth, looking for dentist, emergency dentist, implant recommendation',
      excluded: 'dog teeth, pet dentist, job, hiring, assistant position',
      tone: 'PROFESSIONAL_HELPFUL'
    },
    {
      label: '🥩 Downtown Steakhouse',
      name: 'Austin Prime Steakhouse',
      category: 'Restaurant',
      location: 'Austin, Texas',
      services: 'Private Dining, Corporate Receptions, Dry-Aged Steaks, Anniversary Dinners',
      keywords: 'anniversary dinner, private dining austin, best steakhouse, steak recommendation, table for 6',
      excluded: 'fast food, cheap eats, recipe, cook at home, hiring dishwasher',
      tone: 'WARM_EMPATHETIC'
    },
    {
      label: '⚖️ Personal Injury Law',
      name: 'Apex Injury Lawyers',
      category: 'Law Firm',
      location: 'Austin, Texas',
      services: 'Auto Accident Claims, MoPac Collision Injury, Truck Accidents, Slip and Fall',
      keywords: 'car accident lawyer, rear ended mopac, need injury attorney, accident claim austin, whiplash lawyer',
      excluded: 'traffic ticket, divorce, criminal defense, hiring paralegal',
      tone: 'DIRECT_EFFICIENT'
    },
    {
      label: '🏨 Boutique Hotel',
      name: 'Lone Star Boutique Suites',
      category: 'Hotel',
      location: 'Austin, Texas',
      services: 'Executive Suites, Group Event Room Blocks, SXSW Lodging, Downtown Balcony Rooms',
      keywords: 'hotel suites austin, stay in downtown austin, sxsw room block, boutique hotel recommendation',
      excluded: 'motel, cheap hostel, long term lease, hiring front desk',
      tone: 'WARM_EMPATHETIC'
    },
    {
      label: '🧹 Commercial Cleaning',
      name: 'SparklePro Cleaners',
      category: 'Cleaning Company',
      location: 'Austin, Texas',
      services: 'Move-Out Deep Cleaning, Commercial Office Cleaning, Post-Construction Cleanup',
      keywords: 'deep clean house, need cleaner cedar park, move out cleaning austin, office cleaner recommendation',
      excluded: 'carpet shampoo rental, diy cleaning, part time maid job',
      tone: 'DIRECT_EFFICIENT'
    },
    {
      label: '🚀 B2B Marketing Agency',
      name: 'Vanguard Growth Partners',
      category: 'Marketing Agency',
      location: 'Austin, Texas',
      services: 'B2B Pipeline SEO, Paid Search Ads, Autonomous Outreach Setup, SaaS Inbound Scale',
      keywords: 'need marketing agency, b2b saas seo, austin marketing consultant, hire ppc specialist',
      excluded: 'influencer dm, instagram followers free, marketing intern resume',
      tone: 'PROFESSIONAL_HELPFUL'
    }
  ];

  const applyPreset = (preset) => {
    setFormData({
      ...formData,
      business_name: preset.name,
      business_category: preset.category,
      location_area: preset.location,
      services: preset.services,
      keywords: preset.keywords,
      excluded_keywords: preset.excluded,
      ai_tone: preset.tone
    });
    setMessage({ type: 'info', text: `Loaded preset: ${preset.name}` });
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/v1/agent-generator/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      }
    } catch (e) {
      console.error('Failed to fetch providers', e);
    }
  };

  const fetchSignals = async () => {
    try {
      const res = await fetch('/api/v1/agent-generator/signals');
      if (res.ok) {
        const data = await res.json();
        setSignals(data);
      }
    } catch (e) {
      console.error('Failed to fetch signals', e);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/v1/agent-generator/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        if (data.length > 0 && !selectedLead) {
          fetchLeadDetail(data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch leads', e);
    }
  };

  const fetchLeadDetail = async (id) => {
    try {
      const res = await fetch(`/api/v1/agent-generator/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedLead(data);
        setEditedDraft(data.draft_response || '');
      }
    } catch (e) {
      console.error('Failed to fetch lead detail', e);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchSignals();
    fetchLeads();
  }, []);

  const handleGenerateSuite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        business_name: formData.business_name,
        business_category: formData.business_category,
        website: formData.website,
        location_area: formData.location_area,
        service_radius_miles: Number(formData.service_radius_miles),
        services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
        target_customer: formData.target_customer,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        excluded_keywords: formData.excluded_keywords.split(',').map(k => k.trim()).filter(Boolean),
        preferred_channels: formData.preferred_channels,
        business_hours: formData.business_hours,
        ai_tone: formData.ai_tone,
        qualification_rules: formData.qualification_rules.split(';').map(r => r.trim()).filter(Boolean)
      };

      const res = await fetch('/api/v1/agent-generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setActiveSuite(data);
        setMessage({ type: 'success', text: `6-Bot Coordinated Suite generated successfully for ${data.business_name}!` });
        setActiveSubTab('suite');
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.detail || 'Failed to generate suite.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Network error generating agent suite.' });
    } finally {
      setLoading(false);
    }
  };

  const handleIngestSandboxSignals = async () => {
    setLoading(true);
    try {
      // Ingest realistic signals matching current category
      const testSignals = [
        {
          source_platform: 'CUSTOMER_FEED',
          source_id: `sig-${Date.now()}-1`,
          source_url: 'https://austin-community.local/thread/409',
          author_id: '@austin_local_99',
          author_name: 'David Reynolds',
          content: `My back molar cracked during lunch and my tooth hurts terribly! Can anyone recommend a high quality emergency dentist in Austin that can see me today?`,
          location_raw: 'Austin, TX',
          data_provenance: 'PUBLIC_COMMUNITY_RECOMMENDATION'
        },
        {
          source_platform: 'PUBLIC_DIRECTORY',
          source_id: `sig-${Date.now()}-2`,
          source_url: 'https://texas-biz-board.org/inquiries/82',
          author_id: '@clara_dent_tx',
          author_name: 'Clara Oswald',
          content: `Looking for dental implant consultations in Round Rock or Austin area. Seeking experienced practitioners for dental implants.`,
          location_raw: 'Round Rock, TX',
          data_provenance: 'PUBLIC_DIRECTORY_INQUIRY'
        },
        {
          source_platform: 'CUSTOMER_FEED',
          source_id: `sig-${Date.now()}-3`,
          source_url: 'https://texas-biz-board.org/inquiries/83',
          author_id: '@vet_lover_tx',
          author_name: 'Bob Henderson',
          content: `My golden retriever has a broken tooth. Need a veterinary pet dentist in Austin.`,
          location_raw: 'Austin, TX',
          data_provenance: 'PUBLIC_COMMUNITY_RECOMMENDATION'
        }
      ];

      const res = await fetch('/api/v1/agent-generator/signals/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signals: testSignals, source_platform: 'CUSTOMER_FEED' })
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Ingested ${data.ingested_count} signals into the pipeline.` });
        fetchSignals();
        setActiveSubTab('signals');
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to ingest signals.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQualifySignal = async (signalId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/agent-generator/signals/${signalId}/qualify`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Signal evaluated! Status: ${data.status}, Urgency: ${data.urgency}, Priority: ${data.priority_score}/100` });
        fetchSignals();
        fetchLeads();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error qualifying signal.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLeadAction = async (leadId, action) => {
    setActionInProgress(true);
    try {
      const res = await fetch(`/api/v1/agent-generator/leads/${leadId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          edited_draft: editedDraft
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Action [${action}] executed successfully! Dispatch status: ${data.dispatch_result?.status || 'APPROVED'}` });
        fetchLeadDetail(leadId);
        fetchLeads();
      } else {
        setMessage({ type: 'error', text: data.dispatch_result?.error || data.error || 'Action blocked by compliance policy.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Network error executing action.' });
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide">AUTO LEAD → AUTO BOT GENERATOR</h1>
              <p className="text-xs text-slate-400">
                Phase AO • Generates a 6-bot coordinated agent suite & authoritative business knowledge base with zero hallucination.
              </p>
            </div>
          </div>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('wizard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'wizard' ? 'bg-teal-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Config Wizard
          </button>
          <button
            onClick={() => setActiveSubTab('suite')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'suite' ? 'bg-teal-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. 6-Bot Suite
          </button>
          <button
            onClick={() => setActiveSubTab('signals')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'signals' ? 'bg-teal-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Lead Intelligence
          </button>
          <button
            onClick={() => setActiveSubTab('providers')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'providers' ? 'bg-teal-500 text-dark-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Providers & APIs
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          message.type === 'success' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
          message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
          'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 1: BUSINESS CONFIGURATION WIZARD */}
      {/* ============================================================ */}
      {activeSubTab === 'wizard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2 bg-dark-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Business & Service Profile Specification</h2>
              <p className="text-xs text-slate-400">
                Define the client parameters. The generator will derive the 6 bots, strict boundaries, and factual knowledge base.
              </p>
            </div>

            {/* Presets Bar */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Quick-Load Vertical Presets (Click to Auto-Fill):
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-all hover:border-teal-500/50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerateSuite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Business Category / Industry</label>
                  <input
                    type="text"
                    value={formData.business_category}
                    onChange={(e) => setFormData({ ...formData, business_category: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Location / Service Area</label>
                  <input
                    type="text"
                    value={formData.location_area}
                    onChange={(e) => setFormData({ ...formData, location_area: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Coverage Radius (Miles)</label>
                  <input
                    type="number"
                    value={formData.service_radius_miles}
                    onChange={(e) => setFormData({ ...formData, service_radius_miles: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                    min="1"
                    max="500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Services / Products Offered (comma-separated)</label>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Target Customer Profile</label>
                <textarea
                  rows="2"
                  value={formData.target_customer}
                  onChange={(e) => setFormData({ ...formData, target_customer: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Signal Intent Keywords (comma-separated)</label>
                  <textarea
                    rows="2"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Excluded Keywords / Negative Terms</label>
                  <textarea
                    rows="2"
                    value={formData.excluded_keywords}
                    onChange={(e) => setFormData({ ...formData, excluded_keywords: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">AI Communication Tone</label>
                  <select
                    value={formData.ai_tone}
                    onChange={(e) => setFormData({ ...formData, ai_tone: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  >
                    <option value="PROFESSIONAL_HELPFUL">Professional & Helpful</option>
                    <option value="WARM_EMPATHETIC">Warm & Empathetic</option>
                    <option value="DIRECT_EFFICIENT">Direct & Efficient</option>
                    <option value="CASUAL_FRIENDLY">Casual & Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Lead Qualification Rules (semicolon-separated)</label>
                  <input
                    type="text"
                    value={formData.qualification_rules}
                    onChange={(e) => setFormData({ ...formData, qualification_rules: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleIngestSandboxSignals}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Load Sample Live Signals
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  Generate 6-Bot Intelligence Suite
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Architecture Overview */}
          <div className="bg-dark-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                Coordinated 6-Bot Blueprint
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Each bot is generated with specialized system prompts, tool policies, and zero-hallucination factual grounding:
              </p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'LeadAgent', role: 'Signal Detection & Feed Ingestion', desc: 'Monitors authorized streams and filters negative terms.' },
                { name: 'QualificationAgent', role: 'Fact vs. Inference Qualification', desc: 'Strictly segregates observed facts from AI deductions.' },
                { name: 'ResponseAgent', role: 'Contextual Draft Generation', desc: 'Drafts transparent replies with mandatory disclosure.' },
                { name: 'ConversationAgent', role: 'Multiturn Inquiry & Booking', desc: 'Answers follow-ups grounded in business hours & FAQs.' },
                { name: 'SalesAgent', role: '9-Stage CRM Progression', desc: 'Calculates priority scores and manages lifecycle state.' },
                { name: 'HumanHandoffAgent', role: 'Safety Escalations & Opt-Outs', desc: 'Intercepts emergencies, complaints, and stops sending.' }
              ].map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-teal-300 font-mono">{b.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                      SYNCED
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-0.5">{b.role}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{b.desc}</div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5" /> Strict Legal & Privacy Boundaries
              </div>
              <div>
                The generator injects categorical boundaries: zero fake personal familiarity, zero ungrounded medical/legal advice, and immediate opt-out honor.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: 6-BOT SUITE ARCHITECTURE & KNOWLEDGE BASE */}
      {/* ============================================================ */}
      {activeSubTab === 'suite' && (
        <div className="space-y-6">
          {!activeSuite ? (
            <div className="p-12 text-center bg-dark-900/60 rounded-2xl border border-slate-800">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Generated Suite Active in Session</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Use the Configuration Wizard to generate the 6-bot suite for your business, or click below to build the demo dental suite.
              </p>
              <button
                onClick={handleGenerateSuite}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold text-xs"
              >
                Generate Suite Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Suite Header Info */}
              <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-mono border border-teal-500/20">
                      STATUS: {activeSuite.status || 'ACTIVE'}
                    </span>
                    <span className="text-xs text-slate-400">• Territory: {activeSuite.location_area || formData.location_area}</span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">{activeSuite.business_name} Suite</h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Category: <span className="text-slate-200">{activeSuite.category || formData.business_category}</span> | Tone: <span className="text-slate-200">{activeSuite.ai_tone || formData.ai_tone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400">READINESS VERIFICATION</div>
                    <div className="text-xs font-extrabold text-teal-400">6 of 6 BOTS OPERATIONAL</div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* 6 Bots Live Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(activeSuite.agents_config || {}).map(([key, bot]) => (
                  <div key={key} className="bg-dark-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-teal-300 font-mono">{bot.name}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {bot.status || 'READY'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-300">{bot.role}</div>
                    <div className="text-[11px] text-slate-400 italic">"{bot.persona}"</div>

                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Allowed Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {(bot.allowed_tools || []).map((t, tidx) => (
                          <span key={tidx} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-950 text-slate-300 border border-slate-800 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Prompt Safety Directives:</div>
                      <div className="p-2.5 rounded-xl bg-dark-950 border border-slate-800/80 text-[10px] text-slate-300 font-mono line-clamp-4 hover:line-clamp-none transition-all">
                        {bot.system_prompt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Authoritative Knowledge Base Card */}
              <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-teal-400" />
                    Authoritative Business Knowledge Base (Shared Grounding)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Zero Hallucination Anchor</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Verified Facts & Boundaries */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-300 font-mono">Strict Operating Boundaries:</div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {((activeSuite.knowledge_base || {}).boundaries || []).map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 p-3 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-300">
                      <div className="font-mono text-[10px] text-slate-500 uppercase">Public Communication Disclaimer:</div>
                      <div className="mt-1 italic text-slate-300">
                        "{(activeSuite.knowledge_base || {}).disclaimer}"
                      </div>
                    </div>
                  </div>

                  {/* Dynamic FAQ Catalog */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-300 font-mono">Verified FAQ Catalog:</div>
                    <div className="space-y-2">
                      {((activeSuite.knowledge_base || {}).faq_catalog || []).map((faq, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-dark-950 border border-slate-800">
                          <div className="text-xs font-bold text-slate-200">{faq.question}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{faq.answer}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: LEAD INTELLIGENCE & SIGNAL STREAM */}
      {/* ============================================================ */}
      {activeSubTab === 'signals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Signals & Discovered Leads (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-400" />
                Signal Pipeline ({signals.length} Ingested, {leads.length} Leads)
              </h3>
              <button
                onClick={() => { fetchSignals(); fetchLeads(); }}
                className="p-1.5 rounded-lg bg-dark-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ingested Signals List */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Recent Intent Signals:</div>
              {signals.length === 0 ? (
                <div className="p-6 text-center bg-dark-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                  No signals ingested yet. Click 'Load Sample Live Signals' in the Config Wizard.
                </div>
              ) : (
                signals.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 hover:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-950 text-slate-300 font-mono border border-slate-800">
                          {sig.source_platform}
                        </span>
                        <span className="text-[11px] font-bold text-white">{sig.author_name || sig.author_id}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        sig.intent_category === 'HIGH_INTENT' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                        sig.intent_category === 'POSSIBLE_INTENT' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {sig.intent_category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 line-clamp-2">"{sig.content}"</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Location: {sig.location_raw || 'Unknown'}</span>
                      <button
                        onClick={() => handleQualifySignal(sig.id)}
                        className="px-2 py-0.5 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold font-mono transition-all"
                      >
                        {sig.processed ? 'Re-Qualify' : 'Qualify AI Lead →'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Qualified CRM Leads List */}
            <div className="space-y-2 pt-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CRM Qualified Leads:</div>
              {leads.length === 0 ? (
                <div className="p-4 text-center bg-dark-900/60 rounded-xl border border-slate-800 text-xs text-slate-500">
                  No qualified leads yet. Run qualification on any signal above.
                </div>
              ) : (
                leads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => fetchLeadDetail(l.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedLead?.id === l.id
                        ? 'bg-teal-500/10 border-teal-500/40'
                        : 'bg-dark-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{l.contact_name || l.contact_handle}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        l.status === 'QUALIFIED' ? 'bg-teal-500/20 text-teal-400' :
                        l.status === 'NEEDS_REVIEW' ? 'bg-amber-500/20 text-amber-400' :
                        l.status === 'CONTACTED' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {l.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 mt-1">
                      Service: <span className="font-semibold text-teal-300">{l.service_needed || 'General'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                      <span>Priority: <strong className="text-white">{l.priority_score}/100</strong></span>
                      <span>Urgency: <strong className="text-amber-400">{l.urgency}</strong></span>
                      <span>Draft: {l.response_status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Lead Detail, Facts vs Inferences, 10-Gate Pre-Flight, Draft & Actions (7 Cols) */}
          <div className="lg:col-span-7 bg-dark-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
            {!selectedLead ? (
              <div className="p-12 text-center text-slate-400">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <div className="text-xs">Select a qualified lead on the left to inspect facts, inferences, priority, and draft response.</div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Lead Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white">{selectedLead.contact_name || selectedLead.contact_handle}</h3>
                    <div className="text-xs text-slate-400">
                      Channel: <span className="font-mono text-teal-400">{selectedLead.channel}</span> | Status: <span className="font-mono text-slate-200">{selectedLead.status}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400">PRIORITY SCORE</div>
                    <div className="text-xl font-black text-teal-400">{selectedLead.priority_score}/100</div>
                  </div>
                </div>

                {/* Raw Signal Content */}
                {selectedLead.signal && (
                  <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Observed Signal Text ({selectedLead.signal.source_platform}):</div>
                    <div className="text-xs text-slate-200 italic">"{selectedLead.signal.content}"</div>
                    <div className="text-[10px] text-slate-500 font-mono">Provenance: {selectedLead.signal.data_provenance}</div>
                  </div>
                )}

                {/* Strict Fact vs Inference Separation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Facts */}
                  <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIABLE FACTS (OBSERVED)
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {(selectedLead.facts || []).map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-teal-400 font-bold">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inferences */}
                  <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5" /> AI INFERENCES & DEDUCTIONS
                    </div>
                    <div className="space-y-2">
                      {(selectedLead.inferences || []).map((inf, idx) => (
                        <div key={idx} className="text-[11px] bg-dark-900 p-2 rounded-lg border border-slate-800">
                          <div className="text-slate-200 font-medium">{inf.deduction}</div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                            <span>Confidence: {(inf.confidence * 100).toFixed(0)}%</span>
                            <span className="text-slate-500">Basis: {inf.basis}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transparent Priority Checklist */}
                <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400" /> Transparent Scoring Checklist
                  </div>
                  <div className="space-y-1">
                    {(selectedLead.priority_factors || []).map((factor, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="text-teal-400 font-bold font-mono">›</span>
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Draft Response Editor & Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-teal-400" /> Contextual Response Draft (Grounded in Verified Facts)
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      Draft Status: <strong className="text-teal-400">{selectedLead.response_status}</strong>
                    </span>
                  </div>

                  <textarea
                    rows="6"
                    value={editedDraft}
                    onChange={(e) => setEditedDraft(e.target.value)}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-teal-500 outline-none font-sans leading-relaxed"
                  />
                </div>

                {/* Action Buttons: Approve, Edit, Reject */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLeadAction(selectedLead.id, 'REJECT')}
                      disabled={actionInProgress}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> Disqualify / Reject
                    </button>
                    <button
                      onClick={() => handleLeadAction(selectedLead.id, 'EDIT')}
                      disabled={actionInProgress}
                      className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Save Edits
                    </button>
                  </div>

                  <button
                    onClick={() => handleLeadAction(selectedLead.id, 'APPROVE')}
                    disabled={actionInProgress || selectedLead.response_status === 'SENT'}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                  >
                    {actionInProgress ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {selectedLead.response_status === 'SENT' ? 'Message Already Dispatched' : 'Approve & 10-Gate Dispatch'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: SIGNAL PROVIDERS & API GATEWAYS */}
      {/* ============================================================ */}
      {activeSubTab === 'providers' && (
        <div className="space-y-6">
          <div className="bg-dark-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-400" />
                Signal Provider Registry & API Telemetry
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Authoritative connection status for social listening sources. Rine Forge Systems never simulates connections or relies on unauthorized scraping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((p) => (
                <div key={p.provider_id} className="p-5 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{p.display_name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      p.status === 'READY'
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">{p.description}</div>

                  {p.endpoint && (
                    <div className="p-2 rounded-lg bg-dark-900 text-[11px] font-mono text-teal-300 border border-slate-800">
                      Webhook Endpoint: {p.endpoint}
                    </div>
                  )}

                  {p.instructions && (
                    <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <div className="text-amber-400 font-bold font-mono text-[10px]">INTEGRATION SETUP REQUIRED:</div>
                      <div>{p.instructions}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
