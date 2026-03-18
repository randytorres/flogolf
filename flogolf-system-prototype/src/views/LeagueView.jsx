import React, { useState, useMemo } from 'react';
import { Button, Badge } from '../components/ui';
import {
  TrophyIcon,
  UsersIcon,
  ClockIcon,
  DollarIcon,
  CalendarIcon,
  CheckIcon,
  PlusIcon,
  FlagIcon,
  StarIcon,
  EditIcon,
  SearchIcon,
  LeagueIcon,
  TrendUpIcon,
  TrendDownIcon,
  WarningIcon,
  SimBayIcon,
} from '../components/icons';

// ==================== FLOGOLF WINTER/SPRING 2026 LEAGUE DATA ====================
// Based on actual flogolflounge.com/leagues

const SEASON = 'Winter Spring 2026';
const SEASON_TAGLINE = 'Knock the Rust Off. Be Ready When the Season Starts.';
const TOTAL_BAYS = 6;
const GOLFERS_PER_BAY = 4;

const LEAGUES = [
  {
    id: 'winter-spring-tue-wed-early',
    name: 'Tue/Wed Evening (Early)',
    subtitle: 'Tuesday or Wednesday 6:00pm-8:00pm',
    status: 'registration',
    format: '2-Man Scramble',
    days: ['Tuesday', 'Wednesday'],
    timeSlot: '6:00 PM - 8:00 PM',
    dayOptions: 'Tue OR Wed (player choice)',
    totalPlayers: 22,
    maxPlayers: 32,
    weeksRemaining: 6,
    totalWeeks: 6,
    currentWeek: 0,
    entryFee: 200,
    revenue: 4400,
    projectedRevenue: 6400,
    teams: 11,
    maxTeams: 16,
    startDate: 'Mar 3',
    endDate: 'Apr 7',
    eligibility: 'Open to all golfers',
    startYear: 2026,
    registrationDeadline: 'Mar 1',
    golfgeniusId: 'zl9j4m',
    baysUsed: 4,
    notes: 'Lower price point. Good for budget-conscious players. 70% full with 2 weeks to register.',
  },
  {
    id: 'winter-spring-tue-wed-late',
    name: 'Tue/Wed Evening (Late)',
    subtitle: 'Tuesday or Wednesday 8:00pm-10:00pm',
    status: 'registration',
    format: '2-Man Scramble',
    days: ['Tuesday', 'Wednesday'],
    timeSlot: '8:00 PM - 10:00 PM',
    dayOptions: 'Tue OR Wed (player choice)',
    totalPlayers: 26,
    maxPlayers: 32,
    weeksRemaining: 6,
    totalWeeks: 6,
    currentWeek: 0,
    entryFee: 225,
    revenue: 5850,
    projectedRevenue: 7200,
    teams: 13,
    maxTeams: 16,
    startDate: 'Mar 3',
    endDate: 'Apr 7',
    eligibility: 'Open to all golfers',
    startYear: 2026,
    registrationDeadline: 'Mar 1',
    golfgeniusId: 'bs6vn2',
    baysUsed: 4,
    notes: 'Prime time slot. Higher demand. $25 premium for late slot. 81% full.',
  },
  {
    id: 'winter-spring-sun-champ',
    name: 'Sunday Champ 50+',
    subtitle: 'Sunday 4:00pm-6:00pm (Age 50+)',
    status: 'registration',
    format: '2-Man Scramble',
    days: ['Sunday'],
    timeSlot: '4:00 PM - 6:00 PM',
    dayOptions: 'Sunday only',
    totalPlayers: 14,
    maxPlayers: 24,
    weeksRemaining: 6,
    totalWeeks: 6,
    currentWeek: 0,
    entryFee: 200,
    revenue: 2800,
    projectedRevenue: 4800,
    teams: 7,
    maxTeams: 12,
    startDate: 'Mar 8',
    endDate: 'Apr 12',
    eligibility: 'Age 50+',
    startYear: 2026,
    registrationDeadline: 'Mar 6',
    golfgeniusId: 'rcly6n',
    baysUsed: 3,
    notes: 'Niche demographic. Loyal repeat players. 58% full. Consider targeted email to existing 50+ members.',
  },
  {
    id: 'winter-spring-sun-league',
    name: 'Sunday League',
    subtitle: 'Sunday 6:00pm-8:00pm',
    status: 'registration',
    format: '2-Man Scramble',
    days: ['Sunday'],
    timeSlot: '6:00 PM - 8:00 PM',
    dayOptions: 'Sunday only',
    totalPlayers: 18,
    maxPlayers: 32,
    weeksRemaining: 6,
    totalWeeks: 6,
    currentWeek: 0,
    entryFee: 225,
    revenue: 4050,
    projectedRevenue: 7200,
    teams: 9,
    maxTeams: 16,
    startDate: 'Mar 8',
    endDate: 'Apr 12',
    eligibility: 'Open to all golfers',
    startYear: 2026,
    registrationDeadline: 'Mar 6',
    golfgeniusId: 'xtpufl',
    baysUsed: 4,
    notes: '56% full. Sunday evening is popular post-round slot. Potential to fill if we push social media.',
  },
];

const MARCH_MADNESS = {
  id: 'march-madness-2026',
  name: 'March Madness Tournament',
  format: '2-Man Scramble',
  type: 'Single Elimination Bracket',
  status: 'registration',
  prizePool: 12000,
  entryFee: 150,
  registeredTeams: 48,
  maxTeams: 64,
  totalPlayers: 96,
  maxPlayers: 128,
  startDate: 'Mar 15',
  endDate: 'Mar 29',
  revenue: 7200,
  projectedRevenue: 9600,
  golfgeniusId: 'march2026',
  bracketSize: 64,
  rounds: ['Round of 64', 'Round of 32', 'Sweet 16', 'Elite 8', 'Final Four', 'Championship'],
  prizes: [
    { place: '1st', amount: 5000, description: 'Champions' },
    { place: '2nd', amount: 3000, description: 'Runner-up' },
    { place: '3rd', amount: 2000, description: 'Consolation' },
    { place: '4th', amount: 1000, description: 'Consolation' },
    { place: '5-8th', amount: 250, description: 'Each' },
  ],
  baysNeeded: 'All 6 bays',
  notes: '75% full. Biggest tournament of the year. Need to finalize bracket by Mar 13.',
};

// Standings are managed on GolfGenius - these are synced summaries
// Full standings: https://fgl-flowgolfllc.golfgenius.com/ggid/cbtbtu/directory
const STANDINGS = {
  'winter-spring-tue-wed-early': [],
  'winter-spring-tue-wed-late': [],
  'winter-spring-sun-champ': [],
  'winter-spring-sun-league': [],
};

// Weekly schedule template - managed on GolfGenius
// Full schedule: https://fgl-flowgolfllc.golfgenius.com/ggid/cbtbtu/directory
const SCHEDULE = {
  'winter-spring-tue-wed-early': [
    { week: 1, date: 'Mar 3/4', matchups: [], status: 'upcoming' },
    { week: 2, date: 'Mar 10/11', matchups: [], status: 'upcoming' },
    { week: 3, date: 'Mar 17/18', matchups: [], status: 'upcoming' },
    { week: 4, date: 'Mar 24/25', matchups: [], status: 'upcoming' },
    { week: 5, date: 'Mar 31/Apr 1', matchups: [], status: 'upcoming' },
    { week: 6, date: 'Apr 7/8 (Finals)', matchups: [], status: 'finals' },
  ],
  'winter-spring-tue-wed-late': [
    { week: 1, date: 'Mar 3/4', matchups: [], status: 'upcoming' },
    { week: 2, date: 'Mar 10/11', matchups: [], status: 'upcoming' },
    { week: 3, date: 'Mar 17/18', matchups: [], status: 'upcoming' },
    { week: 4, date: 'Mar 24/25', matchups: [], status: 'upcoming' },
    { week: 5, date: 'Mar 31/Apr 1', matchups: [], status: 'upcoming' },
    { week: 6, date: 'Apr 7/8 (Finals)', matchups: [], status: 'finals' },
  ],
  'winter-spring-sun-champ': [
    { week: 1, date: 'Mar 8', matchups: [], status: 'upcoming' },
    { week: 2, date: 'Mar 15', matchups: [], status: 'upcoming' },
    { week: 3, date: 'Mar 22', matchups: [], status: 'upcoming' },
    { week: 4, date: 'Mar 29', matchups: [], status: 'upcoming' },
    { week: 5, date: 'Apr 5', matchups: [], status: 'upcoming' },
    { week: 6, date: 'Apr 12 (Finals)', matchups: [], status: 'finals' },
  ],
  'winter-spring-sun-league': [
    { week: 1, date: 'Mar 8', matchups: [], status: 'upcoming' },
    { week: 2, date: 'Mar 15', matchups: [], status: 'upcoming' },
    { week: 3, date: 'Mar 22', matchups: [], status: 'upcoming' },
    { week: 4, date: 'Mar 29', matchups: [], status: 'upcoming' },
    { week: 5, date: 'Apr 5', matchups: [], status: 'upcoming' },
    { week: 6, date: 'Apr 12 (Finals)', matchups: [], status: 'finals' },
  ],
};

// Player registrations across all leagues
const REGISTRATIONS = [
  // Tue/Wed Early League
  { id: 1, name: 'Mike Torres', email: 'mike.torres@email.com', phone: '(617) 555-0142', paymentStatus: 'paid', amount: 200, partner: 'Jake Sullivan', league: 'Tue/Wed Evening (Early)', dayChoice: 'Tuesday', handicap: 8, memberType: 'Premium', registeredDate: 'Feb 18', bayPreference: null },
  { id: 2, name: 'Jake Sullivan', email: 'jake.s@email.com', phone: '(617) 555-0198', paymentStatus: 'paid', amount: 200, partner: 'Mike Torres', league: 'Tue/Wed Evening (Early)', dayChoice: 'Tuesday', handicap: 10, memberType: 'Premium', registeredDate: 'Feb 18', bayPreference: null },
  { id: 3, name: 'Chris Patel', email: 'chris.p@email.com', phone: '(781) 555-0267', paymentStatus: 'paid', amount: 200, partner: 'Dan Reeves', league: 'Tue/Wed Evening (Early)', dayChoice: 'Tuesday', handicap: 12, memberType: 'Standard', registeredDate: 'Feb 19', bayPreference: null },
  { id: 4, name: 'Dan Reeves', email: 'dan.r@email.com', phone: '(781) 555-0311', paymentStatus: 'pending', amount: 200, partner: 'Chris Patel', league: 'Tue/Wed Evening (Early)', dayChoice: 'Tuesday', handicap: 14, memberType: 'Standard', registeredDate: 'Feb 19', bayPreference: null },
  { id: 5, name: 'Tom Wilson', email: 'tom.w@email.com', phone: '(617) 555-0455', paymentStatus: 'paid', amount: 200, partner: 'Rick Chen', league: 'Tue/Wed Evening (Early)', dayChoice: 'Wednesday', handicap: 6, memberType: 'Premium', registeredDate: 'Feb 20', bayPreference: null },
  { id: 6, name: 'Rick Chen', email: 'rick.c@email.com', phone: '(617) 555-0523', paymentStatus: 'paid', amount: 200, partner: 'Tom Wilson', league: 'Tue/Wed Evening (Early)', dayChoice: 'Wednesday', handicap: 9, memberType: 'Standard', registeredDate: 'Feb 20', bayPreference: null },
  // Tue/Wed Late League
  { id: 7, name: 'Sam Brooks', email: 'sam.b@email.com', phone: '(781) 555-0688', paymentStatus: 'paid', amount: 225, partner: 'Alex Kim', league: 'Tue/Wed Evening (Late)', dayChoice: 'Tuesday', handicap: 7, memberType: 'Premium', registeredDate: 'Feb 18', bayPreference: null },
  { id: 8, name: 'Alex Kim', email: 'alex.k@email.com', phone: '(781) 555-0734', paymentStatus: 'paid', amount: 225, partner: 'Sam Brooks', league: 'Tue/Wed Evening (Late)', dayChoice: 'Tuesday', handicap: 8, memberType: 'Standard', registeredDate: 'Feb 18', bayPreference: null },
  { id: 9, name: 'Ben Garcia', email: 'ben.g@email.com', phone: '(617) 555-0812', paymentStatus: 'overdue', amount: 225, partner: 'Luke Martin', league: 'Tue/Wed Evening (Late)', dayChoice: 'Wednesday', handicap: 11, memberType: 'Standard', registeredDate: 'Feb 20', bayPreference: null },
  { id: 10, name: 'Luke Martin', email: 'luke.m@email.com', phone: '(617) 555-0899', paymentStatus: 'paid', amount: 225, partner: 'Ben Garcia', league: 'Tue/Wed Evening (Late)', dayChoice: 'Wednesday', handicap: 13, memberType: 'Standard', registeredDate: 'Feb 20', bayPreference: null },
  { id: 11, name: 'Dave Nguyen', email: 'dave.n@email.com', phone: '(781) 555-0944', paymentStatus: 'paid', amount: 225, partner: 'Paul Russo', league: 'Tue/Wed Evening (Late)', dayChoice: 'Tuesday', handicap: 10, memberType: 'Premium', registeredDate: 'Feb 21', bayPreference: null },
  { id: 12, name: 'Paul Russo', email: 'paul.r@email.com', phone: '(781) 555-1022', paymentStatus: 'paid', amount: 225, partner: 'Dave Nguyen', league: 'Tue/Wed Evening (Late)', dayChoice: 'Tuesday', handicap: 15, memberType: 'Standard', registeredDate: 'Feb 21', bayPreference: null },
  // Sunday Champ 50+
  { id: 13, name: 'Ken Fisher', email: 'ken.f@email.com', phone: '(617) 555-1167', paymentStatus: 'paid', amount: 200, partner: 'Rex Holt', league: 'Sunday Champ 50+', dayChoice: 'Sunday', handicap: 9, memberType: 'Premium', registeredDate: 'Feb 22', bayPreference: null },
  { id: 14, name: 'Rex Holt', email: 'rex.h@email.com', phone: '(617) 555-1234', paymentStatus: 'paid', amount: 200, partner: 'Ken Fisher', league: 'Sunday Champ 50+', dayChoice: 'Sunday', handicap: 11, memberType: 'Premium', registeredDate: 'Feb 22', bayPreference: null },
  { id: 15, name: 'Lyle Price', email: 'lyle.p@email.com', phone: '(781) 555-1388', paymentStatus: 'pending', amount: 200, partner: 'Neil Sharp', league: 'Sunday Champ 50+', dayChoice: 'Sunday', handicap: 14, memberType: 'Standard', registeredDate: 'Feb 23', bayPreference: null },
  { id: 16, name: 'Neil Sharp', email: 'neil.s@email.com', phone: '(781) 555-1456', paymentStatus: 'paid', amount: 200, partner: 'Lyle Price', league: 'Sunday Champ 50+', dayChoice: 'Sunday', handicap: 16, memberType: 'Standard', registeredDate: 'Feb 23', bayPreference: null },
  // Sunday League
  { id: 17, name: 'Carlos Diaz', email: 'carlos.d@email.com', phone: '(617) 555-1501', paymentStatus: 'paid', amount: 225, partner: 'Brian Foster', league: 'Sunday League', dayChoice: 'Sunday', handicap: 5, memberType: 'Premium', registeredDate: 'Feb 24', bayPreference: null },
  { id: 18, name: 'Brian Foster', email: 'brian.f@email.com', phone: '(617) 555-1602', paymentStatus: 'paid', amount: 225, partner: 'Carlos Diaz', league: 'Sunday League', dayChoice: 'Sunday', handicap: 7, memberType: 'Standard', registeredDate: 'Feb 24', bayPreference: null },
];

const WAITLIST = [
  { id: 101, name: 'Marcus Webb', email: 'marcus.w@email.com', phone: '(781) 555-2044', requestedLeague: 'Tue/Wed Evening (Late)', joinedDate: 'Feb 25', handicap: 11, notes: 'Prefers Tuesday' },
  { id: 102, name: 'Andre Johnson', email: 'andre.j@email.com', phone: '(617) 555-2089', requestedLeague: 'Sunday League', joinedDate: 'Feb 26', handicap: 6, notes: 'New to Flogolf, heard from a friend' },
  { id: 103, name: 'Pete Davidson', email: 'pete.d@email.com', phone: '(617) 555-2001', requestedLeague: 'Tue/Wed Evening (Early)', joinedDate: 'Feb 27', handicap: 8, notes: 'Has a partner ready' },
  { id: 104, name: 'Sarah Chen', email: 'sarah.c@email.com', phone: '(781) 555-2155', requestedLeague: 'Sunday Champ 50+', joinedDate: 'Feb 27', handicap: 12, notes: '52 years old, regular customer' },
];

// March Madness Tournament Registrations
const TOURNAMENT_REGISTRATIONS = [
  { id: 201, team: 'Birdie Brothers', player1: 'Mike Torres', player2: 'Jake Sullivan', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 202, team: 'Fairway Kings', player1: 'Chris Patel', player2: 'Dan Reeves', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 203, team: 'Night Owls GC', player1: 'Steve Park', player2: 'Jim Torres', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 204, team: 'Sim City', player1: 'Craig Johnson', player2: 'Neil Brown', paymentStatus: 'pending', seed: null, currentRound: null, result: null },
  { id: 205, team: 'Wednesday Warriors', player1: 'Carlos Diaz', player2: 'Brian Foster', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 206, team: 'Late Night Legends', player1: 'Vince Hall', player2: 'Drew Mason', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 207, team: 'Sunday Funday', player1: 'Ken Fisher', player2: 'Rex Holt', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 208, team: 'Green Machines', player1: 'Tyler Nash', player2: 'Shawn Reed', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 209, team: 'Iron Will', player1: 'Mark Davis', player2: 'Leo Santos', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
  { id: 210, team: 'Par Breakers', player1: 'Eric Stone', player2: 'Will Dean', paymentStatus: 'paid', seed: null, currentRound: null, result: null },
];

// Owner action items
const ACTION_ITEMS = [
  { id: 'a1', type: 'payment', severity: 'high', message: '3 players have overdue payments totaling $650', detail: 'Dan Reeves ($200), Ben Garcia ($225), +1 other', action: 'Send payment reminder', icon: 'dollar' },
  { id: 'a2', type: 'deadline', severity: 'high', message: 'Tue/Wed registration closes in 4 days (Mar 1)', detail: '70-81% full. Need 14 more players to reach max capacity.', action: 'Push registration', icon: 'clock' },
  { id: 'a3', type: 'deadline', severity: 'medium', message: 'Sunday registration closes in 6 days (Mar 6)', detail: '56-58% full. Sunday Champ 50+ needs targeted outreach.', action: 'Send email blast', icon: 'clock' },
  { id: 'a4', type: 'waitlist', severity: 'low', message: '4 players on waitlist across leagues', detail: 'Could fill remaining spots or start additional league if demand persists.', action: 'Review waitlist', icon: 'users' },
  { id: 'a5', type: 'tournament', severity: 'medium', message: 'March Madness bracket finalization due Mar 13', detail: '48 of 64 teams registered ($7,200 collected). Need 16 more.', action: 'Finalize bracket', icon: 'trophy' },
  { id: 'a6', type: 'bay-conflict', severity: 'low', message: 'Sun Mar 8 league kickoff uses all 6 bays', detail: 'No availability for walk-ins 4pm-8pm. Consider staffing.', action: 'Staff notification', icon: 'bay' },
];


// ==================== STYLES ====================

const styles = {
  container: {
    backgroundColor: '#0a0a0a',
    minHeight: 'auto',
    padding: '1.5rem',
    fontFamily: 'var(--font-ui)',
    color: '#fff',
  },
  headerSection: {
    marginBottom: '1.5rem',
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'rgba(255,255,255,0.5)',
    margin: '0.25rem 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: '#141414',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
  },
  statLabel: {
    fontSize: 'var(--text-xs)',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  statValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  statSubtext: {
    fontSize: 'var(--text-xs)',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '0.25rem',
  },
  tabsContainer: {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '1px',
  },
  tab: {
    padding: '0.75rem 1.25rem',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-ui)',
  },
  tabActive: {
    color: '#d4af37',
    borderBottomColor: '#d4af37',
  },
  leagueCard: {
    backgroundColor: '#141414',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 4px',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: 'var(--text-sm)',
    color: '#fff',
    verticalAlign: 'middle',
  },
  row: {
    backgroundColor: '#141414',
    transition: 'all 0.15s ease',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.625rem 1rem 0.625rem 2.5rem',
    color: '#fff',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    width: '280px',
    fontFamily: 'var(--font-ui)',
  },
};


// ==================== MAIN COMPONENT ====================

export default function LeagueView({ data }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLeague, setSelectedLeague] = useState('winter-spring-tue-wed-late');
  const [searchQuery, setSearchQuery] = useState('');

  const totalPlayers = LEAGUES.reduce((sum, l) => sum + l.totalPlayers, 0);
  const maxPlayers = LEAGUES.reduce((sum, l) => sum + l.maxPlayers, 0);
  const totalCollected = LEAGUES.reduce((sum, l) => sum + l.revenue, 0);
  const totalProjected = LEAGUES.reduce((sum, l) => sum + l.projectedRevenue, 0);
  const pendingPayments = REGISTRATIONS.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'overdue').length;
  const pendingAmount = REGISTRATIONS.filter(r => r.paymentStatus === 'pending' || r.paymentStatus === 'overdue').reduce((s, r) => s + r.amount, 0);
  const overallFillRate = Math.round((totalPlayers / maxPlayers) * 100);
  const totalSeasonRevenue = totalProjected + MARCH_MADNESS.projectedRevenue;
  const totalCollectedAll = totalCollected + MARCH_MADNESS.revenue;

  const filteredRegistrations = REGISTRATIONS.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.league.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.partner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LeagueIcon },
    { id: 'schedule', label: 'Schedule & Bays', icon: CalendarIcon },
    { id: 'registration', label: 'Registration', icon: UsersIcon },
    { id: 'tournament', label: 'March Madness', icon: TrophyIcon },
  ];

  return (
    <div className="lv-container" style={styles.container}>
      <style>{`
        .lv-container {
          min-height: auto;
        }
        @media (max-width: 768px) {
          .lv-container {
            padding: 1rem !important;
          }
          .lv-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .lv-league-grid {
            grid-template-columns: 1fr !important;
          }
          .lv-action-grid {
            grid-template-columns: 1fr !important;
          }
          .lv-prize-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .lv-info-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .lv-bay-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .lv-policy-grid {
            grid-template-columns: 1fr !important;
          }
          .lv-payment-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .lv-tournament-kpi {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .lv-header-row {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .lv-header-row > div:last-child {
            width: 100% !important;
            justify-content: flex-start !important;
          }
          .lv-table-scroll {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .lv-table-scroll table {
            min-width: 700px;
          }
          .lv-reg-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .lv-reg-actions {
            width: 100% !important;
          }
          .lv-reg-actions .search-wrap {
            flex: 1 !important;
          }
          .lv-reg-actions .search-wrap input {
            width: 100% !important;
          }
          .lv-bracket-scroll {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .lv-bay-legend {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .lv-revenue-row {
            flex-direction: column !important;
            gap: 0.5rem !important;
            align-items: flex-start !important;
          }
          .lv-schedule-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .lv-league-pills {
            overflow-x: auto;
            flex-wrap: nowrap !important;
            -webkit-overflow-scrolling: touch;
          }
          .lv-league-pills button {
            white-space: nowrap;
          }
          .lv-tournament-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .lv-mm-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
        @media (max-width: 480px) {
          .lv-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .lv-payment-grid {
            grid-template-columns: 1fr !important;
          }
          .lv-prize-grid {
            grid-template-columns: 1fr !important;
          }
          .lv-bay-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="lv-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', ...styles.headerSection }}>
        <div>
          <h1 style={styles.headerTitle}>League Management</h1>
          <p style={styles.headerSubtitle}>{SEASON} &mdash; {SEASON_TAGLINE}</p>
        </div>
        <div style={styles.headerActions}>
          <Button variant="secondary" size="sm" icon={FlagIcon}>
            GolfGenius
          </Button>
          <Button variant="primary" size="sm" icon={PlusIcon}>
            New League
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="lv-stats-grid" style={styles.statsGrid}>
        <StatCard
          icon={LeagueIcon}
          iconBg="rgba(212,175,55,0.15)"
          iconColor="#d4af37"
          label="Leagues"
          value={`${LEAGUES.length}`}
          subtext={`All ${SEASON}`}
        />
        <StatCard
          icon={UsersIcon}
          iconBg="rgba(59,130,246,0.15)"
          iconColor="#3b82f6"
          label="Registration"
          value={`${overallFillRate}%`}
          subtext={`${totalPlayers} of ${maxPlayers} spots filled`}
        />
        <StatCard
          icon={DollarIcon}
          iconBg="rgba(34,197,94,0.15)"
          iconColor="#22c55e"
          label="Season Revenue"
          value={`$${totalSeasonRevenue.toLocaleString()}`}
          subtext={`$${totalCollectedAll.toLocaleString()} collected`}
        />
        <StatCard
          icon={WarningIcon}
          iconBg={pendingPayments > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}
          iconColor={pendingPayments > 0 ? '#ef4444' : '#22c55e'}
          label="Pending Payments"
          value={pendingPayments > 0 ? `$${pendingAmount.toLocaleString()}` : '$0'}
          subtext={`${pendingPayments} player${pendingPayments !== 1 ? 's' : ''} need follow-up`}
        />
        <StatCard
          icon={ClockIcon}
          iconBg="rgba(245,158,11,0.15)"
          iconColor="#f59e0b"
          label="Next Deadline"
          value="Mar 1"
          subtext="Tue/Wed registration closes"
        />
      </div>

      {/* Action Items Bar */}
      <ActionBar items={ACTION_ITEMS} />

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : {}),
              }}
            >
              <Icon size={16} color={isActive ? '#d4af37' : 'rgba(255,255,255,0.4)'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          leagues={LEAGUES}
          selectedLeague={selectedLeague}
          onSelectLeague={setSelectedLeague}
          registrations={REGISTRATIONS}
        />
      )}
      {activeTab === 'schedule' && (
        <ScheduleTab
          leagues={LEAGUES}
          selectedLeague={selectedLeague}
          onSelectLeague={setSelectedLeague}
          schedule={SCHEDULE}
        />
      )}
      {activeTab === 'registration' && (
        <RegistrationTab
          registrations={filteredRegistrations}
          waitlist={WAITLIST}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          leagues={LEAGUES}
        />
      )}
      {activeTab === 'tournament' && (
        <TournamentTab tournament={MARCH_MADNESS} registrations={TOURNAMENT_REGISTRATIONS} />
      )}
    </div>
  );
}

// ==================== ACTION BAR ====================

function ActionBar({ items }) {
  const [expanded, setExpanded] = useState(true);
  const highPriority = items.filter(i => i.severity === 'high');
  const otherItems = items.filter(i => i.severity !== 'high');
  const displayItems = expanded ? items : highPriority;

  const severityColors = {
    high: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#ef4444', badge: 'rgba(239,68,68,0.15)' },
    medium: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', badge: 'rgba(245,158,11,0.15)' },
    low: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', text: '#3b82f6', badge: 'rgba(59,130,246,0.12)' },
  };

  const iconMap = {
    dollar: DollarIcon,
    clock: ClockIcon,
    users: UsersIcon,
    trophy: TrophyIcon,
    bay: SimBayIcon,
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <WarningIcon size={16} color="#f59e0b" />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            Action Items
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: highPriority.length > 0 ? '#ef4444' : '#fff',
            backgroundColor: highPriority.length > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
            padding: '0.125rem 0.5rem',
            borderRadius: '999px',
          }}>
            {highPriority.length} urgent
          </span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)' }}>
          {expanded ? 'Collapse' : 'Expand all'}
        </span>
      </div>

      <div className="lv-action-grid" style={{ display: 'grid', gridTemplateColumns: expanded ? 'repeat(3, 1fr)' : `repeat(${Math.min(highPriority.length, 3)}, 1fr)`, gap: '0.75rem' }}>
        {displayItems.map((item, idx) => {
          const colors = severityColors[item.severity];
          const Icon = iconMap[item.icon] || WarningIcon;
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                padding: '0.875rem 1rem',
                opacity: 0,
                animation: `fadeInUp 0.3s ease-out ${idx * 60}ms forwards`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <Icon size={16} color={colors.text} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: colors.text, marginBottom: '0.25rem' }}>
                    {item.message}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== STAT CARD ====================

function StatCard({ icon: Icon, iconBg, iconColor, label, value, subtext }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIconWrap, backgroundColor: iconBg }}>
        <Icon size={20} color={iconColor} />
      </div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
      {subtext && <div style={styles.statSubtext}>{subtext}</div>}
    </div>
  );
}

// ==================== OVERVIEW TAB ====================

function OverviewTab({ leagues, selectedLeague, onSelectLeague, registrations }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>
            Winter Spring Leagues
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0 0' }}>
            {SEASON_TAGLINE}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Badge variant="warning" size="sm" dot pulse>
            Registration Open
          </Badge>
          <Badge variant="outline" size="sm">
            {TOTAL_BAYS} Golfzon Bays
          </Badge>
        </div>
      </div>

      <div className="lv-league-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {leagues.map((league, index) => {
          const isHovered = hoveredCard === league.id;
          const isSelected = selectedLeague === league.id;
          const fillRate = Math.round((league.totalPlayers / league.maxPlayers) * 100);
          const paidPlayers = registrations.filter(r => r.league === league.name && r.paymentStatus === 'paid').length;
          const pendingPlayers = registrations.filter(r => r.league === league.name && (r.paymentStatus === 'pending' || r.paymentStatus === 'overdue')).length;
          const baysNeeded = Math.ceil(league.totalPlayers / GOLFERS_PER_BAY);
          const is50Plus = league.eligibility.includes('50');

          return (
            <div
              key={league.id}
              onClick={() => onSelectLeague(league.id)}
              onMouseEnter={() => setHoveredCard(league.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                ...styles.leagueCard,
                ...(isHovered || isSelected ? {
                  borderColor: 'rgba(212,175,55,0.3)',
                  boxShadow: '0 8px 32px rgba(212,175,55,0.08)',
                } : {}),
                ...(isSelected ? {
                  borderColor: '#d4af37',
                } : {}),
                opacity: 0,
                animation: `fadeInUp 0.4s ease-out ${index * 80}ms forwards`,
              }}
            >
              {/* League Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {league.name}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0 0' }}>
                    {league.subtitle}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                  {is50Plus && (
                    <Badge variant="marine" size="sm">50+</Badge>
                  )}
                  <Badge variant="warning" size="sm" dot pulse>
                    Registration
                  </Badge>
                </div>
              </div>

              {/* Registration Fill Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>
                    Registration Fill
                  </span>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {fillRate}%
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${fillRate}%`,
                      backgroundColor: fillRate >= 80 ? '#22c55e' : fillRate >= 50 ? '#f59e0b' : '#ef4444',
                      borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                    {league.totalPlayers} players / {league.maxPlayers} max
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                    {league.maxPlayers - league.totalPlayers} spots open
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="lv-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <InfoItem icon={FlagIcon} label="Format" value={league.format} />
                <InfoItem icon={CalendarIcon} label="Starts" value={league.startDate} />
                <InfoItem icon={ClockIcon} label="Duration" value={`${league.totalWeeks} weeks`} />
                <InfoItem icon={DollarIcon} label="Entry" value={`$${league.entryFee.toLocaleString()}/person`} />
                <InfoItem icon={SimBayIcon} label="Bays" value={`${baysNeeded} of ${TOTAL_BAYS}`} />
                <InfoItem icon={UsersIcon} label="Teams" value={`${league.teams}/${league.maxTeams}`} />
              </div>

              {/* Revenue Row */}
              <div className="lv-revenue-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginBottom: '0.125rem' }}>Collected</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 700, color: '#fff' }}>
                    ${league.revenue.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginBottom: '0.125rem' }}>Projected</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 700, color: '#d4af37' }}>
                    ${league.projectedRevenue.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginBottom: '0.125rem' }}>Payments</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#fff' }}>
                    <span style={{ color: '#fff' }}>{paidPlayers} paid</span>
                    {pendingPlayers > 0 && (
                      <span style={{ color: '#f59e0b' }}> / {pendingPlayers} pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration Deadline */}
              <div style={{
                marginTop: '1rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(245,158,11,0.08)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>
                  Registration Deadline
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#f59e0b' }}>
                  {league.registrationDeadline} (~48hrs before start)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* March Madness Tournament Card */}
      <div style={{
        marginTop: '1.5rem',
        backgroundColor: '#141414',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid rgba(212,175,55,0.2)',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, #141414 50%)',
      }}>
        <div className="lv-mm-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212,175,55,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TrophyIcon size={24} color="#d4af37" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>
                {MARCH_MADNESS.name}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>
                {MARCH_MADNESS.type} &mdash; ${MARCH_MADNESS.prizePool.toLocaleString()} in prizes
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>Teams Registered</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 700, color: '#d4af37' }}>
                {MARCH_MADNESS.registeredTeams}/{MARCH_MADNESS.maxTeams}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>Prize Pool</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 700, color: '#fff' }}>
                $12,000
              </div>
            </div>
            <Button variant="gold" size="sm" icon={EditIcon}>
              Manage Bracket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== INFO ITEM ====================

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon size={14} color="rgba(255,255,255,0.3)" />
      <div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

// ==================== SCHEDULE TAB ====================

function ScheduleTab({ leagues, selectedLeague, onSelectLeague, schedule }) {
  const currentSchedule = schedule[selectedLeague] || [];
  const league = leagues.find(l => l.id === selectedLeague);
  const baysNeeded = league ? Math.ceil(league.totalPlayers / GOLFERS_PER_BAY) : 0;

  return (
    <div>
      <div className="lv-schedule-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>
            Schedule & Bay Allocation
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0 0' }}>
            Managed via GolfGenius &middot; Pairings posted weekly
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={EditIcon}>
          Sync GolfGenius
        </Button>
      </div>

      {/* League Selector */}
      <div className="lv-league-pills" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {leagues.map(league => (
          <button
            key={league.id}
            onClick={() => onSelectLeague(league.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: selectedLeague === league.id ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: selectedLeague === league.id ? 'rgba(212,175,55,0.12)' : 'transparent',
              color: selectedLeague === league.id ? '#d4af37' : 'rgba(255,255,255,0.5)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s ease',
            }}
          >
            {league.name}
          </button>
        ))}
      </div>

      {league && (
        <>
          {/* Bay Utilization Card */}
          <div style={{
            backgroundColor: '#141414',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: '0 0 1rem 0' }}>
              Bay Utilization During League Hours
            </h3>
            <div className="lv-bay-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
              {Array.from({ length: TOTAL_BAYS }, (_, i) => {
                const bayInUse = i < baysNeeded;
                const isReserved = i < league.baysUsed;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      textAlign: 'center',
                      backgroundColor: isReserved ? 'rgba(212,175,55,0.08)' : 'rgba(34,197,94,0.06)',
                      border: isReserved ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(34,197,94,0.15)',
                    }}
                  >
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
                      Bay {i + 1}
                    </div>
                    <div style={{ fontSize: '10px', color: isReserved ? '#d4af37' : '#fff', fontWeight: 600 }}>
                      {isReserved ? 'LEAGUE' : 'AVAILABLE'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
                      {isReserved ? league.timeSlot : 'Walk-ins welcome'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="lv-bay-legend" style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(245,158,11,0.08)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>
                League uses {league.baysUsed} of {TOTAL_BAYS} bays ({league.timeSlot}) &middot; {GOLFERS_PER_BAY} golfers per bay
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: '#f59e0b', fontWeight: 600 }}>
                {TOTAL_BAYS - league.baysUsed} bays open for bookings
              </span>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div style={{
            backgroundColor: '#141414',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: 0 }}>
                Weekly Schedule &mdash; {league.name}
              </h3>
            </div>
            <div>
              {currentSchedule.map((week, idx) => (
                <div
                  key={week.week}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    borderBottom: idx < currentSchedule.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    backgroundColor: week.status === 'finals' ? 'rgba(212,175,55,0.04)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: week.status === 'finals' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 700,
                      color: week.status === 'finals' ? '#d4af37' : 'rgba(255,255,255,0.6)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      W{week.week}
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: '#fff' }}>
                        Week {week.week} &mdash; {week.date}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                        {week.status === 'finals' ? 'Finals Week (Bonus)' : `${league.dayOptions} &middot; ${league.timeSlot}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {week.status === 'finals' && (
                      <Badge variant="gold" size="sm">Finals</Badge>
                    )}
                    <Badge
                      variant={week.status === 'upcoming' ? 'outline' : week.status === 'finals' ? 'primary' : 'default'}
                      size="sm"
                    >
                      {week.status === 'upcoming' ? 'Upcoming' : week.status === 'finals' ? 'Championship' : week.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* League Rules */}
          <div style={{
            marginTop: '1.5rem',
            backgroundColor: '#141414',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: '0 0 1rem 0' }}>
              League Policies
            </h3>
            <div className="lv-policy-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Registration Cutoff', value: '~48 hours prior to start date' },
                { label: 'Duration', value: '6 weeks + 1 bonus finals week' },
                { label: 'Format', value: '2-Man Scramble' },
                { label: 'Players Per Bay', value: `${GOLFERS_PER_BAY} golfers (paired weekly)` },
                { label: 'Holidays', value: 'No league play on major holidays' },
                { label: 'Weather Policy', value: 'Schedules subject to change' },
              ].map((rule, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>{rule.label}</span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{rule.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== REGISTRATION TAB ====================

function RegistrationTab({ registrations, waitlist, searchQuery, onSearchChange, leagues }) {
  const paidCount = registrations.filter(r => r.paymentStatus === 'paid').length;
  const pendingCount = registrations.filter(r => r.paymentStatus === 'pending').length;
  const overdueCount = registrations.filter(r => r.paymentStatus === 'overdue').length;
  const totalCollected = registrations.filter(r => r.paymentStatus === 'paid').reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <div className="lv-reg-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>
            Registration & Payments
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0 0' }}>
            Track player registrations, payment status, and partner pairings
          </p>
        </div>
        <div className="lv-reg-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="search-wrap" style={{ position: 'relative' }}>
            <SearchIcon size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search players, leagues, partners..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <Button variant="secondary" size="sm" icon={DollarIcon}>
            Export Payments
          </Button>
        </div>
      </div>

      {/* Payment Pipeline */}
      <div className="lv-payment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>PAID</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#fff' }}>{paidCount}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>${totalCollected.toLocaleString()} collected</div>
        </div>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(245,158,11,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>PENDING</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>Awaiting payment</div>
        </div>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: overdueCount > 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>OVERDUE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: overdueCount > 0 ? '#ef4444' : '#fff' }}>{overdueCount}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>Needs follow-up</div>
        </div>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>WAITLIST</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#3b82f6' }}>{waitlist.length}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>Pending spots</div>
        </div>
      </div>

      {/* Registration Table */}
      <div style={{
        backgroundColor: '#141414',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}>
        <div className="lv-reg-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: 0 }}>
            Player Registrations ({registrations.length})
          </h3>
          <div className="lv-reg-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm">Send Reminders</Button>
            <Button variant="primary" size="sm" icon={PlusIcon}>Add Player</Button>
          </div>
        </div>
        <div className="lv-table-scroll">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Player</th>
              <th style={styles.th}>League</th>
              <th style={styles.th}>Partner</th>
              <th style={styles.th}>Day</th>
              <th style={styles.th}>Handicap</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id} style={styles.row}>
                <td style={styles.td}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{reg.name}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{reg.email}</div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.6)' }}>{reg.league}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)' }}>{reg.partner}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)' }}>{reg.dayChoice}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{reg.handicap}</span>
                </td>
                <td style={styles.td}>
                  <Badge
                    variant={reg.paymentStatus === 'paid' ? 'success' : reg.paymentStatus === 'pending' ? 'warning' : 'danger'}
                    size="sm"
                    dot={reg.paymentStatus !== 'paid'}
                    pulse={reg.paymentStatus === 'overdue'}
                  >
                    {reg.paymentStatus.charAt(0).toUpperCase() + reg.paymentStatus.slice(1)}
                  </Badge>
                </td>
                <td style={styles.td}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${reg.amount.toLocaleString()}</span>
                </td>
                <td style={styles.td}>
                  <Badge variant={reg.memberType === 'Premium' ? 'primary' : 'outline'} size="sm">
                    {reg.memberType}
                  </Badge>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>{reg.registeredDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Waitlist */}
      {waitlist.length > 0 && (
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          border: '1px solid rgba(59,130,246,0.15)',
          overflow: 'hidden',
        }}>
          <div className="lv-reg-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UsersIcon size={16} color="#3b82f6" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: 0 }}>
                Waitlist ({waitlist.length})
              </h3>
            </div>
            <Button variant="secondary" size="sm">Promote to League</Button>
          </div>
          <div className="lv-table-scroll">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Player</th>
                <th style={styles.th}>Requested League</th>
                <th style={styles.th}>Handicap</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}>Joined Waitlist</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map(w => (
                <tr key={w.id} style={styles.row}>
                  <td style={styles.td}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{w.name}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{w.email}</div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 'var(--text-xs)' }}>{w.requestedLeague}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{w.handicap}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{w.notes}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>{w.joinedDate}</span>
                  </td>
                  <td style={styles.td}>
                    <Button variant="secondary" size="sm">Contact</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== TOURNAMENT TAB ====================

function TournamentTab({ tournament, registrations }) {
  const fillRate = Math.round((tournament.registeredTeams / tournament.maxTeams) * 100);
  const paidTeams = registrations.filter(r => r.paymentStatus === 'paid').length;
  const pendingTeams = registrations.filter(r => r.paymentStatus === 'pending').length;

  return (
    <div>
      <div className="lv-tournament-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>
            {tournament.name}
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0 0' }}>
            {tournament.type} &middot; {tournament.startDate} - {tournament.endDate} &middot; All 6 bays
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Badge variant="warning" size="sm" dot pulse>
            Registration Open
          </Badge>
          <Button variant="gold" size="sm" icon={EditIcon}>
            Manage Bracket
          </Button>
        </div>
      </div>

      {/* Tournament KPIs */}
      <div className="lv-tournament-kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(212,175,55,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>PRIZE POOL</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#d4af37' }}>
            ${tournament.prizePool.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>Total prizes</div>
        </div>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>TEAMS</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#3b82f6' }}>
            {tournament.registeredTeams}/{tournament.maxTeams}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>{fillRate}% filled</div>
        </div>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>REVENUE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#fff' }}>
            ${tournament.revenue.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>
            ${tournament.projectedRevenue.toLocaleString()} projected
          </div>
        </div>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(245,158,11,0.2)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>ENTRY FEE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#f59e0b' }}>
            ${tournament.entryFee}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>Per team</div>
        </div>
      </div>

      {/* Prize Breakdown */}
      <div style={{
        backgroundColor: '#141414',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid rgba(212,175,55,0.15)',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: '0 0 1rem 0' }}>
          Prize Breakdown
        </h3>
        <div className="lv-prize-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
          {tournament.prizes.map((prize, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: idx === 0 ? 'rgba(212,175,55,0.12)' : idx === 1 ? 'rgba(192,192,192,0.08)' : idx === 2 ? 'rgba(205,127,50,0.08)' : 'rgba(255,255,255,0.02)',
                border: idx === 0 ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>{prize.place}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: idx === 0 ? '#d4af37' : '#fff' }}>
                ${prize.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{prize.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Teams */}
      <div style={{
        backgroundColor: '#141414',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div className="lv-reg-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: 0 }}>
            Registered Teams ({registrations.length})
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: '#fff' }}>{paidTeams} paid</span>
            {pendingTeams > 0 && (
              <span style={{ fontSize: 'var(--text-xs)', color: '#f59e0b' }}>/ {pendingTeams} pending</span>
            )}
          </div>
        </div>
        <div className="lv-table-scroll">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Team</th>
              <th style={styles.th}>Player 1</th>
              <th style={styles.th}>Player 2</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Seed</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id} style={styles.row}>
                <td style={styles.td}>
                  <span style={{ fontWeight: 600 }}>{reg.team}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)' }}>{reg.player1}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)' }}>{reg.player2}</span>
                </td>
                <td style={styles.td}>
                  <Badge
                    variant={reg.paymentStatus === 'paid' ? 'success' : 'warning'}
                    size="sm"
                    dot={reg.paymentStatus !== 'paid'}
                  >
                    {reg.paymentStatus.charAt(0).toUpperCase() + reg.paymentStatus.slice(1)}
                  </Badge>
                </td>
                <td style={styles.td}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>
                    {reg.seed || 'TBD'}
                  </span>
                </td>
                <td style={styles.td}>
                  <Badge variant="outline" size="sm">
                    Registered
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Bracket Timeline */}
      <div style={{
        marginTop: '1.5rem',
        backgroundColor: '#141414',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', margin: '0 0 1rem 0' }}>
          Tournament Bracket
        </h3>
        <div className="lv-bracket-scroll" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {tournament.rounds.map((round, idx) => (
            <div
              key={idx}
              style={{
                minWidth: '140px',
                padding: '1rem',
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                flex: 1,
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: idx === tournament.rounds.length - 1 ? '#d4af37' : 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                {round}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                {idx === 0 ? `${tournament.registeredTeams} teams` : `${Math.pow(2, tournament.rounds.length - idx - 1)} teams`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

