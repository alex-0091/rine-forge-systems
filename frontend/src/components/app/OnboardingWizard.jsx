import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building2, 
  Layers, Server, Zap, RefreshCw, Check, Bot, FileText, 
  MessageSquare, ShieldCheck, Play, Terminal 
} from 'lucide-react';
import { SYSTEMS_CATALOG, INTEGRATIONS_CATALOG } from '../../data/forgePlatformConfig';

export function OnboardingWizard({ onCompleteOnboarding, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const [formData, setFormData] = useState({
    businessName: 'Vance Dental Group',
    industry: 'Healthcare & Dental',
    primaryGoal: 'Automate after-hours patient inquiries and emergency bookings',
    selectedTools: ['Gmail', 'Google Calendar', 'Slack'],
    monthlyVolume: '200-500 inquiries',
    selectedSystemId: 'receptionist-agent',
    sandboxTestInput: 'Patient calling at 10 PM: Do you accept Delta Dental PPO for root canal exam this Saturday?'
  });

  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleTool = (name) => {
    setFormData(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(name)
        ? prev.selectedTools.filter(t => t !== name)
        : [...prev.selectedTools, name]
    }));
  };

  const runSandboxTest = () => {
    setTestRunning(true);
    setTimeout(() => {
      setTestResult({
        status: 'SUCCESS',
        intent: 'Emergency Clinical Inquiry',
        insurance: 'Delta Dental PPO — ACCEPTED (In-Network)',
        slotLocked: 'Saturday 11:30 AM (Dr. Reynolds)',
        crmAction: 'APPOINTMENT_COMMITTED_CALENDAR'
      });
      setTestRunning(false);
    }, 1200);
  };

  return (
    <div className="py-8 max-w-3xl mx-auto space-y-8 font-sans">
      
      {/* Top Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-teal-400 font-bold">ONBOARDING OS • STEP 0{currentStep} OF 0{totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#090e18] border border-slate-800 shadow-2xl space-y-6">
        
        {/* STEP 1: Business Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Tell FORGE about your business</h2>
              <p className="text-xs text-slate-400">We calibrate system reasoning around your specific industry workflows.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">Industry Vertical</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Primary Goal */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">What is your primary automation goal?</h2>
              <p className="text-xs text-slate-400">Select what your team spends the most expensive manual hours doing.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {[
                'Capture & qualify leads in sub-60s',
                '24/7 AI Receptionist & call triage',
                'Automate invoice & PDF data entry',
                'Zero-hallucination customer support FAQ'
              ].map((goal, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryGoal: goal })}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    formData.primaryGoal === goal
                      ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                      : 'border-slate-800 bg-dark-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-teal-400 block pb-1">GOAL 0{i + 1}</span>
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Tools & CRM */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Which tools does your team use?</h2>
              <p className="text-xs text-slate-400">FORGE bridges your existing stack without forcing migration.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              {['HubSpot', 'Salesforce', 'Slack', 'Gmail', 'Google Calendar', 'Google Sheets', 'QuickBooks', 'WhatsApp'].map((tool, i) => {
                const isSelected = formData.selectedTools.includes(tool);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                        : 'border-slate-800 bg-dark-950 text-slate-400'
                    }`}
                  >
                    <span>{tool}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Monthly Volume */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Monthly volume of inquiries / documents</h2>
              <p className="text-xs text-slate-400">Helps configure model token pools and rate-limiting safeguards.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {['< 100 / month', '100 - 500 / month', '500 - 2,000 / month', '2,000+ / month'].map((vol, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, monthlyVolume: vol })}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    formData.monthlyVolume === vol
                      ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                      : 'border-slate-800 bg-dark-950 text-slate-300'
                  }`}
                >
                  {vol}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Choose Primary System */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Select your primary system to activate</h2>
              <p className="text-xs text-slate-400">You can activate additional systems anytime from your dashboard.</p>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {SYSTEMS_CATALOG.slice(0, 4).map((sys) => {
                const isSelected = formData.selectedSystemId === sys.id;
                return (
                  <div
                    key={sys.id}
                    onClick={() => setFormData({ ...formData, selectedSystemId: sys.id })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-400 bg-teal-500/10 text-white font-bold'
                        : 'border-slate-800 bg-dark-950 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{sys.name}</div>
                      <div className="text-xs text-slate-400 font-sans font-normal">{sys.headline}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800">
                      {sys.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Configure Integrations */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Configuring Triggers & Integration Webhooks</h2>
              <p className="text-xs text-slate-400">Simulating live connection to your configured tools.</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400">
                <span>✓ Webhook Receiver Initialized</span>
                <span>STATUS: READY</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>✓ RAG Knowledge Guardrails Bound</span>
                <span>STATUS: READY</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>✓ Human Oversight Checkpoint Active</span>
                <span>STATUS: ENABLED</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Live Sandbox Test Run */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Execute Sandbox Test Before Launch</h2>
              <p className="text-xs text-slate-400">Run a test inquiry through your newly configured system.</p>
            </div>
            <div className="space-y-4">
              <textarea
                rows={3}
                value={formData.sandboxTestInput}
                onChange={(e) => setFormData({ ...formData, sandboxTestInput: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white"
              />
              <button
                type="button"
                onClick={runSandboxTest}
                disabled={testRunning}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-400 text-dark-950 font-black rounded-xl text-xs font-mono flex items-center justify-center gap-2"
              >
                {testRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>EXECUTE VERIFICATION TEST</span>
              </button>

              {testResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs font-mono text-slate-200 space-y-1 animate-fadeIn">
                  <div className="text-emerald-400 font-bold">● TEST EXECUTION PASSED</div>
                  <div>Intent: {testResult.intent}</div>
                  <div>Insurance: {testResult.insurance}</div>
                  <div>Slot: {testResult.slotLocked}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 8: First Success Celebration */}
        {currentStep === 8 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">Your first automation worked! 🚀</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your 14-day free trial is now active with 100 automated action credits. Your system is live and ready for operation.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {currentStep > 1 && currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center gap-2"
          >
            <span>{currentStep === totalSteps ? 'LAUNCH DASHBOARD' : 'CONTINUE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
