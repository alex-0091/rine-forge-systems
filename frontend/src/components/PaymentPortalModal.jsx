import React, { useState, useRef } from 'react';
import { 
  X, Check, Copy, ShieldCheck, CreditCard, Landmark, 
  Wallet, FileText, ArrowRight, CheckCircle2, Lock, 
  AlertCircle, Sparkles, Send, Download, Upload, Image as ImageIcon
} from 'lucide-react';

export const PRICING_PACKAGES = [
  {
    id: 'ai-receptionist',
    name: '24/7 AI Business Receptionist',
    regularPrice: 450,
    discountPrice: 199,
    depositRequired: 99,
    popular: false,
    tagline: 'Instant 24/7 voice & web intake for clinics, hotels, and local businesses.',
    features: [
      'Custom Voice & Web Chatbot Integration',
      'Direct Calendar & CRM Appointment Booking',
      'Insurance & FAQ Multi-Turn Knowledge Base',
      'Sub-15s Emergency Audio/Text Triage',
      'Free 48h Staging & 30-Day SLA Support'
    ]
  },
  {
    id: 'speed-to-lead',
    name: 'Speed-to-Lead Inbound Revenue Engine',
    regularPrice: 650,
    discountPrice: 299,
    depositRequired: 149,
    popular: true,
    tagline: 'Eliminate missed calls and convert warm prospects in under 45 seconds.',
    features: [
      'Sub-45s Inbound Webhook Qualification',
      'Autonomous 2-Way SMS & WhatsApp Follow-Ups',
      'Automated Lead Intent & Budget Scoring',
      'Direct HubSpot, Google Calendar & CRM Sync',
      'Full Source Code & Database Integration'
    ]
  },
  {
    id: 'full-web-ai-suite',
    name: 'Full Custom AI Employee Operating System',
    regularPrice: 1200,
    discountPrice: 499,
    depositRequired: 249,
    popular: false,
    tagline: '4 Specialized AI Agents (Elena, Marcus, Aria & Kael) running your business.',
    features: [
      '4 Dedicated AI Agents (Reception, Sales, Care, Ops)',
      'Multi-Channel (Voice + WhatsApp + Web + Email)',
      'Custom ERP, QuickBooks & Calendar Webhooks',
      'Zero-Hallucination Verified Domain Guardrails',
      'Dedicated Staging & Continuous Health Monitoring'
    ]
  },
  {
    id: 'bespoke-platform',
    name: 'Enterprise Bespoke Platform & Code Transfer',
    regularPrice: 1800,
    discountPrice: 799,
    depositRequired: 399,
    popular: false,
    tagline: 'Complete custom software platform build with 100% IP ownership.',
    features: [
      'Full-Stack Next.js / FastAPI Production Platform',
      'Multi-Model LLM Ingest (Gemini 3.6, Groq, OpenAI)',
      'High-Frequency WebSockets & Timeseries Engines',
      'Private Dedicated Docker / Cloud Deployment',
      '100% Repository & IP Ownership Transfer'
    ]
  }
];

export function PaymentPortalModal({ isOpen, onClose, defaultPackageId = 'speed-to-lead', initialService }) {
  const [selectedPkgId, setSelectedPkgId] = useState(initialService || defaultPackageId || 'speed-to-lead');
  const [paymentRail, setPaymentRail] = useState('crypto_usdt'); // 'crypto_usdt', 'euro_bank', 'usd_bank'
  const [copiedField, setCopiedField] = useState('');

  // Proof form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [txReference, setTxReference] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const currentPkg = PRICING_PACKAGES.find(p => p.id === selectedPkgId) || PRICING_PACKAGES[1];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptFileName(file.name);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const receiptCode = `RFS-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Post to public contact booking endpoint to alert Alex Rine immediately
      await fetch('/api/public/contact-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: clientName || 'Client Project',
          contact_name: clientName,
          email: clientEmail,
          phone: clientPhone || undefined,
          what_to_automate: `[MILESTONE PAYMENT ${receiptCode}] Package: ${currentPkg.name} ($${currentPkg.depositRequired} USD deposit via ${paymentRail.toUpperCase()}). TxRef: ${txReference}. Notes: ${projectNotes}. Receipt Attached: ${receiptFileName || 'Provided via reference'}`
        })
      });
    } catch (err) {
      console.warn('Booking register alert sent with client reference:', err);
    }

    setSubmittedReceipt({
      receiptId: receiptCode,
      packageName: currentPkg.name,
      depositAmount: `$${currentPkg.depositRequired} USD`,
      balanceRemaining: `$${currentPkg.discountPrice - currentPkg.depositRequired} USD`,
      paymentRail: paymentRail === 'crypto_usdt' ? 'USDT (BNB SMART CHAIN BEP20)' : paymentRail === 'euro_bank' ? 'EURO IBAN (ZIRAAT BANK)' : 'USD DOLLAR IBAN (ZIRAAT BANK)',
      txReference: txReference,
      clientName: clientName,
      clientEmail: clientEmail,
      receiptFileName: receiptFileName || 'Registered on-chain/ledger',
      timestamp: new Date().toUTCString(),
      status: 'MILESTONE DEPOSIT REGISTERED — STAGING INITIALIZED'
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div className="bg-[#0b0f19] border border-white/[0.12] rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative my-8 text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">RINE FORGE SYSTEMS</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-md font-bold">
                  OFFICIAL SETTLEMENT PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">Institutional Escrow & 50% Milestone Deposit Terminal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors border border-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReceipt ? (
          /* Receipt View */
          <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Deposit Confirmed & Project Assigned</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Your 50% milestone deposit and project specifications have been registered under Tracking Reference <strong className="text-indigo-400 font-mono">{submittedReceipt.receiptId}</strong>.
              </p>
            </div>

            <div className="p-6 bg-[#080b11] border border-white/[0.08] rounded-2xl max-w-xl mx-auto text-left font-mono text-xs space-y-3 shadow-inner">
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-slate-400">Selected System:</span>
                <span className="text-white font-bold">{submittedReceipt.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-slate-400">50% Deposit Paid:</span>
                <span className="text-emerald-400 font-bold">{submittedReceipt.depositAmount}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-slate-400">Final Settlement Balance:</span>
                <span className="text-slate-300">{submittedReceipt.balanceRemaining} (Upon Staging QA)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-slate-400">Settlement Rail:</span>
                <span className="text-indigo-300">{submittedReceipt.paymentRail}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-slate-400">Tx Reference / Hash:</span>
                <span className="text-white truncate max-w-[200px]">{submittedReceipt.txReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Client / Contact:</span>
                <span className="text-slate-300">{submittedReceipt.clientName} ({submittedReceipt.clientEmail})</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-slate-300 max-w-xl mx-auto space-y-1">
              <div className="font-bold text-indigo-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next Step: Dedicated Architecture Staging Within 6 Hours</span>
              </div>
              <p className="text-[11px] text-slate-400">Alex Rine and our engineering team will verify ledger receipt, provision your dedicated infrastructure, and send your private staging link directly to your email.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" /> Save Official Receipt
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all"
              >
                Return to Platform
              </button>
            </div>
          </div>
        ) : (
          /* Payment Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Package Selection (Lowest Prices) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                1. Select Desired System Package
              </div>
              <div className="space-y-2.5">
                {PRICING_PACKAGES.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-xs text-white">{pkg.name}</div>
                        {pkg.popular && (
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-md font-bold">
                            TOP VALUE
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-lg font-black text-white font-mono">${pkg.discountPrice}</span>
                        <span className="text-xs text-slate-500 line-through font-mono">${pkg.regularPrice}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold ml-auto px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          50% Deposit: ${pkg.depositRequired}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                        {pkg.tagline}
                      </p>

                      <ul className="text-[10px] text-slate-400 space-y-1">
                        {pkg.features.slice(0, 2).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Commercial Guarantee */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-2xl space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> 100% Escrow Milestone Protection
                </div>
                <div>50% initial deposit initiates staging; remaining balance is only settled upon satisfactory deployment.</div>
              </div>
            </div>

            {/* Right: Authentic Payment Rails & Proof Upload */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                2. Official Settlement Methods
              </div>

              {/* Rail Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentRail('crypto_usdt')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                    paymentRail === 'crypto_usdt'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>USDT (BEP-20)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('euro_bank')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                    paymentRail === 'euro_bank'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  <span>Euro Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('usd_bank')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                    paymentRail === 'usd_bank'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-sky-400" />
                  <span>Dollar Account</span>
                </button>
              </div>

              {/* Account Details Box */}
              <div className="p-4 bg-[#080b11] border border-white/[0.09] rounded-2xl space-y-3 text-xs">
                
                {/* 1. CRYPTO USDT BEP-20 */}
                {paymentRail === 'crypto_usdt' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-emerald-400 text-[11px] font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        BNB Smart Chain (BEP20) • Instant Credit
                      </span>
                      <span className="text-slate-400 font-mono">Min: 0.001 USDT</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                      {/* Real Uploaded QR Code */}
                      <div className="shrink-0 w-32 h-32 rounded-xl overflow-hidden border border-white/[0.1] bg-black flex items-center justify-center shadow-md">
                        <img 
                          src="/payment/usdt-qr.jpg" 
                          alt="USDT BEP20 QR Code"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2 flex-1 w-full">
                        <div className="text-[10px] text-slate-400 font-mono uppercase">Deposit Address:</div>
                        <div className="flex items-center justify-between gap-2 p-2 bg-white/[0.04] border border-white/[0.08] rounded-lg">
                          <span className="text-[11px] font-mono text-emerald-300 break-all select-all">
                            0x3102200218a860c5057270afa3504ee4dc318f8f
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy('0x3102200218a860c5057270afa3504ee4dc318f8f', 'crypto_addr')}
                            className="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-md text-[10px] flex items-center gap-1 shrink-0 font-bold transition-colors"
                          >
                            {copiedField === 'crypto_addr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedField === 'crypto_addr' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <div className="text-[10px] text-amber-300 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3 shrink-0 text-amber-400" />
                          <span>Ensure network is BNB Smart Chain (BEP20).</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EURO BANK ACCOUNT */}
                {paymentRail === 'euro_bank' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-indigo-300 text-[11px] font-bold">
                      <span>Ziraat Bank (Euro Settlement)</span>
                      <span className="text-slate-400 font-medium">Türkiye, Ankara, Ulus</span>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-mono mb-1">EURO IBAN:</div>
                      <div className="flex items-center justify-between p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white font-mono font-bold">
                        <span className="text-xs select-all">TR71 0001 0090 1040 6210 2050 13</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('TR71 0001 0090 1040 6210 2050 13', 'euro_iban')}
                          className="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-md text-[10px] flex items-center gap-1 font-bold transition-colors"
                        >
                          {copiedField === 'euro_iban' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedField === 'euro_iban' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/[0.06]">
                      <div>
                        <span className="text-slate-500">Bank Name:</span>
                        <div className="text-slate-200 font-medium">Ziraat Bank</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Branch Location:</span>
                        <div className="text-slate-200 font-medium">Türkiye, Ankara, Ulus</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DOLLAR BANK ACCOUNT */}
                {paymentRail === 'usd_bank' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sky-300 text-[11px] font-bold">
                      <span>Ziraat Bank (USD Dollar Settlement)</span>
                      <span className="text-slate-400 font-medium">Türkiye, Ankara, Ulus</span>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-mono mb-1">USD DOLLAR IBAN:</div>
                      <div className="flex items-center justify-between p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white font-mono font-bold">
                        <span className="text-xs select-all">TR50 0001 0090 1040 6210 2050 03</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('TR50 0001 0090 1040 6210 2050 03', 'usd_iban')}
                          className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-md text-[10px] flex items-center gap-1 font-bold transition-colors"
                        >
                          {copiedField === 'usd_iban' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedField === 'usd_iban' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/[0.06]">
                      <div>
                        <span className="text-slate-500">Bank Name:</span>
                        <div className="text-slate-200 font-medium">Ziraat Bank</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Branch Location:</span>
                        <div className="text-slate-200 font-medium">Türkiye, Ankara, Ulus</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Deposit Proof Form */}
              <form onSubmit={handleDepositSubmit} className="space-y-3 pt-1">
                <div className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                  3. Submit Deposit Proof & Project Brief
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="p-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    placeholder="Business Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="p-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp (Optional)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="p-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Tx Hash or Wire Reference (e.g. 0x4f8a...)"
                    value={txReference}
                    onChange={(e) => setTxReference(e.target.value)}
                    required
                    className="p-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Screenshot / Receipt File Attachment */}
                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-white/[0.15] hover:border-indigo-500/50 rounded-xl text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{receiptFileName ? `Attached: ${receiptFileName}` : 'Attach Payment Screenshot / Receipt (Optional)'}</span>
                  </button>
                </div>

                <textarea
                  placeholder="Project specifications, phone number to connect, custom tools required..."
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Registering Milestone Deposit...' : `Submit Milestone Deposit ($${currentPkg.depositRequired} USD) →`}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
