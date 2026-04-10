import { WeeklyHours, DayHours, TradeType, CitySize } from './types';

// Map Google Places primary types to our trade types
const typeMapping: Record<string, TradeType> = {
  plumber: 'plumber',
  electrician: 'electrician',
  hvac_contractor: 'hvac_contractor',
  heating_contractor: 'hvac_contractor',
  air_conditioning_contractor: 'hvac_contractor',
  locksmith: 'locksmith',
  roofing_contractor: 'roofing_contractor',
  moving_company: 'moving_company',
  painter: 'painter',
  house_painter: 'painter',
  landscaper: 'landscaper',
  lawn_care_service: 'landscaper',
  pest_control_service: 'pest_control',
  cleaning_service: 'cleaning_service',
  house_cleaning_service: 'cleaning_service',
  handyman: 'handyman',
  garage_door_supplier: 'garage_door',
  tree_service: 'tree_service',
  towing_service: 'towing',
  appliance_repair_service: 'appliance_repair',
};

export function mapGoogleTypeToTrade(googleType: string | undefined): TradeType {
  if (!googleType) return 'handyman';

  const normalizedType = googleType.toLowerCase().replace(/-/g, '_');
  return typeMapping[normalizedType] || 'handyman';
}

export function extractCityFromAddress(address: string): string {
  // Try to extract city from formatted address
  // Format is usually: "123 Main St, City, State ZIP, Country"
  const parts = address.split(',').map(p => p.trim());

  if (parts.length >= 3) {
    // The city is typically the second-to-last part before state/zip
    const cityPart = parts[parts.length - 3] || parts[1];
    // Remove any numbers (zip codes that might be merged)
    return cityPart.replace(/\d+/g, '').trim().toLowerCase();
  }

  if (parts.length >= 2) {
    return parts[1].replace(/\d+/g, '').trim().toLowerCase();
  }

  return '';
}

export function parseGoogleHours(regularOpeningHours: {
  weekdayDescriptions?: string[];
  periods?: Array<{
    open: { day: number; hour: number; minute: number };
    close?: { day: number; hour: number; minute: number };
  }>;
}): WeeklyHours | null {
  if (!regularOpeningHours?.periods) return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const hours: WeeklyHours = {};

  for (const period of regularOpeningHours.periods) {
    const dayName = days[period.open.day];
    const openTime = formatTime(period.open.hour, period.open.minute);
    const closeTime = period.close
      ? formatTime(period.close.hour, period.close.minute)
      : '23:59';

    hours[dayName] = {
      open: openTime,
      close: closeTime,
    };
  }

  // Mark closed days
  for (const day of days) {
    if (!hours[day]) {
      hours[day] = { open: '', close: '', isClosed: true };
    }
  }

  return hours;
}

function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function calculateOpenHoursPerWeek(hours: WeeklyHours | null): number {
  if (!hours) {
    // Default to Mon-Fri 8-5 (45 hours/week)
    return 45;
  }

  let totalMinutes = 0;
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

  for (const day of days) {
    const dayHours = hours[day];
    if (dayHours && !dayHours.isClosed && dayHours.open && dayHours.close) {
      const openMinutes = timeToMinutes(dayHours.open);
      let closeMinutes = timeToMinutes(dayHours.close);

      // Handle overnight hours
      if (closeMinutes < openMinutes) {
        closeMinutes += 24 * 60;
      }

      totalMinutes += closeMinutes - openMinutes;
    }
  }

  return Math.round(totalMinutes / 60);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatHoursDisplay(dayHours: DayHours | undefined): string {
  if (!dayHours || dayHours.isClosed) return 'Closed';
  return `${formatTimeDisplay(dayHours.open)} - ${formatTimeDisplay(dayHours.close)}`;
}

function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return minutes === 0 ? `${displayHours}${period}` : `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
}

export function getCitySize(cityName: string, citySizes: Record<string, CitySize>): CitySize {
  const normalizedCity = cityName.toLowerCase().trim();
  return citySizes[normalizedCity] || 'medium';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
