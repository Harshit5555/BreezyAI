'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const PhoneRinging = dynamic(() => import('@/components/three/PhoneRinging'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-[#0a0e1a]" />,
});

interface LoadingStateProps {
  currentStep: number;
}

const LOADING_STEPS = [
  'Analyzing your business...',
  'Pulling your Google data...',
  'Scanning Reddit for missed leads...',
  'Calculating your revenue leak...',
];

export default function LoadingState({ currentStep }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0e1a] px-6">
      {/* Phone Animation */}
      <div className="w-full max-w-md h-64 mb-8">
        <PhoneRinging />
      </div>

      {/* Loading Steps */}
      <div className="space-y-3 text-center">
        {LOADING_STEPS.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.3,
              x: 0,
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            {index < currentStep ? (
              <svg className="w-5 h-5 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : index === currentStep ? (
              <svg
                className="w-5 h-5 text-[#f59e0b] animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[#334155]" />
            )}
            <span
              className={`text-lg ${
                index <= currentStep ? 'text-white' : 'text-[#94a3b8]'
              }`}
            >
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[#94a3b8] text-sm mt-8"
      >
        This usually takes 5-10 seconds...
      </motion.p>
    </div>
  );
}
