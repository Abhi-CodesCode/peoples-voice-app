'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Quote, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { PublicVoice } from '@/types/database';

interface VoiceCardProps {
  voice: PublicVoice;
  index: number;
}

export function VoiceCard({ voice, index }: VoiceCardProps) {
  const { city, state, participation_status, support_reason, desired_outcome, created_at } = voice;

  const dateObj = created_at ? new Date(created_at) : new Date();
  const timeAgo = formatDistanceToNow(dateObj, { addSuffix: true });

  const statusColors: Record<string, string> = {
    supporting: 'bg-primary/10 text-primary border-primary/20',
    participating: 'bg-success/10 text-success border-success/20',
    undecided: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between border border-primary/10 bg-surface/50 hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header / Badge */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={statusColors[participation_status]}>
                {participation_status.charAt(0).toUpperCase() + participation_status.slice(1)}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* Why Supporting Message */}
            {support_reason && (
              <div className="space-y-1">
                <div className="flex items-start gap-1">
                  <Quote className="h-3 w-3 text-primary shrink-0 mt-1 opacity-55 rotate-180" />
                  <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
                    &ldquo;{support_reason}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Desired Outcome Message */}
            {desired_outcome && (
              <div className="pt-2 border-t border-primary/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">Outcome Desired</span>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {desired_outcome}
                </p>
              </div>
            )}
          </div>

          {/* Location Details Footer */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-primary/5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate max-w-[120px]">{city}</span>
              <span className="text-[10px] opacity-65">({state})</span>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-success/80">
              <Shield className="h-3 w-3" />
              <span>Verified Anon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
