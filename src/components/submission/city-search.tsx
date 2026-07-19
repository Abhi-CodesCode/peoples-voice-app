'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CitySearchResult } from '@/types/database';

interface CitySearchProps {
  onSelect: (city: CitySearchResult) => void;
  selectedCity?: CitySearchResult | null;
}

export function CitySearch({ onSelect, selectedCity }: CitySearchProps) {
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

  // Sync state if selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      setQuery(`${selectedCity.city}, ${selectedCity.state}`);
    } else {
      setQuery('');
    }
  }, [selectedCity]);

  // Fetch search results from our API
  useEffect(() => {
    if (query.trim().length < 2 || (selectedCity && query === `${selectedCity.city}, ${selectedCity.state}`)) {
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
        console.error('Failed to search cities:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedCity]);

  const handleSelect = (city: CitySearchResult) => {
    onSelect(city);
    setQuery(`${city.city}, ${city.state}`);
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    // Trigger callback with null/empty state
    onSelect({ city: '', state: '', country: 'India', latitude: 0, longitude: 0 });
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <Search className="h-4.5 w-4.5" />
        </span>
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search your city in India (e.g. Lucknow, Delhi...)"
          className="pl-10 pr-10"
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
        <div className="absolute z-50 mt-1 w-full rounded-md border border-primary/20 bg-surface/95 shadow-lg backdrop-blur-md">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              Searching database...
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1 text-sm custom-scrollbar">
              {results.map((result, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="flex w-full items-center px-4 py-2.5 text-left text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="font-medium">{result.city}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {result.state}, {result.country}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-primary/20 bg-surface/95 p-4 text-center text-sm text-muted-foreground backdrop-blur-md">
          No matching cities found in India. Please check your spelling.
        </div>
      )}
    </div>
  );
}
