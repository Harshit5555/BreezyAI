'use client';

import { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '@/lib/utils';

interface RevenueCounterProps {
  amount: number;
  duration?: number;
}

export default function RevenueCounter({ amount, duration = 1500 }: RevenueCounterProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAmount = Math.round(easeOut * amount);

      setDisplayAmount(currentAmount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [amount, duration]);

  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-red-500 tabular-nums tracking-tight">
        {formatCurrency(displayAmount)}
      </div>
      <div className="text-zinc-400 text-sm mt-2">per year</div>
    </div>
  );
}
