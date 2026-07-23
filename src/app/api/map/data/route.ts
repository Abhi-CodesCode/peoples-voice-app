import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const revalidate = 60; // Cache map data for 60 seconds

export async function GET() {
  try {
    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch {
      // Return mock map data if Supabase isn't configured
      return NextResponse.json(getMockGeoJSON());
    }

    // Fetch locality-level aggregates (for map dots)
    const { data: locData, error: locError } = await supabase
      .from('location_aggregates')
      .select('*');

    // Fetch city-level aggregates (for side panel totals)
    const { data: cityData, error: cityError } = await supabase
      .from('city_aggregates')
      .select('*');

    if (locError || cityError) {
      console.error('Error fetching aggregates:', locError || cityError);
      return NextResponse.json(getMockGeoJSON());
    }

    if (!locData || locData.length === 0 || !cityData) {
      return NextResponse.json(getMockGeoJSON());
    }

    // Convert SQL aggregates to GeoJSON FeatureCollection
    const geojson = {
      type: 'FeatureCollection',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      features: locData.map((loc: Record<string, any>) => {
        // Find the matching city totals
        const cData = cityData.find(c => c.city === loc.city && c.state === loc.state) || loc;

        return {
          type: 'Feature',
          properties: {
            locality: loc.locality,
            city: loc.city,
            state: loc.state,
            country: loc.country,
            // The counts shown in the side panel will be the CITY TOTALS
            total_voices: cData.total_voices,
            supporting_count: cData.supporting_count,
            participating_count: cData.participating_count,
            undecided_count: cData.undecided_count,
            already_attended_count: cData.already_attended_count,
            planning_count: cData.planning_count,
            online_count: cData.online_count,
            local_protest_count: cData.local_protest_count,
            // We also pass locality specifics just in case
            locality_total_voices: loc.total_voices,
          },
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(loc.longitude), parseFloat(loc.latitude)],
          },
        };
      }),
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error('Map data API error:', error);
    return NextResponse.json(getMockGeoJSON());
  }
}

function getMockGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}
