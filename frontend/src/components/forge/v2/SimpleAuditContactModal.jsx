import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Building2, Mail, User, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function SimpleAuditContactModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    business: initialData.business || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    businessType: initialData.businessType || 'Dental & Medical Practices',
    whatToAutomate: initialData.whatToAutomate || 'Missed calls & 24/7 call answering'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        businessType: initialData.businessType || prev.businessType,
        whatToAutomate: initialData.whatToAutomate || prev.whatToAutomate
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    forgeAudioSynth.playClick();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      submitted_at: new Date().toISOString(),
      lead_source: 'FREE_AI_OPPORTUNITY_AUDIT_MODAL'
    };

    try {
      await fetch('/api/public/contact-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.business,
          service_interested: `Free AI Audit — ${formData.businessType}`,
          notes: JSON.stringify(payload)
        })
      });
    } catch (err) {
      // Graceful local fallback
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      forgeAudioSynth.playSuccess();
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={handleResetAndClose} />

      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="audit-modal-heading"
        className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0c101a] border border-white/[0.12] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] space-y-6 overflow-hidden"
      >
        {/* Subtle Ambient Light */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Free Opportunity Audit</span>
            </div>
            <h3 id="audit-modal-heading" className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
              Get Your Free AI Audit
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Tell us about your business. We'll identify where AI automation could realistically save you time and capture more clients.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body or Success State */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name & Business */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full bg-[#080b11] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Business Name / Website *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="business"
                    required
                    value={formData.business}
                    onChange={handleChange}
                    placeholder="e.g. Apex Dental Care"
                    className="w-full bg-[#080b11] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@apexdental.com"
                    className="w-full bg-[#080b11] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Phone (for SMS recap)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full bg-[#080b11] border border-white/[0.08] focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Your Industry / Sector
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full bg-[#080b11] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
              >
                <option value="Dental & Medical Practices">Dental & Medical Practices</option>
                <option value="Salons & Med Spas">Salons & Med Spas</option>
                <option value="Hotels & Hospitality">Hotels & Hospitality</option>
                <option value="Home Services & Trades">Home Services & Trades (HVAC, Plumbing, Electrical)</option>
                <option value="Real Estate Agencies">Real Estate Agencies</option>
                <option value="Law Firms">Law Firms & Legal Practices</option>
                <option value="Professional Services">Professional Services & Consulting</option>
                <option value="Other Local Business">Other Local Business</option>
              </select>
            </div>

            {/* What to Automate */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                Primary Goal / Bottleneck to Solve
              </label>
              <select
                name="whatToAutomate"
                value={formData.whatToAutomate}
                onChange={handleChange}
                className="w-full bg-[#080b11] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
              >
                <option value="Missed calls & 24/7 call answering">Answering missed calls & after-hours phone triage</option>
                <option value="Instant lead follow-up & SMS">Responding to form leads within 60 seconds via SMS</option>
                <option value="Appointment booking & calendar sync">Automating appointment booking directly to our calendar</option>
                <option value="Repetitive customer FAQs & support">Freeing staff from repetitive pricing & hours inquiries</option>
                <option value="Custom operational workflow">Custom CRM sync, document processing, or admin workflow</option>
              </select>
            </div>

            {/* Trust Footer */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Strict privacy. Zero spam. We never share your data.</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Operational Bottlenecks...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT FOR FREE AI AUDIT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Audit Request Received!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, {formData.name || 'there'}. We are reviewing {formData.business || 'your business'} and will deliver a clear automation blueprint to <strong className="text-white">{formData.email}</strong> within 24 hours.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left text-xs font-mono text-slate-400 space-y-1">
              <div className="text-white font-bold">What happens next:</div>
              <div>1. We map your service hours, call flows, and customer journey.</div>
              <div>2. We identify the top 3 high-ROI automation opportunities.</div>
              <div>3. You receive a realistic implementation plan showing exact time & cost savings.</div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="py-2.5 px-6 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] text-xs font-semibold"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
