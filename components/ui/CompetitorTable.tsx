'use client';

import { PlaceDetails } from '@/lib/types';
import { motion } from 'framer-motion';

interface CompetitorTableProps {
  business: PlaceDetails;
  competitors: PlaceDetails[];
}

export default function CompetitorTable({ business, competitors }: CompetitorTableProps) {
  const allBusinesses = [
    { ...business, isUser: true },
    ...competitors.map((c) => ({ ...c, isUser: false })),
  ].sort((a, b) => (b.openHoursPerWeek || 0) - (a.openHoursPerWeek || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-[#334155]">
        <h3 className="text-xl font-semibold text-white">How You Compare</h3>
        <p className="text-[#94a3b8] mt-1">Your business vs. nearby competitors</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#141821]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Hours/Week
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Reviews
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {allBusinesses.map((biz, index) => (
              <motion.tr
                key={biz.placeId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`${
                  biz.isUser ? 'bg-[#ef4444]/10' : 'hover:bg-[#334155]/50'
                } transition-colors`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {biz.isUser && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-[#ef4444] text-white rounded">
                        YOU
                      </span>
                    )}
                    <div>
                      <div className={`font-medium ${biz.isUser ? 'text-[#ef4444]' : 'text-white'}`}>
                        {biz.name}
                      </div>
                      <div className="text-xs text-[#94a3b8] truncate max-w-[200px]">
                        {biz.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`font-semibold ${
                      biz.isUser
                        ? 'text-[#ef4444]'
                        : (biz.openHoursPerWeek || 0) > (business.openHoursPerWeek || 0)
                        ? 'text-[#22c55e]'
                        : 'text-white'
                    }`}
                  >
                    {biz.openHoursPerWeek || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <svg className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span
                      className={`font-medium ${
                        biz.isUser
                          ? 'text-[#ef4444]'
                          : (biz.rating || 0) > (business.rating || 0)
                          ? 'text-[#22c55e]'
                          : 'text-white'
                      }`}
                    >
                      {biz.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`font-medium ${
                      biz.isUser
                        ? 'text-[#ef4444]'
                        : (biz.reviewCount || 0) > (business.reviewCount || 0)
                        ? 'text-[#22c55e]'
                        : 'text-white'
                    }`}
                  >
                    {biz.reviewCount?.toLocaleString() || 'N/A'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight callout */}
      {competitors.length > 0 && (
        <div className="p-6 bg-[#141821] border-t border-[#334155]">
          <CompetitorInsight business={business} competitors={competitors} />
        </div>
      )}
    </motion.div>
  );
}

function CompetitorInsight({
  business,
  competitors,
}: {
  business: PlaceDetails;
  competitors: PlaceDetails[];
}) {
  const betterHoursCount = competitors.filter(
    (c) => (c.openHoursPerWeek || 0) > (business.openHoursPerWeek || 0)
  ).length;

  const betterRatingCount = competitors.filter(
    (c) => (c.rating || 0) > (business.rating || 0)
  ).length;

  const bestCompetitor = competitors.reduce((best, current) => {
    const currentScore =
      (current.openHoursPerWeek || 0) + (current.rating || 0) * 10 + (current.reviewCount || 0) / 10;
    const bestScore =
      (best.openHoursPerWeek || 0) + (best.rating || 0) * 10 + (best.reviewCount || 0) / 10;
    return currentScore > bestScore ? current : best;
  }, competitors[0]);

  if (!bestCompetitor) return null;

  const hoursDiff = (bestCompetitor.openHoursPerWeek || 0) - (business.openHoursPerWeek || 0);
  const reviewsRatio = Math.round(
    (bestCompetitor.reviewCount || 1) / (business.reviewCount || 1)
  );

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 bg-[#f59e0b]/20 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p className="text-white font-medium">Competitive Analysis</p>
        <p className="text-[#94a3b8] text-sm mt-1">
          {betterHoursCount > 0 && (
            <span>
              <span className="text-[#ef4444] font-medium">{betterHoursCount}</span> competitor
              {betterHoursCount > 1 ? 's are' : ' is'} open more hours than you.{' '}
            </span>
          )}
          {hoursDiff > 0 && (
            <span>
              <span className="text-[#22c55e] font-medium">{bestCompetitor.name}</span> is open{' '}
              <span className="text-[#ef4444] font-medium">{hoursDiff} more hours/week</span>
              {reviewsRatio > 1 && (
                <span>
                  {' '}
                  and has{' '}
                  <span className="text-[#ef4444] font-medium">{reviewsRatio}x more reviews</span>
                </span>
              )}
              .
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
