'use client';

import { X, Shield, MapPin, Users, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DISCLAIMER_TEXT } from '@/lib/constants';

interface CityPanelProps {
  cityData: {
    city: string;
    state: string;
    total_voices: number;
    supporting_count: number;
    participating_count: number;
    undecided_count: number;
    already_attended_count?: number;
    planning_count?: number;
    online_count?: number;
    local_protest_count?: number;
  } | null;
  onClose: () => void;
}

export function CityPanel({ cityData, onClose }: CityPanelProps) {
  if (!cityData) return null;

  const {
    city,
    state,
    total_voices,
    supporting_count = 0,
    participating_count = 0,
    undecided_count = 0,
  } = cityData;

  const supportingPct = total_voices > 0 ? (supporting_count / total_voices) * 100 : 0;
  const participatingPct = total_voices > 0 ? (participating_count / total_voices) * 100 : 0;
  const undecidedPct = total_voices > 0 ? (undecided_count / total_voices) * 100 : 0;

  // Mock outcomes and recent messages for city visual
  const mockOutcomes = [
    'Independent investigation and transparency',
    'Direct community discussion and dialogue',
    'Policy revisions and legislative oversight'
  ];

  const mockRecentMessages = [
    'We want transparency and basic answers. Simple as that.',
    'As a community, we need to stand together peacefully.',
    'I support this movement online. We deserve accountability.'
  ];

  return (
    <div className="flex flex-col h-full bg-surface border-l border-primary/10 shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-foreground leading-tight">{city}</h2>
            <p className="text-xs text-muted-foreground">{state}, India</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6 md:p-8 custom-scrollbar">
        <div className="space-y-6">
          {/* Main Stat */}
          <div className="rounded-xl border border-primary/10 bg-background/40 p-4 text-center">
            <Users className="mx-auto h-5 w-5 text-primary mb-1.5" />
            <div className="text-3xl font-extrabold text-foreground">{total_voices.toLocaleString('en-IN')}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Total Registered Voices</div>
          </div>

          {/* Alignment Stats */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Alignment Status</h3>
            <div className="space-y-3">
              {/* Supporting */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-foreground/90">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Supporting
                  </span>
                  <span className="text-foreground font-semibold">{supporting_count} ({supportingPct.toFixed(0)}%)</span>
                </div>
                <Progress value={supportingPct} className="h-1.5" />
              </div>

              {/* Participating */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-foreground/90">
                    <Shield className="h-3.5 w-3.5 text-success" />
                    Participating
                  </span>
                  <span className="text-foreground font-semibold">{participating_count} ({participatingPct.toFixed(0)}%)</span>
                </div>
                <Progress value={participatingPct} className="h-1.5" />
              </div>

              {/* Undecided */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-foreground/90">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    Undecided
                  </span>
                  <span className="text-foreground font-semibold">{undecided_count} ({undecidedPct.toFixed(0)}%)</span>
                </div>
                <Progress value={undecidedPct} className="h-1.5" />
              </div>
            </div>
          </div>

          <Separator className="bg-primary/10" />

          {/* Outcomes requested */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Desired Outcomes</h3>
            <ul className="space-y-2">
              {mockOutcomes.map((outcome, i) => (
                <li key={i} className="text-xs leading-relaxed text-foreground/90 flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="bg-primary/10" />

          {/* Recent Messages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Messages</h3>
            <div className="space-y-2.5">
              {mockRecentMessages.map((msg, i) => (
                <div key={i} className="rounded-lg bg-background/30 border border-border p-3 text-xs leading-relaxed text-foreground/80 italic">
                  &ldquo;{msg}&rdquo;
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer / Disclaimer */}
      <div className="p-6 md:p-8 border-t border-primary/10 bg-background/50">
        <p className="text-[10px] leading-relaxed text-muted-foreground text-center">
          <AlertCircle className="h-3 w-3 text-primary/60 inline mr-1 shrink-0 align-text-bottom" />
          {DISCLAIMER_TEXT}
        </p>
      </div>
    </div>
  );
}
