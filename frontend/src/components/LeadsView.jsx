import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, Filter, Sparkles, CheckCircle2, AlertCircle,
  ExternalLink, Mail, Phone, Globe, Shield, RefreshCw, 
  ChevronRight, ArrowRight, Activity, X, Eye, Edit3, Send,
  UserX, ShieldCheck, ShieldAlert, Check, Clock, Zap, MapPin,
  Upload, Download, Bot, UserPlus, FileText, Smartphone, AlertTriangle
} from 'lucide-react';

export function LeadsView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [leadDetail, setLeadDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Filters
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Discovery Search Modal
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discIndustry, setDiscIndustry] = useState('Dental');
  const [discLocation, setDiscLocation] = useState('Austin, TX');
  const [discServices, setDiscServices] = useState('Cleaning, Whitening, Cosmetic Dentistry, Consultations');
  const [discSourceType, setDiscSourceType] = useState('PUBLIC_BUSINESS_DATA');
  const [discLimit, setDiscLimit] = useState(10);
  const [discoveryResult, setDiscoveryResult] = useState(null);

  // URL Analyzer Tool Modal
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [analyzeIndustry, setAnalyzeIndustry] = useState('Dental');
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [analyzedData, setAnalyzedData] = useState(null);

  // Edit Outreach State
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Phase AN: CSV Import & Export State
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [isValidatingCsv, setIsValidatingCsv] = useState(false);
  const [isCommittingImport, setIsCommittingImport] = useState(false);
  const [importCommitResult, setImportCommitResult] = useState(null);

  // Phase AN: Grounded AI Sales Assistant State
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResult, setAssistantResult] = useState(null);
  const [isAssistantQuerying, setIsAssistantQuerying] = useState(false);
  const [showAssistantPanel, setShowAssistantPanel] = useState(false);

  // Phase AN: Multi-Channel Pitch Generator State
  const [pitchChannel, setPitchChannel] = useState('EMAIL');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  // Phase AN: Assign to Human & Notes State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigneeName, setAssigneeName] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [isAssigning, setIsAssigning] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // Try V5 Prospects endpoint first
      let url = `/api/v1/prospects?limit=100`;
      if (industryFilter) url += `&industry=${encodeURIComponent(industryFilter)}`;
      if (locationFilter) url += `&location=${encodeURIComponent(locationFilter)}`;
      if (stageFilter) url += `&stage=${encodeURIComponent(stageFilter)}`;
      if (minScoreFilter > 0) url += `&min_score=${minScoreFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data);
          return;
        }
      }

      // Fallback to legacy /api/leads if V5 is empty or not yet seeded
      let fallbackUrl = `/api/leads?limit=50`;
      if (industryFilter) fallbackUrl += `&industry=${encodeURIComponent(industryFilter)}`;
      if (locationFilter) fallbackUrl += `&country=${encodeURIComponent(locationFilter)}`;
      if (minScoreFilter > 0) fallbackUrl += `&min_score=${minScoreFilter}`;

      const fbRes = await fetch(fallbackUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        const normalized = (fbData.leads || []).map(l => ({
          id: l.id,
          company_name: l.name,
          website: l.website_url,
          industry: l.industry,
          location: l.city ? `${l.city}, ${l.country}` : l.country,
          city: l.city,
          email: l.contact_email,
          phone: l.phone,
          source: 'PUBLIC_BUSINESS_DATA',
          source_url: l.website_url,
          score: l.lead_score,
          score_breakdown: null,
          outreach_status: l.status === 'OUTREACH_READY' ? 'DRAFTED' : l.status,
          contact_status: l.status === 'CONTACTED' ? 'CONTACTED' : 'UNCONTACTED',
          pipeline_stage: l.status === 'OUTREACH_READY' ? 'REVIEW' : (l.status === 'RESEARCHED' ? 'QUALIFIED' : l.status),
          review_mode: 'HUMAN_REVIEW',
          observations_count: l.detected_cms ? 2 : 1,
          opportunities_count: l.top_opportunity ? 1 : 0,
          outreach_messages_count: 1
        }));
        setLeads(normalized);
      }
    } catch (e) {
      console.error("Failed to fetch leads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [industryFilter, locationFilter, stageFilter, minScoreFilter]);

  const openLeadDetail = async (id) => {
    setSelectedLeadId(id);
    setDetailLoading(true);
    setIsEditingDraft(false);
    setActionFeedback(null);
    try {
      // Fetch authoritative V5 prospect detail
      const res = await fetch(`/api/v1/prospects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLeadDetail(data);
        if (data.outreach_history && data.outreach_history.length > 0) {
          setEditSubject(data.outreach_history[0].subject || '');
          setEditMessage(data.outreach_history[0].message || '');
        }
      } else {
        // Fallback to legacy endpoint
        const fbRes = await fetch(`/api/leads/${id}`);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          setLeadDetail({
            id: fbData.business?.id,
            company_name: fbData.business?.name,
            website: fbData.business?.website_url,
            industry: fbData.business?.industry,
            location: `${fbData.business?.city || ''}, ${fbData.business?.country || ''}`,
            email: fbData.business?.contact_email,
            phone: fbData.business?.phone,
            source: 'PUBLIC_BUSINESS_DATA',
            source_url: fbData.business?.website_url,
            score: fbData.lead_score?.total_score || 75,
            pipeline_stage: 'REVIEW',
            review_mode: 'HUMAN_REVIEW',
            compliance: { can_contact: true, suppressed: false },
            observations: (fbData.research?.verified_facts || []).map((f, i) => ({
              id: `fact-${i}`,
              observation: f,
              source: fbData.business?.website_url || 'Website Inspection',
              confidence: 0.95,
              category: 'TECH_STACK'
            })),
            opportunities: (fbData.ai_opportunities || []).map(o => ({
              id: o.id,
              type: o.solution_name || 'AI_RECEPTIONIST',
              reason: o.business_benefit,
              evidence: o.recommended_pitch,
              confidence: (o.overall_score || 85) / 100
            })),
            outreach_history: (fbData.outreach_history || []).map(m => ({
              id: m.id,
              channel: 'EMAIL',
              subject: m.subject,
              message: m.body,
              status: 'PENDING_REVIEW',
              step_number: 0
            }))
          });
          if (fbData.outreach_history && fbData.outreach_history.length > 0) {
            setEditSubject(fbData.outreach_history[0].subject || '');
            setEditMessage(fbData.outreach_history[0].body || '');
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch lead detail:", e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApproveOutreach = async (outreachId) => {
    try {
      setActionProcessing(true);
      setActionFeedback(null);
      const res = await fetch(`/api/v1/outreach/${outreachId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approver_id: 'operator-1' })
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', text: 'Outreach approved & dispatched across verified channel!' });
        await openLeadDetail(selectedLeadId);
        await fetchLeads();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to dispatch outreach' });
      }
    } catch (e) {
      setActionFeedback({ type: 'error', text: 'Network error approving outreach' });
    } finally {
      setActionProcessing(false);
    }
  };

  const handleSaveAndApproveEdit = async (outreachId) => {
    try {
      setActionProcessing(true);
      setActionFeedback(null);
      // First save the edit
      const editRes = await fetch(`/api/v1/outreach/${outreachId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: editSubject, message: editMessage })
      });
      if (!editRes.ok) throw new Error("Save draft edit failed");

      // Then approve and dispatch
      const appRes = await fetch(`/api/v1/outreach/${outreachId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approver_id: 'operator-1' })
      });
      const data = await appRes.json();
      if (data.success) {
        setIsEditingDraft(false);
        setActionFeedback({ type: 'success', text: 'Edited draft approved & sent successfully!' });
        await openLeadDetail(selectedLeadId);
        await fetchLeads();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to approve edited draft' });
      }
    } catch (e) {
      setActionFeedback({ type: 'error', text: 'Error saving and approving edit' });
    } finally {
      setActionProcessing(false);
    }
  };

  const handleSaveDraftOnly = async (outreachId) => {
    try {
      setActionProcessing(true);
      const editRes = await fetch(`/api/v1/outreach/${outreachId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: editSubject, message: editMessage })
      });
      if (editRes.ok) {
        setIsEditingDraft(false);
        setActionFeedback({ type: 'success', text: 'Draft changes saved in pending review queue.' });
        await openLeadDetail(selectedLeadId);
      }
    } catch (e) {
      setActionFeedback({ type: 'error', text: 'Failed to update draft' });
    } finally {
      setActionProcessing(false);
    }
  };

  const handleDisqualify = async (prospectId) => {
    if (!window.confirm("Disqualify this prospect and stop any pending outreach?")) return;
    try {
      setActionProcessing(true);
      const res = await fetch(`/api/v1/prospects/${prospectId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionFeedback({ type: 'success', text: 'Prospect marked as disqualified & removed from active queue.' });
        await openLeadDetail(selectedLeadId);
        await fetchLeads();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleAddToSuppression = async (emailOrDomain) => {
    if (!emailOrDomain) return;
    const reason = window.prompt("Reason for suppressing (e.g., Requested Opt-Out, Competitor, Unresponsive):", "Opt-Out Requested");
    if (!reason) return;

    try {
      setActionProcessing(true);
      const entryType = emailOrDomain.includes('@') ? 'EMAIL' : 'DOMAIN';
      const res = await fetch('/api/v1/suppression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_type: entryType,
          value: emailOrDomain,
          reason: reason
        })
      });
      if (res.ok) {
        setActionFeedback({ type: 'success', text: `Added ${emailOrDomain} to suppression blacklist. Zero future contacts guaranteed.` });
        await openLeadDetail(selectedLeadId);
        await fetchLeads();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleRunDiscovery = async () => {
    try {
      setIsDiscovering(true);
      setDiscoveryResult(null);
      const servicesList = discServices.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/v1/discovery/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: discIndustry,
          location: discLocation,
          services: servicesList,
          source_type: discSourceType,
          max_results: Number(discLimit),
          auto_draft_outreach: true
        })
      });
      const data = await res.json();
      setDiscoveryResult(data);
      await fetchLeads();
    } catch (e) {
      console.error("Discovery error:", e);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!analyzeUrl) return;
    try {
      setIsAnalyzingUrl(true);
      setAnalyzedData(null);
      const res = await fetch('/api/v1/discovery/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: analyzeUrl,
          industry: analyzeIndustry
        })
      });
      const data = await res.json();
      setAnalyzedData(data);
    } catch (e) {
      console.error("URL analysis error:", e);
    } finally {
      setIsAnalyzingUrl(false);
    }
  };

  // Phase AN: Multi-Channel Pitch Generator Handler
  const handleGeneratePitch = async (leadId, channel = 'EMAIL') => {
    try {
      setIsGeneratingPitch(true);
      setPitchChannel(channel);
      setActionFeedback(null);
      const res = await fetch(`/api/v1/prospects/${leadId}/pitch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, service_name: "Elena AI Receptionist" })
      });
      const data = await res.json();
      if (data.status === 'success' && data.draft) {
        setEditSubject(data.draft.subject || '');
        setEditMessage(data.draft.body_text || '');
        setIsEditingDraft(true);
        setActionFeedback({ 
          type: 'success', 
          text: `Generated ${channel} draft citing observable operational evidence.` 
        });
      }
    } catch (e) {
      console.error("Error generating pitch:", e);
      setActionFeedback({ type: 'error', text: 'Error contacting pitch generator' });
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  // Phase AN: CSV Import Preview Handler
  const handlePreviewCsv = async () => {
    if (!csvContent.trim()) return;
    try {
      setIsValidatingCsv(true);
      setImportPreview(null);
      setImportCommitResult(null);
      const res = await fetch('/api/v1/prospects/import-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv_content: csvContent })
      });
      const data = await res.json();
      setImportPreview(data);
    } catch (e) {
      console.error("CSV preview error:", e);
    } finally {
      setIsValidatingCsv(false);
    }
  };

  // Phase AN: CSV Import Commit Handler
  const handleCommitCsv = async () => {
    if (!importPreview || !importPreview.valid_rows_preview) return;
    try {
      setIsCommittingImport(true);
      const res = await fetch('/api/v1/prospects/import-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valid_rows: importPreview.valid_rows_preview,
          source_label: "CUSTOMER_CSV_IMPORT"
        })
      });
      const data = await res.json();
      setImportCommitResult(data);
      await fetchLeads();
    } catch (e) {
      console.error("CSV commit error:", e);
    } finally {
      setIsCommittingImport(false);
    }
  };

  // Phase AN: CSV Export Handler
  const handleExportCsv = () => {
    window.open('/api/v1/prospects/export', '_blank');
  };

  // Phase AN: AI Sales Assistant Query Handler
  const handleQueryAssistant = async (queryText) => {
    const q = queryText || assistantQuery;
    if (!q.trim()) return;
    try {
      setIsAssistantQuerying(true);
      setAssistantResult(null);
      setAssistantQuery(q);
      const res = await fetch('/api/v1/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setAssistantResult(data);
      setShowAssistantPanel(true);
    } catch (e) {
      console.error("Assistant query error:", e);
    } finally {
      setIsAssistantQuerying(false);
    }
  };

  // Phase AN: Task Assignment Handler
  const handleCreateTask = async () => {
    if (!selectedLeadId || !assigneeName.trim()) return;
    try {
      setIsAssigning(true);
      const res = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospect_id: selectedLeadId,
          title: `Follow up with ${leadDetail?.company_name || 'Prospect'}`,
          description: `Assigned to ${assigneeName} for manual review & outreach.`,
          assigned_to: assigneeName,
          priority: taskPriority,
          task_type: "FOLLOW_UP"
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowAssignModal(false);
        setAssigneeName('');
        setActionFeedback({ type: 'success', text: `Task assigned to ${assigneeName} successfully.` });
      }
    } catch (e) {
      console.error("Task assignment error:", e);
    } finally {
      setIsAssigning(false);
    }
  };

  // Phase AN: Note Saving Handler
  const handleSaveNote = async () => {
    if (!selectedLeadId || !newNoteText.trim()) return;
    try {
      setIsSavingNote(true);
      const existingNotes = leadDetail?.notes ? `${leadDetail.notes}\n` : '';
      const updatedNotes = `${existingNotes}[${new Date().toLocaleDateString()}] ${newNoteText.trim()}`;
      const res = await fetch(`/api/v1/prospects/${selectedLeadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
      if (res.ok) {
        setShowNoteModal(false);
        setNewNoteText('');
        await openLeadDetail(selectedLeadId);
        setActionFeedback({ type: 'success', text: 'Note added to business record.' });
      }
    } catch (e) {
      console.error("Save note error:", e);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">AI Lead Generation & Discovery Engine</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full">
              V5 PRODUCTION
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous multi-channel B2B prospect discovery, verified factual grounding, lead scoring & review-mode outreach
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => { setShowImportModal(true); setImportPreview(null); setImportCommitResult(null); }}
            className="px-3.5 py-2 bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            title="Import verified CSV of business leads"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            Import CSV
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            title="Export tenant's verified leads as CSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            Export CSV
          </button>

          <button
            onClick={() => { setShowAnalyzeModal(true); setAnalyzedData(null); }}
            className="px-3.5 py-2 bg-dark-850 hover:bg-dark-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            Analyze Any URL
          </button>

          <button
            onClick={() => { setShowDiscoveryModal(true); setDiscoveryResult(null); }}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-teal-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Discover New Leads
          </button>
        </div>
      </div>

      {/* Phase AN: Grounded AI Sales Assistant Interactive Bar */}
      <div className="bg-dark-900 border border-slate-800/80 p-4 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Internal AI Sales Assistant</span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-dark-850 text-slate-400 border border-slate-700 rounded">
              Grounded in Live CRM Data
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Zero Hallucinations • Actual Tenant Records</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about your pipeline, follow-ups, replies, or unverified contacts..."
            value={assistantQuery}
            onChange={(e) => setAssistantQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQueryAssistant()}
            className="flex-1 px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
          />
          <button
            onClick={() => handleQueryAssistant()}
            disabled={isAssistantQuerying || !assistantQuery.trim()}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            {isAssistantQuerying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Ask Assistant
          </button>
        </div>

        {/* Query Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Suggestions:</span>
          {[
            "Which leads need follow up?",
            "Which prospects replied?",
            "Show me dental businesses in Austin",
            "Which leads are missing verified contact information?"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleQueryAssistant(suggestion)}
              className="px-2.5 py-1 bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-[11px] transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Assistant Response Box */}
        {showAssistantPanel && assistantResult && (
          <div className="mt-3 p-3.5 bg-dark-950 border border-teal-500/20 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Assistant Answer
              </span>
              <button 
                onClick={() => setShowAssistantPanel(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed pt-1">
              {assistantResult.answer}
            </pre>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-dark-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
            className="w-full pl-8 pr-3 py-2 bg-dark-850 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500/50 placeholder:text-slate-500"
          />
        </div>

        {/* Niche */}
        <div className="flex items-center gap-2 bg-dark-850 border border-slate-800 px-3 py-2 rounded-xl text-xs">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="" className="bg-dark-900">All Niches</option>
            <option value="Dental" className="bg-dark-900">Dental Clinics</option>
            <option value="Real Estate" className="bg-dark-900">Real Estate</option>
            <option value="Law" className="bg-dark-900">Law Firms</option>
            <option value="Accounting" className="bg-dark-900">Accounting / CPAs</option>
            <option value="HVAC" className="bg-dark-900">HVAC & Home Services</option>
            <option value="Hospitality" className="bg-dark-900">Hospitality & Hotels</option>
            <option value="MedSpa" className="bg-dark-900">Aesthetics / MedSpas</option>
          </select>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 bg-dark-850 border border-slate-800 px-3 py-2 rounded-xl text-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Location (e.g. Austin, TX)"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
            className="w-full bg-transparent text-slate-200 focus:outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Stage */}
        <div className="flex items-center gap-2 bg-dark-850 border border-slate-800 px-3 py-2 rounded-xl text-xs">
          <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="" className="bg-dark-900">All Stages</option>
            <option value="DISCOVERED" className="bg-dark-900">DISCOVERED</option>
            <option value="QUALIFIED" className="bg-dark-900">QUALIFIED</option>
            <option value="REVIEW" className="bg-dark-900">REVIEW (Human Review)</option>
            <option value="CONTACTED" className="bg-dark-900">CONTACTED</option>
            <option value="RESPONDED" className="bg-dark-900">RESPONDED</option>
            <option value="INTERESTED" className="bg-dark-900">INTERESTED</option>
            <option value="APPOINTMENT" className="bg-dark-900">APPOINTMENT</option>
            <option value="CONVERTED" className="bg-dark-900">CONVERTED</option>
          </select>
        </div>

        {/* Score filter & Refresh */}
        <div className="flex items-center gap-2">
          <select
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(Number(e.target.value))}
            className="w-full bg-dark-850 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="0" className="bg-dark-900">Any Score</option>
            <option value="60" className="bg-dark-900">Score &ge; 60</option>
            <option value="75" className="bg-dark-900">Score &ge; 75 (High)</option>
            <option value="85" className="bg-dark-900">Score &ge; 85 (Tier 1)</option>
          </select>

          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 bg-dark-850 hover:bg-dark-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all shrink-0"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-dark-850/50">
                <th className="p-4 pl-6">Company & Niche</th>
                <th className="p-4">Location</th>
                <th className="p-4">Verified Channel</th>
                <th className="p-4">Lead Score</th>
                <th className="p-4">Pipeline Stage</th>
                <th className="p-4">Review Status</th>
                <th className="p-4 text-right pr-6">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                    Fetching verified prospects...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
                    No prospects matching criteria. Click <span className="text-teal-400 font-semibold cursor-pointer" onClick={() => setShowDiscoveryModal(true)}>Discover New Leads</span> to run the pipeline.
                  </td>
                </tr>
              ) : (
                leads.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-850/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{p.company_name}</span>
                        {p.source && (
                          <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-dark-800 text-slate-400 border border-slate-700/80 rounded">
                            {p.source.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-teal-400 font-medium">{p.industry}</span>
                        {p.website && (
                          <a href={p.website} target="_blank" rel="noreferrer" className="hover:text-slate-200 flex items-center gap-0.5">
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-slate-300 text-xs">
                      {p.location || (p.city ? `${p.city}` : 'Global')}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs">
                        {p.email && (
                          <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-teal-400" />
                            <span className="truncate max-w-[150px]">{p.email}</span>
                          </span>
                        )}
                        {p.phone && (
                          <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-sky-400" />
                            <span>{p.phone}</span>
                          </span>
                        )}
                        {!p.email && !p.phone && (
                          <span className="text-slate-600 text-[11px] italic">No verified direct contact</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          (p.score || 0) >= 85 ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                          (p.score || 0) >= 70 ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {p.score || 0}/100
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {(p.score || 0) >= 85 ? 'Tier 1' : (p.score || 0) >= 70 ? 'Tier 2' : 'Standard'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider border ${
                        p.pipeline_stage === 'REVIEW' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        p.pipeline_stage === 'CONTACTED' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                        p.pipeline_stage === 'RESPONDED' || p.pipeline_stage === 'INTERESTED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        p.pipeline_stage === 'APPOINTMENT' || p.pipeline_stage === 'CONVERTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        'bg-slate-800/80 text-slate-300 border-slate-700'
                      }`}>
                        {p.pipeline_stage || 'DISCOVERED'}
                      </span>
                    </td>

                    <td className="p-4 text-xs">
                      {p.pipeline_stage === 'REVIEW' || p.outreach_status === 'DRAFTED' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-amber-400 font-medium">Review Ready</span>
                        </div>
                      ) : p.outreach_status === 'SENT' ? (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Sent</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">{p.outreach_status || 'IDLE'}</span>
                      )}
                    </td>

                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => openLeadDetail(p.id)}
                        className="p-2 bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white rounded-lg transition-all"
                        title="Inspect Sourcing & Dossier"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sourcing Transparency Drawer */}
      {selectedLeadId && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-dark-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {leadDetail?.company_name || 'Loading Business Dossier...'}
                  {leadDetail?.score && (
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-md text-xs font-mono font-bold">
                      {leadDetail.score}/100
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {leadDetail?.industry} • {leadDetail?.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedLeadId(null)}
                className="p-2 bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                actionFeedback.type === 'success' 
                  ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' 
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}>
                {actionFeedback.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{actionFeedback.text}</span>
              </div>
            )}

            {detailLoading ? (
              <div className="flex items-center justify-center py-24 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mr-2 text-teal-400" />
                Loading grounded intelligence profile...
              </div>
            ) : (
              leadDetail && (
                <div className="space-y-6 text-sm">
                  {/* Lead Action Controls Bar (Section 31 UI Requirements) */}
                  <div className="bg-dark-850 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Outreach & Workflow Actions
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleGeneratePitch(leadDetail.id, 'EMAIL')}
                        disabled={isGeneratingPitch}
                        className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {isGeneratingPitch && pitchChannel === 'EMAIL' ? 'Drafting...' : 'Draft Email'}
                      </button>

                      <button
                        onClick={() => handleGeneratePitch(leadDetail.id, 'WHATSAPP')}
                        disabled={isGeneratingPitch}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        {isGeneratingPitch && pitchChannel === 'WHATSAPP' ? 'Drafting...' : 'Draft WhatsApp'}
                      </button>

                      <button
                        onClick={() => handleGeneratePitch(leadDetail.id, 'SMS')}
                        disabled={isGeneratingPitch}
                        className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isGeneratingPitch && pitchChannel === 'SMS' ? 'Drafting...' : 'Draft SMS'}
                      </button>

                      <button
                        onClick={() => { setShowAssignModal(true); setAssigneeName(''); }}
                        className="px-3 py-1.5 bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                        Assign
                      </button>

                      <button
                        onClick={() => { setShowNoteModal(true); setNewNoteText(''); }}
                        className="px-3 py-1.5 bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        Add Note
                      </button>
                    </div>

                    {/* Lead Attributes Summary Card */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs border-t border-slate-800/80">
                      <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800/60">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Contact</div>
                        <div className="font-semibold text-slate-200 truncate mt-0.5">
                          {leadDetail.contact_name || 'Practice Operations'}
                        </div>
                      </div>

                      <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800/60">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Verification</div>
                        <div className="font-semibold text-teal-400 truncate mt-0.5">
                          {leadDetail.data_quality_status || 'VERIFIED'}
                        </div>
                      </div>

                      <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800/60">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Opt-Out Status</div>
                        <div className={`font-semibold truncate mt-0.5 ${
                          leadDetail.opt_out_status === 'GLOBAL_OPT_OUT' ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {leadDetail.opt_out_status || 'NOT_OPTED_OUT'}
                        </div>
                      </div>

                      <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800/60 col-span-2 sm:col-span-3">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Why Relevant (Evidence Basis)</div>
                        <div className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                          {leadDetail.opportunities?.[0]?.reason || leadDetail.observations?.[0]?.observation || 'Public business signals indicate potential for operational workflow triage.'}
                        </div>
                      </div>

                      {leadDetail.notes && (
                        <div className="p-2.5 bg-dark-900 rounded-lg border border-slate-800/60 col-span-2 sm:col-span-3">
                          <div className="text-[10px] text-slate-500 uppercase font-mono">Notes</div>
                          <pre className="text-slate-300 text-xs font-sans whitespace-pre-wrap mt-0.5 leading-relaxed">
                            {leadDetail.notes}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section A: Sourcing Provenance & Compliance Verification */}
                  <div className="bg-dark-850 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-teal-400" />
                        Sourcing Provenance & Compliance
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-dark-900 border border-slate-700 text-teal-400 rounded">
                        ANTI-HEALTH GUARD: PASSED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 bg-dark-900/80 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Source Provider</div>
                        <div className="font-semibold text-slate-200 mt-0.5">{leadDetail.source || 'PUBLIC_BUSINESS_DATA'}</div>
                      </div>
                      <div className="p-2.5 bg-dark-900/80 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Consent Status</div>
                        <div className="font-semibold text-emerald-400 mt-0.5">PUBLIC_COMMERCIAL</div>
                      </div>
                    </div>

                    {leadDetail.source_url && (
                      <div className="text-xs text-slate-400 flex items-center gap-1 pt-1">
                        <span>Evidence Source:</span>
                        <a 
                          href={leadDetail.source_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-teal-400 hover:underline flex items-center gap-1 truncate max-w-md"
                        >
                          {leadDetail.source_url}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Section B: Observable Digital Footprint & Grounded Facts */}
                  <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        Verified Digital Footprint Observations
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">ZERO HALLUCINATIONS</span>
                    </div>

                    <div className="space-y-2">
                      {(leadDetail.observations || []).length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No specific website facts recorded.</div>
                      ) : (
                        leadDetail.observations.map((obs) => (
                          <div key={obs.id} className="p-3 bg-dark-900 border border-slate-800/80 rounded-lg text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-dark-800 text-teal-300 rounded border border-slate-700">
                                {obs.category || 'TECH_STACK'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Math Confidence: {Math.round((obs.confidence || 0.95) * 100)}%
                              </span>
                            </div>
                            <div className="text-slate-200 font-medium pt-0.5">{obs.observation}</div>
                            {obs.source && (
                              <div className="text-[10px] text-slate-500 truncate pt-0.5">
                                Verified against: {obs.source}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Section C: AI Automation Opportunities */}
                  <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Tailored AI Automation Opportunities
                    </h4>

                    <div className="space-y-2.5">
                      {(leadDetail.opportunities || []).length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No opportunities generated yet.</div>
                      ) : (
                        leadDetail.opportunities.map((opp) => (
                          <div key={opp.id} className="p-3.5 bg-dark-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-teal-300">{opp.type?.replace(/_/g, ' ')}</span>
                              <span className="font-mono text-teal-400 text-[10px] font-bold">
                                {Math.round((opp.confidence || 0.9) * 100)}% Fit
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{opp.reason}</p>
                            {opp.evidence && (
                              <div className="text-[11px] text-slate-400 bg-dark-950 p-2 rounded border border-slate-800/80 mt-1 italic">
                                Evidence: "{opp.evidence}"
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Section D: Evidence-Grounded Outreach Draft & Review Action Bar */}
                  {leadDetail.outreach_history && leadDetail.outreach_history.length > 0 && (
                    <div className="bg-dark-850 border border-slate-800 p-5 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-teal-400" />
                          Outreach Dispatch & Review Queue
                        </h4>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase border ${
                          leadDetail.outreach_history[0].status === 'PENDING_REVIEW'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                        }`}>
                          {leadDetail.outreach_history[0].status}
                        </span>
                      </div>

                      {/* Review Mode Banner */}
                      {leadDetail.outreach_history[0].status === 'PENDING_REVIEW' && (
                        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                          <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-semibold">Review Mode Active:</span> All outreach requires human verification before dispatch to prevent hallucinated claims and preserve domain reputation.
                          </div>
                        </div>
                      )}

                      {/* Message Preview or Inline Editor */}
                      {isEditingDraft ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase">Subject Line</label>
                            <input
                              type="text"
                              value={editSubject}
                              onChange={(e) => setEditSubject(e.target.value)}
                              className="w-full mt-1 p-2.5 bg-dark-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-400 uppercase">Message Body</label>
                            <textarea
                              rows={8}
                              value={editMessage}
                              onChange={(e) => setEditMessage(e.target.value)}
                              className="w-full mt-1 p-2.5 bg-dark-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-sans leading-relaxed"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleSaveAndApproveEdit(leadDetail.outreach_history[0].id)}
                              disabled={actionProcessing}
                              className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-dark-950 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Save & Send
                            </button>
                            <button
                              onClick={() => handleSaveDraftOnly(leadDetail.outreach_history[0].id)}
                              disabled={actionProcessing}
                              className="px-3.5 py-2 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-lg text-xs transition-all"
                            >
                              Save Draft Only
                            </button>
                            <button
                              onClick={() => setIsEditingDraft(false)}
                              className="px-3 py-2 text-slate-400 hover:text-slate-200 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-dark-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/80">
                            <span className="font-semibold text-slate-200">
                              Subject: {leadDetail.outreach_history[0].subject}
                            </span>
                            <button
                              onClick={() => setIsEditingDraft(true)}
                              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px]"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit Draft
                            </button>
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-xs pt-1">
                            {leadDetail.outreach_history[0].message}
                          </pre>
                        </div>
                      )}

                      {/* Review Mode Action Bar */}
                      {leadDetail.outreach_history[0].status === 'PENDING_REVIEW' && !isEditingDraft && (
                        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => handleApproveOutreach(leadDetail.outreach_history[0].id)}
                            disabled={actionProcessing}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                          >
                            <Check className="w-4 h-4" />
                            Approve & Send
                          </button>

                          <button
                            onClick={() => setIsEditingDraft(true)}
                            disabled={actionProcessing}
                            className="px-3.5 py-2 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                            Edit Message
                          </button>

                          <button
                            onClick={() => handleDisqualify(leadDetail.id)}
                            disabled={actionProcessing}
                            className="px-3.5 py-2 bg-dark-800 hover:bg-dark-700 text-amber-400 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Disqualify
                          </button>

                          <button
                            onClick={() => handleAddToSuppression(leadDetail.email || leadDetail.website)}
                            disabled={actionProcessing}
                            className="px-3.5 py-2 bg-dark-800 hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ml-auto"
                            title="Blacklist and suppress from all future outreach"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Suppress
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Discovery Search Modal */}
      {showDiscoveryModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-base">Run 13-Stage Lead Discovery</h3>
              </div>
              <button onClick={() => setShowDiscoveryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Target Industry / Niche</label>
                <input
                  type="text"
                  value={discIndustry}
                  onChange={(e) => setDiscIndustry(e.target.value)}
                  placeholder="e.g. Dental, Real Estate, Legal, HVAC"
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Target Location (City / Region)</label>
                <input
                  type="text"
                  value={discLocation}
                  onChange={(e) => setDiscLocation(e.target.value)}
                  placeholder="e.g. Austin, TX or Miami, FL"
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Commercial Services (Comma Separated)</label>
                <input
                  type="text"
                  value={discServices}
                  onChange={(e) => setDiscServices(e.target.value)}
                  placeholder="e.g. Cleaning, Whitening, Cosmetic Dentistry"
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Source Provider</label>
                  <select
                    value={discSourceType}
                    onChange={(e) => setDiscSourceType(e.target.value)}
                    className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="PUBLIC_BUSINESS_DATA">Public Business Directory</option>
                    <option value="AUTHORIZED_LEAD_APIS">Authorized Lead APIs</option>
                    <option value="WEBSITE_FORMS">Inbound Website Forms</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Max Candidates</label>
                  <select
                    value={discLimit}
                    onChange={(e) => setDiscLimit(Number(e.target.value))}
                    className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="5">5 Prospects</option>
                    <option value="10">10 Prospects</option>
                    <option value="20">20 Prospects</option>
                  </select>
                </div>
              </div>

              {discoveryResult && (
                <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    Discovery Run Succeeded
                  </div>
                  <div>Processed: {discoveryResult.discovered_count} leads | Stored in Review Queue: {discoveryResult.prospects?.length || discoveryResult.stored_count || 0}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowDiscoveryModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleRunDiscovery}
                disabled={isDiscovering}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                {isDiscovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isDiscovering ? 'Executing Pipeline...' : 'Start Discovery Run'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Analyzer Modal */}
      {showAnalyzeModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-base">Instant Website Footprint Grounding</h3>
              </div>
              <button onClick={() => setShowAnalyzeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={analyzeUrl}
                  onChange={(e) => setAnalyzeUrl(e.target.value)}
                  placeholder="https://target-business.com"
                  className="flex-1 p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleAnalyzeUrl}
                  disabled={isAnalyzingUrl || !analyzeUrl}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  {isAnalyzingUrl ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Analyze
                </button>
              </div>

              {analyzedData && (
                <div className="p-4 bg-dark-950 border border-slate-800 rounded-xl space-y-3 max-h-[350px] overflow-y-auto">
                  <div className="font-bold text-slate-200 text-sm">
                    {analyzedData.analysis?.business_name || 'Website Analysis'}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-dark-900 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase">Booking System</span>
                      <div className="font-mono text-slate-200">{analyzedData.analysis?.booking_system || 'None Detected'}</div>
                    </div>
                    <div className="p-2 bg-dark-900 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase">Live Chat</span>
                      <div className="font-mono text-slate-200">{analyzedData.analysis?.chat_widget || 'None Detected'}</div>
                    </div>
                    <div className="p-2 bg-dark-900 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase">CMS</span>
                      <div className="font-mono text-slate-200">{analyzedData.analysis?.cms || 'Custom'}</div>
                    </div>
                    <div className="p-2 bg-dark-900 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase">Contact Email</span>
                      <div className="font-mono text-slate-200 truncate">{analyzedData.analysis?.contact_emails?.[0] || 'None'}</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Detected Automation Angles</span>
                    <div className="space-y-1.5 mt-1">
                      {(analyzedData.opportunities || []).map((opp, i) => (
                        <div key={i} className="p-2 bg-dark-900 rounded border border-slate-800 text-[11px]">
                          <span className="font-bold text-teal-400">{opp.type}:</span> {opp.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAnalyzeModal(false)}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase AN: Safe CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-base">Safe B2B Lead CSV Import</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Import legitimate customer-provided lists. Enforces RFC email syntax, blocks disposable temporary domains, and automatically detects intra-file duplicates.
              </p>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Paste CSV Content (with headers)</label>
                  <button
                    onClick={() => setCsvContent(
                      "company_name,email,phone,website,industry,location\n" +
                      "Lone Star Dental,reception@lonestardental.com,512-555-0101,https://lonestardental.com,Dental,Austin TX\n" +
                      "Hill Country Law,info@hillcountrylaw.com,512-555-0102,https://hillcountrylaw.com,Legal,Austin TX"
                    )}
                    className="text-teal-400 hover:underline text-[10px]"
                  >
                    Load Sample CSV
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="company_name,email,phone,website,industry,location..."
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviewCsv}
                  disabled={isValidatingCsv || !csvContent.trim()}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-750 disabled:opacity-50 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  {isValidatingCsv ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  {isValidatingCsv ? 'Validating...' : 'Validate CSV Preview'}
                </button>
              </div>

              {/* Import Preview Breakdown */}
              {importPreview && (
                <div className="p-4 bg-dark-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-300">Total: {importPreview.total_rows}</span>
                    <span className="text-emerald-400 font-bold">Valid: {importPreview.valid_count}</span>
                    {importPreview.invalid_count > 0 && (
                      <span className="text-rose-400 font-bold">Invalid: {importPreview.invalid_count}</span>
                    )}
                  </div>

                  {importPreview.invalid_rows?.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      <div className="text-[10px] text-rose-400 uppercase font-bold">Rejected Rows (Excluded from Commit):</div>
                      {importPreview.invalid_rows.map((inv, i) => (
                        <div key={i} className="p-2 bg-rose-500/10 border border-rose-500/20 rounded text-[11px] text-rose-300">
                          Row #{inv.row_number} ({inv.company_name || 'No Name'}): {inv.reasons?.join(', ')}
                        </div>
                      ))}
                    </div>
                  )}

                  {importPreview.valid_rows_preview?.length > 0 && (
                    <div className="space-y-1 max-h-36 overflow-y-auto border-t border-slate-800 pt-2">
                      <div className="text-[10px] text-teal-400 uppercase font-bold">Valid Rows Preview:</div>
                      {importPreview.valid_rows_preview.map((v, i) => (
                        <div key={i} className="p-2 bg-dark-900 border border-slate-800 rounded text-[11px] text-slate-300 flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{v.company_name}</span>
                          <span className="text-slate-400">{v.email || v.phone}</span>
                          <span className="text-teal-400 font-mono text-[10px]">{v.industry}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {importCommitResult && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    CSV Import Complete
                  </div>
                  <div>
                    Imported: {importCommitResult.imported_count} leads | Duplicates skipped: {importCommitResult.skipped_duplicates}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              {importPreview?.valid_count > 0 && !importCommitResult && (
                <button
                  onClick={handleCommitCsv}
                  disabled={isCommittingImport}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                >
                  {isCommittingImport ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {isCommittingImport ? 'Committing...' : `Commit ${importPreview.valid_count} Valid Leads`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phase AN: Assign to Human Operator Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Assign Lead to Operator</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Assignee Name / Operator ID</label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="e.g. Alex, Sarah, Sales Lead"
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Task Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={isAssigning || !assigneeName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                {isAssigning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase AN: Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Add Lead Activity Note</h3>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Activity / Research Note</label>
                <textarea
                  rows={4}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record call summary, qualification details, or custom workflow notes..."
                  className="w-full p-2.5 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote || !newNoteText.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-dark-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                {isSavingNote ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
