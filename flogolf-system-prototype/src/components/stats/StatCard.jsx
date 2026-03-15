import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { useCountUp } from '../../hooks/useCountUp';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  valuePrefix = '',
  valueSuffix = '',
  trend = null,
  trendValue = null,
  trendDirection = 'neutral',
  subtitle,
  icon: Icon,
  color = 'default',
  animated = true,
  animationDelay = 0,
  sparklineData = null,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Extract numeric value for counting
  const numericValue = typeof value === 'string' 
    ? parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
    : value;
  
  const { count } = useCountUp(animated ? numericValue : 0, 1500, false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const colorStyles = {
    default: {
      iconBg: 'rgba(255,255,255,0.06)',
      iconColor: '#fff',
    },
    marine: {
      iconBg: 'var(--color-flomarine)',
      iconColor: '#d4af37',
    },
    gold: {
      iconBg: 'var(--color-brass-muted)',
      iconColor: 'var(--color-brass)',
    },
    success: {
      iconBg: 'var(--color-success-light)',
      iconColor: 'var(--color-success)',
    },
    danger: {
      iconBg: 'var(--color-danger-light)',
      iconColor: 'var(--color-danger)',
    },
  };

  const styles = colorStyles[color] || colorStyles.default;

  const getTrendIcon = () => {
    if (trendDirection === 'up') return <TrendingUp size={14} />;
    if (trendDirection === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendColor = () => {
    if (trendDirection === 'up') return 'var(--color-success)';
    if (trendDirection === 'down') return 'var(--color-danger)';
    return 'var(--color-text-muted)';
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      animated={animated}
      animationDelay={animationDelay}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}ms`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: styles.iconBg,
            color: styles.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={18} />
          </div>
        )}
        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-text-secondary)',
        }}>
          {title}
        </span>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span
          className="mono"
          style={{
            fontSize: 'var(--text-5xl)',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {valuePrefix}
          {animated ? count.toLocaleString() : numericValue.toLocaleString()}
          {valueSuffix}
        </span>
        
        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: getTrendColor(),
              backgroundColor: trendDirection === 'up' ? 'var(--color-success-light)' : 
                              trendDirection === 'down' ? 'var(--color-danger-light)' : 'rgba(255,255,255,0.04)',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
            }}
          >
            {getTrendIcon()}
            {trend}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          {subtitle}
        </p>
      )}

      {/* Sparkline */}
      {sparklineData && (
        <div style={{ marginTop: '0.5rem' }}>
          <Sparkline data={sparklineData} color={styles.iconColor} />
        </div>
      )}
    </Card>
  );
};

const Sparkline = ({ data, color }) => {
  if (!data || data.length < 2) return null;

  const width = 120;
  const height = 30;
  const padding = 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
      />
      <polygon
        fill="url(#sparklineGradient)"
        points={`${padding},${height} ${points} ${width - padding},${height}`}
      />
    </svg>
  );
};

export const StatGrid = ({ children, columns = 4, gap = '1.5rem' }) => (
  <div className="stat-grid-responsive" style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
  }}>
    {children}
  </div>
);
