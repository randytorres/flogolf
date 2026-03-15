import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useCountUpCurrency } from '../../hooks/useCountUp';
import { 
  SimBayIcon, 
  StarIcon, 
  LessonIcon, 
  EventsIcon,
  GiftCardIcon,
} from '../icons';

const CATEGORY_COLORS = {
  bookings: '#22c55e',
  memberships: '#d4af37',
  lessons: '#3b82f6',
  events: '#8b5cf6',
  retail: '#f59e0b',
};

const CATEGORY_ICONS = {
  bookings: SimBayIcon,
  memberships: StarIcon,
  lessons: LessonIcon,
  events: EventsIcon,
  retail: GiftCardIcon,
};

export const RevenueBreakdown = ({
  total,
  categories,
  title = "Today's Revenue",
  animated = true,
  className = '',
  style = {},
}) => {
  const { formatted: formattedTotal } = useCountUpCurrency(total, 1500, '$', animated);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Parse total if it's a string
  const numericTotal = typeof total === 'string' 
    ? parseInt(total.replace(/[^0-9]/g, ''), 10) || 0 
    : total;

  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .map(([key, value]) => ({
      key,
      value,
      percentage: (value / numericTotal) * 100,
      color: CATEGORY_COLORS[key] || '#6b7280',
      icon: CATEGORY_ICONS[key] || SimBayIcon,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  return (
    <Card variant="default" padding="lg" className={className} style={style}>
      <CardHeader style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
            {title.toUpperCase()}
          </CardTitle>
          <span className="mono" style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--color-gold)',
          }}>
            {formattedTotal}
          </span>
        </div>
      </CardHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sortedCategories.map((category, index) => (
          <RevenueBar
            key={category.key}
            category={category}
            index={index}
            isVisible={isVisible}
            total={numericTotal}
          />
        ))}
      </div>
    </Card>
  );
};

const RevenueBar = ({ category, index, isVisible, total }) => {
  const Icon = category.icon;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: `${category.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={12} color={category.color} />
          </div>
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            textTransform: 'capitalize',
          }}>
            {category.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="mono" style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}>
            ${category.value.toLocaleString()}
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            minWidth: '40px',
            textAlign: 'right',
          }}>
            {category.percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '6px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: isVisible ? `${category.percentage}%` : '0%',
          backgroundColor: category.color,
          borderRadius: '3px',
          transition: `width 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 150}ms`,
        }} />
      </div>
    </div>
  );
};

export default RevenueBreakdown;
