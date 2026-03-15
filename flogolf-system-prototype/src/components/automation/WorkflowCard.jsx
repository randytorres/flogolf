import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  PlayIcon, 
  PauseIcon, 
  CopyIcon, 
  ActiveIcon, 
  ClockIcon,
  AutomationIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DollarIcon,
} from '../icons';

// Default step icon fallback
const DefaultStepIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const WorkflowCard = ({
  workflow,
  onToggle,
  onDuplicate,
  showDetails = false,
  StepIcon = DefaultStepIcon,
  className = '',
  style = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const statusColors = {
    active: 'var(--color-success)',
    paused: 'var(--color-warning)',
    error: 'var(--color-danger)',
  };

  return (
    <Card
      variant="default"
      padding={isExpanded ? 'lg' : 'md'}
      className={className}
      style={{
        borderLeft: `3px solid ${statusColors[workflow.status] || statusColors.active}`,
        ...style,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Status indicator */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: workflow.status === 'active' ? 'var(--color-success-light)' : 'var(--color-surface-elevated)',
          color: workflow.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {workflow.status === 'active' ? (
            <AutomationIcon size={24} />
          ) : (
            <PauseIcon size={24} />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <CardTitle style={{ fontSize: 'var(--text-lg)', margin: 0 }}>
              {workflow.name}
            </CardTitle>
            <Badge 
              variant={workflow.status === 'active' ? 'success' : 'warning'}
              dot={workflow.status === 'active'}
              pulse={workflow.status === 'active'}
            >
              {workflow.status === 'active' ? 'Active' : 'Paused'}
            </Badge>
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
          }}>
            {workflow.activeCount} customers in flow &middot; Last run: {workflow.lastRun}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.25rem',
        }}>
          <div className="mono" style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: '#fff',
          }}>
            {workflow.successRate}%
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
          }}>
            Success rate
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'var(--color-surface-elevated)',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Trigger */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Trigger
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-surface-elevated)',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <ClockIcon size={14} color="var(--color-gold)" />
              {workflow.trigger}
            </div>
          </div>

          {/* Flow diagram */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}>
              Flow
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              {workflow.steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div style={{
                    padding: '0.5rem 0.875rem',
                    backgroundColor: step.completed ? 'var(--color-success-light)' : 'var(--color-surface-elevated)',
                    border: `1px solid ${step.completed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: step.completed ? '#fff' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <StepIcon type={step.icon} size={14} />
                    {step.name}
                  </div>
                  {index < workflow.steps.length - 1 && (
                    <span style={{
                      color: 'var(--color-gold)',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}>
                      &rarr;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Performance metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <MetricBox
              label="Total Runs"
              value={workflow.totalRuns.toLocaleString()}
              trend={workflow.runTrend}
            />
            <MetricBox
              label="Avg. Time"
              value={workflow.avgTime}
            />
            <MetricBox
              label="ROI"
              value={workflow.roi}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
          }}>
            <Button
              variant={workflow.status === 'active' ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onToggle?.(workflow.id)}
              icon={workflow.status === 'active' ? PauseIcon : PlayIcon}
            >
              {workflow.status === 'active' ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate?.(workflow.id)}
              icon={CopyIcon}
            >
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="sm"
            >
              View Logs
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const MetricBox = ({ label, value, trend, prefix = '' }) => (
  <div style={{
    padding: '1rem',
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.06)',
  }}>
    <div style={{
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-muted)',
      marginBottom: '0.25rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {label}
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <span className="mono" style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
      }}>
        {prefix}{value}
      </span>
      {trend && (
        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: trend.startsWith('+') ? '#fff' : '#ef4444',
        }}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default WorkflowCard;
