import { RevenueLeakCalculation, BusinessCategory, CitySize } from './types';
import { getCategoryInfo } from './categories';

const HOURS_PER_WEEK = 168;
const CAPTURE_RATE = 0.15; // Industry average: ~15% of searches convert to a call

export function calculateRevenueLeak(
  openHoursPerWeek: number,
  category: BusinessCategory,
  citySize: CitySize,
  customAvgTicket?: number
): RevenueLeakCalculation {
  const categoryInfo = getCategoryInfo(category);

  const closedHoursPerWeek = HOURS_PER_WEEK - openHoursPerWeek;
  const closedPercent = (closedHoursPerWeek / HOURS_PER_WEEK) * 100;

  const monthlySearches = categoryInfo.avgMonthlySearches[citySize];
  const afterHoursSearches = Math.round(monthlySearches * (categoryInfo.afterHoursPercent / 100));

  const avgTicket = customAvgTicket ?? categoryInfo.avgTicket;
  const monthlyRevenueLeak = Math.round(afterHoursSearches * CAPTURE_RATE * avgTicket);
  const yearlyRevenueLeak = monthlyRevenueLeak * 12;

  return {
    closedHoursPerWeek,
    closedHoursPercent: Math.round(closedPercent),
    monthlySearchVolume: monthlySearches,
    afterHoursSearches,
    captureRate: CAPTURE_RATE,
    avgTicket,
    monthlyRevenueLeak,
    yearlyRevenueLeak,
  };
}

export function getDefaultTicket(category: BusinessCategory): number {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.avgTicket;
}

export function getAfterHoursPercent(category: BusinessCategory): number {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.afterHoursPercent;
}
