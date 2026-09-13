import React, { useState } from 'react';
import { 
  Building2, Sparkles, ArrowRight, CheckCircle2, Clock, 
  Calendar, MessageSquare, PhoneCall, Star, FileText, 
  Car, Utensils, Home, Stethoscope, Hotel, Layers, Zap 
} from 'lucide-react';
import { forgeAudioSynth } from '../../../utils/forgeAudioSynth';

const INDUSTRIES = [
  {
    id: 'hotels',
    name: 'HOTELS',
    icon: Hotel,
    badge: 'HOSPITALITY',
    description: '24/7 guest communications, room booking automation, and after-hours concierge.',
    services: [
      {
        title: 'AI Receptionist',
        description: 'Answers front-desk calls and WhatsApp messages in 2 seconds, day or night.',
        metric: '2s Response',
        demoData: {
          title: 'Hotel AI Receptionist',
          subtitle: 'Guest Room Reservation & Phone Intake',
          steps: [
            { title: 'Incoming Guest Call / Chat', detail: '"Looking for a King Suite this weekend with late check-out."', badge: 'INSTANT' },
            { title: 'Opera PMS Inventory Check', detail: 'Verifies room 304 availability and weekend package rate.', badge: 'VERIFIED' },
            { title: 'Direct Booking Lock', detail: 'Tokenizes reservation & dispatches mobile check-in link.', badge: 'CONFIRMED ✓' }
          ]
        }
      },
      {
        title: 'Guest enquiries',
        description: 'Instantly answers parking, pet policy, pool hours, and dining options.',
        metric: 'Zero Staff Interruption',
        demoData: {
          title: 'Guest Enquiry Concierge',
          subtitle: 'Instant Automated Policy & Amenities Resolution',
          steps: [
            { title: 'Guest Query Received', detail: '"Is valet parking included and is the pool heated?"', badge: 'RECEIVED' },
            { title: 'Concierge Knowledge Base', detail: 'Retrieves verified hotel guidebook & amenities schedule.', badge: 'MATCHED' },
            { title: 'Detailed Response Dispatched', detail: 'Answers amenities clearly with complimentary valet directions.', badge: 'RESOLVED ✓' }
          ]
        }
      },
      {
        title: 'Booking requests',
        description: 'Captures direct website reservations without paying high OTA commissions.',
        metric: '100% Direct Bookings',
        demoData: {
          title: 'Direct Reservation Engine',
          subtitle: 'OTA Commission Savings Workflow',
          steps: [
            { title: 'Direct Guest Inquiry', detail: 'Guest requests price match against Expedia booking.', badge: 'INBOUND' },
            { title: 'Direct Rate Applied', detail: 'Matches lowest published rate + adds complimentary breakfast.', badge: 'LOCKED' },
            { title: 'Booking Confirmed in PMS', detail: 'Saves hotel 18% commission fee ($72 direct profit).', badge: 'COMPLETED ✓' }
          ]
        }
      },
      {
        title: 'Follow-ups',
        description: 'Automated pre-arrival check-in links and post-stay review collection.',
        metric: '4.9★ Review Capture',
        demoData: {
          title: 'Automated Guest Follow-Up',
          subtitle: 'Post-Stay Review & Rebooking Loop',
          steps: [
            { title: 'Checkout Trigger', detail: 'Guest checkout recorded in PMS at 11:00 AM.', badge: 'TRIGGER' },
            { title: 'Personalized WhatsApp Sent', detail: 'Warm message thanking guest and requesting TripAdvisor review.', badge: 'DELIVERED' },
            { title: '5-Star Review Verified', detail: 'Guest review submitted and loyalty voucher dispatched.', badge: 'LOGGED ✓' }
          ]
        }
      }
    ]
  },
  {
    id: 'dental',
    name: 'DENTAL',
    icon: Stethoscope,
    badge: 'HEALTHCARE',
    description: 'Autonomous patient intake, chair scheduling, and missed-call recovery.',
    services: [
      {
        title: 'Appointment booking',
        description: 'Schedules cleanings, checkups, and emergencies directly into Dentrix or Curve.',
        metric: 'Live Chair Sync',
        demoData: {
          title: 'Dental Appointment Booking',
          subtitle: 'After-Hours Emergency & Hygiene Scheduling',
          steps: [
            { title: 'Patient Inbound Chat', detail: '"Need an emergency appointment for severe toothache tomorrow."', badge: 'URGENT' },
            { title: 'Operatory Chair Check', detail: 'Finds 3:00 PM opening with Dr. Sarah Jenkins (Room 4).', badge: 'AVAILABLE' },
            { title: 'Calendar & SMS Locked', detail: 'Appointment confirmed; digital health intake form sent.', badge: 'CONFIRMED ✓' }
          ]
        }
      },
      {
        title: 'Reminders',
        description: '2-way interactive SMS reminders that eliminate expensive clinic no-shows.',
        metric: '< 2% No-Show Rate',
        demoData: {
          title: '2-Way Interactive Reminders',
          subtitle: 'No-Show Elimination System',
          steps: [
            { title: '48h Reminder Dispatched', detail: '"Hi Mark, reply 1 to confirm your hygiene visit on Thursday."', badge: 'AUTOMATED' },
            { title: 'Patient Replies "1"', detail: 'System recognizes confirmation in 400ms.', badge: 'PROCESSED' },
            { title: 'PMS Calendar Status Updated', detail: 'Marked confirmed; hygiene chair protected from cancellation.', badge: 'SYNCED ✓' }
          ]
        }
      },
      {
        title: 'Lead qualification',
        description: 'Screens patient insurance, procedure intent (implants/Invisalign), and budget.',
        metric: 'Instant Insurance Match',
        demoData: {
          title: 'Cosmetic & Implant Lead Qualification',
          subtitle: 'High-Value Treatment Pre-Screening',
          steps: [
            { title: 'Invisalign Inquiry', detail: 'Patient asks about financing & timeline for clear aligners.', badge: 'INBOUND' },
            { title: 'Qualification Questions', detail: 'Confirms patient insurance carrier & estimated timeline.', badge: 'VERIFIED' },
            { title: 'Consultation Booked', detail: 'Tier-1 high value tag added; treatment coordinator alerted.', badge: 'SCHEDULED ✓' }
          ]
        }
      },
      {
        title: 'Reviews',
        description: 'Automatically texts satisfied patients to drive 5-star Google Clinic reviews.',
        metric: '+45 Google Reviews/Mo',
        demoData: {
          title: 'Clinic Review Booster',
          subtitle: 'Post-Procedure Reputation Engine',
          steps: [
            { title: 'Appointment Completed', detail: 'Dr. Jenkins marks checkout complete in practice PMS.', badge: 'CHECKOUT' },
            { title: 'Timed SMS Dispatched', detail: '"How was your visit today with Dr. Jenkins?"', badge: 'SENT' },
            { title: '5-Star Google Review Captured', detail: 'Patient leaves glowing review on Google Maps.', badge: 'PUBLISHED ✓' }
          ]
        }
      }
    ]
  },
  {
    id: 'real-estate',
    name: 'REAL ESTATE',
    icon: Home,
    badge: 'PROPERTY',
    description: 'Sub-45s buyer qualification, viewing coordination, and CRM pipeline management.',
    services: [
      {
        title: 'Lead response',
        description: 'Replies to Zillow, Realtor.com, and Facebook ad inquiries in under 45 seconds.',
        metric: '< 45s Speed-to-Lead',
        demoData: {
          title: 'Sub-45s Real Estate Lead Response',
          subtitle: 'Instant Portal & Ad Ingestion',
          steps: [
            { title: 'Zillow Inquiry Received', detail: 'Buyer requests pricing and walkthrough for 5th Ave condo.', badge: 'INGESTED' },
            { title: 'Instant 2-Way SMS Sent', detail: '"Hi Alex! Senior agent Marcus has the key. Can you view Saturday?"', badge: 'DISPATCHED' },
            { title: 'Buyer Engages Immediately', detail: 'Lead hooked before contacting other listing brokers.', badge: 'ENGAGED ✓' }
          ]
        }
      },
      {
        title: 'Property enquiries',
        description: 'Answers HOA fees, school districts, property tax, and renovation history instantly.',
        metric: 'Accurate MLS Specs',
        demoData: {
          title: 'MLS Property Specialist',
          subtitle: 'Autonomous Property Specs Assistant',
          steps: [
            { title: 'Buyer Specs Question', detail: '"What are the monthly HOA fees and is parking included?"', badge: 'RECEIVED' },
            { title: 'MLS Document Search', detail: 'Extracts exact bylaws: $420/mo HOA with deeded garage spot.', badge: 'VERIFIED' },
            { title: 'Immediate Answer Provided', detail: 'Delivers precise info and offers to schedule private tour.', badge: 'ANSWERED ✓' }
          ]
        }
      },
      {
        title: 'Viewing scheduling',
        description: 'Coordinates calendar availability between buyer and listing agent seamlessly.',
        metric: 'Zero Double-Bookings',
        demoData: {
          title: 'Private Showing Coordinator',
          subtitle: 'Broker Calendar Synchronization',
          steps: [
            { title: 'Showing Request', detail: 'Buyer selects Saturday 11:00 AM for private walkthrough.', badge: 'REQUESTED' },
            { title: 'Agent Calendar Verified', detail: 'Checks lockbox code and Marcus availability.', badge: 'RESERVED' },
            { title: 'Calendar Invite Fired', detail: 'Sent to buyer with gate code and parking instructions.', badge: 'CONFIRMED ✓' }
          ]
        }
      },
      {
        title: 'Follow-ups',
        description: 'Nurtures cold past buyers and open house attendees with personalized listings.',
        metric: '35% Re-engagement',
        demoData: {
          title: 'Cold Buyer Nurture Pipeline',
          subtitle: 'Automated CRM Re-Engagement',
          steps: [
            { title: 'Price Reduction Trigger', detail: 'Listed condo drops by $35,000 on MLS.', badge: 'EVENT' },
            { title: 'Filtered Buyer Match', detail: 'Identifies 14 buyers who viewed similar price points.', badge: 'MATCHED' },
            { title: 'Tailored Outreach Dispatched', detail: '3 buyers request immediate second viewings.', badge: 'CONVERTED ✓' }
          ]
        }
      }
    ]
  },
  {
    id: 'automotive',
    name: 'AUTOMOTIVE',
    icon: Car,
    badge: 'DEALERSHIPS',
    description: 'Vehicle availability lookup, test-drive booking, and service bay scheduling.',
    services: [
      {
        title: 'Vehicle enquiries',
        description: 'Checks live lot inventory, mileage, packages, and window stickers instantly.',
        metric: 'Live Lot Inventory',
        demoData: {
          title: 'Dealership Vehicle Search',
          subtitle: 'Live Inventory & VIN Verification',
          steps: [
            { title: 'Lot Inbound Question', detail: '"Do you still have the 2023 Porsche Macan in Chalk available?"', badge: 'INBOUND' },
            { title: 'DMS Inventory Sync', detail: 'Verifies Stock #P-4019 is on lot with 14,200 miles.', badge: 'LOCATED' },
            { title: 'Video Walkaround Link Sent', detail: 'Vehicle confirmed available and test-drive link offered.', badge: 'RESOLVED ✓' }
          ]
        }
      },
      {
        title: 'Lead qualification',
        description: 'Gathers trade-in details, down payment estimates, and financing timeline.',
        metric: 'Pre-Screened Buyers',
        demoData: {
          title: 'Trade-In & Financing Pre-Screen',
          subtitle: 'Sales Desk Qualification Pipeline',
          steps: [
            { title: 'Trade-In Request', detail: 'Customer has 2019 Audi Q5 to trade toward purchase.', badge: 'TRADE-IN' },
            { title: 'KBB Valuation Scan', detail: 'Captures VIN & mileage; generates instant trade estimate range.', badge: 'CALCULATED' },
            { title: 'Sales Rep Alerted', detail: 'Lead assigned with complete deal worksheet pre-filled.', badge: 'QUALIFIED ✓' }
          ]
        }
      },
      {
        title: 'Test-drive booking',
        description: 'Locks test-drive appointment and prepares vehicle keys at the front desk.',
        metric: 'Keys Ready in Advance',
        demoData: {
          title: 'Automated Test-Drive Booking',
          subtitle: 'Front Desk Key & Slot Reservation',
          steps: [
            { title: 'Test-Drive Slot Chosen', detail: 'Buyer books Friday at 4:30 PM for Porsche Macan.', badge: 'SELECTED' },
            { title: 'Sales Rep Calendar Locked', detail: 'Assigned to Senior Client Advisor Dave Miller.', badge: 'ASSIGNED' },
            { title: 'SMS Confirmation Sent', detail: 'Buyer receives VIP parking directions and reminder.', badge: 'CONFIRMED ✓' }
          ]
        }
      },
      {
        title: 'Follow-ups',
        description: 'Follows up on unsold showroom visits and automated maintenance service calls.',
        metric: '28% Showroom Recovery',
        demoData: {
          title: 'Showroom Visit Recovery Loop',
          subtitle: 'Post-Visit Follow-Up Workflow',
          steps: [
            { title: 'Unclosed Visit Logged', detail: 'Customer visited lot but did not sign contract today.', badge: 'LOGGED' },
            { title: 'Personalized Video Follow-Up', detail: 'Dave video message sent via WhatsApp with finance incentive.', badge: 'SENT' },
            { title: 'Buyer Returns Saturday', detail: 'Deposit taken and vehicle prepped for delivery.', badge: 'CLOSED ✓' }
          ]
        }
      }
    ]
  },
  {
    id: 'restaurants',
    name: 'RESTAURANTS',
    icon: Utensils,
    badge: 'DINING',
    description: 'Autonomous table bookings, catering inquiries, and customer FAQ handling.',
    services: [
      {
        title: 'Reservations',
        description: 'Takes table bookings 24/7 and syncs directly with OpenTable or Resy.',
        metric: 'Zero Phone Interruption',
        demoData: {
          title: 'Restaurant Table Reservation',
          subtitle: '24/7 Autonomous Reservation Agent',
          steps: [
            { title: 'Guest Reservation Ring', detail: '"Table for 6 this Saturday at 7:30 PM for a birthday."', badge: 'CALL/CHAT' },
            { title: 'OpenTable / Resy Check', detail: 'Finds Patio Booth available at 7:30 PM.', badge: 'VERIFIED' },
            { title: 'Reservation Confirmed', detail: 'Table locked; birthday dessert note logged for kitchen.', badge: 'CONFIRMED ✓' }
          ]
        }
      },
      {
        title: 'Customer questions',
        description: 'Answers gluten-free options, corkage fees, dress code, and valet parking.',
        metric: 'Instant Menu Accuracy',
        demoData: {
          title: 'Dietary & Menu Concierge',
          subtitle: 'Instant Kitchen & Allergen Lookup',
          steps: [
            { title: 'Allergen Query Received', detail: '"Do you have dedicated gluten-free fryers and vegan pasta?"', badge: 'RECEIVED' },
            { title: 'Kitchen Recipe Database', detail: 'Checks allergen tags: Dedicated fryer verified, gluten-free penne available.', badge: 'CHECKED' },
            { title: 'Reassuring Answer Dispatched', detail: 'Guest feels safe and books dinner table immediately.', badge: 'RESOLVED ✓' }
          ]
        }
      },
      {
        title: 'Order enquiries',
        description: 'Captures large party private room inquiries and corporate catering requests.',
        metric: 'High-Ticket Catering',
        demoData: {
          title: 'Private Event & Catering Intake',
          subtitle: 'High-Value Event Qualification',
          steps: [
            { title: 'Private Dining Inquiry', detail: 'Corporate office requests buyout for 35 guests next month.', badge: 'INBOUND' },
            { title: 'Budget & Menu Sizing', detail: 'Calculates $4,200 minimum spend and gathers event timing.', badge: 'QUOTED' },
            { title: 'Event Director Notified', detail: 'Calendar hold placed and PDF contract generated.', badge: 'QUALIFIED ✓' }
          ]
        }
      },
      {
        title: 'Reviews',
        description: 'Encourages satisfied diners to leave 5-star reviews on Google and Yelp.',
        metric: '+50 Monthly Reviews',
        demoData: {
          title: 'Dining Experience Review Capture',
          subtitle: 'Post-Dinner Reputation System',
          steps: [
            { title: 'Receipt Closed in POS', detail: 'Toast POS closes table 14 bill at 9:45 PM.', badge: 'PAID' },
            { title: 'Warm Review SMS Sent', detail: '"Thank you for dining! How was your dinner with us tonight?"', badge: 'SENT' },
            { title: '5-Star Google Review Captured', detail: 'Diner taps 5-star link and uploads photo of dinner.', badge: 'REVIEWED ✓' }
          ]
        }
      }
    ]
  },
  {
    id: 'other',
    name: 'OTHER',
    icon: Layers,
    badge: 'GENERAL B2B',
    description: 'Custom workflows for legal, accounting, construction, and service agencies.',
    services: [
      {
        title: 'Inbound qualification',
        description: 'Replies to web forms and ad leads in under 45 seconds to secure high-intent buyers.',
        metric: 'Sub-45s Speed',
        demoData: {
          title: 'Speed-to-Lead Qualification',
          subtitle: 'Omnichannel Buyer Intake',
          steps: [
            { title: 'Web Form Submitted', detail: 'Buyer enters details on contact form.', badge: 'SUBMITTED' },
            { title: 'Instant 2-Way Contact', detail: 'AI reaches out via SMS and phone in 30 seconds.', badge: 'ENGAGED' },
            { title: 'Executive Demo Scheduled', detail: 'Meeting locked directly into senior team calendar.', badge: 'BOOKED ✓' }
          ]
        }
      },
      {
        title: 'Automated scheduling',
        description: 'Eliminates endless "when are you free?" emails with instant calendar locking.',
        metric: 'Zero Email Ping-Pong',
        demoData: {
          title: 'Autonomous Scheduling Engine',
          subtitle: 'Calendar Ping-Pong Elimination',
          steps: [
            { title: 'Meeting Request Received', detail: 'Client wants 30-minute discovery call this week.', badge: 'REQUEST' },
            { title: 'Cross-Calendar Availability', detail: 'Checks 3 team members and finds mutual open slot.', badge: 'LOCATED' },
            { title: 'Zoom Link & Calendar Sent', detail: 'Both parties receive calendar invite with video link.', badge: 'CONFIRMED ✓' }
          ]
        }
      },
      {
        title: 'Customer questions',
        description: 'Trained on your internal documentation to answer client inquiries with 0% error.',
        metric: '100% Verified Accuracy',
        demoData: {
          title: 'Verified Internal Knowledge Base',
          subtitle: 'Zero-Hallucination Query Resolver',
          steps: [
            { title: 'Complex Client Question', detail: 'Client asks technical pricing question from contract terms.', badge: 'QUERY' },
            { title: 'Semantic Search in Docs', detail: 'Pins exact paragraph in company service agreement.', badge: 'FOUND' },
            { title: 'Accurate Response Given', detail: 'Quotes contract terms with page citation.', badge: 'ANSWERED ✓' }
          ]
        }
      },
      {
        title: 'Operations sync',
        description: 'Automates data movement between your CRM, invoicing, email, and ERP tools.',
        metric: 'Hands-Free Ops',
        demoData: {
          title: 'Cross-Software Operations Sync',
          subtitle: 'Automated Webhook & Data Pipeline',
          steps: [
            { title: 'New Customer Deal Signed', detail: 'Contract signed via DocuSign.', badge: 'SIGNED' },
            { title: 'Automated Multi-App Dispatch', detail: 'Generates QuickBooks invoice, creates Slack channel, logs in CRM.', badge: 'DISPATCHED' },
            { title: 'Project Onboarding Live', detail: 'Zero hours spent on manual administrative data entry.', badge: 'SYNCED ✓' }
          ]
        }
      }
    ]
  }
];

export function WhatCouldYourBusinessAutomate({ onWatchServiceDemo, onSeeWhatWeCouldAutomate }) {
  const [selectedIndustryId, setSelectedIndustryId] = useState('hotels');

  const selectedIndustry = INDUSTRIES.find(ind => ind.id === selectedIndustryId) || INDUSTRIES[0];

  const handleTabClick = (id) => {
    forgeAudioSynth.playClick();
    setSelectedIndustryId(id);
  };

  const handleWatchService = (serv) => {
    forgeAudioSynth.playClick();
    if (onWatchServiceDemo) {
      onWatchServiceDemo(serv.demoData);
    }
  };

  return (
    <section className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#060a15] relative overflow-hidden" id="industry-automation">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CUSTOM VERTICAL INTELLIGENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            WHAT COULD YOUR BUSINESS AUTOMATE?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Choose your industry below to explore the exact customer-facing and operational workflows FORGE handles autonomously.
          </p>
        </div>

        {/* Interactive Industry Tabs - Horizontally Scrollable on Mobile */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 p-1.5 bg-[#0a1020]/90 border border-slate-800/90 rounded-2xl max-w-4xl mx-auto backdrop-blur-md">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            const isActive = selectedIndustryId === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => handleTabClick(ind.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 scale-[1.03]'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Industry Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#091122]/70 border border-teal-500/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold">
                {selectedIndustry.badge} AUTOMATION SUITE
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                4 LIVE WORKFLOWS READY
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-sans">
              {selectedIndustry.name} Operations Powered by FORGE
            </h3>
            <p className="text-xs text-slate-300 font-sans">
              {selectedIndustry.description}
            </p>
          </div>
        </div>

        {/* Dynamic 4 Services Cards Grid with Smooth Animated Transition */}
        <div 
          key={selectedIndustry.id}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fadeIn"
        >
          {selectedIndustry.services.map((serv, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0a1122]/85 border border-slate-800/80 hover:border-teal-500/40 p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center justify-center font-mono text-xs font-bold">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {serv.metric}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-sans group-hover:text-teal-300 transition-colors">
                  {serv.title}
                </h4>

                <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                  {serv.description}
                </p>
              </div>

              {/* Requirement 5: WATCH IT HAPPEN → button on every service */}
              <button
                onClick={() => handleWatchService(serv)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 group-hover:bg-teal-500/10 border border-slate-700/80 group-hover:border-teal-500/50 text-xs font-mono font-bold text-teal-300 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <span>WATCH IT HAPPEN</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-teal-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Subtle Section CTA: SEE WHAT WE COULD AUTOMATE → */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            Want to see how these automated workflows map to your specific business tools?
          </p>
          <button
            onClick={() => {
              forgeAudioSynth.playClick();
              if (onSeeWhatWeCouldAutomate) onSeeWhatWeCouldAutomate(selectedIndustry.name);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <span>SEE WHAT WE COULD AUTOMATE</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

      </div>
    </section>
  );
}
