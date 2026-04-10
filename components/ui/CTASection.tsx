'use client';

import { formatCurrency } from '@/lib/utils';

interface CTASectionProps {
  yearlyRevenueLeak: number;
}

export default function CTASection({ yearlyRevenueLeak }: CTASectionProps) {
  const monthly = Math.round(yearlyRevenueLeak / 12);

  return (
    <div className="border-t border-zinc-800 pt-10 mt-10">
      <div className="max-w-xl">
        <p className="text-zinc-400 text-sm mb-2">The fix is simple</p>
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
          What if someone answered every call?
        </h2>

        <p className="text-zinc-400 leading-relaxed mb-6">
          That&apos;s {formatCurrency(monthly)} back in your pocket every month.
          Breezy picks up when you can&apos;t, books appointments, and texts you the details.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href="https://getbreezy.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-amber-500 text-zinc-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
          >
            Try it free
          </a>
          <a
            href="https://getbreezy.app/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-zinc-300 hover:text-white transition-colors"
          >
            See how it works
          </a>
        </div>

        <p className="text-zinc-600 text-xs">
          No credit card. Takes 2 minutes to set up.
        </p>
      </div>
    </div>
  );
}
