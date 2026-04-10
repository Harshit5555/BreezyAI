import { NextRequest, NextResponse } from 'next/server';
import { getPlaceWithReviews } from '@/lib/google-places';
import { analyzeBusinessIntelligence } from '@/lib/business-intelligence';

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
    const placeWithReviews = await getPlaceWithReviews(placeId);
    const intelligence = analyzeBusinessIntelligence(placeWithReviews, placeWithReviews.name);

    return NextResponse.json({
      ...intelligence,
      reviews: placeWithReviews.reviews,
    });
  } catch (error) {
    console.error('Business intelligence error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze business' },
      { status: 500 }
    );
  }
}
