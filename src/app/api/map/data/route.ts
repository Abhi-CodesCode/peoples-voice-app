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

    // Fetch from city_aggregates view
    const { data, error } = await supabase
      .from('city_aggregates')
      .select('*');

    if (error) {
      console.error('Error fetching city aggregates:', error);
      return NextResponse.json(getMockGeoJSON());
    }

    if (!data || data.length === 0) {
      return NextResponse.json(getMockGeoJSON());
    }

    // Convert SQL aggregates to GeoJSON FeatureCollection
    const geojson = {
      type: 'FeatureCollection',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      features: data.map((city: Record<string, any>) => ({
        type: 'Feature',
        properties: {
          city: city.city,
          state: city.state,
          country: city.country,
          total_voices: city.total_voices,
          supporting_count: city.supporting_count,
          participating_count: city.participating_count,
          undecided_count: city.undecided_count,
          already_attended_count: city.already_attended_count,
          planning_count: city.planning_count,
          online_count: city.online_count,
          local_protest_count: city.local_protest_count,
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(city.longitude), parseFloat(city.latitude)],
        },
      })),
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
