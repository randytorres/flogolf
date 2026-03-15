import React, { forwardRef } from 'react';

export const Card = forwardRef(({
  children,
  className = '',
  style = {},
  hoverable = false,
  animated = false,
  animationDelay = 0,
  variant = 'default',
  padding = 'lg',
  onClick,
}, ref) => {
  const baseStyles = {
    background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
    borderRadius: 'var(--card-radius)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all var(--transition-spring)',
    overflow: 'hidden',
  };

  const paddingStyles = {
    sm: { padding: '1rem' },
    md: { padding: '1.5rem' },
    lg: { padding: '2rem' },
    xl: { padding: '2.5rem' },
  };

  const variantStyles = {
    default: {},
    elevated: {
      boxShadow: 'var(--shadow-lg)',
    },
    marine: {
      background: 'var(--gradient-marine)',
      color: 'white',
    },
    gold: {
      background: 'var(--gradient-gold)',
      color: '#0a0a0a',
    },
  };

  const hoverStyles = hoverable ? {
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-6px)',
      boxShadow: 'var(--shadow-xl), 0 0 0 1px rgba(212, 175, 55, 0.3)',
    },
  } : {};

  const animationStyles = animated ? {
    opacity: 0,
    animation: `cardEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}ms forwards`,
  } : {};

  return (
    <div
      ref={ref}
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      style={{
        ...baseStyles,
        ...paddingStyles[padding],
        ...variantStyles[variant],
        ...hoverStyles,
        ...animationStyles,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, style = {} }) => (
  <div style={{ marginBottom: '1.5rem', ...style }}>
    {children}
  </div>
);

export const CardTitle = ({ children, style = {} }) => (
  <h3 style={{
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    ...style,
  }}>
    {children}
  </h3>
);

export const CardDescription = ({ children, style = {} }) => (
  <p style={{
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    margin: '0.5rem 0 0 0',
    ...style,
  }}>
    {children}
  </p>
);

export const CardContent = ({ children, style = {} }) => (
  <div style={{ ...style }}>
    {children}
  </div>
);

export const CardFooter = ({ children, style = {} }) => (
  <div style={{
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    ...style,
  }}>
    {children}
  </div>
);
