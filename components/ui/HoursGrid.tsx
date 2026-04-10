'use client';

import { WeeklyHours } from '@/lib/types';
import { motion } from 'framer-motion';

interface HoursGridProps {
  hours: WeeklyHours | null;
  openHoursPerWeek: number;
}

const DAYS = [
  { key: 'monday', label: 'M' },
  { key: 'tuesday', label: 'T' },
  { key: 'wednesday', label: 'W' },
  { key: 'thursday', label: 'T' },
  { key: 'friday', label: 'F' },
  { key: 'saturday', label: 'S' },
  { key: 'sunday', label: 'S' },
] as const;

export default function HoursGrid({ hours, openHoursPerWeek }: HoursGridProps) {
  const closedHours = 168 - openHoursPerWeek;
  const closedPercent = Math.round((closedHours / 168) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Hours</h3>
        {!hours && (
          <span className="text-xs text-zinc-500">Estimated (Mon-Fri 8-5)</span>
        )}
      </div>

      {hours ? (
        <div className="flex gap-2 mb-6">
          {DAYS.map(({ key, label }) => {
            const dayHours = hours[key];
            const isClosed = !dayHours || dayHours.isClosed;

            return (
              <div key={key} className="flex-1 text-center">
                <div className="text-xs text-zinc-500 mb-2">{label}</div>
                <div
                  className={`py-2 rounded-lg text-xs font-medium ${
                    isClosed
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {isClosed ? '—' : '●'}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-white">{openHoursPerWeek}</div>
          <div className="text-xs text-zinc-500 mt-1">hrs/week open</div>
        </div>
        <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-red-400">{closedHours}</div>
          <div className="text-xs text-zinc-500 mt-1">hrs/week closed</div>
        </div>
        <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-red-400">{closedPercent}%</div>
          <div className="text-xs text-zinc-500 mt-1">unavailable</div>
        </div>
      </div>
    </motion.div>
  );
}
