import { RedditPost, BusinessCategory } from './types';
import { getCategoryInfo } from './categories';

export function formatRedditDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export async function searchRedditPosts(
  city: string,
  trade: BusinessCategory,
  _businessName?: string,
  limit: number = 10
): Promise<RedditPost[]> {
  const categoryInfo = getCategoryInfo(trade);
  const searchTerms = categoryInfo.redditSearchTerms;
  const firstTerm = searchTerms.length > 0 ? searchTerms[0] : trade;
  const query = city + ' ' + firstTerm;

  try {
    const response = await fetch(
      'https://www.reddit.com/search.json?q=' + encodeURIComponent(query) + '&sort=relevance&limit=' + limit,
      {
        headers: {
          'User-Agent': 'BreezyRevenueLeakCalculator/1.0',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    interface RedditChild {
      data: {
        id: string;
        title: string;
        subreddit: string;
        author: string;
        created_utc: number;
        num_comments: number;
        score: number;
        url: string;
        permalink: string;
        selftext?: string;
      };
    }

    const data = await response.json();
    const posts: RedditPost[] = data.data.children.map((child: RedditChild) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      createdUtc: child.data.created_utc,
      numComments: child.data.num_comments,
      score: child.data.score,
      url: child.data.url,
      permalink: 'https://reddit.com' + child.data.permalink,
      selftext: child.data.selftext,
    }));

    return posts;
  } catch (error) {
    console.error('Reddit search error:', error);
    return [];
  }
}
