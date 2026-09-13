import React, { useState } from 'react';
import { 
  Calendar, Clock, User, CheckCircle2, 
  ArrowRight, RefreshCw, ShieldCheck, Sparkles 
} from 'lucide-react';

const SLOTS = [
  { day: 'Friday', time: '10:00 AM', status: 'AVAILABLE', tech: 'Dr. Rivera (Senior Clinician)' },
  { day: 'Friday', time: '02:30 PM', status: 'AVAILABLE', tech: 'Dr. Rivera (Senior Clinician)' },
  { day: 'Saturday', time: '11:00 AM', status: 'AVAILABLE', tech: 'Dr. Reynolds (Emergency Specialist)' },
  { day: 'Saturday', time: '03:00 PM', status: 'AVAILABLE', tech: 'Dr. Reynolds (Emergency Specialist)' }
];

export function InteractiveAppointmentDemo() {
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(2);
  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [patientPhone, setPatientPhone] = useState('+1 (555) 234-8901');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const selectedSlot = SLOTS[selectedSlotIdx];

  const handleBook = (e) => {
    e.preventDefault();
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookedSuccess(true);
    }, 900);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#080d16] border border-teal-500/30 shadow-2xl space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold uppercase">
            FORGE APPOINTMENT AGENT • CALENDAR LOCK
          </span>
          <h3 className="text-lg font-bold text-white pt-1">Autonomous Availability Lookup & Direct Booking</h3>
        </div>
        <span className="text-emerald-400 text-[10px] font-bold">● SIMULATED CALENDAR (SANDBOX)</span>
      </div>

      {/* Booking Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Slot Selector (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Available Calendar Slots</div>
          <div className="space-y-2">
            {SLOTS.map((slot, idx) => {
              const isSelected = selectedSlotIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedSlotIdx(idx);
                    setBookedSuccess(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-teal-400 bg-[#0d1626] shadow-md'
                      : 'border-slate-800 bg-dark-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="text-white font-bold">{slot.day}, {slot.time}</div>
                      <div className="text-[10px] text-slate-400">{slot.tech}</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {slot.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guest Details & Lock Action (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-dark-950 border border-slate-800 space-y-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Contact & SMS Confirmation Prep</div>
          
          <form onSubmit={handleBook} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 block pb-1">Patient / Client Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#060a12] border border-slate-800 focus:border-teal-500 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block pb-1">Mobile Phone (For 2-Way SMS Confirmation)</label>
              <input
                type="text"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full bg-[#060a12] border border-slate-800 focus:border-teal-500 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="pt-2">
              {bookedSuccess ? (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-1">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SLOT LOCKED & 2-WAY SMS DISPATCHED</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Confirmed: {selectedSlot.day} {selectedSlot.time} for {patientName}. Calendar invite committed.
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isBooking}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-dark-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isBooking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>LOCK APPOINTMENT & DISPATCH SMS</span>
                </button>
              )}
            </div>

            <div className="text-[10px] text-slate-500 text-center font-sans">
              * SIMULATED DEMO — No real SMS or calendar entries will be created.
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
