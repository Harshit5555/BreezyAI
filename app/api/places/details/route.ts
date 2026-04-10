import { NextRequest, NextResponse } from 'next/server';
import { getPlaceDetails } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json(
      { error: 'placeId parameter is required' },
      { status: 400 }
    );
  }

  try {
    const details = await getPlaceDetails(placeId);
    return NextResponse.json(details);
  } catch (error) {
    console.error('Place details error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get place details' },
      { status: 500 }
    );
  }
}
