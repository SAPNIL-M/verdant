import { SanctuaryRecord } from '../db/sanctuaries-data';
import { getEmbedding, generateDeterministicEmbedding } from './embeddings';

/**
 * Calculates Haversine distance in meters between two lat/lng points
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Fetches real nearby green spots (parks, gardens, nature reserves)
 * using high-availability geospatial OpenStreetMap search (Photon + Overpass fallback).
 */
export async function fetchLiveNearbySanctuaries(
  userLat: number,
  userLng: number,
  maxResults: number = 8
): Promise<SanctuaryRecord[]> {
  const rawSpots: Array<{
    name: string;
    lat: number;
    lng: number;
    dist: number;
    osmValue?: string;
    city?: string;
  }> = [];

  const seenKeys = new Set<string>();

  // 1. Primary: Fast high-availability Photon OSM service with nature/park tags
  const primaryQueries = ['park', 'garden', 'green', 'forest'];
  for (const query of primaryQueries) {
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
      )}&osm_tag=leisure:park&osm_tag=leisure:garden&osm_tag=leisure:nature_reserve&osm_tag=leisure:recreation_ground&osm_tag=landuse:grass&osm_tag=natural:wood&lat=${userLat}&lon=${userLng}&limit=10`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.features)) {
          for (const f of json.features) {
            const props = f.properties || {};
            const coords = f.geometry?.coordinates;
            if (!coords || coords.length < 2) continue;

            const name = props.name;
            if (!name) continue;

            const [lon, lat] = coords;
            const dist = calculateDistanceMeters(userLat, userLng, lat, lon);

            // Generous radius up to 30km so even areas with distant green spaces always find a park
            if (dist > 30000) continue;

            const key = `${name.toLowerCase()}_${lat.toFixed(3)}_${lon.toFixed(3)}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              rawSpots.push({
                name,
                lat,
                lng: lon,
                dist,
                osmValue: props.osm_value,
                city: props.district || props.city || props.county,
              });
            }
          }
        }
      }
    } catch (e) {
      // Continue to next query
    }
  }

  // 1b. If fewer than 2 spots found, broaden search without strict osm_tag restrictions
  if (rawSpots.length < 2) {
    const broadQueries = ['park', 'garden', 'nature reserve', 'green'];
    for (const query of broadQueries) {
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          query
        )}&lat=${userLat}&lon=${userLng}&limit=8`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.features)) {
            for (const f of json.features) {
              const props = f.properties || {};
              const coords = f.geometry?.coordinates;
              if (!coords || coords.length < 2) continue;

              const name = props.name;
              if (!name) continue;

              // Filter out obvious non-park entities (like streets, subway stations, hotels)
              const osmKey = props.osm_key;
              const osmVal = props.osm_value;
              if (osmKey === 'highway' || osmKey === 'railway' || osmVal === 'bus_stop' || osmVal === 'station') {
                continue;
              }

              const [lon, lat] = coords;
              const dist = calculateDistanceMeters(userLat, userLng, lat, lon);
              if (dist > 35000) continue;

              const key = `${name.toLowerCase()}_${lat.toFixed(3)}_${lon.toFixed(3)}`;
              if (!seenKeys.has(key)) {
                seenKeys.add(key);
                rawSpots.push({
                  name,
                  lat,
                  lng: lon,
                  dist,
                  osmValue: osmVal || 'park',
                  city: props.district || props.city || props.county,
                });
              }
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }
  }

  // 2. Fallback: If Photon had no results, try Overpass API with expanded 12km radius
  if (rawSpots.length === 0) {
    try {
      const q = `[out:json][timeout:5];(node["leisure"="park"](around:12000,${userLat},${userLng});node["leisure"="garden"](around:12000,${userLat},${userLng});node["leisure"="nature_reserve"](around:12000,${userLat},${userLng});way["leisure"="park"](around:12000,${userLat},${userLng}););out center 10;`;
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(q)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Verdant/1.0',
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.elements)) {
          for (const el of json.elements) {
            const lat = el.lat ?? el.center?.lat;
            const lon = el.lon ?? el.center?.lon;
            const name = el.tags?.name;
            if (lat && lon && name) {
              const key = `${name.toLowerCase()}_${lat.toFixed(3)}_${lon.toFixed(3)}`;
              if (!seenKeys.has(key)) {
                seenKeys.add(key);
                const dist = calculateDistanceMeters(userLat, userLng, lat, lon);
                rawSpots.push({
                  name,
                  lat,
                  lng: lon,
                  dist,
                  osmValue: el.tags?.leisure,
                });
              }
            }
          }
        }
      }
    } catch (e) {
      // Overpass fallback failed
    }
  }

  if (rawSpots.length === 0) {
    return [];
  }

  // Sort candidate raw spots by physical distance to user so closest spots are always prioritized
  rawSpots.sort((a, b) => a.dist - b.dist);

  // Convert raw spots to rich SanctuaryRecord objects
  const results: SanctuaryRecord[] = [];

  for (let i = 0; i < rawSpots.length && results.length < maxResults; i++) {
    const spot = rawSpots[i];
    const distMeters = calculateDistanceMeters(userLat, userLng, spot.lat, spot.lng);
    const walkMins = Math.max(3, Math.round(distMeters / 75)); // ~4.5 km/h walking speed

    const isGarden = spot.osmValue === 'garden' || spot.name.toLowerCase().includes('garden');
    const category: SanctuaryRecord['category'] = isGarden ? 'botanical_corner' : 'pocket_park';

    const sensoryFeatures = [
      isGarden ? 'fragrant floral beds' : 'mature tree canopy',
      'ambient open sky',
      'cool natural shade',
      `${distMeters}m walk`,
    ];

    const distText = distMeters < 1000 ? `${distMeters}m away` : `${(distMeters / 1000).toFixed(1)} km away`;
    const cycleMins = Math.max(5, Math.round(distMeters / 250));
    const neighborhood = spot.city ? `${spot.city} (${distText})` : `${distText} from your position`;

    const description = walkMins <= 30
      ? `A verified live green space located ${distText} (${walkMins} min walk). Step away from your desk and experience the open air under the canopy.`
      : `A verified live green space located ${distText} (${walkMins} min walk or ~${cycleMins} min bike). Nearest natural sanctuary to your coordinates—step outside into the green.`;

    const fullText = `${spot.name}. Category: ${category}. Located at ${neighborhood}. ${description} Sensory cues: ${sensoryFeatures.join(', ')}`;
    
    // Generate real embedding for vector matching
    const embedding = await getEmbedding(fullText);

    results.push({
      id: 1000 + i,
      name: spot.name,
      category,
      neighborhood,
      estimated_walk_mins: walkMins,
      shade_rating: isGarden ? 4 : 5,
      quiet_rating: 4,
      ambiance_description: description,
      sensory_features: sensoryFeatures,
      embedding,
      latitude: spot.lat,
      longitude: spot.lng,
    });
  }

  // Sort by actual distance from user
  results.sort((a, b) => a.estimated_walk_mins - b.estimated_walk_mins);
  return results;
}
