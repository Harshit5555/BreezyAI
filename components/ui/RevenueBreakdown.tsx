'use client';

import { RevenueLeakCalculation, TradeType } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { getAfterHoursPercent } from '@/lib/calculate';

interface RevenueBreakdownProps {
  calculation: RevenueLeakCalculation;
  tradeType: TradeType;
  cityName: string;
}

export default function RevenueBreakdown({
  calculation,
  tradeType,
  cityName,
}: RevenueBreakdownProps) {
  const tradeName = tradeType.replace(/_/g, ' ');
  const afterHoursPercent = getAfterHoursPercent(tradeType);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">The math</h3>

      <div className="text-zinc-400 leading-relaxed">
        <p className="mb-4">
          In {cityName}, there are roughly <span className="text-white font-medium">{formatNumber(calculation.monthlySearchVolume)}</span> searches
          for {tradeName}s every month. About <span className="text-amber-500 font-medium">{afterHoursPercent}%</span> of
          those happen outside normal business hours.
        </p>
        <p className="mb-4">
          That&apos;s <span className="text-white font-medium">{formatNumber(calculation.afterHoursSearches)}</span> people
          looking for help when most businesses aren&apos;t answering. If even{' '}
          <span className="text-white font-medium">{(calculation.captureRate * 100).toFixed(0)}%</span> of
          them call and you miss it, that&apos;s money walking to your competitor.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 pt-4 border-t border-zinc-800/50">
        <div>
          <p className="text-zinc-500 text-sm mb-1">At {formatCurrency(calculation.avgTicket)} per job</p>
          <p className="text-red-400 text-2xl font-semibold">
            {formatCurrency(calculation.monthlyRevenueLeak)}/mo lost
          </p>
        </div>
        <div className="text-zinc-600 text-sm">
          = {formatCurrency(calculation.yearlyRevenueLeak)} per year
        </div>
      </div>
    </div>
  );
}
