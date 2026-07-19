import { Metadata } from 'next';
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner';
import { BarChart3, HelpCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { SITE_NAME, DISCLAIMER_TEXT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'Understand how we aggregate participation statistics and the limitations of self-selected registries.',
};

export default function MethodologyPage() {
  return (
    <div className="relative min-h-[90vh]">
      <DisclaimerBanner />
      
      <div className="page-container py-12 max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex rounded-full bg-primary/10 p-2.5 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Methodology
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform transparency and data limitations report.
          </p>
        </div>

        {/* Disclaimer Highlight */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2">
          <h2 className="text-sm font-bold text-primary flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            Important Notice
          </h2>
          <p className="text-xs leading-relaxed text-foreground/90">
            {DISCLAIMER_TEXT}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/90 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              1. Voluntary Registry Structure
            </h2>
            <p>
              Unlike traditional statistical surveys that poll random samples of the population, {SITE_NAME} operates as a <strong>voluntary registration portal</strong>. 
              Only individuals who choose to participate and visit the website register their support. Therefore, these metrics do not imply consensus or majority opinion among the general populace.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              2. Self-Selection Bias
            </h2>
            <p>
              Self-selection bias is a well-known statistical effect where the sample is biased towards individuals who hold strong viewpoints (either positive or negative) regarding a particular movement. 
              This platform documents the intensity and geographic clusters of supporters rather than balanced demographic representations.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              3. Duplicate Submission Filtering
            </h2>
            <p>
              To maintain audit integrity and filter spam submissions without logging personal cookies or IPs, we use server-side fingerprinting:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Hourly hashes are computed based on the city, selected state, and submission text.
              </li>
              <li>
                Duplicate hashes within a 1-hour window are discarded immediately with a 409 error code.
              </li>
              <li>
                Basic profanity filters check submission reasons; flagged entries go to a pending queue for moderator review.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
