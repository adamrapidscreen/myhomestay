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
    description: "A cozy kampung-style house surrounded by nature, perfect for families. Wake up to birdsong and enjoy home-cooked meals in the open-air kitchen.",
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
    description: "Modern villa with a stunning sea view, walking distance to the beach. Perfect for group getaways with a private pool and sunset BBQ sessions.",
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
    description: "A peaceful retreat nestled in lush greenery, ideal for weekend getaways. The sound of the river and cool highland air make this a natural escape.",
    availableDates: "Available all of July 2026",
    ownerWhatsApp: "60121112233",
  },
  {
    id: "4",
    name: "Langkawi Seaside Chalet",
    location: "Langkawi, Kedah",
    price: 320,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Aircond", "Beach Access", "Kayak", "Breakfast"],
    description: "A charming wooden chalet steps from the Andaman Sea. Fall asleep to the sound of waves and wake up to panoramic island views from your private deck.",
    availableDates: "Available June to August 2026",
    ownerWhatsApp: "60141234567",
  },
  {
    id: "5",
    name: "Cameron Highlands Cottage",
    location: "Cameron Highlands, Pahang",
    price: 200,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Parking", "Fireplace", "Kitchen", "Garden"],
    description: "A cozy English-style cottage surrounded by tea plantations and misty hills. Enjoy cool weather year-round and fresh strawberries from the garden.",
    availableDates: "Available weekends May to September 2026",
    ownerWhatsApp: "60159876543",
  },
  {
    id: "6",
    name: "Melaka Heritage House",
    location: "Melaka City",
    price: 170,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Aircond", "Kitchen", "Bicycle"],
    description: "A restored Peranakan shophouse in the heart of Melaka's UNESCO heritage zone. Walk to Jonker Street and experience living history with modern comforts.",
    availableDates: "Available all of June and July 2026",
    ownerWhatsApp: "60167654321",
  },
  {
    id: "7",
    name: "Penang Hill Bungalow",
    location: "Penang",
    price: 280,
    image: "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Parking", "Aircond", "Pool", "Garden"],
    description: "A colonial-era bungalow perched on Penang Hill with sweeping views of George Town and the strait. Heritage charm meets modern comfort in this rare hilltop retreat.",
    availableDates: "Available July to September 2026",
    ownerWhatsApp: "60171234567",
  },
  {
    id: "8",
    name: "Cherating Beach Hut",
    location: "Cherating, Pahang",
    price: 130,
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Parking", "Beach Access", "Hammock", "BBQ Area"],
    description: "A rustic beach hut on Cherating's famous surf coast. Simple living with sand between your toes, turtle-watching at night, and the best nasi lemak for breakfast.",
    availableDates: "Available May to August 2026",
    ownerWhatsApp: "60181234567",
  },
  {
    id: "9",
    name: "Kundasang Mountain Lodge",
    location: "Kundasang, Sabah",
    price: 220,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
    facilities: ["WiFi", "Parking", "Fireplace", "Kitchen", "Mountain View"],
    description: "A highland lodge with unobstructed views of Mount Kinabalu. Crisp mountain air, organic vegetable gardens, and stargazing from the timber deck make this a true escape.",
    availableDates: "Available June to October 2026",
    ownerWhatsApp: "60191234567",
  },
];
