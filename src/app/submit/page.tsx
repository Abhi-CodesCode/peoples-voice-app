import { Metadata } from 'next';
import { SubmissionWizard } from '@/components/submission/submission-wizard';
import { Shield } from 'lucide-react';
import { DISCLAIMER_TEXT } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Add Your Voice',
  description: 'Voluntarily register your anonymous support or participation in the CJP protest. Fully privacy-first.',
};

export default function SubmitPage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl mx-auto space-y-6 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Register Your Voice
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Adding your perspective helps document the voluntary participation. 
          No email, name, phone number, or exact coordinates are ever requested.
        </p>
      </div>

      <SubmissionWizard />

      {/* Footer Disclaimer */}
      <div className="mt-12 w-full max-w-lg mx-auto border-t border-primary/10 pt-6">
        <p className="text-center text-xs leading-relaxed text-muted-foreground flex items-start gap-2 justify-center">
          <Shield className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
          <span className="text-left">{DISCLAIMER_TEXT}</span>
        </p>
      </div>
    </div>
  );
}
