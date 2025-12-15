export const CITIES = [
  {
    id: "lucknow",
    name: "Lucknow",
    locations: ["AKTU", "Jankipuram Extension", "Revanta", "BKT", "Integral University", "BBD University", "Gomti Nagar", "Old Amity"]
  },
  {
    id: "greater-noida",
    name: "Greater Noida",
    locations: ["Omaxe ITC"]
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    locations: ["Lakshman Jhula"]
  }
];

export const ROOMS = [
  {
    id: "1",
    hotel: "Hotel Drip Inn - AKTU",
    city: "lucknow",
    location: "AKTU",
    guests: 2,
    type: "Standard",
    description: "Comfortable room with modern amenities near AKTU campus",
    address: "New saraswatipuram, behind AKTU, Naya Khera, Jankipuram Extension, Lucknow, Uttar Pradesh 226031",
    mapsUrl: "https://maps.app.goo.gl/3W1q4pZ6o6Yf4w7YA",
    amenities: ["WiFi", "AC", "TV", "24/7 Security"],
    photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1200
  },
  {
    id: "2",
    hotel: "Hotel Drip Inn by Tulsi",
    city: "lucknow",
    location: "Jankipuram Extension",
    guests: 2,
    type: "Standard",
    description: "Premium room near new campus with excellent facilities",
    address: "Plot No 1/1, Sector 1, Jankipuram Extension, University, near Lucknow, New Campus, Lucknow, Uttar Pradesh 226031",
    mapsUrl: "https://maps.app.goo.gl/pMSHQko6C7QjcsNS9",
    amenities: ["WiFi", "AC", "TV", "24/7 Security", "Couple Friendly"],
    photos: ["https://images.unsplash.com/photo-1535597066210-d792b526f0c5?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1500
  },
  {
    id: "3",
    hotel: "Hotel Drip Inn - Near Revanta",
    city: "lucknow",
    location: "Revanta",
    guests: 2,
    type: "Standard",
    description: "Convenient location opposite BM Hospital with quality rooms",
    address: "Plot No. 45, Bhadhauli Sitapur Road, opposite BM Hospital, Mubarakpur, Kamlabad, Lucknow, Uttar Pradesh 226201",
    mapsUrl: "https://maps.app.goo.gl/3tMBfgAkdMbr34rc8",
    amenities: ["WiFi", "AC", "TV", "24/7 Security"],
    photos: ["https://images.unsplash.com/photo-1618870052919-41b91f7e8876?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1200
  },
  {
    id: "4",
    hotel: "Hotel Drip Inn - BKT",
    city: "lucknow",
    location: "BKT",
    guests: 2,
    type: "Standard",
    description: "Modern rooms in prime BKT location",
    address: "CSD Sahara Global Academy, Sitapur Rd, Navi Kot Nandana, Lucknow, Uttar Pradesh 226201",
    mapsUrl: "https://maps.app.goo.gl/jB1tm755jKFkGFux8",
    amenities: ["WiFi", "AC", "TV", "24/7 Security"],
    photos: ["https://images.unsplash.com/photo-1455619452474-d2be8b1e4e31?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1200
  },
  {
    id: "5",
    hotel: "Hotel Drip Inn - Near Integral",
    city: "lucknow",
    location: "Integral University",
    guests: 2,
    type: "Standard",
    description: "Excellent accommodation near Integral University campus",
    address: "Plot no 78, Paikaramau, Kursi Rd, Lucknow, Uttar Pradesh 226026",
    mapsUrl: "https://maps.app.goo.gl/25T9h1J75KNxCyi37",
    amenities: ["WiFi", "AC", "TV", "24/7 Security", "Student Friendly"],
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1500
  },
  {
    id: "6",
    hotel: "Hotel Drip Inn - Near BBD",
    city: "lucknow",
    location: "BBD University",
    guests: 2,
    type: "Standard",
    description: "Comfortable stay near BBD University with premium amenities",
    address: "H. No. 205, B- Block, Dayal Residency, Ganeshpur Rahmanpur, Lucknow, Uttar Pradesh 226028",
    mapsUrl: "https://maps.app.goo.gl/Z4kQH11F6aC3ktAc7",
    amenities: ["WiFi", "AC", "TV", "24/7 Security"],
    photos: ["https://images.unsplash.com/photo-1551632786-de41ec16a83f?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1500
  },
  {
    id: "7",
    hotel: "Hotel Drip Inn - Gomti Nagar",
    city: "lucknow",
    location: "Gomti Nagar",
    guests: 2,
    type: "Standard",
    description: "Prime Gomti Nagar location with modern amenities",
    address: "4/61, Virat Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    mapsUrl: "https://maps.app.goo.gl/Mv58HRKvQ4Kdhwjr8",
    amenities: ["WiFi", "AC", "TV", "24/7 Security", "Couple Friendly"],
    photos: ["https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1200
  },
  {
    id: "8",
    hotel: "Hotel Drip Inn by Gomti Glitz",
    city: "lucknow",
    location: "Old Amity",
    guests: 2,
    type: "Deluxe",
    description: "Premium deluxe rooms in Gomti Nagar with vibrant ambiance",
    address: "5/436, Viraj Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    mapsUrl: "https://maps.app.goo.gl/A7bv4UzHaHSnnu656",
    amenities: ["WiFi", "AC", "TV", "24/7 Security", "Premium Bedding", "Couple Friendly"],
    photos: ["https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 799
  },
  {
    id: "9",
    hotel: "Hotel Drip Inn by Omaxe ITC",
    city: "greater-noida",
    location: "Omaxe ITC",
    guests: 2,
    type: "Standard",
    description: "Corporate-friendly rooms in Greater Noida with business amenities",
    address: "Alpha-II Commercial Belt, Block I, Sector Alpha II, Greater Noida, Brahmpur Rajraula Urf Nawada, Uttar Pradesh 201310",
    mapsUrl: "https://maps.app.goo.gl/R36ZCvCBbH9E6tPc9",
    amenities: ["WiFi", "AC", "TV", "24/7 Security", "Co-working Space"],
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80"],
    price4hStandard: 999,
    price4hDeluxe: 1300,
    price24h: 2500
  },
  {
    id: "10",
    hotel: "Hotel Drip Inn by Radha Krishna",
    city: "rishikesh",
    location: "Lakshman Jhula",
    guests: 2,
    type: "Standard",
    description: "Spiritual stay by the Ganges near Lakshman Jhula with yoga facilities",
    address: "Guru Yog Peeth, N h 7, Lakshman Jhula, Narender Nagar, Tapovan, Rishikesh, Uttarakhand 249192",
    mapsUrl: "https://maps.app.goo.gl/aoYGV61E1aWnFzSZ7",
    amenities: ["WiFi", "AC", "TV", "24/7 Security", "Yoga Classes", "River View"],
    photos: ["https://images.unsplash.com/photo-1520530541564-48e1511b13d9?w=500&q=80"],
    price4hStandard: null,
    price4hDeluxe: null,
    price24h: 1200
  }
];

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const HOTEL_INFO = {
  name: "Hotel Dripinn",
  tagline: "Your Home Away From Home",
  description: "Welcome to Hotel Dripinn – one of the safest and most trusted hotel chains in Lucknow. We are couple-friendly and consistently praised for our safety, comfort, and vibrant vibes. Founded in 2021, our founder brings 6+ years of experience in the hospitality sector, ensuring exceptional service and memorable stays.",
  features: [
    "100+ rooms designed for comfort and convenience",
    "Convenient Booking Options – effortless reservations anytime",
    "Prime Locations – properties situated in the heart of every city",
    "Great Deals – value-for-money stays with exclusive offers",
    "24/7 Security – your safety is our top priority"
  ],
  presence: [
    "Lucknow – flagship properties",
    "Noida & Rishikesh – corporate bookings available",
    "Rishikesh – custom tour packages for a complete travel experience"
  ],
  media: [
    "Featured in ABP",
    "Midday",
    "Hindustan Times",
    "Dainik Bhaskar",
    "DailyHunt"
  ]
};
