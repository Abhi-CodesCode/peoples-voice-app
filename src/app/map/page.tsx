'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CityPanel } from '@/components/map/city-panel';
import { Sheet, SheetContent } from '@/components/ui/sheet';

// Import Heatmap dynamically with SSR disabled to prevent window/document errors
const Heatmap = dynamic(() => import('@/components/map/heatmap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="mt-2 text-sm text-muted-foreground">Loading Map components...</span>
    </div>
  ),
});

interface SelectedCityInfo {
  city: string;
  state: string;
  total_voices: number;
  supporting_count: number;
  participating_count: number;
  undecided_count: number;
  already_attended_count?: number;
  planning_count?: number;
  online_count?: number;
}

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState<SelectedCityInfo | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleCityClick = (cityData: SelectedCityInfo) => {
    setSelectedCity(cityData);
    setIsSidebarOpen(true);
  };

  const handleClose = () => {
    setIsSidebarOpen(false);
    setSelectedCity(null);
  };

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Heatmap Area */}
      <div className="flex-1 h-full w-full relative">
        <Heatmap onCityClick={handleCityClick} />
      </div>

      {/* Sidebar Panel - Desktop Layout */}
      <div
        className={`hidden md:block h-full transition-all duration-300 ease-in-out shrink-0 border-l border-primary/10 ${
          isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden border-l-0'
        }`}
      >
        <CityPanel cityData={selectedCity} onClose={handleClose} />
      </div>

      {/* Drawer / Bottom Sheet - Mobile Layout */}
      {isMobile && (
        <Sheet open={isSidebarOpen && !!selectedCity} onOpenChange={(open) => !open && handleClose()}>
          <SheetContent side="bottom" className="h-[75vh] p-0 bg-surface rounded-t-2xl overflow-hidden border-t border-primary/20">
            <CityPanel cityData={selectedCity} onClose={handleClose} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
