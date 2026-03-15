import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  WarningIcon, 
  UsersIcon, 
  ArrowRightIcon,
} from '../icons';

// FileIcon for invoices
const FileIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const RevenueAtRisk = ({
  amount = '$2,850',
  breakdown = {
    expiringMemberships: 3,
    unpaidInvoices: 3,
    atRiskCustomers: 1,
  },
  onAction,
  className = '',
  style = {},
}) => {
  const totalItems = breakdown.expiringMemberships + breakdown.unpaidInvoices + breakdown.atRiskCustomers;
  const riskLevel = totalItems > 4 ? 'high' : totalItems > 2 ? 'medium' : 'low';
  
  const riskColors = {
    high: { primary: '#ef4444', light: 'rgba(239, 68, 68, 0.1)', gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' },
    medium: { primary: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
    low: { primary: '#22c55e', light: 'rgba(34, 197, 94, 0.1)', gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)' },
  };

  const colors = riskColors[riskLevel];

  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
      style={{
        background: `linear-gradient(135deg, ${colors.light} 0%, var(--color-surface-card) 100%)`,
        border: `1px solid ${colors.primary}30`,
        ...style,
      }}
    >
      <CardHeader style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: colors.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}>
          <WarningIcon size={18} />
        </div>
        <CardTitle style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
          REVENUE AT RISK
        </CardTitle>
      </CardHeader>

      <CardContent style={{ textAlign: 'center' }}>
        {/* Gauge Visualization */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '90px',
          margin: '0 auto 1.5rem',
        }}>
          <svg viewBox="0 0 180 90" style={{ overflow: 'visible' }}>
            <path
              d="M 18 90 A 72 72 0 0 1 162 90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 18 90 A 72 72 0 0 1 162 90"
              fill="none"
              stroke={colors.primary}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(riskLevel === 'high' ? 160 : riskLevel === 'medium' ? 100 : 50)} 226`}
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
            />
            <text
              x="90"
              y="75"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '24px',
                fontWeight: 600,
                fill: 'var(--color-text-primary)',
              }}
            >
              {amount}
            </text>
            <text
              x="90"
              y="55"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: 600,
                fill: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              At Risk Today
            </text>
          </svg>
        </div>

        {/* Breakdown */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          <RiskItem
            icon={UsersIcon}
            count={breakdown.expiringMemberships}
            label="expiring memberships"
            color={colors.primary}
          />
          <RiskItem
            icon={FileIcon}
            count={breakdown.unpaidInvoices}
            label="unpaid invoices"
            color={colors.primary}
          />
          {breakdown.atRiskCustomers > 0 && (
            <RiskItem
              icon={WarningIcon}
              count={breakdown.atRiskCustomers}
              label="at-risk customers"
              color={colors.primary}
            />
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onAction}
            style={{
              background: colors.gradient,
            }}
          >
            Take Action
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RiskItem = ({ icon: Icon, count, label, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: '8px',
    border: `1px solid ${color}20`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Icon size={16} color={color} />
      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
      }}>
        {label}
      </span>
    </div>
    <span className="mono" style={{
      fontSize: 'var(--text-base)',
      fontWeight: 600,
      color: color,
    }}>
      {count}
    </span>
  </div>
);

export default RevenueAtRisk;
