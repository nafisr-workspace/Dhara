import { type SafetyBadgeType } from "@/components/shared/safety-badge"

export type Room = {
  id: string
  name: string
  type: "single" | "double" | "dorm" | "hall"
  capacity: number
  price_partner: number
  price_public: number
  price_corporate: number
  meal_addon_price: number
  is_active: boolean
}

export type Facility = {
  id: string
  name: string
  slug: string
  description: string
  location: string
  division: string
  district: string
  area: string
  coverImageUrl: string
  photos: { url: string; alt: string }[]
  priceFrom: number
  safetyTags: SafetyBadgeType[]
  impactLine: string
  impactStory: string
  amenities: { icon: string; label: string }[]
  rules: { label: string; value: string }[]
  rooms: Room[]
}

export const mockFacilities: Facility[] = [
  {
    id: "f-1",
    name: "Shanti Neer Guesthouse",
    slug: "shanti-neer-guesthouse",
    description: "A peaceful retreat in the heart of Sylhet. Originally built as a training center for local women artisans, the upper floors now serve as a guesthouse to fund our skills development programs. Enjoy home-cooked local meals and a quiet atmosphere.",
    location: "Sylhet Sadar, Sylhet",
    division: "Sylhet",
    district: "Sylhet",
    area: "Sadar",
    coverImageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", alt: "Guesthouse exterior" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", alt: "Double room" },
      { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800", alt: "Dining area" },
      { url: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=800", alt: "Garden" }
    ],
    priceFrom: 1500,
    safetyTags: ["women-safe", "gated", "verified"],
    impactLine: "Funds women's skills training",
    impactStory: "100% of proceeds from your stay go directly to the Shanti Neer Artisan Collective, which provides vocational training to marginalized women in rural Sylhet.",
    amenities: [
      { icon: "wifi", label: "Free WiFi" },
      { icon: "utensils", label: "Home-cooked meals available" },
      { icon: "car", label: "Secure parking" },
      { icon: "fan", label: "AC in all rooms" }
    ],
    rules: [
      { label: "Check-in", value: "2:00 PM" },
      { label: "Check-out", value: "11:00 AM" },
      { label: "ID Requirement", value: "National ID or Passport required" },
      { label: "Curfew", value: "Gate closes at 11:00 PM" }
    ],
    rooms: [
      { id: "r-1-1", name: "Standard Double", type: "double", capacity: 2, price_partner: 1200, price_public: 1500, price_corporate: 1500, meal_addon_price: 400, is_active: true },
      { id: "r-1-2", name: "Deluxe Twin", type: "double", capacity: 2, price_partner: 1500, price_public: 1800, price_corporate: 1800, meal_addon_price: 400, is_active: true },
      { id: "r-1-3", name: "Solo Traveler Room", type: "single", capacity: 1, price_partner: 800, price_public: 1000, price_corporate: 1000, meal_addon_price: 400, is_active: true }
    ]
  },
  {
    id: "f-2",
    name: "Grameen Training Centre",
    slug: "grameen-training-centre",
    description: "Located near the river in Barisal, our eco-friendly training center offers comfortable dormitories and private rooms. Perfect for groups, researchers, and conscious travelers.",
    location: "Sadar Road, Barisal",
    division: "Barisal",
    district: "Barisal",
    area: "Sadar",
    coverImageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", alt: "Main building" },
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800", alt: "Dormitory" },
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", alt: "Conference room" }
    ],
    priceFrom: 500,
    safetyTags: ["security", "verified"],
    impactLine: "Supports local farmers' co-op",
    impactStory: "Your booking helps maintain our agricultural training facilities, which provide free education on sustainable farming practices to over 500 local farmers annually.",
    amenities: [
      { icon: "wifi", label: "WiFi in common areas" },
      { icon: "coffee", label: "Canteen on site" },
      { icon: "users", label: "Meeting halls available" }
    ],
    rules: [
      { label: "Check-in", value: "12:00 PM" },
      { label: "Check-out", value: "10:00 AM" },
      { label: "Alcohol", value: "Strictly prohibited" }
    ],
    rooms: [
      { id: "r-2-1", name: "6-Bed Dormitory", type: "dorm", capacity: 6, price_partner: 300, price_public: 500, price_corporate: 500, meal_addon_price: 300, is_active: true },
      { id: "r-2-2", name: "Private Double", type: "double", capacity: 2, price_partner: 1000, price_public: 1200, price_corporate: 1500, meal_addon_price: 300, is_active: true },
      { id: "r-2-3", name: "Main Hall", type: "hall", capacity: 50, price_partner: 4000, price_public: 5000, price_corporate: 8000, meal_addon_price: 0, is_active: true }
    ]
  },
  {
    id: "f-3",
    name: "Alor Path Transit Home",
    slug: "alor-path-transit-home",
    description: "A highly secure transit home designed primarily for female development workers and solo women travelers. Located in a quiet, leafy neighborhood of Rajshahi.",
    location: "Uposhahar, Rajshahi",
    division: "Rajshahi",
    district: "Rajshahi",
    area: "Uposhahar",
    coverImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200", alt: "Living room" },
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800", alt: "Single room" }
    ],
    priceFrom: 1200,
    safetyTags: ["women-safe", "gated", "security", "verified"],
    impactLine: "Funds girl child education",
    impactStory: "Earnings from the transit home fund our primary school for underprivileged girls in the char regions of Rajshahi.",
    amenities: [
      { icon: "wifi", label: "High-speed WiFi" },
      { icon: "shield", label: "24/7 Female Security" },
      { icon: "book", label: "Library / Workspace" }
    ],
    rules: [
      { label: "Check-in", value: "Flexible" },
      { label: "Check-out", value: "12:00 PM" },
      { label: "Guests", value: "Women and families only" }
    ],
    rooms: [
      { id: "r-3-1", name: "Standard Single", type: "single", capacity: 1, price_partner: 1000, price_public: 1200, price_corporate: 1500, meal_addon_price: 350, is_active: true },
      { id: "r-3-2", name: "Premium Single", type: "single", capacity: 1, price_partner: 1200, price_public: 1500, price_corporate: 1800, meal_addon_price: 350, is_active: true },
      { id: "r-3-3", name: "Family Room", type: "double", capacity: 3, price_partner: 1800, price_public: 2200, price_corporate: 2500, meal_addon_price: 350, is_active: true }
    ]
  },
  {
    id: "f-4",
    name: "Coastal Climate Centre",
    slug: "coastal-climate-centre",
    description: "Located near the Sundarbans in Khulna, our center serves as a hub for climate researchers. We open our spare rooms to eco-tourists and travelers interested in conservation.",
    location: "Mongla, Khulna",
    division: "Khulna",
    district: "Bagerhat",
    area: "Mongla",
    coverImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200", alt: "Surrounding nature" },
      { url: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=800", alt: "Room view" }
    ],
    priceFrom: 1800,
    safetyTags: ["gated", "verified"],
    impactLine: "Funds mangrove conservation",
    impactStory: "Your stay directly supports our local mangrove replanting initiatives and provides alternative livelihoods for coastal communities.",
    amenities: [
      { icon: "sun", label: "Solar powered" },
      { icon: "map", label: "Tour guides available" },
      { icon: "utensils", label: "Local organic food" }
    ],
    rules: [
      { label: "Check-in", value: "2:00 PM" },
      { label: "Check-out", value: "11:00 AM" },
      { label: "Eco-policy", value: "No single-use plastics allowed" }
    ],
    rooms: [
      { id: "r-4-1", name: "Eco Lodge Double", type: "double", capacity: 2, price_partner: 1500, price_public: 1800, price_corporate: 2000, meal_addon_price: 500, is_active: true },
      { id: "r-4-2", name: "Researcher Dorm", type: "dorm", capacity: 4, price_partner: 600, price_public: 800, price_corporate: 800, meal_addon_price: 500, is_active: true }
    ]
  },
  {
    id: "f-5",
    name: "Hilltracts Peace Lodge",
    slug: "hilltracts-peace-lodge",
    description: "A scenic lodge nestled in the hills of Bandarban. Run by a cooperative of indigenous communities, offering authentic experiences and comfortable stays.",
    location: "Bandarban Sadar",
    division: "Chittagong",
    district: "Bandarban",
    area: "Sadar",
    coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200", alt: "Hill view" },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800", alt: "Lodge exterior" }
    ],
    priceFrom: 2000,
    safetyTags: ["security", "verified"],
    impactLine: "Supports indigenous artisans",
    impactStory: "The lodge provides sustainable income to 12 indigenous families and funds a local health clinic.",
    amenities: [
      { icon: "wifi", label: "Limited WiFi" },
      { icon: "coffee", label: "Local meals" },
      { icon: "mountain", label: "Trekking guides" }
    ],
    rules: [
      { label: "Check-in", value: "1:00 PM" },
      { label: "Check-out", value: "10:00 AM" },
      { label: "Respect", value: "Respect local customs and photography rules" }
    ],
    rooms: [
      { id: "r-5-1", name: "Valley View Twin", type: "double", capacity: 2, price_partner: 1600, price_public: 2000, price_corporate: 2500, meal_addon_price: 600, is_active: true },
      { id: "r-5-2", name: "Family Cottage", type: "double", capacity: 4, price_partner: 3000, price_public: 3500, price_corporate: 4000, meal_addon_price: 600, is_active: true }
    ]
  },
  {
    id: "f-6",
    name: "Dhaka Central Hub",
    slug: "dhaka-central-hub",
    description: "A modern, functional guesthouse run by an international development organization. Centrally located in Banani, ideal for short business trips or transit.",
    location: "Banani, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    area: "Banani",
    coverImageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200", alt: "Room interior" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", alt: "Lobby" }
    ],
    priceFrom: 2500,
    safetyTags: ["security", "gated", "verified"],
    impactLine: "Funds urban youth programs",
    impactStory: "Profits fund our youth IT training centers located in Dhaka's informal settlements.",
    amenities: [
      { icon: "wifi", label: "High-speed Fiber WiFi" },
      { icon: "fan", label: "AC in all areas" },
      { icon: "car", label: "Underground parking" },
      { icon: "tv", label: "Smart TV in rooms" }
    ],
    rules: [
      { label: "Check-in", value: "2:00 PM" },
      { label: "Check-out", value: "12:00 PM" },
      { label: "Visitors", value: "No outside visitors in rooms" }
    ],
    rooms: [
      { id: "r-6-1", name: "Corporate Single", type: "single", capacity: 1, price_partner: 2000, price_public: 2500, price_corporate: 2500, meal_addon_price: 500, is_active: true },
      { id: "r-6-2", name: "Executive Double", type: "double", capacity: 2, price_partner: 3000, price_public: 3500, price_corporate: 3500, meal_addon_price: 500, is_active: true }
    ]
  }
]
