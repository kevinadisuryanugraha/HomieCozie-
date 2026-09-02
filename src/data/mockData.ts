import { 
  MenuItem, 
  TableItem, 
  Reservation, 
  CommunityEvent, 
  CustomerProfile, 
  ReviewItem, 
  InventoryItem,
  RBACModulePermission,
  DataEntitySpec,
  ApiEndpointSpec,
  SystemUser,
  UserRole,
  PermissionLevel,
  GalleryItem,
  FAQItem,
  CafeFeature
} from '../types';

export const CAFE_INFO = {
  name: 'Homie Cozie Coffee & Kitchen',
  logo: '/logo_homie_cozie.png',
  menuPdfUrl: '/Menu_Homie_Cozie.pdf',
  tagline: 'Tempat Nongkrong Hangat & Live Music Favorit Kalisari – Cijantung',
  sinceYear: 2020,
  yearsOfJourney: 6,
  googleRating: 4.8,
  totalGoogleReviews: 78,
  priceRange: 'Rp 25.000 – Rp 50.000',
  address: 'Jl. H. Hasan No.23, RT.5/RW.2, Baru, Kec. Ps. Rebo, Kota Jakarta Timur, DKI Jakarta 13780',
  shortLocation: 'Kalisari – Cijantung, Pasar Rebo',
  plusCode: 'MRFX+QX Baru, Kota Jakarta Timur',
  operatingHours: {
    weekdays: '10:00 – 23:00 WIB',
    weekends: '09:00 – 00:00 WIB (Live Music 19:30)',
  },
  whatsapp: '+62 878-5004-9458',
  phone: '0815-8640-2420',
  wifiSsid: 'HomieCozie_Guest',
  wifiPassword: 'HomieCozie#2026',
  instagram: '@homie.cozie',
  instagramUrl: 'https://instagram.com/homie.cozie',
  linktreeUrl: 'https://linktr.ee/homie.cozie',
  mapsEmbedUrl: 'https://www.google.com/maps/place/Homie+Cozie+Coffee+%26+Kitchen/@-6.3255424,106.8499976,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ed6693ff5185:0x1c9f23e0c402a4b5!8m2!3d-6.3255424!4d106.8499976!16s%2Fg%2F11qmqz_r4b',
  facilities: [
    'Live Music Stage',
    'Indoor Full AC & Wi-Fi 100Mbps',
    'Semi-Outdoor Smoking Area',
    'Mezzanine Cozy Floor',
    'Area Parkir Luas (Motor & Mobil)',
    'Colokan Listrik di Setiap Meja',
    'Musholla Bersih & Toilet Nyaman',
    'Boardgames & Uno'
  ]
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-1',
    name: 'Kopi Susu Homie Signature',
    category: 'coffee',
    categoryLabel: 'Coffee & Espresso',
    price: 24000,
    description: 'Espresso blend pilihan dengan gula aren organik murni, susu segar gurih, dan tekstur creamy khas resep 6 tahun Homie Cozie.',
    image: '/photos/homie_cozie_008.jpg',
    isBestSeller: true,
    tags: ['Best Seller', 'Signature', 'House Blend'],
    tasteProfile: 'Nutty, Sweet Caramel, Rich Body',
    available: true,
    preparationTimeMinutes: 4,
    options: {
      sugarLevels: ['Normal Sweet (100%)', 'Less Sweet (70%)', 'Slightly Sweet (30%)', 'No Sugar'],
      iceLevels: ['Normal Ice', 'Less Ice', 'No Ice'],
      milkType: ['Fresh Milk (Standard)', 'Oat Milk (+8k)', 'Soy Milk (+6k)']
    }
  },
  {
    id: 'm-2',
    name: 'Aren Cremosa Cozie',
    category: 'coffee',
    categoryLabel: 'Coffee & Espresso',
    price: 28000,
    description: 'Double shot espresso dengan layer salted caramel cream lembut di atasnya dan taburan brown sugar torched.',
    image: '/photos/homie_cozie_100.jpg',
    isBestSeller: true,
    isChefSpecial: true,
    tags: ['Chef Pick', 'Trending', 'Sweet Tooth'],
    tasteProfile: 'Creamy Velvet, Light Salty Sweet',
    available: true,
    preparationTimeMinutes: 5,
    options: {
      sugarLevels: ['Normal Sweet', 'Less Sweet'],
      iceLevels: ['Normal Ice', 'Less Ice']
    }
  },
  {
    id: 'm-3',
    name: 'V60 Single Origin (Aceh Gayo / Flores)',
    category: 'manual-brew',
    categoryLabel: 'Manual Brew Bar',
    price: 30000,
    description: 'Seduhan manual filter V60 dengan biji kopi arabika specialty Nusantara, disangrai medium untuk aroma floral dan fruity.',
    image: '/photos/homie_cozie_026.png',
    isChefSpecial: true,
    tags: ['Specialty', 'Single Origin', 'Slow Bar'],
    tasteProfile: 'Bright Acidity, Jasmine Floral, Peach Finish',
    available: true,
    preparationTimeMinutes: 8,
    options: {
      beans: ['Aceh Gayo Natural', 'Flores Bajawa Washed', 'Kerinci Honey (+3k)']
    }
  },
  {
    id: 'm-4',
    name: 'Butterscotch Sea Salt Latte',
    category: 'coffee',
    categoryLabel: 'Coffee & Espresso',
    price: 29000,
    description: 'Espresso dengan sirup butterscotch racikan rumahan, sea salt foam, dan susu steamed halus.',
    image: '/photos/homie_cozie_128.jpg',
    isNew: true,
    tags: ['Barista Recipe', 'New'],
    tasteProfile: 'Rich Butter, Roasted Hazelnut, Salty Cream',
    available: true,
    preparationTimeMinutes: 5,
    options: {
      sugarLevels: ['Normal Sweet', 'Less Sweet'],
      iceLevels: ['Iced', 'Hot (Steamed)']
    }
  },
  {
    id: 'm-5',
    name: 'Berry Breeze Mojito Mocktail',
    category: 'non-coffee',
    categoryLabel: 'Mocktail & Refreshers',
    price: 26000,
    description: 'Campuran puree buah segar, daun mint segar, perasan jeruk nipis, dan sparkling soda dingin.',
    image: '/photos/homie_cozie_061.png',
    isBestSeller: true,
    tags: ['Refreshing', 'Non-Coffee', 'Summer Vibes'],
    tasteProfile: 'Zesty Lime, Fizzy Berry, Minty Cool',
    available: true,
    preparationTimeMinutes: 4
  },
  {
    id: 'm-6',
    name: 'Matcha Uji Artisan Latte',
    category: 'non-coffee',
    categoryLabel: 'Mocktail & Refreshers',
    price: 27000,
    description: 'Bubuk matcha ceremonial grade asli Jepang dipadukan dengan susu segar, menghasilkan rasa umami pekat tanpa serik.',
    image: '/photos/homie_cozie_098.jpg',
    tags: ['Artisan', 'Healthy', 'Non-Coffee'],
    tasteProfile: 'Earthy Umami, Balanced Sweetness',
    available: true,
    preparationTimeMinutes: 4,
    options: {
      sugarLevels: ['Normal Sweet', 'Less Sweet', 'No Sugar'],
      iceLevels: ['Iced', 'Hot']
    }
  },
  {
    id: 'm-7',
    name: 'Nasi Goreng Kampung Homie Cozie',
    category: 'kitchen-mains',
    categoryLabel: 'Kitchen Mains',
    price: 36000,
    description: 'Nasi goreng bumbu rempah tradisional Pasar Rebo dengan suwiran ayam gurih, telur mata sapi, sate ayam 1 tusuk, kerupuk, dan acar segar.',
    image: '/photos/homie_cozie_105.jpg',
    isBestSeller: true,
    tags: ['Must Try', 'Comfort Food', 'Porsi Kenyang'],
    tasteProfile: 'Smoky Wok Hei, Savory, Spiced',
    available: true,
    preparationTimeMinutes: 12,
    options: {
      spiciness: ['Sedang (Level 1)', 'Pedas (Level 2)', 'Pedas Nendang (Level 3)', 'Tidak Pedas']
    }
  },
  {
    id: 'm-8',
    name: 'Rice Bowl Ayam Sambal Matah Bali',
    category: 'kitchen-mains',
    categoryLabel: 'Kitchen Mains',
    price: 35000,
    description: 'Crispy chicken bites empuk dibaluri sambal matah Bali segar dengan irisan sereh, kecombrang, minyak kelapa wangi, dan telur onsen.',
    image: '/photos/homie_cozie_001.jpg',
    isBestSeller: true,
    tags: ['Spicy Favorite', 'Crispy Chicken'],
    tasteProfile: 'Zesty Lemongrass, Spicy Fresh, Crunchy',
    available: true,
    preparationTimeMinutes: 10,
    options: {
      spiciness: ['Pedas Normal', 'Pedas Ekstra (+2k)']
    }
  },
  {
    id: 'm-9',
    name: 'Spaghetti Aglio Olio Smoked Beef',
    category: 'pasta-rice',
    categoryLabel: 'Pasta & Noodles',
    price: 38000,
    description: 'Pasta al dente ditumis dengan bawang putih harum, olive oil murni, irisan smoked beef melimpah, cabe kering, dan taburan keju parmesan.',
    image: '/photos/homie_cozie_050.jpg',
    tags: ['Western Kitchen', 'Savory Smoked'],
    tasteProfile: 'Garlicky, Savory Olive Oil, Light Chili Kick',
    available: true,
    preparationTimeMinutes: 11,
    options: {
      spiciness: ['Sedang', 'Pedas', 'Mild']
    }
  },
  {
    id: 'm-10',
    name: 'Cozie Skillet Loaded Beef Nachos',
    category: 'light-bites',
    categoryLabel: 'Light Bites & Sharing',
    price: 28000,
    description: 'Tortilla chips renyah di atas hot skillet diselimuti daging sapi cincang berbumbu, lelehan keju mozzarella gurih, potongan tomat, dan jalapeños.',
    image: '/photos/homie_cozie_051.jpg',
    isBestSeller: true,
    tags: ['Sharing', 'Best Snack', 'Cheesy Nachos'],
    tasteProfile: 'Crunchy, Rich Cheese, Savory Beef',
    available: true,
    preparationTimeMinutes: 7
  },
  {
    id: 'm-11',
    name: 'Platter Nongkrong (Sosis, Nugget, Fries)',
    category: 'light-bites',
    categoryLabel: 'Light Bites & Sharing',
    price: 38000,
    description: 'Menu sharing komplit isi sosis bakar bratwurst, chicken nugget crispy, french fries bumbu, onion rings, dan 3 saus cocolan.',
    image: '/photos/homie_cozie_117.jpg',
    isBestSeller: true,
    tags: ['Komunitas #PITSTOP Favorite', 'Porsi Rame-rame'],
    tasteProfile: 'Crispy, Savory, Varied Textures',
    available: true,
    preparationTimeMinutes: 9
  },
  {
    id: 'm-12',
    name: 'Croffle Ice Cream Lotus Biscoff',
    category: 'pastry-dessert',
    categoryLabel: 'Dessert & Pastries',
    price: 28000,
    description: 'Pancake / Croffle hangat bertekstur empuk buttery dengan topping 2 scoop vanilla bean ice cream, saus manis melimpah, dan taburan sprinkles.',
    image: '/photos/homie_cozie_078.jpg',
    isBestSeller: true,
    tags: ['Sweet Crunch', 'Instagramable Dessert'],
    tasteProfile: 'Flaky Butter, Caramelized Cinnamon, Chilly Sweet',
    available: true,
    preparationTimeMinutes: 6
  }
];

export const INITIAL_TABLES: TableItem[] = [
  { id: 'tbl-1', tableNumber: '01', name: 'Indoor AC Window 1', area: 'indoor', areaLabel: 'Indoor AC Utama', capacity: 4, status: 'occupied', currentCustomer: 'Rian & Teman (3 pax)', occupiedSince: '18:45 WIB' },
  { id: 'tbl-2', tableNumber: '02', name: 'Indoor AC Window 2', area: 'indoor', areaLabel: 'Indoor AC Utama', capacity: 4, status: 'available' },
  { id: 'tbl-3', tableNumber: '03', name: 'Indoor Sofa Corner', area: 'indoor', areaLabel: 'Indoor AC Utama', capacity: 6, status: 'reserved', currentCustomer: 'Bpk. Dimas (Family Dinner)', reservedForTime: '20:00 WIB' },
  { id: 'tbl-4', tableNumber: '04', name: 'Indoor Bar High Stool', area: 'indoor', areaLabel: 'Indoor AC Utama', capacity: 2, status: 'available' },
  { id: 'tbl-5', tableNumber: '05', name: 'Indoor Workpod A', area: 'indoor', areaLabel: 'Indoor AC Utama', capacity: 2, status: 'occupied', currentCustomer: 'Sarah (WFH/Laptop)', occupiedSince: '17:15 WIB' },
  
  { id: 'tbl-6', tableNumber: '06', name: 'Live Stage Front A', area: 'stage', areaLabel: 'Semi-Outdoor Stage', capacity: 4, status: 'reserved', currentCustomer: 'Komunitas #PITSTOP (10 pax reserved)', reservedForTime: '19:30 WIB' },
  { id: 'tbl-7', tableNumber: '07', name: 'Live Stage Front B', area: 'stage', areaLabel: 'Semi-Outdoor Stage', capacity: 4, status: 'occupied', currentCustomer: 'Aldi & Friends', occupiedSince: '19:00 WIB' },
  { id: 'tbl-8', tableNumber: '08', name: 'Live Stage Center C', area: 'stage', areaLabel: 'Semi-Outdoor Stage', capacity: 6, status: 'available' },
  { id: 'tbl-9', tableNumber: '09', name: 'Semi-Outdoor Canopy D', area: 'stage', areaLabel: 'Semi-Outdoor Stage', capacity: 4, status: 'billing', currentCustomer: 'Kelompok Meja 9', occupiedSince: '18:10 WIB' },

  { id: 'tbl-10', tableNumber: '10', name: 'Mezzanine Floor 2A', area: 'mezzanine', areaLabel: 'Mezzanine Cozy', capacity: 4, status: 'available' },
  { id: 'tbl-11', tableNumber: '11', name: 'Mezzanine Beanbag 2B', area: 'mezzanine', areaLabel: 'Mezzanine Cozy', capacity: 4, status: 'occupied', currentCustomer: 'Nadia & Reza', occupiedSince: '18:30 WIB' },
  { id: 'tbl-12', tableNumber: '12', name: 'Mezzanine Boardgame 2C', area: 'mezzanine', areaLabel: 'Mezzanine Cozy', capacity: 6, status: 'available' },

  { id: 'tbl-13', tableNumber: '13', name: 'Garden Smoking 1', area: 'garden', areaLabel: 'Garden Area', capacity: 4, status: 'available' },
  { id: 'tbl-14', tableNumber: '14', name: 'Garden Smoking 2', area: 'garden', areaLabel: 'Garden Area', capacity: 4, status: 'occupied', currentCustomer: 'Grup Kantor Pasar Rebo', occupiedSince: '18:50 WIB' },
  { id: 'tbl-15', tableNumber: '15', name: 'Garden Bench 3', area: 'garden', areaLabel: 'Garden Area', capacity: 6, status: 'cleaning' },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    bookingCode: 'HC-2608-8821',
    customerName: 'Bima Satria (Komunitas #PITSTOP)',
    customerPhone: '0813-8890-1122',
    customerEmail: 'bima.pitstop@gmail.com',
    guestCount: 8,
    date: '2026-08-26',
    timeSlot: '19:30',
    areaPreference: 'stage',
    tableNumber: '06',
    specialOccasion: 'community',
    notes: 'Meetup mingguan motor & nonton Live Music akustik. Mohon meja dekat stage.',
    status: 'confirmed',
    createdAt: '2026-08-25 14:20',
    waConfirmed: true
  },
  {
    id: 'res-102',
    bookingCode: 'HC-2608-4419',
    customerName: 'Dimas Wicaksono',
    customerPhone: '0857-1922-3841',
    customerEmail: 'dimas.w@yahoo.com',
    guestCount: 5,
    date: '2026-08-26',
    timeSlot: '20:00',
    areaPreference: 'indoor',
    tableNumber: '03',
    specialOccasion: 'birthday',
    notes: 'Ulang tahun istri, request putar lagu ucapan selamat saat dessert keluar.',
    status: 'confirmed',
    createdAt: '2026-08-25 16:45',
    waConfirmed: true
  },
  {
    id: 'res-103',
    bookingCode: 'HC-2608-9902',
    customerName: 'Clara Anindita',
    customerPhone: '0812-7788-9933',
    guestCount: 2,
    date: '2026-08-27',
    timeSlot: '19:00',
    areaPreference: 'mezzanine',
    specialOccasion: 'casual',
    notes: 'Mau area tenang di lantai atas.',
    status: 'pending',
    createdAt: '2026-08-26 10:15',
    waConfirmed: false
  },
  {
    id: 'res-104',
    bookingCode: 'HC-2608-1155',
    customerName: 'Fahri Ramadhan',
    customerPhone: '0878-3344-5566',
    guestCount: 4,
    date: '2026-08-28',
    timeSlot: '20:30',
    areaPreference: 'stage',
    specialOccasion: 'gathering',
    notes: 'Nonton Weekend Live Session bareng geng SMA.',
    status: 'confirmed',
    createdAt: '2026-08-26 11:30',
    waConfirmed: true
  }
];

export const EVENTS_DATA: CommunityEvent[] = [
  {
    id: 'ev-1',
    title: 'Weekend Acoustic Groove: Nostalgia 2000s',
    tag: 'Live Music Rutin',
    date: 'Sabtu, 29 Agustus 2026',
    time: '19:30 – 22:30 WIB',
    performerOrHost: 'The Sunset Trio & Homie House Band',
    description: 'Lagu-lagu hits pop 2000s & indie pop favorit buat nemenin kopi malam minggumu di area Semi-Outdoor Stage.',
    image: '/photos/homie_cozie_082.jpg',
    seatsTotal: 40,
    seatsBooked: 28,
    isFeatured: true
  },
  {
    id: 'ev-2',
    title: '#PITSTOP Community Night: Riding & Coffee Talk',
    tag: 'Komunitas Rutin',
    date: 'Jumat, 28 Agustus 2026',
    time: '20:00 – 23:00 WIB',
    performerOrHost: 'Homie Cozie Riders Club Pasar Rebo',
    description: 'Kumpul santai sesama pecinta roda dua wilayah Kalisari, Cijantung, dan sekitarnya. Diskon 15% untuk anggota komunitas bertiket.',
    image: '/photos/homie_cozie_031.jpg',
    seatsTotal: 30,
    seatsBooked: 24,
    isFeatured: true
  },
  {
    id: 'ev-3',
    title: 'Cozie Barista Jam: Manual Brew Cupping Experience',
    tag: 'Coffee Workshop',
    date: 'Minggu, 30 Agustus 2026',
    time: '15:30 – 17:30 WIB',
    performerOrHost: 'Head Barista Homie Cozie',
    description: 'Eksplorasi rasa kopi nusantara dari Aceh hingga Papua. Peserta belajar teknik V60 & AeroPress langsung dari ahlinya.',
    image: '/photos/homie_cozie_062.jpg',
    seatsTotal: 15,
    seatsBooked: 9,
    entryPrice: 50000
  }
];

export const GOOGLE_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Andri Pradana (Warga Kalisari)',
    rating: 5,
    date: '2 hari lalu',
    source: 'google',
    content: 'Tempat nongkrong andalan sejak masih di Kalisari 2 sampai pindah ke Jl. H. Hasan ini. Kopi Susu Homie rasanya konsisten enak, Nasi Gorengnya gurih mantap porsi pas. Pas weekend live musicnya asik banget nggak terlalu bising!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    tag: 'Warga Kalisari • Pelanggan 4 Tahun',
    verifiedVisit: true
  },
  {
    id: 'rev-2',
    author: 'Siti Nurhaliza',
    rating: 5,
    date: '1 minggu lalu',
    source: 'google',
    content: 'Rating 4.8 di Google emang beneran valid! Tempatnya nyaman buat kerja karena colokan banyak dan AC dingin. Croffle Biscoff + Aren Cremosa combo juara. Parkiran motor mobil juga aman dijaga rapi.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    tag: 'Local Guide Level 6',
    verifiedVisit: true
  },
  {
    id: 'rev-3',
    author: 'Reza Hendrawan (#PITSTOP Member)',
    rating: 5,
    date: '2 minggu lalu',
    source: 'google',
    content: 'Basecamp anak-anak motor Kalisari–Cijantung paling ramah! Platter cemilan dan kopinya cocok di kantong. Staffnya ramah-ramah banget kayak di rumah sendiri.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    tag: 'Komunitas Motor',
    verifiedVisit: true
  },
  {
    id: 'rev-4',
    author: 'Maya Anggraini',
    rating: 4,
    date: '3 minggu lalu',
    source: 'google',
    content: 'Makanan enak, Truffle Fries wangi banget. Saran aja kalau bisa reservasi online lebih gampang jangan cuma lewat WA biar pas rame gak nunggu lama. Overall 9/10 recommended cafe di Pasar Rebo!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    tag: 'Cijantung Foodie',
    verifiedVisit: true
  }
];

export const CUSTOMER_CRM: CustomerProfile[] = [
  {
    id: 'crm-1',
    name: 'Bima Satria',
    phone: '0813-8890-1122',
    email: 'bima.pitstop@gmail.com',
    tier: 'Platinum Cozie',
    coziePoints: 480,
    stampsCount: 8,
    totalVisits: 34,
    lifetimeSpend: 1850000,
    favoriteItems: ['Platter Nongkrong', 'Kopi Susu Homie', 'Truffle Fries'],
    lastVisit: '2026-08-22',
    tags: ['Komunitas #PITSTOP', 'VIP Live Music', 'Weekend Regular']
  },
  {
    id: 'crm-2',
    name: 'Dimas Wicaksono',
    phone: '0857-1922-3841',
    email: 'dimas.w@yahoo.com',
    tier: 'Gold Cozie',
    coziePoints: 290,
    stampsCount: 5,
    totalVisits: 14,
    lifetimeSpend: 920000,
    favoriteItems: ['Nasi Goreng Kampung', 'Aren Cremosa', 'Croffle Biscoff'],
    lastVisit: '2026-08-19',
    birthday: '1995-08-26',
    tags: ['Family Dinner', 'Birthday Month']
  },
  {
    id: 'crm-3',
    name: 'Sarah Wijaya',
    phone: '0812-9988-7711',
    email: 'sarah.wfh@gmail.com',
    tier: 'Gold Cozie',
    coziePoints: 310,
    stampsCount: 6,
    totalVisits: 21,
    lifetimeSpend: 1120000,
    favoriteItems: ['V60 Aceh Gayo', 'Spaghetti Aglio Olio', 'Matcha Uji'],
    lastVisit: '2026-08-25',
    tags: ['WFH Regular', 'Coffee Enthusiast']
  }
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'inv-1', name: 'Arabica House Blend Beans (Homie)', category: 'coffee_beans', currentStock: 3.2, minStock: 2.0, unit: 'kg', costPerUnit: 165000, supplier: 'Roastery Nusantara Jkt', status: 'optimal' },
  { id: 'inv-2', name: 'Arabica Aceh Gayo Specialty', category: 'coffee_beans', currentStock: 1.1, minStock: 1.5, unit: 'kg', costPerUnit: 220000, supplier: 'Gayo Origin Direct', status: 'warning' },
  { id: 'inv-3', name: 'Fresh Milk Full Cream 1L (Diamond/Greenfields)', category: 'dairy', currentStock: 14, minStock: 8, unit: 'karton', costPerUnit: 21500, supplier: 'Distributor Susu Jaktim', status: 'optimal' },
  { id: 'inv-4', name: 'Gula Aren Cair Organik Premium', category: 'syrups', currentStock: 2.5, minStock: 5.0, unit: 'liter', costPerUnit: 48000, supplier: 'Aren Nira Murni Lebak', status: 'critical' },
  { id: 'inv-5', name: 'Dada Ayam Fillet Fresh', category: 'kitchen_meat', currentStock: 8.5, minStock: 4.0, unit: 'kg', costPerUnit: 52000, supplier: 'Pasar Induk Kramat Jati', status: 'optimal' },
  { id: 'inv-6', name: 'Croissant Dough Raw (Frozen)', category: 'dairy', currentStock: 40, minStock: 25, unit: 'pcs', costPerUnit: 6500, supplier: 'Artisan Bakery Supply', status: 'optimal' }
];

// PRD v2 — 12 Full Modules (A to L)
export const PRD_FULL_MODULES = [
  {
    code: 'A',
    name: 'Website & Kehadiran Digital',
    phase: 'Fase 1 — Fondasi',
    phaseNumber: 1,
    category: 'Digital Presence',
    description: 'Landing page profesional multi-halaman (Beranda, Menu, Galeri, Event, Kontak), Schema Markup Google Local, target ganda "Kalisari" & "Cijantung", dan social proof rating 4.8.',
    features: [
      'Multi-page responsive landing page (Mobile-first <3s)',
      'Dual Local SEO targeting Kalisari & Cijantung',
      'Menu digital interaktif dengan foto HD & label best seller',
      'Galeri & widget Google Reviews rating 4.8 terintegrasi'
    ]
  },
  {
    code: 'B',
    name: 'Reservasi & Manajemen Meja',
    phase: 'Fase 1 — Fondasi',
    phaseNumber: 1,
    category: 'Operations & Booking',
    description: 'Reservasi online real-time dengan notifikasi WhatsApp konfirmasi & reminder otomatis H-1, kalender ketersediaan meja, dan waiting list otomatis.',
    features: [
      'Booking meja real-time dengan pemilihan area (Indoor/Stage/Garden/Mezzanine)',
      'Notifikasi konfirmasi WhatsApp otomatis + reminder H-1',
      'Auto-update ketersediaan slot meja',
      'Waiting list otomatis untuk weekend live music'
    ]
  },
  {
    code: 'C',
    name: 'Pemesanan Online & QR Order',
    phase: 'Fase 2 — Pertumbuhan',
    phaseNumber: 2,
    category: 'Ordering System',
    description: 'QR Order meja via smartphone tanpa antre di kasir, pre-order & take-away online, serta sinkronisasi menu GoFood/GrabFood.',
    features: [
      'QR Code ordering per nomor meja (Dine-in)',
      'Pre-order / Takeaway online direct via web',
      'Sinkronisasi menu multi-platform'
    ]
  },
  {
    code: 'D',
    name: 'Kasir (POS) & Pembayaran',
    phase: 'Fase 2–3 — Operasional',
    phaseNumber: 3,
    category: 'POS & Billing',
    description: 'Sistem kasir terintegrasi, payment gateway QRIS dinamis, split-bill, dan sinkronisasi pesanan QR otomatis langsung ke kasir.',
    features: [
      'Cloud POS terintegrasi kasir & printer thermal',
      'Multi-payment: QRIS Dinamis, E-Wallet, Debit/Credit, Cash',
      'Auto-sync pesanan online langsung masuk ke POS'
    ]
  },
  {
    code: 'E',
    name: 'CRM & Program Loyalitas',
    phase: 'Fase 2 — Pertumbuhan',
    phaseNumber: 2,
    category: 'CRM & Retention',
    description: 'Database pelanggan terpusat, membership Cozie Points, stamp card digital, voucher promo ulang tahun, dan WA broadcast tertarget.',
    features: [
      'Database pelanggan terpusat (kontak & riwayat order)',
      'Membership tiers: Silver, Gold, Platinum Cozie',
      'Poin reward & promo ulang tahun otomatis',
      'Broadcast WhatsApp & email tertarget'
    ]
  },
  {
    code: 'F',
    name: 'Manajemen Inventori & COGS',
    phase: 'Fase 3 — Operasional',
    phaseNumber: 3,
    category: 'Inventory & Costing',
    description: 'Pelacakan stok bahan baku (biji kopi, susu, sirup, daging), notifikasi stok menipis otomatis, dan laporan pemakaian bahan (cost control).',
    features: [
      'Live stock tracking bahan baku utama',
      'Notifikasi otomatis stok menipis (critical alerts)',
      'Laporan COGS & kalkulasi food cost per porsi'
    ]
  },
  {
    code: 'G',
    name: 'Manajemen Staf & Shift',
    phase: 'Fase 3 — Operasional',
    phaseNumber: 3,
    category: 'Staff & HR',
    description: 'Jadwal shift kerja karyawan, absensi digital, dan pembagian hak akses login berbasis peran per divisi.',
    features: [
      'Penjadwalan shift barista, kitchen, & kasir',
      'Pencatatan absensi & jam kerja staff',
      'Isolasi akses modul per role user'
    ]
  },
  {
    code: 'H',
    name: 'Dashboard Analitik & Laporan',
    phase: 'Fase 2 — Pertumbuhan',
    phaseNumber: 2,
    category: 'Analytics & BI',
    description: 'Laporan omzet real-time, heatmap jam ramai, analisis menu terlaris (top sellers), dan atribusi sumber traffic (Google vs IG vs Referral).',
    features: [
      'Grafik omzet harian/mingguan/bulanan',
      'Rush hours heatmap & optimasi shift kerja',
      'Pelacakan sumber traffic (SEO Kalisari vs Instagram Linktree)'
    ]
  },
  {
    code: 'I',
    name: 'Reputasi & Ulasan Digital',
    phase: 'Fase 1 — Fondasi',
    phaseNumber: 1,
    category: 'Reputation & Social Proof',
    description: 'Integrasi ulasan Google Maps (rating 4.8) ke website secara langsung dan formulir feedback internal pasca-kunjungan untuk audit kualitas.',
    features: [
      'Widget ulasan terverifikasi Google Maps 4.8 bintang',
      'Formulir feedback pasca-kunjungan',
      'Audit sentimen kepuasan pelanggan'
    ]
  },
  {
    code: 'J',
    name: 'Konten & Event Hub (#PITSTOP)',
    phase: 'Fase 2 — Pertumbuhan',
    phaseNumber: 2,
    category: 'Events & Community',
    description: 'Kalender event terhubung langsung ke reservasi (live music mingguan, meetup motor #PITSTOP, promo musiman) dengan auto-reminder.',
    features: [
      'Kalender event interaktif dengan kuota kursi',
      'RSVP & reservasi meja khusus penonton panggung',
      'Notifikasi pengingat event ke member terdaftar'
    ]
  },
  {
    code: 'K',
    name: 'Kesiapan Multi-Outlet',
    phase: 'Fase 4 — Enterprise',
    phaseNumber: 4,
    category: 'Enterprise & Scale',
    description: 'Arsitektur data siap waralaba & cabang baru: multi-outlet dashboard, cross-outlet loyalty roaming, dan centralized inventory.',
    features: [
      'Manajemen multi-cabang terpusat',
      'Roaming poin member antar outlet',
      'Central warehouse & purchasing control'
    ]
  },
  {
    code: 'L',
    name: 'Autentikasi, RBAC & Keamanan',
    phase: 'Fase 1 — Fondasi (Wajib Ada)',
    phaseNumber: 1,
    category: 'Security & Governance',
    description: 'Login terpisah staff & member, Role-Based Access Control (RBAC) granular 9 role, middleware fail-fast berlapis, dan audit trail.',
    features: [
      'Staff login email+password (Argon2/bcrypt) & Member WhatsApp OTP',
      'Short-lived JWT (15 min) + rotating refresh token httpOnly',
      'Role-Based Access Control granular per modul',
      '6-step Fail-Fast Middleware Request Chain & Audit Logging'
    ]
  }
];

// PRD v2 — Section 8.3: Permission Matrix (Full 9 Roles x 9 Modules)
// Legenda: F = Full, E = Edit/Terbatas, L = Lihat Saja, T = Tidak Ada Akses
export const RBAC_PERMISSION_MATRIX: RBACModulePermission[] = [
  {
    moduleCode: 'MOD-WEB',
    moduleName: 'Konten Website & Menu',
    category: 'Website & Reservasi',
    description: 'Mengubah harga menu, banner promo, galeri foto, dan SEO metadata.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'E',
      cashier: 'T',
      reservation_staff: 'T',
      kitchen_staff: 'L',
      marketing: 'E',
      member: 'L',
      guest: 'L'
    }
  },
  {
    moduleCode: 'MOD-RES',
    moduleName: 'Reservasi & Booking Meja',
    category: 'Website & Reservasi',
    description: 'Menerima, mengubah status meja, konfirmasi WA, dan assign nomor meja.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'F',
      cashier: 'L',
      reservation_staff: 'F',
      kitchen_staff: 'T',
      marketing: 'L',
      member: 'E', // Milik sendiri
      guest: 'E'  // Tanpa akun
    }
  },
  {
    moduleCode: 'MOD-POS',
    moduleName: 'Order & Kasir (POS / KDS)',
    category: 'Operasional & Kasir',
    description: 'Buka bill meja, input pesanan, proses QRIS/Cash, cetak struk, dan update KDS dapur.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'F',
      cashier: 'F',
      reservation_staff: 'T',
      kitchen_staff: 'L', // KDS Screen
      marketing: 'T',
      member: 'E', // Order sendiri
      guest: 'E'  // Via QR meja
    }
  },
  {
    moduleCode: 'MOD-INV',
    moduleName: 'Inventori & Stok Bahan',
    category: 'Operasional & Kasir',
    description: 'Audit stok kopi, susu, sirup, penyesuaian waste bahan, dan input purchase order.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'F',
      cashier: 'L',
      reservation_staff: 'T',
      kitchen_staff: 'E',
      marketing: 'T',
      member: 'T',
      guest: 'T'
    }
  },
  {
    moduleCode: 'MOD-CRM',
    moduleName: 'CRM & Program Loyalitas',
    category: 'CRM & Marketing',
    description: 'Database pelanggan, manajemen Cozie Points, broadcast WhatsApp promo, dan voucher ultah.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'L',
      cashier: 'E', // Input tambah poin saat bayar
      reservation_staff: 'L',
      kitchen_staff: 'T',
      marketing: 'F',
      member: 'L', // Profil sendiri
      guest: 'T'
    }
  },
  {
    moduleCode: 'MOD-HR',
    moduleName: 'Manajemen Staf & Shift',
    category: 'Sistem & Governance',
    description: 'Pengaturan jadwal kerja barista & kitchen, absensi, dan jam lembur.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'F',
      cashier: 'L', // Shift sendiri
      reservation_staff: 'L',
      kitchen_staff: 'L',
      marketing: 'L',
      member: 'T',
      guest: 'T'
    }
  },
  {
    moduleCode: 'MOD-ANA',
    moduleName: 'Analitik & Laporan Omzet',
    category: 'CRM & Marketing',
    description: 'Dashboard penjualan real-time, profit margin, laporan COGS, dan traffic acquisition.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'F',
      cashier: 'T',
      reservation_staff: 'T',
      kitchen_staff: 'T',
      marketing: 'L', // Data marketing/traffic
      member: 'T',
      guest: 'T'
    }
  },
  {
    moduleCode: 'MOD-CFG',
    moduleName: 'Pengaturan Sistem & Integrasi',
    category: 'Sistem & Governance',
    description: 'Koneksi payment gateway (Midtrans/Xendit), WA Business API, dan domain VPS.',
    permissions: {
      super_admin: 'F',
      owner: 'E', // Approval level
      manager: 'T',
      cashier: 'T',
      reservation_staff: 'T',
      kitchen_staff: 'T',
      marketing: 'T',
      member: 'T',
      guest: 'T'
    }
  },
  {
    moduleCode: 'MOD-USR',
    moduleName: 'Manajemen User & Role (RBAC)',
    category: 'Sistem & Governance',
    description: 'Tambah akun staff, reset password, nonaktifkan akun resign, dan konfigurasi permission.',
    permissions: {
      super_admin: 'F',
      owner: 'E',
      manager: 'L',
      cashier: 'T',
      reservation_staff: 'T',
      kitchen_staff: 'T',
      marketing: 'T',
      member: 'T',
      guest: 'T'
    }
  },
  {
    moduleCode: 'MOD-AI-CHAT',
    moduleName: 'AI Cozie Assistant (Chat Agent)',
    category: 'Sistem & Governance',
    description: 'Chat asisten AI cerdas multi-model (Gemini, OpenAI, Claude, DeepSeek) dengan konteks data live kafe.',
    permissions: {
      super_admin: 'F',
      owner: 'F',
      manager: 'F',
      cashier: 'F',
      reservation_staff: 'F',
      kitchen_staff: 'F',
      marketing: 'F',
      member: 'L',
      guest: 'T'
    }
  }
];

// PRD v2 — Section 8.4: Middleware Request Flow Chain
export const MIDDLEWARE_CHAIN_STEPS = [
  {
    step: 1,
    name: 'Rate Limiter',
    code: 'rateLimiter()',
    purpose: 'Mencegah brute-force password login, spamming bot pada form reservasi, dan DDoS.',
    failAction: '429 Too Many Requests (Cooldown 60s)'
  },
  {
    step: 2,
    name: 'Auth Middleware',
    code: 'authenticateJWT()',
    purpose: 'Verifikasi tanda tangan JWT access token (15 min) atau trigger silent refresh token rotation.',
    failAction: '401 Unauthorized (Invalid/Expired Token)'
  },
  {
    step: 3,
    name: 'Role/Permission Middleware',
    code: 'requirePermission("MOD-POS", "F")',
    purpose: 'Memeriksa hak akses pengguna terhadap Permission Matrix 8.3 sebelum masuk ke resource.',
    failAction: '403 Forbidden (Hak akses ditolak)'
  },
  {
    step: 4,
    name: 'Validation Middleware',
    code: 'validateDTO(ReservationSchema)',
    purpose: 'Sanitasi input XSS/SQL Injection & validasi format tanggal, nomor WhatsApp, dan jumlah tamu.',
    failAction: '422 Unprocessable Entity (Schema Mismatch)'
  },
  {
    step: 5,
    name: 'Business Logic / Controller',
    code: 'handleCreateReservation()',
    purpose: 'Eksekusi logika F&B inti: generate booking code, alokasi meja, trigger notifikasi WA.',
    failAction: '500 Internal Error / Custom Business Exception'
  },
  {
    step: 6,
    name: 'Audit Log Middleware',
    code: 'recordAuditTrail()',
    purpose: 'Mencatat siapa (user_id), aksi apa (void/edit/delete), dan timestamp ke tabel audit_logs.',
    failAction: 'Log failure to persistent logger'
  }
];

// PRD v2 — Section 9: Skema Data Inti (15 Entities)
export const CORE_DATA_ENTITIES: DataEntitySpec[] = [
  { name: 'users', description: 'Akun internal (staff/admin/owner)', primaryKey: 'id (UUID)', relations: 'FK to roles', phase: 'Fase 1' },
  { name: 'roles & permissions', description: 'Daftar role dan hak akses granular per modul', primaryKey: 'id (UUID)', relations: 'Dasar Permission Matrix', phase: 'Fase 1' },
  { name: 'members', description: 'Pelanggan terdaftar (berbeda dari internal staff)', primaryKey: 'id (UUID)', relations: 'FK to reservations, orders, loyalty_points', phase: 'Fase 2' },
  { name: 'outlets', description: 'Data cabang (disiapkan untuk Fase 4 multi-outlet)', primaryKey: 'id (UUID)', relations: 'Induk dari tables, menu_items', phase: 'Fase 4' },
  { name: 'menu_categories & menu_items', description: 'Struktur menu digital & pricing', primaryKey: 'id (UUID)', relations: 'Relasi ke orders, inventory recipes', phase: 'Fase 1' },
  { name: 'tables', description: 'Data meja & kapasitas per zona kafe', primaryKey: 'id (UUID)', relations: 'Dipakai reservations & POS dine-in', phase: 'Fase 1' },
  { name: 'reservations', description: 'Data booking (tanggal, jam, pax, status)', primaryKey: 'id (UUID)', relations: 'FK to members/guest & tables', phase: 'Fase 1' },
  { name: 'orders & order_items', description: 'Transaksi pemesanan F&B', primaryKey: 'id (UUID)', relations: 'FK to menu_items, transactions', phase: 'Fase 2' },
  { name: 'transactions', description: 'Data pembayaran (QRIS, Tunai, Kartu)', primaryKey: 'id (UUID)', relations: 'FK to orders', phase: 'Fase 3' },
  { name: 'inventory_items & stock_movements', description: 'Stok bahan baku & histori pemakaian', primaryKey: 'id (UUID)', relations: 'Dipicu otomatis oleh orders/POS', phase: 'Fase 3' },
  { name: 'loyalty_points_history', description: 'Riwayat Cozie Points member', primaryKey: 'id (UUID)', relations: 'FK to members, transactions', phase: 'Fase 2' },
  { name: 'staff_shifts', description: 'Jadwal & absensi staff', primaryKey: 'id (UUID)', relations: 'FK to users', phase: 'Fase 3' },
  { name: 'reviews_feedback', description: 'Ulasan & feedback pelanggan', primaryKey: 'id (UUID)', relations: 'FK to members/guest', phase: 'Fase 1' },
  { name: 'promotions_events', description: 'Data promo & event (#PITSTOP/Live Music)', primaryKey: 'id (UUID)', relations: 'FK to reservations', phase: 'Fase 2' },
  { name: 'audit_logs', description: 'Jejak aksi sensitif (void, ubah role, ubah harga)', primaryKey: 'id (UUID)', relations: 'FK to users', phase: 'Fase 1' }
];

// PRD v2 — Section 10: Gambaran Endpoint API
export const API_ENDPOINT_SPECS: ApiEndpointSpec[] = [
  { method: 'POST', path: '/api/auth/login', description: 'Login staff/admin dengan email & hash password', minRole: 'guest', minRoleLabel: 'Publik', moduleGroup: 'Auth' },
  { method: 'POST', path: '/api/auth/otp/request', description: 'Request OTP WhatsApp login member pelanggan', minRole: 'guest', minRoleLabel: 'Publik', moduleGroup: 'Auth' },
  { method: 'POST', path: '/api/auth/refresh', description: 'Refresh JWT access token via httpOnly cookie', minRole: 'guest', minRoleLabel: 'Authenticated', moduleGroup: 'Auth' },
  { method: 'GET', path: '/api/reservations', description: 'List reservasi & kalender slot meja', minRole: 'reservation_staff', minRoleLabel: 'Staff Reservasi+', moduleGroup: 'Reservasi' },
  { method: 'POST', path: '/api/reservations', description: 'Buat reservasi meja baru (publik/member)', minRole: 'guest', minRoleLabel: 'Member / Guest', moduleGroup: 'Reservasi' },
  { method: 'PATCH', path: '/api/reservations/:id/status', description: 'Ubah status reservasi (seated/cancelled)', minRole: 'reservation_staff', minRoleLabel: 'Staff Reservasi+', moduleGroup: 'Reservasi' },
  { method: 'GET', path: '/api/orders', description: 'List order aktif untuk Kitchen Display System (KDS)', minRole: 'kitchen_staff', minRoleLabel: 'Staff Dapur+', moduleGroup: 'KDS & Orders' },
  { method: 'POST', path: '/api/orders', description: 'Buat order mandiri (QR scan di meja)', minRole: 'guest', minRoleLabel: 'Member / Guest', moduleGroup: 'KDS & Orders' },
  { method: 'POST', path: '/api/pos/transactions', description: 'Catat transaksi pembayaran kasir & cetak struk', minRole: 'cashier', minRoleLabel: 'Kasir+', moduleGroup: 'POS' },
  { method: 'GET', path: '/api/inventory', description: 'Lihat data stok bahan baku & alert', minRole: 'cashier', minRoleLabel: 'Kasir (L) / Manager (F)', moduleGroup: 'Inventori' },
  { method: 'PATCH', path: '/api/inventory/:id', description: 'Update penyesuaian stok & input waste', minRole: 'kitchen_staff', minRoleLabel: 'Staff Dapur / Manager', moduleGroup: 'Inventori' },
  { method: 'GET', path: '/api/crm/members', description: 'List data pelanggan & histori kunjungan', minRole: 'marketing', minRoleLabel: 'Marketing / Owner', moduleGroup: 'CRM' },
  { method: 'POST', path: '/api/crm/broadcast', description: 'Kirim broadcast WhatsApp promo tertarget', minRole: 'marketing', minRoleLabel: 'Marketing', moduleGroup: 'CRM' },
  { method: 'GET', path: '/api/analytics/dashboard', description: 'Data ringkasan omzet, rush hours & menu ranking', minRole: 'manager', minRoleLabel: 'Manager / Owner', moduleGroup: 'Analitik' },
  { method: 'POST', path: '/api/admin/users', description: 'Tambah akun karyawan baru & assign role', minRole: 'owner', minRoleLabel: 'Owner / Super Admin', moduleGroup: 'Admin RBAC' },
  { method: 'PATCH', path: '/api/admin/roles/:id', description: 'Ubah permission level suatu role secara dinamis', minRole: 'super_admin', minRoleLabel: 'Super Admin', moduleGroup: 'Admin RBAC' }
];

// Mock Users for Live Role-Switching in Backstage (All 9 Roles)
export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 'usr-1', name: 'Hansco Tech Director', email: 'director@hanscodigital.com', role: 'super_admin', roleLabel: 'Super Admin (Hansco)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: 'Baru saja', twoFactorEnabled: true },
  { id: 'usr-2', name: 'Pak Hendra (Owner)', email: 'owner@homiecozie.com', role: 'owner', roleLabel: 'Owner (Pemilik Homie Cozie)', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: '5 menit lalu', twoFactorEnabled: true },
  { id: 'usr-3', name: 'Rahmat (Supervisor)', email: 'manager@homiecozie.com', role: 'manager', roleLabel: 'Manager / Supervisor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: '12 menit lalu' },
  { id: 'usr-4', name: 'Sinta (Kasir Shift Pagi)', email: 'kasir@homiecozie.com', role: 'cashier', roleLabel: 'Kasir Frontline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: '18:40 WIB' },
  { id: 'usr-5', name: 'Bayu (Staff Reservasi & Front)', email: 'reservasi@homiecozie.com', role: 'reservation_staff', roleLabel: 'Staff Reservasi Meja', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: '18:15 WIB' },
  { id: 'usr-6', name: 'Doni (Head Barista & Kitchen)', email: 'dapur@homiecozie.com', role: 'kitchen_staff', roleLabel: 'Staff Dapur & Bar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: '18:45 WIB' },
  { id: 'usr-7', name: 'Clarissa (Admin Reservasi & Sosmed)', email: 'marketing@homiecozie.com', role: 'marketing', roleLabel: 'Marketing & Admin Sosmed', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: '19:10 WIB' },
  { id: 'usr-8', name: 'Dimas Aditya (Member Gold)', email: 'dimas.aditya@gmail.com', role: 'member', roleLabel: 'Member Pelanggan Setia', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: 'Hari ini 17:30 WIB' },
  { id: 'usr-9', name: 'Tamu Publik (Guest)', email: 'guest@homiecozie.local', role: 'guest', roleLabel: 'Guest / Pengunjung Tanpa Akun', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', status: 'active', lastLogin: 'Sesi Anonim' }
];

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  targetModule: string;
  status: 'SUCCESS' | 'BLOCKED_403' | 'RATE_LIMITED_429' | 'WARN';
  ip: string;
  details: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', timestamp: '19:42:10 WIB', user: 'Pak Hendra (Owner)', role: 'owner', action: 'LOGIN_AUTH_SUCCESS', targetModule: 'MOD-AUTH', status: 'SUCCESS', ip: '180.252.112.4', details: '2FA TOTP Verified via Authenticator App' },
  { id: 'log-2', timestamp: '19:35:44 WIB', user: 'Sinta (Kasir Shift Pagi)', role: 'cashier', action: 'TRANSACTION_PAID_QRIS', targetModule: 'MOD-POS', status: 'SUCCESS', ip: '192.168.1.102', details: 'Table T-03 Bill #HC-9482 (Rp 185.000)' },
  { id: 'log-3', timestamp: '19:22:15 WIB', user: 'Doni (Head Barista)', role: 'kitchen_staff', action: 'ACCESS_ATTEMPT_OMZET', targetModule: 'MOD-ANA', status: 'BLOCKED_403', ip: '192.168.1.105', details: 'Middleware Fail-Fast Gerbang 3: requirePermission("MOD-ANA", "F") rejected' },
  { id: 'log-4', timestamp: '19:10:02 WIB', user: 'Clarissa (Marketing)', role: 'marketing', action: 'BROADCAST_WA_PROMO', targetModule: 'MOD-CRM', status: 'SUCCESS', ip: '182.1.88.29', details: 'Campaign "Weekend Live Music Pitstop" sent to 142 Gold Members' },
  { id: 'log-5', timestamp: '18:55:18 WIB', user: 'Unknown IP', role: 'guest', action: 'AUTH_BRUTE_FORCE_RATE_LIMIT', targetModule: 'MOD-AUTH', status: 'RATE_LIMITED_429', ip: '103.49.221.18', details: '5x Failed password attempt on admin portal. Cooldown 60s applied.' },
  { id: 'log-6', timestamp: '18:40:01 WIB', user: 'Rahmat (Supervisor)', role: 'manager', action: 'INVENTORY_STOCK_UPDATE', targetModule: 'MOD-INV', status: 'SUCCESS', ip: '192.168.1.101', details: 'Received PO #PO-882: 10kg House Blend Arabica Beans' }
];

export const PRD_ROADMAP_SLIDES = [
  {
    phase: 'Fase 1 — Fondasi Digital & Reservasi Otomatis',
    packageTarget: 'Starter / Pro Pack (Rp 1.250.000+)',
    modules: 'Modul A, B, I, L (termasuk Auth & RBAC dasar)',
    problemSolved: 'Brand fragmentation (Kalisari vs Cijantung), reservasi WA manual yang lambat, dan belum punya properti website sendiri.',
    deliverables: [
      'Modul A: Website Interaktif & High-Converting Landing Page dengan identitas hangat 6 tahun Homie Cozie',
      'Modul A: Dual Local SEO Targeting (Mengunci kata kunci Google "cafe Kalisari", "cafe Cijantung", "live music Pasar Rebo")',
      'Modul B: Sistem Reservasi Meja Real-time dengan auto-generate tiket & notifikasi WhatsApp otomatis',
      'Modul A: Menu Digital Interaktif + Showroom Foto HD & Testimonial Rating 4.8 Google',
      'Modul I: Integrasi Widget Ulasan Google Maps Rating 4.8 & Form Feedback Pasca Kunjungan',
      'Modul L: Autentikasi & RBAC Dasar (Staff login & proteksi data omzet dari awal)'
    ],
    kpi: '≥60% Reservasi berpindah ke sistem otomatis; Muncul Top 5 Google Kalisari & Cijantung; 0 insiden kebocoran data.'
  },
  {
    phase: 'Fase 2 — Pertumbuhan & Retensi Pelanggan',
    packageTarget: 'Upsell Tahap 2 (Pro Plus / Growth)',
    modules: 'Modul C, E, H, J',
    problemSolved: 'Data pelanggan 6 tahun belum pernah dipanen, repeat order belum terstruktur, konten IG belum jadi corong reservasi.',
    deliverables: [
      'Modul C: QR Table Ordering (Pelanggan scan barcode di meja, pesan langsung dari HP tanpa antre kasir)',
      'Modul E: Homie Rewards & CRM Club (Kartu poin digital Cozie Points, stamp card otomatis, voucher ultah)',
      'Modul J: Event & Community Hub (Jadwal Live Music & #PITSTOP terhubung ke form RSVP & kuota kursi)',
      'Modul H: Dashboard Analitik Omzet & Traffic Source (Google Search vs Instagram vs Linktree)',
      'Modul E: WhatsApp Broadcast Campaign Generator untuk pelanggan terdaftar'
    ],
    kpi: '≥25% Transaksi dari member terdaftar; Konversi event jadi booking naik 2x lipat.'
  },
  {
    phase: 'Fase 3 — Efisiensi Operasional Kasir & Dapur',
    packageTarget: 'Scale Up (Operations Suite)',
    modules: 'Modul D, F, G',
    problemSolved: 'Pesanan tercecer saat jam ramai, antrean kasir menumpuk, pemakaian bahan baku tidak terukur.',
    deliverables: [
      'Modul D: Integrated Cloud POS & Cashier System dengan dukungan QRIS dinamis & split bill',
      'Modul D: Kitchen Display System (KDS) langsung terhubung dengan pesanan QR meja & kasir',
      'Modul F: Manajemen Inventori & Notifikasi Stok Menipis (Biji kopi, susu, gula aren, COGS control)',
      'Modul G: Manajemen Shift Karyawan & Pembagian Hak Akses (Kasir, Barista, Manajer, Owner)'
    ],
    kpi: 'Waktu penyajian terpangkas 30%; Nol pesanan terlewat saat jam sibuk; Kontrol waste bahan terukur.'
  },
  {
    phase: 'Fase 4 — Multi-Outlet Enterprise',
    packageTarget: 'Ekspansi Jangka Panjang',
    modules: 'Modul K, Perluasan RBAC Multi-Outlet',
    problemSolved: 'Persiapan pembukaan cabang ke-2 atau waralaba dengan database dan kontrol terpusat.',
    deliverables: [
      'Modul K: Multi-Outlet Management Dashboard',
      'Modul K: Cross-outlet loyalty points roaming',
      'Modul K: Centralized purchasing & warehouse control',
      'Modul L: Granular Multi-Branch RBAC & Cross-outlet Auditing'
    ],
    kpi: 'Skalabilitas tanpa batas untuk cabang baru di Jakarta.'
  }
];

// ==========================================
// PUBLIC WEBSITE: GALLERY & AMBIENCE DATA
// ==========================================
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Semi-Outdoor Live Stage & Acoustic Night',
    category: 'music',
    categoryLabel: 'Live Music & Stage',
    imageUrl: '/photos/homie_cozie_006.jpg',
    areaTag: 'Semi-Outdoor Stage',
    description: 'Panggung live music akhir pekan berbalut lampu hangat, tempat sing-along lagu pop & indie favorit.'
  },
  {
    id: 'gal-2',
    title: 'Indoor AC Area & Dedicated WFH Desks',
    category: 'ambience',
    categoryLabel: 'Suasana & Interior',
    imageUrl: '/photos/homie_cozie_052.jpg',
    areaTag: 'Indoor AC Utama',
    description: 'Ruang indoor sejuk berpendingin udara dengan sofa oranye nyaman, colokan di setiap meja, dan Wi-Fi 100 Mbps.'
  },
  {
    id: 'gal-3',
    title: 'Signature Aren Cremosa & Espresso Bar',
    category: 'coffee',
    categoryLabel: 'Kopi & Barista',
    imageUrl: '/photos/homie_cozie_008.jpg',
    areaTag: 'Espresso Bar',
    description: 'Racikan espresso biji Arabika Nusantara berpadu dengan susu gurih dan gula aren murni khas Homie Cozie.'
  },
  {
    id: 'gal-4',
    title: 'Mezzanine VIP Loft (Lantai 2)',
    category: 'ambience',
    categoryLabel: 'Suasana & Interior',
    imageUrl: '/photos/homie_cozie_086.jpg',
    areaTag: 'Mezzanine Floor',
    description: 'Area sofa santai di lantai 2 yang cocok untuk meeting santai, kumpul arisan, atau perayaan ulang tahun.'
  },
  {
    id: 'gal-5',
    title: 'Skillet Loaded Beef Nachos & Bites',
    category: 'food',
    categoryLabel: 'Makanan & Kitchen',
    imageUrl: '/photos/homie_cozie_051.jpg',
    areaTag: 'Kitchen & Dining',
    description: 'Tortilla chips renyah diselimuti daging sapi cincang, lelehan keju mozzarella, potongan tomat, dan jalapeños.'
  },
  {
    id: 'gal-6',
    title: 'Barista Specialty Crafting & Service',
    category: 'coffee',
    categoryLabel: 'Kopi & Barista',
    imageUrl: '/photos/homie_cozie_116.jpg',
    areaTag: 'Barista Station',
    description: 'Kopi diseduh presisi dengan standar barista berpengalaman untuk cita rasa konsisten di setiap cangkir.'
  },
  {
    id: 'gal-7',
    title: 'Cozy Backyard Garden & Open Air',
    category: 'ambience',
    categoryLabel: 'Suasana & Interior',
    imageUrl: '/photos/homie_cozie_013.jpg',
    areaTag: 'Backyard Garden',
    description: 'Taman belakang terbuka yang asri dengan lantai kerikil, pepohonan hijau rindang, dan gemerlap lampu malam.'
  },
  {
    id: 'gal-8',
    title: 'Weekend Acoustic Performance & Sing Along',
    category: 'music',
    categoryLabel: 'Live Music & Stage',
    imageUrl: '/photos/homie_cozie_082.jpg',
    areaTag: 'Semi-Outdoor Stage',
    description: 'Penampilan musik akustik langsung membawakan hits pop & indie favorit akhir pekan.'
  },
  {
    id: 'gal-9',
    title: 'Spaghetti Smoked Beef & Kitchen Mains',
    category: 'food',
    categoryLabel: 'Makanan & Kitchen',
    imageUrl: '/photos/homie_cozie_050.jpg',
    areaTag: 'Kitchen & Dining',
    description: 'Pasta aldente saus gurih kaya rempah disajikan hangat bersama signature iced coffee Homie Cozie.'
  },
  {
    id: 'gal-10',
    title: 'Outdoor Dusk Lighting & Ambience #SerasaRumah',
    category: 'ambience',
    categoryLabel: 'Suasana & Interior',
    imageUrl: '/photos/homie_cozie_025.png',
    areaTag: 'Outdoor Front Garden',
    description: 'Fasad luar kafe 2 lantai saat senja dengan pohon rindang, lampu gantung estetik, dan tagline #SerasaRumah.'
  },
  {
    id: 'gal-11',
    title: 'Warm Gathering & Community Moments',
    category: 'ambience',
    categoryLabel: 'Suasana & Interior',
    imageUrl: '/photos/homie_cozie_085.jpg',
    areaTag: 'Indoor AC Area',
    description: 'Momen kehangatan kumpul keluarga, komunitas, dan reuni sahabat di Homie Cozie Coffee & Kitchen.'
  },
  {
    id: 'gal-12',
    title: 'Nasi Goreng Kampung Rempah Komplit',
    category: 'food',
    categoryLabel: 'Makanan & Kitchen',
    imageUrl: '/photos/homie_cozie_105.jpg',
    areaTag: 'Kitchen Mains',
    description: 'Nasi goreng racikan bumbu khas Pasar Rebo dengan kerupuk, lalapan segar, dan porsi mengenyangkan.'
  }
];

// ==========================================
// PUBLIC WEBSITE: FAQ ACCORDION DATA
// ==========================================
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'fasilitas',
    tag: 'Fasilitas & WFH',
    question: 'Apakah ada colokan listrik dan Wi-Fi cepat untuk bekerja (WFH) atau tugas kuliah?',
    answer: 'Tentu saja! Homie Cozie menyediakan koneksi Wi-Fi berkecepatan 100 Mbps dan colokan listrik di hampir setiap meja, baik di area Indoor AC maupun Mezzanine lantai 2. Tempat ini sangat nyaman untuk WFH, meeting online, ataupun mengerjakan skripsi/tugas.'
  },
  {
    id: 'faq-2',
    category: 'acara',
    tag: 'Live Music & Event',
    question: 'Kapan jadwal Live Music berlangsung dan apakah dikenakan tiket masuk (HTM)?',
    answer: 'Live Music diadakan setiap akhir pekan (Jumat, Sabtu, dan Minggu malam) mulai pukul 19:30 hingga 22:30 WIB dengan genre Pop Akustik, Sing-along 2000s, dan Indie Hits. Masuk gratis (FREE ENTRY / Tanpa HTM), Anda cukup memesan makanan atau minuman favorit.'
  },
  {
    id: 'faq-3',
    category: 'menu',
    tag: 'Halal & Higienis',
    question: 'Apakah seluruh menu makanan dan minuman di Homie Cozie bersertifikat / Halal?',
    answer: 'Ya, 100% menu kami Halal. Kami hanya menggunakan bahan baku segar bersertifikasi halal, daging sapi dan ayam higienis, serta tidak menyajikan minuman beralkohol atau olahan non-halal sama sekali.'
  },
  {
    id: 'faq-4',
    category: 'reservasi',
    tag: 'Booking & Group Gathering',
    question: 'Bagaimana cara reservasi meja untuk rombongan besar, ulang tahun, atau gathering komunitas?',
    answer: 'Anda dapat melakukan reservasi langsung melalui fitur "Reservasi Meja" di website ini atau menghubungi WhatsApp resmi kami. Untuk rombongan di atas 10 orang, Anda bisa memilih area Mezzanine VIP atau Stage Semi-Outdoor dengan opsi paket menu buffet / sharing platter.'
  },
  {
    id: 'faq-5',
    category: 'fasilitas',
    tag: 'Parkir Kendaraan',
    question: 'Bagaimana ketersediaan tempat parkir mobil dan motor di lokasi?',
    answer: 'Kami memiliki area parkir khusus yang luas di pelataran depan kafe (Jl. H. Hasan No. 23) yang mampu menampung puluhan sepeda motor dan mobil dengan penjagaan juru parkir yang aman dan tertib.'
  },
  {
    id: 'faq-6',
    category: 'pembayaran',
    tag: 'Metode Pembayaran',
    question: 'Metode pembayaran apa saja yang diterima di Homie Cozie?',
    answer: 'Kami menerima berbagai metode pembayaran non-tunai dan tunai: QRIS (semua e-wallet seperti GoPay, OVO, ShopeePay, DANA, BCA Mobile, Livin by Mandiri), Kartu Debit/Kredit, serta Uang Tunai di meja kasir.'
  },
  {
    id: 'faq-7',
    category: 'fasilitas',
    tag: 'Smoking Area',
    question: 'Apakah tersedia area khusus merokok (Smoking Area)?',
    answer: 'Ya, kami memiliki area Semi-Outdoor Stage dan Backyard Garden yang sangat ramah bagi perokok dengan sirkulasi udara terbuka yang asri dan tidak mengganggu tamu di area Indoor AC.'
  },
  {
    id: 'faq-8',
    category: 'menu',
    tag: 'Loyalitas & Member VIP',
    question: 'Bagaimana cara bergabung menjadi Member VIP dan apa saja keuntungannya?',
    answer: 'Pendaftaran Member VIP 100% Gratis cukup dengan nomor WhatsApp aktif di menu "Member VIP". Setiap transaksi mengumpulkan Cozie Points dan Digital Stamp (kumpulkan 10 stempel untuk 1 Kopi Susu Signature gratis) serta diskon ulang tahun khusus.'
  }
];

// ==========================================
// PUBLIC WEBSITE: ABOUT STORY & PILLARS
// ==========================================
export const ABOUT_PILLARS: CafeFeature[] = [
  {
    icon: 'Coffee',
    title: '100% Arabika & Resep Khas 6 Tahun',
    description: 'Espresso blend pilihan Nusantara dengan racikan sirup gula aren murni yang telah dicintai warga Kalisari – Cijantung sejak 2020.',
    highlight: 'House Blend Eksklusif'
  },
  {
    icon: 'Utensils',
    title: 'Kitchen Comfort Food Buatan Chef',
    description: 'Dari Nasi Goreng Rempah, Spaghetti Carbonara, hingga Platter Camilan yang porsi pas dan bumbu meresap mantap.',
    highlight: '100% Halal & Fresh'
  },
  {
    icon: 'Music',
    title: 'Panggung Musik & Komunitas Hangat',
    description: 'Panggung live acoustic akhir pekan dan rumah bagi gathering otomotif #PITSTOP serta perayaan hangat keluarga.',
    highlight: 'Live Music Akhir Pekan'
  },
  {
    icon: 'Wifi',
    title: 'Ruang Produktif WFH & 4 Zona Pilihan',
    description: 'Pilihan 4 area: Indoor AC sejuk bercolokan tiap meja, Mezzanine VIP loft, Backyard asri, dan Semi-outdoor stage.',
    highlight: 'Wi-Fi 100 Mbps + AC'
  }
];

export const CAFE_STATS = [
  { value: '6+', label: 'Tahun Perjalanan', sub: 'Sejak 2020 di Kalisari' },
  { value: '50K+', label: 'Cangkir Kopi Tersaji', sub: 'Pelanggan Setia' },
  { value: '4.8★', label: 'Rating Google', sub: '268+ Ulasan Asli' },
  { value: '4', label: 'Zona Suasana Nyaman', sub: 'Indoor, Stage, Loft, Garden' }
];


