import { generateDeterministicEmbedding } from '../lib/embeddings';

export interface SanctuaryRecord {
  id?: number;
  name: string;
  category: 'pocket_park' | 'quiet_bench' | 'botanical_corner' | 'urban_grove' | 'rooftop_garden';
  neighborhood: string;
  estimated_walk_mins: number;
  shade_rating: number; // 1 to 5
  quiet_rating: number; // 1 to 5
  ambiance_description: string;
  sensory_features: string[];
  embedding?: number[];
  distance?: number;
  latitude?: number;
  longitude?: number;
}

const RAW_SANCTUARIES: Array<Omit<SanctuaryRecord, 'id' | 'embedding'>> = [
  {
    name: "Elder Tree Atrium & Moss Well",
    category: "urban_grove",
    neighborhood: "Old Foundry Quarter",
    estimated_walk_mins: 6,
    shade_rating: 5,
    quiet_rating: 5,
    ambiance_description: "A century-old weeping willow and copper beech canopy nestled between brick facades, shielding all traffic noise with cascading leaves and a soft pebble pathway.",
    sensory_features: ["dense tree canopy", "cool mossy well", "gentle leaf rustle", "cedarwood aroma"],
  },
  {
    name: "St. Jude's Sunken Rose Cloister",
    category: "pocket_park",
    neighborhood: "Civic District",
    estimated_walk_mins: 8,
    shade_rating: 4,
    quiet_rating: 5,
    ambiance_description: "Sunken Gothic stone courtyard featuring climbing wild roses, a trickling lion-head fountain, and weathered limestone benches naturally 4 degrees cooler than the street.",
    sensory_features: ["trickling fountain", "wild damask roses", "limestone benches", "shaded alcoves"],
  },
  {
    name: "Komorebi Bamboo Nook",
    category: "botanical_corner",
    neighborhood: "Tech Arts Corridor",
    estimated_walk_mins: 5,
    shade_rating: 4,
    quiet_rating: 4,
    ambiance_description: "A narrow pocket of black bamboo whose canes filter afternoon glare into dappled dancing sunlight. Wind chimes provide soft auditory grounding.",
    sensory_features: ["black bamboo grove", "dappled sunlight (komorebi)", "bamboo wind chimes", "slate gravel"],
  },
  {
    name: "Solarium Glasshouse Veranda",
    category: "rooftop_garden",
    neighborhood: "Warehouse East",
    estimated_walk_mins: 11,
    shade_rating: 2,
    quiet_rating: 4,
    ambiance_description: "An open-sky rooftop conservatory deck lined with lavender planters and citrus saplings. Unobstructed southern sunlight ideal for dopamine and Vitamin D resets.",
    sensory_features: ["direct golden sunlight", "crushed lavender scent", "warm wooden decking", "skyline horizon"],
  },
  {
    name: "The Whispering Fern Alcove",
    category: "quiet_bench",
    neighborhood: "University Terrace",
    estimated_walk_mins: 7,
    shade_rating: 5,
    quiet_rating: 5,
    ambiance_description: "A solitary teak bench tucked behind towering silver birch trees and an undergrowth of giant ostrich ferns. Completely hidden from passing pedestrians.",
    sensory_features: ["tall silver birch", "dense fern carpet", "deep shade", "solitary bench"],
  },
  {
    name: "Millrace Creek Stepping Stones",
    category: "pocket_park",
    neighborhood: "Canal Basin",
    estimated_walk_mins: 12,
    shade_rating: 3,
    quiet_rating: 4,
    ambiance_description: "A restored urban stream with flat granite river stones where you can stand or sit surrounded by rushing water that masks laptop hum and urban sirens.",
    sensory_features: ["rushing water sound", "smooth granite stones", "cool water breeze", "river willow shade"],
  },
  {
    name: "Botanist's Greenhouse Labyrinth",
    category: "botanical_corner",
    neighborhood: "Heritage Green",
    estimated_walk_mins: 14,
    shade_rating: 4,
    quiet_rating: 5,
    ambiance_description: "A tranquil walking circle bordered by aromatic chamomile, creeping thyme, and heirloom boxwood hedges designed for slow mindful pacing away from screens.",
    sensory_features: ["scented chamomile grass", "crushed thyme underfoot", "bird song", "boxwood maze"],
  },
  {
    name: "Highland Pine Canopy Pergola",
    category: "urban_grove",
    neighborhood: "North Hill",
    estimated_walk_mins: 15,
    shade_rating: 5,
    quiet_rating: 4,
    ambiance_description: "An elevated timber pergola shaded by Austrian pines, looking over the city valley. Rich evergreen pine resin fragrance and constant mountain breeze.",
    sensory_features: ["evergreen pine fragrance", "panoramic breeze", "timber pergola", "filtered shade"],
  },
  {
    name: "Sunstone Flagstone Terrace",
    category: "quiet_bench",
    neighborhood: "Market Commons",
    estimated_walk_mins: 9,
    shade_rating: 1,
    quiet_rating: 3,
    ambiance_description: "A wide sandstone terrace capturing radiant midday heat. Low granite wall to sit on, soak in warmth, and stretch tight shoulders.",
    sensory_features: ["warm stone warmth", "bright open sky", "rosemary bushes", "sparrows bathing in fountain"],
  },
  {
    name: "Hidden Zen Gravel Garden",
    category: "botanical_corner",
    neighborhood: "Design District",
    estimated_walk_mins: 6,
    shade_rating: 3,
    quiet_rating: 5,
    ambiance_description: "A secluded courtyard with raked pale river pebbles, moss-covered basalt boulders, and a solitary Japanese maple whose leaves turn scarlet in autumn.",
    sensory_features: ["raked gravel ripples", "Japanese maple", "basalt boulders", "silent stillness"],
  },
  {
    name: "The Copper Beech Perch",
    category: "quiet_bench",
    neighborhood: "Old Medical Quarters",
    estimated_walk_mins: 10,
    shade_rating: 5,
    quiet_rating: 5,
    ambiance_description: "A circular wrap-around wooden bench built around the trunk of a massive 150-year-old purple beech. The canopy casts a deep burgundy umbrella over the ground.",
    sensory_features: ["massive tree trunk bark", "burgundy leaf canopy", "deep shadow", "distant church bells"],
  },
  {
    name: "Foundry Creek Lotus Pond",
    category: "pocket_park",
    neighborhood: "Iron Works",
    estimated_walk_mins: 13,
    shade_rating: 3,
    quiet_rating: 4,
    ambiance_description: "A naturalized retention pond filled with water lilies and dragonflies. Weathered iron railings and wooden boardwalk over the water.",
    sensory_features: ["floating water lilies", "dragonflies", "wooden boardwalk", "cool evaporation breeze"],
  },
  {
    name: "The Secret Fig Courtyard",
    category: "botanical_corner",
    neighborhood: "Silk Mill Quarter",
    estimated_walk_mins: 8,
    shade_rating: 4,
    quiet_rating: 5,
    ambiance_description: "Hidden behind an ivy-covered iron archway, three mature fig trees provide sweet scent and thick emerald shade, completely enclosed by warm terracotta walls.",
    sensory_features: ["sweet fig leaf aroma", "terracotta courtyard", "ivy-covered archway", "soft bird calls"],
  },
  {
    name: "Skyway Meadow Pocket",
    category: "rooftop_garden",
    neighborhood: "Transit Hub",
    estimated_walk_mins: 7,
    shade_rating: 2,
    quiet_rating: 4,
    ambiance_description: "An unexpected meadow planted atop a transit skyway. Native wildflowers, waving prairie grass, and open air right above the city pulse.",
    sensory_features: ["waving wild grasses", "butterfly pollinator plants", "open fresh air", "wooden lounge chairs"],
  },
  {
    name: "Ginkgo Biloba Sun Pocket",
    category: "pocket_park",
    neighborhood: "Library Square",
    estimated_walk_mins: 5,
    shade_rating: 3,
    quiet_rating: 4,
    ambiance_description: "A quartet of ginkgo trees with fan-shaped leaves that turn incandescent golden-yellow. Ideal quick 5-minute breather between meetings.",
    sensory_features: ["golden ginkgo leaves", "granite sitting steps", "gentle breeze", "filtered warmth"],
  },
  {
    name: "The Moss Grotto",
    category: "quiet_bench",
    neighborhood: "St. Anne's Hill",
    estimated_walk_mins: 12,
    shade_rating: 5,
    quiet_rating: 5,
    ambiance_description: "A limestone nook cut into the hillside where cold natural spring water seeps through velvet moss into a miniature reflecting basin.",
    sensory_features: ["velvet green moss", "natural spring drip", "cool hillside air", "slate resting bench"],
  },
];

export const INITIAL_SANCTUARIES: SanctuaryRecord[] = RAW_SANCTUARIES.map((item, index) => {
  const fullText = `${item.name}. ${item.category}. ${item.neighborhood}. ${item.ambiance_description} ${item.sensory_features.join(', ')}`;
  return {
    ...item,
    id: index + 1,
    embedding: generateDeterministicEmbedding(fullText),
  };
});
