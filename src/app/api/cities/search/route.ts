import { NextResponse } from 'next/server';
import citiesData from '@/data/indian-cities.json';
import { CitySearchResult } from '@/types/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Filter cities from the static JSON data
    const filtered: CitySearchResult[] = citiesData
      .filter((item) => 
        item.city.toLowerCase().includes(normalizedQuery) ||
        item.state.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 10)
      .map((item) => ({
        city: item.city,
        state: item.state,
        country: 'India',
        latitude: item.lat,
        longitude: item.lng
      }));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error searching cities:', error);
    return NextResponse.json({ error: 'Failed to search cities' }, { status: 500 });
  }
}
