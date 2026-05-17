export type Homestay = {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  facilities: string[];
  description: string;
  availableDates: string;
  ownerWhatsApp: string;
};

export const homestays: Homestay[] = [
  {
    id: "1",
    name: "Kampung Retreat",
    location: "Kuala Selangor",
    price: 150,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Parking", "Aircond", "Kitchen"],
    description: "A cozy kampung-style house surrounded by nature, perfect for families.",
    availableDates: "Available weekends in June and July 2026",
    ownerWhatsApp: "60123456789",
  },
  {
    id: "2",
    name: "Beach View Villa",
    location: "Port Dickson",
    price: 250,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Pool", "Aircond", "BBQ Area"],
    description: "Modern villa with a stunning sea view, walking distance to the beach.",
    availableDates: "Available all weekdays in June 2026",
    ownerWhatsApp: "60129876543",
  },
  {
    id: "3",
    name: "Garden Hideaway",
    location: "Janda Baik",
    price: 180,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Parking", "Garden", "BBQ Area"],
    description: "A peaceful retreat nestled in lush greenery, ideal for weekend getaways.",
    availableDates: "Available all of July 2026",
    ownerWhatsApp: "60121112233",
  },
];
