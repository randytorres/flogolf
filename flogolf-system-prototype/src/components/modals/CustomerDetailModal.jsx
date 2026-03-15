import React from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CustomerJourney } from '../customer/CustomerJourney';
import { 
  UsersIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  LocationIcon,
  DollarIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  TargetIcon,
  TrendUpIcon,
  EditIcon,
  FlagIcon,
  SimBayIcon,
  LessonIcon,
  EventsIcon,
  ActiveIcon,
} from '../icons';

const ACTIVITY_ICONS = {
  booking: ClockIcon,
  lesson: LessonIcon,
  league: TrophyIcon,
  event: EventsIcon,
  membership: StarIcon,
  payment: DollarIcon,
};

const ACTIVITY_COLORS = {
  booking: '#1a4725',
  lesson: '#22c55e',
  league: '#d4af37',
  event: '#3b82f6',
  membership: '#d4af37',
  payment: '#22c55e',
};

export const CustomerDetailModal = ({ 
  isOpen, 
  onClose, 
  customer,
  onNavigateToCustomer,
}) => {
  if (!customer) return null;

  const daysSinceLastVisit = customer.lastVisit 
    ? Math.floor((Date.now() - new Date(customer.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header with Profile */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '1.25rem',
          backgroundColor: '#141414',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Avatar */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--gradient-marine)',
            color: 'var(--color-brass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            flexShrink: 0,
          }}>
            {customer.name.charAt(0)}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--color-flomarine)',
                margin: 0,
              }}>
                {customer.name}
              </h2>
              <Badge variant="gold">
                <StarIcon size={10} />
                {customer.status}
              </Badge>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '0.5rem',
            }}>
              <InfoItem icon={MailIcon} value={customer.email} />
              <InfoItem icon={PhoneIcon} value={customer.phone} />
              <InfoItem icon={LocationIcon} value="Saugus" />
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {customer.tags?.map(tag => (
                <Badge key={tag} variant="default" size="sm">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.375rem',
          }}>
            <QuickStat 
              value={`$${customer.lifetimeSpend?.toLocaleString() || 0}`} 
              label="Lifetime Value" 
            />
            <QuickStat 
              value={customer.handicap || 'N/A'} 
              label="Handicap" 
            />
            <QuickStat 
              value={daysSinceLastVisit === 0 ? 'Today' : `${daysSinceLastVisit}d ago`} 
              label="Last Visit"
              isWarning={daysSinceLastVisit > 14}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
        }}>
          <MiniStatCard 
            icon={CalendarIcon} 
            value={customer.visitsThisMonth || 0} 
            label="Visits this month"
            trend={customer.visitsThisMonth >= 4 ? '+20%' : null}
          />
          <MiniStatCard 
            icon={DollarIcon} 
            value={`$${customer.avgSpendPerVisit || 0}`} 
            label="Avg spend/visit"
          />
          <MiniStatCard 
            icon={StarIcon} 
            value={customer.memberSince ? 'Yes' : 'No'} 
            label="Member"
            isPositive={!!customer.memberSince}
          />
          <MiniStatCard 
            icon={TrendUpIcon} 
            value={customer.automationStatus?.includes('Active') ? 'Active' : 'In Flow'} 
            label="Automation"
            isPositive={customer.automationStatus?.includes('Active')}
          />
        </div>

        {/* Customer Journey */}
        {customer.memberSince && (
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-flomarine)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <FlagIcon size={16} color="var(--color-brass)" />
              CUSTOMER LIFECYCLE
            </h3>
            <CustomerJourney
              currentStage={customer.status?.includes('Gold') ? 'member' : 
                           customer.status?.includes('Silver') ? 'member' :
                           customer.status?.includes('Bronze') ? 'member' : 'booking'}
              stagesCompleted={
                customer.status?.includes('Member') ? ['inquiry', 'booking', 'lesson', 'member'] :
                ['inquiry', 'booking']
              }
              startDate={customer.memberSince}
              style={{ padding: '1rem' }}
            />
          </div>
        )}

        {/* Automation Status */}
        <div style={{
          padding: '1rem',
          backgroundColor: customer.automationStatus?.includes('Active') 
            ? 'rgba(34, 197, 94, 0.08)' 
            : customer.automationStatus?.includes('Win-back') || customer.automationStatus?.includes('Risk')
            ? 'rgba(239, 68, 68, 0.08)'
            : 'rgba(245, 158, 11, 0.08)',
          borderRadius: '10px',
          border: `1px solid ${
            customer.automationStatus?.includes('Active') ? 'rgba(34, 197, 94, 0.2)' : 
            customer.automationStatus?.includes('Win-back') || customer.automationStatus?.includes('Risk')
            ? 'rgba(239, 68, 68, 0.2)'
            : 'rgba(245, 158, 11, 0.2)'
          }`,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.25rem',
          }}>
            <TargetIcon size={14} color="var(--color-brass)" />
            <span style={{ 
              fontSize: 'var(--text-xs)', 
              fontWeight: 600, 
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
            }}>
              Automation Status
            </span>
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-flomarine)',
          }}>
            {customer.automationStatus}
          </div>
        </div>

        {/* Golfzon App Status */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: customer.golfzonApp ? 'rgba(34,197,94,0.06)' : 'rgba(59,130,246,0.06)',
          borderRadius: '8px',
          border: `1px solid ${customer.golfzonApp ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)'}`,
          alignItems: 'center',
        }}>
          <SimBayIcon size={18} color={customer.golfzonApp ? '#22c55e' : '#3b82f6'} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-flomarine)' }}>
              Golfzon Global App
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {customer.golfzonApp ? 'Downloaded — profile active' : 'Not downloaded — recommend before session'}
            </div>
          </div>
          <Badge variant={customer.golfzonApp ? 'success' : 'info'} size="sm">
            {customer.golfzonApp ? 'Active' : 'Pending'}
          </Badge>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="secondary" icon={MailIcon}>Send Message</Button>
        <Button variant="primary" icon={EditIcon}>Edit Profile</Button>
      </ModalFooter>
    </Modal>
  );
};

const InfoItem = ({ icon: Icon, value }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  }}>
    <Icon size={11} />
    {value}
  </div>
);

const QuickStat = ({ value, label, isWarning = false }) => (
  <div style={{ textAlign: 'right' }}>
    <div className="mono" style={{
      fontSize: 'var(--text-lg)',
      fontWeight: 600,
      color: isWarning ? 'var(--color-warning)' : 'var(--color-flomarine)',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-muted)',
    }}>
      {label}
    </div>
  </div>
);

const MiniStatCard = ({ icon: Icon, value, label, trend, isPositive }) => (
  <div style={{
    padding: '1rem',
    backgroundColor: '#141414',
    borderRadius: '10px',
    textAlign: 'center',
  }}>
    <Icon size={18} color="var(--color-flomarine)" />
    <div className="mono" style={{
      fontSize: 'var(--text-xl)',
      fontWeight: 600,
      color: isPositive === false ? 'var(--color-danger)' : 'var(--color-flomarine)',
      marginTop: '0.5rem',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-muted)',
      marginTop: '0.25rem',
    }}>
      {label}
    </div>
    {trend && (
      <div style={{
        fontSize: 'var(--text-xs)',
        color: '#fff',
        fontWeight: 500,
        marginTop: '0.25rem',
      }}>
        {trend}
      </div>
    )}
  </div>
);

export default CustomerDetailModal;
