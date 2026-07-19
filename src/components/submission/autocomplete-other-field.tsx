'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface AutocompleteOtherFieldProps {
  field: 'support_reason' | 'desired_outcome';
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export function AutocompleteOtherField({ field, value, onChange, maxLength }: AutocompleteOtherFieldProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
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

  // Fetch suggestions
  useEffect(() => {
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/suggestions?field=${field}&q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          if (data.suggestions && data.suggestions.length > 0) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value.slice(0, maxLength));
          setIsOpen(true);
        }}
        placeholder="Type your own response... (Suggestions will appear below)"
        className="min-h-[120px] resize-none border-primary/20 bg-surface/50 text-foreground focus-visible:ring-primary"
      />
      
      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="absolute z-10 w-full mt-1 bg-surface/95 border border-primary/20 rounded-lg shadow-xl overflow-hidden backdrop-blur-md">
          {loading ? (
            <div className="p-3 text-xs text-muted-foreground flex items-center justify-center">
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> Loading suggestions...
            </div>
          ) : (
            <>
              <div className="px-3 py-1.5 bg-primary/10 text-xs font-medium text-primary uppercase tracking-wider">
                People also said:
              </div>
              <ul className="max-h-48 overflow-y-auto custom-scrollbar">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleSelect(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/20 transition-colors border-b border-border/50 last:border-0"
                    >
                      &quot;{suggestion}&quot;
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      <div className="flex justify-end text-xs text-muted-foreground mt-1">
        {value.length} / {maxLength} characters
      </div>
    </div>
  );
}
