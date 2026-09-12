import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, Cpu, DollarSign, TrendingUp, 
  Globe, Building, RefreshCw, Zap
} from 'lucide-react';

export function AnalyticsView() {
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, cRes] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/dashboard/charts')
      ]);
      setMetrics(await mRes.json());
      setCharts(await cRes.json());
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const costs = metrics?.ai_costs || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Analytics, AI Costs & Campaign Feedback Loop</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time observability into model expenditures, response rates, and niche performance
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2.5 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 rounded-xl transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* AI Cost Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 uppercase font-medium">Total AI Cost (USD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">${costs.total_cost_usd || '0.0000'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total LLM API expense</div>
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 uppercase font-medium">Total Tokens Used</div>
          <div className="text-2xl font-bold text-purple-400 mt-2 font-mono">{(costs.total_tokens || 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Input + Output Tokens</div>
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 uppercase font-medium">AI Operations Executed</div>
          <div className="text-2xl font-bold text-sky-400 mt-2 font-mono">{costs.operations_count || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Research, Scoring & Replies</div>
        </div>

        <div className="bg-dark-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 uppercase font-medium">Primary Model</div>
          <div className="text-2xl font-bold text-teal-400 mt-2 font-mono">Gemini 1.5 Flash</div>
          <div className="text-[11px] text-slate-400 mt-1">Cost-efficient reasoning engine</div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads by Country */}
        <div className="bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" /> Discovered Leads by Country
            </h3>
          </div>
          <div className="space-y-3">
            {(charts?.leads_by_country || []).map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{c.country}</span>
                  <span className="text-slate-400 font-mono">{c.count} leads</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, c.count * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Industry */}
        <div className="bg-dark-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-400" /> Discovered Leads by Industry
            </h3>
          </div>
          <div className="space-y-3">
            {(charts?.leads_by_industry || []).map((ind, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{ind.industry}</span>
                  <span className="text-slate-400 font-mono">{ind.count} leads</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, ind.count * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
