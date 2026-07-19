'use client';

import * as React from 'react';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DISCLAIMER_TEXT } from '@/lib/constants';

export function DisclaimerBanner() {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full border-b border-border/30',
        'bg-muted/5'
      )}
      role="status"
      aria-label="Disclaimer"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Info className="h-4 w-4 flex-shrink-0 text-muted-foreground" />

        <p className="flex-1 text-xs text-muted-foreground leading-relaxed">
          {DISCLAIMER_TEXT}
        </p>

        <button
          onClick={() => setIsDismissed(true)}
          className={cn(
            'inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md',
            'text-muted-foreground/60 transition-colors duration-200',
            'hover:bg-surface hover:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background'
          )}
          aria-label="Dismiss disclaimer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
