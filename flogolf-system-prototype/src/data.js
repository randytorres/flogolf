// Flogolf Lounge Operations Data
// Based on flogolflounge.com business rules

const now = new Date();
const today = now.toISOString().split('T')[0];

const daysAgo = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const daysFromNow = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

// Flogolf Lounge Business Information
export const BUSINESS_INFO = {
  name: 'Flogolf Lounge',
  tagline: 'F.or L.ove O.f Golf',
  address: '880 Broadway, Route 1 North, Saugus, MA 01906',
  phone: '+1 (339) 231-7042',
  email: 'Support@flogolflounge.com',
  technology: 'Golfzon Simulators',
  
  // Business rules
  rules: {
    playersPerBay: { min: 1, recommended: 4, max: 6 },
    minutesPerPlayer: 45,
    resetTime: 5, // minutes reserved for bay clearing
    earlyArrival: 15, // customers should arrive 15 min early
  },
  
  // Time-based pricing (per hour)
  pricing: {
    earlyBird: { 
      hours: '8am-12pm', 
      startHour: 8, 
      endHour: 12,
      rates: { 1: 45, 2: 85, 3: 120 }, // per session
    },
    offPeak: { 
      hours: '12pm-5pm', 
      startHour: 12, 
      endHour: 17,
      rates: { 1: 55, 2: 100, 3: 145 },
    },
    peak: { 
      hours: '5pm-close (Mon-Fri), All Day (Sat-Sun)', 
      startHour: 17,
      endHour: 24,
      rates: { 1: 75, 2: 140, 3: 195 },
    },
    // Saturday/Sunday all day is peak
    weekendPeak: {
      rates: { 1: 75, 2: 140, 3: 195 },
    },
  },
  
  // Golfzon courses available
  courses: [
    'Pebble Beach',
    'Augusta National',
    'St. Andrews',
    'Torrey Pines',
    'Pinehurst No. 2',
    'TPC Sawgrass',
    'Bethpage Black',
    'Paiute',
  ],

  hours: {
    monday: { open: '8am', close: '10pm' },
    tuesday: { open: '8am', close: '10pm' },
    wednesday: { open: '8am', close: '10pm' },
    thursday: { open: '8am', close: '12am' },
    friday: { open: '8am', close: '12am' },
    saturday: { open: '7am', close: '12am' },
    sunday: { open: '7am', close: '10pm' },
  },
};

// Helper to get pricing tier based on day and time
export const getPricingTier = (hour, isWeekend = false) => {
  if (isWeekend) return BUSINESS_INFO.pricing.weekendPeak;
  if (hour >= 8 && hour < 12) return BUSINESS_INFO.pricing.earlyBird;
  if (hour >= 12 && hour < 17) return BUSINESS_INFO.pricing.offPeak;
  return BUSINESS_INFO.pricing.peak;
};

export const MOCK_DATA = {
  Saugus: {
    locationName: 'Saugus',
    address: '880 Broadway, Route 1 North, Saugus, MA 01906',
    
    dashboard: {
      todayBookings: 28,
      eventLeads: 4,
      expiringMemberships: 3,
      lessonFollowUps: 5,
      revenueAtRisk: '$2,850',
      todayRevenue: '$5,420',
      weeklyRevenue: '$32,100',
      monthlyRevenue: '$128,500',
      activeMembers: 187,
      occupancyRate: '82%',
      peakHour: '6:00 PM',
      pendingEventsValue: '$14,200',
    },

    // Bays with realistic session data
    baySchedule: {
      date: today,
      bays: [
        {
          id: 1,
          name: 'Bay 1',
          type: 'Golfzon TWO',
          status: 'active',
          customer: {
            id: 'c14',
            name: 'Sandra Mitchell',
            phone: '(617) 555-0356',
            memberType: 'Gold',
            isMember: true,
            players: 2,
          },
          session: {
            startTime: '12:00 PM',
            endTime: '2:00 PM',
            duration: 120, // minutes
            timeRemaining: 47, // minutes
            paidAmount: 140,
            paymentStatus: 'paid',
            bookingType: 'Member Rate',
          },
          golf: {
            course: 'Pebble Beach',
            currentHole: 14,
            totalHoles: 18,
            gameMode: 'Course Play',
          },
          nextReservation: {
            customerName: null,
            time: null,
          },
        },
        {
          id: 2,
          name: 'Bay 2',
          type: 'Golfzon TWO',
          status: 'available',
          customer: null,
          session: null,
          golf: null,
          nextReservation: {
            customerName: 'David Chen',
            time: '2:00 PM',
            players: 1,
          },
        },
        {
          id: 3,
          name: 'Bay 3',
          type: 'Golfzon TWO',
          status: 'active',
          customer: {
            id: 'c6',
            name: "Patricia O'Brien",
            phone: '(781) 555-0187',
            memberType: 'Gold',
            isMember: true,
            players: 1,
          },
          session: {
            startTime: '1:00 PM',
            endTime: '3:00 PM',
            duration: 120,
            timeRemaining: 88,
            paidAmount: 75,
            paymentStatus: 'paid',
            bookingType: 'Member Rate',
          },
          golf: {
            course: 'Augusta National',
            currentHole: 7,
            totalHoles: 18,
            gameMode: 'Course Play',
          },
          nextReservation: {
            customerName: null,
            time: null,
          },
        },
        {
          id: 4,
          name: 'Bay 4',
          type: 'Golfzon TWO',
          status: 'upcoming',
          customer: {
            id: 'c1',
            name: 'Michael Sullivan',
            phone: '(781) 555-0142',
            memberType: 'Gold',
            isMember: true,
            players: 2,
          },
          session: {
            startTime: '6:00 PM',
            endTime: '8:00 PM',
            duration: 120,
            paidAmount: 140,
            paymentStatus: 'paid',
            bookingType: 'Member Rate',
          },
          golf: null,
          nextReservation: null,
        },
        {
          id: 5,
          name: 'Bay 5',
          type: 'Golfzon TWO',
          status: 'upcoming',
          customer: {
            id: 'c10',
            name: 'Jennifer Park',
            phone: '(617) 555-0334',
            memberType: 'Gold',
            isMember: true,
            players: 3,
          },
          session: {
            startTime: '8:00 PM',
            endTime: '9:00 PM',
            duration: 60,
            paidAmount: 195,
            paymentStatus: 'paid',
            bookingType: 'Peak Rate',
          },
          golf: null,
          nextReservation: null,
        },
        {
          id: 6,
          name: 'Bay 6',
          type: 'Golfzon TWO',
          status: 'upcoming',
          customer: {
            id: 'c8',
            name: 'Amanda Foster',
            phone: '(781) 555-0178',
            memberType: 'Silver',
            isMember: true,
            players: 4,
          },
          session: {
            startTime: '7:00 PM',
            endTime: '9:00 PM',
            duration: 120,
            paidAmount: 240,
            paymentStatus: 'paid',
            bookingType: 'Silver Member',
          },
          golf: null,
          nextReservation: null,
        },
      ],
      
      // Available slots for quick booking
      availableSlots: [
        { bayId: 2, time: '1:30 PM', endTime: '2:30 PM', duration: 60, price: 55, available: true },
        { bayId: 2, time: '2:00 PM', endTime: '3:00 PM', duration: 60, price: 55, available: true },
        { bayId: 2, time: '2:30 PM', endTime: '3:30 PM', duration: 60, price: 55, available: true },
        { bayId: 2, time: '3:00 PM', endTime: '5:00 PM', duration: 120, price: 100, available: true },
        { bayId: 2, time: '5:00 PM', endTime: '6:30 PM', duration: 90, price: 105, available: true },
        { bayId: 4, time: '2:00 PM', endTime: '3:00 PM', duration: 60, price: 55, available: true },
        { bayId: 4, time: '3:00 PM', endTime: '4:00 PM', duration: 60, price: 55, available: true },
        { bayId: 5, time: '1:00 PM', endTime: '2:00 PM', duration: 60, price: 55, available: true },
        { bayId: 5, time: '2:00 PM', endTime: '3:30 PM', duration: 90, price: 77, available: true },
        { bayId: 6, time: '1:00 PM', endTime: '3:00 PM', duration: 120, price: 100, available: true },
      ],
    },

    // Updated customer data with contact info and player preferences
    customers: [
      {
        id: "c1",
        name: "Michael Sullivan",
        email: "michael.sullivan@email.com",
        phone: "(781) 555-0142",
        status: "Gold Member",
        memberSince: "2024-10-15",
        memberType: "Annual",
        memberExpiry: "2025-10-15",
        lifetimeSpend: 4200,
        avgSpendPerVisit: 85,
        visitsThisMonth: 6,
        lastVisit: daysAgo(1),
        handicap: 14,
        preferredBay: 4,
        typicalPlayers: 2,
        golfzonApp: true,
        arrivalBuffer: 15,
        tags: ["High Value", "Lesson Taker", "League Player"],
        automationStatus: "Renewal Nudge Queued (Expiring in 14 days)",
      },
      {
        id: "c2",
        name: "Sarah Jenkins",
        email: "sarah.j@techcorp.com",
        phone: "(617) 555-0198",
        status: "Non-Member",
        memberSince: null,
        memberType: null,
        memberExpiry: null,
        lifetimeSpend: 850,
        avgSpendPerVisit: 65,
        visitsThisMonth: 0,
        lastVisit: daysAgo(28),
        handicap: null,
        preferredBay: null,
        typicalPlayers: 4,
        golfzonApp: false,
        arrivalBuffer: 10,
        tags: ["Event Host", "Flight Risk", "Corporate"],
        automationStatus: "Win-back Campaign Active (Day 12)",
      },
      {
        id: "c6",
        name: "Patricia O'Brien",
        email: "pobrien@email.com",
        phone: "(781) 555-0187",
        status: "Gold Member",
        memberSince: "2024-06-10",
        memberType: "Annual",
        memberExpiry: "2025-06-10",
        lifetimeSpend: 5200,
        avgSpendPerVisit: 95,
        visitsThisMonth: 5,
        lastVisit: daysAgo(4),
        handicap: 10,
        preferredBay: 3,
        typicalPlayers: 1,
        golfzonApp: true,
        arrivalBuffer: 15,
        tags: ["VIP", "High Value", "Lesson Taker"],
        automationStatus: "VIP Treatment Queue",
      },
      {
        id: "c10",
        name: "Jennifer Park",
        email: "jpark@healthcare.org",
        phone: "(617) 555-0334",
        status: "Gold Member",
        memberSince: "2024-09-15",
        memberType: "Annual",
        memberExpiry: "2025-09-15",
        lifetimeSpend: 4800,
        avgSpendPerVisit: 88,
        visitsThisMonth: 7,
        lastVisit: daysAgo(0),
        handicap: 16,
        preferredBay: 5,
        typicalPlayers: 3,
        golfzonApp: true,
        arrivalBuffer: 15,
        tags: ["High Value", "Frequent", "Gift Buyer"],
        automationStatus: "Active",
      },
      {
        id: "c8",
        name: "Amanda Foster",
        email: "afoster@creative.co",
        phone: "(781) 555-0178",
        status: "Silver Member",
        memberSince: "2025-01-05",
        memberType: "Quarterly",
        memberExpiry: "2025-04-05",
        lifetimeSpend: 1450,
        avgSpendPerVisit: 52,
        visitsThisMonth: 4,
        lastVisit: daysAgo(2),
        handicap: 24,
        preferredBay: 4,
        typicalPlayers: 4,
        golfzonApp: false,
        arrivalBuffer: 10,
        tags: ["League Player", "Lesson Taker"],
        automationStatus: "Active",
      },
      {
        id: "c14",
        name: "Sandra Mitchell",
        email: "smitchell@realtor.com",
        phone: "(617) 555-0356",
        status: "Gold Member",
        memberSince: "2024-07-20",
        memberType: "Annual",
        memberExpiry: "2025-07-20",
        lifetimeSpend: 6100,
        avgSpendPerVisit: 110,
        visitsThisMonth: 6,
        lastVisit: daysAgo(1),
        handicap: 10,
        preferredBay: 1,
        typicalPlayers: 2,
        golfzonApp: true,
        arrivalBuffer: 15,
        tags: ["VIP", "High Value", "Event Host"],
        automationStatus: "VIP Treatment Queue",
      },
    ],

    // Events
    events: [
      { 
        id: "e1", 
        name: "TechCorp Holiday Party", 
        contact: "Sarah Jenkins",
        email: "sarah.j@techcorp.com",
        phone: "(617) 555-0198",
        stage: "Quote", 
        value: "$4,500",
        valueNum: 4500,
        date: "2025-12-12",
        guests: 24,
        hours: 3,
        notes: "24 people, all 6 bays reserved. Food & beverage included.",
        lastContact: daysAgo(3),
      },
      { 
        id: "e2", 
        name: "O'Connor 40th Birthday", 
        contact: "Pete O'Connor",
        email: "pete.o@email.com",
        phone: "(781) 555-0223",
        stage: "Deposit", 
        value: "$1,800",
        valueNum: 1800,
        date: "2025-11-20",
        guests: 16,
        hours: 2,
        notes: "Deposit received. Food ordered.",
        lastContact: daysAgo(1),
      },
      { 
        id: "e3", 
        name: "Local Agency Offsite", 
        contact: "Amanda Lee",
        email: "alee@agency.com",
        stage: "Inquiry", 
        value: "$3,200",
        valueNum: 3200,
        date: "2026-01-15",
        guests: 18,
        hours: 3,
        notes: "Marketing agency. Weekend preferred.",
        lastContact: daysAgo(5),
      },
    ],

    // League standings
    leagueStandings: [
      { rank: 1, name: "Patricia O'Brien", team: 'Eagles', points: 142, handicap: 10, record: '8-2' },
      { rank: 2, name: 'Jennifer Park', team: 'Hawks', points: 138, handicap: 16, record: '7-3' },
      { rank: 3, name: 'Michael Sullivan', team: 'Eagles', points: 124, handicap: 14, record: '6-4' },
      { rank: 4, name: 'Amanda Foster', team: 'Hawks', points: 118, handicap: 24, record: '5-5' },
      { rank: 5, name: 'Sandra Mitchell', team: 'Falcons', points: 112, handicap: 10, record: '5-5' },
    ],

    // Automations
    automations: [
      { id: "a1", name: "Membership Activation", trigger: "Purchase", actions: ["Welcome Email", "Bay Credit Added", "Staff Alert"], active: 42, color: "#22c55e" },
      { id: "a2", name: "Lesson Follow-up", trigger: "24h Post-Lesson", actions: ["Feedback Request", "Upsell Package"], active: 18, color: "#d4af37" },
      { id: "a3", name: "No-Show Prevention", trigger: "2h Pre-Booking", actions: ["SMS Reminder", "Check-in Link"], active: 64, color: "#3b82f6" },
    ],
  },

  Burlington: {
    locationName: 'Burlington',
    address: '300 Mall Rd, Burlington, MA 01803',
    
    dashboard: {
      todayBookings: 12,
      eventLeads: 2,
      expiringMemberships: 0,
      lessonFollowUps: 1,
      revenueAtRisk: "$450",
      todayRevenue: "$2,100",
      weeklyRevenue: "$14,200",
      monthlyRevenue: "$58,000",
      activeMembers: 84,
      occupancyRate: '52%',
      peakHour: '7:00 PM',
    },

    baySchedule: {
      date: today,
      bays: [
        { id: 1, name: 'Bay 1', type: 'Golfzon TWO', status: 'available', customer: null, session: null, golf: null, nextReservation: null },
        { id: 2, name: 'Bay 2', type: 'Golfzon TWO', status: 'available', customer: null, session: null, golf: null, nextReservation: null },
        { id: 3, name: 'Bay 3', type: 'Golfzon TWO', status: 'available', customer: null, session: null, golf: null, nextReservation: null },
        { id: 4, name: 'Bay 4', type: 'Golfzon TWO', status: 'available', customer: null, session: null, golf: null, nextReservation: null },
        { id: 5, name: 'Bay 5', type: 'Golfzon TWO', status: 'available', customer: null, session: null, golf: null, nextReservation: null },
      ],
      availableSlots: [
        { bayId: 1, time: '1:00 PM', endTime: '2:00 PM', duration: 60, price: 55, available: true },
        { bayId: 2, time: '2:00 PM', endTime: '4:00 PM', duration: 120, price: 100, available: true },
        { bayId: 3, time: '3:00 PM', endTime: '4:00 PM', duration: 60, price: 55, available: true },
      ],
    },

    customers: [
      {
        id: "c16",
        name: "David Chen",
        email: "dchen@startup.io",
        phone: "(617) 555-0311",
        status: "Bronze Member",
        memberSince: "2025-02-15",
        memberType: "Monthly",
        memberExpiry: "2025-03-15",
        lifetimeSpend: 1100,
        typicalPlayers: 1,
        golfzonApp: true,
        tags: ["New Member"],
        automationStatus: "Upgrade Campaign (Day 7)",
      },
    ],

    events: [
      { id: "e4", name: "Startup Team Building", contact: "Mark Foster", stage: "Booked", value: "$4,200", valueNum: 4200, date: "2025-04-05", guests: 20, hours: 3 },
    ],

    automations: [
      { id: "a1", name: "Membership Activation", trigger: "Purchase", actions: ["Welcome Email", "Bay Credit Added"], active: 15, color: "#22c55e" },
    ],
  },
};

// Activity feed messages
export const ACTIVITY_MESSAGES = [
  { type: 'BOOKING', message: 'Sandra Mitchell checked in at Bay 1' },
  { type: 'MEMBERSHIP', message: 'David Chen upgraded to Silver Member' },
  { type: 'EVENT', message: 'TechCorp confirmed Holiday Party ($4,500)' },
  { type: 'LESSON', message: 'PGA Pro Dave completed lesson with Michael S.' },
  { type: 'PAYMENT', message: 'Deposit received: O\'Connor 40th ($600)' },
  { type: 'BOOKING', message: 'Jennifer Park party of 3 checked in at Bay 5' },
  { type: 'REVIEW', message: 'New 5-star review from Patricia O\'Brien' },
  { type: 'BOOKING', message: 'Amanda Foster party of 4 checked in at Bay 6' },
  { type: 'BOOKING', message: 'Walk-in added to Bay 2 waitlist' },
  { type: 'PAYMENT', message: 'Gift card purchased: $200' },
  { type: 'BOOKING', message: 'James Thorne extended session by 30 min' },
  { type: 'LESSON', message: 'Beginner clinic booked for Saturday 10am' },
];

// F&B Menu Data
export const FN_B_MENU = {
  categories: [
    { id: 'cocktails', name: 'Signature Cocktails', icon: 'Cocktail' },
    { id: 'beer', name: 'Beer & Seltzer', icon: 'Cocktail' },
    { id: 'wine', name: 'Wine', icon: 'Cocktail' },
    { id: 'non_alcoholic', name: 'Non-Alcoholic', icon: 'Cocktail' },
    { id: 'shareables', name: 'Shareables', icon: 'Cocktail' },
    { id: 'mains', name: 'Mains', icon: 'Cocktail' },
    { id: 'desserts', name: 'Desserts', icon: 'Cocktail' },
  ],
  items: [
    // Signature Cocktails
    { id: 'fnb1', name: 'The Fairway', category: 'cocktails', price: 16, description: 'Bourbon, honey, lemon, thyme', prepTime: 4, popular: true },
    { id: 'fnb2', name: 'Birdie Juice', category: 'cocktails', price: 15, description: 'Vodka, elderflower, cucumber, lime', prepTime: 4, popular: true },
    { id: 'fnb3', name: 'The Sand Trap', category: 'cocktails', price: 17, description: 'Mezcal, pineapple, jalapeño, agave', prepTime: 5, popular: false },
    { id: 'fnb4', name: 'Eagle\'s Nest', category: 'cocktails', price: 18, description: 'Gin, St. Germain, grapefruit, rosemary', prepTime: 4, popular: false },
    { id: 'fnb5', name: 'The Back Nine', category: 'cocktails', price: 16, description: 'Rum, passion fruit, coconut, lime', prepTime: 4, popular: true },
    { id: 'fnb6', name: 'Old Fashioned', category: 'cocktails', price: 15, description: 'Bourbon, bitters, orange, cherry', prepTime: 3, popular: false },
    { id: 'fnb7', name: 'Espresso Martini', category: 'cocktails', price: 17, description: 'Vodka, Kahlúa, espresso, vanilla', prepTime: 4, popular: true },
    { id: 'fnb8', name: 'Moscow Mule', category: 'cocktails', price: 14, description: 'Vodka, ginger beer, lime', prepTime: 3, popular: false },

    // Beer & Seltzer
    { id: 'fnb9', name: 'Draft IPA', category: 'beer', price: 9, description: 'Local craft IPA, 16oz', prepTime: 1, popular: true },
    { id: 'fnb10', name: 'Draft Lager', category: 'beer', price: 8, description: 'Crisp domestic lager, 16oz', prepTime: 1, popular: false },
    { id: 'fnb11', name: 'White Claw', category: 'beer', price: 7, description: 'Assorted flavors', prepTime: 1, popular: false },
    { id: 'fnb12', name: 'Corona', category: 'beer', price: 7, description: 'Mexican lager', prepTime: 1, popular: false },
    { id: 'fnb13', name: 'Guinness', category: 'beer', price: 9, description: 'Irish stout, 16oz', prepTime: 2, popular: false },

    // Wine
    { id: 'fnb14', name: 'House Red', category: 'wine', price: 12, description: 'Cabernet Sauvignon, 6oz', prepTime: 1, popular: false },
    { id: 'fnb15', name: 'House White', category: 'wine', price: 12, description: 'Sauvignon Blanc, 6oz', prepTime: 1, popular: true },
    { id: 'fnb16', name: 'Rosé', category: 'wine', price: 13, description: 'Provence rosé, 6oz', prepTime: 1, popular: false },
    { id: 'fnb17', name: 'Prosecco', category: 'wine', price: 11, description: 'Italian sparkling, 5oz', prepTime: 1, popular: false },

    // Non-Alcoholic
    { id: 'fnb18', name: 'Arnold Palmer', category: 'non_alcoholic', price: 6, description: 'Fresh iced tea & lemonade', prepTime: 2, popular: true },
    { id: 'fnb19', name: 'Craft Soda', category: 'non_alcoholic', price: 5, description: 'Assorted craft sodas', prepTime: 1, popular: false },
    { id: 'fnb20', name: 'Espresso', category: 'non_alcoholic', price: 5, description: 'Double shot', prepTime: 2, popular: false },
    { id: 'fnb21', name: 'Cappuccino', category: 'non_alcoholic', price: 6, description: 'Espresso with steamed milk', prepTime: 3, popular: false },
    { id: 'fnb22', name: 'Sparkling Water', category: 'non_alcoholic', price: 4, description: 'San Pellegrino, 500ml', prepTime: 1, popular: false },

    // Shareables
    { id: 'fnb23', name: 'Wagyu Sliders', category: 'shareables', price: 18, description: '3 sliders, truffle aioli, brioche', prepTime: 12, popular: true },
    { id: 'fnb24', name: 'Crispy Calamari', category: 'shareables', price: 16, description: 'Lemon pepper, marinara, aioli', prepTime: 10, popular: true },
    { id: 'fnb25', name: 'Wings', category: 'shareables', price: 15, description: '8 wings, choice of buffalo or BBQ', prepTime: 14, popular: false },
    { id: 'fnb26', name: 'Loaded Nachos', category: 'shareables', price: 14, description: 'Cheddar, jalapeño, pico, sour cream', prepTime: 8, popular: false },
    { id: 'fnb27', name: 'Truffle Fries', category: 'shareables', price: 12, description: 'Parmesan, truffle oil, herbs', prepTime: 8, popular: true },
    { id: 'fnb28', name: 'Charcuterie Board', category: 'shareables', price: 24, description: 'Cured meats, cheeses, crackers, fruit', prepTime: 6, popular: false },
    { id: 'fnb29', name: 'Guacamole & Chips', category: 'shareables', price: 13, description: 'House-made, warm tortilla chips', prepTime: 5, popular: false },

    // Mains
    { id: 'fnb30', name: 'Smash Burger', category: 'mains', price: 17, description: 'Double patty, American, special sauce, brioche', prepTime: 12, popular: true },
    { id: 'fnb31', name: 'Chicken Sandwich', category: 'mains', price: 16, description: 'Crispy chicken, slaw, pickles, spicy mayo', prepTime: 12, popular: false },
    { id: 'fnb32', name: 'Fish Tacos', category: 'mains', price: 16, description: 'Beer-battered cod, chipotle crema, slaw', prepTime: 10, popular: false },
    { id: 'fnb33', name: 'Grilled Chicken Caesar', category: 'mains', price: 15, description: 'Romaine, parmesan, croutons, house dressing', prepTime: 8, popular: false },
    { id: 'fnb34', name: 'Steak Tips', category: 'mains', price: 22, description: 'Marinated sirloin, mashed potato, asparagus', prepTime: 15, popular: true },

    // Desserts
    { id: 'fnb35', name: 'Brownie Sundae', category: 'desserts', price: 12, description: 'Warm brownie, vanilla ice cream, chocolate', prepTime: 4, popular: true },
    { id: 'fnb36', name: 'Cheesecake', category: 'desserts', price: 11, description: 'NY style, berry compote', prepTime: 2, popular: false },
  ],
};

// Active orders (demo data)
export const FN_B_ACTIVE_ORDERS = [
  {
    id: 'ord1',
    bayId: 1,
    customerName: 'Sandra Mitchell',
    status: 'preparing',
    items: [
      { name: 'The Fairway', qty: 2, price: 16, category: 'cocktails' },
      { name: 'Truffle Fries', qty: 1, price: 12, category: 'shareables' },
    ],
    total: 44,
    orderedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedReady: 4,
  },
  {
    id: 'ord2',
    bayId: 3,
    customerName: "Patricia O'Brien",
    status: 'ready',
    items: [
      { name: 'Espresso Martini', qty: 1, price: 17, category: 'cocktails' },
    ],
    total: 17,
    orderedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    estimatedReady: 0,
  },
  {
    id: 'ord3',
    bayId: 6,
    customerName: 'Amanda Foster',
    status: 'preparing',
    items: [
      { name: 'Draft IPA', qty: 4, price: 9, category: 'beer' },
      { name: 'Wings', qty: 1, price: 15, category: 'shareables' },
      { name: 'Wagyu Sliders', qty: 1, price: 18, category: 'shareables' },
    ],
    total: 69,
    orderedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    estimatedReady: 11,
  },
];

// Completed orders for today (demo)
export const FN_B_COMPLETED_ORDERS = [
  { id: 'ord4', bayId: 1, customerName: 'Sandra Mitchell', total: 38, itemCount: 3, time: '1:15 PM' },
  { id: 'ord5', bayId: 5, customerName: 'Jennifer Park', total: 52, itemCount: 4, time: '12:45 PM' },
  { id: 'ord6', bayId: 4, customerName: 'Michael Sullivan', total: 29, itemCount: 2, time: '12:30 PM' },
  { id: 'ord7', bayId: 3, customerName: "Patricia O'Brien", total: 41, itemCount: 3, time: '11:50 AM' },
];
