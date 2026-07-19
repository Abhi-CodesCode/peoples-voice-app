'use client';

import { Shield, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PrivacyConfirmationProps {
  confirmed: boolean;
  onConfirmChange: (checked: boolean) => void;
}

export function PrivacyConfirmation({ confirmed, onConfirmChange }: PrivacyConfirmationProps) {
  const points = [
    'Strictly Anonymous: Your name is never asked, stored, or visible.',
    'No Contact Info: We do not collect your email address or phone number.',
    'Privacy-Preserving Map: Only city-level coordinates are used. Precise GPS is never tracked.',
    'Open Source: The application code and database schema are open and public.'
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-surface/40 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Privacy Safeguards</h3>
        </div>
        
        <ul className="space-y-3.5">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/20 p-4">
        <Checkbox
          id="privacy-notice-confirm"
          checked={confirmed}
          onCheckedChange={(checked) => onConfirmChange(!!checked)}
          className="mt-1"
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="privacy-notice-confirm"
            className="text-sm font-medium leading-relaxed text-foreground cursor-pointer"
          >
            I understand and accept that this platform visualizes voluntary submissions from individuals. My submission is fully anonymous.
          </Label>
        </div>
      </div>
    </div>
  );
}
