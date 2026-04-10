'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { RevenueLeakCalculation } from '@/lib/types';

const MissedCalls = dynamic(() => import('@/components/three/MissedCalls'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-[#0a0e1a] rounded-2xl animate-pulse" />,
});

interface MissedOpportunitiesProps {
  calculation: RevenueLeakCalculation;
  cityName: string;
  tradeName: string;
  businessName: string;
}

export default function MissedOpportunities({
  calculation,
  cityName,
  tradeName,
  businessName,
}: MissedOpportunitiesProps) {
  const missedPercent = Math.round(calculation.closedHoursPercent);
  const monthlySearches = calculation.monthlySearchVolume;
  const missedCallsPerMonth = Math.round((monthlySearches * missedPercent) / 100 * 0.15); // ~15% of searches lead to calls
  const missedCustomersPerYear = missedCallsPerMonth * 12;

  const scenarios = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'After Hours Inquiry',
      description: `Customer searches "${tradeName} near me" at 8pm. You're closed. They call your competitor who answers.`,
      stat: `${Math.round(missedPercent * 0.6)}% of missed calls`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Busy During Rush',
      description: `You're handling a customer. Phone rings. You can't answer. That caller doesn't leave a voicemail.`,
      stat: `${Math.round(missedPercent * 0.3)}% of missed calls`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Weekend Searcher',
      description: `Someone plans their week on Sunday. Finds you, calls, no answer. Books with who picks up.`,
      stat: `${Math.round(missedPercent * 0.1)}% of missed calls`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 3D Visualization */}
      <MissedCalls missedPercent={missedPercent} monthlySearches={monthlySearches} />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{monthlySearches.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 mt-1">Monthly searches in {cityName}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{missedCallsPerMonth}</div>
          <div className="text-xs text-zinc-500 mt-1">Est. missed calls/month</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{missedCustomersPerYear}</div>
          <div className="text-xs text-zinc-500 mt-1">Potential customers/year</div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6">
        <h4 className="text-white font-medium mb-4">How you&apos;re losing customers</h4>
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                {scenario.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-white text-sm font-medium">{scenario.title}</h5>
                  <span className="text-xs text-red-400 whitespace-nowrap">{scenario.stat}</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{scenario.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA hint */}
      <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>What if every call was answered, 24/7?</span>
      </div>
    </motion.div>
  );
}
