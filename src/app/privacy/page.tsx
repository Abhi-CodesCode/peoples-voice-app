import { Metadata } from 'next';
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner';
import { Shield, Lock, EyeOff, Server, HelpCircle } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn about our strict commitment to anonymity and privacy-first design principles.',
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-[90vh]">
      <DisclaimerBanner />
      
      <div className="page-container py-12 max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex rounded-full bg-primary/10 p-2.5 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: July 19, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/90 text-sm leading-relaxed">
          {/* Section 1: Our Promise */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              1. Our Core Commitment to Anonymity
            </h2>
            <p>
              This platform was engineered from the ground up to protect your identity. 
              We believe in free, unpunished expression, which is why we do not require accounts, profiles, or registration forms that track you.
            </p>
          </section>

          {/* Section 2: Data We Never Collect */}
          <section className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <h2 className="text-base font-bold text-destructive flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              2. What We NEVER Collect
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Our servers are programmed to discard or ignore the following information immediately:
            </p>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs font-semibold">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                No Names or Usernames
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                No Email Addresses
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                No Phone Numbers
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                No Precise GPS Coordinates
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                No Physical Addresses
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                No IP Addresses Saved in Database
              </li>
            </ul>
          </section>

          {/* Section 3: What We Do Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              3. Information We Collect
            </h2>
            <p>
              We only save aggregated, city-level markers to draw the participation heatmap:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>City & State:</strong> Self-declared locations (e.g. Lucknow, Uttar Pradesh).
              </li>
              <li>
                <strong>Approximate Centroid:</strong> Geolocation lat/long mapped to the center of the city, not your device coordinates.
              </li>
              <li>
                <strong>Alignment Metric:</strong> Your declared status (Supporting, Participating, Undecided).
              </li>
              <li>
                <strong>Optional Demographics:</strong> General age group and occupation if you choose to enter them.
              </li>
            </ul>
          </section>

          {/* Section 4: Cookies & Tracking */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-primary" />
              4. Cookies and Advertising
            </h2>
            <p>
              {SITE_NAME} is 100% free, public, and open-source. We do not use third-party analytics, track cookies, or show ads.
            </p>
          </section>

          {/* Section 5: Data Rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              5. Your Rights & Data Deletion
            </h2>
            <p>
              Since we store no personal identifiers, we cannot lookup or delete a specific submission on demand unless you can provide the specific anonymous message text and location centroid to locate it. If you wish to report abusive or incorrect content, please open a ticket on GitHub.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
