import { NextRequest, NextResponse } from 'next/server';
import { getNearbyCompetitors } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const type = searchParams.get('type');
  const limit = searchParams.get('limit');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'lat and lng parameters are required' },
      { status: 400 }
    );
  }

  if (!type) {
    return NextResponse.json(
      { error: 'type parameter is required' },
      { status: 400 }
    );
  }

  try {
    const competitors = await getNearbyCompetitors(
      parseFloat(lat),
      parseFloat(lng),
      type,
      limit ? parseInt(limit, 10) : 5
    );
    return NextResponse.json({ competitors });
  } catch (error) {
    console.error('Competitors search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get competitors' },
      { status: 500 }
    );
  }
}
