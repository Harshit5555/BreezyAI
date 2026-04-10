// Google Places Types
export interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string;
  primaryType?: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  primaryType?: string;
  location?: {
    lat: number;
    lng: number;
  };
  hours?: WeeklyHours;
  openHoursPerWeek?: number;
  photos?: string[];
}

export interface WeeklyHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed?: boolean;
}

// Reddit Types
export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  createdUtc: number;
  numComments: number;
  score: number;
  url: string;
  permalink: string;
  selftext?: string;
}

// Demand Data Types
export interface DemandData {
  avgMonthlySearches: {
    small: number;
    medium: number;
    large: number;
  };
  afterHoursPercent: number;
  avgTicket: number;
}

export type CitySize = 'small' | 'medium' | 'large';

// Expanded business categories
export type BusinessCategory =
  // Home Services
  | 'plumber'
  | 'electrician'
  | 'hvac_contractor'
  | 'locksmith'
  | 'roofing_contractor'
  | 'moving_company'
  | 'painter'
  | 'landscaper'
  | 'pest_control'
  | 'cleaning_service'
  | 'handyman'
  | 'garage_door'
  | 'tree_service'
  | 'towing'
  | 'appliance_repair'
  // Food & Dining - General
  | 'restaurant'
  | 'cafe'
  | 'bakery'
  | 'bar'
  | 'food_truck'
  | 'catering'
  // Food & Dining - Asian Restaurants (realistic pricing)
  | 'dumpling_restaurant'
  | 'noodle_restaurant'
  | 'ramen_restaurant'
  | 'pho_restaurant'
  | 'sushi_restaurant'
  | 'dim_sum_restaurant'
  | 'chinese_restaurant'
  | 'thai_restaurant'
  | 'vietnamese_restaurant'
  | 'korean_restaurant'
  | 'indian_restaurant'
  | 'japanese_restaurant'
  // Food & Dining - Other Cuisines
  | 'italian_restaurant'
  | 'mexican_restaurant'
  | 'seafood_restaurant'
  | 'steakhouse'
  | 'pizza_restaurant'
  | 'burger_restaurant'
  | 'fast_food'
  | 'sandwich_restaurant'
  | 'breakfast_restaurant'
  // Health & Wellness
  | 'gym'
  | 'yoga_studio'
  | 'spa'
  | 'massage'
  | 'chiropractor'
  | 'dentist'
  | 'doctor'
  | 'veterinarian'
  // Beauty & Personal Care
  | 'hair_salon'
  | 'barber'
  | 'nail_salon'
  | 'beauty_salon'
  | 'tattoo'
  // Retail
  | 'retail_store'
  | 'clothing_store'
  | 'jewelry_store'
  | 'florist'
  | 'pet_store'
  // Auto
  | 'auto_repair'
  | 'car_wash'
  | 'auto_dealer'
  | 'tire_shop'
  // Professional Services
  | 'lawyer'
  | 'accountant'
  | 'real_estate'
  | 'insurance'
  | 'photography'
  // Other
  | 'hotel'
  | 'daycare'
  | 'tutoring'
  | 'music_lessons'
  | 'other';

// Keep TradeType as alias for backward compatibility
export type TradeType = BusinessCategory;

// Business category metadata
export interface CategoryInfo {
  displayName: string;
  keywords: string[];
  redditSearchTerms: string[];
  avgTicket: number;
  afterHoursPercent: number;
  avgMonthlySearches: { small: number; medium: number; large: number };
}

// Revenue Calculation Types
export interface RevenueLeakCalculation {
  closedHoursPerWeek: number;
  closedHoursPercent: number;
  monthlySearchVolume: number;
  afterHoursSearches: number;
  captureRate: number;
  avgTicket: number;
  monthlyRevenueLeak: number;
  yearlyRevenueLeak: number;
}

// Business Intelligence Types
export interface BusinessIntelligence {
  deliveryPresence: {
    doordash: boolean;
    ubereats: boolean;
    grubhub: boolean;
  };
  seoScore: number; // 0-100
  seoIssues: string[];
  reviewSentiment: {
    positive: number;
    negative: number;
    neutral: number;
    keywords: { word: string; count: number; sentiment: 'positive' | 'negative' }[];
    recentTrend: 'improving' | 'declining' | 'stable';
  };
}

// Report Types
export interface BusinessReport {
  business: PlaceDetails;
  competitors: PlaceDetails[];
  redditPosts: RedditPost[];
  revenueLeak: RevenueLeakCalculation;
  cityName: string;
  tradeType: TradeType;
}
