import { type SafetyBadgeType } from "@/components/shared/safety-badge"

export type RoomPhoto = {
  url: string
  alt: string
}

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
  photos: RoomPhoto[]
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
  lat: number
  lng: number
  coverImageUrl: string
  photos: { url: string; alt: string }[]
  priceFrom: number
  rating: number
  reviewCount: number
  safetyTags: SafetyBadgeType[]
  impactLine: string
  impactStory: string
  amenities: { icon: string; label: string }[]
  rules: { label: string; value: string }[]
  rooms: Room[]
}

// ── Booking types & data ────────────────────────────────────────────────────

export type BookingStatus = "pending_approval" | "upcoming" | "checked_in" | "completed" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "refunded" | "cash_pending"
export type PaymentMethod = "bkash" | "nagad" | "card" | "cash"

export type BookingSource = "platform" | "manual"

export type MockBooking = {
  id: string
  bookingCode: string
  guestId: string
  roomId: string
  facilityId: string
  facilityName: string
  facilitySlug: string
  facilityImage: string
  facilityLocation: string
  roomName: string
  checkinDate: string
  checkoutDate: string
  guestCount: number
  mealIncluded: boolean
  roomRate: number
  mealCharge: number
  platformFee: number
  taxAmount: number
  totalAmount: number
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod | null
  status: BookingStatus
  specialRequests: string | null
  impactLine: string
  source: BookingSource
  sourcePlatform?: string
  createdAt: string
}

export type MessageType = "text" | "booking_request" | "system"

export type MockMessage = {
  id: string
  bookingId: string
  senderId: string
  senderName: string
  content: string
  type: MessageType
  bookingRequestData?: {
    bookingId: string
    guestName: string
    roomName: string
    checkinDate: string
    checkoutDate: string
    guestCount: number
    totalAmount: number
    status: "pending" | "approved" | "declined"
  }
  readAt: string | null
  createdAt: string
}

export type MockThread = {
  id: string
  bookingId: string
  facilityName: string
  facilityImage: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: MockMessage[]
}

export type MockPayout = {
  id: string
  orgId: string
  periodMonth: string
  bookingCount: number
  grossAmount: number
  platformFee: number
  taxCollected: number
  netPayout: number
  status: "pending" | "processing" | "paid"
  paidAt: string | null
}

export type MfsAccountType = "bkash" | "nagad" | "bank"

export type LinkedAccount = {
  type: MfsAccountType
  accountNumber: string
  accountNumberMasked: string
}

export type MockUserProfile = {
  id: string
  fullName: string
  email: string
  phone: string
  role: "guest" | "operator"
  avatarUrl: string | null
  idType: "nid" | "passport" | null
  idLastFour: string | null
  linkedAccount: LinkedAccount | null
  notificationSms: boolean
  notificationEmail: boolean
  totalNights: number
  totalBookings: number
  rating: number
  reviewCount: number
}

export type StaffRole = "admin" | "caretaker" | "staff"

export type OperatorPageId =
  | "front_desk"
  | "dashboard"
  | "facilities"
  | "calendar"
  | "bookings"
  | "earnings"
  | "messages"
  | "profile"

export type StaffMember = {
  id: string
  name: string
  email: string
  phone: string
  role: StaffRole
  pageAccess: OperatorPageId[]
}

export type VerificationDocStatus = "not_uploaded" | "uploaded" | "verified" | "rejected"

export type VerificationDocument = {
  id: string
  label: string
  description: string
  status: VerificationDocStatus
  fileName: string | null
  uploadedAt: string | null
  rejectionReason: string | null
}

export type MockOrganization = {
  id: string
  ownerId: string
  name: string
  logoUrl: string | null
  contactEmail: string
  bankAccountMasked: string
  status: "pending" | "approved" | "paused"
  verificationStatus: "pending_documents" | "under_review" | "verified" | "rejected"
  verificationDocuments: VerificationDocument[]
  termsAcceptedAt: string | null
  staff: StaffMember[]
}

export type AvailabilityBlock = {
  id: string
  roomId: string
  startDate: string
  endDate: string
  reason: string
}

export type MockReview = {
  id: string
  reviewerId: string
  reviewerName: string
  targetType: "facility" | "guest"
  targetId: string
  rating: number
  comment: string
  createdAt: string
}

// ── Mock user profiles ──────────────────────────────────────────────────────

export const mockGuestProfile: MockUserProfile = {
  id: "u-guest-1",
  fullName: "Nadia Rahman",
  email: "nadia.r@gmail.com",
  phone: "+880 1712 345678",
  role: "guest",
  avatarUrl: null,
  idType: null,
  idLastFour: null,
  linkedAccount: { type: "bkash", accountNumber: "01712345678", accountNumberMasked: "****5678" },
  notificationSms: true,
  notificationEmail: true,
  totalNights: 12,
  totalBookings: 5,
  rating: 4.8,
  reviewCount: 4,
}

export const mockGuestProfiles: Record<string, MockUserProfile> = {
  "u-guest-1": {
    id: "u-guest-1",
    fullName: "Nadia Rahman",
    email: "nadia.r@gmail.com",
    phone: "+880 1712 345678",
    role: "guest",
    avatarUrl: null,
    idType: null,
    idLastFour: null,
    linkedAccount: { type: "bkash", accountNumber: "01712345678", accountNumberMasked: "****5678" },
    notificationSms: true,
    notificationEmail: true,
    totalNights: 12,
    totalBookings: 5,
    rating: 4.8,
    reviewCount: 4,
  },
  "u-guest-2": {
    id: "u-guest-2",
    fullName: "Arif Khan",
    email: "arif.khan@outlook.com",
    phone: "+880 1819 876543",
    role: "guest",
    avatarUrl: null,
    idType: null,
    idLastFour: null,
    linkedAccount: { type: "nagad", accountNumber: "01819876543", accountNumberMasked: "****6543" },
    notificationSms: true,
    notificationEmail: true,
    totalNights: 6,
    totalBookings: 2,
    rating: 4.5,
    reviewCount: 2,
  },
  "u-guest-3": {
    id: "u-guest-3",
    fullName: "Sabrina Chowdhury",
    email: "sabrina.c@yahoo.com",
    phone: "+880 1655 112233",
    role: "guest",
    avatarUrl: null,
    idType: null,
    idLastFour: null,
    linkedAccount: { type: "bank", accountNumber: "1234567890", accountNumberMasked: "****7890" },
    notificationSms: true,
    notificationEmail: true,
    totalNights: 3,
    totalBookings: 1,
    rating: 5.0,
    reviewCount: 1,
  },
}

export const mockOperatorProfile: MockUserProfile = {
  id: "u-op-1",
  fullName: "Kamal Hossain",
  email: "kamal@shantineer.org",
  phone: "+880 1911 222333",
  role: "operator",
  avatarUrl: null,
  idType: null,
  idLastFour: null,
  linkedAccount: null,
  notificationSms: true,
  notificationEmail: true,
  totalNights: 0,
  totalBookings: 0,
  rating: 4.7,
  reviewCount: 18,
}

export const REQUIRED_VERIFICATION_DOCUMENTS: Omit<VerificationDocument, "id">[] = [
  {
    label: "NGO Registration Certificate",
    description: "Government-issued registration certificate for your organization (NGOAB, DSS, or Joint Stock)",
    status: "not_uploaded",
    fileName: null,
    uploadedAt: null,
    rejectionReason: null,
  },
  {
    label: "TIN Certificate",
    description: "Tax Identification Number certificate issued by NBR",
    status: "not_uploaded",
    fileName: null,
    uploadedAt: null,
    rejectionReason: null,
  },
  {
    label: "Organization Constitution / Bylaws",
    description: "Memorandum of Association, Articles, or governing bylaws",
    status: "not_uploaded",
    fileName: null,
    uploadedAt: null,
    rejectionReason: null,
  },
  {
    label: "Authorized Signatory NID",
    description: "National ID of the person authorized to manage this account",
    status: "not_uploaded",
    fileName: null,
    uploadedAt: null,
    rejectionReason: null,
  },
  {
    label: "Facility Ownership / Lease Document",
    description: "Proof of ownership or lease agreement for the facility you want to list",
    status: "not_uploaded",
    fileName: null,
    uploadedAt: null,
    rejectionReason: null,
  },
]

export const mockOrganization: MockOrganization = {
  id: "org-1",
  ownerId: "u-op-1",
  name: "Shanti Neer Development Society",
  logoUrl: null,
  contactEmail: "info@shantineer.org",
  bankAccountMasked: "****4567",
  status: "approved",
  verificationStatus: "verified",
  termsAcceptedAt: "2025-11-15T10:30:00Z",
  verificationDocuments: [
    {
      id: "doc-1",
      label: "NGO Registration Certificate",
      description: "Government-issued registration certificate for your organization (NGOAB, DSS, or Joint Stock)",
      status: "verified",
      fileName: "shantineer_registration.pdf",
      uploadedAt: "2025-11-15T10:30:00Z",
      rejectionReason: null,
    },
    {
      id: "doc-2",
      label: "TIN Certificate",
      description: "Tax Identification Number certificate issued by NBR",
      status: "verified",
      fileName: "tin_certificate.pdf",
      uploadedAt: "2025-11-15T10:32:00Z",
      rejectionReason: null,
    },
    {
      id: "doc-3",
      label: "Organization Constitution / Bylaws",
      description: "Memorandum of Association, Articles, or governing bylaws",
      status: "verified",
      fileName: "constitution_bylaws.pdf",
      uploadedAt: "2025-11-15T10:34:00Z",
      rejectionReason: null,
    },
    {
      id: "doc-4",
      label: "Authorized Signatory NID",
      description: "National ID of the person authorized to manage this account",
      status: "verified",
      fileName: "kamal_nid_scan.pdf",
      uploadedAt: "2025-11-15T10:36:00Z",
      rejectionReason: null,
    },
    {
      id: "doc-5",
      label: "Facility Ownership / Lease Document",
      description: "Proof of ownership or lease agreement for the facility you want to list",
      status: "verified",
      fileName: "lease_agreement.pdf",
      uploadedAt: "2025-11-16T09:00:00Z",
      rejectionReason: null,
    },
  ],
  staff: [
    {
      id: "staff-1",
      name: "Kamal Hossain",
      email: "kamal@shantineer.org",
      phone: "+880 1911 222333",
      role: "admin",
      pageAccess: ["front_desk", "dashboard", "facilities", "calendar", "bookings", "earnings", "messages", "profile"],
    },
    {
      id: "staff-2",
      name: "Rina Begum",
      email: "rina@shantineer.org",
      phone: "+880 1712 998877",
      role: "caretaker",
      pageAccess: ["front_desk", "calendar", "bookings", "messages"],
    },
    {
      id: "staff-3",
      name: "Tanvir Ahmed",
      email: "tanvir@shantineer.org",
      phone: "+880 1655 445566",
      role: "staff",
      pageAccess: ["front_desk"],
    },
  ],
}

// ── Mock bookings ───────────────────────────────────────────────────────────

export const mockBookings: MockBooking[] = [
  {
    id: "b-1",
    bookingCode: "DHARA-KX7M-P2QL",
    guestId: "u-guest-1",
    roomId: "r-1-1",
    facilityId: "f-1",
    facilityName: "Shanti Neer Guesthouse",
    facilitySlug: "shanti-neer-guesthouse",
    facilityImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Sylhet Sadar, Sylhet",
    roomName: "Standard Double",
    checkinDate: "2026-03-10",
    checkoutDate: "2026-03-13",
    guestCount: 2,
    mealIncluded: true,
    roomRate: 1500,
    mealCharge: 1200,
    platformFee: 216,
    taxAmount: 146,
    totalAmount: 6062,
    paymentStatus: "paid",
    paymentMethod: "bkash",
    status: "upcoming",
    specialRequests: "Late check-in around 6 PM",
    impactLine: "Funds women's skills training",
    source: "platform",
    createdAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "b-2",
    bookingCode: "DHARA-TN3R-W8HF",
    guestId: "u-guest-1",
    roomId: "r-5-1",
    facilityId: "f-5",
    facilityName: "Hilltracts Peace Lodge",
    facilitySlug: "hilltracts-peace-lodge",
    facilityImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Bandarban Sadar",
    roomName: "Valley View Twin",
    checkinDate: "2026-03-20",
    checkoutDate: "2026-03-23",
    guestCount: 2,
    mealIncluded: true,
    roomRate: 2000,
    mealCharge: 1800,
    platformFee: 304,
    taxAmount: 205,
    totalAmount: 8509,
    paymentStatus: "cash_pending",
    paymentMethod: "cash",
    status: "upcoming",
    specialRequests: null,
    impactLine: "Supports indigenous artisans",
    source: "platform",
    createdAt: "2026-02-28T14:00:00Z",
  },
  {
    id: "b-3",
    bookingCode: "DHARA-QF5J-L9XC",
    guestId: "u-guest-1",
    roomId: "r-3-1",
    facilityId: "f-3",
    facilityName: "Alor Path Transit Home",
    facilitySlug: "alor-path-transit-home",
    facilityImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Uposhahar, Rajshahi",
    roomName: "Standard Single",
    checkinDate: "2026-03-01",
    checkoutDate: "2026-03-03",
    guestCount: 1,
    mealIncluded: false,
    roomRate: 1200,
    mealCharge: 0,
    platformFee: 192,
    taxAmount: 130,
    totalAmount: 2722,
    paymentStatus: "paid",
    paymentMethod: "nagad",
    status: "checked_in",
    specialRequests: "Need a quiet room",
    impactLine: "Funds girl child education",
    source: "platform",
    createdAt: "2026-02-20T09:00:00Z",
  },
  {
    id: "b-4",
    bookingCode: "DHARA-AB2K-N7YP",
    guestId: "u-guest-1",
    roomId: "r-6-1",
    facilityId: "f-6",
    facilityName: "Dhaka Central Hub",
    facilitySlug: "dhaka-central-hub",
    facilityImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Banani, Dhaka",
    roomName: "Corporate Single",
    checkinDate: "2026-02-10",
    checkoutDate: "2026-02-12",
    guestCount: 1,
    mealIncluded: true,
    roomRate: 2500,
    mealCharge: 1000,
    platformFee: 480,
    taxAmount: 324,
    totalAmount: 6804,
    paymentStatus: "paid",
    paymentMethod: "card",
    status: "completed",
    specialRequests: null,
    impactLine: "Funds urban youth programs",
    source: "platform",
    createdAt: "2026-01-28T11:00:00Z",
  },
  {
    id: "b-5",
    bookingCode: "DHARA-WG4D-H6RM",
    guestId: "u-guest-1",
    roomId: "r-4-1",
    facilityId: "f-4",
    facilityName: "Coastal Climate Centre",
    facilitySlug: "coastal-climate-centre",
    facilityImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Mongla, Khulna",
    roomName: "Eco Lodge Double",
    checkinDate: "2026-01-15",
    checkoutDate: "2026-01-18",
    guestCount: 2,
    mealIncluded: true,
    roomRate: 1800,
    mealCharge: 1500,
    platformFee: 384,
    taxAmount: 259,
    totalAmount: 7543,
    paymentStatus: "paid",
    paymentMethod: "bkash",
    status: "completed",
    specialRequests: "Interested in the mangrove tour",
    impactLine: "Funds mangrove conservation",
    source: "platform",
    createdAt: "2025-12-30T16:00:00Z",
  },
  {
    id: "b-6",
    bookingCode: "DHARA-MV8E-C3SN",
    guestId: "u-guest-1",
    roomId: "r-2-2",
    facilityId: "f-2",
    facilityName: "Grameen Training Centre",
    facilitySlug: "grameen-training-centre",
    facilityImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Sadar Road, Barisal",
    roomName: "Private Double",
    checkinDate: "2026-02-20",
    checkoutDate: "2026-02-22",
    guestCount: 2,
    mealIncluded: false,
    roomRate: 1200,
    mealCharge: 0,
    platformFee: 192,
    taxAmount: 130,
    totalAmount: 2722,
    paymentStatus: "refunded",
    paymentMethod: "nagad",
    status: "cancelled",
    specialRequests: null,
    impactLine: "Supports local farmers' co-op",
    source: "platform",
    createdAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "b-7",
    bookingCode: "DHARA-ZR1F-J4QT",
    guestId: "u-guest-2",
    roomId: "r-1-2",
    facilityId: "f-1",
    facilityName: "Shanti Neer Guesthouse",
    facilitySlug: "shanti-neer-guesthouse",
    facilityImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Sylhet Sadar, Sylhet",
    roomName: "Deluxe Twin",
    checkinDate: "2026-03-01",
    checkoutDate: "2026-03-04",
    guestCount: 2,
    mealIncluded: true,
    roomRate: 1800,
    mealCharge: 1200,
    platformFee: 360,
    taxAmount: 243,
    totalAmount: 7203,
    paymentStatus: "paid",
    paymentMethod: "card",
    status: "checked_in",
    specialRequests: "Celebrating anniversary",
    impactLine: "Funds women's skills training",
    source: "platform",
    createdAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "b-8",
    bookingCode: "DHARA-PL6G-K9WA",
    guestId: "u-guest-3",
    roomId: "r-1-3",
    facilityId: "f-1",
    facilityName: "Shanti Neer Guesthouse",
    facilitySlug: "shanti-neer-guesthouse",
    facilityImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Sylhet Sadar, Sylhet",
    roomName: "Solo Traveler Room",
    checkinDate: "2026-03-05",
    checkoutDate: "2026-03-07",
    guestCount: 1,
    mealIncluded: false,
    roomRate: 1000,
    mealCharge: 0,
    platformFee: 160,
    taxAmount: 108,
    totalAmount: 2268,
    paymentStatus: "paid",
    paymentMethod: "bkash",
    status: "upcoming",
    specialRequests: null,
    impactLine: "Funds women's skills training",
    source: "platform",
    createdAt: "2026-02-27T15:00:00Z",
  },
  {
    id: "b-9",
    bookingCode: "DHARA-NY2H-R5KL",
    guestId: "u-guest-1",
    roomId: "r-1-1",
    facilityId: "f-1",
    facilityName: "Shanti Neer Guesthouse",
    facilitySlug: "shanti-neer-guesthouse",
    facilityImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Sylhet Sadar, Sylhet",
    roomName: "Standard Double",
    checkinDate: "2026-04-10",
    checkoutDate: "2026-04-13",
    guestCount: 2,
    mealIncluded: true,
    roomRate: 1500,
    mealCharge: 1200,
    platformFee: 216,
    taxAmount: 146,
    totalAmount: 6062,
    paymentStatus: "pending",
    paymentMethod: "bkash",
    status: "pending_approval",
    specialRequests: "Would love a room with a garden view",
    impactLine: "Funds women's skills training",
    source: "platform",
    createdAt: "2026-03-02T09:00:00Z",
  },
  {
    id: "b-10",
    bookingCode: "DHARA-FK3T-Q8WB",
    guestId: "u-guest-2",
    roomId: "r-2-2",
    facilityId: "f-2",
    facilityName: "Grameen Training Centre",
    facilitySlug: "grameen-training-centre",
    facilityImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Sadar Road, Barisal",
    roomName: "Private Double",
    checkinDate: "2026-03-20",
    checkoutDate: "2026-03-23",
    guestCount: 2,
    mealIncluded: true,
    roomRate: 1200,
    mealCharge: 900,
    platformFee: 168,
    taxAmount: 113,
    totalAmount: 4781,
    paymentStatus: "pending",
    paymentMethod: "nagad",
    status: "pending_approval",
    specialRequests: "We are attending a research conference nearby",
    impactLine: "Supports local farmers' co-op",
    source: "platform",
    createdAt: "2026-03-02T14:30:00Z",
  },
  {
    id: "b-11",
    bookingCode: "DHARA-HW5N-V2MC",
    guestId: "u-guest-3",
    roomId: "r-4-1",
    facilityId: "f-4",
    facilityName: "Coastal Climate Centre",
    facilitySlug: "coastal-climate-centre",
    facilityImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400",
    facilityLocation: "Mongla, Khulna",
    roomName: "Eco Lodge Double",
    checkinDate: "2026-03-25",
    checkoutDate: "2026-03-28",
    guestCount: 1,
    mealIncluded: true,
    roomRate: 1800,
    mealCharge: 1500,
    platformFee: 264,
    taxAmount: 178,
    totalAmount: 7142,
    paymentStatus: "pending",
    paymentMethod: "card",
    status: "pending_approval",
    specialRequests: "Interested in the Sundarbans boat tour if available",
    impactLine: "Funds mangrove conservation",
    source: "platform",
    createdAt: "2026-03-03T07:15:00Z",
  },
]

// ── Mock messages ───────────────────────────────────────────────────────────

export const mockThreads: MockThread[] = [
  {
    id: "t-1",
    bookingId: "b-1",
    facilityName: "Shanti Neer Guesthouse",
    facilityImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=100",
    lastMessage: "We'll keep the gate open for you. Safe travels!",
    lastMessageAt: "2026-02-28T18:30:00Z",
    unreadCount: 1,
    messages: [
      { id: "m-1", bookingId: "b-1", senderId: "u-guest-1", senderName: "Nadia Rahman", content: "Hi, I'll be arriving around 6 PM. Will someone be at the gate?", type: "text", readAt: "2026-02-28T16:00:00Z", createdAt: "2026-02-28T15:30:00Z" },
      { id: "m-2", bookingId: "b-1", senderId: "u-op-1", senderName: "Shanti Neer Staff", content: "Welcome! Yes, our caretaker Rina will be at the gate from 2 PM onwards. Please call the front desk when you're 30 minutes away.", type: "text", readAt: "2026-02-28T17:00:00Z", createdAt: "2026-02-28T16:00:00Z" },
      { id: "m-3", bookingId: "b-1", senderId: "u-guest-1", senderName: "Nadia Rahman", content: "That's great, thank you! Is there parking available?", type: "text", readAt: "2026-02-28T18:30:00Z", createdAt: "2026-02-28T17:30:00Z" },
      { id: "m-4", bookingId: "b-1", senderId: "u-op-1", senderName: "Shanti Neer Staff", content: "We'll keep the gate open for you. Safe travels!", type: "text", readAt: null, createdAt: "2026-02-28T18:30:00Z" },
    ],
  },
  {
    id: "t-2",
    bookingId: "b-5",
    facilityName: "Coastal Climate Centre",
    facilityImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=100",
    lastMessage: "Thank you for staying with us! Your impact certificate is ready.",
    lastMessageAt: "2026-01-19T10:00:00Z",
    unreadCount: 0,
    messages: [
      { id: "m-5", bookingId: "b-5", senderId: "u-guest-1", senderName: "Nadia Rahman", content: "Hello, can you arrange the mangrove tour for the 16th?", type: "text", readAt: "2026-01-14T10:00:00Z", createdAt: "2026-01-14T09:00:00Z" },
      { id: "m-6", bookingId: "b-5", senderId: "u-op-1", senderName: "Climate Centre Staff", content: "Absolutely! Our guide Ratan will take you at 7 AM. Wear long sleeves and bring insect repellent.", type: "text", readAt: "2026-01-14T12:00:00Z", createdAt: "2026-01-14T10:30:00Z" },
      { id: "m-7", bookingId: "b-5", senderId: "u-op-1", senderName: "Climate Centre Staff", content: "Thank you for staying with us! Your impact certificate is ready.", type: "text", readAt: "2026-01-19T12:00:00Z", createdAt: "2026-01-19T10:00:00Z" },
    ],
  },
  {
    id: "t-3",
    bookingId: "b-3",
    facilityName: "Alor Path Transit Home",
    facilityImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=100",
    lastMessage: "Your room is ready. See you soon!",
    lastMessageAt: "2026-02-28T20:00:00Z",
    unreadCount: 0,
    messages: [
      { id: "m-8", bookingId: "b-3", senderId: "u-op-1", senderName: "Alor Path Staff", content: "Your room is ready. See you soon!", type: "text", readAt: "2026-02-28T21:00:00Z", createdAt: "2026-02-28T20:00:00Z" },
    ],
  },
  {
    id: "t-4",
    bookingId: "b-9",
    facilityName: "Shanti Neer Guesthouse",
    facilityImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=100",
    lastMessage: "New booking request from Nadia Rahman",
    lastMessageAt: "2026-03-02T09:00:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-9",
        bookingId: "b-9",
        senderId: "system",
        senderName: "Dhara Platform",
        content: "New Booking Request: Nadia Rahman has requested Standard Double from Apr 10 – Apr 13 (3 nights, 2 guests). Total: ৳6,062.",
        type: "booking_request",
        bookingRequestData: {
          bookingId: "b-9",
          guestName: "Nadia Rahman",
          roomName: "Standard Double",
          checkinDate: "2026-04-10",
          checkoutDate: "2026-04-13",
          guestCount: 2,
          totalAmount: 6062,
          status: "pending",
        },
        readAt: null,
        createdAt: "2026-03-02T09:00:00Z",
      },
    ],
  },
  {
    id: "t-5",
    bookingId: "b-10",
    facilityName: "Grameen Training Centre",
    facilityImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=100",
    lastMessage: "New booking request from Arif Khan",
    lastMessageAt: "2026-03-02T14:30:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-10",
        bookingId: "b-10",
        senderId: "system",
        senderName: "Dhara Platform",
        content: "New Booking Request: Arif Khan has requested Private Double from Mar 20 – Mar 23 (3 nights, 2 guests). Total: ৳4,781.",
        type: "booking_request",
        bookingRequestData: {
          bookingId: "b-10",
          guestName: "Arif Khan",
          roomName: "Private Double",
          checkinDate: "2026-03-20",
          checkoutDate: "2026-03-23",
          guestCount: 2,
          totalAmount: 4781,
          status: "pending",
        },
        readAt: null,
        createdAt: "2026-03-02T14:30:00Z",
      },
      {
        id: "m-11",
        bookingId: "b-10",
        senderId: "u-guest-2",
        senderName: "Arif Khan",
        content: "Hi, we are two researchers attending a conference in Barisal. Is the WiFi reliable enough for video calls?",
        type: "text",
        readAt: null,
        createdAt: "2026-03-02T14:35:00Z",
      },
    ],
  },
  {
    id: "t-6",
    bookingId: "b-11",
    facilityName: "Coastal Climate Centre",
    facilityImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=100",
    lastMessage: "New booking request from Sabrina Chowdhury",
    lastMessageAt: "2026-03-03T07:15:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-12",
        bookingId: "b-11",
        senderId: "system",
        senderName: "Dhara Platform",
        content: "New Booking Request: Sabrina Chowdhury has requested Eco Lodge Double from Mar 25 – Mar 28 (3 nights, 1 guest). Total: ৳7,142.",
        type: "booking_request",
        bookingRequestData: {
          bookingId: "b-11",
          guestName: "Sabrina Chowdhury",
          roomName: "Eco Lodge Double",
          checkinDate: "2026-03-25",
          checkoutDate: "2026-03-28",
          guestCount: 1,
          totalAmount: 7142,
          status: "pending",
        },
        readAt: null,
        createdAt: "2026-03-03T07:15:00Z",
      },
      {
        id: "m-13",
        bookingId: "b-11",
        senderId: "u-guest-3",
        senderName: "Sabrina Chowdhury",
        content: "Hello! I'm a solo traveler interested in the Sundarbans. Can you help arrange a boat tour during my stay?",
        type: "text",
        readAt: null,
        createdAt: "2026-03-03T07:20:00Z",
      },
      {
        id: "m-14",
        bookingId: "b-11",
        senderId: "u-guest-3",
        senderName: "Sabrina Chowdhury",
        content: "Also, is insect repellent available at the centre or should I bring my own?",
        type: "text",
        readAt: null,
        createdAt: "2026-03-03T07:22:00Z",
      },
    ],
  },
]

// ── Mock earnings / payouts ─────────────────────────────────────────────────

export const mockPayouts: MockPayout[] = [
  { id: "pay-1", orgId: "org-1", periodMonth: "2026-02-01", bookingCount: 14, grossAmount: 85400, platformFee: 6832, taxCollected: 4270, netPayout: 78568, status: "pending", paidAt: null },
  { id: "pay-2", orgId: "org-1", periodMonth: "2026-01-01", bookingCount: 18, grossAmount: 112000, platformFee: 8960, taxCollected: 5600, netPayout: 103040, status: "paid", paidAt: "2026-02-05T00:00:00Z" },
  { id: "pay-3", orgId: "org-1", periodMonth: "2025-12-01", bookingCount: 22, grossAmount: 138600, platformFee: 11088, taxCollected: 6930, netPayout: 127512, status: "paid", paidAt: "2026-01-05T00:00:00Z" },
  { id: "pay-4", orgId: "org-1", periodMonth: "2025-11-01", bookingCount: 10, grossAmount: 64200, platformFee: 5136, taxCollected: 3210, netPayout: 59064, status: "paid", paidAt: "2025-12-05T00:00:00Z" },
  { id: "pay-5", orgId: "org-1", periodMonth: "2025-10-01", bookingCount: 16, grossAmount: 98000, platformFee: 7840, taxCollected: 4900, netPayout: 90160, status: "paid", paidAt: "2025-11-05T00:00:00Z" },
  { id: "pay-6", orgId: "org-1", periodMonth: "2025-09-01", bookingCount: 8, grossAmount: 42800, platformFee: 3424, taxCollected: 2140, netPayout: 39376, status: "paid", paidAt: "2025-10-05T00:00:00Z" },
]

// ── Mock availability blocks ────────────────────────────────────────────────

export const mockAvailabilityBlocks: AvailabilityBlock[] = [
  { id: "ab-1", roomId: "r-1-1", startDate: "2026-03-15", endDate: "2026-03-18", reason: "Staff training workshop" },
  { id: "ab-2", roomId: "r-1-2", startDate: "2026-03-15", endDate: "2026-03-18", reason: "Staff training workshop" },
  { id: "ab-3", roomId: "r-1-3", startDate: "2026-03-15", endDate: "2026-03-18", reason: "Staff training workshop" },
  { id: "ab-4", roomId: "r-1-1", startDate: "2026-03-25", endDate: "2026-03-27", reason: "Maintenance" },
  { id: "ab-5", roomId: "r-1-2", startDate: "2026-04-01", endDate: "2026-04-05", reason: "Internal program" },
]

// ── Facilities ──────────────────────────────────────────────────────────────

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
    lat: 24.8949,
    lng: 91.8687,
    coverImageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", alt: "Guesthouse exterior" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", alt: "Double room" },
      { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800", alt: "Dining area" },
      { url: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=800", alt: "Garden" }
    ],
    priceFrom: 1500,
    rating: 4.6,
    reviewCount: 23,
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
      { id: "r-1-1", name: "Standard Double", type: "double", capacity: 2, price_partner: 1200, price_public: 1500, price_corporate: 1500, meal_addon_price: 400, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800", alt: "Standard Double — bed area" },
        { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800", alt: "Standard Double — window view" },
      ]},
      { id: "r-1-2", name: "Deluxe Twin", type: "double", capacity: 2, price_partner: 1500, price_public: 1800, price_corporate: 1800, meal_addon_price: 400, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800", alt: "Deluxe Twin — beds" },
        { url: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800", alt: "Deluxe Twin — bathroom" },
        { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800", alt: "Deluxe Twin — seating area" },
      ]},
      { id: "r-1-3", name: "Solo Traveler Room", type: "single", capacity: 1, price_partner: 800, price_public: 1000, price_corporate: 1000, meal_addon_price: 400, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800", alt: "Solo Traveler Room — bed" },
        { url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800", alt: "Solo Traveler Room — desk" },
      ]}
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
    lat: 22.701,
    lng: 90.3535,
    coverImageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200", alt: "Main building" },
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800", alt: "Dormitory" },
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", alt: "Conference room" }
    ],
    priceFrom: 500,
    rating: 4.2,
    reviewCount: 15,
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
      { id: "r-2-1", name: "6-Bed Dormitory", type: "dorm", capacity: 6, price_partner: 300, price_public: 500, price_corporate: 500, meal_addon_price: 300, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800", alt: "Dormitory — bunk beds" },
        { url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800", alt: "Dormitory — common area" },
      ]},
      { id: "r-2-2", name: "Private Double", type: "double", capacity: 2, price_partner: 1000, price_public: 1200, price_corporate: 1500, meal_addon_price: 300, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800", alt: "Private Double — bedroom" },
        { url: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&q=80&w=800", alt: "Private Double — en-suite bath" },
      ]},
      { id: "r-2-3", name: "Main Hall", type: "hall", capacity: 50, price_partner: 4000, price_public: 5000, price_corporate: 8000, meal_addon_price: 0, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", alt: "Main Hall — conference setup" },
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", alt: "Main Hall — classroom layout" },
      ]}
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
    lat: 24.3636,
    lng: 88.6241,
    coverImageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200", alt: "Living room" },
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800", alt: "Single room" }
    ],
    priceFrom: 1200,
    rating: 4.9,
    reviewCount: 31,
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
      { id: "r-3-1", name: "Standard Single", type: "single", capacity: 1, price_partner: 1000, price_public: 1200, price_corporate: 1500, meal_addon_price: 350, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800", alt: "Standard Single — cozy bed" },
        { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800", alt: "Standard Single — workspace" },
      ]},
      { id: "r-3-2", name: "Premium Single", type: "single", capacity: 1, price_partner: 1200, price_public: 1500, price_corporate: 1800, meal_addon_price: 350, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800", alt: "Premium Single — room view" },
        { url: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80&w=800", alt: "Premium Single — bathroom" },
      ]},
      { id: "r-3-3", name: "Family Room", type: "double", capacity: 3, price_partner: 1800, price_public: 2200, price_corporate: 2500, meal_addon_price: 350, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800", alt: "Family Room — main bedroom" },
        { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", alt: "Family Room — living area" },
        { url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800", alt: "Family Room — balcony" },
      ]}
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
    lat: 22.8456,
    lng: 89.5403,
    coverImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200", alt: "Surrounding nature" },
      { url: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=800", alt: "Room view" }
    ],
    priceFrom: 1800,
    rating: 4.4,
    reviewCount: 9,
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
      { id: "r-4-1", name: "Eco Lodge Double", type: "double", capacity: 2, price_partner: 1500, price_public: 1800, price_corporate: 2000, meal_addon_price: 500, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=800", alt: "Eco Lodge Double — room with nature view" },
        { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800", alt: "Eco Lodge Double — terrace" },
      ]},
      { id: "r-4-2", name: "Researcher Dorm", type: "dorm", capacity: 4, price_partner: 600, price_public: 800, price_corporate: 800, meal_addon_price: 500, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800", alt: "Researcher Dorm — beds" },
      ]}
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
    lat: 22.1953,
    lng: 92.2184,
    coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200", alt: "Hill view" },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800", alt: "Lodge exterior" }
    ],
    priceFrom: 2000,
    rating: 4.7,
    reviewCount: 18,
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
      { id: "r-5-1", name: "Valley View Twin", type: "double", capacity: 2, price_partner: 1600, price_public: 2000, price_corporate: 2500, meal_addon_price: 600, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800", alt: "Valley View Twin — room" },
        { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800", alt: "Valley View Twin — hill view from window" },
      ]},
      { id: "r-5-2", name: "Family Cottage", type: "double", capacity: 4, price_partner: 3000, price_public: 3500, price_corporate: 4000, meal_addon_price: 600, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800", alt: "Family Cottage — exterior" },
        { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800", alt: "Family Cottage — bedroom" },
        { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800", alt: "Family Cottage — living space" },
      ]}
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
    lat: 23.8103,
    lng: 90.4125,
    coverImageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    photos: [
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200", alt: "Room interior" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", alt: "Lobby" }
    ],
    priceFrom: 2500,
    rating: 4.3,
    reviewCount: 12,
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
      { id: "r-6-1", name: "Corporate Single", type: "single", capacity: 1, price_partner: 2000, price_public: 2500, price_corporate: 2500, meal_addon_price: 500, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800", alt: "Corporate Single — modern room" },
        { url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800", alt: "Corporate Single — work desk" },
      ]},
      { id: "r-6-2", name: "Executive Double", type: "double", capacity: 2, price_partner: 3000, price_public: 3500, price_corporate: 3500, meal_addon_price: 500, is_active: true, photos: [
        { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", alt: "Executive Double — spacious room" },
        { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800", alt: "Executive Double — bed" },
        { url: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800", alt: "Executive Double — ensuite" },
      ]}
    ]
  }
]

// ── Reviews ─────────────────────────────────────────────────────────────────

export const mockFacilityReviews: MockReview[] = [
  {
    id: "rev-f-1",
    reviewerId: "u-guest-1",
    reviewerName: "Nadia Rahman",
    targetType: "facility",
    targetId: "f-1",
    rating: 5,
    comment: "Beautiful guesthouse with incredibly warm hospitality. The home-cooked meals were the highlight — felt like visiting family. Highly recommend for solo female travelers.",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "rev-f-2",
    reviewerId: "u-guest-2",
    reviewerName: "Arif Khan",
    targetType: "facility",
    targetId: "f-1",
    rating: 4,
    comment: "Quiet and peaceful, perfect for a weekend getaway. WiFi was a bit slow but the garden area makes up for it.",
    createdAt: "2026-01-22T08:30:00Z",
  },
  {
    id: "rev-f-3",
    reviewerId: "u-guest-3",
    reviewerName: "Sabrina Chowdhury",
    targetType: "facility",
    targetId: "f-1",
    rating: 5,
    comment: "Knowing that my stay directly supports women's training made it so much more meaningful. The room was clean and comfortable.",
    createdAt: "2026-02-03T14:15:00Z",
  },
  {
    id: "rev-f-4",
    reviewerId: "u-guest-1",
    reviewerName: "Nadia Rahman",
    targetType: "facility",
    targetId: "f-2",
    rating: 4,
    comment: "Great value for budget travelers. Dorm was clean and well-maintained. Conference room is a nice bonus if you need a workspace.",
    createdAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "rev-f-5",
    reviewerId: "u-guest-2",
    reviewerName: "Arif Khan",
    targetType: "facility",
    targetId: "f-2",
    rating: 4,
    comment: "Simple but functional. Staff were helpful and the location is convenient. Would stay again.",
    createdAt: "2026-02-14T11:20:00Z",
  },
  {
    id: "rev-f-6",
    reviewerId: "u-guest-3",
    reviewerName: "Sabrina Chowdhury",
    targetType: "facility",
    targetId: "f-3",
    rating: 5,
    comment: "Absolutely stunning facility. The women's safety measures made me feel completely at ease. Best experience in Cox's Bazar!",
    createdAt: "2026-01-28T16:00:00Z",
  },
  {
    id: "rev-f-7",
    reviewerId: "u-guest-1",
    reviewerName: "Nadia Rahman",
    targetType: "facility",
    targetId: "f-3",
    rating: 5,
    comment: "The ocean view dorm is worth every taka. Meals were delicious and the community vibe is unbeatable. Already planning my next visit.",
    createdAt: "2026-02-18T13:45:00Z",
  },
  {
    id: "rev-f-8",
    reviewerId: "u-guest-2",
    reviewerName: "Arif Khan",
    targetType: "facility",
    targetId: "f-4",
    rating: 4,
    comment: "Unique heritage feel with modern amenities. The courtyard is perfect for relaxing after a day of exploring Rajshahi.",
    createdAt: "2026-02-05T10:30:00Z",
  },
  {
    id: "rev-f-9",
    reviewerId: "u-guest-1",
    reviewerName: "Nadia Rahman",
    targetType: "facility",
    targetId: "f-5",
    rating: 5,
    comment: "Amazing nature experience! Woke up to bird songs and had the most relaxing weekend. The eco-friendly approach is commendable.",
    createdAt: "2026-02-20T07:15:00Z",
  },
  {
    id: "rev-f-10",
    reviewerId: "u-guest-3",
    reviewerName: "Sabrina Chowdhury",
    targetType: "facility",
    targetId: "f-6",
    rating: 4,
    comment: "Professional setup, great for business trips. Room was spacious and the underground parking is very convenient in Dhaka.",
    createdAt: "2026-02-25T15:00:00Z",
  },
]

export const mockGuestReviews: MockReview[] = [
  {
    id: "rev-g-1",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-1",
    rating: 5,
    comment: "Nadia was an exceptional guest — very respectful of house rules, left the room spotless, and even thanked the kitchen staff personally.",
    createdAt: "2026-01-18T09:00:00Z",
  },
  {
    id: "rev-g-2",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-1",
    rating: 5,
    comment: "Returning guest — always a pleasure to host. Punctual check-in, friendly, and considerate of other guests.",
    createdAt: "2026-02-12T09:00:00Z",
  },
  {
    id: "rev-g-3",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-1",
    rating: 5,
    comment: "Third visit! Nadia is the kind of guest every facility hopes for. Warm and respectful.",
    createdAt: "2026-02-22T09:00:00Z",
  },
  {
    id: "rev-g-4",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-1",
    rating: 4,
    comment: "Good guest overall. Checked out a little late but communicated in advance. No issues.",
    createdAt: "2026-02-28T09:00:00Z",
  },
  {
    id: "rev-g-5",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-2",
    rating: 4,
    comment: "Arif was a quiet and easy-going guest. Kept to himself, room was clean on checkout.",
    createdAt: "2026-02-15T09:00:00Z",
  },
  {
    id: "rev-g-6",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-2",
    rating: 5,
    comment: "Great communication throughout. Arif asked about local food spots — always appreciate curious travelers.",
    createdAt: "2026-02-24T09:00:00Z",
  },
  {
    id: "rev-g-7",
    reviewerId: "u-op-1",
    reviewerName: "Kamal Hossain",
    targetType: "guest",
    targetId: "u-guest-3",
    rating: 5,
    comment: "Sabrina was wonderful. Friendly, tidy, and even left a kind note for our team. Would love to host again.",
    createdAt: "2026-02-01T09:00:00Z",
  },
]
