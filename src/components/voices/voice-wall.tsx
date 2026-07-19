'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceCard } from './voice-card';
import { PublicVoice } from '@/types/database';

export function VoiceWall() {
  const [voices, setVoices] = useState<PublicVoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoices = useCallback(async (pageNumber: number, replace = false) => {
    try {
      if (pageNumber === 1 && !replace) setLoading(true);
      else setLoadingMore(true);

      const url = `/api/voices?page=${pageNumber}&limit=12&filter=${filter}&search=${encodeURIComponent(search)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to load submissions.');
      }

      const data = await response.json();
      
      if (replace || pageNumber === 1) {
        setVoices(data.voices);
      } else {
        setVoices((prev) => [...prev, ...data.voices]);
      }
      
      setTotal(data.total);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, search]);

  // Trigger search and filter changes
  useEffect(() => {
    setPage(1);
    fetchVoices(1, true);
  }, [fetchVoices]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVoices(nextPage, false);
  };

  const hasMore = voices.length < total;

  return (
    <div className="space-y-6">
      {/* Search & Tabs Filter Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city or state..."
            className="pl-9 pr-4"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="supporting">Supporting</TabsTrigger>
            <TabsTrigger value="participating">Participating</TabsTrigger>
            <TabsTrigger value="undecided">Undecided</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => fetchVoices(page, true)} className="hover:bg-destructive/10">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <span className="text-sm text-muted-foreground">Reading anonymous messages...</span>
        </div>
      ) : voices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No submissions found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
            There are no anonymous voices registered matching your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {voices.map((voice, index) => (
              <VoiceCard key={voice.id} voice={voice} index={index} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                className="border-primary/20 hover:bg-surface text-foreground w-full max-w-xs"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Voices'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
