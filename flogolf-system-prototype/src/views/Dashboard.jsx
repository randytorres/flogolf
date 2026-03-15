import React, { useState, useCallback, useEffect } from 'react';
import { StatCard, StatGrid } from '../components/stats';
import { LiveActivityFeed } from '../components/activity';
import { RevenueAtRisk } from '../components/revenue';
import { BayStatus, BookingGrid } from '../components/bays';
import { RevenueBreakdown } from '../components/revenue';
import { Card, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { BookingModal, CustomerDetailModal } from '../components/modals';
import { 
  CalendarIcon,
  WarningIcon,
  UsersIcon,
  ClockIcon,
  TrendUpIcon,
  TrendDownIcon,
  ArrowRightIcon,
  PhoneIcon,
  MailIcon,
  ActiveIcon,
  DollarIcon,
  FlagIcon,
  TrophyIcon,
  ReportIcon,
  LocationIcon,
  SimBayIcon,
  CheckIcon,
} from '../components/icons';
import { BUSINESS_INFO } from '../data';

// Shared activity store (simple event bus)
const activityListeners = new Set();
let activityQueue = [];

export function pushActivity(type, message) {
  const activity = {
    type,
    message,
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    formattedTime: 'Just now',
    isNew: true,
  };
  activityQueue = [activity, ...activityQueue].slice(0, 20);
  activityListeners.forEach(fn => fn(activity));
}

export default function Dashboard({ data, onNavigate }) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerDetailOpen, setCustomerDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Mutable state
  const [baySchedule, setBaySchedule] = useState(data.baySchedule);
  const [todayBookings, setTodayBookings] = useState(data.dashboard.todayBookings);
  const [todayRevenue, setTodayRevenue] = useState(data.dashboard.todayRevenue);

  const { dashboard, customers, hourlyBookings, leagueStandings, locationName } = data;

  // Action items from customers needing attention
  const actionItems = customers.filter(c => 
    c.automationStatus?.includes('Win-back') || 
    c.automationStatus?.includes('Renewal') ||
    c.automationStatus?.includes('Re-engagement') ||
    c.tags?.includes('Flight Risk')
  ).slice(0, 4);

  // Customers in automation flows
  const inFlowCustomers = customers.filter(c => 
    !c.automationStatus?.includes('Active') && c.automationStatus !== 'VIP Treatment Queue'
  );

  // Handle booking creation
  const handleSaveBooking = useCallback((booking) => {
    // Update bay schedule
    setBaySchedule(prev => {
      if (!prev) return prev;
      const newBays = prev.bays.map(bay => {
        if (bay.id === parseInt(booking.bayId)) {
          return {
            ...bay,
            status: 'upcoming',
            customer: {
              id: booking.customerId,
              name: booking.customerName,
              phone: booking.customerPhone,
              memberType: booking.bookingTypeLabel || 'Standard',
              isMember: booking.bookingType?.includes('member'),
              players: booking.playerCount,
            },
            session: {
              startTime: formatTime12(booking.time),
              endTime: formatTime12(booking.endTime),
              duration: booking.durationSlots * 30,
              paidAmount: booking.price,
              paymentStatus: 'pending',
              bookingType: booking.bookingTypeLabel || 'Standard',
            },
            golf: booking.gameType === 'course_play' ? {
              course: 'TBD',
              currentHole: 0,
              totalHoles: 18,
              gameMode: 'Course Play',
            } : null,
          };
        }
        return bay;
      });
      
      // Remove used slot from available
      const newSlots = prev.availableSlots.filter(s => 
        !(s.bayId === parseInt(booking.bayId) && s.time === booking.time)
      );
      
      return { ...prev, bays: newBays, availableSlots: newSlots };
    });

    // Update stats
    setTodayBookings(prev => prev + 1);
    setTodayRevenue(prev => {
      const num = parseInt(prev.replace(/[$,]/g, ''));
      return `$${(num + (booking.price || 0)).toLocaleString()}`;
    });

    // Push activity
    const customer = customers.find(c => c.id === booking.customerId);
    const displayName = customer?.name || booking.customerName;
    pushActivity('BOOKING', `${displayName} booked Bay ${booking.bayId} — ${formatTime12(booking.time)}, ${booking.playerCount} player${booking.playerCount > 1 ? 's' : ''}`);
    pushActivity('PAYMENT', `Booking created: Bay ${booking.bayId}, $${booking.price} (${booking.pricingTier || 'Standard'})`);

    setBookingModalOpen(false);
    setSelectedSlot(null);
  }, [customers]);

  // Handle extend session
  const handleExtendSession = useCallback((bayId) => {
    setBaySchedule(prev => {
      if (!prev) return prev;
      const newBays = prev.bays.map(bay => {
        if (bay.id === bayId && bay.status === 'active') {
          const newDuration = bay.session.duration + 30;
          const [startH, startM] = parseTime12(bay.session.startTime);
          const endMinutes = startH * 60 + startM + newDuration;
          const endH = Math.floor(endMinutes / 60);
          const endM = endMinutes % 60;
          return {
            ...bay,
            session: {
              ...bay.session,
              duration: newDuration,
              timeRemaining: bay.session.timeRemaining + 30,
              endTime: `${endH > 12 ? endH - 12 : endH}:${endM.toString().padStart(2, '0')} ${endH >= 12 ? 'PM' : 'AM'}`,
              paidAmount: bay.session.paidAmount + 35,
            },
          };
        }
        return bay;
      });
      return { ...prev, bays: newBays };
    });
    
    const bay = baySchedule?.bays.find(b => b.id === bayId);
    if (bay?.customer) {
      pushActivity('BOOKING', `${bay.customer.name} extended session on Bay ${bayId} (+30 min)`);
    }
  }, [baySchedule]);

  // Handle end session
  const handleEndSession = useCallback((bayId) => {
    const bay = baySchedule?.bays.find(b => b.id === bayId);
    
    setBaySchedule(prev => {
      if (!prev) return prev;
      const newBays = prev.bays.map(b => {
        if (b.id === bayId) {
          return {
            ...b,
            status: 'available',
            customer: null,
            session: null,
            golf: null,
          };
        }
        return b;
      });
      return { ...prev, bays: newBays };
    });

    if (bay?.customer) {
      pushActivity('BOOKING', `${bay.customer.name} checked out of Bay ${bayId}`);
    }
  }, [baySchedule]);

  // Handle walk-in (opens booking modal with bay pre-selected)
  const handleBookSlot = useCallback((slot) => {
    setSelectedSlot(slot);
    setBookingModalOpen(true);
  }, []);

  const handleSelectCustomer = useCallback((customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setCustomerDetailOpen(true);
    }
  }, [customers]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        @media (max-width: 768px) {
          .dash-header-row {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .dash-header-row > div:last-child {
            width: 100% !important;
            display: flex !important;
            gap: 0.5rem !important;
          }
          .dash-header-row > div:last-child button {
            flex: 1 !important;
          }
          .dash-two-col {
            grid-template-columns: 1fr !important;
          }
          .dash-action-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .dash-header-row > div:last-child {
            flex-direction: column !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <div className="dash-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="section-subtitle">
              Operations overview for {locationName || 'Saugus'} location
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" size="sm" icon={ReportIcon}>
              Reports
            </Button>
            <Button variant="primary" size="sm" icon={CalendarIcon} onClick={() => setBookingModalOpen(true)}>
              New Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Top Row - Live Activity + Revenue at Risk */}
      <div className="dash-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <LiveActivityFeed maxItems={5} externalActivities={activityQueue} />
        <RevenueAtRisk 
          amount={dashboard.revenueAtRisk}
          breakdown={{
            expiringMemberships: dashboard.expiringMemberships,
            unpaidInvoices: 3,
            atRiskCustomers: inFlowCustomers.length,
          }}
          onAction={() => {}}
        />
      </div>

      {/* Stats Grid */}
      <div className="dash-stat-grid">
      <StatGrid columns={5}>
        <StatCard
          title="Today's Bookings"
          value={todayBookings}
          trend="+12%"
          trendValue="vs last week"
          trendDirection="up"
          subtitle="vs 24 last week"
          icon={CalendarIcon}
          animated={true}
          animationDelay={0}
          sparklineData={[18, 21, 19, 24, 22, 28]}
        />
        <StatCard
          title="Today's Revenue"
          value={todayRevenue}
          trend="+8%"
          trendDirection="up"
          subtitle="vs $5,020 last week"
          icon={DollarIcon}
          animated={true}
          animationDelay={100}
        />
        <StatCard
          title="Active Members"
          value={dashboard.activeMembers}
          trend="+12"
          trendDirection="up"
          subtitle="This month"
          icon={UsersIcon}
          animated={true}
          animationDelay={200}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${Math.round((baySchedule?.bays.filter(b => b.status === 'active').length / baySchedule?.bays.length) * 100) || 0}%`}
          subtitle={`Peak at ${dashboard.peakHour}`}
          icon={TrendUpIcon}
          color="success"
          animated={true}
          animationDelay={300}
        />
        <StatCard
          title="Revenue at Risk"
          value={dashboard.revenueAtRisk}
          trend="Action Required"
          trendDirection="down"
          icon={WarningIcon}
          color="danger"
          animated={true}
          animationDelay={400}
        />
      </StatGrid>
      </div>

      {/* Live Bay Status */}
      {baySchedule && (
        <BayStatus 
          baySchedule={baySchedule}
          onBookSlot={handleBookSlot}
          onSelectCustomer={handleSelectCustomer}
          onCallCustomer={(phone) => window.open(`tel:${phone}`)}
          onExtendSession={handleExtendSession}
          onEndSession={handleEndSession}
          onOrderFB={(bayId) => onNavigate('fnb', null, { bayId })}
        />
      )}

      {/* Booking Grid */}
      {hourlyBookings && baySchedule && (
        <BookingGrid 
          baySchedule={baySchedule}
          hourlyBookings={hourlyBookings}
          onNewBooking={() => {
            setSelectedSlot(null);
            setBookingModalOpen(true);
          }}
        />
      )}

      {/* Action Items Row */}
      {actionItems.length > 0 && (
        <Card variant="default" padding="lg">
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <WarningIcon size={18} />
              </div>
              <div>
                <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                  REQUIRES ATTENTION
                </CardTitle>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}>
                  {actionItems.length} customers need follow-up
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('customer_360')}>
              View All
              <ArrowRightIcon size={14} />
            </Button>
          </CardHeader>

          <div className="dash-action-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(4, actionItems.length)}, 1fr)`, gap: '1rem' }}>
            {actionItems.map((customer, index) => (
              <ActionCard 
                key={customer.id} 
                customer={customer} 
                index={index}
                onClick={() => handleSelectCustomer(customer.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Bottom Row - Revenue Breakdown + League Standings */}
      <div className="dash-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <RevenueBreakdown
          total={todayRevenue}
          categories={{
            bookings: 2800,
            memberships: 1400,
            lessons: 720,
            events: 300,
            retail: 200,
          }}
          title="Today's Revenue"
        />
        
        {/* League Standings */}
        {leagueStandings && leagueStandings.length > 0 && (
          <Card variant="default" padding="lg">
            <CardHeader style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(212,175,55,0.15)',
                  color: '#d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TrophyIcon size={18} />
                </div>
                <div>
                  <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                    WINTER LEAGUE
                  </CardTitle>
                  <p style={{ 
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--color-text-muted)',
                    margin: 0,
                  }}>
                    Season standings
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {leagueStandings.slice(0, 6).map((player, index) => (
                <div
                  key={player.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    backgroundColor: index < 3 ? 'rgba(255,255,255,0.03)' : 'transparent',
                    borderRadius: '8px',
                    opacity: 0,
                    animation: `fadeInLeft 0.4s ease-out ${index * 60}ms forwards`,
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? '#d4af37' : 
                                     index === 1 ? '#c0c0c0' : 
                                     index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.05)',
                    color: index < 3 ? '#0a0a0a' : 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                  }}>
                    {player.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: '#fff',
                    }}>
                      {player.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      {player.team}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: '#d4af37',
                    }}>
                      {player.points}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.3)',
                    }}>
                      {player.record}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedSlot(null);
        }}
        onSave={handleSaveBooking}
        preselectedSlot={selectedSlot}
        customers={customers}
      />

      <CustomerDetailModal
        isOpen={customerDetailOpen}
        onClose={() => {
          setCustomerDetailOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onNavigateToCustomer={(id) => {
          setCustomerDetailOpen(false);
          onNavigate('customer_360', id);
        }}
      />
    </div>
  );
}

function ActionCard({ customer, index, onClick }) {
  const isWinback = customer.automationStatus?.includes('Win-back') || 
                    customer.automationStatus?.includes('Re-engagement');
  const isRenewal = customer.automationStatus?.includes('Renewal');
  const isUpgrade = customer.automationStatus?.includes('Upgrade');
  
  const config = {
    icon: isWinback ? WarningIcon : isRenewal ? ClockIcon : isUpgrade ? TrendUpIcon : ActiveIcon,
    color: isWinback ? '#ef4444' : isRenewal ? '#f59e0b' : isUpgrade ? '#3b82f6' : '#fff',
    bgColor: isWinback ? 'rgba(239,68,68,0.12)' : isRenewal ? 'rgba(245,158,11,0.12)' : isUpgrade ? 'rgba(59,130,246,0.12)' : 'rgba(34,197,94,0.12)',
    action: isWinback ? 'Win-back' : isRenewal ? 'Renewal' : isUpgrade ? 'Upgrade' : 'Follow-up',
  };

  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      style={{
        padding: '1.25rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: 0,
        animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: config.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={16} color={config.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: '#fff',
          }}>
            {customer.name}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: config.color,
            fontWeight: 500,
          }}>
            {config.action}
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '1rem',
        lineHeight: 1.4,
      }}>
        {customer.automationStatus}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={(e) => { e.stopPropagation(); window.open(`tel:${customer.phone}`); }}
          style={{
            flex: 1,
            padding: '0.5rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
          }}
        >
          <PhoneIcon size={12} />
          Call
        </button>
        <button
          style={{
            flex: 1,
            padding: '0.5rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: '#0a0a0a',
            backgroundColor: '#d4af37',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
          }}
        >
          <MailIcon size={12} />
          Email
        </button>
      </div>
    </div>
  );
}

// Helpers
function formatTime12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

function parseTime12(time12) {
  if (!time12) return [0, 0];
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [0, 0];
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return [h, m];
}
