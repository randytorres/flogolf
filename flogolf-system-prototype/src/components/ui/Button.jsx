import React, { forwardRef } from 'react';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--button-radius)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
  };

  const sizeStyles = {
    sm: {
      padding: '0.5rem 0.75rem',
      fontSize: 'var(--text-sm)',
      height: '32px',
    },
    md: {
      padding: '0.625rem 1rem',
      fontSize: 'var(--text-base)',
      height: '40px',
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: 'var(--text-base)',
      height: '48px',
    },
  };

  const variantStyles = {
    primary: {
      background: 'var(--gradient-marine)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.06)',
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      color: '#d4af37',
      border: '2px solid var(--color-brass)',
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
    },
    gold: {
      background: 'var(--gradient-gold)',
      color: '#0a0a0a',
      boxShadow: 'var(--shadow-sm)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: 'white',
    },
  };

  const hoverStyles = !disabled && !loading ? {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: variant === 'primary' || variant === 'gold' ? 'var(--shadow-md)' : 'none',
    },
    ':active': {
      transform: 'scale(0.97)',
    },
  } : {};

  const disabledStyles = disabled || loading ? {
    opacity: 0.6,
    transform: 'none',
  } : {};

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${className}`}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...hoverStyles,
        ...disabledStyles,
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
      {...props}
    >
      {loading && (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
    </button>
  );
});

Button.displayName = 'Button';

export const IconButton = forwardRef(({
  icon: Icon,
  size = 'md',
  variant = 'ghost',
  ...props
}, ref) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size="sm"
      style={{
        width: `${sizeMap[size]}px`,
        height: `${sizeMap[size]}px`,
        padding: 0,
        borderRadius: '8px',
      }}
      {...props}
    >
      <Icon size={iconSizeMap[size]} />
    </Button>
  );
});

IconButton.displayName = 'IconButton';
