'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessIntelligence as BusinessIntelligenceType } from '@/lib/types';

interface Review {
  rating: number;
  text: string;
  time: string;
  author: string;
}

interface IntelligenceData extends BusinessIntelligenceType {
  reviews: Review[];
}

interface BusinessIntelligenceProps {
  placeId: string;
  businessType: string;
  businessName: string;
  rating?: number;
  reviewCount?: number;
  hasWebsite?: boolean;
  hasHours?: boolean;
}

export default function BusinessIntelligence({
  placeId,
  rating,
  reviewCount,
  hasWebsite,
  hasHours,
}: BusinessIntelligenceProps) {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        const res = await fetch(`/api/places/intelligence?placeId=${encodeURIComponent(placeId)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const intelligence = await res.json();
        setData(intelligence);
      } catch (err) {
        console.error('Intelligence fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntelligence();
  }, [placeId]);

  useEffect(() => {
    if (!data?.reviews.length) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % data.reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [data?.reviews.length]);

  const goToReview = useCallback((index: number) => {
    setCurrentReviewIndex(index);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-1/4 animate-pulse" />
        <div className="h-20 bg-zinc-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Your Google presence</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Stat
            label="Rating"
            value={rating ? `${rating.toFixed(1)} stars` : 'Not rated'}
            good={rating ? rating >= 4.0 : false}
          />
          <Stat
            label="Reviews"
            value={reviewCount ? reviewCount.toLocaleString() : '0'}
            good={reviewCount ? reviewCount >= 50 : false}
          />
          <Stat label="Website" value={hasWebsite ? 'Listed' : 'Not listed'} good={!!hasWebsite} />
          <Stat label="Hours" value={hasHours ? 'Listed' : 'Not listed'} good={!!hasHours} />
        </div>
      </div>

      {/* Reviews */}
      {data?.reviews && data.reviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-white">What customers say</h3>
            <div className="flex gap-1.5">
              {data.reviews.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToReview(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentReviewIndex ? 'bg-amber-500' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[100px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReviewIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {data.reviews[currentReviewIndex] && (
                  <div className="border-l-2 border-zinc-700 pl-4">
                    <p className="text-zinc-300 leading-relaxed mb-2">
                      "{data.reviews[currentReviewIndex].text}"
                    </p>
                    <p className="text-zinc-500 text-sm">
                      — {data.reviews[currentReviewIndex].author}, {data.reviews[currentReviewIndex].time}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Sentiment */}
      {data?.reviewSentiment && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Review sentiment</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${data.reviewSentiment.positive}%` }}
              />
            </div>
            <span className="text-green-400 text-sm font-medium">
              {data.reviewSentiment.positive}% positive
            </span>
          </div>
          {data.reviewSentiment.keywords.length > 0 && (
            <p className="text-zinc-500 text-sm mt-3">
              People often mention:{' '}
              {data.reviewSentiment.keywords
                .slice(0, 5)
                .map((k) => k.word)
                .join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-zinc-500">{label}:</span>
      <span className={good ? 'text-white' : 'text-zinc-400'}>{value}</span>
    </div>
  );
}
