import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const results = await searchPlaces(query);
    return NextResponse.json({ places: results });
  } catch (error) {
    console.error('Places search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search places' },
      { status: 500 }
    );
  }
}
