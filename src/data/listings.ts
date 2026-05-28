import type { Listing } from "@/types/listings";

/**
 * Mock listing fixtures for local development.
 *
 * Covers all four lifecycle statuses (draft, published, paused,
 * needs_review) and includes one long Malay place name for wrapping
 * checks. These mirror the future Supabase aggregate listing shape.
 */
export const mockListings: Listing[] = [
  {
    id: "listing-rumah-tepi-sawah",
    slug: "rumah-tepi-sawah-balik-pulau",
    ownerId: "owner-aini",
    name: "Rumah Tepi Sawah",
    summary:
      "A quiet kampung house beside paddy fields, ten minutes from Balik Pulau town.",
    description:
      "A traditional kampung-modern home overlooking working paddy. Mornings are calm, afternoons are warm, and evenings end with frogs and crickets. Suitable for families and small groups looking for a slower Penang.",
    capacity: 8,
    bedrooms: 3,
    location: {
      id: "balik-pulau-pulau-pinang",
      area: "Balik Pulau",
      town: "Balik Pulau",
      state: "pulau-pinang",
      postcode: "11000",
    },
    price: { currency: "MYR", minPerNight: 280, maxPerNight: 360 },
    photos: [
      { id: "p1", src: "/mock/listings/tepi-sawah/exterior.jpg", alt: "Front view of Rumah Tepi Sawah at sunrise", category: "exterior", order: 1 },
      { id: "p2", src: "/mock/listings/tepi-sawah/bedroom-main.jpg", alt: "Main bedroom with wooden floor", category: "bedroom", order: 2 },
      { id: "p3", src: "/mock/listings/tepi-sawah/bathroom.jpg", alt: "Bathroom with rain shower", category: "bathroom", order: 3 },
      { id: "p4", src: "/mock/listings/tepi-sawah/kitchen.jpg", alt: "Open kitchen with dining table", category: "kitchen", order: 4 },
      { id: "p5", src: "/mock/listings/tepi-sawah/living.jpg", alt: "Living room with rattan chairs", category: "living", order: 5 },
      { id: "p6", src: "/mock/listings/tepi-sawah/sawah.jpg", alt: "View of the paddy field at dusk", category: "surrounding", order: 6 },
    ],
    amenities: ["wifi", "kitchen", "parking", "fan", "washing-machine"],
    houseRules: [
      "No smoking indoors.",
      "Please remove shoes before entering.",
      "Quiet hours after 10pm out of respect for neighbours.",
    ],
    trust: { muslimFriendly: true, familyFriendly: true, whatsappReady: true, houseRulesProvided: true },
    status: "published",
    metrics: { views: 412, whatsappClicks: 38, lastUpdatedAt: "2026-05-25T09:00:00Z" },
    updatedAt: "2026-05-20T14:32:00Z",
  },
  {
    id: "listing-pondok-pantai-marang",
    slug: "pondok-pantai-marang",
    ownerId: "owner-faizal",
    name: "Pondok Pantai Marang",
    summary: "A wooden chalet a short walk from the Marang shoreline.",
    description:
      "Built by the family in 2019 and rented out only on weekends. Sea breeze, traditional wooden interior, and a small verandah for evening tea. The fishing village stays awake quietly into the night.",
    capacity: 5,
    bedrooms: 2,
    location: {
      id: "marang-terengganu",
      area: "Marang",
      town: "Marang",
      state: "terengganu",
      postcode: "21600",
    },
    price: { currency: "MYR", minPerNight: 180, maxPerNight: 240 },
    photos: [
      { id: "p1", src: "/mock/listings/pantai-marang/exterior.jpg", alt: "Wooden chalet from the road side", category: "exterior", order: 1 },
      { id: "p2", src: "/mock/listings/pantai-marang/bedroom.jpg", alt: "Bedroom with mosquito net", category: "bedroom", order: 2 },
      { id: "p3", src: "/mock/listings/pantai-marang/living.jpg", alt: "Verandah with rattan mat", category: "living", order: 3 },
      { id: "p4", src: "/mock/listings/pantai-marang/pantai.jpg", alt: "Beach view two minutes walk away", category: "surrounding", order: 4 },
    ],
    amenities: ["wifi", "fan", "kettle", "shared-kitchen"],
    houseRules: [
      "No alcohol on premises.",
      "Outside footwear stays at the door.",
      "Please respect prayer times if family members are visiting.",
    ],
    trust: { muslimFriendly: true, familyFriendly: true, whatsappReady: true, houseRulesProvided: true },
    status: "needs_review",
    metrics: { views: 88, whatsappClicks: 6, lastUpdatedAt: "2026-05-26T10:00:00Z" },
    updatedAt: "2026-05-22T07:11:00Z",
  },
  {
    id: "listing-rumah-kampung-padang-kuala-besut",
    slug: "rumah-kampung-padang-kuala-besut-terengganu",
    ownerId: "owner-faizal",
    name: "Rumah Kampung Padang Kuala Besut, Terengganu Utara",
    summary:
      "A spacious family kampung home with a large compound, suitable for extended family stays.",
    description:
      "An older family house refreshed in 2025. Wide compound with mature trees, a separate kitchen building, and an outdoor space large enough for a small kenduri. Closest beach is a short drive away.",
    capacity: 12,
    bedrooms: 4,
    location: {
      id: "kuala-besut-terengganu",
      area: "Kampung Padang Kuala Besut",
      town: "Kuala Besut",
      state: "terengganu",
      postcode: "22300",
    },
    price: { currency: "MYR", minPerNight: 420, maxPerNight: 520 },
    photos: [
      { id: "p1", src: "/mock/listings/kuala-besut/exterior.jpg", alt: "Front of the family house with compound", category: "exterior", order: 1 },
      { id: "p2", src: "/mock/listings/kuala-besut/bedroom.jpg", alt: "Master bedroom with wooden walls", category: "bedroom", order: 2 },
    ],
    amenities: ["wifi", "kitchen", "parking", "outdoor-seating"],
    houseRules: ["No loud music after 11pm.", "Outside footwear stays outside."],
    trust: { muslimFriendly: true, familyFriendly: true, whatsappReady: true, houseRulesProvided: true },
    status: "draft",
    metrics: { views: 0, whatsappClicks: 0, lastUpdatedAt: "2026-05-27T02:30:00Z" },
    updatedAt: "2026-05-27T02:30:00Z",
  },
  {
    id: "listing-rumah-tok-wan",
    slug: "rumah-tok-wan-kota-bharu",
    ownerId: "owner-siti",
    name: "Rumah Tok Wan",
    summary:
      "A small heritage home in the old quarter of Kota Bharu, walking distance from the central market.",
    description:
      "The family kept this home as Tok Wan left it: timber floors, hand-painted wooden shutters, and ceramic tiled bathrooms. Most travellers come for the food, the morning market, and the slow walk along Jalan Hospital.",
    capacity: 6,
    bedrooms: 2,
    location: {
      id: "kota-bharu-kelantan",
      area: "Jalan Hospital",
      town: "Kota Bharu",
      state: "kelantan",
      postcode: "15000",
    },
    price: { currency: "MYR", minPerNight: 220, maxPerNight: 300 },
    photos: [
      { id: "p1", src: "/mock/listings/tok-wan/exterior.jpg", alt: "Heritage home from the lane", category: "exterior", order: 1 },
      { id: "p2", src: "/mock/listings/tok-wan/bedroom.jpg", alt: "Bedroom with carved headboard", category: "bedroom", order: 2 },
      { id: "p3", src: "/mock/listings/tok-wan/living.jpg", alt: "Living area with rattan chairs", category: "living", order: 3 },
    ],
    amenities: ["wifi", "fan", "shared-kitchen"],
    houseRules: ["No outdoor shoes inside.", "Quiet hours after 10pm."],
    trust: { muslimFriendly: true, familyFriendly: true, whatsappReady: true, houseRulesProvided: true },
    status: "paused",
    metrics: { views: 145, whatsappClicks: 11, lastUpdatedAt: "2026-05-15T18:00:00Z" },
    updatedAt: "2026-05-10T05:20:00Z",
  },
];

/** Find a mock listing by slug. */
export function findMockListingBySlug(slug: string): Listing | undefined {
  return mockListings.find((listing) => listing.slug === slug);
}

/** Filter mock listings by status. */
export function listMockListingsByStatus(
  status: Listing["status"],
): Listing[] {
  return mockListings.filter((listing) => listing.status === status);
}

/** Mock listings owned by a given owner id. */
export function listMockListingsByOwner(ownerId: string): Listing[] {
  return mockListings.filter((listing) => listing.ownerId === ownerId);
}
