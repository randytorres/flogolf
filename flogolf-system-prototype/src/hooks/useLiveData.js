import { useState, useEffect, useRef } from 'react';
import { ACTIVITY_MESSAGES, MOCK_DATA } from '../data';

// Activity types with icon keys
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
  const messageIndexRef = useRef(0);

  useEffect(() => {
    // Initialize with the first few activities in chronological order
    const initialCount = Math.min(3, ACTIVITY_MESSAGES.length);
    const initial = ACTIVITY_MESSAGES.slice(0, initialCount).map((activity, index) => ({
      ...activity,
      id: `activity-${Date.now()}-${index}`,
      timestamp: Date.now() - ((initialCount - index) * 4 * 60 * 1000),
      formattedTime: formatTimeAgo((initialCount - index) * 4 * 60),
    }));
    setActivities(initial);
    messageIndexRef.current = initialCount;

    // Simulate new activities coming in sequentially
    const interval = setInterval(() => {
      if (isPaused) return;

      const idx = messageIndexRef.current % ACTIVITY_MESSAGES.length;
      const nextActivity = ACTIVITY_MESSAGES[idx];
      messageIndexRef.current = idx + 1;

      const newActivity = {
        ...nextActivity,
        id: `activity-${Date.now()}`,
        timestamp: Date.now(),
        formattedTime: 'Just now',
        isNew: true,
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, maxItems);
        return updated;
      });
    }, 10000 + Math.random() * 5000);

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
  const saugusData = MOCK_DATA.Saugus;

  const [bays, setBays] = useState(() =>
    saugusData.baySchedule.bays.map(bay => ({
      id: bay.id,
      name: bay.name,
      status: bay.status === 'active' ? 'occupied' : bay.status,
      customer: bay.customer ? bay.customer.name.split(' ').map((w, i) => i === 0 ? w : w[0] + '.').join(' ') : null,
      timeRemaining: bay.session?.timeRemaining || 0,
      totalTime: bay.session?.duration || 0,
      startTime: bay.session?.startTime || null,
    }))
  );

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
        const change = (Math.random() - 0.5) * 4;
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
