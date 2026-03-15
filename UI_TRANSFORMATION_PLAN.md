# FloGolf System UI Transformation Plan

> Complete overhaul strategy to transform the generic dashboard into a premium, golf-specific command center that excites founders.

---

## Executive Summary

The current prototype has solid functionality but feels like a generic SaaS template. This plan outlines a comprehensive transformation to create a **premium indoor golf venue management system** that looks and feels like stepping into a luxury golf simulator lounge.

**Key Transformation Areas:**
1. Visual Identity - Deeper, richer color system with golf-specific language
2. Typography - Editorial serif (Crimson Pro) + modern UI (Inter) + monospace numbers
3. Components - Leaderboard-style stat cards, live activity feeds, visual gauges
4. Layout - Clear visual hierarchy with dramatic contrast
5. Motion - Entrance animations, micro-interactions, page transitions
6. Golf-Specific Elements - Bay visualizations, course metaphors, scoreboard styling

---

## Phase 1: Design System Foundation

### 1.1 Enhanced Color System

```css
:root {
  /* Core Brand - Richer, More Premium */
  --color-flomarine: #0d2f0a;        /* Deeper, more mysterious green */
  --color-forest: #1a4725;            /* Forest depth */
  --color-forest-light: #2d5a3a;      /* For gradients */
  
  /* Brass/Gold - More Luxurious */
  --color-brass: #d4af37;             /* True gold */
  --color-brass-light: #e8c547;       /* Highlight gold */
  --color-brass-dark: #b8941f;        /* Shadow gold */
  
  /* Cream/Neutral - Warmer */
  --color-cream: #faf8f5;             /* Warm paper */
  --color-cream-dark: #f0ebe3;        /* Scorecard beige */
  --color-surface: #ffffff;
  
  /* Accent Colors - Golf Inspired */
  --color-tee-box: #87ceeb;           /* Sky blue accent */
  --color-fairway: #4a7c59;           /* Fairway green */
  --color-rough: #8fbc8f;             /* Light green */
  
  /* Functional */
  --color-success: #22c55e;           /* Vibrant success */
  --color-warning: #f59e0b;           /* Amber warning */
  --color-danger: #ef4444;            /* Alert red */
  
  /* Gradients */
  --gradient-marine: linear-gradient(135deg, var(--color-flomarine) 0%, var(--color-forest) 100%);
  --gradient-gold: linear-gradient(135deg, var(--color-brass) 0%, var(--color-brass-light) 100%);
  --gradient-card: linear-gradient(180deg, #ffffff 0%, #faf8f5 100%);
}
```

### 1.2 Typography System

**Font Stack:**
- **Display**: Crimson Pro (serif) - for headlines, editorial feel
- **UI**: Inter (sans-serif) - for body text, buttons
- **Numbers**: JetBrains Mono - for stats, scoreboard feel

**Type Scale:**
- `--text-xs: 0.75rem` - Labels, timestamps
- `--text-sm: 0.875rem` - Secondary text
- `--text-base: 1rem` - Body
- `--text-lg: 1.125rem` - Emphasis
- `--text-xl: 1.5rem` - Card titles
- `--text-2xl: 2rem` - Section headers
- `--text-3xl: 3rem` - Hero numbers
- `--text-4xl: 4rem` - Dashboard stats

### 1.3 CSS Custom Properties

```css
:root {
  /* Layout */
  --sidebar-width: 280px;
  --header-height: 72px;
  --card-radius: 16px;
  --button-radius: 10px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --shadow-xl: 0 24px 60px rgba(0,0,0,0.15);
  --shadow-glow: 0 0 40px rgba(212, 175, 55, 0.15);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Phase 2: Core Component Transformations

### 2.1 StatCard (Leaderboard Style)

**Design:**
```
┌─────────────────────────────────────┐
│ ◆ TODAY'S BOOKINGS                  │  ← Icon + Small caps label
│                                     │
│           24                        │  ← Massive number, mono font
│          ▲ +12%                     │  ← Trend indicator
│                                     │
│    vs 21 yesterday                  │  ← Context
│                                     │
│ ████████████████████░░░░            │  ← Mini progress/sparkline
│ Peak: 7PM                           │
└─────────────────────────────────────┘
```

**Features:**
- Large monospace numbers
- Visual trend indicators (▲▼)
- Optional sparkline chart
- Hover lift effect with brass border glow
- Staggered entrance animation

### 2.2 LiveActivityFeed

**Design:**
```
┌─────────────────────────────────────┐
│ ● LIVE ACTIVITY                     │  ← Pulsing indicator
├─────────────────────────────────────────────────────┤
│ 🏌️ Michael S. booked Bay 4    2m ago              │
│ ⭐ Sarah J. became Gold Member  5m ago              │
│ 📧 TechCorp event inquiry       12m ago             │
│ 💰 New $1,200 deposit received  18m ago             │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Pulsing green "LIVE" indicator
- Auto-scrolling activity stream
- Icon-coded activity types
- Relative timestamps
- Hover to pause

### 2.3 RevenueAtRisk Card

**Design:**
```
┌─────────────────────────────────────┐
│ ⚠️ REVENUE AT RISK                  │
│                                     │
│      ╭──────────────────╮           │
│     ╱     $1,250         ╲          │
│    │     At Risk Today    │          │
│     ╲                     ╱         │
│      ╰──────────────────╯           │
│                                     │
│  2 expiring memberships             │
│  3 unpaid invoices                  │
│                                     │
│  [Take Action] [View Details]       │
└─────────────────────────────────────┘
```

**Features:**
- Visual gauge showing risk level
- Breakdown of risk sources
- Prominent action button
- Color-coded severity

### 2.4 CustomerJourneyTimeline

**Design:**
```
CUSTOMER LIFECYCLE - Hole 3 of 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⛳     🏌️      📚      ⭐      🏆
Hole 1  Hole 2  Hole 3  Hole 4  Hole 5
Inquiry Booking Lesson  Member  League
  ●──────●──────○───────○───────○
  Done   Done   Next    Future  Future
         
Par: 14 days | Current: 7 days | ✅ On Track
```

**Features:**
- Golf course metaphor (holes)
- Visual progress through stages
- Par/current pace indicator
- Status indicators (done/next/future)

### 2.5 ActionCard

**Design:**
```
┌─────────────────────────────────────┐
│ ⚠️ ATTENTION REQUIRED               │
├─────────────────────────────────────┤
│                                     │
│ Sarah Jenkins                       │
│ Win-back campaign: Day 12           │
│ Last booking: Sep 22                │
│ Risk: $850 annual value             │
│                                     │
│ [Call Customer] [Send Offer] [✓]    │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Urgency-based color coding
- Clear action buttons
- Value at risk display
- One-click actions

### 2.6 BayStatusVisualization

**Design:**
```
LIVE BAY STATUS - Saugus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bay 1   Bay 2   Bay 3   Bay 4   Bay 5   Bay 6
█████   ████░   ░░░░░   █████   ████░   ░░░░░
Smith   Lee    [BOOK]   Chen    Park   [BOOK]
45m     15m    NOW      60m     30m     NOW
left    left            left    left

[6 Total] [4 Active] [2 Available] [View Schedule]
```

**Features:**
- Visual bay occupancy
- Time remaining indicator
- Click to book available bays
- Real-time updates simulation

### 2.7 RevenueBreakdown

**Design:**
```
TODAY'S REVENUE: $4,850
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bookings    ████████████████████████  $2,400  49%
Memberships ████████████              $1,200  25%
Lessons     ██████                     $600   12%
Events      █████                      $450    9%
Retail      ██                         $200    4%

[View Detailed Report] [Export CSV]
```

**Features:**
- Horizontal bar chart
- Percentage breakdown
- Click to drill down
- Export functionality

### 2.8 WorkflowCard

**Design:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Membership Activation        ●●●●●●●●●●  42 active   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Trigger: Purchase                                      │
│     ↓                                                   │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐  │
│  │ Welcome │ → │ Credits │ → │  Alert  │ → │ Complete│  │
│  │  Email  │   │  Added  │   │  Staff  │   │         │  │
│  └─────────┘   └─────────┘   └─────────┘   └────────┘  │
│                                                         │
│  Last run: 2 min ago    Success: 98%    Avg time: 45s   │
│                                                         │
│  [View Logs] [Edit Workflow] [Duplicate to Burlington]  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Visual workflow diagram
- Active count indicator
- Performance metrics
- Location sync capability

---

## Phase 3: View Transformations

### 3.1 Owner Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FLOLF SYSTEM                                          Saugus    [🔔] [⚙️] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  ● LIVE ACTIVITY            │  │  ⚠️ REVENUE AT RISK               │  │
│  │                             │  │                                     │  │
│  │  🏌️ New booking: Bay 4      │  │        ╭──────────────╮             │  │
│  │     Michael S. - 2m ago     │  │       ╱   $1,250      ╲            │  │
│  │                             │  │      │   At Risk       │            │  │
│  │  ⭐ Gold Member joined      │  │       ╲                ╱            │  │
│  │     Sarah J. - 5m ago       │  │        ╰──────────────╯             │  │
│  │                             │  │                                     │  │
│  │  📧 Event inquiry           │  │  2 expiring memberships             │  │
│  │     TechCorp - 12m ago      │  │  3 unpaid invoices                  │  │
│  │                             │  │                                     │  │
│  └─────────────────────────────┘  │  [Take Action] [View Details]       │  │
│                                   └─────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │   24     │ │  $1,250  │ │    3     │ │    2     │ │    4     │         │
│  │ BOOKINGS │ │   RISK   │ │  LEADS   │ │  EXPIRE  │ │ LESSONS  │         │
│  │  ▲ +12%  │ │  ▼ -5%   │ │  ▲ +1   │ │  ⚠️ Act  │ │  → Send  │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  REQUIRES IMMEDIATE ACTION                                          │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │ ⚠️ Sarah J. │  │ 🔄 Mike S.  │  │ 📋 League   │  │ 💰 Inv.   │  │   │
│  │  │ Win-back    │  │ Renewal     │  │ Pairings    │  │ Overdue   │  │   │
│  │  │ Day 12      │  │ Exp 7 days  │  │ Week 4      │  │ 3 clients │  │   │
│  │  │             │  │             │  │             │  │           │  │   │
│  │  │[Call] [Email│  │[Send Offer] │  │[Generate]   │  │[Send Rem] │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  TODAY'S REVENUE: $4,850    │  │  LIVE BAY STATUS                    │  │
│  │                             │  │                                     │  │
│  │  Bookings    ████████████   │  │  B1  B2  B3  B4  B5  B6            │  │
│  │  Memberships ██████         │  │  ██   ██  ░░  ██  ██  ░░           │  │
│  │  Lessons     ███            │  │  45m  15m NOW 60m 30m NOW          │  │
│  │  Events      ██             │  │                                     │  │
│  │  Retail      █              │  │  [4 Active] [2 Available]          │  │
│  │                             │  │                                     │  │
│  └─────────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Customer 360 Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CUSTOMER 360                                            [✏️] [📧] [📞]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────┐  ┌───────────────────────────────────────┐   │
│  │                          │  │  LIFETIME VALUE                       │   │
│  │      ┌──────────┐        │  │  ═══════════════════════════════════  │   │
│  │     /   👤     \       │  │                                       │   │
│  │    │   Michael    │      │  │         $4,200                      │   │
│  │    │   Sullivan   │      │  │         ─────────                   │   │
│  │     \   ⭐⭐⭐    /       │  │         Top 5% of customers          │   │
│  │      └──────────┘        │  │                                       │   │
│  │                          │  │  [View Full History]                  │   │
│  │  Michael Sullivan        │  └───────────────────────────────────────┘   │
│  │  ⭐ Gold Member          │                                             │
│  │  Since: October 2024     │  ┌───────────────────────────────────────┐   │
│  │                          │  │  UPCOMING                             │   │
│  │  Status: ACTIVE ✅       │  │  ───────────────────────────────────  │   │
│  │  Last Visit: 2 days ago  │  │                                       │   │
│  │                          │  │  🏌️ TODAY 6:00 PM                     │   │
│  │  ┌──────────────────┐    │  │     Bay 4 - 2 hours                   │   │
│  │  │ 💬 Send Message  │    │  │     ⏰ Reminder: 4:00 PM              │   │
│  │  └──────────────────┘    │  │                                       │   │
│  │  ┌──────────────────┐    │  │  📅 Nov 15, 2:00 PM                   │   │
│  │  │ 📅 Book Again    │    │  │     Lesson with Dave                  │   │
│  │  └──────────────────┘    │  │     Short Game Focus                  │   │
│  │                          │  │                                       │   │
│  └──────────────────────────┘  └───────────────────────────────────────┘   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  CUSTOMER JOURNEY - Hole 3 of 5                                       │ │
│  │  ═══════════════════════════════════════════════════════════════════  │ │
│  │                                                                       │ │
│  │   ⛳      🏌️       📚       ⭐       🏆                               │ │
│  │  Hole 1  Hole 2   Hole 3   Hole 4   Hole 5                           │ │
│  │  Inquiry Booking  Lesson   Member   League                           │ │
│  │   ●───────●───────○────────○────────○                                │ │
│  │   Done    Done    Next    Future   Future                            │ │
│  │                                                                       │ │
│  │  Par: 14 days | Current pace: 7 days | ✅ On Track                   │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  RECENT ACTIVITY                                                      │ │
│  │  ═══════════════════════════════════════════════════════════════════  │ │
│  │                                                                       │ │
│  │  ●───────●───────●───────○───────○                                   │ │
│  │  │       │       │       │       │                                   │ │
│  │  ▼       ▼       ▼       │       │                                   │ │
│  │  Oct 15  Oct 12  Oct 8   Next    Future                              │ │
│  │  $120    $85      $45    Lesson  League                              │ │
│  │  Bay 4   Lesson   Week 3  Pending  TBD                               │ │
│  │  2 hrs   1 hr     Scramble                                            │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Event Pipeline Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EVENT PIPELINE                                    [+ New] [Filter ▼] [📊] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  💰 TOTAL PIPELINE VALUE: $7,500        3 events closing this week          │
│  ████████████████████████████████████░░░░░░░░░░  68% to monthly goal        │
│                                                                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐             │
│  │   🔥 INQUIRY │   💰 QUOTE   │   ✅ DEPOSIT │   📅 BOOKED  │             │
│  │      3       │      1       │      1       │      0       │             │
│  │    $8,200    │    $3,500    │    $1,200    │      $0      │             │
│  ├──────────────┼──────────────┼──────────────┼──────────────┤             │
│  │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │              │             │
│  │ │TechCorp  │ │ │O'Connor  │ │ │Agency    │ │              │             │
│  │ │Holiday   │ │ │40th Bday │ │ │Offsite   │ │              │             │
│  │ │          │ │ │⭐ HOT     │ │ │✅ Paid   │ │              │             │
│  │ │$3,500    │ │ │          │ │ │          │ │              │             │
│  │ │Dec 12    │ │ │$1,200    │ │ │$1,200    │ │              │             │
│  │ │          │ │ │Nov 20    │ │ │Jan 15    │ │              │             │
│  │ │📧 Sent   │ │ │⏰ 24h left│ │ │Prep started│              │             │
│  │ │2h ago    │ │ │          │ │ │          │ │              │             │
│  │ │          │ │ │[Follow up]│ │ │[Details] │ │              │             │
│  │ └──────────┘ │ └──────────┘ │ └──────────┘ │              │             │
│  │ ┌──────────┐ │              │              │              │             │
│  │ │Local     │ │              │              │              │             │
│  │ │Agency    │ │              │              │              │             │
│  │ │Offsite   │ │              │              │              │             │
│  │ │          │ │              │              │              │             │
│  │ │$2,800    │ │              │              │              │             │
│  │ │Jan 15    │ │              │              │              │             │
│  │ │🆕 New    │ │              │              │              │             │
│  │ │          │ │              │              │              │             │
│  │ │[Qualify] │ │              │              │              │             │
│  │ └──────────┘ │              │              │              │             │
│  │ ┌──────────┐ │              │              │              │             │
│  │ │Bachelor  │ │              │              │              │             │
│  │ │Party     │ │              │              │              │             │
│  │ │          │ │              │              │              │             │
│  │ │$1,500    │ │              │              │              │             │
│  │ │May 12    │ │              │              │              │             │
│  │ │📞 Called │ │              │              │              │             │
│  │ └──────────┘ │              │              │              │             │
│  └──────────────┴──────────────┴──────────────┴──────────────┘             │
│                                                                             │
│  [View Calendar] [Export Pipeline] [Automation Settings]                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Automation Center Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AUTOMATION CENTER                              [+ New] [⚡ 42 Active] [📊] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SYSTEM HEALTH                                                      │   │
│  │  ████████████████████████████████████████████████░░░░░░░░░░  87%    │   │
│  │                                                                     │   │
│  │  5 workflows active • 142 customers in flows • 0 errors • $2.4M ROI │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  ⚡ Membership Activation          ●●●●●●●●●●●●●●●●  42 active          ││
│  │  ═══════════════════════════════════════════════════════════════════    ││
│  │                                                                         ││
│  │   Trigger: Purchase                                                     ││
│  │      ↓                                                                  ││
│  │   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐             ││
│  │   │  📧     │ →  │  💳     │ →  │  🔔     │ →  │  ✅     │             ││
│  │   │ Welcome │    │ Credits │    │  Staff  │    │ Complete│             ││
│  │   │  Email  │    │  Added  │    │  Alert  │    │         │             ││
│  │   └─────────┘    └─────────┘    └─────────┘    └─────────┘             ││
│  │                                                                         ││
│  │   Performance: 98% success rate • Avg 45s • Last run: 2 min ago         ││
│  │                                                                         ││
│  │   [View Logs] [Edit] [📋 Duplicate to Burlington] [⏸️ Pause]            ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  📚 Lesson Follow-up               ●●●●●●●●●●○○○○○○  18 active          ││
│  │  ═══════════════════════════════════════════════════════════════════    ││
│  │                                                                         ││
│  │   Trigger: 24h Post-Lesson                                              ││
│  │      ↓                                                                  ││
│  │   ┌─────────┐    ┌─────────┐    ┌─────────┐                             ││
│  │   │  ⭐     │ →  │  📊     │ →  │  💰     │                             ││
│  │   │Feedback │    │ Results │    │  Upsell │                             ││
│  │   │ Request │    │ Analysis│    │ Package │                             ││
│  │   └─────────┘    └─────────┘    └─────────┘                             ││
│  │                                                                         ││
│  │   Performance: 34% conversion (Above avg) • Last run: 5 min ago         ││
│  │                                                                         ││
│  │   [View Logs] [Edit] [📋 Duplicate to Burlington] [⏸️ Pause]            ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  [View All 5 Workflows] [Automation Reports] [Bulk Actions]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 4: Animation & Motion Specifications

### 4.1 Entrance Animations

```css
/* Card stagger entrance */
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card {
  animation: cardEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: calc(var(--index, 0) * 100ms);
}

/* Number count-up */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-number {
  animation: countUp 0.8s ease-out forwards;
}

/* Slide in from side */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-item {
  animation: slideIn 0.4s ease-out forwards;
  animation-delay: calc(var(--index) * 50ms);
}
```

### 4.2 Micro-interactions

```css
/* Card hover lift */
.card-hoverable {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}

.card-hoverable:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 24px 48px -12px rgba(0,0,0,0.15),
    0 0 0 1px rgba(212, 175, 55, 0.4);
}

/* Button press */
.btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:active {
  transform: scale(0.97);
}

/* Live indicator pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
}

.live-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

/* Shimmer effect on buttons */
@keyframes shimmer {
  from {
    transform: translateX(-100%) rotate(45deg);
  }
  to {
    transform: translateX(100%) rotate(45deg);
  }
}

.btn-premium {
  position: relative;
  overflow: hidden;
}

.btn-premium::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255,255,255,0.3) 50%,
    transparent 60%
  );
  transform: translateX(-100%) rotate(45deg);
}

.btn-premium:hover::after {
  animation: shimmer 0.8s ease forwards;
}

/* Focus ring animation */
@keyframes focusPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.2);
  }
}

.input:focus {
  animation: focusPulse 1s ease-in-out;
}
```

### 4.3 Page Transitions

```css
/* View transition */
.view-enter {
  opacity: 0;
  transform: translateX(20px);
}

.view-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.view-exit {
  opacity: 1;
  transform: translateX(0);
}

.view-exit-active {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Location switch */
@keyframes locationSwitch {
  0% {
    transform: scale(0.95);
    opacity: 0;
    filter: blur(4px);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: blur(0);
  }
}

.location-content {
  animation: locationSwitch 0.4s ease-out;
}
```

---

## Phase 5: Responsive Considerations

### Breakpoints

```css
/* Mobile-first approach */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Mobile Adaptations

1. **Sidebar** → Collapsible drawer with hamburger menu
2. **Stat Cards** → 2-column grid, then stack
3. **Pipeline** → Horizontal scroll or accordion
4. **Customer 360** → Single column, tabbed sections
5. **Charts** → Simplified sparklines instead of full bars

---

## Phase 6: Implementation Checklist

### Foundation (Priority 1)
- [ ] Update CSS variables with new color system
- [ ] Add Google Fonts (Crimson Pro, Inter, JetBrains Mono)
- [ ] Create base animation keyframes
- [ ] Build new Card component with hover effects
- [ ] Build StatCard component

### Core Components (Priority 2)
- [ ] LiveActivityFeed component
- [ ] RevenueAtRisk card
- [ ] CustomerJourneyTimeline
- [ ] ActionCard component
- [ ] BayStatusVisualization
- [ ] RevenueBreakdown chart
- [ ] WorkflowCard

### Views (Priority 3)
- [ ] Transform Dashboard layout
- [ ] Transform Customer 360 layout
- [ ] Transform Event Pipeline
- [ ] Transform Automation Center

### Polish (Priority 4)
- [ ] Add entrance animations to all components
- [ ] Add page transition animations
- [ ] Add micro-interactions (hover, click)
- [ ] Implement responsive breakpoints
- [ ] Performance optimization
- [ ] Add loading states
- [ ] Add error states

### Advanced (Priority 5)
- [ ] Real-time updates simulation
- [ ] Keyboard navigation
- [ ] Accessibility audit
- [ ] Dark mode support
- [ ] Print styles

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   └── index.js
│   ├── stats/                 # Stat display components
│   │   ├── StatCard.jsx
│   │   ├── StatGrid.jsx
│   │   ├── Sparkline.jsx
│   │   └── index.js
│   ├── activity/              # Activity feed
│   │   ├── LiveActivityFeed.jsx
│   │   ├── ActivityItem.jsx
│   │   └── index.js
│   ├── customer/              # Customer-related
│   │   ├── CustomerJourney.jsx
│   │   ├── CustomerHeader.jsx
│   │   ├── ActivityTimeline.jsx
│   │   └── index.js
│   ├── pipeline/              # Event pipeline
│   │   ├── PipelineColumn.jsx
│   │   ├── EventCard.jsx
│   │   └── index.js
│   ├── automation/            # Automation
│   │   ├── WorkflowCard.jsx
│   │   ├── WorkflowDiagram.jsx
│   │   └── index.js
│   ├── revenue/               # Revenue displays
│   │   ├── RevenueAtRisk.jsx
│   │   ├── RevenueBreakdown.jsx
│   │   └── index.js
│   └── bays/                  # Bay visualization
│       ├── BayStatus.jsx
│       ├── BayIndicator.jsx
│       └── index.js
├── views/
│   ├── Dashboard.jsx
│   ├── Customer360.jsx
│   ├── EventPipeline.jsx
│   └── AutomationCenter.jsx
├── hooks/
│   ├── useAnimation.js
│   ├── useLiveData.js
│   └── useCountUp.js
├── styles/
│   ├── index.css              # Main styles
│   ├── animations.css         # All animations
│   └── components.css         # Component-specific
├── utils/
│   ├── animations.js
│   ├── formatters.js
│   └── constants.js
└── data.js
```

---

## Success Metrics

The transformation is successful when:

1. **Visual Impact**: First impression is "premium" not "bootstrap"
2. **Clarity**: Key metrics are immediately scannable
3. **Delight**: Micro-interactions make the app feel alive
4. **Brand Alignment**: Golf-specific language and metaphors throughout
5. **Founder Reaction**: "This IS the FloGolf System"

---

## Notes

- Keep performance in mind - use CSS animations over JS where possible
- Maintain accessibility - animations respect prefers-reduced-motion
- Test on real devices - golf venue owners may use tablets
- Keep data realistic - use believable numbers and names
- Document decisions - every design choice should have a "why"

---

*Last Updated: March 12, 2026*
*Status: Ready for Implementation*
