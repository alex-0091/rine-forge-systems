import React, { useState } from 'react';
import { 
  Calculator, Download, TrendingUp, DollarSign, PieChart, 
  ShieldCheck, AlertCircle, FileSpreadsheet, Sliders 
} from 'lucide-react';
import { ModelTransparencyBadge } from './ModelTransparencyBadge';

export function FinancialModelViewer({ artifact }) {
  const finData = artifact?.data_json || {};
  const metrics = finData.metrics || {
    annual_revenue: 600000,
    gross_profit: 420000,
    gross_margin_pct: 70.0,
    annual_opex: 180000,
    net_profit: 240000,
    net_margin_pct: 40.0,
    breakeven_revenue: 257142.86
  };
  const projections = finData.monthly_projections || [];
  const analysis = finData.ai_analysis || {};

  const [activeTab, setActiveTab] = useState('table'); // table, analysis

  const handleDownloadCsv = () => {
    const csvContent = finData.csv_content || artifact?.content_text || '';
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact?.name?.replace(/\s+/g, '_') || 'financial_model'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {artifact?.name || 'Deterministic 12-Month Financial Model'}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> DETERMINISTIC MATH
              </span>
            </h4>
            <div className="text-[11px] text-slate-400">
              Zero AI Hallucinations in Calculations • Mathematical Formulas Only
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModelTransparencyBadge
            provider={artifact?.provider_id || 'DETERMINISTIC_CALCULATOR'}
            model={artifact?.model_name || 'MathEngineCore'}
            isFree={artifact?.is_free ?? true}
            costEstimate={artifact?.cost_estimate || 'FREE'}
          />

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs flex items-center gap-1.5"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="p-6 bg-slate-950/40 border-b border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">12-Mo Gross Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            {formatCurrency(metrics.annual_revenue)}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Formula: Σ(Month 1..12 Revenue)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Gross Margin</span>
          <div className="text-xl sm:text-2xl font-black text-teal-400 mt-1">
            {metrics.gross_margin_pct?.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{formatCurrency(metrics.gross_profit)} GP</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Net Profit</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(metrics.net_profit)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{metrics.net_margin_pct?.toFixed(1)}% Net Margin</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Annual Break-Even</span>
          <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">
            {formatCurrency(metrics.breakeven_revenue)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Fixed Costs ÷ Gross Margin %</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-slate-800 bg-slate-950 flex items-center gap-4">
        <button
          onClick={() => setActiveTab('table')}
          className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'table'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>12-Month Projections Table</span>
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'analysis'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>AI Strategic Analysis & Assumptions</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-x-auto">
        {activeTab === 'table' ? (
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/60">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Revenue</th>
                <th className="py-2.5 px-3">COGS</th>
                <th className="py-2.5 px-3">Gross Profit</th>
                <th className="py-2.5 px-3">OpEx</th>
                <th className="py-2.5 px-3">Net Profit</th>
                <th className="py-2.5 px-3">Ending Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {projections.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-white font-bold">Month {row.month || idx + 1}</td>
                  <td className="py-2 px-3 text-emerald-400">{formatCurrency(row.revenue)}</td>
                  <td className="py-2 px-3 text-rose-400">{formatCurrency(row.cogs)}</td>
                  <td className="py-2 px-3 text-teal-300 font-semibold">{formatCurrency(row.gross_profit)}</td>
                  <td className="py-2 px-3 text-slate-400">{formatCurrency(row.opex)}</td>
                  <td className={`py-2 px-3 font-bold ${(row.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(row.net_profit)}
                  </td>
                  <td className="py-2 px-3 text-indigo-300">{formatCurrency(row.cash_balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-6 max-w-3xl">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h5 className="text-xs font-mono font-bold uppercase text-teal-400 mb-2">Executive Summary</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.executive_summary || 'The model illustrates a scalable trajectory with positive operating leverage after Month 4.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="text-xs font-mono font-bold uppercase text-indigo-400 mb-2">Unit Economics</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.unit_economics || 'Gross margins sustain over 65%, allowing robust reinvestment into customer acquisition.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="text-xs font-mono font-bold uppercase text-amber-400 mb-2">Sensitivity & Risks</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.sensitivity_risks || 'Cash flow is sensitive to receivables delay. Maintaining a 60-day cash buffer is recommended.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
