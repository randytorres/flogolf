import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { 
  CalendarIcon,
  DollarIcon,
  EventsIcon,
  PlusIcon,
  FilterIcon,
  ClockIcon,
  ActiveIcon,
  WarningIcon,
  TrendUpIcon,
  UsersIcon,
  MailIcon,
  PhoneIcon,
  MoreIcon,
} from '../components/icons';

const STAGES = [
  { id: 'inquiry', name: 'Inquiry', icon: EventsIcon, color: '#f59e0b', description: 'New leads' },
  { id: 'quote', name: 'Quote', icon: DollarIcon, color: '#3b82f6', description: 'Proposals sent' },
  { id: 'deposit', name: 'Deposit', icon: ActiveIcon, color: '#22c55e', description: 'Deposit received' },
  { id: 'booked', name: 'Booked', icon: CalendarIcon, color: '#d4af37', description: 'Confirmed events' },
];

export default function EventPipeline({ data }) {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const pipeline = STAGES.map(stage => ({
    ...stage,
    events: data.events.filter(e => e.stage.toLowerCase() === stage.id) || [],
  }));

  const totalValue = data.events.reduce((sum, e) => sum + (e.valueNum || 0), 0);
  const monthlyGoal = 40000;
  const progressPercent = Math.min(100, (totalValue / monthlyGoal) * 100);

  const closingThisWeek = data.events.filter(e => {
    if (!e.date || e.stage === 'Booked') return false;
    const eventDate = new Date(e.date);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return eventDate <= weekFromNow;
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Event Pipeline</h1>
          <p className="section-subtitle">
            Track private events and corporate bookings
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" icon={FilterIcon}>
            Filter
          </Button>
          <Button variant="primary" size="sm" icon={PlusIcon}>
            New Event
          </Button>
        </div>
      </div>

      {/* Pipeline Value Summary */}
      <Card variant="default" padding="lg" style={{ 
        background: 'var(--gradient-primary)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              opacity: 0.7,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem',
            }}>
              Pipeline Value
            </div>
            <div className="mono" style={{ 
              fontSize: 'var(--text-4xl)', 
              fontWeight: 600,
              color: 'var(--color-gold)',
            }}>
              ${totalValue.toLocaleString()}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '2.5rem', textAlign: 'right' }}>
            <div>
              <div className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {closingThisWeek}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', opacity: 0.7, color: 'var(--color-text-secondary)' }}>
                Closing this week
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {data.events.length}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', opacity: 0.7, color: 'var(--color-text-secondary)' }}>
                Total events
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-gold)' }}>
                {Math.round(progressPercent)}%
              </div>
              <div style={{ fontSize: 'var(--text-sm)', opacity: 0.7, color: 'var(--color-text-secondary)' }}>
                to goal
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--gradient-gold)',
              borderRadius: '3px',
              transition: 'width 1s ease-out',
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontSize: 'var(--text-sm)',
            opacity: 0.7,
          }}>
            <span>Progress toward monthly goal</span>
            <span className="mono">${totalValue.toLocaleString()} / ${monthlyGoal.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1rem',
        flex: 1,
        alignItems: 'start',
        overflowX: 'auto',
      }}>
        {pipeline.map((column, colIndex) => (
          <div 
            key={column.id}
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              borderRadius: '12px',
              padding: '1rem',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(255,255,255,0.06)',
              opacity: 0,
              animation: `fadeInUp 0.5s ease-out ${colIndex * 100}ms forwards`,
            }}
          >
            {/* Column Header */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.75rem',
                borderBottom: `2px solid ${column.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <column.icon size={16} color={column.color} />
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-secondary)',
                  }}>
                    {column.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="mono" style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: column.color,
                  }}>
                    ${column.events.reduce((sum, e) => sum + (e.valueNum || 0), 0).toLocaleString()}
                  </span>
                  <Badge variant="default">{column.events.length}</Badge>
                </div>
              </div>
              <p style={{
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                margin: '0.5rem 0 0',
              }}>
                {column.description}
              </p>
            </div>

            {/* Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {column.events.map((event, evtIndex) => (
                <EventCard
                  key={event.id}
                  event={event}
                  stage={column.id}
                  index={evtIndex}
                  isHovered={hoveredEvent === event.id}
                  isSelected={selectedEvent === event.id}
                  onHover={() => setHoveredEvent(event.id)}
                  onLeave={() => setHoveredEvent(null)}
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                />
              ))}

              {column.events.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-sm)',
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}>
                  No events
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="secondary" size="sm" icon={CalendarIcon}>
          View Calendar
        </Button>
        <Button variant="ghost" size="sm" icon={TrendUpIcon}>
          Pipeline Analytics
        </Button>
      </div>
    </div>
  );
}

function EventCard({ event, stage, index, isHovered, isSelected, onHover, onLeave, onClick }) {
  const getStageConfig = () => {
    switch (stage) {
      case 'inquiry':
        return { 
          badge: { text: 'Needs follow-up', color: '#f59e0b', icon: WarningIcon },
          borderColor: 'rgba(245, 158, 11, 0.3)',
        };
      case 'quote':
        return {
          badge: { text: 'Awaiting response', color: '#3b82f6', icon: ClockIcon },
          borderColor: 'rgba(59, 130, 246, 0.3)',
        };
      case 'deposit':
        return {
          badge: { text: 'Deposit received', color: '#fff', icon: ActiveIcon },
          borderColor: 'rgba(34, 197, 94, 0.3)',
        };
      default:
        return { badge: null, borderColor: 'transparent' };
    }
  };

  const config = getStageConfig();
  const BadgeIcon = config.badge?.icon;
  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const daysUntil = event.date ? Math.floor((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const isUpcoming = daysUntil > 0 && daysUntil <= 7 && stage !== 'booked';

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderRadius: '10px',
        padding: isSelected ? '1rem' : '0.875rem',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        border: `1px solid ${isHovered ? 'rgba(212, 175, 55, 0.4)' : isSelected ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 80}ms forwards`,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem',
      }}>
        <h4 style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
          lineHeight: 1.3,
        }}>
          {event.name}
        </h4>
        {isUpcoming && (
          <Badge variant="danger" size="sm" pulse>
            {daysUntil}d
          </Badge>
        )}
      </div>

      {/* Contact */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        marginBottom: '0.75rem',
      }}>
        {event.contact}
      </div>

      {/* Expanded details when selected */}
      {isSelected && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: 'var(--color-surface-elevated)',
          borderRadius: '8px',
          marginBottom: '0.75rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              <UsersIcon size={12} />
              {event.guests} guests &middot; {event.hours} hours
            </div>
            {event.notes && (
              <p style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-text-secondary)',
                margin: '0.25rem 0 0',
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}>
                "{event.notes}"
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button style={{
              flex: 1,
              padding: '0.375rem 0.5rem',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}>
              <MailIcon size={10} />
              Email
            </button>
            <button style={{
              flex: 1,
              padding: '0.375rem 0.5rem',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--color-surface-dark)',
              backgroundColor: 'var(--color-gold)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}>
              <PhoneIcon size={10} />
              Call
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
        }}>
          <CalendarIcon size={12} />
          {eventDate}
        </div>
        <div className="mono" style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-gold)',
        }}>
          {event.value}
        </div>
      </div>

      {/* Stage-specific badge */}
      {config.badge && BadgeIcon && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          backgroundColor: `${config.badge.color}10`,
          borderRadius: '6px',
          fontSize: 'var(--text-xs)',
          color: config.badge.color,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
        }}>
          <BadgeIcon size={12} />
          {config.badge.text}
        </div>
      )}
    </div>
  );
}
