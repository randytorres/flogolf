import React, { useState, useEffect, useMemo } from 'react';

import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  SimBayIcon,
  ClockIcon,
  UsersIcon,
  PhoneIcon,
  DollarIcon,
  PlusIcon,
  CloseIcon,
  EditIcon,
  SearchIcon,
  CocktailIcon,
  CheckIcon,
  ArrowRightIcon,
  LocationIcon,
  StarIcon,
  FlagIcon,
  WarningIcon,
  TrendUpIcon,
  CalendarIcon,
  ActiveIcon,
} from '../icons';

// Generate a mock daily schedule for each bay
const generateDaySchedule = (bay) => {
  const schedule = [];
  const openHour = 8;
  const closeHour = 22;
  
  // Known bookings from bay data
  const bookings = [];
  
  if (bay.status === 'active' && bay.session) {
    bookings.push({
      start: bay.session.startTime,
      end: bay.session.endTime,
      customer: bay.customer?.name || 'Unknown',
      players: bay.customer?.players || 1,
      type: bay.session.bookingType,
      amount: bay.session.paidAmount,
      status: 'active',
      phone: bay.customer?.phone,
    });
  }
  
  if (bay.status === 'upcoming' && bay.session) {
    bookings.push({
      start: bay.session.startTime,
      end: bay.session.endTime,
      customer: bay.customer?.name || 'Unknown',
      players: bay.customer?.players || 1,
      type: bay.session.bookingType,
      amount: bay.session.paidAmount,
      status: 'upcoming',
      phone: bay.customer?.phone,
    });
  }
  
  // Add some historical and future bookings for realism
  const bayId = bay.id;
  if (bayId === 1) {
    bookings.push({ start: '9:00 AM', end: '11:00 AM', customer: 'Walk-in', players: 2, type: 'Standard', amount: 90, status: 'completed', phone: null });
    bookings.push({ start: '3:00 PM', end: '5:00 PM', customer: 'Tom Bradley', players: 1, type: 'Member Rate', amount: 75, status: 'upcoming', phone: '(781) 555-0201' });
    bookings.push({ start: '6:00 PM', end: '8:00 PM', customer: 'Rachel Kim', players: 3, type: 'Peak Rate', amount: 195, status: 'upcoming', phone: '(617) 555-0389' });
  } else if (bayId === 2) {
    bookings.push({ start: '10:00 AM', end: '12:00 PM', customer: 'James Thorne', players: 1, type: 'Member Rate', amount: 45, status: 'completed', phone: '(781) 555-0155' });
    bookings.push({ start: '2:00 PM', end: '3:00 PM', customer: 'David Chen', players: 1, type: 'Member Rate', amount: 55, status: 'upcoming', phone: '(617) 555-0311' });
    bookings.push({ start: '4:00 PM', end: '6:00 PM', customer: 'Corporate - TechStart', players: 4, type: 'Corporate', amount: 150, status: 'upcoming', phone: '(617) 555-0400' });
    bookings.push({ start: '7:00 PM', end: '9:00 PM', customer: 'Walk-in', players: 2, type: 'Standard', amount: 150, status: 'upcoming', phone: null });
  } else if (bayId === 3) {
    bookings.push({ start: '8:00 AM', end: '10:00 AM', customer: 'Lisa Wong', players: 1, type: 'Early Bird', amount: 45, status: 'completed', phone: '(617) 555-0267' });
    bookings.push({ start: '10:30 AM', end: '12:30 PM', customer: 'Mark Stevens', players: 2, type: 'Early Bird', amount: 85, status: 'completed', phone: '(781) 555-0190' });
    bookings.push({ start: '4:00 PM', end: '6:00 PM', customer: 'League - Eagles', players: 4, type: 'League', amount: 0, status: 'upcoming', phone: null });
    bookings.push({ start: '7:00 PM', end: '9:00 PM', customer: 'Chris Martin', players: 2, type: 'Peak Rate', amount: 140, status: 'upcoming', phone: '(617) 555-0345' });
  } else if (bayId === 4) {
    bookings.push({ start: '9:00 AM', end: '11:00 AM', customer: 'PGA Lesson - Dave', players: 1, type: 'Lesson', amount: 0, status: 'completed', phone: null });
    bookings.push({ start: '11:30 AM', end: '1:30 PM', customer: 'Anna Costa', players: 2, type: 'Off-Peak', amount: 100, status: 'completed', phone: '(781) 555-0222' });
    bookings.push({ start: '3:00 PM', end: '5:00 PM', customer: 'Nina Patel', players: 3, type: 'Off-Peak', amount: 145, status: 'upcoming', phone: '(617) 555-0377' });
  } else if (bayId === 5) {
    bookings.push({ start: '10:00 AM', end: '12:00 PM', customer: 'Walk-in', players: 1, type: 'Early Bird', amount: 45, status: 'completed', phone: null });
    bookings.push({ start: '1:00 PM', end: '3:00 PM', customer: 'Kevin Walsh', players: 2, type: 'Off-Peak', amount: 100, status: 'completed', phone: '(781) 555-0166' });
  } else if (bayId === 6) {
    bookings.push({ start: '8:00 AM', end: '10:00 AM', customer: 'Sarah Jenkins', players: 4, type: 'Early Bird', amount: 120, status: 'completed', phone: '(617) 555-0198' });
    bookings.push({ start: '11:00 AM', end: '1:00 PM', customer: 'Mike OBrien', players: 1, type: 'Off-Peak', amount: 55, status: 'completed', phone: '(781) 555-0233' });
    bookings.push({ start: '3:00 PM', end: '5:00 PM', customer: 'League - Hawks', players: 4, type: 'League', amount: 0, status: 'upcoming', phone: null });
    bookings.push({ start: '6:00 PM', end: '8:00 PM', customer: 'Robert Diaz', players: 2, type: 'Peak Rate', amount: 140, status: 'upcoming', phone: '(617) 555-0411' });
  }
  
  return bookings.sort((a, b) => {
    const parseTime = (t) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12;
      if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    return parseTime(a.start) - parseTime(b.start);
  });
};

export const BayStatus = ({ baySchedule, onBookSlot, onSelectCustomer, onCallCustomer, onExtendSession, onEndSession, onOrderFB }) => {
  const [expandedBay, setExpandedBay] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  if (!baySchedule) return null;
  
  const { bays, availableSlots } = baySchedule;
  
  const occupied = bays.filter(b => b.status === 'active').length;
  const upcoming = bays.filter(b => b.status === 'upcoming').length;
  const available = bays.filter(b => b.status === 'available').length;
  
  return (
    <div style={{
      backgroundColor: '#141414',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d2f0a 0%, #1a4725 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SimBayIcon size={20} color="#d4af37" />
          </div>
          <div>
            <div style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 700, 
              color: '#fff',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem' 
            }}>
              SIMULATOR STATUS
              <span style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 400,
              }}>
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
            }}>
              {bays.length} Golfzon bays &middot; {occupied} active &middot; {available} available &middot; {upcoming} upcoming
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <StatusPill count={occupied} label="Active" color="#22c55e" />
          <StatusPill count={upcoming} label="Upcoming" color="#f59e0b" />
          <StatusPill count={available} label="Open" color="#d4af37" />
        </div>
      </div>

      {/* Bay Grid — 2 columns */}
      <div className="bay-grid-responsive" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '0.75rem',
        padding: '1rem',
      }}>
        {bays.map((bay) => (
          <BayCard
            key={bay.id}
            bay={bay}
            currentTime={currentTime}
            isExpanded={expandedBay === bay.id}
            onToggle={() => setExpandedBay(expandedBay === bay.id ? null : bay.id)}
            onSelectCustomer={onSelectCustomer}
            onCallCustomer={onCallCustomer}
            onBookSlot={onBookSlot}
            onExtendSession={onExtendSession}
            onEndSession={onEndSession}
            onOrderFB={onOrderFB}
            availableSlots={availableSlots.filter(s => s.bayId === bay.id)}
          />
        ))}
      </div>
    </div>
  );
};

const BayCard = ({ bay, currentTime, isExpanded, onToggle, onSelectCustomer, onCallCustomer, onBookSlot, onExtendSession, onEndSession, onOrderFB, availableSlots }) => {
  const isActive = bay.status === 'active';
  const isUpcoming = bay.status === 'upcoming';
  const isAvailable = bay.status === 'available';
  
  const [timeRemaining, setTimeRemaining] = useState(bay.session?.timeRemaining || 0);
  
  useEffect(() => {
    if (!isActive || !bay.session) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev <= 0 ? prev - (1/60) : prev - (1/60));
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, bay.session]);
  
  const timeRemainingMins = Math.floor(Math.abs(timeRemaining));
  const timeRemainingSecs = Math.floor((Math.abs(timeRemaining) % 1) * 60);
  const isOvertime = timeRemaining <= 0 && isActive;
  const isEndingSoon = timeRemainingMins < 15 && timeRemainingMins > 0 && isActive;
  
  const sessionProgress = bay.session 
    ? Math.min(100, ((bay.session.duration - Math.max(0, timeRemaining)) / bay.session.duration) * 100)
    : 0;
  
  const statusColor = isOvertime ? '#ef4444' : isEndingSoon ? '#f59e0b' : isActive ? '#22c55e' : isUpcoming ? '#f59e0b' : '#d4af37';
  const statusLabel = isOvertime ? 'OVERTIME' : isEndingSoon ? 'ENDING' : isActive ? 'ACTIVE' : isUpcoming ? 'UPCOMING' : 'OPEN';
  
  // Generate day schedule when expanded
  const daySchedule = useMemo(() => generateDaySchedule(bay), [bay.id, bay.status]);
  
  // Revenue calculations
  const todaysRevenue = daySchedule.reduce((sum, b) => sum + (b.amount || 0), 0);
  const completedRevenue = daySchedule.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.amount || 0), 0);
  const upcomingRevenue = daySchedule.filter(b => b.status === 'upcoming' || b.status === 'active').reduce((sum, b) => sum + (b.amount || 0), 0);
  
  // Utilization
  const totalBookedMinutes = daySchedule.reduce((sum, b) => {
    const parseTime = (t) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12;
      if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    return sum + (parseTime(b.end) - parseTime(b.start));
  }, 0);
  const totalAvailableMinutes = 14 * 60; // 8am to 10pm
  const utilizationPercent = Math.round((totalBookedMinutes / totalAvailableMinutes) * 100);
  
  return (
    <div style={{
      borderRadius: '12px',
      border: `1px solid ${isExpanded ? 'rgba(212,175,55,0.3)' : isOvertime ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
      backgroundColor: isOvertime ? 'rgba(239,68,68,0.03)' : isExpanded ? 'rgba(212,175,55,0.02)' : 'rgba(255,255,255,0.015)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      {/* Compact Header Row */}
      <div 
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          gap: '0.75rem',
        }}
      >
        {/* Bay Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '90px' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff' }}>{bay.name}</span>
          <div style={{
            padding: '0.125rem 0.375rem',
            borderRadius: '4px',
            backgroundColor: `${statusColor}15`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}>
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: statusColor,
              animation: isActive && !isOvertime ? 'pulse 2s ease-in-out infinite' : isOvertime ? 'pulse 1s ease-in-out infinite' : 'none',
            }} />
            <span style={{ fontSize: '9px', fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Live Timer (active only) */}
        {isActive && bay.session && (
          <div style={{
            minWidth: '95px',
            textAlign: 'center',
            padding: '0.25rem 0.5rem',
            backgroundColor: isOvertime ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
            borderRadius: '6px',
          }}>
            <div className="mono" style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: isOvertime ? '#ef4444' : isEndingSoon ? '#f59e0b' : '#fff',
              lineHeight: 1,
            }}>
              {isOvertime ? '+' : ''}{String(Math.floor(timeRemainingMins / 60)).padStart(2, '0')}:{String(timeRemainingMins % 60).padStart(2, '0')}:{String(timeRemainingSecs).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
              {isOvertime ? 'over' : 'left'}
            </div>
          </div>
        )}

        {/* Info line */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isActive && bay.customer && (
            <div style={{ fontSize: 'var(--text-xs)', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {bay.customer.name} &middot; {bay.customer.players}p &middot; {bay.golf?.course || 'Practice'}
            </div>
          )}
          {isUpcoming && bay.customer && (
            <div style={{ fontSize: 'var(--text-xs)', color: '#fff', fontWeight: 500 }}>
              {bay.customer.name} &middot; {bay.session?.startTime} &middot; {bay.customer.players}p
            </div>
          )}
          {isAvailable && (
            <div style={{ fontSize: 'var(--text-xs)', color: bay.nextReservation?.customerName ? 'rgba(255,255,255,0.5)' : '#fff' }}>
              {bay.nextReservation?.customerName ? `Next: ${bay.nextReservation.customerName} at ${bay.nextReservation.time}` : 'Open — no reservations'}
            </div>
          )}
        </div>

        {/* Revenue + Utilization */}
        <div style={{ textAlign: 'right', minWidth: '70px' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#d4af37', fontFamily: 'var(--font-mono)' }}>
            ${todaysRevenue}
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
            {utilizationPercent}% util
          </div>
        </div>

        {/* Expand indicator */}
        <div style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease',
          fontSize: '10px',
        }}>
          ▼
        </div>
      </div>

      {/* Progress bar for active sessions */}
      {isActive && (
        <div style={{
          height: '3px',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}>
          <div style={{
            height: '100%',
            width: `${sessionProgress}%`,
            backgroundColor: statusColor,
            transition: 'width 1s linear',
          }} />
        </div>
      )}

      {/* Expanded Detail Panel */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '1rem',
        }}>
          {/* Top Stats Row */}
          <div className="bay-mini-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            <MiniStat label="Today's Revenue" value={`$${todaysRevenue}`} color="#d4af37" />
            <MiniStat label="Completed" value={`$${completedRevenue}`} color="#22c55e" />
            <MiniStat label="Upcoming" value={`$${upcomingRevenue}`} color="#f59e0b" />
            <MiniStat label="Utilization" value={`${utilizationPercent}%`} color={utilizationPercent > 70 ? '#22c55e' : utilizationPercent > 40 ? '#f59e0b' : '#ef4444'} />
          </div>

          {/* Calendar Timeline */}
          <DayTimeline 
            bookings={daySchedule} 
            currentTime={currentTime} 
            onBookSlot={onBookSlot}
            bayId={bay.id}
          />

          {/* Bay Info */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '0.5rem',
            marginBottom: '1rem',
            padding: '0.625rem',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
          }}>
            <InfoRow label="Simulator" value={bay.type || 'Golfzon TWO'} />
            <InfoRow label="Status" value="Online" valueColor="#22c55e" />
            <InfoRow label="Bookings Today" value={daySchedule.length.toString()} />
            <InfoRow label="Players Today" value={daySchedule.reduce((s, b) => s + b.players, 0).toString()} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {isActive && (
              <>
                <ActionButton icon={ClockIcon} label="Extend +30m" onClick={(e) => { e.stopPropagation(); onExtendSession?.(bay.id); }} color="#d4af37" />
                <ActionButton icon={CheckIcon} label="End Session" onClick={(e) => { e.stopPropagation(); onEndSession?.(bay.id); }} color="#22c55e" />
                <ActionButton icon={PhoneIcon} label={bay.customer?.phone || 'Call'} onClick={(e) => { e.stopPropagation(); onCallCustomer?.(bay.customer?.phone); }} color="#fff" />
                <ActionButton icon={UsersIcon} label="Customer" onClick={(e) => { e.stopPropagation(); onSelectCustomer?.(bay.customer?.id); }} color="#fff" />
                <ActionButton icon={CocktailIcon} label="Order F&B" onClick={(e) => { e.stopPropagation(); onOrderFB?.(bay.id); }} color="#d4af37" />
              </>
            )}
            {isUpcoming && (
              <>
                <ActionButton icon={PhoneIcon} label={bay.customer?.phone || 'Call'} onClick={(e) => { e.stopPropagation(); onCallCustomer?.(bay.customer?.phone); }} color="#fff" />
                <ActionButton icon={CheckIcon} label="Check In" onClick={(e) => { e.stopPropagation(); }} color="#22c55e" />
                <ActionButton icon={CloseIcon} label="No-Show" onClick={(e) => { e.stopPropagation(); }} color="#ef4444" />
                <ActionButton icon={EditIcon} label="Modify" onClick={(e) => { e.stopPropagation(); }} color="#d4af37" />
              </>
            )}
            {isAvailable && (
              <>
                <ActionButton icon={PlusIcon} label="Walk-in" onClick={(e) => { e.stopPropagation(); onBookSlot?.({ bayId: bay.id }); }} color="#d4af37" />
                <ActionButton icon={SearchIcon} label="Book" onClick={(e) => { e.stopPropagation(); onBookSlot?.({ bayId: bay.id }); }} color="#fff" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DayTimeline = ({ bookings, currentTime, onBookSlot, bayId }) => {
  const OPEN_HOUR = 8;
  const CLOSE_HOUR = 22;
  const SLOT_HEIGHT = 32; // px per 30 min
  
  // Build all time slots for the day
  const slots = useMemo(() => {
    const result = [];
    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
      result.push({ hour: h, minute: 0, label: formatHour(h, 0) });
      result.push({ hour: h, minute: 30, label: formatHour(h, 30) });
    }
    return result;
  }, []);
  
  // Build timeline blocks (bookings + gaps)
  const blocks = useMemo(() => {
    const result = [];
    
    // Sort bookings by start time
    const sorted = [...bookings].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    
    let cursor = OPEN_HOUR * 60; // minutes from midnight, start at 8am
    
    sorted.forEach((booking, idx) => {
      const startMin = timeToMinutes(booking.start);
      const endMin = timeToMinutes(booking.end);
      
      // Gap before this booking
      if (startMin > cursor) {
        result.push({
          type: 'gap',
          startMin: cursor,
          endMin: startMin,
          startLabel: minutesToTime(cursor),
          endLabel: minutesToTime(startMin),
        });
      }
      
      // The booking itself
      result.push({
        type: 'booking',
        startMin,
        endMin,
        startLabel: booking.start,
        endLabel: booking.end,
        booking,
      });
      
      cursor = endMin;
    });
    
    // Gap after last booking until close
    if (cursor < CLOSE_HOUR * 60) {
      result.push({
        type: 'gap',
        startMin: cursor,
        endMin: CLOSE_HOUR * 60,
        startLabel: minutesToTime(cursor),
        endLabel: minutesToTime(CLOSE_HOUR * 60),
      });
    }
    
    // If no bookings at all, one big gap
    if (bookings.length === 0) {
      result.push({
        type: 'gap',
        startMin: OPEN_HOUR * 60,
        endMin: CLOSE_HOUR * 60,
        startLabel: minutesToTime(OPEN_HOUR * 60),
        endLabel: minutesToTime(CLOSE_HOUR * 60),
      });
    }
    
    return result;
  }, [bookings]);
  
  // Current time indicator position
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const nowPercent = ((nowMinutes - OPEN_HOUR * 60) / ((CLOSE_HOUR - OPEN_HOUR) * 60)) * 100;
  const showNowLine = nowMinutes >= OPEN_HOUR * 60 && nowMinutes <= CLOSE_HOUR * 60;
  
  const totalHeight = (CLOSE_HOUR - OPEN_HOUR) * 2 * SLOT_HEIGHT;
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        Today's Schedule
      </div>
      
      <div style={{ display: 'flex', gap: '0' }}>
        {/* Time labels column */}
        <div style={{ width: '48px', flexShrink: 0 }}>
          {slots.filter(s => s.minute === 0).map((slot, idx) => (
            <div key={idx} style={{
              height: SLOT_HEIGHT * 2,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: '0.5rem',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'rgba(255,255,255,0.3)',
              paddingTop: '0px',
            }}>
              {slot.label}
            </div>
          ))}
        </div>
        
        {/* Timeline column */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Grid lines */}
          <div style={{ height: totalHeight, position: 'relative' }}>
            {slots.map((slot, idx) => (
              <div key={idx} style={{
                position: 'absolute',
                top: idx * SLOT_HEIGHT,
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: slot.minute === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              }} />
            ))}
            
            {/* Blocks */}
            {blocks.map((block, idx) => {
              const top = ((block.startMin - OPEN_HOUR * 60) / ((CLOSE_HOUR - OPEN_HOUR) * 60)) * totalHeight;
              const height = ((block.endMin - block.startMin) / ((CLOSE_HOUR - OPEN_HOUR) * 60)) * totalHeight;
              
              if (block.type === 'gap') {
                const slotDuration = block.endMin - block.startMin;
                // Only show clickable gaps that are at least 30 min
                if (slotDuration < 30) return null;
                
                return (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); onBookSlot?.({ bayId, time: block.startLabel.replace(/\s(AM|PM)/i, '').padStart(5, '0') }); }}
                    style={{
                      position: 'absolute',
                      top,
                      left: '2px',
                      right: '2px',
                      height: height - 2,
                      backgroundColor: 'rgba(212,175,55,0.03)',
                      border: '1px dashed rgba(212,175,55,0.12)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      padding: '0 0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)';
                    }}
                  >
                    {height > 30 ? (
                      <span style={{
                        fontSize: '10px',
                        color: 'rgba(212,175,55,0.4)',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}>
                        <PlusIcon size={10} />
                        {block.startLabel} – {block.endLabel}
                      </span>
                    ) : (
                      <span style={{ fontSize: '9px', color: 'rgba(212,175,55,0.3)' }}>
                        <PlusIcon size={8} />
                      </span>
                    )}
                  </div>
                );
              }
              
              // Booking block
              const b = block.booking;
              const isCompleted = b.status === 'completed';
              const isActiveBooking = b.status === 'active';
              const isUpcomingBooking = b.status === 'upcoming';
              
              const bgColor = isActiveBooking ? 'rgba(34,197,94,0.15)' : isCompleted ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.1)';
              const borderColor = isActiveBooking ? 'rgba(34,197,94,0.3)' : isCompleted ? 'rgba(255,255,255,0.08)' : 'rgba(245,158,11,0.2)';
              const accentColor = isActiveBooking ? '#22c55e' : isCompleted ? 'rgba(255,255,255,0.3)' : '#f59e0b';
              
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: top + 1,
                    left: '2px',
                    right: '2px',
                    height: Math.max(height - 3, 24),
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderLeft: `3px solid ${accentColor}`,
                    borderRadius: '6px',
                    padding: '0.25rem 0.5rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#fff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {b.customer}
                    </span>
                    {b.amount > 0 && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        color: '#d4af37',
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}>
                        ${b.amount}
                      </span>
                    )}
                  </div>
                  {height > 36 && (
                    <div style={{
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.35)',
                      display: 'flex',
                      gap: '0.375rem',
                      marginTop: '0.125rem',
                    }}>
                      <span>{b.start}–{b.end}</span>
                      <span>&middot;</span>
                      <span>{b.players}p</span>
                      <span>&middot;</span>
                      <span>{b.type}</span>
                    </div>
                  )}
                  {isActiveBooking && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '4px',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      animation: 'pulse 2s ease-in-out infinite',
                    }} />
                  )}
                </div>
              );
            })}
            
            {/* Now line */}
            {showNowLine && (
              <div style={{
                position: 'absolute',
                top: (nowPercent / 100) * totalHeight,
                left: '-4px',
                right: 0,
                height: '2px',
                backgroundColor: '#ef4444',
                zIndex: 10,
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-3px',
                  top: '-3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                }} />
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '-8px',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#ef4444',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  padding: '0 0.25rem',
                  borderRadius: '3px',
                }}>
                  NOW
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helpers
function timeToMinutes(time12) {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12;
  if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return formatHour(h, m);
}

function formatHour(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

const MiniStat = ({ label, value, color }) => (
  <div style={{
    padding: '0.5rem 0.625rem',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.04)',
  }}>
    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>
      {label}
    </div>
    <div className="mono" style={{ fontSize: 'var(--text-base)', fontWeight: 700, color }}>
      {value}
    </div>
  </div>
);

const InfoRow = ({ label, value, valueColor = '#fff' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{label}</span>
    <span style={{ fontSize: '10px', fontWeight: 600, color: valueColor }}>{value}</span>
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, color = '#fff' }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.375rem 0.625rem',
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '10px',
      color,
      fontWeight: 600,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.06)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
  >
    <Icon size={11} />
    {label}
  </button>
);

const StatusPill = ({ count, label, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.625rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.06)',
  }}>
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: `0 0 6px ${color}`,
    }} />
    <span className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff' }}>{count}</span>
    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
  </div>
);

export default BayStatus;
