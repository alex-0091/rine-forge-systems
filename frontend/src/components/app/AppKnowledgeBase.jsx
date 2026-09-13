import React, { useState } from 'react';
import { 
  Database, Upload, Globe, FileText, CheckCircle2, 
  Sparkles, Search, MessageSquare, RefreshCw, Trash2, ArrowRight 
} from 'lucide-react';
import { INITIAL_KNOWLEDGE_DOCUMENTS } from '../../data/forgePlatformConfig';

export function AppKnowledgeBase() {
  const [docs, setDocs] = useState(INITIAL_KNOWLEDGE_DOCUMENTS);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  // Test Agent Chat
  const [testQuery, setTestQuery] = useState('What is the refund and warranty policy for pilot deployments?');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState({
    answer: 'Under Section 4.2 of our Master Service Agreement, all pilot deployments operate on 50% milestone-based billing. If a deliverable fails to meet agreed technical acceptance benchmarks during the 14-day warranty period, the milestone deposit is fully refundable.',
    sourceDocument: 'Standard Operating Procedures & Service Pricing.pdf',
    confidenceScore: '99.4%',
    chunkId: 'chk_9941_p8'
  });

  const handleCrawlUrl = (e) => {
    e.preventDefault();
    if (!websiteUrl) return;
    setIsCrawling(true);
    setTimeout(() => {
      setDocs(prev => [
        ...prev,
        {
          id: `doc-${Date.now()}`,
          title: `Website Knowledge: ${websiteUrl}`,
          size: '620 KB',
          pages: 6,
          chunksIndexed: 48,
          lastUpdated: 'Just now',
          status: 'INDEXED',
          category: 'Web Pages'
        }
      ]);
      setWebsiteUrl('');
      setIsCrawling(false);
    }, 1200);
  };

  const handleTestQuery = (e) => {
    e.preventDefault();
    setIsQuerying(true);
    setTimeout(() => {
      setQueryResult({
        answer: `Retrieved verified answer for "${testQuery}": All policies comply with zero-data-retention enterprise standards and private VPC vector stores.`,
        sourceDocument: docs[0].title,
        confidenceScore: '99.8%',
        chunkId: 'chk_8820_p2'
      });
      setIsQuerying(false);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold uppercase">
          <Database className="w-3.5 h-3.5" /> DETERMINISTIC KNOWLEDGE BASE (RAG)
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          What Should Your AI Systems Know?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload your standard operating procedures, pricing sheets, and clinical/business FAQs. FORGE indexes documents into private vector stores for zero-hallucination execution.
        </p>
      </div>

      {/* 2-Column Grid: Ingestion Box & Indexed Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ingest Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* File Upload Box */}
          <div className="p-6 rounded-2xl bg-[#090e18] border border-dashed border-slate-700 hover:border-teal-500/50 transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">Upload Knowledge Files</div>
              <div className="text-[11px] text-slate-400">PDF, DOCX, TXT, CSV up to 25MB</div>
            </div>
            <button
              onClick={() => alert('File upload simulated in Sandbox Mode. Document added to index.')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-mono font-bold"
            >
              Select Files from Computer
            </button>
          </div>

          {/* Website URL Crawl Box */}
          <div className="p-6 rounded-2xl bg-[#090e18] border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Crawl Business Website
            </div>
            <form onSubmit={handleCrawlUrl} className="space-y-2">
              <input
                type="url"
                placeholder="https://yourcompany.com/faq"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-2.5 text-xs font-mono text-white"
              />
              <button
                type="submit"
                disabled={isCrawling}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1.5"
              >
                {isCrawling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Index Website Pages</span>
              </button>
            </form>
          </div>

        </div>

        {/* Indexed Docs & Vector Chunks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase">Indexed Vector Documents ({docs.length})</span>
            <span className="text-emerald-400">274 Total Chunks Active</span>
          </div>

          <div className="space-y-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-[#090e18] border border-slate-800 flex items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 text-teal-400 border border-slate-850">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {doc.size} • {doc.chunksIndexed} chunks • {doc.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive "Test Your AI Knowledge" Sandbox */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-teal-500/30 space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Live Knowledge Retrieval Tester
          </div>
          <h2 className="text-xl font-bold text-white">Ask a Question Against Your Indexed Knowledge</h2>
          <p className="text-xs text-slate-400">
            Verify that your AI systems answer with strict citations and zero hallucinations.
          </p>
        </div>

        <form onSubmit={handleTestQuery} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              className="flex-1 bg-dark-950 border border-slate-800 focus:border-teal-500 rounded-xl p-3 text-xs font-mono text-white"
            />
            <button
              type="submit"
              disabled={isQuerying}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              {isQuerying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Query RAG</span>
            </button>
          </div>
        </form>

        {queryResult && (
          <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] text-teal-400 font-bold">
              <span>SOURCE CITATION: {queryResult.sourceDocument}</span>
              <span className="text-emerald-400">CONFIDENCE: {queryResult.confidenceScore}</span>
            </div>
            <div className="text-slate-200 text-xs leading-relaxed font-sans">
              "{queryResult.answer}"
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
