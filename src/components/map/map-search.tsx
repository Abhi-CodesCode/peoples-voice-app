'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CitySearchResult } from '@/types/database';

interface MapSearchProps {
  onLocationSelect: (coords: [number, number], cityName: string) => void;
}

export function MapSearch({ onLocationSelect }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results from our API
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Failed to search map cities:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (city: CitySearchResult) => {
    onLocationSelect([city.longitude, city.latitude], `${city.city}, ${city.state}`);
    setQuery(`${city.city}, ${city.state}`);
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm sm:max-w-md">
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <Search className="h-4.5 w-4.5 text-primary/80" />
        </span>
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search city to navigate map..."
          className="pl-10 pr-10 bg-black/90 border border-white/20 backdrop-blur-md text-white rounded-xl placeholder:text-white/60 shadow-lg"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute z-[1000] mt-1.5 w-full rounded-xl border border-primary/25 bg-surface/95 shadow-2xl backdrop-blur-lg">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-primary" />
              Searching registry...
            </div>
          ) : (
            <ul className="max-h-56 overflow-y-auto py-1 text-sm custom-scrollbar">
              {results.map((result, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="flex w-full items-center px-4 py-2.5 text-left text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="font-semibold">{result.city}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {result.state}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
