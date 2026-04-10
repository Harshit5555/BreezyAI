'use client';

import dynamic from 'next/dynamic';
import SearchInput from '@/components/ui/SearchInput';
import { motion } from 'framer-motion';

const CityScene = dynamic(() => import('@/components/three/CityScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-zinc-950" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Three.js Background */}
      <div className="three-canvas-container">
        <CityScene />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <span className="text-amber-500 font-semibold text-lg">breezy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight"
          >
            How much revenue is<br />
            <span className="text-amber-500">your business leaking?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 max-w-md mx-auto"
          >
            Search your business. See how much you&apos;re losing when you can&apos;t answer calls.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SearchInput />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex justify-center gap-6 text-zinc-500 text-xs"
        >
          <span>Real Google data</span>
          <span className="text-zinc-700">·</span>
          <span>Free analysis</span>
          <span className="text-zinc-700">·</span>
          <span>No signup</span>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-[5]" />
    </main>
  );
}
