import { useState, useEffect, useCallback } from 'react';
import { ACTIVITY_MESSAGES } from '../data';

// Activity types with icon keys (no emojis)
const ACTIVITY_TYPES = {
  BOOKING: { iconKey: 'SimBay', label: 'Booking', color: 'var(--color-success)' },
  MEMBERSHIP: { iconKey: 'Star', label: 'Membership', color: 'var(--color-gold)' },
  EVENT: { iconKey: 'Events', label: 'Event', color: 'var(--color-info)' },
  LESSON: { iconKey: 'Lesson', label: 'Lesson', color: 'var(--color-success)' },
  PAYMENT: { iconKey: 'Dollar', label: 'Payment', color: 'var(--color-success)' },
  REVIEW: { iconKey: 'Star', label: 'Review', color: 'var(--color-warning)' },
};

export function useLiveActivity(maxItems = 5) {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Initialize with some activities
    const initial = ACTIVITY_MESSAGES.slice(0, 3).map((activity, index) => ({
      ...activity,
      id: `activity-${Date.now()}-${index}`,
      timestamp: Date.now() - ((index + 1) * 3 * 60 * 1000),
      formattedTime: formatTimeAgo((index + 1) * 3 * 60),
    }));
    setActivities(initial);

    // Simulate new activities coming in
    const interval = setInterval(() => {
      if (isPaused) return;
      
      const randomIndex = Math.floor(Math.random() * ACTIVITY_MESSAGES.length);
      const randomActivity = ACTIVITY_MESSAGES[randomIndex];
      const newActivity = {
        ...randomActivity,
        id: `activity-${Date.now()}`,
        timestamp: Date.now(),
        formattedTime: 'Just now',
        isNew: true,
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, maxItems);
        return updated;
      });
    }, 8000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [maxItems, isPaused]);

  // Update relative times
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => ({
          ...activity,
          formattedTime: formatTimeAgo(Date.now() - activity.timestamp),
          isNew: false,
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { 
    activities, 
    activityTypes: ACTIVITY_TYPES,
    isPaused,
    setIsPaused,
  };
}

function formatTimeAgo(ms) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function useBayStatus() {
  const [bays, setBays] = useState([
    { id: 1, name: 'Bay 1', status: 'occupied', customer: 'Sandra M.', timeRemaining: 45, totalTime: 120 },
    { id: 2, name: 'Bay 2', status: 'available', customer: null, timeRemaining: 0, totalTime: 0 },
    { id: 3, name: 'Bay 3', status: 'occupied', customer: 'Patricia O.', timeRemaining: 35, totalTime: 120 },
    { id: 4, name: 'Bay 4', status: 'upcoming', customer: 'Michael S.', timeRemaining: 0, totalTime: 0, startTime: '6:00 PM' },
    { id: 5, name: 'Bay 5', status: 'upcoming', customer: 'Jennifer P.', timeRemaining: 0, totalTime: 0, startTime: '8:00 PM' },
    { id: 6, name: 'Bay 6', status: 'available', customer: null, timeRemaining: 0, totalTime: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBays(prev => 
        prev.map(bay => {
          if (bay.status === 'occupied' && bay.timeRemaining > 0) {
            const newTime = bay.timeRemaining - 1;
            return {
              ...bay,
              timeRemaining: newTime,
              status: newTime <= 0 ? 'available' : 'occupied',
              customer: newTime <= 0 ? null : bay.customer,
            };
          }
          return bay;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: bays.length,
    occupied: bays.filter(b => b.status === 'occupied').length,
    upcoming: bays.filter(b => b.status === 'upcoming').length,
    available: bays.filter(b => b.status === 'available').length,
  };

  return { bays, stats };
}

export function useOccupancySimulation() {
  const [occupancy, setOccupancy] = useState({
    rate: 82,
    trend: 'up',
    historical: [65, 72, 85, 90, 82, 78, 85, 88, 92, 86, 80, 82],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOccupancy(prev => {
        const change = (Math.random() - 0.5) * 6;
        const newRate = Math.min(100, Math.max(0, prev.rate + change));
        return {
          rate: Math.round(newRate),
          trend: change > 0 ? 'up' : 'down',
          historical: [...prev.historical.slice(1), Math.round(newRate)],
        };
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return occupancy;
}

export function useCustomerActivity(customerId, customers) {
  const customer = customers?.find(c => c.id === customerId);
  const [isOnline, setIsOnline] = useState(Math.random() > 0.5);

  useEffect(() => {
    if (!customer) return;

    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3);
    }, 20000);

    return () => clearInterval(interval);
  }, [customer]);

  return {
    customer,
    isOnline,
  };
}
