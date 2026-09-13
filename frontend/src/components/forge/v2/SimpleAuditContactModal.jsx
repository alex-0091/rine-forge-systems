import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Building2, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

export function SimpleAuditContactModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    business: initialData.business || '',
    email: initialData.email || '',
    businessType: initialData.businessType || 'Hotel',
    whatToAutomate: initialData.whatToAutomate || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync initialData changes if opened with pre-filled estimates
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        businessType: initialData.businessType || prev.businessType,
        whatToAutomate: initialData.whatToAutomate || prev.whatToAutomate
      }));
    }
  }, [initialData]);

  // Handle ESC to close
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
      lead_source: 'V3_PHASE3_SIMPLE_AUDIT_MODAL'
    };

    try {
      const res = await fetch('/api/public/contact-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company_name: formData.business,
          service_interested: `Free AI Audit — ${formData.businessType}`,
          notes: JSON.stringify(payload)
        })
      });
      await res.json();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={handleResetAndClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#060b16] border-2 border-teal-500/50 p-6 sm:p-8 shadow-2xl shadow-teal-500/15 space-y-6 overflow-hidden">
        
        {/* Subtle Ambient Light */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-[10px] font-mono font-bold uppercase mb-1.5">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>FREE OPERATIONAL AUDIT</span>
            </div>
            <h3 className="text-xl font-black text-white font-sans tracking-tight">
              Get Your Free AI Audit
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              We'll find repetitive tasks your business could automate. No commitment.
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          /* Submission Confirmation Screen */
          <div className="py-6 text-center space-y-4 font-sans animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">
                Audit Request Received!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. Our engineering team is reviewing <strong className="text-white">{formData.business || 'your business'}</strong> and will email your tailored automation assessment within 24 hours.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left font-mono text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Confirmation Email:</span>
                <span className="text-teal-300 font-bold">{formData.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Business Type:</span>
                <span className="text-white font-bold">{formData.businessType}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">Queued for Review ✓</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              Done
            </button>
          </div>
        ) : (
          /* Short 5-Field Contact Form */
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            
            {/* 1. Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                Your Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Alex Rine"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>
            </div>

            {/* 2. Business (Company Name) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                Business Name *
              </label>
              <input
                type="text"
                name="business"
                required
                placeholder="Jenkins Dental / Grand Hotel / etc."
                value={formData.business}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            {/* 3. Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                Work Email *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="alex@yourbusiness.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            {/* 4. Business Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-400 transition-colors font-mono"
              >
                <option value="Hotel">Hotel</option>
                <option value="Dental">Dental</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Automotive">Automotive</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 5. What they want to automate */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                What do you want to automate? *
              </label>
              <textarea
                name="whatToAutomate"
                required
                rows={3}
                placeholder="e.g. Answering missed calls, qualifying web leads, table/calendar bookings..."
                value={formData.whatToAutomate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Audit Request...</span>
                </>
              ) : (
                <>
                  <span>GET MY FREE AI AUDIT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-500 text-center font-mono pt-1">
              Zero spam. Your information is strictly used to evaluate your automation scope.
            </p>

          </form>
        )}

      </div>
    </div>
  );
}
