import { Metadata } from 'next';
import { VoiceWall } from '@/components/voices/voice-wall';
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Voice Wall',
  description: 'Read anonymous messages from citizens voluntarily sharing why they support the CJP protest.',
};

export default function VoicesPage() {
  return (
    <div className="relative min-h-[90vh]">
      <DisclaimerBanner />
      
      <div className="page-container py-12 space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex rounded-full bg-primary/10 p-2 text-primary mb-2">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            The Voice Wall
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Read perspectives and outcomes shared by participants and supporters across India. All entries are completely anonymous.
          </p>
        </div>

        {/* Voice Wall Grid Container */}
        <VoiceWall />
      </div>
    </div>
  );
}
