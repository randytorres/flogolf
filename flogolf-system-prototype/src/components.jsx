import React from 'react';

// Reusable Card Component
export const Card = ({ children, className = '', style = {} }) => (
  <div className={`card ${className}`} style={style}>
    {children}
  </div>
);

// Scoreboard Metric (for dashboards)
export const Scorecard = ({ title, value, subtitle, trend, isPositive }) => (
  <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyItems: 'center' }}>
    <span style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {title}
    </span>
    <span className="text-display" style={{ fontSize: '2.5rem', color: 'var(--color-flomarine)', lineHeight: 1 }}>
      {value}
    </span>
    {(subtitle || trend) && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        {trend && (
          <span style={{ 
            color: isPositive ? '#fff' : '#ef4444',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: isPositive ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {trend}
          </span>
        )}
        {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>{subtitle}</span>}
      </div>
    )}
  </Card>
);

// Status Badge
export const Badge = ({ children, type = 'default' }) => {
  const getColors = () => {
    switch(type) {
      case 'success': return { bg: 'rgba(40,167,69,0.15)', text: 'var(--color-forest)' };
      case 'warning': return { bg: 'rgba(255,193,7,0.2)', text: '#856404' };
      case 'danger': return { bg: 'rgba(220,53,69,0.1)', text: 'var(--color-danger)' };
      case 'brand': return { bg: 'var(--color-brass)', text: 'var(--color-flomarine)' };
      default: return { bg: 'var(--color-cream-dark)', text: 'var(--color-charcoal-light)' };
    }
  };
  const colors = getColors();
  
  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
    }}>
      {children}
    </span>
  );
};

// Section Header
export const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
    <div>
      <h2 className="text-display" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{title}</h2>
      {subtitle && <p style={{ margin: 0, color: 'var(--color-charcoal-light)' }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
