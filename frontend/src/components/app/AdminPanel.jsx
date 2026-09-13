import React, { useState } from 'react';
import { 
  Settings, Users, ShieldAlert, Activity, 
  CheckCircle2, RefreshCw, BarChart3, Database, Lock 
} from 'lucide-react';

export function AdminPanel() {
  const [tenants, setTenants] = useState([
    { id: 'ten-1', name: 'Acme Logistics LLC', plan: 'Growth ($499/mo)', creditsUsed: '8,420 / 10,000', status: 'ACTIVE', joined: '2026-09-01' },
    { id: 'ten-2', name: 'Vance Dental Group', plan: 'Free Trial (14d)', creditsUsed: '32 / 100', status: 'TRIAL', joined: '2026-09-12' },
    { id: 'ten-3', name: 'Prestige Realty Partners', plan: 'Business ($899/mo)', creditsUsed: '24,100 / 35,000', status: 'ACTIVE', joined: '2026-08-20' },
    { id: 'ten-4', name: 'Apex Climate HVAC', plan: 'Starter ($249/mo)', creditsUsed: '1,890 / 2,500', status: 'ACTIVE', joined: '2026-09-04' }
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold uppercase">
          <Settings className="w-3.5 h-3.5" /> PLATFORM OPERATOR ADMIN
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          FORGE Global System Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Monitor multi-tenant infrastructure, track trial conversion velocity, and govern global feature gates.
        </p>
      </div>

      {/* High-Level Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Active Organizations</div>
          <div className="text-2xl font-black text-white">42 Firms</div>
        </div>
        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Active Trial Users</div>
          <div className="text-2xl font-black text-teal-400">18 Tenants</div>
        </div>
        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Trial-to-Paid Velocity</div>
          <div className="text-2xl font-black text-emerald-400">28.4%</div>
        </div>
        <div className="p-6 rounded-3xl bg-[#090e18] border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase">Monthly Platform MRR</div>
          <div className="text-2xl font-black text-cyan-400">$34,800</div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090e18] border border-slate-800 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Multi-Tenant Provisioning Registry
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px]">
                <th className="pb-3">ORGANIZATION</th>
                <th className="pb-3">PLAN TIER</th>
                <th className="pb-3">USAGE</th>
                <th className="pb-3">PROVISIONED</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {tenants.map((ten) => (
                <tr key={ten.id} className="text-xs">
                  <td className="py-3.5 font-bold text-white font-sans">{ten.name}</td>
                  <td className="py-3.5 text-teal-300">{ten.plan}</td>
                  <td className="py-3.5 text-slate-400">{ten.creditsUsed}</td>
                  <td className="py-3.5 text-slate-500">{ten.joined}</td>
                  <td className="py-3.5 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {ten.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
