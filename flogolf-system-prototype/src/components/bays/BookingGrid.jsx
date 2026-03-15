import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  ClockIcon, 
  CalendarIcon,
  PlusIcon,
  GridIcon,
} from '../icons';

const HOURS = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', 
  '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', 
  '8 PM', '9 PM', '10 PM'
];

export const BookingGrid = ({ baySchedule, hourlyBookings, onNewBooking }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  
  if (!hourlyBookings || !baySchedule) return null;
  
  const bayCount = baySchedule.bays.length;
  const now = new Date();
  const currentHour = now.getHours();
  
  const getHour24 = (label) => {
    const match = label.match(/(\d+)\s*(AM|PM)/);
    if (!match) return 0;
    let hour = parseInt(match[1]);
    if (match[2] === 'PM' && hour !== 12) hour += 12;
    if (match[2] === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  return (
    <Card variant="default" padding="lg">
      <CardHeader style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold)',
            }}>
              <GridIcon size={18} />
            </div>
            <div>
              <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                BOOKING GRID
              </CardTitle>
              <p style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-text-muted)',
                margin: 0,
              }}>
                Today's schedule across all {bayCount} Golfzon bays
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={PlusIcon} onClick={onNewBooking}>
            New Booking
          </Button>
        </div>
      </CardHeader>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '0.75rem',
        backgroundColor: 'var(--color-surface-elevated)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <LegendItem color="#22c55e" label="Active Now" />
        <LegendItem color="#f59e0b" label="Upcoming" />
        <LegendItem color="rgba(255,255,255,0.05)" label="Available" />
        <LegendItem color="rgba(255,255,255,0.02)" label="Past" />
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '800px' }}>
          {/* Header Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `100px repeat(${HOURS.length}, 1fr)`,
            gap: '2px',
            marginBottom: '4px',
          }}>
            <div style={{ 
              fontSize: 'var(--text-xs)', 
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              padding: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Bay
            </div>
            {HOURS.map((hour) => {
              const hour24 = getHour24(hour);
              const isCurrent = hour24 === currentHour;
              const isPast = hour24 < currentHour;
              
              return (
                <div
                  key={hour}
                  style={{
                    fontSize: '10px',
                    fontWeight: isCurrent ? 600 : 400,
                    color: isCurrent ? 'var(--color-gold)' : 
                           isPast ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                    textAlign: 'center',
                    padding: '0.5rem 0.25rem',
                    backgroundColor: isCurrent ? 'var(--color-gold-muted)' : 'transparent',
                    borderRadius: '4px',
                  }}
                >
                  {isCurrent && (
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-gold)',
                      margin: '0 auto 2px',
                      animation: 'pulse 2s ease-in-out infinite',
                    }} />
                  )}
                  {hour}
                </div>
              );
            })}
          </div>

          {/* Bay Rows */}
          {baySchedule.bays.map((bay, bayIdx) => (
            <div
              key={bay.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `100px repeat(${HOURS.length}, 1fr)`,
                gap: '2px',
                marginBottom: '2px',
                opacity: 0,
                animation: `fadeInLeft 0.4s ease-out ${bayIdx * 60}ms forwards`,
              }}
            >
              {/* Bay Label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.5rem',
                backgroundColor: 'var(--color-surface-elevated)',
                borderRadius: '4px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: bay.status === 'active' ? '#22c55e' : 
                                   bay.status === 'upcoming' ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                }} />
                Bay {bay.id}
              </div>

              {/* Time Slots */}
              {HOURS.map((hour, hourIdx) => {
                const hour24 = getHour24(hour);
                const isCurrent = hour24 === currentHour;
                const isPast = hour24 < currentHour;
                
                const isBooked = bay.startHour !== null && 
                                 hour24 >= bay.startHour && 
                                 hour24 < (bay.startHour + bay.duration);
                const isActive = isBooked && bay.status === 'active' && isCurrent;
                const isUpcoming = isBooked && bay.status === 'upcoming';
                
                const slotKey = `${bay.id}-${hour}`;
                const isHovered = hoveredSlot === slotKey;
                
                let bgColor = 'rgba(255,255,255,0.03)';
                let borderColor = 'transparent';
                
                if (isActive) {
                  bgColor = '#22c55e';
                  borderColor = '#16a34a';
                } else if (isUpcoming) {
                  bgColor = '#f59e0b';
                  borderColor = '#d97706';
                } else if (isBooked && isPast) {
                  bgColor = 'rgba(255,255,255,0.08)';
                } else if (isPast) {
                  bgColor = 'rgba(255,255,255,0.02)';
                }
                
                return (
                  <div
                    key={slotKey}
                    onMouseEnter={() => setHoveredSlot(slotKey)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    style={{
                      height: '28px',
                      backgroundColor: bgColor,
                      borderRadius: '3px',
                      border: isHovered && !isActive && !isUpcoming && !isPast 
                        ? '1.5px dashed var(--color-gold)' 
                        : borderColor ? `1px solid ${borderColor}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: !isBooked && !isPast ? 'pointer' : 'default',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {isHovered && !isBooked && !isPast && (
                      <div style={{
                        position: 'absolute',
                        top: '-28px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '3px 8px',
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-gold)',
                        color: 'var(--color-text-primary)',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                      }}>
                        Click to book
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: 'var(--color-surface-elevated)',
        borderRadius: '8px',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={12} />
          Showing {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
        <span>
          Click any empty slot to create a booking
        </span>
      </div>
    </Card>
  );
};

const LegendItem = ({ color, label }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  }}>
    <div style={{
      width: '12px',
      height: '12px',
      borderRadius: '2px',
      backgroundColor: color,
      border: '1px solid rgba(255,255,255,0.1)',
    }} />
    {label}
  </div>
);

export default BookingGrid;
