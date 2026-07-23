import { NextResponse } from 'next/server';
import { CitySearchResult } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const normalizedQuery = query.trim();
    
    // We append ', India' to prioritize Indian locations if not already there, 
    // but countrycodes=in also enforces it.
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', normalizedQuery);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('countrycodes', 'in');
    url.searchParams.set('limit', '5');

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PeoplesVoiceApp/1.0 (contact@peoplesvoice.in)',
      },
      // Cache responses for a minute to reduce Nominatim load
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error('Nominatim API error:', await res.text());
      return NextResponse.json([]); // Fail gracefully
    }

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered: CitySearchResult[] = data.map((item: any) => {
      const address = item.address;
      
      // Determine Locality
      const locality = address.suburb || address.neighbourhood || address.residential || address.village || address.town || null;
      
      // Determine City (could be city, county, state_district)
      const city = address.city || address.town || address.county || address.state_district || address.state;

      // If locality and city are the same, just set locality to null
      if (locality && city && locality.toLowerCase() === city.toLowerCase()) {
        return {
          city: city,
          locality: undefined,
          state: address.state || 'Unknown',
          country: address.country || 'India',
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          display_name: item.display_name // Send this back for frontend to show
        };
      }

      return {
        city: city,
        locality: locality,
        state: address.state || 'Unknown',
        country: address.country || 'India',
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        display_name: item.display_name // Send this back for frontend to show
      };
    });

    // Remove duplicates based on display_name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueResults = Array.from(new Map(filtered.map(item => [(item as any).display_name, item])).values());

    return NextResponse.json(uniqueResults);
  } catch (error) {
    console.error('Error searching cities:', error);
    return NextResponse.json({ error: 'Failed to search cities' }, { status: 500 });
  }
}
