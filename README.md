# Breezy Revenue Leak Report

A lead magnet tool by [Breezy](https://getbreezy.app) that shows local service businesses exactly how much money they're losing by missing after-hours calls. Enter a business name, get a personalized revenue leak report backed by real data.

## How It Works

1. **Search** - Type a business name. The app pulls real data from Google Places (hours, ratings, reviews, location).
2. **Analyze** - The engine calculates after-hours search volume for the business category and city size, then estimates lost revenue using industry conversion rates.
3. **Compare** - See how the business stacks up against nearby competitors on ratings, reviews, and availability.
4. **Discover** - Surface Reddit posts from people actively searching for that service in the area.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| 3D Visuals | Three.js via React Three Fiber + Drei |
| Animations | Framer Motion |
| Charts | Recharts |
| APIs | Google Places API (New), PullPush Reddit API |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Add your Google Places API key to .env.local:
#   GOOGLE_PLACES_API_KEY=your_key_here

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Prerequisites:** Node.js 18+ and a [Google Places API](https://console.cloud.google.com/) key with the Places API (New) enabled.

## Project Structure

```
app/
  page.tsx                         # Landing page with business search
  report/[placeId]/page.tsx        # Generated revenue leak report
  api/
    places/search/route.ts         # Business name autocomplete
    places/details/route.ts        # Full business details
    places/competitors/route.ts    # Nearby competitor lookup
    places/intelligence/route.ts   # SEO & delivery presence checks
    reddit/search/route.ts         # Reddit post discovery

components/
  ui/        # React UI (search, business card, revenue breakdown, CTA, etc.)
  three/     # Three.js scenes (city skyline, money rain, competitor bars, etc.)

lib/
  calculate.ts            # Revenue leak formula
  google-places.ts        # Google API helpers
  reddit.ts               # Reddit API helpers
  categories.ts           # 60+ business category definitions
  types.ts                # Shared TypeScript types
  utils.ts                # General utilities

data/
  demand.json             # Search volume by trade and city size
  subreddits.json         # City-to-subreddit mapping
  city-sizes.json         # City population buckets
```

## Revenue Leak Formula

```
Monthly Revenue Leak = After-Hours Searches x Capture Rate x Avg Ticket
```

- **After-Hours Searches** = monthly search volume for the category/city x after-hours percentage
- **Capture Rate** = 15% (industry average search-to-call conversion)
- **Avg Ticket** = category-specific default, adjustable via slider

## Deployment

Deploy to Vercel (or any platform supporting Next.js):

1. Push to GitHub
2. Import in Vercel
3. Set `GOOGLE_PLACES_API_KEY` as an environment variable
4. Restrict the API key to your production domain in Google Cloud Console

## License

MIT

---

Built for [Breezy](https://getbreezy.app) - AI Front Desk for Solo Service Professionals
