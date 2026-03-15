import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  style = {},
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    borderRadius: '9999px',
    whiteSpace: 'nowrap',
  };

  const sizeStyles = {
    sm: {
      padding: '0.125rem 0.5rem',
      fontSize: 'var(--text-xs)',
      height: '20px',
    },
    md: {
      padding: '0.25rem 0.75rem',
      fontSize: 'var(--text-sm)',
      height: '24px',
    },
    lg: {
      padding: '0.375rem 1rem',
      fontSize: 'var(--text-base)',
      height: '28px',
    },
  };

  const variantStyles = {
    default: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.6)',
    },
    primary: {
      backgroundColor: 'var(--color-brass-muted)',
      color: '#d4af37',
    },
    success: {
      backgroundColor: 'var(--color-success-light)',
      color: '#fff',
    },
    warning: {
      backgroundColor: 'var(--color-warning-light)',
      color: '#f59e0b',
    },
    danger: {
      backgroundColor: 'var(--color-danger-light)',
      color: '#ef4444',
    },
    marine: {
      backgroundColor: 'var(--color-flomarine)',
      color: 'white',
    },
    gold: {
      background: 'var(--gradient-gold)',
      color: '#0a0a0a',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255,255,255,0.15)',
    },
    info: {
      backgroundColor: 'var(--color-info-light)',
      color: '#3b82f6',
    },
  };

  const dotStyles = dot ? {
    '::before': {
      content: '""',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
      animation: pulse ? 'pulse 2s ease-in-out infinite' : 'none',
    },
  } : {};

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            animation: pulse ? 'pulse 2s ease-in-out infinite' : 'none',
          }}
        />
      )}
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, ...props }) => {
  const statusMap = {
    active: { variant: 'success', label: 'Active' },
    pending: { variant: 'warning', label: 'Pending' },
    inactive: { variant: 'default', label: 'Inactive' },
    danger: { variant: 'danger', label: 'Attention' },
    new: { variant: 'marine', label: 'New' },
    hot: { variant: 'danger', label: 'Hot', pulse: true },
  };

  const config = statusMap[status] || statusMap.inactive;

  return (
    <Badge variant={config.variant} dot={config.pulse} pulse={config.pulse} {...props}>
      {config.label}
    </Badge>
  );
};
