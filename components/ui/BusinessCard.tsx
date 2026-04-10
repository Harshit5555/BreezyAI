'use client';

import { useState } from 'react';
import { PlaceDetails } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BusinessCardProps {
  business: PlaceDetails;
  category?: string;
}

export default function BusinessCard({ business, category }: BusinessCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const photos = business.photos || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="lg:w-80 flex-shrink-0">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800">
              <Image
                src={photos[selectedPhoto]}
                alt={business.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 mt-2">
                {photos.slice(0, 4).map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhoto(i)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden ${
                      i === selectedPhoto ? 'ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${business.name} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Business Info */}
        <div className="flex-1">
          {category && (
            <span className="inline-block px-2.5 py-1 bg-amber-500/10 text-amber-500 text-xs font-medium rounded-md mb-3">
              {category}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
            {business.name}
          </h1>
          <p className="text-zinc-400 text-sm mb-4">{business.address}</p>

          <div className="flex items-center gap-4">
            {business.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= business.rating! ? 'text-amber-400' : 'text-zinc-700'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-medium">{business.rating.toFixed(1)}</span>
                {business.reviewCount && (
                  <span className="text-zinc-500 text-sm">
                    ({business.reviewCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          {business.openHoursPerWeek && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-zinc-300 text-sm">Open {business.openHoursPerWeek}h/week</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
