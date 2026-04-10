import { PlaceSearchResult, PlaceDetails, WeeklyHours } from './types';
import { parseGoogleHours, calculateOpenHoursPerWeek } from './utils';

const PLACES_API_BASE = 'https://places.googleapis.com/v1';

interface GooglePlaceSearchResponse {
  places?: Array<{
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    primaryType?: string;
  }>;
}

interface GoogleReview {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text: string };
  authorAttribution?: { displayName: string };
  publishTime?: string;
}

interface GooglePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
}

interface GooglePlaceDetailsResponse {
  id?: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  location?: { latitude: number; longitude: number };
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
    periods?: Array<{
      open: { day: number; hour: number; minute: number };
      close?: { day: number; hour: number; minute: number };
    }>;
  };
  websiteUri?: string;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
  photos?: GooglePhoto[];
}

interface GoogleNearbySearchResponse {
  places?: GooglePlaceDetailsResponse[];
}

export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('Google Places API key not configured');
  }

  const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.primaryType',
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${error}`);
  }

  const data: GooglePlaceSearchResponse = await response.json();

  return (data.places || []).map((place) => ({
    placeId: place.id,
    name: place.displayName?.text || 'Unknown',
    address: place.formattedAddress || '',
    primaryType: place.primaryType,
  }));
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('Google Places API key not configured');
  }

  const response = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,rating,userRatingCount,primaryType,location,regularOpeningHours,photos',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${error}`);
  }

  const data: GooglePlaceDetailsResponse = await response.json();

  const hours: WeeklyHours | undefined = data.regularOpeningHours
    ? parseGoogleHours(data.regularOpeningHours) ?? undefined
    : undefined;

  // Build photo URLs
  const photos = (data.photos || []).slice(0, 5).map((photo) =>
    `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=600&key=${apiKey}`
  );

  return {
    placeId: data.id || placeId,
    name: data.displayName?.text || 'Unknown',
    address: data.formattedAddress || '',
    rating: data.rating,
    reviewCount: data.userRatingCount,
    primaryType: data.primaryType,
    location: data.location
      ? { lat: data.location.latitude, lng: data.location.longitude }
      : undefined,
    hours,
    openHoursPerWeek: calculateOpenHoursPerWeek(hours ?? null),
    photos,
  };
}

export async function getNearbyCompetitors(
  lat: number,
  lng: number,
  primaryType: string,
  limit: number = 5
): Promise<PlaceDetails[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('Google Places API key not configured');
  }

  // Map our trade types to Google's included types
  const includedTypes = mapToGoogleTypes(primaryType);

  const response = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.primaryType,places.location,places.regularOpeningHours',
    },
    body: JSON.stringify({
      includedPrimaryTypes: includedTypes,
      maxResultCount: limit + 1, // Get one extra in case we include the original business
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 16093.4, // 10 miles in meters
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${error}`);
  }

  const data: GoogleNearbySearchResponse = await response.json();

  return (data.places || []).slice(0, limit).map((place) => {
    const hours: WeeklyHours | undefined = place.regularOpeningHours
      ? parseGoogleHours(place.regularOpeningHours) ?? undefined
      : undefined;

    return {
      placeId: place.id || '',
      name: place.displayName?.text || 'Unknown',
      address: place.formattedAddress || '',
      rating: place.rating,
      reviewCount: place.userRatingCount,
      primaryType: place.primaryType,
      location: place.location
        ? { lat: place.location.latitude, lng: place.location.longitude }
        : undefined,
      hours,
      openHoursPerWeek: calculateOpenHoursPerWeek(hours ?? null),
    };
  });
}

export interface PlaceWithReviews extends PlaceDetails {
  websiteUri?: string;
  reviews: Array<{
    rating: number;
    text: string;
    time: string;
    author: string;
  }>;
}

export async function getPlaceWithReviews(placeId: string): Promise<PlaceWithReviews> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('Google Places API key not configured');
  }

  const response = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,rating,userRatingCount,primaryType,location,regularOpeningHours,websiteUri,reviews',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${error}`);
  }

  const data: GooglePlaceDetailsResponse = await response.json();

  const hours: WeeklyHours | undefined = data.regularOpeningHours
    ? parseGoogleHours(data.regularOpeningHours) ?? undefined
    : undefined;

  const reviews = (data.reviews || []).map((r) => ({
    rating: r.rating || 0,
    text: r.text?.text || '',
    time: r.relativePublishTimeDescription || '',
    author: r.authorAttribution?.displayName || 'Anonymous',
  }));

  return {
    placeId: data.id || placeId,
    name: data.displayName?.text || 'Unknown',
    address: data.formattedAddress || '',
    rating: data.rating,
    reviewCount: data.userRatingCount,
    primaryType: data.primaryType,
    location: data.location
      ? { lat: data.location.latitude, lng: data.location.longitude }
      : undefined,
    hours,
    openHoursPerWeek: calculateOpenHoursPerWeek(hours ?? null),
    websiteUri: data.websiteUri,
    reviews,
  };
}

function mapToGoogleTypes(tradeType: string): string[] {
  const typeMap: Record<string, string[]> = {
    plumber: ['plumber'],
    electrician: ['electrician'],
    hvac_contractor: ['hvac_contractor'],
    locksmith: ['locksmith'],
    roofing_contractor: ['roofing_contractor'],
    moving_company: ['moving_company'],
    painter: ['painter'],
    landscaper: ['landscaper'],
    pest_control: ['pest_control_service'],
    cleaning_service: ['cleaning_service'],
    handyman: ['handyman'],
    garage_door: ['garage_door_supplier'],
    tree_service: ['tree_service'],
    towing: ['towing_service'],
    appliance_repair: ['appliance_repair_service'],
  };

  // Try to find a match
  for (const [key, value] of Object.entries(typeMap)) {
    if (tradeType.toLowerCase().includes(key)) {
      return value;
    }
  }

  // Default to the original type
  return [tradeType];
}
