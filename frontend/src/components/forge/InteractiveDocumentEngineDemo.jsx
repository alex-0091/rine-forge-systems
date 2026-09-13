import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle2, ShieldCheck, 
  ArrowRight, RefreshCw, Check, Play, AlertCircle, Database 
} from 'lucide-react';

const SAMPLE_DOCS = [
  {
    id: 'doc-inv-1',
    name: 'ABC Supplies — Invoice #10482.pdf',
    type: 'Commercial Equipment Invoice',
    vendor: 'ABC Supplies International',
    invoiceNumber: '#10482',
    amount: '$2,840.00',
    poMatch: '#8831 (Matched)',
    dueDate: '14 Oct 2026',
    confidence: '97.8%',
    lineItems: [
      { item: 'Industrial Sensor Array Model X4', qty: 4, rate: '$450.00', total: '$1,800.00' },
      { item: 'High-Throughput Fiber Optic Couplers', qty: 8, rate: '$110.00', total: '$880.00' },
      { item: 'Standard Freight & Logistics Handling', qty: 1, rate: '$160.00', total: '$160.00' }
    ]
  },
  {
    id: 'doc-inv-2',
    name: 'Carrier Freight Logistics — BOL #FL-9021.pdf',
    type: 'Freight Transit & Bill of Lading',
    vendor: 'Carrier Freight Solutions LLC',
    invoiceNumber: '#FL-9021',
    amount: '$5,320.00',
    poMatch: '#9914 (Matched)',
    dueDate: '28 Oct 2026',
    confidence: '99.2%',
    lineItems: [
      { item: 'Refrigerated Transit (14 Pallets)', qty: 14, rate: '$350.00', total: '$4,900.00' },
      { item: 'Fuel Surcharge Index (Q3 2026)', qty: 1, rate: '$420.00', total: '$420.00' }
    ]
  }
];

export function InteractiveDocumentEngineDemo({ onNavigate }) {
  const [selectedDocId, setSelectedDocId] = useState('doc-inv-1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvedState, setApprovedState] = useState(false);

  const activeDoc = SAMPLE_DOCS.find(d => d.id === selectedDocId) || SAMPLE_DOCS[0];

  const handleSelectDoc = (id) => {
    setSelectedDocId(id);
    setApprovedState(false);
  };

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setApprovedState(true);
    }, 800);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#080d16] border border-teal-500/30 shadow-2xl space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
            FORGE DOCUMENT ENGINE • OCR VISION EXTRACTOR
          </span>
          <h3 className="text-lg font-bold text-white pt-1">Automated Invoice Extraction & Mathematical Validation</h3>
        </div>
        <span className="text-emerald-400 text-[10px] font-bold">● SIMULATED OCR BENCHMARK</span>
      </div>

      {/* Document Picker Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SAMPLE_DOCS.map((doc) => {
          const isSelected = selectedDocId === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => handleSelectDoc(doc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border shrink-0 ${
                isSelected
                  ? 'border-teal-400 bg-teal-500/20 text-white shadow-md'
                  : 'border-slate-800 bg-dark-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>{doc.name.split('—')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 5-Stage Pipeline Sequence Bar */}
      <div className="p-3 bg-dark-950 rounded-xl border border-slate-800 flex items-center justify-between overflow-x-auto text-[10px] text-teal-400">
        <span className="font-bold">DOCUMENT</span>
        <span>→</span>
        <span className="font-bold">VISION OCR</span>
        <span>→</span>
        <span className="font-bold">CLASSIFY</span>
        <span>→</span>
        <span className="font-bold">EXTRACT LINE ITEMS</span>
        <span>→</span>
        <span className="font-bold">VALIDATE MATH</span>
        <span>→</span>
        <span className="font-bold text-emerald-400">QUICKBOOKS AP</span>
      </div>

      {/* Extracted Data Card */}
      <div className="p-6 rounded-2xl bg-dark-950 border border-slate-800 space-y-4">
        
        {/* Top Extracted Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-850 pb-4 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">VENDOR</span>
            <strong className="text-white">{activeDoc.vendor}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">INVOICE #</span>
            <strong className="text-teal-300">{activeDoc.invoiceNumber}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">TOTAL AMOUNT</span>
            <strong className="text-emerald-400">{activeDoc.amount}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">PO MATCH & CONFIDENCE</span>
            <strong className="text-cyan-300">{activeDoc.poMatch} • {activeDoc.confidence}</strong>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Extracted Line Items (Mathematical Validation: 100%)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-slate-850 text-[10px]">
                  <th className="pb-2">ITEM DESCRIPTION</th>
                  <th className="pb-2">QTY</th>
                  <th className="pb-2">UNIT RATE</th>
                  <th className="pb-2 text-right">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {activeDoc.lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-slate-200">{item.item}</td>
                    <td className="py-2 text-slate-400">{item.qty}</td>
                    <td className="py-2 text-slate-400">{item.rate}</td>
                    <td className="py-2 text-right text-emerald-400 font-bold">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Actions */}
        <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Target Destination: <strong className="text-slate-200">QuickBooks Online / Accounts Payable</strong>
          </span>

          {approvedState ? (
            <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>COMMITTED TO QUICKBOOKS AP</span>
            </div>
          ) : (
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs font-mono transition-all shadow-md flex items-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>AUTHORIZE & COMMIT INVOICE</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
