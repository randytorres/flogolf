import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { BayStatus } from '../components/bays/BayStatus';
import { BookingGrid } from '../components/bays/BookingGrid';
import {
  SimBayIcon, ClockIcon, UsersIcon, PhoneIcon, DollarIcon,
  PlusIcon, CalendarIcon, TrendUpIcon, WarningIcon, CocktailIcon,
  CheckIcon, EditIcon, SearchIcon, CloseIcon,
} from '../components/icons';

const generateDaySchedule = (bay) => {
  const bookings = [];
  if (bay.status === 'active' && bay.session) {
    bookings.push({ start: bay.session.startTime, end: bay.session.endTime, customer: bay.customer?.name || 'Unknown', players: bay.customer?.players || 1, type: bay.session.bookingType, amount: bay.session.paidAmount, status: 'active', phone: bay.customer?.phone });
  }
  if (bay.status === 'upcoming' && bay.session) {
    bookings.push({ start: bay.session.startTime, end: bay.session.endTime, customer: bay.customer?.name || 'Unknown', players: bay.customer?.players || 1, type: bay.session.bookingType, amount: bay.session.paidAmount, status: 'upcoming', phone: bay.customer?.phone });
  }
  const extras = {
    1: [
      { start: '8:30 AM', end: '10:30 AM', customer: 'Walk-in', players: 2, type: 'Early Bird', amount: 85, status: 'completed' },
      { start: '3:00 PM', end: '5:00 PM', customer: 'Sandra Mitchell', players: 2, type: 'Off-Peak', amount: 100, status: 'upcoming' },
      { start: '6:00 PM', end: '8:00 PM', customer: 'James Thorne', players: 1, type: 'Peak Rate', amount: 75, status: 'upcoming' },
    ],
    2: [
      { start: '10:00 AM', end: '11:00 AM', customer: 'Walk-in', players: 1, type: 'Early Bird', amount: 45, status: 'completed' },
      { start: '2:00 PM', end: '3:00 PM', customer: 'David Chen', players: 1, type: 'Member Rate', amount: 55, status: 'upcoming' },
      { start: '6:00 PM', end: '8:00 PM', customer: 'James Thorne', players: 1, type: 'Peak Rate', amount: 75, status: 'upcoming' },
      { start: '8:00 PM', end: '10:00 PM', customer: 'Walk-in', players: 2, type: 'Peak Rate', amount: 140, status: 'upcoming' },
    ],
    3: [
      { start: '8:00 AM', end: '10:00 AM', customer: 'Walk-in', players: 2, type: 'Early Bird', amount: 85, status: 'completed' },
      { start: '10:30 AM', end: '12:30 PM', customer: 'Lisa Wong', players: 1, type: 'Early Bird', amount: 45, status: 'completed' },
      { start: '3:00 PM', end: '5:00 PM', customer: 'League - Eagles', players: 4, type: 'League', amount: 0, status: 'upcoming' },
      { start: '5:00 PM', end: '7:00 PM', customer: 'Robert Diaz', players: 2, type: 'Peak Rate', amount: 140, status: 'upcoming' },
    ],
    4: [
      { start: '8:30 AM', end: '10:30 AM', customer: 'Michael Sullivan', players: 1, type: 'Early Bird', amount: 45, status: 'completed' },
      { start: '1:15 PM', end: '2:45 PM', customer: 'Sandra Mitchell', players: 2, type: 'Off-Peak', amount: 77, status: 'upcoming' },
      { start: '3:00 PM', end: '5:00 PM', customer: 'Nina Patel', players: 3, type: 'Off-Peak', amount: 145, status: 'upcoming' },
      { start: '5:00 PM', end: '7:00 PM', customer: 'Amanda Foster', players: 4, type: 'Peak Rate', amount: 195, status: 'upcoming' },
    ],
    5: [
      { start: '10:00 AM', end: '11:00 AM', customer: 'Kevin Walsh', players: 2, type: 'Early Bird', amount: 85, status: 'completed' },
      { start: '12:30 PM', end: '2:00 PM', customer: 'Amanda Foster', players: 4, type: 'Off-Peak', amount: 77, status: 'completed' },
      { start: '3:00 PM', end: '5:00 PM', customer: 'League - Hawks', players: 4, type: 'League', amount: 0, status: 'upcoming' },
      { start: '6:00 PM', end: '8:00 PM', customer: 'Michael Sullivan', players: 2, type: 'Peak Rate', amount: 140, status: 'upcoming' },
    ],
    6: [
      { start: '8:00 AM', end: '10:00 AM', customer: 'Guest (Walk-in)', players: 2, type: 'Early Bird', amount: 85, status: 'completed' },
      { start: '2:00 PM', end: '4:00 PM', customer: 'Sarah Jenkins', players: 3, type: 'Off-Peak', amount: 95, status: 'upcoming' },
      { start: '6:00 PM', end: '8:00 PM', customer: 'Tom Bradley', players: 1, type: 'Peak Rate', amount: 64, status: 'upcoming' },
    ],
  };
  const parseTime = (t) => { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0; let h = parseInt(m[1]); if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12; if (m[3].toUpperCase() === 'AM' && h === 12) h = 0; return h * 60 + parseInt(m[2]); };
  return [...bookings, ...(extras[bay.id] || [])].sort((a, b) => parseTime(a.start) - parseTime(b.start));
};

function timeToMinutes(t) { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0; let h = parseInt(m[1]); if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12; if (m[3].toUpperCase() === 'AM' && h === 12) h = 0; return h * 60 + parseInt(m[2]); }

export default function BayView({ data }) {
  const [activeSection, setActiveSection] = useState('status');
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const baySchedule = data?.baySchedule;
  const bays = baySchedule?.bays || [];
  const occupied = bays.filter(b => b.status === 'active').length;
  const upcoming = bays.filter(b => b.status === 'upcoming').length;
  const available = bays.filter(b => b.status === 'available').length;

  const totalRevenue = bays.reduce((sum, bay) => sum + generateDaySchedule(bay).reduce((s, b) => s + (b.amount || 0), 0), 0);
  const completedRevenue = bays.reduce((sum, bay) => sum + generateDaySchedule(bay).filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0), 0);
  const activeRevenue = bays.reduce((sum, bay) => sum + generateDaySchedule(bay).filter(b => b.status === 'active').reduce((s, b) => s + (b.amount || 0), 0), 0);
  const upcomingRevenue = bays.reduce((sum, bay) => sum + generateDaySchedule(bay).filter(b => b.status === 'upcoming').reduce((s, b) => s + (b.amount || 0), 0), 0);

  const totalBooked = bays.reduce((sum, bay) => {
    const schedule = generateDaySchedule(bay);
    return sum + schedule.reduce((s, b) => s + (timeToMinutes(b.end) - timeToMinutes(b.start)), 0);
  }, 0);
  const totalAvailable = bays.length * 14 * 60;
  const overallUtilization = Math.round((totalBooked / totalAvailable) * 100);

  const hourlyBookings = bays.reduce((acc, bay) => {
    const schedule = generateDaySchedule(bay);
    schedule.forEach(b => {
      const hour = timeToMinutes(b.start) / 60;
      acc[hour] = (acc[hour] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        @media (max-width: 768px) {
          .bv-header { flex-direction: column !important; gap: 1rem !important; }
          .bv-header > div:last-child { width: 100% !important; }
          .bv-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bv-revenue-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bv-peak-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .bv-tab-row { overflow-x: auto !important; flex-wrap: nowrap !important; }
          .bv-tab-row button { white-space: nowrap; }
        }
        @media (max-width: 480px) {
          .bv-kpi-grid { grid-template-columns: 1fr !important; }
          .bv-revenue-grid { grid-template-columns: 1fr !important; }
          .bv-peak-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <div className="bv-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#fff', margin: 0 }}>Bay Management</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>
            {bays.length} Golfzon TWO simulators &middot; {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} &middot; {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" icon={CalendarIcon}>Schedule</Button>
          <Button variant="primary" size="sm" icon={PlusIcon}>Walk-in Booking</Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="bv-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <KPI label="Total Bays" value={bays.length} icon={SimBayIcon} color="#d4af37" subtext={`${occupied} active`} />
        <KPI label="Active Now" value={occupied} icon={TrendUpIcon} color="#22c55e" subtext={`${available} available, ${upcoming} upcoming`} />
        <KPI label="Today's Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarIcon} color="#d4af37" subtext={`$${completedRevenue.toLocaleString()} completed`} />
        <KPI label="Utilization" value={`${overallUtilization}%`} icon={ClockIcon} color={overallUtilization > 70 ? '#22c55e' : overallUtilization > 40 ? '#f59e0b' : '#ef4444'} subtext={`${Math.round(totalBooked / 60)}h booked of ${Math.round(totalAvailable / 60)}h`} />
      </div>

      {/* Section Tabs */}
      <div className="bv-tab-row" style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'status', label: 'Live Status', icon: SimBayIcon },
          { id: 'schedule', label: 'Booking Grid', icon: CalendarIcon },
          { id: 'revenue', label: 'Revenue', icon: DollarIcon },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
            padding: '0.75rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 600, fontFamily: 'var(--font-ui)',
            color: activeSection === tab.id ? '#d4af37' : 'rgba(255,255,255,0.4)',
            backgroundColor: activeSection === tab.id ? 'rgba(212,175,55,0.1)' : 'transparent',
            borderBottom: activeSection === tab.id ? '2px solid #d4af37' : '2px solid transparent',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-1px',
          }}>
            <tab.icon size={16} />{tab.label}
          </button>
        ))}
      </div>

      {/* Live Status - Uses BayStatus component from Dashboard */}
      {activeSection === 'status' && (
        <BayStatus
          baySchedule={baySchedule}
          onBookSlot={(slot) => console.log('Book slot:', slot)}
          onSelectCustomer={(id) => console.log('Select customer:', id)}
          onCallCustomer={(phone) => phone && window.open(`tel:${phone}`)}
          onExtendSession={(bayId) => console.log('Extend session:', bayId)}
          onEndSession={(bayId) => console.log('End session:', bayId)}
          onOrderFB={(bayId) => console.log('Order F&B:', bayId)}
        />
      )}

      {/* Booking Grid */}
      {activeSection === 'schedule' && (
        <BookingGrid
          baySchedule={baySchedule}
          hourlyBookings={hourlyBookings}
          onNewBooking={() => console.log('New booking')}
        />
      )}

      {/* Revenue Breakdown */}
      {activeSection === 'revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Revenue KPIs */}
          <div className="bv-revenue-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <RevenueCard label="Today's Total" value={`$${totalRevenue.toLocaleString()}`} color="#d4af37" />
            <RevenueCard label="Completed" value={`$${completedRevenue.toLocaleString()}`} color="#fff" />
            <RevenueCard label="Active Sessions" value={`$${activeRevenue.toLocaleString()}`} color="#22c55e" />
            <RevenueCard label="Upcoming" value={`$${upcomingRevenue.toLocaleString()}`} color="#f59e0b" />
          </div>

          {/* Per-Bay Revenue */}
          <Card variant="default" padding="lg">
            <CardHeader style={{ marginBottom: '1rem' }}>
              <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>REVENUE BY BAY</CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bays.map(bay => {
                const schedule = generateDaySchedule(bay);
                const bayRev = schedule.reduce((s, b) => s + (b.amount || 0), 0);
                const completed = schedule.filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0);
                const pct = totalRevenue > 0 ? Math.round((bayRev / totalRevenue) * 100) : 0;
                return (
                  <div key={bay.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', backgroundColor: '#141414', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '80px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: bay.status === 'active' ? '#22c55e' : bay.status === 'upcoming' ? '#f59e0b' : '#d4af37' }} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff' }}>{bay.name}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#d4af37', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', minWidth: '60px', textAlign: 'right' }}>${bayRev.toLocaleString()}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)', minWidth: '50px', textAlign: 'right' }}>${completed.toLocaleString()} done</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)', minWidth: '30px', textAlign: 'right' }}>{schedule.length}b</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Peak Hours */}
          <Card variant="default" padding="lg">
            <CardHeader style={{ marginBottom: '1rem' }}>
              <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>PEAK HOURS</CardTitle>
            </CardHeader>
            <div className="bv-peak-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
              {[8,9,10,11,12,13,14,15,16,17,18,19,20,21].map(h => {
                const count = hourlyBookings[h] || 0;
                const isPeak = count >= 4;
                return (
                  <div key={h} style={{ textAlign: 'center', padding: '0.75rem 0.5rem', backgroundColor: isPeak ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: '8px', border: `1px solid ${isPeak ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)'}` }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>{h > 12 ? `${h - 12}PM` : `${h}AM`}</div>
                    <div className="mono" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: isPeak ? '#d4af37' : '#fff' }}>{count}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>bays</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, icon: Icon, color, subtext }) {
  return (
    <div style={{ backgroundColor: '#141414', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#fff' }}>{value}</div>
      {subtext && <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>{subtext}</div>}
    </div>
  );
}

function RevenueCard({ label, value, color }) {
  return (
    <div style={{ backgroundColor: '#141414', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#fff' }}>{value}</div>
    </div>
  );
}
