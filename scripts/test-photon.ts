async function testCoord(cityName: string, lat: number, lon: number) {
  const queries = ['park', 'garden', 'green'];
  console.log(`\n=== Testing ${cityName} (${lat}, ${lon}) ===`);
  for (const q of queries) {
    // 1. With osm_tag filter
    const urlWithTag = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&osm_tag=leisure:park&osm_tag=leisure:garden&lat=${lat}&lon=${lon}&limit=5`;
    // 2. Without osm_tag filter
    const urlBroad = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${lat}&lon=${lon}&limit=5`;
    
    try {
      const res = await fetch(urlWithTag);
      const json = await res.json();
      console.log(`Query "${q}" WITH osm_tag count:`, (json.features || []).length);
      if (json.features?.length > 0) {
        console.log('Sample spot with tag:', json.features[0].properties?.name, json.features[0].properties?.osm_value);
      }
    } catch (e: any) {
      console.log(`Query "${q}" error:`, e.message);
    }

    try {
      const res2 = await fetch(urlBroad);
      const json2 = await res2.json();
      console.log(`Query "${q}" BROAD (no tag constraint) count:`, (json2.features || []).length);
      if (json2.features?.length > 0) {
        console.log('Sample spot broad:', json2.features[0].properties?.name, json2.features[0].properties?.osm_value, json2.features[0].properties?.osm_key);
      }
    } catch (e: any) {
      console.log(`Broad error:`, e.message);
    }
  }
}

async function run() {
  await testCoord('Bangalore', 12.9716, 77.5946);
  await testCoord('Delhi', 28.6139, 77.2090);
  await testCoord('Kolkata', 22.5726, 88.3639);
}

run();
