'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon,
  suffix = '',
  delay = 0,
}: StatCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    const unsubscribe = rounded.on('change', (v) => {
      setDisplayValue(v);
    });

    const controls = animate(motionValue, value, {
      duration: 1.5,
      delay,
      ease: 'easeOut',
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [isInView, motionValue, rounded, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'bg-surface border border-border/40',
        'p-6 transition-shadow duration-300',
        'hover:shadow-lg hover:shadow-primary/5',
        'hover:border-primary/20'
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100',
          'bg-gradient-to-br from-primary/5 via-transparent to-transparent'
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {displayValue.toLocaleString('en-IN')}
            {suffix && (
              <span className="ml-0.5 text-lg text-muted-foreground">
                {suffix}
              </span>
            )}
          </p>
        </div>

        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'bg-primary/10 text-primary',
            'transition-colors duration-200',
            'group-hover:bg-primary/15'
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
