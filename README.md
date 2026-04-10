# Breezy Revenue Leak Report

A lead magnet app for [Breezy](https://getbreezy.app) that generates personalized "Revenue Leak Reports" for local service businesses. Users enter their business name, and the app pulls real Google Places data and Reddit posts to show them exactly how much money they're losing by not being available 24/7.

## Features

- **Google Places Integration**: Real business data including hours, ratings, and reviews
- **Competitor Analysis**: Compare against nearby competitors
- **Reddit Lead Discovery**: Find people asking for services in their area
- **Revenue Calculator**: Calculate potential lost revenue with adjustable parameters
- **Immersive 3D Visuals**: Three.js powered animations throughout
- **Responsive Design**: Works beautifully on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **3D/Visuals**: Three.js via @react-three/fiber + @react-three/drei
- **Animations**: Framer Motion
- **APIs**: Google Places API, PullPush Reddit API

## Getting Started

### Prerequisites

- Node.js 18+
- Google Places API key (from Google Cloud Console)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd breezy-revenue-leak
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Google Places API key to `.env.local`:
```
GOOGLE_PLACES_API_KEY=your_api_key_here
```

5. Enable the **Places API (New)** in your Google Cloud Console project.

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /page.tsx                    # Landing page with search
  /report/[placeId]/page.tsx   # Report page
  /api
    /places/search/route.ts    # Google Places text search
    /places/details/route.ts   # Google Places details
    /places/competitors/route.ts # Nearby competitors
    /reddit/search/route.ts    # Reddit post search

/components
  /three                       # Three.js components
    /CityScene.tsx             # Hero background
    /PhoneRinging.tsx          # Loading animation
    /MoneyRain.tsx             # Revenue section background
  /ui                          # UI components
    /SearchInput.tsx           # Google Places autocomplete
    /BusinessCard.tsx          # Business snapshot
    /HoursGrid.tsx             # Weekly hours display
    /RevenueCounter.tsx        # Animated counter
    /CompetitorTable.tsx       # Competitor comparison
    /RedditPostList.tsx        # Reddit posts
    /CTASection.tsx            # Call to action

/data
  /demand.json                 # Trade-specific demand data
  /subreddits.json             # City to subreddit mapping
  /city-sizes.json             # City population buckets

/lib
  /types.ts                    # TypeScript types
  /utils.ts                    # Utility functions
  /calculate.ts                # Revenue calculation logic
  /google-places.ts            # Google API helpers
  /reddit.ts                   # Reddit API helpers
```

## Revenue Calculation

The revenue leak is calculated using:

```
monthlyRevenueLeak = afterHoursSearches × captureRate × avgTicket
```

Where:
- `afterHoursSearches` = monthly searches × after-hours percentage
- `captureRate` = 15% (industry average)
- `avgTicket` = trade-specific average (user adjustable)

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `GOOGLE_PLACES_API_KEY` environment variable
4. Deploy

Remember to restrict your API key to your Vercel domain in Google Cloud Console.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_PLACES_API_KEY` | Google Places API key | Yes |

## License

MIT

## Credits

Built for [Breezy](https://getbreezy.app) - AI Front Desk for Solo Service Professionals
