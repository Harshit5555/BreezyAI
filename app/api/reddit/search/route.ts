import { NextRequest, NextResponse } from 'next/server';
import { searchRedditPosts } from '@/lib/reddit';
import { BusinessCategory } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const trade = searchParams.get('trade') as BusinessCategory | null;
  const limit = searchParams.get('limit');

  if (!city) {
    return NextResponse.json(
      { error: 'city parameter is required' },
      { status: 400 }
    );
  }

  if (!trade) {
    return NextResponse.json(
      { error: 'trade parameter is required' },
      { status: 400 }
    );
  }

  try {
    const posts = await searchRedditPosts(
      city,
      trade,
      undefined, // businessName
      limit ? parseInt(limit, 10) : 10
    );
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Reddit search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search Reddit' },
      { status: 500 }
    );
  }
}
