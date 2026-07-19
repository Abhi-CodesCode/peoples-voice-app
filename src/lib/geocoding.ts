import type { CitySearchResult } from '@/types/database';
import { NOMINATIM_BASE_URL } from '@/lib/constants';

/** Shape returned by the Nominatim /search endpoint */
interface NominatimResult {
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    county?: string;
    state_district?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Search for cities in India via the Nominatim geocoding API.
 *
 * @param query  Free-text search string (e.g. "Mumbai")
 * @returns      Up to 5 matching CitySearchResult entries
 */
export async function searchCity(
  query: string
): Promise<CitySearchResult[]> {
  if (!query || query.trim().length === 0) return [];

  const params = new URLSearchParams({
    q: query.trim(),
    countrycodes: 'in',
    format: 'json',
    addressdetails: '1',
    limit: '5',
  });

  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': 'PeoplesVoices/1.0',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Nominatim search failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const results: NominatimResult[] = await response.json();

    return results.map((r) => ({
      city:
        r.address.city ||
        r.address.town ||
        r.address.village ||
        r.address.hamlet ||
        '',
      district: r.address.state_district || r.address.county || '',
      state: r.address.state || '',
      country: r.address.country || 'India',
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    }));
  } catch (error) {
    console.error('Geocoding search error:', error);
    return [];
  }
}
