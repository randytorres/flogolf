import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useLiveActivity } from '../../hooks/useLiveData';
import { 
  SimBayIcon,
  StarIcon,
  EventsIcon,
  LessonIcon,
  DollarIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
} from '../icons';

const ICON_MAP = {
  SimBay: SimBayIcon,
  Star: StarIcon,
  Events: EventsIcon,
  Lesson: LessonIcon,
  Dollar: DollarIcon,
};

const ACTIVITY_COLORS = {
  BOOKING: '#22c55e',
  MEMBERSHIP: '#d4af37',
  EVENT: '#3b82f6',
  LESSON: '#22c55e',
  PAYMENT: '#d4af37',
  REVIEW: '#f59e0b',
};

const ACTIVITY_TYPES = {
  BOOKING: { iconKey: 'SimBay', label: 'Booking', color: '#22c55e' },
  MEMBERSHIP: { iconKey: 'Star', label: 'Membership', color: '#d4af37' },
  EVENT: { iconKey: 'Events', label: 'Event', color: '#3b82f6' },
  LESSON: { iconKey: 'Lesson', label: 'Lesson', color: '#22c55e' },
  PAYMENT: { iconKey: 'Dollar', label: 'Payment', color: '#d4af37' },
  REVIEW: { iconKey: 'Star', label: 'Review', color: '#f59e0b' },
};

export const LiveActivityFeed = ({ maxItems = 5, className = '', style = {}, externalActivities = [] }) => {
  const { activities: liveActivities, isPaused, setIsPaused } = useLiveActivity(maxItems);
  const [isHovered, setIsHovered] = useState(false);
  const [mergedActivities, setMergedActivities] = useState([]);

  // Merge external activities (from Dashboard events) with live activities
  useEffect(() => {
    const external = (externalActivities || []).map(a => ({
      ...a,
      id: a.id || `ext-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: a.timestamp || Date.now(),
      formattedTime: 'Just now',
      isNew: true,
    }));

    const all = [...external, ...liveActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxItems);
    
    setMergedActivities(all);
  }, [externalActivities, liveActivities, maxItems]);

  const displayActivities = mergedActivities.length > 0 ? mergedActivities : liveActivities;

  return (
    <div
      style={{
        backgroundColor: '#141414',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      className={className}
    >
      <div style={{ 
        padding: '1rem 1.25rem',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isPaused ? '#f59e0b' : '#22c55e',
            animation: isPaused ? 'none' : 'pulse 2s ease-in-out infinite',
            transition: 'background-color 0.3s ease',
          }} />
          <span style={{ 
            fontSize: 'var(--text-sm)', 
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {isPaused ? 'PAUSED' : 'LIVE ACTIVITY'}
          </span>
        </div>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d4af37';
            e.currentTarget.style.color = '#d4af37';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
          }}
          title={isPaused ? 'Resume feed' : 'Pause feed'}
        >
          {isPaused ? <PlayIcon size={12} /> : <PauseIcon size={12} />}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          overflowY: 'auto',
          padding: '0.75rem',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayActivities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            index={index}
            isNew={activity.isNew && index === 0}
            isPaused={isPaused || isHovered}
          />
        ))}

        {displayActivities.length === 0 && (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 'var(--text-sm)',
          }}>
            Waiting for activity...
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, index, isNew, isPaused }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const typeConfig = ACTIVITY_TYPES[activity.type] || ACTIVITY_TYPES.BOOKING;
  const Icon = ICON_MAP[typeConfig.iconKey] || SimBayIcon;
  const color = ACTIVITY_COLORS[activity.type] || 'rgba(255,255,255,0.4)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        padding: '0.5rem 0.625rem',
        backgroundColor: isNew ? 'rgba(212, 175, 55, 0.06)' : 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        border: `1px solid ${isNew ? 'rgba(212, 175, 55, 0.12)' : 'transparent'}`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 80}ms`,
      }}
    >
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '6px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={13} color={color} />
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#fff',
          margin: 0,
          lineHeight: 1.4,
          fontWeight: 500,
        }}>
          {activity.message}
        </p>
        <span style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          marginTop: '0.25rem',
        }}>
          <ClockIcon size={9} />
          {activity.formattedTime}
        </span>
      </div>

      {isNew && (
        <span style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
          marginTop: '0.375rem',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      )}
    </div>
  );
};

export default LiveActivityFeed;
