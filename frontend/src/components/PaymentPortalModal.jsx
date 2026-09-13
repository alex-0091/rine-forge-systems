import React, { useState } from 'react';
import { 
  X, Check, Copy, ShieldCheck, CreditCard, Landmark, 
  Wallet, FileText, ArrowRight, CheckCircle2, Lock, 
  AlertCircle, Sparkles, Send, Download
} from 'lucide-react';

const PRICING_PACKAGES = [
  {
    id: 'ai-receptionist',
    name: '24/7 AI Business Receptionist',
    regularPrice: 1200,
    discountPrice: 499,
    depositRequired: 249,
    popular: true,
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
    name: 'Speed-to-Lead Inbound Pipeline',
    regularPrice: 1500,
    discountPrice: 599,
    depositRequired: 299,
    popular: false,
    features: [
      'Sub-60s Inbound Webhook Qualification',
      'Autonomous 2-Way SMS & Email Follow-Ups',
      'Automated Lead Intent & Budget Scoring',
      'Direct Zillow, Realtor & Webhook Sync',
      'Full Source Code & Database Integration'
    ]
  },
  {
    id: 'full-web-ai-suite',
    name: 'Full Custom Web & AI Utility Suite',
    regularPrice: 2200,
    discountPrice: 799,
    depositRequired: 399,
    popular: true,
    features: [
      'Bespoke Next.js / FastAPI Production Platform',
      'Custom AI Tool Suite (Logos, Whitepapers, Plans)',
      'Multi-Model LLM Ingest (Gemini, GPT-4o, Grok)',
      'Payment & Database Schema Setup',
      '100% IP & Repository Ownership Transfer'
    ]
  },
  {
    id: 'quant-trading-bot',
    name: 'Algorithmic Quant & Prediction Engine',
    regularPrice: 2800,
    discountPrice: 899,
    depositRequired: 449,
    popular: false,
    features: [
      'MEXC / Binance WebSocket Orderbook Stream',
      'Sub-50ms Grid & Trend Execution Engine',
      'Automated Risk Guard & Circuit Breaker',
      'Historical Backtesting & Strategy Matrix',
      'Private Dedicated Server Docker Deployment'
    ]
  }
];

export function PaymentPortalModal({ isOpen, onClose, defaultPackageId = 'ai-receptionist', initialService }) {
  const [selectedPkgId, setSelectedPkgId] = useState(initialService || defaultPackageId || 'ai-receptionist');
  const [paymentRail, setPaymentRail] = useState('euro_bank'); // 'euro_bank', 'usd_bank', 'crypto_usdt'
  const [copiedField, setCopiedField] = useState('');

  // Proof form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [txReference, setTxReference] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentPkg = PRICING_PACKAGES.find(p => p.id === selectedPkgId) || PRICING_PACKAGES[0];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setSubmittedReceipt({
        receiptId: `RFS-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
        packageName: currentPkg.name,
        depositAmount: `$${currentPkg.depositRequired} USD`,
        balanceRemaining: `$${currentPkg.discountPrice - currentPkg.depositRequired} USD`,
        paymentRail: paymentRail.toUpperCase().replace('_', ' '),
        txReference: txReference,
        clientName: clientName,
        clientEmail: clientEmail,
        timestamp: new Date().toUTCString(),
        status: 'DEPOSIT CONFIRMATION PENDING DISPATCH'
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-dark-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-black text-dark-950 text-lg shadow-md font-mono">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">RINE FORGE SYSTEMS</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-bold">
                  50% MILESTONE SETTLEMENT
                </span>
              </div>
              <p className="text-xs text-slate-400">Institutional Escrow & Milestone Deposit Terminal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReceipt ? (
          /* Receipt View */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Deposit Transfer Dispatched</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Your 50% milestone deposit proof and custom specifications have been registered under Reference <strong className="text-teal-400 font-mono">{submittedReceipt.receiptId}</strong>.
              </p>
            </div>

            <div className="p-6 bg-dark-950 border border-slate-800 rounded-2xl max-w-xl mx-auto text-left font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Selected System:</span>
                <span className="text-white font-bold">{submittedReceipt.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">50% Deposit Paid:</span>
                <span className="text-emerald-400 font-bold">{submittedReceipt.depositAmount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">50% Final Settlement Balance:</span>
                <span className="text-slate-200">{submittedReceipt.balanceRemaining} (Upon QA & Deployment)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Payment Rail:</span>
                <span className="text-teal-400">{submittedReceipt.paymentRail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Transaction / Wire Ref:</span>
                <span className="text-white truncate max-w-[200px]">{submittedReceipt.txReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Client Contact:</span>
                <span className="text-slate-300">{submittedReceipt.clientName} ({submittedReceipt.clientEmail})</span>
              </div>
            </div>

            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xs text-slate-300 max-w-xl mx-auto space-y-1">
              <div className="font-bold text-teal-400">Next Step: Dedicated Architecture Staging</div>
              <p>Alex Rine and our lead engineering team will confirm on-chain / bank ledger receipt and initialize your dedicated staging environment within 6 hours.</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Print / Save Milestone Receipt
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs"
              >
                Return to Agency Base
              </button>
            </div>
          </div>
        ) : (
          /* Payment Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Package Selection & Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono uppercase text-teal-400 font-bold">1. Select Target System Package</div>
              <div className="space-y-2.5">
                {PRICING_PACKAGES.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-500/10 border-teal-500 shadow-md shadow-teal-500/10'
                          : 'bg-dark-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-xs text-white">{pkg.name}</div>
                        {pkg.popular && (
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md font-bold">
                            TOP VALUE
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-black text-teal-400 font-mono">${pkg.discountPrice}</span>
                        <span className="text-xs text-slate-500 line-through font-mono">${pkg.regularPrice}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold ml-auto">
                          Deposit: ${pkg.depositRequired} (50%)
                        </span>
                      </div>

                      <ul className="text-[10px] text-slate-400 space-y-1">
                        {pkg.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Commercial Terms Badge */}
              <div className="p-3 bg-dark-950 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> 100% Guaranteed Milestone Protection
                </div>
                <div>50% initial milestone initiates development; final 50% only due upon satisfactory staging delivery.</div>
              </div>
            </div>

            {/* Right: Payment Channels & Proof Form */}
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-mono uppercase text-teal-400 font-bold">2. Official Settlement Rails</div>

              {/* Rail Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentRail('euro_bank')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                    paymentRail === 'euro_bank'
                      ? 'bg-teal-500 text-dark-950 border-teal-500 shadow-md'
                      : 'bg-dark-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>Euro Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('usd_bank')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                    paymentRail === 'usd_bank'
                      ? 'bg-teal-500 text-dark-950 border-teal-500 shadow-md'
                      : 'bg-dark-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>USD Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('crypto_usdt')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                    paymentRail === 'crypto_usdt'
                      ? 'bg-teal-500 text-dark-950 border-teal-500 shadow-md'
                      : 'bg-dark-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>USDT (BEP-20)</span>
                </button>
              </div>

              {/* Account Details Box */}
              <div className="p-4 bg-dark-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                {paymentRail === 'euro_bank' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-teal-400 text-[11px] font-bold">
                      <span>Albaraka Türk (Euro Settlement)</span>
                      <span className="text-slate-400">Istanbul, Turkey</span>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400">EURO IBAN:</div>
                      <div className="flex items-center justify-between p-2 bg-dark-900 border border-slate-800 rounded-lg text-white font-bold">
                        <span className="text-xs select-all">TR61 0020 3000 1164 1361 0000 04</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('TR61 0020 3000 1164 1361 0000 04', 'euro_iban')}
                          className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-md text-[10px] flex items-center gap-1"
                        >
                          {copiedField === 'euro_iban' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedField === 'euro_iban' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Beneficiary:</span>
                        <div className="text-white font-bold">Owais ahmed</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Bank:</span>
                        <div className="text-white font-bold">Albaraka Türk</div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentRail === 'usd_bank' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-teal-400 text-[11px] font-bold">
                      <span>Albaraka Türk (USD Settlement)</span>
                      <span className="text-slate-400">Istanbul, Turkey</span>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400">USD DOLLAR IBAN:</div>
                      <div className="flex items-center justify-between p-2 bg-dark-900 border border-slate-800 rounded-lg text-white font-bold">
                        <span className="text-xs select-all">TR88 0020 3000 1164 1361 0000 03</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('TR88 0020 3000 1164 1361 0000 03', 'usd_iban')}
                          className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-md text-[10px] flex items-center gap-1"
                        >
                          {copiedField === 'usd_iban' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedField === 'usd_iban' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Beneficiary:</span>
                        <div className="text-white font-bold">Owais ahmed</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Bank:</span>
                        <div className="text-white font-bold">Albaraka Türk</div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentRail === 'crypto_usdt' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-teal-400 text-[11px] font-bold">
                      <span>USDT • BNB Smart Chain (BEP20)</span>
                      <span className="text-slate-400">Sub-10s Settlement</span>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400">BEP-20 WALLET ADDRESS:</div>
                      <div className="flex items-center justify-between p-2 bg-dark-900 border border-slate-800 rounded-lg text-white font-bold">
                        <span className="text-[11px] select-all truncate max-w-[280px]">
                          0x3102200218a860c5057270afa3504ee4dc318f8f
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy('0x3102200218a860c5057270afa3504ee4dc318f8f', 'crypto_addr')}
                          className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-md text-[10px] flex items-center gap-1"
                        >
                          {copiedField === 'crypto_addr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedField === 'crypto_addr' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Send only USDT via BNB Smart Chain (BEP20). Instant ledger credit.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Deposit Proof Form */}
              <form onSubmit={handleDepositSubmit} className="space-y-3 pt-1">
                <div className="text-xs font-mono uppercase text-teal-400 font-bold">3. Submit 50% Deposit Proof</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="email"
                    placeholder="Business Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Wire Reference No. or Crypto Tx Hash (e.g. 0x4f8a...)"
                  value={txReference}
                  onChange={(e) => setTxReference(e.target.value)}
                  required
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-teal-500"
                />

                <textarea
                  placeholder="Custom requirements, integrations, or specific domain features needed..."
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-teal-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSubmitting ? 'Confirming Milestone Deposit...' : `Submit 50% Milestone Deposit ($${currentPkg.depositRequired} USD) →`}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
