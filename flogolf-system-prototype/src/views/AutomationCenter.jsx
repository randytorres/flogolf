import React, { useState } from 'react';
import { WorkflowCard } from '../components/automation';
import { Card, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { 
  AutomationIcon,
  PlusIcon,
  ActiveIcon,
  WarningIcon,
  TrendUpIcon,
  SettingsIcon,
  MailIcon,
  StarIcon,
  DollarIcon,
  BellIcon,
  SimBayIcon,
} from '../components/icons';

// Placeholder ActivityIcon for workflow diagram
const ActivityIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

// Enhanced workflow data
const WORKFLOW_DATA = [
  {
    id: 'a1',
    name: 'Membership Activation',
    status: 'active',
    trigger: 'Purchase',
    activeCount: 42,
    lastRun: '2 min ago',
    successRate: 98,
    totalRuns: 1247,
    runTrend: '+12%',
    avgTime: '45s',
    roi: '$28,400',
    steps: [
      { name: 'Welcome Email', completed: true, icon: 'mail' },
      { name: 'Credits Added', completed: true, icon: 'dollar' },
      { name: 'Staff Alert', completed: true, icon: 'bell' },
      { name: 'Complete', completed: true, icon: 'check' },
    ],
  },
  {
    id: 'a2',
    name: 'Lesson Follow-up',
    status: 'active',
    trigger: '24h Post-Lesson',
    activeCount: 18,
    lastRun: '15 min ago',
    successRate: 87,
    totalRuns: 892,
    runTrend: '+5%',
    avgTime: '2m',
    roi: '$15,600',
    steps: [
      { name: 'Feedback Request', completed: true, icon: 'star' },
      { name: 'Results Analysis', completed: false, icon: 'chart' },
      { name: 'Upsell Package', completed: false, icon: 'dollar' },
    ],
  },
  {
    id: 'a3',
    name: 'No-Show Prevention',
    status: 'active',
    trigger: '2h Pre-Booking',
    activeCount: 64,
    lastRun: '5 min ago',
    successRate: 94,
    totalRuns: 3421,
    runTrend: '+8%',
    avgTime: '15s',
    roi: '$42,100',
    steps: [
      { name: 'SMS Reminder', completed: true, icon: 'bell' },
      { name: 'Check-in Link', completed: true, icon: 'sim' },
    ],
  },
  {
    id: 'a4',
    name: 'Renewal Nudge',
    status: 'active',
    trigger: '30 Days to Expiry',
    activeCount: 12,
    lastRun: '1 hour ago',
    successRate: 76,
    totalRuns: 234,
    runTrend: '-3%',
    avgTime: '3 days',
    roi: '$18,200',
    steps: [
      { name: 'Email Sequence', completed: true, icon: 'mail' },
      { name: 'Special Offer', completed: false, icon: 'dollar' },
      { name: 'Final Call', completed: false, icon: 'bell' },
    ],
  },
  {
    id: 'a5',
    name: 'Win-back Campaign',
    status: 'active',
    trigger: '60 Days No Visit',
    activeCount: 85,
    lastRun: '30 min ago',
    successRate: 34,
    totalRuns: 1567,
    runTrend: '+15%',
    avgTime: '7 days',
    roi: '$24,800',
    steps: [
      { name: 'Survey', completed: true, icon: 'star' },
      { name: 'Discount Code', completed: false, icon: 'dollar' },
      { name: 'Personal Outreach', completed: false, icon: 'mail' },
    ],
  },
];

const StepIcon = ({ type, size = 14 }) => {
  const color = 'currentColor';
  switch (type) {
    case 'mail':
      return <MailIcon size={size} color={color} />;
    case 'star':
      return <StarIcon size={size} color={color} />;
    case 'dollar':
      return <DollarIcon size={size} color={color} />;
    case 'bell':
      return <BellIcon size={size} color={color} />;
    case 'sim':
      return <SimBayIcon size={size} color={color} />;
    case 'check':
      return <ActiveIcon size={size} color={color} />;
    case 'chart':
      return <TrendUpIcon size={size} color={color} />;
    default:
      return <ActivityIcon size={size} color={color} />;
  }
};

export default function AutomationCenter({ data }) {
  const [workflows, setWorkflows] = useState(WORKFLOW_DATA);

  const stats = {
    totalActive: workflows.filter(w => w.status === 'active').length,
    totalCustomers: workflows.reduce((sum, w) => sum + w.activeCount, 0),
    avgSuccessRate: Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length),
    totalROI: workflows.reduce((sum, w) => {
      const val = parseInt(w.roi.replace(/[^0-9]/g, ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0),
  };

  const handleToggle = (id) => {
    setWorkflows(prev => 
      prev.map(w => 
        w.id === id 
          ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
          : w
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Automation Center</h1>
          <p className="section-subtitle">
            Workflows that run your business automatically
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" icon={SettingsIcon}>
            Settings
          </Button>
          <Button variant="primary" size="sm" icon={PlusIcon}>
            New Workflow
          </Button>
        </div>
      </div>

      {/* System Health Card */}
      <Card variant="default" padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            color: 'var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ActivityIcon size={24} />
          </div>
          <div>
            <CardTitle style={{ fontSize: 'var(--text-lg)', margin: 0 }}>
              System Health
            </CardTitle>
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}>
              All systems operational
            </p>
          </div>
        </div>

        {/* Health bar */}
        <div style={{
          height: '8px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}>
          <div style={{
            height: '100%',
            width: `${stats.avgSuccessRate}%`,
            background: 'var(--gradient-gold)',
            borderRadius: '4px',
            transition: 'width 1s ease-out',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)',
          }} />
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <span className="mono" style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}>
                {stats.totalActive}
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                marginLeft: '0.5rem',
              }}>
                workflows active
              </span>
            </div>
            <div>
              <span className="mono" style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}>
                {stats.totalCustomers}
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                marginLeft: '0.5rem',
              }}>
                customers in flows
              </span>
            </div>
            <div>
              <span className="mono" style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}>
                0
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                marginLeft: '0.5rem',
              }}>
                errors today
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-success-light)',
            borderRadius: '20px',
          }}>
            <ActiveIcon size={16} color="var(--color-success)" />
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#fff',
            }}>
              {stats.avgSuccessRate}% avg. success rate
            </span>
          </div>
        </div>
      </Card>

      {/* ROI Summary */}
      <Card variant="default" padding="lg" style={{ 
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, var(--color-surface-card) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-gold-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendUpIcon size={24} color="var(--color-gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-secondary)',
            }}>
              Total Automation ROI
            </div>
            <div className="mono" style={{ 
              fontSize: 'var(--text-4xl)', 
              fontWeight: 700,
              color: 'var(--color-gold)',
            }}>
              ${stats.totalROI.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
            }}>
              Last 30 days
            </div>
            <div style={{
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: '#fff',
            }}>
              +23% vs last month
            </div>
          </div>
        </div>
      </Card>

      {/* Workflow List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {workflows.map((workflow, index) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onToggle={handleToggle}
            onDuplicate={(id) => console.log('Duplicate', id)}
            showDetails={index === 0}
            StepIcon={StepIcon}
            style={{
              opacity: 0,
              animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
            }}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
        <Button variant="secondary" size="sm">
          View All Workflows
        </Button>
        <Button variant="ghost" size="sm">
          Automation Reports
        </Button>
      </div>
    </div>
  );
}
