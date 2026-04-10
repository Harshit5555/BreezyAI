'use client';

import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import { PlaceDetails, RevenueLeakCalculation, BusinessCategory, CitySize } from '@/lib/types';
import { extractCityFromAddress, getCitySize, formatCurrency } from '@/lib/utils';
import { detectBusinessCategory, getCategoryDisplayName } from '@/lib/categories';
import { calculateRevenueLeak, getDefaultTicket } from '@/lib/calculate';
import citySizes from '@/data/city-sizes.json';

import LoadingState from '@/components/ui/LoadingState';
import BusinessCard from '@/components/ui/BusinessCard';
import RevenueBreakdown from '@/components/ui/RevenueBreakdown';
import TicketSlider from '@/components/ui/TicketSlider';
import BusinessIntelligence from '@/components/ui/BusinessIntelligence';
import CTASection from '@/components/ui/CTASection';

const CompetitorBars = dynamic(() => import('@/components/three/CompetitorBars'), {
  ssr: false,
  loading: () => <div className="w-full h-[280px] bg-zinc-900 rounded-lg animate-pulse" />,
});

interface ReportData {
  business: PlaceDetails;
  competitors: PlaceDetails[];
  cityName: string;
  category: BusinessCategory;
  citySize: CitySize;
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const resolvedParams = use(params);
  const placeId = decodeURIComponent(resolvedParams.placeId);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReportData | null>(null);
  const [avgTicket, setAvgTicket] = useState<number>(250);
  const [calculation, setCalculation] = useState<RevenueLeakCalculation | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingStep(0);

        const detailsRes = await fetch(`/api/places/details?placeId=${encodeURIComponent(placeId)}`);
        if (!detailsRes.ok) throw new Error('Failed to fetch business details');
        const business: PlaceDetails = await detailsRes.json();

        setLoadingStep(1);

        const cityName = extractCityFromAddress(business.address);
        const category = detectBusinessCategory(business.primaryType, business.name);
        const citySize = getCitySize(cityName, citySizes as Record<string, CitySize>);

        const defaultTicket = getDefaultTicket(category);
        setAvgTicket(defaultTicket);

        let competitors: PlaceDetails[] = [];
        if (business.location && business.primaryType) {
          try {
            const competitorsRes = await fetch(
              `/api/places/competitors?lat=${business.location.lat}&lng=${business.location.lng}&type=${business.primaryType}&limit=5`
            );
            if (competitorsRes.ok) {
              const competitorsData = await competitorsRes.json();
              competitors = competitorsData.competitors.filter(
                (c: PlaceDetails) => c.placeId !== business.placeId
              );
            }
          } catch (e) {
            console.error('Failed to fetch competitors:', e);
          }
        }

        setLoadingStep(2);

        const calc = calculateRevenueLeak(
          business.openHoursPerWeek || 45,
          category,
          citySize,
          defaultTicket
        );
        setCalculation(calc);

        setData({
          business,
          competitors,
          cityName: cityName || 'your area',
          category,
          citySize,
        });

        setLoadingStep(3);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate report');
        setIsLoading(false);
      }
    }

    fetchData();
  }, [placeId]);

  useEffect(() => {
    if (data) {
      const calc = calculateRevenueLeak(
        data.business.openHoursPerWeek || 45,
        data.category,
        data.citySize,
        avgTicket
      );
      setCalculation(calc);
    }
  }, [avgTicket, data]);

  if (isLoading) {
    return <LoadingState currentStep={loadingStep} />;
  }

  if (error || !data || !calculation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-lg font-medium text-white mb-2">Unable to generate report</h1>
          <p className="text-zinc-500 text-sm mb-6">{error || 'Failed to load business data'}</p>
          <a href="/" className="text-amber-500 hover:text-amber-400 text-sm">
            Try another search
          </a>
        </div>
      </div>
    );
  }

  const categoryName = getCategoryDisplayName(data.category);

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-amber-500 font-semibold">breezy</a>
          <a href="/" className="text-zinc-500 hover:text-white text-sm">
            New search
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Business Info */}
        <BusinessCard business={data.business} category={categoryName} />

        {/* Revenue Number */}
        <div className="mt-12 mb-8">
          <p className="text-zinc-500 text-sm mb-2">Estimated yearly loss</p>
          <div className="flex items-baseline gap-4">
            <span className="text-4xl md:text-5xl font-semibold text-red-400 tabular-nums">
              {formatCurrency(calculation.yearlyRevenueLeak)}
            </span>
            <span className="text-zinc-600">/ year</span>
          </div>
        </div>

        {/* Ticket Slider */}
        <div className="mb-12 max-w-sm">
          <TicketSlider
            value={avgTicket}
            onChange={setAvgTicket}
            min={Math.round(getDefaultTicket(data.category) * 0.3)}
            max={Math.round(getDefaultTicket(data.category) * 3)}
          />
        </div>

        {/* Breakdown */}
        <RevenueBreakdown calculation={calculation} tradeType={data.category} cityName={data.cityName} />

        {/* Competitors */}
        {data.competitors.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-medium text-white mb-4">Hours vs. competitors</h3>
            <CompetitorBars business={data.business} competitors={data.competitors} />
          </div>
        )}

        {/* Business Intelligence */}
        <div className="mt-12">
          <BusinessIntelligence
            placeId={data.business.placeId}
            businessType={data.business.primaryType || data.category}
            businessName={data.business.name}
            rating={data.business.rating}
            reviewCount={data.business.reviewCount}
            hasWebsite={true}
            hasHours={!!data.business.hours}
          />
        </div>

        {/* CTA */}
        <CTASection yearlyRevenueLeak={calculation.yearlyRevenueLeak} />
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <p className="text-zinc-600 text-xs">Estimates based on industry averages</p>
          <a href="https://getbreezy.app" className="text-amber-500 text-sm hover:text-amber-400">
            getbreezy.app
          </a>
        </div>
      </footer>
    </main>
  );
}
